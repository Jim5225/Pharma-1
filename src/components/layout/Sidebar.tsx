import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Pill, 
  PackageCheck, 
  FileHeart, 
  Users, 
  Truck, 
  Receipt, 
  BarChart3, 
  CalendarClock, 
  Clock, 
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { useAuthRole } from '../../context/AuthRoleContext';
import { usePharmacy } from '../../context/PharmacyContext';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenClosingModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, onOpenClosingModal }) => {
  const { canAccess, currentRole } = useAuthRole();
  const { kpis, prescriptions } = usePharmacy();

  const pendingRxCount = prescriptions.filter(p => p.status === 'pending').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'pos',
      label: 'POS / Sales',
      icon: ShoppingCart,
      badge: 'F2',
      badgeColor: 'bg-emerald-500 text-white font-mono',
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Pill,
      badge: kpis.lowStockCount > 0 ? `${kpis.lowStockCount} Low` : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'expiry',
      label: 'Expiry Center',
      icon: AlertOctagon,
      badge: kpis.expiredCount > 0 ? `${kpis.expiredCount} Exp` : null,
      badgeColor: 'bg-rose-600 text-white font-bold animate-pulse',
    },
    {
      id: 'purchases',
      label: 'Purchases',
      icon: PackageCheck,
      badge: null,
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions',
      icon: FileHeart,
      badge: pendingRxCount > 0 ? `${pendingRxCount}` : null,
      badgeColor: 'bg-blue-500 text-white font-bold',
    },
    {
      id: 'customers',
      label: 'Customers & Due',
      icon: Users,
      badge: null,
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      icon: Truck,
      badge: null,
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: Receipt,
      badge: null,
    },
    {
      id: 'reports',
      label: 'Reports & P&L',
      icon: BarChart3,
      badge: null,
    },
  ];

  // Filter according to user role permissions
  const visibleMenuItems = menuItems.filter(item => canAccess(item.id));

  return (
    <aside className="w-60 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-emerald-600/30">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <div className="text-white font-extrabold text-base tracking-tight flex items-center gap-1.5">
              <span>PharmaCare</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 bg-emerald-600/30 text-emerald-400 rounded">
                SaaS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Smart Retail Rx Platform</div>
          </div>
        </div>
      </div>

      {/* Quick POS Trigger in Sidebar */}
      <div className="p-3">
        <button
          onClick={() => onNavigate('pos')}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-700/30 transition transform active:scale-98"
        >
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>New Sale (F2)</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded font-mono">⚡ Fast</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Operations
        </div>
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Closing Action & Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/30 space-y-2">
        <button
          onClick={onOpenClosingModal}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700/60"
        >
          <div className="flex items-center space-x-2">
            <CalendarClock className="w-4 h-4 text-amber-400" />
            <span>Daily Closing</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">EOD</span>
        </button>

        <div className="px-2 pt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            System Live
          </span>
          <span className="capitalize text-slate-400 font-medium">v1.0 (BD)</span>
        </div>
      </div>
    </aside>
  );
};
