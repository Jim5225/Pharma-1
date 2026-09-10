import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Pill, 
  MoreHorizontal,
  PackageCheck,
  FileHeart,
  Users,
  BarChart3,
  Receipt,
  Truck,
  AlertOctagon,
  CalendarClock,
  X,
  Camera,
  Search
} from 'lucide-react';
import { useAuthRole } from '../../context/AuthRoleContext';
import { usePharmacy } from '../../context/PharmacyContext';

interface MobileNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenMoreMenu: () => void;
  onOpenPacketScanner?: () => void;
  onOpenSearch?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  activeTab, 
  onNavigate, 
  onOpenMoreMenu,
  onOpenPacketScanner,
  onOpenSearch
}) => {
  const { cart, kpis } = usePharmacy();
  const { canAccess } = useAuthRole();
  const [showDrawer, setShowDrawer] = useState(false);

  const navTo = (tab: string) => {
    onNavigate(tab);
    setShowDrawer(false);
  };

  const moreMenuItems = [
    { id: 'expiry', label: 'Expiry Center (মেয়াদ)', icon: AlertOctagon, badge: kpis.expiredCount > 0 ? `${kpis.expiredCount}` : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'purchases', label: 'Purchases (ক্রয়)', icon: PackageCheck },
    { id: 'prescriptions', label: 'Prescriptions (ব্যবস্থাপত্র)', icon: FileHeart },
    { id: 'customers', label: 'Customers & Due (বাকির খাতা)', icon: Users },
    { id: 'reports', label: 'Reports & P&L (হিসাব-নিকাশ)', icon: BarChart3 },
    { id: 'expenses', label: 'Expenses (দৈনিক খরচ)', icon: Receipt },
    { id: 'suppliers', label: 'Suppliers (কোম্পানি/মহাজন)', icon: Truck },
  ].filter(i => canAccess(i.id));

  return (
    <>
      {/* Mobile Bottom Navigation Bar - Safe area, Glassmorphism & High Contrast */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 z-40 shadow-2xl">
        {/* 1st: POS Sale */}
        <button
          onClick={() => navTo('pos')}
          className={`relative flex flex-col items-center justify-center w-14 py-1 text-[10px] transition active:scale-95 ${
            activeTab === 'pos' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full border border-slate-900 animate-pulse">
                {cart.length}
              </span>
            )}
          </div>
          <span>POS সেল</span>
        </button>

        {/* 2nd: Stock / Medicine Catalog */}
        <button
          onClick={() => navTo('inventory')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] transition active:scale-95 ${
            activeTab === 'inventory' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill className="w-5 h-5 mb-0.5" />
          <span>ক্যাটালগ</span>
        </button>

        {/* Center Floating OCR Camera Button */}
        {onOpenPacketScanner && (
          <button
            onClick={onOpenPacketScanner}
            className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 w-12 h-12 rounded-2xl shadow-lg shadow-amber-500/40 active:scale-90 transition transform"
            title="ওষুধের প্যাকেট স্ক্যান করুন"
          >
            <Camera className="w-6 h-6" />
          </button>
        )}

        {/* 4th: Dashboard & Analytics */}
        <button
          onClick={() => navTo('dashboard')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] transition active:scale-95 ${
            activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>ড্যাশবোর্ড</span>
        </button>

        {/* 5th: More Drawer */}
        <button
          onClick={() => setShowDrawer(true)}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] transition active:scale-95 ${
            showDrawer ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>মেনু</span>
        </button>
      </nav>

      {/* Mobile Slide-Up Full Menu Drawer */}
      {showDrawer && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border-t border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Pill className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">ফার্মেসি কন্ট্রোল মেনু</h3>
                  <p className="text-[11px] text-slate-500">সবগুলো অপশন এবং টুলস</p>
                </div>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Mobile Action Shortcuts */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {onOpenSearch && (
                <button
                  onClick={() => { setShowDrawer(false); onOpenSearch(); }}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center gap-2 transition"
                >
                  <Search className="w-4 h-4 text-emerald-600" />
                  <span>ওষুধ সার্চ (Ctrl+K)</span>
                </button>
              )}
              <button
                onClick={() => { setShowDrawer(false); onOpenMoreMenu(); }}
                className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl flex items-center gap-2 transition border border-amber-200"
              >
                <CalendarClock className="w-4 h-4 text-amber-600" />
                <span>দৈনিক হিসাব ক্লোজিং</span>
              </button>
            </div>

            {/* All Menu Items */}
            <div className="divide-y divide-slate-100">
              {moreMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navTo(item.id)}
                    className={`w-full py-3 px-3 flex items-center justify-between text-xs rounded-xl transition ${
                      isActive ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
