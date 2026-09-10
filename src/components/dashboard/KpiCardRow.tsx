import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ArrowUpRight,
  ShieldAlert,
  Wallet
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { formatBDT } from '../../utils/formatters';

interface KpiCardRowProps {
  onNavigate: (tab: string) => void;
}

export const KpiCardRow: React.FC<KpiCardRowProps> = ({ onNavigate }) => {
  const { kpis } = usePharmacy();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* Today's Sales */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Today's Sales</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {formatBDT(kpis.todaySales)}
        </div>
        <div className="mt-1.5 flex items-center text-[11px] text-emerald-600 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
          <span>+12.4% vs yesterday</span>
        </div>
      </div>

      {/* Today's Profit */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Gross Profit</span>
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {formatBDT(kpis.todayProfit)}
        </div>
        <div className="mt-1.5 flex items-center text-[11px] text-teal-600 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
          <span>+15.2% margin</span>
        </div>
      </div>

      {/* Total Invoices / Orders */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Orders Today</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {kpis.todayOrders}
        </div>
        <div className="mt-1.5 text-[11px] text-slate-500 font-medium">
          Avg. {formatBDT(kpis.todayOrders > 0 ? kpis.todaySales / kpis.todayOrders : 0)} / bill
        </div>
      </div>

      {/* Low Stock Medicines */}
      <div 
        onClick={() => onNavigate('inventory')}
        className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition cursor-pointer group bg-gradient-to-br from-white to-amber-50/30"
      >
        <div className="flex items-center justify-between text-amber-700 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Low Stock</span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-amber-900 tracking-tight">
          {kpis.lowStockCount}
        </div>
        <div className="mt-1.5 text-[11px] text-amber-700 font-medium group-hover:underline">
          Reorder suggested →
        </div>
      </div>

      {/* Expiring Soon */}
      <div 
        onClick={() => onNavigate('expiry')}
        className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-xs hover:shadow-md transition cursor-pointer group bg-gradient-to-br from-white to-rose-50/30"
      >
        <div className="flex items-center justify-between text-rose-700 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Expiring &lt;30d</span>
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-rose-900 tracking-tight">
          {kpis.expiringSoonCount}
        </div>
        <div className="mt-1.5 text-[11px] text-rose-600 font-medium group-hover:underline">
          {kpis.expiredCount > 0 ? `${kpis.expiredCount} already expired` : 'Prioritize sales →'}
        </div>
      </div>

      {/* Customer Dues */}
      <div 
        onClick={() => onNavigate('customers')}
        className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Customer Due</span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {formatBDT(kpis.totalCustomerDue)}
        </div>
        <div className="mt-1.5 text-[11px] text-purple-600 font-medium group-hover:underline">
          Manage ledgers →
        </div>
      </div>
    </div>
  );
};
