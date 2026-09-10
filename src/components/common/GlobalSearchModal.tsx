import React, { useState, useEffect, useRef } from 'react';
import { Search, Pill, Users, FileText, Activity, ArrowRight, X } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { formatBDT } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedicine?: (medicineId: string) => void;
  onNavigate?: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMedicine,
  onNavigate,
}) => {
  const { medicines, customers, sales, prescriptions, addToCart } = usePharmacy();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // If parent doesn't control, this is handled in top level
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredMedicines = trimmed.length > 0
    ? medicines.filter(m => 
        m.name.toLowerCase().includes(trimmed) ||
        m.genericName.toLowerCase().includes(trimmed) ||
        m.barcode.includes(trimmed) ||
        m.brand.toLowerCase().includes(trimmed)
      ).slice(0, 5)
    : [];

  const filteredCustomers = trimmed.length > 0
    ? customers.filter(c =>
        c.name.toLowerCase().includes(trimmed) ||
        c.phone.includes(trimmed)
      ).slice(0, 4)
    : [];

  const filteredSales = trimmed.length > 0
    ? sales.filter(s =>
        s.invoiceNumber.toLowerCase().includes(trimmed) ||
        s.customerName.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const filteredPrescriptions = trimmed.length > 0
    ? prescriptions.filter(p =>
        p.prescriptionNumber.toLowerCase().includes(trimmed) ||
        p.patientName.toLowerCase().includes(trimmed) ||
        p.doctorName.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const hasResults = filteredMedicines.length > 0 || filteredCustomers.length > 0 || filteredSales.length > 0 || filteredPrescriptions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines, generic names, customers, invoices, prescriptions (Ctrl + K)..."
            className="w-full text-slate-800 placeholder-slate-400 text-base outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-300 rounded shadow-xs">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {trimmed.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-600">Universal Pharmacy Search</p>
              <p className="text-xs text-slate-400 mt-1">Type medicine name (e.g. Napa, Seclo), generic, customer phone, or invoice #</p>
            </div>
          )}

          {trimmed.length > 0 && !hasResults && (
            <div className="py-8 text-center text-slate-500 text-sm">
              No matching records found for <span className="font-semibold text-slate-800">"{query}"</span>
            </div>
          )}

          {/* Medicines */}
          {filteredMedicines.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                Medicines ({filteredMedicines.length})
              </div>
              <div className="space-y-1">
                {filteredMedicines.map(med => (
                  <div
                    key={med.id}
                    onClick={() => {
                      if (onSelectMedicine) onSelectMedicine(med.id);
                      else {
                        addToCart(med);
                        if (onNavigate) onNavigate('pos');
                      }
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 cursor-pointer group transition border border-transparent hover:border-emerald-200"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 group-hover:text-emerald-800">{med.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">{med.strength}</span>
                        <span className="text-xs text-slate-400">({med.brand})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Generic: <span className="font-medium text-slate-700">{med.genericName}</span> • Stock: <span className={med.currentStock <= med.minStock ? 'text-amber-600 font-bold' : 'text-slate-700 font-medium'}>{med.currentStock}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">{formatBDT(med.sellingPrice, true)}</div>
                      <span className="text-[11px] text-emerald-600 font-medium group-hover:underline flex items-center justify-end gap-1">
                        + Add to POS <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Customers ({filteredCustomers.length})
              </div>
              <div className="space-y-1">
                {filteredCustomers.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (onNavigate) onNavigate('customers');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 cursor-pointer group transition border border-transparent hover:border-blue-200"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-blue-800">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.phone} • {c.address}</div>
                    </div>
                    <div className="text-right">
                      {c.dueBalance > 0 ? (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Due: {formatBDT(c.dueBalance)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">No dues</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {filteredSales.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                Invoices ({filteredSales.length})
              </div>
              <div className="space-y-1">
                {filteredSales.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      if (onNavigate) onNavigate('sales');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 cursor-pointer group transition border border-transparent hover:border-purple-200"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-purple-800">{s.invoiceNumber}</div>
                      <div className="text-xs text-slate-500">Customer: {s.customerName} • {s.items.length} items</div>
                    </div>
                    <div className="text-right font-bold text-sm text-slate-900">
                      {formatBDT(s.total, true)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prescriptions */}
          {filteredPrescriptions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-600" />
                Prescriptions ({filteredPrescriptions.length})
              </div>
              <div className="space-y-1">
                {filteredPrescriptions.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (onNavigate) onNavigate('prescriptions');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/60 cursor-pointer group transition border border-transparent hover:border-rose-200"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-rose-800">{p.prescriptionNumber} — {p.patientName}</div>
                      <div className="text-xs text-slate-500">{p.doctorName}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded">Enter</kbd> Select</span>
            <span><kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded">F2</kbd> POS</span>
          </div>
          <span>PharmaCare Universal Search</span>
        </div>
      </div>
    </div>
  );
};
