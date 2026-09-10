import React, { useState } from 'react';
import { ShoppingCart, Search, Eye, Download, Calendar, ArrowRight, RotateCcw } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Sale } from '../../types';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import { ReturnModal } from './ReturnModal';

interface SalesListProps {
  onViewInvoice: (sale: Sale) => void;
  onNavigate: (tab: string) => void;
}

export const SalesList: React.FC<SalesListProps> = ({ onViewInvoice, onNavigate }) => {
  const { sales, returns } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [returnTargetSale, setReturnTargetSale] = useState<Sale | null>(null);

  const filteredSales = sales.filter(s =>
    !searchQuery ||
    s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.items.some(i => i.medicine.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            <span>Sales Invoices & Counter Orders</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time transaction log, thermal reprint, and cashier audit trail
          </p>
        </div>

        <button
          onClick={() => onNavigate('pos')}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>New Sale (F2)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, customer, or medicine..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Invoices: <strong className="text-slate-900">{filteredSales.length}</strong> • Revenue: <strong className="text-emerald-700">{formatBDT(totalSalesRevenue)}</strong>
        </div>
      </div>

      {/* Sales Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Medicines Dispensed</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5 text-right">Invoice Total</th>
                <th className="px-5 py-3.5 text-right">Profit</th>
                <th className="px-5 py-3.5 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{s.invoiceNumber}</td>
                  <td className="px-5 py-3.5 text-slate-500">{formatDateTime(s.dateTime)}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-800">{s.customerName}</div>
                    {s.customerPhone && <div className="text-[10px] text-slate-400">{s.customerPhone}</div>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    <div className="font-medium text-slate-900">{s.items.length} product(s)</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs">
                      {s.items.map(i => `${i.medicine.name} (x${i.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {s.paymentMethod}
                    </span>
                    {s.dueAmount > 0 && (
                      <span className="block text-[10px] font-bold text-amber-700 mt-0.5">
                        Due: {formatBDT(s.dueAmount)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right font-extrabold text-slate-900 font-mono">
                    {formatBDT(s.total, true)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-emerald-700 font-mono">
                    +{formatBDT(s.profit, true)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onViewInvoice(s)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Print / View Thermal Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setReturnTargetSale(s)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="Process Return / Refund"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return & Refund Modal */}
      <ReturnModal
        sale={returnTargetSale}
        onClose={() => setReturnTargetSale(null)}
      />
    </div>
  );
};
