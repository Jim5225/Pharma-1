import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  MapPin, 
  ShieldCheck, 
  ChevronDown, 
  Check, 
  AlertTriangle,
  Clock,
  ExternalLink,
  Store,
  UserCheck,
  Database,
  Download,
  RotateCcw
} from 'lucide-react';
import { useAuthRole } from '../../context/AuthRoleContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { UserRole } from '../../types';

interface TopHeaderProps {
  onOpenSearch: () => void;
  onNavigate: (tab: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenSearch, onNavigate }) => {
  const { currentRole, setRole, currentBranch, setBranch, branches, userName } = useAuthRole();
  const { notifications, markNotificationAsRead, clearAllNotifications, exportBackupJson, resetToDemoData } = usePharmacy();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showDbMenu, setShowDbMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const roles: { role: UserRole; label: string; desc: string; badgeColor: string }[] = [
    { role: 'owner', label: 'Owner Mode', desc: 'Full access + P&L + Staff + Multi-branch', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
    { role: 'pharmacist', label: 'Pharmacist Mode', desc: 'Sales + Inventory + Batches + Prescriptions', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { role: 'cashier', label: 'Cashier Mode', desc: 'Fast POS Checkout + Customer Dues', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  ];

  const currentRoleDetails = roles.find(r => r.role === currentRole) || roles[1];

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Greeting & Role Indicator */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
            <span>{getGreeting()}, <span className="text-emerald-700 font-extrabold">{userName}</span></span>
            <span className={`hidden md:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${currentRoleDetails.badgeColor}`}>
              {currentRoleDetails.label}
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {currentBranch.name} • {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Middle: Universal Search Bar Trigger */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-400 text-xs transition group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            <span className="text-slate-500">Search medicines, generic, invoices...</span>
          </div>
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="lg:hidden p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Branch Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowBranchMenu(!showBranchMenu);
              setShowRoleMenu(false);
              setShowNotifMenu(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">{currentBranch.code}</span>
            <span className="md:hidden">{currentBranch.code}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showBranchMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Active Branch
              </div>
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBranch(b);
                    setShowBranchMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs flex items-start justify-between hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="font-medium text-slate-800">{b.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{b.address}</div>
                  </div>
                  {currentBranch.id === b.id && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role Switcher (Owner / Pharmacist / Cashier) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowBranchMenu(false);
              setShowNotifMenu(false);
            }}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="capitalize">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Switch User Role Preview
              </div>
              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    setRole(r.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition mb-1 flex items-start justify-between ${
                    currentRole === r.role ? 'bg-emerald-50/80 border border-emerald-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-800">{r.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{r.desc}</div>
                  </div>
                  {currentRole === r.role && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell with Badge & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowRoleMenu(false);
              setShowBranchMenu(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-slate-500" />
                  Notifications ({unreadNotifs.length})
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition text-xs ${n.read ? 'opacity-60' : 'bg-emerald-50/20'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          {n.type === 'critical' && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                          {n.type === 'warning' && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                          {n.type === 'stock' && <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />}
                          {n.title}
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    onNavigate('expiry');
                    setShowNotifMenu(false);
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>View Expiry Center</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Database & Demo Tools */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDbMenu(!showDbMenu);
              setShowRoleMenu(false);
              setShowBranchMenu(false);
              setShowNotifMenu(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="Database & Backup Tools"
          >
            <Database className="w-5 h-5" />
          </button>

          {showDbMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Data & Storage Management
              </div>
              <button
                onClick={() => {
                  exportBackupJson();
                  setShowDbMenu(false);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition flex items-center space-x-2 text-slate-700 font-semibold"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <div>
                  <div>Download Backup (JSON)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Exports full catalog, sales & ledgers</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowDbMenu(false);
                  resetToDemoData();
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-rose-50 transition flex items-center space-x-2 text-rose-700 font-semibold"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <div>
                  <div>Reset to Demo Dataset</div>
                  <div className="text-[10px] text-rose-400 font-normal">Restores initial Square/Beximco data</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
