import React, { useState } from 'react';
import { 
  PackageCheck, 
  PlusCircle, 
  Sparkles, 
  ArrowRight, 
  Truck, 
  Calendar, 
  Clock, 
  CheckCircle,
  Search,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import { NewPurchaseModal } from './NewPurchaseModal';

interface PurchaseListProps {
  onOpenNewPurchase: () => void;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({ onOpenNewPurchase }) => {
  const { medicines, suppliers } = usePharmacy();
  const [reorderMedId, setReorderMedId] = useState<string | undefined>(undefined);
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);

  // Identify low stock medicines for automated smart reorder suggestions
  const lowStockMedicines = medicines.filter(m => m.currentStock <= m.minStock);

  // Simulated purchase invoices history
  const purchaseHistory = [
    {
      id: 'pur-1',
      invoiceNumber: 'PUR-89102',
      dateTime: '2026-09-08T11:00:00',
      supplierName: 'Square Pharmaceuticals Ltd.',
      itemCount: 4,
      totalAmount: 42500,
      paidAmount: 40000,
      dueAmount: 2500,
      status: 'received'
    },
    {
      id: 'pur-2',
      invoiceNumber: 'PUR-89103',
      dateTime: '2026-09-05T14:30:00',
      supplierName: 'Beximco Pharmaceuticals Ltd.',
      itemCount: 6,
      totalAmount: 38200,
      paidAmount: 38200,
      dueAmount: 0,
      status: 'received'
    },
    {
      id: 'pur-3',
      invoiceNumber: 'PUR-89104',
      dateTime: '2026-09-02T09:15:00',
      supplierName: 'Incepta Pharmaceuticals Ltd.',
      itemCount: 3,
      totalAmount: 24800,
      paidAmount: 20000,
      dueAmount: 4800,
      status: 'received'
    }
  ];

  const handleQuickReorder = (medicineId: string) => {
    setReorderMedId(medicineId);
    setIsNewPurchaseOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-600" />
            <span>Purchases & Stock Ingestion</span>
          </h2>
          <p className="text-xs text-slate-500">
            Supplier deliveries, batch replenishment, and automated reorder engine
          </p>
        </div>

        <button
          onClick={() => {
            setReorderMedId(undefined);
            setIsNewPurchaseOpen(true);
          }}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ New Purchase</span>
        </button>
      </div>

      {/* Smart Reorder Engine Banner */}
      {lowStockMedicines.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-amber-950">Automated Reorder Assistant</h3>
                <p className="text-[11px] text-amber-800">
                  {lowStockMedicines.length} medicine(s) are below safety minimum. System calculated optimal order size:
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              Formula: Max - Current
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockMedicines.map(med => {
              const suggestedQty = Math.max(10, med.maxStock - med.currentStock);
              const estCost = suggestedQty * med.purchasePrice;

              return (
                <div key={med.id} className="p-3.5 bg-white rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{med.name} {med.strength}</div>
                        <div className="text-[10px] text-slate-500">{med.brand} • {med.genericName}</div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {med.currentStock} left
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-between text-[11px]">
                      <span className="text-slate-500">Suggested Order:</span>
                      <span className="font-extrabold text-emerald-700 font-mono">
                        {suggestedQty} {med.unit.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] mt-0.5">
                      <span className="text-slate-500">Estimated Cost:</span>
                      <span className="font-bold text-slate-800">{formatBDT(estCost)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickReorder(med.id)}
                    className="mt-3 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Create Purchase Draft</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Purchase Invoices History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Recent Purchase Invoices</h3>
          </div>
          <span className="text-xs text-slate-400">Showing last deliveries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Distributor / Supplier</th>
                <th className="px-5 py-3.5">Products</th>
                <th className="px-5 py-3.5 text-right">Invoice Total</th>
                <th className="px-5 py-3.5 text-right">Amount Paid</th>
                <th className="px-5 py-3.5 text-right">Due Balance</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseHistory.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{p.invoiceNumber}</td>
                  <td className="px-5 py-3.5 text-slate-500">{formatDateTime(p.dateTime)}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{p.supplierName}</td>
                  <td className="px-5 py-3.5 text-slate-500">{p.itemCount} items</td>
                  <td className="px-5 py-3.5 text-right font-bold text-slate-900">{formatBDT(p.totalAmount)}</td>
                  <td className="px-5 py-3.5 text-right font-medium text-emerald-700">{formatBDT(p.paidAmount)}</td>
                  <td className="px-5 py-3.5 text-right font-bold">
                    {p.dueAmount > 0 ? (
                      <span className="text-amber-700">{formatBDT(p.dueAmount)}</span>
                    ) : (
                      <span className="text-slate-400 font-normal">৳0</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Received
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Modal */}
      <NewPurchaseModal
        isOpen={isNewPurchaseOpen}
        onClose={() => {
          setIsNewPurchaseOpen(false);
          setReorderMedId(undefined);
        }}
        initialMedicineId={reorderMedId}
      />
    </div>
  );
};
