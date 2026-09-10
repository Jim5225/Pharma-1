import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  AlertTriangle, 
  Clock, 
  Check, 
  ShoppingCart, 
  Sparkles,
  Zap
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Medicine, Batch } from '../../types';
import { formatBDT, formatDate, getDaysUntilExpiry, getFEFOBatches } from '../../utils/formatters';

interface QuickPieceCounterProps {
  onAddMedicineWithQty: (medicine: Medicine, quantity: number) => void;
}

export const QuickPieceCounter: React.FC<QuickPieceCounterProps> = ({ onAddMedicineWithQty }) => {
  const { medicines } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(medicines[0] || null);
  const [customQty, setCustomQty] = useState<number>(1);

  const filteredMedicines = medicines.filter(m =>
    !searchQuery ||
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMed = selectedMed || medicines[0];

  // Quick piece presets
  const quickPieces = [1, 2, 3, 4, 5, 6, 10, 15, 20, 30, 50];

  const calculateTotal = (qty: number) => {
    if (!activeMed) return 0;
    return qty * activeMed.sellingPrice;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">দ্রুত কাউন্টার সেল (Quick Piece Counter)</h3>
            <p className="text-[11px] text-slate-500">ওষুধ নির্বাচন করে পিস চাপুন — সাথে সাথে মোট দাম ও মেয়াদ/স্টক অ্যালার্ট দেখুন</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          ১-ক্লিক হিসাব
        </span>
      </div>

      {/* Main Grid: Medicine Selector on Left, Quick Piece Pad on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Medicine Selector (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ওষুধ খুঁজুন (যেমন: Napa, Seclo)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600 font-medium"
            />
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {filteredMedicines.map(med => {
              const isSelected = activeMed?.id === med.id;
              const isLow = med.currentStock <= med.minStock;
              const hasExpiringSoon = med.batches.some(b => {
                const d = getDaysUntilExpiry(b.expiryDate);
                return d > 0 && d <= 45;
              });

              return (
                <div
                  key={med.id}
                  onClick={() => {
                    setSelectedMed(med);
                    setCustomQty(1);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition border flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">{med.name}</span>
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                        {med.strength}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{med.brand} • {med.dosageForm}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-xs text-slate-900">{formatBDT(med.sellingPrice, true)}/পিস</div>
                    
                    {/* Status Alert Pills */}
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {hasExpiringSoon && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800">
                          মেয়াদ কম!
                        </span>
                      )}
                      {isLow && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          স্টক কম ({med.currentStock})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Piece Pad & Pricing Calculator (7 cols) */}
        <div className="md:col-span-7 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4">
          {activeMed ? (
            <>
              {/* Selected Item Identity & Stock/Expiry Warnings */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">নির্বাচিত ওষুধ</span>
                    <h4 className="text-base font-extrabold text-slate-900">{activeMed.name} {activeMed.strength}</h4>
                    <p className="text-xs text-slate-500">জেনেরিক: {activeMed.genericName} • {activeMed.brand}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">প্রতি পিসের দাম</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono">
                      {formatBDT(activeMed.sellingPrice, true)}
                    </span>
                  </div>
                </div>

                {/* Prominent Expiry (মেয়াদ কম) & Low Stock (স্টক কম) Warning Banners */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                  {/* Stock Alert */}
                  {activeMed.currentStock <= activeMed.minStock ? (
                    <div className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>স্টকে কম আছে! (মাত্র {activeMed.currentStock} পিস অবশিষ্ট)</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                      <span>স্টক পর্যাপ্ত: {activeMed.currentStock} পিস আছে</span>
                    </div>
                  )}

                  {/* Expiry Alert */}
                  {activeMed.batches.some(b => getDaysUntilExpiry(b.expiryDate) <= 45) && (
                    <div className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0 animate-pulse" />
                      <span>মেয়াদ কম! (ব্যাচের মেয়াদ আর কিছুদিন বাকি — আগে বিক্রি করুন)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Pieces Selection Buttons */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block text-xs">
                  কয় পিস বিক্রি করবেন? (নিচের বাটনে ট্যাপ করুন):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {quickPieces.map(pcs => {
                    const isCurrent = customQty === pcs;
                    return (
                      <button
                        key={pcs}
                        onClick={() => setCustomQty(pcs)}
                        className={`py-2 px-1 rounded-xl border text-xs font-bold text-center transition ${
                          isCurrent
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pcs} পিস
                        {pcs === 10 && <span className="block text-[9px] text-emerald-100 font-normal">১ পাতা</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Instant Price Calculation Display */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    হিসাবকৃত মোট বিক্রয়মূল্য ({customQty} পিস × {formatBDT(activeMed.sellingPrice, true)}):
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-sans tracking-tight">
                    {formatBDT(calculateTotal(customQty), true)}
                  </div>
                </div>

                <button
                  onClick={() => onAddMedicineWithQty(activeMed, customQty)}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>কার্টে যোগ করুন</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400">
              বাম পাশ থেকে একটি ওষুধ নির্বাচন করুন
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
