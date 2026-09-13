import React, { useMemo } from 'react';
import { 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Building2, 
  AlertCircle, 
  ExternalLink,
  Pill,
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { Medicine } from '../../types';
import { formatBDT } from '../../utils/formatters';
import { getGenericUsageGuide, findStockAlternatives } from '../../utils/alternativeFinder';

export interface MedexAlternativeItem {
  brand: string;
  name: string;
  generic: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  category: string;
  mrp: number;
  purchasePrice: number;
  unit: string;
}

interface MedicineAlternativePanelProps {
  searchedQuery: string;
  matchedMedexItem?: MedexAlternativeItem | null;
  marketAlternatives: MedexAlternativeItem[];
  allStockMedicines: Medicine[];
  onSelectStockAlternative: (med: Medicine) => void;
  onImportMarketAlternative: (item: MedexAlternativeItem) => void;
}

export const MedicineAlternativePanel: React.FC<MedicineAlternativePanelProps> = ({
  searchedQuery,
  matchedMedexItem,
  marketAlternatives,
  allStockMedicines,
  onSelectStockAlternative,
  onImportMarketAlternative
}) => {
  // Generic details & Bangla advice
  const genericName = matchedMedexItem?.generic || searchedQuery;
  const usageGuide = useMemo(() => {
    return getGenericUsageGuide(genericName, matchedMedexItem?.category);
  }, [genericName, matchedMedexItem]);

  // Alternatives currently available in pharmacy stock
  const inStockAlternatives = useMemo(() => {
    if (!matchedMedexItem) return [];
    return findStockAlternatives(
      matchedMedexItem.generic,
      matchedMedexItem.strength,
      allStockMedicines
    );
  }, [matchedMedexItem, allStockMedicines]);

  return (
    <div className="bg-white rounded-2xl border border-sky-200 shadow-xl overflow-hidden p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* Alert Header in Bangla */}
      <div className="p-3.5 bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 border border-sky-200 rounded-xl">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-extrabold text-sm text-sky-950">
                "{searchedQuery}" স্টকে পাওয়া যায়নি • MedEx অনলাইন অনুসন্ধান
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-200/80 text-sky-900 border border-sky-300">
                স্বয়ংক্রিয় বিকল্প সহায়িকা
              </span>
            </div>
            <p className="text-xs text-sky-800/90 mt-0.5 font-medium">
              সহজ বাংলায় এই ওষুধের কাজ, মূল উপাদান এবং দোকানে থাকা সমমানের বিকল্প তালিকা নিচে দেওয়া হলো:
            </p>
          </div>
        </div>
      </div>

      {/* Bangla Easy Usage Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>সহজ বাংলায় ওষুধের তথ্য ও কাজ (Patient Guidance):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
            <span className="text-slate-500 block text-[11px] font-semibold">কাজের ধরন / ব্যবহার:</span>
            <strong className="text-slate-900 font-bold text-xs">{usageGuide.simpleBanglaPurpose}</strong>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
            <span className="text-slate-500 block text-[11px] font-semibold">মূল উপাদান (Generic):</span>
            <strong className="text-slate-900 font-bold text-xs">
              {matchedMedexItem?.generic || genericName} {matchedMedexItem?.strength && `(${matchedMedexItem.strength})`}
            </strong>
          </div>
        </div>

        <p className="text-[11px] text-amber-950/90 font-medium leading-relaxed pt-1">
          💡 <strong>পরামর্শ:</strong> {usageGuide.adviceBangla}
        </p>
      </div>

      {/* Section 1: In-Stock Alternatives (দোকানে থাকা বিকল্প ওষুধ) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h5 className="font-extrabold text-xs text-slate-900">
              আপনার দোকানে স্টকে থাকা বিকল্পসমূহ ({inStockAlternatives.length}টি পাওয়া গেছে):
            </h5>
          </div>
          {inStockAlternatives.length > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              তাত্ক্ষণিক বিল করার জন্য প্রস্তুত
            </span>
          )}
        </div>

        {inStockAlternatives.length === 0 ? (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            দোকানের ইনভেন্টরিতে এই মুহূর্তে এই উপাদান ও পাওয়ারের কোনো সক্রিয় স্টক নেই।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inStockAlternatives.slice(0, 4).map(med => (
              <div 
                key={med.id}
                className="p-3 bg-emerald-50/50 border border-emerald-300/80 rounded-xl flex items-center justify-between gap-2 hover:bg-emerald-50 transition"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <strong className="text-xs font-extrabold text-slate-900 truncate">{med.name}</strong>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {med.strength}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span>{med.manufacturer}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">স্টক: {med.currentStock}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {formatBDT(med.sellingPrice)}
                  </div>
                </div>

                <button
                  onClick={() => onSelectStockAlternative(med)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1 shrink-0"
                >
                  <span>বিলে নিন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: MedEx Market Alternatives (বাজারে প্রাপ্ত অন্যান্য ব্র্যান্ড) */}
      {marketAlternatives.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-sky-600" />
              <h5 className="font-extrabold text-xs text-slate-900">
                বাজারে প্রাপ্ত অন্যান্য বিকল্প ব্র্যান্ড (MedEx Bangladesh):
              </h5>
            </div>
            <a
              href={`https://medex.com.bd/search?search=${encodeURIComponent(genericName)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-sky-700 hover:underline flex items-center gap-0.5 font-bold"
            >
              <span>MedEx এ দেখুন</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {marketAlternatives.slice(0, 6).map((item, idx) => (
              <div 
                key={`${item.brand}-${item.strength}-${idx}`}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between gap-2 hover:border-sky-300 transition text-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-slate-900 text-xs">{item.brand} {item.strength}</span>
                    <span className="text-[10px] text-slate-500">{item.dosageForm}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.manufacturer}</p>
                  <p className="font-bold text-slate-800 text-xs mt-1">MRP: {formatBDT(item.mrp)}</p>
                </div>

                <button
                  onClick={() => onImportMarketAlternative(item)}
                  className="w-full py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>স্টকে যুক্ত করুন</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
