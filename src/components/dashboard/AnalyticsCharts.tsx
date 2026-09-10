import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Award, Clock, ArrowRight, Eye } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { formatBDT, formatTime } from '../../utils/formatters';
import { Sale } from '../../types';

interface AnalyticsChartsProps {
  onNavigate: (tab: string) => void;
  onViewInvoice: (sale: Sale) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ onNavigate, onViewInvoice }) => {
  const { sales } = usePharmacy();

  // Simulated 7-day trend data
  const chartData = [
    { day: 'Sat', sales: 18400, profit: 4200 },
    { day: 'Sun', sales: 22100, profit: 5800 },
    { day: 'Mon', sales: 19800, profit: 4900 },
    { day: 'Tue', sales: 25400, profit: 6800 },
    { day: 'Wed', sales: 23200, profit: 6100 },
    { day: 'Thu', sales: 28900, profit: 7900 },
    { day: 'Today', sales: 24560, profit: 7840 },
  ];

  // Top selling medicines ranking
  const topMedicines = [
    { rank: 1, name: 'Napa 500mg', generic: 'Paracetamol', unitsSold: 340, revenue: 408, brand: 'Beximco' },
    { rank: 2, name: 'Seclo 20mg', generic: 'Omeprazole', unitsSold: 180, revenue: 1080, brand: 'Square' },
    { rank: 3, name: 'Sergel 20mg', generic: 'Esomeprazole', unitsSold: 140, revenue: 980, brand: 'Incepta' },
    { rank: 4, name: 'Napa Extra', generic: 'Paracetamol + Caff.', unitsSold: 120, revenue: 300, brand: 'Beximco' },
    { rank: 5, name: 'Zimax 500mg', generic: 'Azithromycin', unitsSold: 28, revenue: 980, brand: 'Beximco' },
  ];

  const recentSales = sales.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 2-Column: Sales Trend & Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales & Profit Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Weekly Sales & Profit Trend</h2>
              <p className="text-[11px] text-slate-400">Daily revenue compared with gross margins</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 font-medium">Sales</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span className="text-slate-600 font-medium">Profit</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `৳${val / 1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" name="Sales Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#profitGrad)" name="Gross Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Top Selling Medicines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Top Dispensed Items</h2>
              </div>
              <span className="text-[11px] text-slate-400">This Week</span>
            </div>

            <div className="divide-y divide-slate-100">
              {topMedicines.map(item => (
                <div key={item.rank} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      item.rank === 1 ? 'bg-amber-100 text-amber-800' :
                      item.rank === 2 ? 'bg-slate-200 text-slate-800' :
                      item.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.rank}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.brand} • {item.generic}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{formatBDT(item.revenue)}</div>
                    <div className="text-[10px] text-slate-400">{item.unitsSold} units</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('inventory')}
            className="w-full mt-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl transition flex items-center justify-center gap-1"
          >
            <span>Full Inventory Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Recent POS Counter Sales</h2>
          </div>
          <button
            onClick={() => onNavigate('sales')}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            View All Sales <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Invoice #</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3 font-semibold text-slate-900">{sale.invoiceNumber}</td>
                  <td className="px-5 py-3 text-slate-500">{formatTime(sale.dateTime)}</td>
                  <td className="px-5 py-3 font-medium text-slate-800">{sale.customerName}</td>
                  <td className="px-5 py-3 text-slate-500">{sale.items.length} medicines</td>
                  <td className="px-5 py-3">
                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-slate-900">
                    {formatBDT(sale.total, true)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => onViewInvoice(sale)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Print or View Receipt"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
