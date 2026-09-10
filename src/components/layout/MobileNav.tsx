import React from 'react';
import { LayoutDashboard, ShoppingCart, Pill, MoreHorizontal } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenMoreMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onNavigate, onOpenMoreMenu }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 z-40">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] ${
          activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onNavigate('pos')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] ${
          activeTab === 'pos' ? 'text-emerald-400 font-bold' : 'text-slate-400'
        }`}
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
        </div>
        <span>Sale</span>
      </button>

      <button
        onClick={() => onNavigate('inventory')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] ${
          activeTab === 'inventory' ? 'text-emerald-400 font-bold' : 'text-slate-400'
        }`}
      >
        <Pill className="w-5 h-5 mb-0.5" />
        <span>Stock</span>
      </button>

      <button
        onClick={onOpenMoreMenu}
        className="flex flex-col items-center justify-center w-14 py-1 text-[10px] text-slate-400 hover:text-white"
      >
        <MoreHorizontal className="w-5 h-5 mb-0.5" />
        <span>More</span>
      </button>
    </nav>
  );
};
