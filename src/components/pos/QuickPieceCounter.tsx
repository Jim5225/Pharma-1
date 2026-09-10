import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  Minus,
  AlertTriangle, 
  Clock, 
  Check, 
  ShoppingCart, 
  Sparkles,
  Zap,
  Layers,
  CheckCircle2
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
  
  // Unit mode: 'piece' (১টি/২টি ট্যাবলেট) or 'pata' (১ পাতা/২ পাতা)
  const [sellMode, setSellMode] = useState<'piece' | 'pata'>('piece');
  
  // Pieces per pata (strip): default 10 for tablets/capsules
  const [piecesPerPata, setPiecesPerPata] = useState<number>(10);
  
  // Quantity input value
  const [quantityInput, setQuantityInput] = useState<number>(1);
  const [isSuccessAdded, setIsSuccessAdded] = useState(false);

  const filteredMedicines = medicines.filter(m =>
    !searchQuery ||
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMed = selectedMed || medicines[0];

  // Detect strip size from medicine unit if available (e.g., "Strip (10 pcs)")
  useEffect(() => {
    if (activeMed) {
      if (activeMed.unit && activeMed.unit.toLowerCase().includes('10')) {
        setPiecesPerPata(10);
      } else if (activeMed.unit && activeMed.unit.toLowerCase().includes('14')) {
        setPiecesPerPata(14);
      } else if (activeMed.unit && activeMed.unit.toLowerCase().includes('15')) {
        setPiecesPerPata(15);
      } else {
        setPiecesPerPata(10);
      }
    }
  }, [activeMed]);

  // Actual total pieces to be sold
  const totalPiecesToSell = sellMode === 'pata' 
    ? (quantityInput * piecesPerPata) 
    : quantityInput;

  const calculateTotalPrice = () => {
    if (!activeMed) return 0;
    return totalPiecesToSell * activeMed.sellingPrice;
  };

  const handleAddToCart = () => {
    if (!activeMed || totalPiecesToSell <= 0) return;
    onAddMedicineWithQty(activeMed, totalPiecesToSell);
    setIsSuccessAdded(true);
    setTimeout(() => setIsSuccessAdded(false), 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">দ্রুত পাতা ও পিস কাউন্টার (Smart 1-Tap Counter)</h3>
            <p className="text-[11px] text-slate-500">১ পাতা বা খুচরা ১ পিস যাই বিক্রি করুন — স্বয়ংক্রিয় নিখুঁত হিসাব</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px] text-emerald-800 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>১ পাতা = {piecesPerPata} পিস</span>
        </div>
      </div>

      {/* Main Grid: Medicine Selector on Left, Quick Piece Pad on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Medicine Selector (5 cols) */}
        <div className="md:col-span-5 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ওষুধ খুঁজুন (Napa, Seclo, Sergel)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600 font-medium"
            />
          </div>

          <div className="space-y-1.5 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
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
                    setQuantityInput(1);
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

        {/* Quick Piece/Pata Pad & Pricing Calculator (7 cols) */}
        <div className="md:col-span-7 bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200 space-y-3.5">
          {activeMed ? (
            <>
              {/* Selected Item Info Banner */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">নির্বাচিত ওষুধ</span>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">{activeMed.name} {activeMed.strength}</h4>
                    <p className="text-[11px] text-slate-500">জেনেরিক: {activeMed.genericName} • {activeMed.brand}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">খুচরা প্রতি পিস</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono">
                      {formatBDT(activeMed.sellingPrice, true)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      ১ পাতা = {formatBDT(activeMed.sellingPrice * piecesPerPata, true)}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="pt-1.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {activeMed.currentStock <= activeMed.minStock ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                      স্টক কম: মাত্র {activeMed.currentStock} পিস আছে
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                      স্টক: {activeMed.currentStock} পিস ({(activeMed.currentStock / piecesPerPata).toFixed(1)} পাতা)
                    </span>
                  )}

                  {activeMed.batches.some(b => getDaysUntilExpiry(b.expiryDate) <= 45) && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-600 shrink-0 animate-pulse" />
                      মেয়াদ কম! দ্রুত সেল করুন
                    </span>
                  )}
                </div>
              </div>

              {/* Step 1: Unit Toggle (পাতা নাকি খুচরা পিস) */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span>১. কীভাবে বিক্রি করবেন?</span>
                  <span className="text-[11px] font-medium text-slate-500">সিলেক্ট করুন পাতা বা পিস</span>
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSellMode('pata');
                      setQuantityInput(1);
                    }}
                    className={`py-2.5 rounded-lg font-black text-xs transition flex items-center justify-center gap-1.5 shadow-xs ${
                      sellMode === 'pata'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-transparent text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>পাতা হিসেবে (১ পাতা = {piecesPerPata} পিস)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSellMode('piece');
                      setQuantityInput(1);
                    }}
                    className={`py-2.5 rounded-lg font-black text-xs transition flex items-center justify-center gap-1.5 shadow-xs ${
                      sellMode === 'piece'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-transparent text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Pill className="w-4 h-4" />
                    <span>খুচরা পিস হিসেবে (১টি, ২টি, ৫টি)</span>
                  </button>
                </div>
              </div>

              {/* Step 2: 1-Tap Fast Presets + Custom Stepper */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span>২. কত {sellMode === 'pata' ? 'পাতা' : 'পিস'} দিতে চান?</span>
                  <span className="text-emerald-700 text-xs font-black">
                    মোট = {totalPiecesToSell} পিস ট্যাবলেট
                  </span>
                </label>

                {/* Presets based on mode */}
                {sellMode === 'pata' ? (
                  /* Pata Buttons (১ পাতা, ২ পাতা, ৩ পাতা, ৪ পাতা, ৫ পাতা, ১০ পাতা) */
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 10].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuantityInput(num)}
                        className={`py-2 px-1 rounded-xl border text-xs font-extrabold text-center transition ${
                          quantityInput === num
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num} পাতা
                        <span className="block text-[9px] font-normal opacity-80">{num * piecesPerPata} পিস</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Piece Buttons (১ পিস, ২ পিস, ৩ পিস, ৪ পিস, ৫ পিস, ১০ পিস) */
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuantityInput(num)}
                        className={`py-2 px-1 rounded-xl border text-xs font-extrabold text-center transition ${
                          quantityInput === num
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num} পিস
                      </button>
                    ))}
                  </div>
                )}

                {/* Stepper + Manual Keyboard Type Input for custom values */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-medium text-slate-500 shrink-0">অথবা সংখ্যা লিখুন:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantityInput(Math.max(1, quantityInput - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center font-black text-sm text-slate-900 outline-none py-1"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantityInput(quantityInput + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {sellMode === 'pata' ? 'পাতা' : 'পিস'}
                  </span>
                </div>
              </div>

              {/* Step 3: Real-Time Computed Total & Big Add to Cart Button */}
              <div className="p-3.5 sm:p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-3 shadow-lg">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                    <span>
                      {sellMode === 'pata' 
                        ? `${quantityInput} পাতা (${totalPiecesToSell} পিস × ${formatBDT(activeMed.sellingPrice, true)})`
                        : `${totalPiecesToSell} পিস × ${formatBDT(activeMed.sellingPrice, true)}`}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-sans tracking-tight">
                    {formatBDT(calculateTotalPrice(), true)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-black transition transform active:scale-95 flex items-center gap-2 shadow-md ${
                    isSuccessAdded 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isSuccessAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>যোগ হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>কার্টে যোগ করুন</span>
                    </>
                  )}
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
