import React, { useState } from 'react';
import { RotateCcw, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Sale, CartItem, ReturnRecord } from '../../types';
import { usePharmacy } from '../../context/PharmacyContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { formatBDT } from '../../utils/formatters';

interface ReturnModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({ sale, onClose }) => {
  const { processReturn } = usePharmacy();
  const { userName } = useAuthRole();

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [returnQty, setReturnQty] = useState(1);
  const [reason, setReason] = useState<ReturnRecord['reason']>('customer_return');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!sale || sale.items.length === 0) return null;

  const currentItem = sale.items[selectedItemIndex] || sale.items[0];
  const maxQty = currentItem ? currentItem.quantity : 1;
  const refundPerUnit = currentItem ? currentItem.unitPrice : 0;
  const totalRefund = refundPerUnit * returnQty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    processReturn(
      sale.id,
      sale.invoiceNumber,
      currentItem.medicine.id,
      currentItem.medicine.name,
      currentItem.selectedBatch.batchNumber,
      returnQty,
      totalRefund,
      reason,
      sale.customerName,
      userName
    );

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-100">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-xs">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Process Sale Return / Refund</h3>
              <p className="text-[11px] text-slate-400">Invoice #{sale.invoiceNumber} • {sale.customerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">Return Processed Successfully</h4>
            <p className="text-slate-600">
              Stock for <strong>{currentItem.medicine.name}</strong> (Qty: {returnQty}) has been restored to inventory, and <strong>{formatBDT(totalRefund)}</strong> was refunded to customer.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Select Medicine Item */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Select Item to Return *</label>
              <select
                value={selectedItemIndex}
                onChange={(e) => {
                  setSelectedItemIndex(parseInt(e.target.value));
                  setReturnQty(1);
                }}
                className="w-full px-3 py-2 border rounded-xl bg-white font-medium text-slate-800"
              >
                {sale.items.map((item, idx) => (
                  <option key={idx} value={idx}>
                    {item.medicine.name} {item.medicine.strength} (Sold: {item.quantity} pcs @ ৳{item.unitPrice})
                  </option>
                ))}
              </select>
            </div>

            {/* Return Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Return Quantity *</label>
                <input
                  type="number"
                  min="1"
                  max={maxQty}
                  value={returnQty}
                  onChange={(e) => setReturnQty(Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 border rounded-xl font-bold font-mono text-base text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Max returnable: {maxQty} pcs</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Refund Amount (৳)</label>
                <div className="px-3 py-2 bg-slate-50 border rounded-xl font-extrabold text-base text-emerald-700 font-mono">
                  {formatBDT(totalRefund, true)}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Unit Price: ৳{refundPerUnit.toFixed(2)}</span>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Return Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReturnRecord['reason'])}
                className="w-full px-3 py-2 border rounded-xl bg-white"
              >
                <option value="customer_return">Customer Returned (Intact packaging - Return to stock)</option>
                <option value="wrong_medicine">Wrong Medicine Dispensed (Return to stock)</option>
                <option value="damaged">Damaged / Broken Strip (Do not restock - Write-off)</option>
                <option value="other">Other reason</option>
              </select>
            </div>

            {reason === 'damaged' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Damaged medicines will be quarantined and NOT restored into active sales stock.</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Refund ({formatBDT(totalRefund)})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
