import React from 'react';
import { AlertCircle, AlertTriangle, Clock, ArrowRight, ShieldX, Wallet } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { formatBDT } from '../../utils/formatters';

interface ActionRequiredWidgetProps {
  onNavigate: (tab: string) => void;
  onOpenQuickReorder?: (medicineName: string) => void;
}

export const ActionRequiredWidget: React.FC<ActionRequiredWidgetProps> = ({ 
  onNavigate,
}) => {
  const { kpis, medicines, customers } = usePharmacy();

  // Find sample low stock medicines for direct action
  const lowStockItems = medicines.filter(m => m.currentStock <= m.minStock).slice(0, 2);
  const overdueCustomers = customers.filter(c => c.dueBalance > 0).slice(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Action Required</h2>
            <p className="text-[11px] text-slate-400">Immediate pharmacy operational priorities</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          {(kpis.expiredCount > 0 ? 1 : 0) + (kpis.expiringSoonCount > 0 ? 1 : 0) + (kpis.lowStockCount > 0 ? 1 : 0) + (kpis.totalCustomerDue > 0 ? 1 : 0)} Priorities
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {/* Expired Stock Alert */}
        {kpis.expiredCount > 0 && (
          <div 
            onClick={() => onNavigate('expiry')}
            className="flex items-center justify-between p-3 rounded-xl bg-red-50/70 border border-red-200/80 hover:bg-red-100/70 cursor-pointer transition group"
          >
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
              <div>
                <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                  <ShieldX className="w-3.5 h-3.5 text-red-600" />
                  <span>{kpis.expiredCount} Batch(es) Expired — Sales Blocked</span>
                </div>
                <p className="text-[11px] text-red-700 mt-0.5">
                  Stock is quarantined from POS cart. Review for supplier return or write-off.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-red-700 group-hover:translate-x-0.5 transition">
              Resolve <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        )}

        {/* Expiring Soon (< 30 days) Alert */}
        {kpis.expiringSoonCount > 0 && (
          <div 
            onClick={() => onNavigate('expiry')}
            className="flex items-center justify-between p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 hover:bg-orange-100/70 cursor-pointer transition group"
          >
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>{kpis.expiringSoonCount} Medicine(s) Expiring Within 30 Days</span>
                </div>
                <p className="text-[11px] text-orange-700 mt-0.5">
                  FEFO engine is prioritizing these at POS. Review batch dispatch.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-orange-700 group-hover:translate-x-0.5 transition">
              View <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {kpis.lowStockCount > 0 && (
          <div 
            onClick={() => onNavigate('purchases')}
            className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 hover:bg-amber-100/70 cursor-pointer transition group"
          >
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{kpis.lowStockCount} Medicines Below Minimum Stock</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  {lowStockItems.map(m => `${m.name} (${m.currentStock} left)`).join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition">
              Create PO <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        )}

        {/* Customer Overdue Alert */}
        {kpis.totalCustomerDue > 0 && (
          <div 
            onClick={() => onNavigate('customers')}
            className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 hover:bg-purple-100/70 cursor-pointer transition group"
          >
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-purple-600" />
                  <span>{formatBDT(kpis.totalCustomerDue)} Total Customer Due Outstanding</span>
                </div>
                <p className="text-[11px] text-purple-700 mt-0.5">
                  {overdueCustomers.map(c => `${c.name}: ${formatBDT(c.dueBalance)}`).join(' • ')}
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-purple-700 group-hover:translate-x-0.5 transition">
              Collect <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
