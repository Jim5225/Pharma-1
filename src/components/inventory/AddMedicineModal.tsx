import React, { useState } from 'react';
import { Pill, X, CheckCircle2 } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { DosageForm } from '../../types';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose }) => {
  const { addMedicine, suppliers } = usePharmacy();

  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brand, setBrand] = useState('Square');
  const [manufacturer, setManufacturer] = useState('Square Pharmaceuticals Ltd.');
  const [category, setCategory] = useState('Analgesic & Antipyretic');
  const [dosageForm, setDosageForm] = useState<DosageForm>('Tablet');
  const [strength, setStrength] = useState('500mg');
  const [unit, setUnit] = useState('Strip (10 pcs)');
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(2.0);
  const [sellingPrice, setSellingPrice] = useState<number>(2.5);
  const [mrp, setMrp] = useState<number>(2.5);
  const [minStock, setMinStock] = useState<number>(30);
  const [maxStock, setMaxStock] = useState<number>(300);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || 'sup-1');

  // Initial Batch fields
  const [batchNumber, setBatchNumber] = useState(`BT-${Math.floor(100 + Math.random() * 900)}`);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [initialQuantity, setInitialQuantity] = useState<number>(100);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMedicine(
      {
        name,
        genericName,
        brand,
        manufacturer,
        category,
        dosageForm,
        strength,
        unit,
        barcode: barcode || Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        sku: sku || `${name.slice(0, 3).toUpperCase()}-${strength.slice(0, 3)}`,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        mrp: Number(mrp),
        minSellingPrice: Number(purchasePrice) * 1.1,
        currentStock: Number(initialQuantity),
        minStock: Number(minStock),
        maxStock: Number(maxStock),
        reorderQuantity: Number(maxStock) - Number(minStock),
        supplierId
      },
      {
        batchNumber,
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        quantity: Number(initialQuantity),
        supplierId
      }
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-100">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Add New Medicine</h3>
              <p className="text-xs text-slate-400">Register new pharmaceutical product & initial batch</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Row 1: Name & Strength */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">Brand / Medicine Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Napa Extra, Seclo, Sergel"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Strength *</label>
              <input
                type="text"
                required
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="e.g. 500mg, 20mg"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono"
              />
            </div>
          </div>

          {/* Row 2: Generic Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Generic Formula *</label>
              <input
                type="text"
                required
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="e.g. Paracetamol + Caffeine"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Therapeutic Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Analgesic, Antibiotic, Antacid"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Row 3: Dosage Form & Packaging Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Dosage Form</label>
              <select
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value as DosageForm)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 bg-white"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Suspension">Suspension</option>
                <option value="Injection">Injection</option>
                <option value="Ointment">Ointment</option>
                <option value="Eye Drops">Eye Drops</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Packaging Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. Strip (10 pcs), Box (50 pcs)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Row 4: Manufacturer / Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Manufacturer / Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setManufacturer(`${e.target.value} Pharmaceuticals Ltd.`);
                }}
                placeholder="e.g. Square, Beximco, Incepta"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Preferred Supplier</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 bg-white"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Pricing (BDT) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Pricing Structure (BDT ৳)
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-600">Purchase Price (Buy)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600">Selling Price (POS)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600">Maximum Retail (MRP)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={mrp}
                  onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Row 6: Initial Batch & Stock Details */}
          <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] block">
              Initial Stock & Batch Setup
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-700">Batch Number *</label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700">Initial Quantity</label>
                <input
                  type="number"
                  required
                  value={initialQuantity}
                  onChange={(e) => setInitialQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                />
              </div>
            </div>
          </div>

          {/* Row 7: Reorder Limits */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Minimum Stock Alert Level</label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Maximum Stock Capacity</label>
              <input
                type="number"
                value={maxStock}
                onChange={(e) => setMaxStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Add to Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
