import React, { useState } from 'react';
import { Truck, PlusCircle, Phone, Mail, MapPin, Wallet, CheckCircle2, X } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { formatBDT } from '../../utils/formatters';

export const SupplierList: React.FC = () => {
  const { suppliers, addSupplier, recordSupplierPayment } = usePharmacy();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Days');

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addSupplier({
      name,
      company: company || name,
      phone: phone || '+880 2-XXXXXXX',
      email: email || 'contact@supplier.bd',
      address: address || 'Dhaka, Bangladesh',
      paymentTerms
    });

    setIsAddModalOpen(false);
    setName('');
    setCompany('');
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !payAmount) return;
    const amt = parseFloat(payAmount);
    if (amt <= 0) return;

    recordSupplierPayment(selectedSupplier.id, amt);
    setIsPayModalOpen(false);
    setPayAmount('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Suppliers & Pharmaceutical Distributors</span>
          </h2>
          <p className="text-xs text-slate-500">
            Accounts payable, manufacturer contact directory, and procurement terms
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Supplier</span>
        </button>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{s.name}</h3>
                  <span className="text-[11px] text-slate-500">{s.company}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {s.paymentTerms}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{s.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Procured:</span>
                <span className="font-bold text-slate-800">{formatBDT(s.totalPurchases)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-medium text-emerald-700">{formatBDT(s.totalPaid)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Outstanding Payable:</span>
                <span className={s.totalDue > 0 ? 'text-amber-700' : 'text-slate-400'}>
                  {formatBDT(s.totalDue)}
                </span>
              </div>

              {s.totalDue > 0 && (
                <button
                  onClick={() => {
                    setSelectedSupplierId(s.id);
                    setIsPayModalOpen(true);
                  }}
                  className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
                >
                  Pay Distributor
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pay Modal */}
      {isPayModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900">Record Distributor Payment</h3>
              <button onClick={() => setIsPayModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handlePaySubmit} className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span>Distributor: <strong>{selectedSupplier.name}</strong></span>
                <span className="block font-bold text-amber-700 mt-1">Payable: {formatBDT(selectedSupplier.totalDue)}</span>
              </div>
              <div>
                <label className="font-bold block mb-1">Amount to Pay (৳) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder={selectedSupplier.totalDue.toString()}
                  className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsPayModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900">Add New Supplier / Distributor</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Company / Supplier Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Opsonin Pharma Ltd."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 2-XXXXXXX"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Net 15 Days">Net 15 Days</option>
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Net 45 Days">Net 45 Days</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
