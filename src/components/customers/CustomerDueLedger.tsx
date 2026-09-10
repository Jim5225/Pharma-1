import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Wallet, 
  Search, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Receipt,
  CheckCircle2,
  X,
  CreditCard
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Customer, PaymentMethod } from '../../types';
import { formatBDT, formatDate } from '../../utils/formatters';

export const CustomerDueLedger: React.FC = () => {
  const { customers, collectCustomerDue, addCustomer, sales } = usePharmacy();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id || null);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Due collection state
  const [collectAmount, setCollectAmount] = useState<string>('');
  const [collectMethod, setCollectMethod] = useState<PaymentMethod>('cash');

  // New Customer State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerSales = selectedCustomer 
    ? sales.filter(s => s.customerId === selectedCustomer.id) 
    : [];

  const totalOutstandingDue = customers.reduce((sum, c) => sum + c.dueBalance, 0);

  const filteredCustomers = customers.filter(c =>
    !searchQuery ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !collectAmount) return;

    const amt = parseFloat(collectAmount);
    if (amt <= 0) return;

    collectCustomerDue(selectedCustomer.id, amt, collectMethod);
    setIsCollectModalOpen(false);
    setCollectAmount('');
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newCust = addCustomer({
      name: newName,
      phone: newPhone,
      address: newAddress || 'Dhaka, Bangladesh'
    });

    setSelectedCustomerId(newCust.id);
    setIsAddCustomerOpen(false);
    setNewName('');
    setNewPhone('');
    setNewAddress('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Customer Directory & Due Ledger</span>
          </h2>
          <p className="text-xs text-slate-500">
            Credit accounts, purchase history, and debt settlement
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* Outstanding Due Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customer Dues Outstanding</span>
            <div className="text-2xl font-black text-slate-900 font-sans tracking-tight">
              {formatBDT(totalOutstandingDue)}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          <span>{customers.filter(c => c.dueBalance > 0).length} of {customers.length} customer(s) have overdue debt</span>
        </div>
      </div>

      {/* 2-Column Split: Customer List on Left, Ledger History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or phone number..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredCustomers.map(c => {
              const isSelected = selectedCustomerId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`p-4 cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{c.phone}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    {c.dueBalance > 0 ? (
                      <span className="inline-block font-extrabold text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        Due: {formatBDT(c.dueBalance)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold">Clean balance</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Profile & Ledger (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedCustomer ? (
            <>
              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedCustomer.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedCustomer.phone}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedCustomer.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedCustomer.dueBalance > 0 && (
                    <button
                      onClick={() => setIsCollectModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                    >
                      Collect Due Payment
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Outstanding Due</span>
                  <div className={`text-base font-extrabold mt-1 ${selectedCustomer.dueBalance > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
                    {formatBDT(selectedCustomer.dueBalance)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Spent</span>
                  <div className="text-base font-extrabold text-slate-900 mt-1">
                    {formatBDT(selectedCustomer.totalSpent)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Visits</span>
                  <div className="text-base font-extrabold text-slate-900 mt-1">
                    {selectedCustomer.totalPurchases}
                  </div>
                </div>
              </div>

              {/* Transaction / Invoice Ledger */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Purchase & Payment History</span>
                </h4>

                {customerSales.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">
                    No sales recorded for this customer yet.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase">
                        <tr>
                          <th className="px-4 py-2.5">Invoice #</th>
                          <th className="px-4 py-2.5">Date</th>
                          <th className="px-4 py-2.5">Method</th>
                          <th className="px-4 py-2.5 text-right">Total</th>
                          <th className="px-4 py-2.5 text-right">Due Left</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customerSales.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-mono font-bold text-slate-900">{s.invoiceNumber}</td>
                            <td className="px-4 py-2.5 text-slate-500">{formatDate(s.dateTime)}</td>
                            <td className="px-4 py-2.5 uppercase text-[10px] font-bold text-slate-600">{s.paymentMethod}</td>
                            <td className="px-4 py-2.5 text-right font-bold text-slate-900">{formatBDT(s.total, true)}</td>
                            <td className="px-4 py-2.5 text-right font-bold text-amber-700">
                              {s.dueAmount > 0 ? formatBDT(s.dueAmount, true) : '৳0'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-slate-400 text-xs">
              Select a customer to view ledger
            </div>
          )}
        </div>
      </div>

      {/* Collect Due Payment Modal */}
      {isCollectModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Collect Due Repayment</h3>
              <button onClick={() => setIsCollectModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollectSubmit} className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-slate-600 block">Customer: <strong className="text-slate-900">{selectedCustomer.name}</strong></span>
                <span className="text-amber-800 font-bold block mt-0.5">Current Balance: {formatBDT(selectedCustomer.dueBalance)}</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Repayment Amount (৳) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  max={selectedCustomer.dueBalance}
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  placeholder={selectedCustomer.dueBalance.toString()}
                  className="w-full px-3 py-2 border rounded-xl font-mono text-base font-bold text-slate-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['cash', 'bkash', 'card'] as PaymentMethod[]).map(pm => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setCollectMethod(pm)}
                      className={`py-2 text-center rounded-xl border font-bold capitalize transition ${
                        collectMethod === pm ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  Confirm Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Add New Customer</h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Tariqul Islam"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="017XX-XXXXXX"
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Address / Area</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
