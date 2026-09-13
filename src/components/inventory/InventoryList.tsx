import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  Filter, 
  PlusCircle, 
  Eye, 
  ShoppingCart, 
  AlertTriangle, 
  ArrowUpDown,
  Download,
  CheckCircle,
  FileSpreadsheet,
  Barcode,
  Globe
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Medicine } from '../../types';
import { formatBDT, formatDate, getDaysUntilExpiry, getFEFOBatches } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { MedicineDetailModal } from './MedicineDetailModal';
import { BarcodeStickerModal } from './BarcodeStickerModal';
import { MedexGrabberModal } from './MedexGrabberModal';

interface InventoryListProps {
  onOpenAddMedicine: () => void;
  onNavigate: (tab: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({ onOpenAddMedicine, onNavigate }) => {
  const { medicines, addToCart, suppliers } = usePharmacy();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'low_stock' | 'expiring' | 'expired'>('all');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [stickerMedicine, setStickerMedicine] = useState<Medicine | null>(null);
  const [isMedexModalOpen, setIsMedexModalOpen] = useState(false);

  // Extract unique categories
  const categories = Array.from(new Set(medicines.map(m => m.category))).filter(Boolean);

  // Filtering Logic
  const filteredMedicines = medicines.filter(m => {
    // 1. Search Query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      m.name.toLowerCase().includes(q) || 
      m.genericName.toLowerCase().includes(q) || 
      m.barcode.includes(q) || 
      m.brand.toLowerCase().includes(q);

    // 2. Category
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;

    // 3. Supplier
    const matchesSupplier = filterSupplier === 'all' || m.supplierId === filterSupplier;

    // 4. Tab Status Filter
    let matchesTab = true;
    if (activeTab === 'low_stock') {
      matchesTab = m.currentStock <= m.minStock;
    } else if (activeTab === 'expiring') {
      matchesTab = m.batches.some(b => {
        const days = getDaysUntilExpiry(b.expiryDate);
        return days > 0 && days <= 90;
      });
    } else if (activeTab === 'expired') {
      matchesTab = m.batches.some(b => getDaysUntilExpiry(b.expiryDate) <= 0);
    }

    return matchesSearch && matchesCategory && matchesSupplier && matchesTab;
  });

  const lowStockCount = medicines.filter(m => m.currentStock <= m.minStock).length;
  const expiredCount = medicines.filter(m => m.batches.some(b => getDaysUntilExpiry(b.expiryDate) <= 0)).length;
  const expiringSoonCount = medicines.filter(m => m.batches.some(b => {
    const days = getDaysUntilExpiry(b.expiryDate);
    return days > 0 && days <= 90;
  })).length;

  return (
    <div className="space-y-5 pb-12">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" />
            <span>Medicine Inventory Master</span>
          </h2>
          <p className="text-xs text-slate-500">
            Total {medicines.length} formulations registered • Automated FEFO batch tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMedexModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-700/20 transition"
          >
            <Globe className="w-4 h-4" />
            <span>🌐 MedEx Live Grabber</span>
          </button>

          <button
            onClick={onOpenAddMedicine}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Medicines ({medicines.length})
          </button>

          <button
            onClick={() => setActiveTab('low_stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'low_stock'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>Low Stock</span>
            <span className="px-1.5 py-0.2 bg-white/70 rounded-full text-[10px]">
              {lowStockCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('expiring')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'expiring'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200'
            }`}
          >
            <span>Expiring &lt;90d</span>
            <span className="px-1.5 py-0.2 bg-white/70 rounded-full text-[10px]">
              {expiringSoonCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('expired')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'expired'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span>Expired Batches</span>
            <span className="px-1.5 py-0.2 bg-white/70 rounded-full text-[10px]">
              {expiredCount}
            </span>
          </button>
        </div>

        {/* Inputs & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, generic, barcode..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-emerald-600 text-slate-800 font-medium"
            />
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-emerald-600 focus:bg-white"
            >
              <option value="all">All Therapeutic Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-emerald-600 focus:bg-white"
            >
              <option value="all">All Suppliers / Manufacturers</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredMedicines.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Pill className="w-7 h-7" />
            </div>
            <p className="font-semibold text-slate-700 text-sm">No medicines found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your first medicine to start managing your pharmacy inventory and automatic expiry tracking.
            </p>
            <button
              onClick={onOpenAddMedicine}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Medicine & Formulation</th>
                  <th className="px-5 py-3.5">Current Stock</th>
                  <th className="px-5 py-3.5">Batches</th>
                  <th className="px-5 py-3.5">Earliest Expiry</th>
                  <th className="px-5 py-3.5">POS Price</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.map(med => {
                  const sorted = getFEFOBatches(med.batches);
                  const earliestValid = sorted.find(b => getDaysUntilExpiry(b.expiryDate) > 0) || sorted[0];
                  const hasExpired = med.batches.some(b => getDaysUntilExpiry(b.expiryDate) <= 0);
                  const isLow = med.currentStock <= med.minStock;

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition group">
                      {/* Name & Generic */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-2.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                                {med.strength}
                              </span>
                              <span className="text-slate-400 text-[11px]">({med.dosageForm})</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Generic: <span className="font-medium text-slate-700">{med.genericName}</span> • Brand: {med.brand}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-3.5">
                        <div className="font-extrabold text-sm text-slate-900 font-mono">
                          {med.currentStock}
                        </div>
                        <div className="text-[10px] text-slate-400">{med.unit}</div>
                      </td>

                      {/* Batches count */}
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold font-mono text-xs">
                          {med.batches.length} batch(es)
                        </span>
                      </td>

                      {/* Earliest Expiry */}
                      <td className="px-5 py-3.5">
                        {earliestValid ? (
                          <div>
                            <div className="font-medium text-slate-800">
                              {formatDate(earliestValid.expiryDate)}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Batch: {earliestValid.batchNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-italic">No active batch</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-sm text-emerald-700">
                          {formatBDT(med.sellingPrice, true)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Cost: {formatBDT(med.purchasePrice, true)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <StatusBadge 
                          type="stock" 
                          status={med.currentStock === 0 ? 'out_of_stock' : isLow ? 'low_stock' : 'healthy'} 
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setSelectedMedicine(med)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                            title="View Full Medicine Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setStickerMedicine(med)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                            title="Print Packaging Barcode Stickers"
                          >
                            <Barcode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              addToCart(med);
                              onNavigate('pos');
                            }}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Add Directly to POS Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Medicine Details Modal */}
      <MedicineDetailModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onOpenAddBatch={(medId) => {
          setSelectedMedicine(null);
        }}
      />

      {/* Barcode Stickers Printable Modal */}
      <BarcodeStickerModal
        medicine={stickerMedicine}
        onClose={() => setStickerMedicine(null)}
      />

      {/* MedEx Live Medicine Grabber & Catalog Modal */}
      <MedexGrabberModal
        isOpen={isMedexModalOpen}
        onClose={() => setIsMedexModalOpen(false)}
      />
    </div>
  );
};
