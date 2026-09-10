import React, { useState } from 'react';
import { PackagePlus, X, Plus, Trash2, CheckCircle2, Search } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { PurchaseItem } from '../../types';
import { formatBDT } from '../../utils/formatters';

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMedicineId?: string;
  initialQuantity?: number;
}

export const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({
  isOpen,
  onClose,
  initialMedicineId,
  initialQuantity,
}) => {
  const { suppliers, medicines, createPurchase } = usePharmacy();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [items, setItems] = useState<PurchaseItem[]>(() => {
    if (initialMedicineId) {
      const med = medicines.find(m => m.id === initialMedicineId);
      if (med) {
        const qty = initialQuantity || (med.maxStock - med.currentStock);
        return [{
          medicineId: med.id,
          medicineName: `${med.name} ${med.strength}`,
          batchNumber: `BT-${Math.floor(100 + Math.random() * 900)}`,
          expiryDate: '2028-06-30',
          quantity: Math.max(10, qty),
          purchasePrice: med.purchasePrice,
          sellingPrice: med.sellingPrice,
          total: Math.max(10, qty) * med.purchasePrice
        }];
      }
    }
    return [];
  });

  const [selectedMedId, setSelectedMedId] = useState(medicines[0]?.id || '');
  const [paidAmount, setPaidAmount] = useState<string>('');

  if (!isOpen) return null;

  const handleAddItem = () => {
    const med = medicines.find(m => m.id === selectedMedId);
    if (!med) return;

    const newItem: PurchaseItem = {
      medicineId: med.id,
      medicineName: `${med.name} ${med.strength}`,
      batchNumber: `BT-${Math.floor(100 + Math.random() * 900)}`,
      expiryDate: '2028-06-30',
      quantity: 50,
      purchasePrice: med.purchasePrice,
      sellingPrice: med.sellingPrice,
      total: 50 * med.purchasePrice
    };

    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof PurchaseItem, val: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: val };
        updated.total = updated.quantity * updated.purchasePrice;
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  const paidNum = paidAmount ? parseFloat(paidAmount) : totalAmount;
  const dueAmount = Math.max(0, totalAmount - paidNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one medicine item to the purchase invoice.');
      return;
    }

    createPurchase(supplierId, items, paidNum);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-100">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">New Stock Purchase Invoice</h3>
              <p className="text-xs text-slate-400">Receive medicine delivery from pharmaceutical distributors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Supplier Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Distributor / Supplier *</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-medium bg-white"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.company}) — Current Due: {formatBDT(s.totalDue)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Medicine Adder */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Add Medicine Item</label>
              <div className="flex gap-2">
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 bg-white"
                >
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.strength} ({m.brand}) — Buy ৳{m.purchasePrice.toFixed(2)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
              <span>Invoice Items ({items.length})</span>
              <span className="text-[11px] text-slate-400">Stock updates automatically upon saving</span>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No items added yet. Select a medicine above and click "Add".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Medicine</th>
                      <th className="px-4 py-2.5">Batch #</th>
                      <th className="px-4 py-2.5">Expiry Date</th>
                      <th className="px-4 py-2.5">Qty</th>
                      <th className="px-4 py-2.5">Buy Price (৳)</th>
                      <th className="px-4 py-2.5">Sell Price (৳)</th>
                      <th className="px-4 py-2.5 text-right">Total (৳)</th>
                      <th className="px-4 py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-bold text-slate-900">{item.medicineName}</td>
                        <td className="px-4 py-2.5">
                          <input
                            type="text"
                            value={item.batchNumber}
                            onChange={(e) => handleUpdateItem(idx, 'batchNumber', e.target.value)}
                            className="w-24 px-2 py-1 border border-slate-200 rounded font-mono font-medium"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="date"
                            value={item.expiryDate}
                            onChange={(e) => handleUpdateItem(idx, 'expiryDate', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border border-slate-200 rounded font-bold"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            step="0.1"
                            value={item.purchasePrice}
                            onChange={(e) => handleUpdateItem(idx, 'purchasePrice', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-slate-200 rounded font-mono"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            step="0.1"
                            value={item.sellingPrice}
                            onChange={(e) => handleUpdateItem(idx, 'sellingPrice', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-slate-200 rounded font-mono text-emerald-700"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                          {formatBDT(item.total, true)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-slate-300 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment & Due Calculation */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] text-slate-500 block">Total Purchase Invoice:</span>
              <span className="text-xl font-extrabold text-slate-900 font-sans">
                {formatBDT(totalAmount, true)}
              </span>
            </div>

            <div>
              <label className="text-[11px] text-slate-700 font-bold block mb-1">
                Amount Paid Now (৳):
              </label>
              <input
                type="number"
                placeholder={totalAmount.toFixed(2)}
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-mono font-bold"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Supplier Due Recorded:</span>
              <span className={`text-xl font-extrabold font-sans ${dueAmount > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
                {formatBDT(dueAmount, true)}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={items.length === 0}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Update Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
