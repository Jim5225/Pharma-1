import React, { useState } from 'react';
import { 
  Pill, 
  X, 
  Barcode, 
  Calendar, 
  DollarSign, 
  Layers, 
  Clock, 
  CheckCircle, 
  ShieldAlert,
  PlusCircle,
  Truck
} from 'lucide-react';
import { Medicine, Batch } from '../../types';
import { formatBDT, formatDate, getDaysUntilExpiry, getFEFOBatches } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { usePharmacy } from '../../context/PharmacyContext';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onOpenAddBatch: (medicineId: string) => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  onClose,
  onOpenAddBatch,
}) => {
  const { writeOffExpiredBatch } = usePharmacy();
  const [activeTab, setActiveTab] = useState<'overview' | 'batches' | 'history'>('overview');

  if (!medicine) return null;

  const sortedBatches = getFEFOBatches(medicine.batches);
  const earliestBatch = sortedBatches.find(b => getDaysUntilExpiry(b.expiryDate) > 0) || sortedBatches[0];
  const totalStockValue = medicine.currentStock * medicine.purchasePrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg tracking-tight">{medicine.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-mono font-bold">
                  {medicine.strength}
                </span>
                <span className="text-xs text-slate-400 font-medium">{medicine.dosageForm}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generic: <span className="text-white font-medium">{medicine.genericName}</span> • Brand: {medicine.brand} ({medicine.manufacturer})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="px-6 border-b border-slate-100 flex gap-6 text-xs font-bold text-slate-500 bg-slate-50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'overview' ? 'border-emerald-600 text-emerald-700' : 'border-transparent hover:text-slate-800'
            }`}
          >
            Overview & Pricing
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'batches' ? 'border-emerald-600 text-emerald-700' : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span>Batches & FEFO</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {medicine.batches.length}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Stock</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{medicine.currentStock}</div>
                  <span className="text-[11px] text-slate-500 font-medium">{medicine.unit}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Selling Price</span>
                  <div className="text-xl font-black text-emerald-700 mt-1">{formatBDT(medicine.sellingPrice, true)}</div>
                  <span className="text-[11px] text-slate-500">MRP: {formatBDT(medicine.mrp, true)}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Cost Value</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{formatBDT(totalStockValue)}</div>
                  <span className="text-[11px] text-slate-500">Buy: {formatBDT(medicine.purchasePrice, true)}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Next Expiry</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {earliestBatch ? formatDate(earliestBatch.expiryDate) : 'N/A'}
                  </div>
                  {earliestBatch && (
                    <span className="text-[10px] text-slate-500">
                      ({getDaysUntilExpiry(earliestBatch.expiryDate)} days left)
                    </span>
                  )}
                </div>
              </div>

              {/* Specs Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Product Identity</h4>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Barcode / EAN:</span>
                    <span className="font-mono font-bold text-slate-800">{medicine.barcode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">SKU Code:</span>
                    <span className="font-mono font-semibold text-slate-800">{medicine.sku}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Therapeutic Category:</span>
                    <span className="font-medium text-slate-800">{medicine.category}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Packaging Unit:</span>
                    <span className="font-medium text-slate-800">{medicine.unit}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Automated Inventory Limits</h4>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Safety Min Stock:</span>
                    <span className="font-bold text-amber-700">{medicine.minStock} units</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Maximum Ceiling:</span>
                    <span className="font-bold text-slate-800">{medicine.maxStock} units</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Suggested Reorder:</span>
                    <span className="font-bold text-emerald-700">
                      {Math.max(0, medicine.maxStock - medicine.currentStock)} units
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Status:</span>
                    <StatusBadge 
                      type="stock" 
                      status={medicine.currentStock <= medicine.minStock ? 'low_stock' : 'healthy'} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'batches' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Batches (FEFO Prioritized)</h4>
                  <p className="text-[11px] text-slate-400">Oldest unexpired batch is automatically dispensed first at POS</p>
                </div>
                <button
                  onClick={() => onOpenAddBatch(medicine.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ New Batch</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Batch #</th>
                      <th className="px-4 py-2.5">Expiry Date</th>
                      <th className="px-4 py-2.5">Buy Price</th>
                      <th className="px-4 py-2.5">Sell Price</th>
                      <th className="px-4 py-2.5">Quantity</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                      <th className="px-4 py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedBatches.map(b => {
                      const daysLeft = getDaysUntilExpiry(b.expiryDate);
                      const isExpired = daysLeft <= 0;

                      return (
                        <tr key={b.id} className={isExpired ? 'bg-red-50/50' : 'hover:bg-slate-50'}>
                          <td className="px-4 py-2.5 font-mono font-bold text-slate-900">{b.batchNumber}</td>
                          <td className="px-4 py-2.5">
                            <span className={isExpired ? 'font-bold text-red-700' : 'font-medium text-slate-700'}>
                              {formatDate(b.expiryDate)}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {isExpired ? 'EXPIRED' : `${daysLeft} days`}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">{formatBDT(b.purchasePrice, true)}</td>
                          <td className="px-4 py-2.5 font-semibold text-slate-800">{formatBDT(b.sellingPrice, true)}</td>
                          <td className="px-4 py-2.5 font-bold text-slate-900">{b.quantity}</td>
                          <td className="px-4 py-2.5 text-center">
                            <StatusBadge 
                              type="expiry" 
                              status={isExpired ? 'expired' : daysLeft <= 30 ? 'critical' : daysLeft <= 90 ? 'warning' : 'safe'} 
                            />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            {isExpired && (
                              <button
                                onClick={() => {
                                  if (confirm(`Write off expired batch ${b.batchNumber}?`)) {
                                    writeOffExpiredBatch(medicine.id, b.id, 'Expired disposal');
                                  }
                                }}
                                className="px-2 py-1 text-[10px] font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded transition"
                              >
                                Write-Off
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
