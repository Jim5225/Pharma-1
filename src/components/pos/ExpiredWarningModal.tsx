import React from 'react';
import { ShieldAlert, AlertOctagon, X, ArrowRight } from 'lucide-react';
import { Batch, Medicine } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ExpiredWarningModalProps {
  medicine: Medicine | null;
  batch: Batch | null;
  onClose: () => void;
  onViewExpiryCenter: () => void;
}

export const ExpiredWarningModal: React.FC<ExpiredWarningModalProps> = ({
  medicine,
  batch,
  onClose,
  onViewExpiryCenter,
}) => {
  if (!medicine || !batch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-rose-200">
        {/* Red Warning Banner */}
        <div className="bg-rose-600 text-white p-5 flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-base tracking-tight">Sale Blocked — Expired Stock</h3>
            <p className="text-xs text-rose-100 mt-0.5">Government safety & regulatory compliance</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200/70 text-rose-950">
            <div className="text-sm font-bold text-slate-900">{medicine.name} {medicine.strength}</div>
            <div className="text-xs text-slate-600 mt-0.5">Generic: {medicine.genericName} ({medicine.brand})</div>

            <div className="mt-3 pt-3 border-t border-rose-200/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Batch Number:</span>
                <div className="font-mono font-bold text-slate-800">{batch.batchNumber}</div>
              </div>
              <div>
                <span className="text-slate-500">Expiry Date:</span>
                <div className="font-bold text-rose-700">{formatDate(batch.expiryDate)}</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            This batch has passed its valid expiry date. The system strictly prohibits dispensing expired medicines to safeguard patient health.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={onClose}
              className="w-full sm:w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition text-center"
            >
              Cancel / Select Other
            </button>
            <button
              onClick={() => {
                onClose();
                onViewExpiryCenter();
              }}
              className="w-full sm:w-1/2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 shadow-md shadow-rose-600/20"
            >
              <span>Quarantine in Expiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
