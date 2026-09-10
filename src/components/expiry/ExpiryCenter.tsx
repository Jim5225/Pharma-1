import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  Trash2, 
  RotateCcw, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle,
  Pill
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { formatBDT, formatDate, getDaysUntilExpiry } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

export const ExpiryCenter: React.FC = () => {
  const { medicines, writeOffExpiredBatch, suppliers } = usePharmacy();
  const [activeFilter, setActiveFilter] = useState<'all' | 'expired' | 'critical' | 'warning' | 'safe'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all batches flattened with their parent medicine
  interface BatchWithMedicine {
    batchId: string;
    medicineId: string;
    medicineName: string;
    strength: string;
    dosageForm: string;
    brand: string;
    batchNumber: string;
    expiryDate: string;
    daysLeft: number;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    supplierName: string;
    lossValue: number;
  }

  const allBatches: BatchWithMedicine[] = [];

  medicines.forEach(m => {
    const sup = suppliers.find(s => s.id === m.supplierId);
    m.batches.forEach(b => {
      const days = getDaysUntilExpiry(b.expiryDate);
      allBatches.push({
        batchId: b.id,
        medicineId: m.id,
        medicineName: m.name,
        strength: m.strength,
        dosageForm: m.dosageForm,
        brand: m.brand,
        batchNumber: b.batchNumber,
        expiryDate: b.expiryDate,
        daysLeft: days,
        quantity: b.quantity,
        purchasePrice: b.purchasePrice,
        sellingPrice: b.sellingPrice,
        supplierName: sup ? sup.name : 'Square Pharma',
        lossValue: b.quantity * b.purchasePrice
      });
    });
  });

  // Sort by urgency: expired first (most negative days), then closest to today
  const sortedBatches = [...allBatches].sort((a, b) => a.daysLeft - b.daysLeft);

  // Filter batches
  const filtered = sortedBatches.filter(b => {
    const matchesSearch = !searchQuery || 
      b.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'expired') return b.daysLeft <= 0;
    if (activeFilter === 'critical') return b.daysLeft > 0 && b.daysLeft <= 30;
    if (activeFilter === 'warning') return b.daysLeft > 30 && b.daysLeft <= 60;
    if (activeFilter === 'safe') return b.daysLeft > 60;

    return true;
  });

  const expiredBatches = sortedBatches.filter(b => b.daysLeft <= 0);
  const criticalBatches = sortedBatches.filter(b => b.daysLeft > 0 && b.daysLeft <= 30);
  const warningBatches = sortedBatches.filter(b => b.daysLeft > 30 && b.daysLeft <= 60);
  const ninetyDaysBatches = sortedBatches.filter(b => b.daysLeft > 60 && b.daysLeft <= 90);

  const totalExpiredLoss = expiredBatches.reduce((sum, b) => sum + b.lossValue, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <span>Expiry Management & Protection Center</span>
        </h2>
        <p className="text-xs text-slate-500">
          First Expiry, First Out (FEFO) audit • Quarantine, write-off, and supplier returns
        </p>
      </div>

      {/* 4 Urgency Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Expired */}
        <div 
          onClick={() => setActiveFilter('expired')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeFilter === 'expired'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-500 shadow-sm'
              : 'bg-white border-red-200/80 hover:bg-red-50/40'
          }`}
        >
          <div className="flex items-center justify-between text-red-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Expired (Blocked)</span>
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-900">{expiredBatches.length}</div>
          <p className="text-[11px] text-red-700 mt-1 font-medium">
            Loss Value: {formatBDT(totalExpiredLoss)}
          </p>
        </div>

        {/* Critical < 30 Days */}
        <div 
          onClick={() => setActiveFilter('critical')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeFilter === 'critical'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500 shadow-sm'
              : 'bg-white border-rose-200/80 hover:bg-rose-50/40'
          }`}
        >
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">&lt; 30 Days Left</span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-rose-900">{criticalBatches.length}</div>
          <p className="text-[11px] text-rose-700 mt-1 font-medium">
            Critical — priority dispensing
          </p>
        </div>

        {/* Warning 31-60 Days */}
        <div 
          onClick={() => setActiveFilter('warning')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeFilter === 'warning'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500 shadow-sm'
              : 'bg-white border-amber-200/80 hover:bg-amber-50/40'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">31–60 Days Left</span>
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-amber-900">{warningBatches.length}</div>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">
            Early notice for reorder
          </p>
        </div>

        {/* Safe 60+ Days */}
        <div 
          onClick={() => setActiveFilter('all')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">All Batches</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{sortedBatches.length}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Reset filter view
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter batch # or medicine name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Showing: {filtered.length} batch(es)</span>
        </div>
      </div>

      {/* Batch Urgency Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Medicine</th>
                <th className="px-5 py-3.5">Batch #</th>
                <th className="px-5 py-3.5">Expiry Date</th>
                <th className="px-5 py-3.5">Days Left</th>
                <th className="px-5 py-3.5">Stock Left</th>
                <th className="px-5 py-3.5">Cost Value</th>
                <th className="px-5 py-3.5 text-center">Urgency</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(b => {
                const isExpired = b.daysLeft <= 0;

                return (
                  <tr key={b.batchId} className={isExpired ? 'bg-red-50/40' : 'hover:bg-slate-50/70'}>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{b.medicineName} {b.strength}</div>
                      <div className="text-[10px] text-slate-400">{b.brand} • {b.supplierName}</div>
                    </td>

                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {b.batchNumber}
                    </td>

                    <td className="px-5 py-3.5 font-medium">
                      {formatDate(b.expiryDate)}
                    </td>

                    <td className="px-5 py-3.5">
                      {isExpired ? (
                        <span className="font-bold text-red-600">Expired {Math.abs(b.daysLeft)}d ago</span>
                      ) : (
                        <span className="font-semibold text-slate-700">{b.daysLeft} days remaining</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 font-bold text-slate-900 font-mono">
                      {b.quantity} pcs
                    </td>

                    <td className="px-5 py-3.5 font-medium text-slate-700">
                      {formatBDT(b.lossValue, true)}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge 
                        type="expiry" 
                        status={isExpired ? 'expired' : b.daysLeft <= 30 ? 'critical' : b.daysLeft <= 60 ? 'warning' : 'safe'} 
                      />
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      {isExpired ? (
                        <button
                          onClick={() => {
                            if (confirm(`Quarantine & Write-Off expired batch ${b.batchNumber} of ${b.medicineName}?`)) {
                              writeOffExpiredBatch(b.medicineId, b.batchId, 'Disposal');
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition"
                        >
                          Write-Off
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold">Active in POS</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
