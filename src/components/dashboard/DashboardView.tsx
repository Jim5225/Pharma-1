import React from 'react';
import { 
  ShoppingCart, 
  Barcode, 
  PlusCircle, 
  PackagePlus, 
  UserPlus, 
  BarChart2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { KpiCardRow } from './KpiCardRow';
import { ActionRequiredWidget } from './ActionRequiredWidget';
import { AnalyticsCharts } from './AnalyticsCharts';
import { PeriodComparisonAnalytics } from '../reports/PeriodComparisonAnalytics';
import { Sale } from '../../types';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenAddMedicine: () => void;
  onOpenAddCustomer: () => void;
  onOpenNewPurchase: () => void;
  onOpenBarcodeModal: () => void;
  onOpenPacketScanner: () => void;
  onViewInvoice: (sale: Sale) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenAddMedicine,
  onOpenAddCustomer,
  onOpenNewPurchase,
  onOpenBarcodeModal,
  onOpenPacketScanner,
  onViewInvoice,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Quick Action Bar — Prominent CTAs */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 rounded-3xl shadow-lg shadow-emerald-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-600/50 text-emerald-200 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Action Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Pharmacy Command Center</h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
            Fast billing counter, FEFO inventory automation, and operational alerts.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenPacketScanner}
            className="flex items-center space-x-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95 animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-emerald-950" />
            <span>📸 প্যাকেট স্ক্যানার (AI OCR)</span>
          </button>

          <button
            onClick={() => onNavigate('pos')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span>New Sale (F2)</span>
          </button>

          <button
            onClick={onOpenBarcodeModal}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs sm:text-sm border border-emerald-500/50 transition"
          >
            <Barcode className="w-4 h-4" />
            <span>Scan Barcode (F4)</span>
          </button>

          <button
            onClick={onOpenAddMedicine}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs sm:text-sm border border-emerald-500/50 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Medicine</span>
          </button>

          <button
            onClick={onOpenNewPurchase}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs sm:text-sm border border-emerald-500/50 transition"
          >
            <PackagePlus className="w-4 h-4" />
            <span>+ Purchase</span>
          </button>

          <button
            onClick={onOpenAddCustomer}
            className="flex items-center space-x-2 px-3 py-2.5 bg-emerald-600/40 hover:bg-emerald-600/60 text-white font-semibold rounded-xl text-xs sm:text-sm border border-emerald-500/40 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Customer</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCardRow onNavigate={onNavigate} />

      {/* Period Comparison Analytics (Today vs Yesterday, This Week vs Last Week, This Month vs Last Month) */}
      <PeriodComparisonAnalytics />

      {/* Action Required Priority Stack */}
      <ActionRequiredWidget onNavigate={onNavigate} />

      {/* Analytics & Real-time Operations */}
      <AnalyticsCharts onNavigate={onNavigate} onViewInvoice={onViewInvoice} />
    </div>
  );
};
