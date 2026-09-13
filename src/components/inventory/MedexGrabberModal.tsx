import React, { useState, useMemo, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Plus, 
  Check, 
  ExternalLink, 
  Building2, 
  X, 
  Sparkles, 
  Info, 
  PackageCheck,
  Database,
  Loader2
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { INITIAL_MEDICINES } from '../../data/mockData';
import { DosageForm, Medicine } from '../../types';
import { formatBDT } from '../../utils/formatters';

interface DatasetItem {
  brand: string;
  name: string;
  generic: string;
  strength: string;
  dosageForm: DosageForm;
  manufacturer: string;
  category: string;
  supplierId: string;
  mrp: number;
  purchasePrice: number;
  unit: string;
  slug: string;
}

interface MedexGrabberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedexGrabberModal: React.FC<MedexGrabberModalProps> = ({ isOpen, onClose }) => {
  const { medicines, addMedicine, suppliers } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Full 9,400+ Bangladesh Medicine Dataset loaded from Kaggle & MedEx
  const [fullDataset, setFullDataset] = useState<DatasetItem[]>([]);
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);

  useEffect(() => {
    if (isOpen && fullDataset.length === 0 && !isLoadingDataset) {
      setIsLoadingDataset(true);
      fetch('/data/bangladesh_medicines.json')
        .then(res => res.json())
        .then((data: DatasetItem[]) => {
          setFullDataset(data);
          setIsLoadingDataset(false);
        })
        .catch(err => {
          console.warn('Could not load full dataset, falling back to pre-seeded catalog:', err);
          setIsLoadingDataset(false);
        });
    }
  }, [isOpen, fullDataset.length, isLoadingDataset]);

  // Set of existing medicine IDs and names for fast lookup
  const existingNames = useMemo(() => {
    return new Set(medicines.map(m => m.name.toLowerCase().trim()));
  }, [medicines]);

  // Convert INITIAL_MEDICINES as fallback dataset items
  const baseItems: DatasetItem[] = useMemo(() => {
    if (fullDataset.length > 0) return fullDataset;
    return INITIAL_MEDICINES.map(m => ({
      brand: m.brand,
      name: m.name,
      generic: m.genericName,
      strength: m.strength,
      dosageForm: m.dosageForm,
      manufacturer: m.manufacturer,
      category: m.category,
      supplierId: m.supplierId,
      mrp: m.mrp,
      purchasePrice: m.purchasePrice,
      unit: m.unit,
      slug: m.name.toLowerCase().replace(/\s+/g, '-')
    }));
  }, [fullDataset]);

  // Companies list (top 30 manufacturers)
  const companies = useMemo(() => {
    const counts: Record<string, number> = {};
    baseItems.forEach(item => {
      counts[item.manufacturer] = (counts[item.manufacturer] || 0) + 1;
    });
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return ['All', ...sorted.slice(0, 35)];
  }, [baseItems]);

  const dosageForms = ['All', 'Tablet', 'Capsule', 'Syrup', 'Suspension', 'Injection', 'Ointment', 'Eye Drops', 'Inhaler'];

  // Filtered list (capped at 80 items for maximum UI fluidity)
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const results: DatasetItem[] = [];

    for (let i = 0; i < baseItems.length; i++) {
      const item = baseItems[i];
      const matchesSearch = !q || 
        item.name.toLowerCase().includes(q) ||
        item.generic.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q);

      if (!matchesSearch) continue;

      const matchesForm = selectedForm === 'All' || item.dosageForm === selectedForm;
      if (!matchesForm) continue;

      const matchesCompany = selectedCompany === 'All' || item.manufacturer === selectedCompany;
      if (!matchesCompany) continue;

      results.push(item);
      if (results.length >= 80) break; // Display top 80 matches smoothly
    }

    return results;
  }, [baseItems, searchQuery, selectedForm, selectedCompany]);

  const handleImport = (item: DatasetItem) => {
    if (existingNames.has(item.name.toLowerCase().trim())) {
      setSuccessToast(`"${item.name}" is already in your active inventory!`);
      setTimeout(() => setSuccessToast(null), 3000);
      return;
    }

    const medData: Omit<Medicine, 'id' | 'batches'> = {
      name: item.name,
      genericName: item.generic,
      brand: item.brand,
      manufacturer: item.manufacturer,
      category: item.category,
      dosageForm: item.dosageForm,
      strength: item.strength,
      unit: item.unit,
      barcode: `8941${Math.floor(100000 + Math.random() * 900000)}`,
      sku: `${item.brand.slice(0, 3).toUpperCase()}-${(item.strength.replace(/[^a-zA-Z0-9]/g, '') || 'STD').slice(0, 4).toUpperCase()}-${item.dosageForm.slice(0, 3).toUpperCase()}`,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.mrp,
      mrp: item.mrp,
      minSellingPrice: Number((item.mrp * 0.95).toFixed(2)),
      currentStock: 100,
      minStock: 25,
      maxStock: 300,
      reorderQuantity: 150,
      supplierId: item.supplierId || suppliers[0]?.id || 'sup-1',
    };

    const initialBatch = {
      batchNumber: `${item.brand.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}A`,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-12-31',
      purchasePrice: item.purchasePrice,
      sellingPrice: item.mrp,
      quantity: 100,
      supplierId: item.supplierId || suppliers[0]?.id || 'sup-1'
    };

    addMedicine(medData, initialBatch);
    setSuccessToast(`✅ Successfully grabbed & imported "${item.name}" to inventory!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
              <Globe className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">MedEx & Kaggle Bangladesh Medicine Grabber</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/30 text-sky-200 border border-sky-400/30 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" />
                  {fullDataset.length > 0 ? `${fullDataset.length.toLocaleString()} Medicines` : '150+ Formulations'}
                </span>
              </div>
              <p className="text-xs text-sky-200/80">
                Official Bangladesh Drug Index (<a href="https://medex.com.bd" target="_blank" rel="noreferrer" className="underline hover:text-white inline-flex items-center gap-0.5">medex.com.bd <ExternalLink className="w-3 h-3 inline" /></a> & Kaggle Dataset 311821)
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-sky-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 flex items-center gap-2 transition animate-in slide-in-from-top">
            <Sparkles className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Search & Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search across 9,400+ medicines (e.g. Napa, Seclo, Monas, Sergel, Zimax, Ciprocin, Ace)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Company Dropdown */}
            <div className="w-full sm:w-60">
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              >
                {companies.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Manufacturers (Square, Beximco...)' : c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dosage Form Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Form:</span>
            {dosageForms.map(form => (
              <button
                key={form}
                onClick={() => setSelectedForm(form)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition ${
                  selectedForm === form
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {form}
              </button>
            ))}

            {isLoadingDataset && (
              <span className="inline-flex items-center gap-1.5 text-xs text-sky-600 font-medium ml-auto shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Loading dataset...
              </span>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing {filteredCatalog.length} matching formulations
              {baseItems.length > 1000 && ` (from ${baseItems.length.toLocaleString()} Bangladeshi medicines)`}
            </span>
            <span className="text-[11px] text-slate-400">Trade Price calculated with standard 16% pharmacy retail margin</span>
          </div>

          {filteredCatalog.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Globe className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No matching medicines found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for popular brands like Napa, Seclo, Sergel, Monas, Zimax, Ciprocin, or generic names.</p>
            </div>
          ) : (
            filteredCatalog.map(item => {
              const isAlreadyAdded = existingNames.has(item.name.toLowerCase().trim());

              return (
                <div 
                  key={`${item.slug}-${item.name}`}
                  className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAlreadyAdded 
                      ? 'bg-emerald-50/40 border-emerald-200/80' 
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{item.name}</h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.dosageForm}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        {item.category}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-medium text-slate-700">
                        Generic: <strong className="font-semibold text-slate-900">{item.generic}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {item.manufacturer}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{item.unit}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs pt-1">
                      <span className="text-slate-500">
                        MRP: <strong className="text-slate-900 font-bold">{formatBDT(item.mrp)}</strong>
                      </span>
                      <span className="text-slate-500">
                        Trade Price: <strong className="text-emerald-700 font-bold">{formatBDT(item.purchasePrice)}</strong>
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Brand: {item.brand}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <a
                      href={`https://medex.com.bd/search?search=${encodeURIComponent(item.brand || item.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View on MedEx official website"
                      className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition border border-slate-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {isAlreadyAdded ? (
                      <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                        <PackageCheck className="w-4 h-4 text-emerald-600" />
                        <span>In Inventory</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleImport(item)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs shadow-sky-600/20 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Grab & Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Integrated with MedEx Bangladesh & Kaggle Dataset 311821 with 9,400+ DGDA approved formulations.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition w-full sm:w-auto"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
