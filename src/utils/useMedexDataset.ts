import { useState, useEffect } from 'react';
import { DosageForm } from '../types';
import { INITIAL_MEDICINES } from '../data/mockData';

export interface MedexMedicineItem {
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

let cachedDataset: MedexMedicineItem[] | null = null;
let isFetching = false;
const listeners: Array<(data: MedexMedicineItem[]) => void> = [];

export function useMedexDataset() {
  const [dataset, setDataset] = useState<MedexMedicineItem[]>(cachedDataset || []);
  const [isLoading, setIsLoading] = useState(!cachedDataset);

  useEffect(() => {
    if (cachedDataset) {
      setDataset(cachedDataset);
      setIsLoading(false);
      return;
    }

    const onLoaded = (data: MedexMedicineItem[]) => {
      setDataset(data);
      setIsLoading(false);
    };
    listeners.push(onLoaded);

    if (!isFetching) {
      isFetching = true;
      fetch('/data/bangladesh_medicines.json')
        .then(res => res.json())
        .then((data: MedexMedicineItem[]) => {
          cachedDataset = data;
          listeners.forEach(fn => fn(data));
          listeners.length = 0;
          isFetching = false;
        })
        .catch(err => {
          console.warn('Could not load bangladesh_medicines.json, fallback to mockData:', err);
          // Fallback to INITIAL_MEDICINES
          const fallback: MedexMedicineItem[] = INITIAL_MEDICINES.map(m => ({
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
          cachedDataset = fallback;
          listeners.forEach(fn => fn(fallback));
          listeners.length = 0;
          isFetching = false;
        });
    }

    return () => {
      const idx = listeners.indexOf(onLoaded);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  /**
   * Search across the 9,400+ medicines
   */
  const searchMedex = (query: string, limit = 20): MedexMedicineItem[] => {
    const q = query.toLowerCase().trim();
    if (!q || dataset.length === 0) return [];

    const results: MedexMedicineItem[] = [];
    for (let i = 0; i < dataset.length; i++) {
      const item = dataset[i];
      if (
        item.name.toLowerCase().includes(q) ||
        item.generic.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q)
      ) {
        results.push(item);
        if (results.length >= limit) break;
      }
    }
    return results;
  };

  /**
   * Find alternative brands with the same generic
   */
  const findAlternativesByGeneric = (genericName: string, targetStrength?: string, limit = 12): MedexMedicineItem[] => {
    const g = genericName.toLowerCase().trim();
    const s = targetStrength ? targetStrength.toLowerCase().replace(/\s+/g, '') : '';
    if (!g || dataset.length === 0) return [];

    const results: MedexMedicineItem[] = [];
    const seenBrands = new Set<string>();

    for (let i = 0; i < dataset.length; i++) {
      const item = dataset[i];
      const itemGen = item.generic.toLowerCase().trim();
      const itemStr = item.strength.toLowerCase().replace(/\s+/g, '');

      if (itemGen.includes(g) || g.includes(itemGen)) {
        if (!seenBrands.has(item.brand.toLowerCase())) {
          // If strength provided, prioritize matching strength
          if (!s || !itemStr || itemStr === s || itemStr.includes(s) || s.includes(itemStr)) {
            seenBrands.add(item.brand.toLowerCase());
            results.push(item);
            if (results.length >= limit) break;
          }
        }
      }
    }
    return results;
  };

  return {
    dataset,
    isLoading,
    searchMedex,
    findAlternativesByGeneric
  };
}
