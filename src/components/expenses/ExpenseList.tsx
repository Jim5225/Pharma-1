import React, { useState } from 'react';
import { Receipt, PlusCircle, Calendar, DollarSign, X } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ExpenseCategory } from '../../types';
import { formatBDT, formatDate } from '../../utils/formatters';

export const ExpenseList: React.FC = () => {
  const { expenses, addExpense } = usePharmacy();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [category, setCategory] = useState<ExpenseCategory>('Electricity');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [note, setNote] = useState('');

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    addExpense({
      category,
      amount: parseFloat(amount) || 0,
      date,
      paymentMethod,
      note
    });

    setIsAddOpen(false);
    setAmount('');
    setNote('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-600" />
            <span>Operating Expense Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Track overhead costs (Rent, Utilities, Staff Salaries, Maintenance)
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Record Expense</span>
        </button>
      </div>

      {/* Summary Row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Operating Expenses Logged</span>
          <div className="text-2xl font-black text-rose-900 font-sans mt-1">
            {formatBDT(totalExpenses)}
          </div>
        </div>
        <span className="text-xs text-slate-400">{expenses.length} transaction(s) recorded</span>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Description / Note</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Paid Via</th>
              <th className="px-5 py-3.5 text-right">Amount (৳)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map(e => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5 font-bold text-slate-900">{e.category}</td>
                <td className="px-5 py-3.5 text-slate-600">{e.note}</td>
                <td className="px-5 py-3.5 text-slate-500">{formatDate(e.date)}</td>
                <td className="px-5 py-3.5 text-slate-700 font-medium">{e.paymentMethod}</td>
                <td className="px-5 py-3.5 text-right font-extrabold text-slate-900 font-mono">
                  {formatBDT(e.amount, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900">Record Operating Expense</h3>
              <button onClick={() => setIsAddOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Expense Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Rent">Shop Rent</option>
                  <option value="Electricity">Electricity / DESCO</option>
                  <option value="Salary">Staff Salary</option>
                  <option value="Transport">Transport / Courier</option>
                  <option value="Internet">Internet / Broadband</option>
                  <option value="Maintenance">Maintenance & Refrigeration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Amount (৳) *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Paid Via</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Cash">Cash Drawer</option>
                  <option value="bKash Merchant">bKash Merchant</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Note / Voucher Reference</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Shop AC gas refilling"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">Record Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
