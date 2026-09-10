import React, { useState } from 'react';
import { CalendarClock, X, CheckCircle2, AlertCircle, Printer } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { formatBDT } from '../../utils/formatters';

interface DailyClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyClosingModal: React.FC<DailyClosingModalProps> = ({ isOpen, onClose }) => {
  const { sales, expenses, performDailyClosing } = usePharmacy();
  const { userName } = useAuthRole();

  const [actualCash, setActualCash] = useState<string>('');
  const [closingDone, setClosingDone] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSales = sales.filter(s => s.dateTime.startsWith(todayStr));
  const todaysExpenses = expenses.filter(e => e.date.startsWith(todayStr));

  const totalSales = todaysSales.reduce((sum, s) => sum + s.total, 0);
  const cashSales = todaysSales.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.paidAmount, 0);
  const cardSales = todaysSales.filter(s => s.paymentMethod === 'card').reduce((sum, s) => sum + s.paidAmount, 0);
  const mobileSales = todaysSales.filter(s => ['bkash', 'nagad', 'rocket'].includes(s.paymentMethod)).reduce((sum, s) => sum + s.paidAmount, 0);
  const dueSales = todaysSales.filter(s => s.paymentMethod === 'due').reduce((sum, s) => sum + s.dueAmount, 0);
  const totalExpense = todaysExpenses.reduce((sum, e) => sum + e.amount, 0);

  const expectedCash = Math.max(0, cashSales - totalExpense);
  const actualNum = actualCash ? parseFloat(actualCash) : expectedCash;
  const difference = actualNum - expectedCash;

  const handleConfirmClosing = () => {
    performDailyClosing(actualNum, userName);
    setClosingDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-100">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-xs">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">End-of-Day Daily Closing</h3>
              <p className="text-[11px] text-slate-400">Cash drawer count & register reconciliation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {closingDone ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-slate-900">Daily Register Closed Successfully</h4>
            <p className="text-slate-600">
              Expected cash was <strong>{formatBDT(expectedCash)}</strong> and actual cash counted was <strong>{formatBDT(actualNum)}</strong>.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border rounded-xl text-slate-700 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Closing Sheet</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Sales Breakdown Table */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block pb-1 border-b border-slate-200">
                Today's Business Summary ({new Date().toLocaleDateString('en-GB')})
              </span>

              <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                <span>Total Register Sales:</span>
                <span className="font-bold text-slate-900">{formatBDT(totalSales, true)}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>• Cash Transactions:</span>
                <span className="font-medium text-slate-800">{formatBDT(cashSales, true)}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>• Card Payments:</span>
                <span className="font-medium text-slate-800">{formatBDT(cardSales, true)}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>• Mobile Banking (bKash/Nagad):</span>
                <span className="font-medium text-slate-800">{formatBDT(mobileSales, true)}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>• Due / Credit Sales:</span>
                <span className="font-medium text-amber-700">{formatBDT(dueSales, true)}</span>
              </div>
              <div className="flex justify-between text-rose-600 py-1 border-t border-slate-200 font-medium">
                <span>Less: Today's Paid Expenses:</span>
                <span>-{formatBDT(totalExpense, true)}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-300 font-bold text-sm text-slate-900">
                <span>EXPECTED DRAWER CASH:</span>
                <span className="text-emerald-700 font-sans">{formatBDT(expectedCash, true)}</span>
              </div>
            </div>

            {/* Actual Cash Input */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block text-xs">
                Actual Cash Counted in Drawer (৳) *
              </label>
              <input
                type="number"
                step="1"
                placeholder={expectedCash.toString()}
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-base font-bold font-mono focus:outline-emerald-600 bg-white"
              />
              <p className="text-[10px] text-slate-400">
                Count notes and coins in cash drawer and input here.
              </p>
            </div>

            {/* Difference / Discrepancy Highlight */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              difference === 0 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : difference < 0 
                  ? 'bg-rose-50 border-rose-200 text-rose-900' 
                  : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-bold">Drawer Difference:</span>
              </div>
              <span className="font-extrabold text-sm font-mono">
                {difference === 0 ? '৳0.00 (Balanced)' : (difference > 0 ? `+${formatBDT(difference, true)} (Surplus)` : `-${formatBDT(Math.abs(difference), true)} (Shortage)`)}
              </span>
            </div>

            {/* Confirm CTA */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClosing}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirm Day Closing</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
