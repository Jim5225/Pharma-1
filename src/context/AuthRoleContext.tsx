import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Branch } from '../types';
import { INITIAL_BRANCHES } from '../data/mockData';

interface AuthRoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentBranch: Branch;
  setBranch: (branch: Branch) => void;
  branches: Branch[];
  userName: string;
  canAccess: (module: string) => boolean;
}

const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

export const AuthRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('pharmacare_role') as UserRole) || 'pharmacist';
  });

  const [currentBranch, setCurrentBranch] = useState<Branch>(() => {
    const saved = localStorage.getItem('pharmacare_branch');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_BRANCHES[0];
  });

  useEffect(() => {
    localStorage.setItem('pharmacare_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('pharmacare_branch', JSON.stringify(currentBranch));
  }, [currentBranch]);

  const userName = currentRole === 'owner' 
    ? 'Dr. K. Rahman (Owner)' 
    : currentRole === 'pharmacist' 
      ? 'Rahim Ahmed, B.Pharm' 
      : 'Tanvir Hossain (Cashier)';

  // Role permissions per UX specification
  const canAccess = (module: string): boolean => {
    if (currentRole === 'owner') return true;

    if (currentRole === 'pharmacist') {
      return ['dashboard', 'pos', 'inventory', 'prescriptions', 'customers', 'expiry', 'closing'].includes(module);
    }

    if (currentRole === 'cashier') {
      return ['dashboard', 'pos', 'customers', 'closing'].includes(module);
    }

    return false;
  };

  return (
    <AuthRoleContext.Provider
      value={{
        currentRole,
        setRole: setCurrentRole,
        currentBranch,
        setBranch: setCurrentBranch,
        branches: INITIAL_BRANCHES,
        userName,
        canAccess,
      }}
    >
      {children}
    </AuthRoleContext.Provider>
  );
};

export const useAuthRole = () => {
  const context = useContext(AuthRoleContext);
  if (!context) {
    throw new Error('useAuthRole must be used within an AuthRoleProvider');
  }
  return context;
};
