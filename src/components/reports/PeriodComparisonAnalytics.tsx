import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { formatBDT } from '../../utils/formatters';

export const PeriodComparisonAnalytics: React.FC = () => {
  const { kpis, sales } = usePharmacy();
  const [selectedPeriod, setSelectedPeriod] = useState<'today_vs_yesterday' | 'week_vs_last_week' | 'month_vs_last_month'>('today_vs_yesterday');

  // Simulated structured comparative benchmarks
  const comparisonData = {
    today_vs_yesterday: {
      periodName: 'আজকের বনাম গতকাল (Today vs. Yesterday)',
      currentLabel: 'আজকের দিন',
      previousLabel: 'গতকাল',
      currentSales: kpis.todaySales || 24560,
      previousSales: 21850,
      currentProfit: kpis.todayProfit || 7840,
      previousProfit: 6820,
      currentOrders: kpis.todayOrders || 48,
      previousOrders: 42,
      chartData: [
        { time: '10 AM', current: 3200, previous: 2800 },
        { time: '12 PM', current: 5400, previous: 4600 },
        { time: '03 PM', current: 4100, previous: 3900 },
        { time: '06 PM', current: 6800, previous: 5900 },
        { time: '09 PM', current: 5060, previous: 4650 },
      ]
    },
    week_vs_last_week: {
      periodName: 'এই সপ্তাহ বনাম গত সপ্তাহ (This Week vs. Last Week)',
      currentLabel: 'এই সপ্তাহ',
      previousLabel: 'গত সপ্তাহ',
      currentSales: 162400,
      previousSales: 144500,
      currentProfit: 48720,
      previousProfit: 41900,
      currentOrders: 312,
      previousOrders: 280,
      chartData: [
        { time: 'শনি (Sat)', current: 22400, previous: 19800 },
        { time: 'রবি (Sun)', current: 24100, previous: 21500 },
        { time: 'সোম (Mon)', current: 21800, previous: 20100 },
        { time: 'মঙ্গল (Tue)', current: 25400, previous: 22900 },
        { time: 'বুধ (Wed)', current: 23200, previous: 21400 },
        { time: 'বৃহঃ (Thu)', current: 26900, previous: 23800 },
        { time: 'শুক্র (Fri)', current: 18600, previous: 15000 },
      ]
    },
    month_vs_last_month: {
      periodName: 'এই মাস বনাম গত মাস (This Month vs. Last Month)',
      currentLabel: 'চলতি মাস (সেপ্টেম্বর)',
      previousLabel: 'গত মাস (আগস্ট)',
      currentSales: kpis.monthRevenue || 645000,
      previousSales: 580000,
      currentProfit: kpis.monthGrossProfit || 193500,
      previousProfit: 168200,
      currentOrders: 1240,
      previousOrders: 1110,
      chartData: [
        { time: 'সপ্তাহ ১', current: 155000, previous: 140000 },
        { time: 'সপ্তাহ ২', current: 168000, previous: 145000 },
        { time: 'সপ্তাহ ৩', current: 162000, previous: 148000 },
        { time: 'সপ্তাহ ৪', current: 160000, previous: 147000 },
      ]
    }
  };

  const currentConfig = comparisonData[selectedPeriod];

  // Percentage Calculations
  const salesDiff = currentConfig.currentSales - currentConfig.previousSales;
  const salesPercent = ((salesDiff / currentConfig.previousSales) * 100).toFixed(1);
  const isSalesUp = salesDiff >= 0;

  const profitDiff = currentConfig.currentProfit - currentConfig.previousProfit;
  const profitPercent = ((profitDiff / currentConfig.previousProfit) * 100).toFixed(1);
  const isProfitUp = profitDiff >= 0;

  const ordersDiff = currentConfig.currentOrders - currentConfig.previousOrders;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Top Controls with Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                বিক্রি ও লাভ তুলনামূলক অ্যানালিটিক্স (Sales & Profit Comparison)
              </h3>
              <p className="text-xs text-slate-400">
                গতদিন, গত সপ্তাহ অথবা গত মাসের তুলনায় ফার্মেসির অগ্রগতি বিশ্লেষণ
              </p>
            </div>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-600 hidden sm:inline">তুলনা সিলেক্ট করুন:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-600 focus:bg-white shadow-2xs cursor-pointer"
          >
            <option value="today_vs_yesterday">আজকের দিন বনাম গতকাল (Today vs Yesterday)</option>
            <option value="week_vs_last_week">এই সপ্তাহ বনাম গত সপ্তাহ (This Week vs Last Week)</option>
            <option value="month_vs_last_month">এই মাস বনাম গত মাস (This Month vs Last Month)</option>
          </select>
        </div>
      </div>

      {/* KPI Comparison Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sales Comparison Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>মোট বিক্রি (Total Sales)</span>
            <span className={`inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded-full ${
              isSalesUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isSalesUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {salesPercent}%
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
            {formatBDT(currentConfig.currentSales)}
          </div>

          <div className="pt-2 border-t border-emerald-100 text-xs text-slate-500 flex justify-between">
            <span>{currentConfig.previousLabel}: <strong>{formatBDT(currentConfig.previousSales)}</strong></span>
            <span className={`font-bold ${isSalesUp ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isSalesUp ? `+${formatBDT(salesDiff)}` : `-${formatBDT(Math.abs(salesDiff))}`}
            </span>
          </div>
        </div>

        {/* Total Profit Comparison Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/60 to-white border border-teal-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>মোট লাভ / প্রফিট (Total Profit)</span>
            <span className={`inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded-full ${
              isProfitUp ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isProfitUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {profitPercent}%
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-teal-900 font-sans tracking-tight">
            {formatBDT(currentConfig.currentProfit)}
          </div>

          <div className="pt-2 border-t border-teal-100 text-xs text-slate-500 flex justify-between">
            <span>{currentConfig.previousLabel}: <strong>{formatBDT(currentConfig.previousProfit)}</strong></span>
            <span className={`font-bold ${isProfitUp ? 'text-teal-700' : 'text-rose-700'}`}>
              {isProfitUp ? `+${formatBDT(profitDiff)}` : `-${formatBDT(Math.abs(profitDiff))}`}
            </span>
          </div>
        </div>

        {/* Orders / Invoices Footfall */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 to-white border border-blue-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>মোট কাস্টমার / অর্ডার</span>
            <span className="inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              +{ordersDiff} কাস্টমার
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
            {currentConfig.currentOrders}
          </div>

          <div className="pt-2 border-t border-blue-100 text-xs text-slate-500 flex justify-between">
            <span>{currentConfig.previousLabel}: <strong>{currentConfig.previousOrders}</strong></span>
            <span className="font-bold text-blue-700">গড় {formatBDT(currentConfig.currentSales / currentConfig.currentOrders)}/বিল</span>
          </div>
        </div>
      </div>

      {/* Comparative Visual Bar Chart */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
            {currentConfig.periodName} - তুলনামূলক গ্রাফ
          </span>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600" />
              <span className="font-medium text-slate-700">{currentConfig.currentLabel}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-slate-300" />
              <span className="font-medium text-slate-500">{currentConfig.previousLabel}</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentConfig.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `৳${val >= 1000 ? (val/1000) + 'k' : val}`} />
              <Tooltip 
                formatter={(val: any) => [`৳${Number(val).toLocaleString()}`, '']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
              <Bar dataKey="current" fill="#059669" radius={[6, 6, 0, 0]} name={currentConfig.currentLabel} />
              <Bar dataKey="previous" fill="#cbd5e1" radius={[6, 6, 0, 0]} name={currentConfig.previousLabel} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
