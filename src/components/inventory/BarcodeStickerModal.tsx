import React, { useState } from 'react';
import { Barcode, Printer, X } from 'lucide-react';
import { Medicine } from '../../types';
import { formatBDT, formatDate } from '../../utils/formatters';

interface BarcodeStickerModalProps {
  medicine: Medicine | null;
  onClose: () => void;
}

export const BarcodeStickerModal: React.FC<BarcodeStickerModalProps> = ({ medicine, onClose }) => {
  const [stickerCount, setStickerCount] = useState(6);

  if (!medicine) return null;

  const firstBatch = medicine.batches[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-100">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 text-xs">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Print Packaging Barcode Stickers</h3>
              <p className="text-[11px] text-slate-400">{medicine.name} {medicine.strength} • MRP {formatBDT(medicine.mrp, true)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Number of Stickers to Generate:</span>
            <div className="flex items-center gap-2">
              {[4, 6, 12, 24].map(n => (
                <button
                  key={n}
                  onClick={() => setStickerCount(n)}
                  className={`px-3 py-1 rounded-lg border text-xs font-bold transition ${
                    stickerCount === n ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {n} pcs
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Grid Preview */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-h-80 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Array.from({ length: stickerCount }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-300 rounded-lg p-2.5 shadow-2xs text-center space-y-1 font-mono"
                >
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">PHARMACARE</div>
                  <div className="text-[11px] font-extrabold text-slate-900 truncate leading-tight font-sans">
                    {medicine.name} {medicine.strength}
                  </div>
                  <div className="text-[11px] font-black text-emerald-700">
                    MRP: {formatBDT(medicine.mrp, true)}
                  </div>

                  {/* Simulated Barcode Lines */}
                  <div className="py-1 flex items-center justify-center gap-[2px] opacity-80">
                    <span className="w-0.5 h-6 bg-slate-900" />
                    <span className="w-1 h-6 bg-slate-900" />
                    <span className="w-0.5 h-6 bg-slate-900" />
                    <span className="w-1.5 h-6 bg-slate-900" />
                    <span className="w-0.5 h-6 bg-slate-900" />
                    <span className="w-1 h-6 bg-slate-900" />
                    <span className="w-0.5 h-6 bg-slate-900" />
                    <span className="w-2 h-6 bg-slate-900" />
                    <span className="w-0.5 h-6 bg-slate-900" />
                    <span className="w-1 h-6 bg-slate-900" />
                  </div>

                  <div className="text-[8px] text-slate-500 font-mono">
                    {medicine.barcode || '8941112001'}
                  </div>
                  {firstBatch && (
                    <div className="text-[8px] text-slate-400">
                      B: {firstBatch.batchNumber} • Exp: {firstBatch.expiryDate.slice(2, 7)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Barcode Stickers</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
