import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  Layers, 
  Download, 
  Calendar,
  PieChart,
  ArrowUpRight,
  Printer
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { formatBDT } from '../../utils/formatters';

export const ReportsDashboard: React.FC = () => {
  const { kpis, sales, expenses, medicines } = usePharmacy();
  const [dateRange, setDateRange] = useState('month');

  // Total inventory valuation
  const totalStockUnits = medicines.reduce((sum, m) => sum + m.currentStock, 0);
  const totalCostValuation = medicines.reduce((sum, m) => sum + (m.currentStock * m.purchasePrice), 0);
  const totalRetailValuation = medicines.reduce((sum, m) => sum + (m.currentStock * m.sellingPrice), 0);
  const potentialGrossMargin = totalRetailValuation - totalCostValuation;

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,InvoiceNumber,Date,Customer,Total,Profit,PaymentMethod\n";
    sales.forEach(s => {
      csvContent += `${s.invoiceNumber},${s.dateTime},${s.customerName},${s.total},${s.profit},${s.paymentMethod}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pharmacare-sales-report-${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Financial Statements & Business Analytics</span>
          </h2>
          <p className="text-xs text-slate-500">
            Profit & Loss (P&L), Cost of Goods Sold (COGS), and Inventory Valuation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
          >
            <option value="today">Today's Trading</option>
            <option value="week">This Week</option>
            <option value="month">This Month (September 2026)</option>
            <option value="year">Financial Year 2026</option>
          </select>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* P&L Statement (Executive Summary) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Profit & Loss (P&L) Statement</h3>
              <p className="text-[11px] text-slate-400">Standard accounting formula: Net Profit = (Revenue − COGS) − Expenses</p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            Currency: BDT (৳)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Revenue */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Sales Revenue</span>
            <div className="text-xl font-black text-slate-900 mt-1">{formatBDT(kpis.monthRevenue)}</div>
            <span className="text-[11px] text-emerald-600 font-medium">100% Topline</span>
          </div>

          {/* COGS */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Cost of Goods Sold (COGS)</span>
            <div className="text-xl font-black text-slate-700 mt-1">{formatBDT(kpis.monthCOGS)}</div>
            <span className="text-[11px] text-slate-400 font-medium">Inventory purchase cost</span>
          </div>

          {/* Gross Profit */}
          <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200">
            <span className="text-[10px] uppercase font-bold text-teal-800">Gross Profit (Margin)</span>
            <div className="text-xl font-black text-teal-900 mt-1">{formatBDT(kpis.monthGrossProfit)}</div>
            <span className="text-[11px] text-teal-700 font-medium">
              {kpis.monthRevenue > 0 ? ((kpis.monthGrossProfit / kpis.monthRevenue) * 100).toFixed(1) : 0}% margin
            </span>
          </div>

          {/* Operating Expenses */}
          <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200">
            <span className="text-[10px] uppercase font-bold text-rose-800">Operating Expenses</span>
            <div className="text-xl font-black text-rose-900 mt-1">{formatBDT(kpis.monthExpenses)}</div>
            <span className="text-[11px] text-rose-700 font-medium">Rent, salaries, bills</span>
          </div>

          {/* Net Profit */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Net Profit (Bottomline)</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{formatBDT(kpis.monthNetProfit)}</div>
            <span className="text-[11px] text-emerald-700 font-bold">Net Business Take</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Inventory Valuation & Operating Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Valuation Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Current Inventory Asset Valuation</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Active Formulations in Master:</span>
              <span className="font-bold text-slate-900">{medicines.length} SKUs</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Physical Units on Shelves:</span>
              <span className="font-bold text-slate-900 font-mono">{totalStockUnits.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Cost Valuation (Purchase Price basis):</span>
              <span className="font-extrabold text-slate-900 text-sm">{formatBDT(totalCostValuation)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Retail Sales Valuation (MRP basis):</span>
              <span className="font-extrabold text-emerald-700 text-sm">{formatBDT(totalRetailValuation)}</span>
            </div>
            <div className="flex justify-between py-2 bg-emerald-50/60 px-3 rounded-xl">
              <span className="font-bold text-emerald-900">Unrealized Gross Margin in Stock:</span>
              <span className="font-black text-emerald-800 font-mono">{formatBDT(potentialGrossMargin)}</span>
            </div>
          </div>
        </div>

        {/* Operating Expenses Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Operating Expenses Breakdown</h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {expenses.map(exp => (
              <div key={exp.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{exp.category}</span>
                  <p className="text-[11px] text-slate-400">{exp.note}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-mono">{formatBDT(exp.amount)}</span>
                  <span className="text-[10px] text-slate-400 block">{exp.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
