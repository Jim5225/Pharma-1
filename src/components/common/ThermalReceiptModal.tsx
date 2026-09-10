import React from 'react';
import { Printer, CheckCircle, X, Download } from 'lucide-react';
import { Sale } from '../../types';
import { formatBDT, formatDateTime } from '../../utils/formatters';

interface ThermalReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="bg-emerald-600 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-100" />
            <div>
              <h3 className="font-semibold text-base">Sale Completed Successfully</h3>
              <p className="text-xs text-emerald-100">Invoice #{sale.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Printable Receipt Body */}
        <div className="p-6 bg-slate-50 flex justify-center">
          <div 
            id="printable-receipt"
            className="bg-white p-5 border border-dashed border-slate-300 rounded-lg w-full text-slate-800 font-mono text-xs shadow-sm"
          >
            {/* Pharmacy Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">PHARMACARE PLUS</div>
              <div className="text-[11px] text-slate-500 font-sans">{sale.branchName}</div>
              <div className="text-[10px] text-slate-400 font-sans">Dhaka, Bangladesh • Hotline: 09612-888999</div>
              <div className="mt-1 inline-block px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                TAX INVOICE / CASH MEMO
              </div>
            </div>

            {/* Meta details */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-semibold">{sale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span>{formatDateTime(sale.dateTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold">{sale.customerName}</span>
              </div>
              {sale.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span>{sale.customerPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Served By:</span>
                <span>{sale.cashierName}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-2.5 border-b border-dashed border-slate-300">
              <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase pb-1 border-b border-slate-200">
                <span className="w-1/2">Item & Batch</span>
                <span className="w-1/6 text-center">Qty</span>
                <span className="w-1/6 text-right">Price</span>
                <span className="w-1/6 text-right">Total</span>
              </div>
              <div className="divide-y divide-slate-100 py-1">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="py-1 text-[11px]">
                    <div className="font-semibold text-slate-900">{item.medicine.name} {item.medicine.strength}</div>
                    {item.dosageInstruction && (
                      <div className="text-[10px] text-emerald-800 font-sans font-medium">
                        [{item.dosageInstruction}]
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span className="w-1/2 truncate">B: {item.selectedBatch.batchNumber}</span>
                      <span className="w-1/6 text-center">{item.quantity}</span>
                      <span className="w-1/6 text-right">৳{item.unitPrice.toFixed(2)}</span>
                      <span className="w-1/6 text-right font-medium text-slate-800">৳{item.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span>{formatBDT(sale.subtotal, true)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Special Discount:</span>
                  <span>-{formatBDT(sale.discount, true)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>NET PAYABLE:</span>
                <span>{formatBDT(sale.total, true)}</span>
              </div>
              <div className="flex justify-between pt-1 text-slate-600">
                <span>Payment Mode:</span>
                <span className="uppercase font-semibold text-slate-800">{sale.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-semibold">{formatBDT(sale.paidAmount, true)}</span>
              </div>
              {sale.changeAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Change Given:</span>
                  <span>{formatBDT(sale.changeAmount, true)}</span>
                </div>
              )}
              {sale.dueAmount > 0 && (
                <div className="flex justify-between text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                  <span>Due Balance:</span>
                  <span>{formatBDT(sale.dueAmount, true)}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 text-center text-[10px] text-slate-400 space-y-1">
              <p>Medicines sold are non-refundable once sealed is broken.</p>
              <p className="font-semibold text-slate-600">Thank you for trusting PharmaCare!</p>
              <p className="text-[9px]">Powered by PharmaCare SaaS</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition text-sm text-center"
          >
            New Sale (Esc)
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal (Ctrl+P)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
