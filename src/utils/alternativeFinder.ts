import { Medicine, DosageForm } from '../types';

export interface MedicineAlternative {
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: DosageForm;
  manufacturer: string;
  mrp: number;
  category: string;
  inStock: boolean;
  stockQty?: number;
  localMedicine?: Medicine;
}

export interface GenericUsageGuide {
  simpleBanglaPurpose: string;
  genericGroup: string;
  adviceBangla: string;
}

// Bengali usage descriptions for common generics/drug classes
const GENERIC_USAGE_MAP: Record<string, GenericUsageGuide> = {
  paracetamol: {
    simpleBanglaPurpose: 'জ্বর, মাথাব্যথা ও সাধারণ শারীরিক ব্যথানাশক',
    genericGroup: 'প্যারাসিটামল (Paracetamol)',
    adviceBangla: 'একই পাওয়ারের অন্য যেকোনো নির্ভরযোগ্য ব্র্যান্ড (যেমন Napa, Ace, Fast, Reset) নিশ্চিন্তে সমপরিমাণ কাজ করবে।'
  },
  omeprazole: {
    simpleBanglaPurpose: 'গ্যাস্ট্রিকের আলসার, এসিডিটি ও বুক জ্বালাপোড়া নিরামক',
    genericGroup: 'ওমেপ্রাজল (Omeprazole)',
    adviceBangla: 'উপাদান ও শক্তি (যেমন 20mg) একই থাকলে Seclo, Losectil, Proceptin ইত্যাদির কার্যকারিতা হুবহু একই।'
  },
  esomeprazole: {
    simpleBanglaPurpose: 'তীব্র গ্যাস্ট্রিক, এসিড রিফ্লাক্স ও পেপটিক আলসার নিরামক',
    genericGroup: 'এসোমেপ্রাজল (Esomeprazole)',
    adviceBangla: 'Sergel, Maxpro, Nexum সবই একই এসোমেপ্রাজল গ্রুপের নির্ভরযোগ্য ওষুধ।'
  },
  pantoprazole: {
    simpleBanglaPurpose: 'গ্যাস্ট্রিকের এসিড কমানো ও পেটের জ্বালাপোড়া উপশম',
    genericGroup: 'প্যান্টোপ্রাজল (Pantoprazole)',
    adviceBangla: 'Pantonix, Trupan, Pantobex একই উপাদান, যেকোনোটি বিকল্প হিসেবে প্রযোজ্য।'
  },
  rabeprazole: {
    simpleBanglaPurpose: 'দ্রুত গ্যাস্ট্রিকের এসিড নিয়ন্ত্রণ ও বুক জ্বালা উপশম',
    genericGroup: 'রাবেপ্রাজল (Rabeprazole)',
    adviceBangla: 'Finix বা Rabeca একই কার্যকারিতা সম্পন্ন।'
  },
  azithromycin: {
    simpleBanglaPurpose: 'গলাব্যথা, নিউমোনিয়া ও ব্যাকটেরিয়া ইনফেকশন প্রতিরোধী অ্যান্টিবায়োটিক',
    genericGroup: 'অ্যাজিথ্রোমাইসিন (Azithromycin)',
    adviceBangla: 'Zimax, Azithral, Tridosil একই অ্যান্টিবায়োটিক। চিকিৎসকের নির্ধারিত পূর্ণ কোর্স সম্পন্ন করুন।'
  },
  cefixime: {
    simpleBanglaPurpose: 'টাইফয়েড, মূত্রনালী ও শ্বাসতন্ত্রের ইনফেকশন নিরামক অ্যান্টিবায়োটিক',
    genericGroup: 'সেফিক্সিম (Cefixime)',
    adviceBangla: 'Cef-3, Triocim, Roxim একই গ্রুপের কার্যকর ওষুধ।'
  },
  ciprofloxacin: {
    simpleBanglaPurpose: 'পেটের ইনফেকশন, ডায়রিয়া ও প্রস্রাবের জ্বালাপোড়া প্রতিরোধী অ্যান্টিবায়োটিক',
    genericGroup: 'সিপ্রোফ্লক্সাসিন (Ciprofloxacin)',
    adviceBangla: 'Ciprocin, Neofloxin একই জেনেরিক ওষুধ।'
  },
  cefuroxime: {
    simpleBanglaPurpose: 'কান, গলা, সাইনাস ও ফুসফুসের ব্যাকটেরিয়া ইনফেকশন নিরামক',
    genericGroup: 'সেফুরোক্সিম (Cefuroxime)',
    adviceBangla: 'Kilbac, Cerox-A, Furocef একই ফর্মুলেশনের অ্যান্টিবায়োটিক।'
  },
  amoxicillin: {
    simpleBanglaPurpose: 'ব্যাকটেরিয়াজনিত সাধারণ ইনফেকশন নিরামক অ্যান্টিবায়োটিক',
    genericGroup: 'অ্যামোক্সিসিলিন (Amoxicillin)',
    adviceBangla: 'Moxacil, Fimoxyl একই অ্যান্টিবায়োটিক গ্রুপের ওষুধ।'
  },
  montelukast: {
    simpleBanglaPurpose: 'হাঁপানি, শ্বাসকষ্ট, বুকে কফ জমা ও অ্যালার্জিজনিত কাশির উপশম',
    genericGroup: 'মন্টেলুকাস্ট (Montelukast)',
    adviceBangla: 'Monas, Montene, Odmon, Lumona সবই সমমানের মন্টেলুকাস্ট।'
  },
  cetirizine: {
    simpleBanglaPurpose: 'অ্যালার্জি, হাঁচি, নাক দিয়ে পানি পড়া ও চুলকানি নিরামক',
    genericGroup: 'সেটিরিজিন (Cetirizine)',
    adviceBangla: 'Alatrol, Cetriz, Atrizin একই কাজের ওষুধ।'
  },
  fexofenadine: {
    simpleBanglaPurpose: 'অ্যালার্জি ও হাঁচির ওষুধ (ঘুমভাব খুব কম হয়)',
    genericGroup: 'ফেক্সোফেনাডিন (Fexofenadine)',
    adviceBangla: 'Fexo, Telfast একই জেনেরিক ওষুধ।'
  },
  bilastine: {
    simpleBanglaPurpose: 'নতুন প্রজন্মের শক্তিশালী অ্যালার্জি ও চুলকানির ওষুধ',
    genericGroup: 'বিলাস্টিন (Bilastine)',
    adviceBangla: 'Bilasten, Bilaxten একই বিলাস্টিন গ্রুপের ওষুধ।'
  },
  domperidone: {
    simpleBanglaPurpose: 'বমি বমি ভাব, পেট ফাঁপা ও বদহজম দূর করতে',
    genericGroup: 'ডমপেরিডন (Domperidone)',
    adviceBangla: 'Motigut, Omidon, Domp একই জেনেরিক ওষুধ।'
  },
  atorvastatin: {
    simpleBanglaPurpose: 'রক্তের ক্ষতিকর কোলেস্টেরল (চর্বি) কমানো ও হার্ট সুস্থ রাখা',
    genericGroup: 'অ্যাটরভাস্ট্যাটিন (Atorvastatin)',
    adviceBangla: 'Atova, Lipicon, Tiginor একই গ্রুপের কোলেস্টেরল কমানোর ওষুধ।'
  },
  rosuvastatin: {
    simpleBanglaPurpose: 'উচ্চ কোলেস্টেরল ও রক্তনালী ব্লক হওয়া প্রতিরোধক',
    genericGroup: 'রোসুভাস্ট্যাটিন (Rosuvastatin)',
    adviceBangla: 'Rozu, Rostar, Rovast একই রোসুভাস্ট্যাটিন ফর্মুলেশন।'
  },
  amlodipine: {
    simpleBanglaPurpose: 'উচ্চ রক্তচাপ নিয়ন্ত্রণ ও রক্ত সঞ্চালন স্বাভাবিক রাখা',
    genericGroup: 'অ্যামলোডিপিন (Amlodipine)',
    adviceBangla: 'Amlopin, Cardipin একই উচ্চ রক্তচাপের ওষুধ।'
  },
  losartan: {
    simpleBanglaPurpose: 'ব্লাড প্রেসার নিয়ন্ত্রণ ও কিডনি সুরক্ষা',
    genericGroup: 'লোসারটান (Losartan)',
    adviceBangla: 'Angilock, Losan, Osartil একই ফর্মুলেশনের প্রেসারের ওষুধ।'
  },
  metformin: {
    simpleBanglaPurpose: 'রক্তে গ্লুকোজ বা চিনির মাত্রা কমিয়ে ডায়াবেটিস নিয়ন্ত্রণ',
    genericGroup: 'মেটফরমিন (Metformin)',
    adviceBangla: 'Comet, Informin, Daomet একই মেটফরমিন গ্রুপের ওষুধ।'
  },
  ketorolac: {
    simpleBanglaPurpose: 'অপারেশনের পরে, দাঁতে বা শরীরের তীব্র ব্যথানাশক',
    genericGroup: 'কেটোরোলাক (Ketorolac)',
    adviceBangla: 'Torax, Rolac, Xdol তীব্র ব্যথায় একই কার্যকর ভূমিকা পালন করে।'
  },
  naproxen: {
    simpleBanglaPurpose: 'বাতের ব্যথা, মেরুদণ্ডের ব্যথা ও হাড়ের ব্যথানাশক',
    genericGroup: 'ন্যাপরোক্সেন (Naproxen)',
    adviceBangla: 'Napryn, Xenapro, Anaprox একই ব্যথানাশক উপাদান।'
  },
  tolfenamic: {
    simpleBanglaPurpose: 'মাইগ্রেনের তীব্র মাথাব্যথা নিরামক',
    genericGroup: 'টলফেনামিক এসিড (Tolfenamic Acid)',
    adviceBangla: 'Tufnil মাইগ্রেনের ব্যথায় বহুল প্রচলিত।'
  }
};

/**
 * Returns simple Bangla instructions and guidance for a given generic name
 */
export function getGenericUsageGuide(genericName: string, category?: string): GenericUsageGuide {
  const gLower = genericName.toLowerCase();
  for (const [key, guide] of Object.entries(GENERIC_USAGE_MAP)) {
    if (gLower.includes(key)) {
      return guide;
    }
  }

  return {
    simpleBanglaPurpose: category || 'চিকিৎসা নির্দেশিত ওষুধ',
    genericGroup: genericName,
    adviceBangla: 'মূল উপাদান (Generic) এবং পাওয়ার (Strength) একই থাকলে এক ব্র্যান্ডের বদলে অন্য অনুমোদিত ব্র্যান্ডের ওষুধ সমান কার্যকর।'
  };
}

/**
 * Finds alternative medicines for a given medicine from current stock and dataset
 */
export function findStockAlternatives(
  targetGeneric: string,
  targetStrength: string,
  stockMedicines: Medicine[],
  excludeMedicineId?: string
): Medicine[] {
  const gClean = targetGeneric.toLowerCase().trim();
  const sClean = targetStrength.toLowerCase().replace(/\s+/g, '');

  return stockMedicines.filter(m => {
    if (excludeMedicineId && m.id === excludeMedicineId) return false;
    const mGen = m.genericName.toLowerCase().trim();
    const mStr = m.strength.toLowerCase().replace(/\s+/g, '');
    
    // Check if generic matches closely
    const matchesGen = mGen.includes(gClean) || gClean.includes(mGen);
    // Prefer matching strength if possible, or same generic
    const matchesStr = !sClean || !mStr || mStr === sClean || mStr.includes(sClean) || sClean.includes(mStr);

    return matchesGen && matchesStr && m.currentStock > 0;
  });
}
