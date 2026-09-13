import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Medicine, 
  Batch, 
  CartItem, 
  Sale, 
  Customer, 
  Supplier, 
  Prescription, 
  Expense, 
  DailyClosing, 
  PaymentMethod,
  PurchaseItem,
  Purchase,
  SystemNotification,
  ReturnRecord
} from '../types';
import { 
  INITIAL_MEDICINES, 
  INITIAL_SALES, 
  INITIAL_CUSTOMERS, 
  INITIAL_SUPPLIERS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_EXPENSES 
} from '../data/mockData';
import { getFEFOBatches, getDaysUntilExpiry } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface PharmacyContextType {
  // State
  medicines: Medicine[];
  sales: Sale[];
  customers: Customer[];
  suppliers: Supplier[];
  prescriptions: Prescription[];
  expenses: Expense[];
  cart: CartItem[];
  activeReceiptSale: Sale | null;
  dailyClosings: DailyClosing[];
  notifications: SystemNotification[];
  returns: ReturnRecord[];

  // POS Actions
  addToCart: (medicine: Medicine, preferredBatch?: Batch, qty?: number) => { success: boolean; error?: string };
  updateCartItemQty: (itemId: string, qty: number) => void;
  updateCartItemBatch: (itemId: string, batchId: string) => void;
  updateCartItemDiscount: (itemId: string, discountPercent: number) => void;
  updateCartItemInstruction: (itemId: string, instruction: string) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  completeSale: (
    paymentMethod: PaymentMethod,
    customerId?: string,
    customerName?: string,
    customerPhone?: string,
    amountPaid?: number,
    cashierName?: string,
    branchId?: string,
    branchName?: string
  ) => { success: boolean; invoiceNumber?: string; sale?: Sale; error?: string };
  setActiveReceiptSale: (sale: Sale | null) => void;

  // Returns / Refund Action
  processReturn: (
    saleId: string,
    invoiceNumber: string,
    medicineId: string,
    medicineName: string,
    batchNumber: string,
    quantity: number,
    refundAmount: number,
    reason: ReturnRecord['reason'],
    customerName: string,
    processedBy: string
  ) => void;

  // Backup & Reset Actions
  resetToDemoData: () => void;
  exportBackupJson: () => void;

  // Inventory Actions
  addMedicine: (medicineData: Omit<Medicine, 'id' | 'batches'>, initialBatch?: Omit<Batch, 'id' | 'medicineId'>) => Medicine;
  updateMedicine: (medicine: Medicine) => void;
  addBatchToMedicine: (medicineId: string, batchData: Omit<Batch, 'id' | 'medicineId'>) => void;
  writeOffExpiredBatch: (medicineId: string, batchId: string, reason: string) => void;

  // Purchase Actions
  createPurchase: (
    supplierId: string, 
    items: PurchaseItem[], 
    paidAmount: number
  ) => Purchase;

  // Prescription Actions
  addPrescription: (rx: Omit<Prescription, 'id' | 'status'>) => Prescription;
  dispensePrescriptionToPos: (rxId: string) => { itemsAdded: number; outOfStock: string[] };

  // Customer Actions
  addCustomer: (customerData: Omit<Customer, 'id' | 'dueBalance' | 'totalPurchases' | 'totalSpent' | 'lastVisit'>) => Customer;
  collectCustomerDue: (customerId: string, amount: number, paymentMethod: PaymentMethod) => void;

  // Supplier Actions
  addSupplier: (supplierData: Omit<Supplier, 'id' | 'totalPurchases' | 'totalPaid' | 'totalDue'>) => Supplier;
  recordSupplierPayment: (supplierId: string, amount: number) => void;

  // Expense Actions
  addExpense: (expenseData: Omit<Expense, 'id'>) => Expense;

  // Daily Closing
  performDailyClosing: (actualCash: number, closedBy: string) => DailyClosing;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Lookup
  findMedicineByBarcode: (barcode: string) => Medicine | undefined;

  // Computed KPIs
  kpis: {
    todaySales: number;
    todayOrders: number;
    todayProfit: number;
    lowStockCount: number;
    expiringSoonCount: number;
    expiredCount: number;
    totalCustomerDue: number;
    totalSupplierDue: number;
    monthRevenue: number;
    monthCOGS: number;
    monthGrossProfit: number;
    monthExpenses: number;
    monthNetProfit: number;
  };
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Medicines
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('pharmacare_medicines');
    if (saved) {
      try {
        const parsed: Medicine[] = JSON.parse(saved);
        if (parsed.length < INITIAL_MEDICINES.length) {
          const existingIds = new Set(parsed.map(m => m.id));
          const merged = [...parsed, ...INITIAL_MEDICINES.filter(m => !existingIds.has(m.id))];
          localStorage.setItem('pharmacare_medicines', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch { /* ignore */ }
    }
    return INITIAL_MEDICINES;
  });

  // 2. Sales
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('pharmacare_sales');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SALES;
  });

  // 3. Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('pharmacare_customers');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_CUSTOMERS;
  });

  // 4. Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('pharmacare_suppliers');
    if (saved) {
      try {
        const parsed: Supplier[] = JSON.parse(saved);
        if (parsed.length < INITIAL_SUPPLIERS.length) {
          const existingIds = new Set(parsed.map(s => s.id));
          const merged = [...parsed, ...INITIAL_SUPPLIERS.filter(s => !existingIds.has(s.id))];
          localStorage.setItem('pharmacare_suppliers', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch { /* ignore */ }
    }
    return INITIAL_SUPPLIERS;
  });

  // 5. Prescriptions
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('pharmacare_prescriptions');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_PRESCRIPTIONS;
  });

  // 6. Expenses
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('pharmacare_expenses');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_EXPENSES;
  });

  // 7. Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // 8. Active Receipt for Printing
  const [activeReceiptSale, setActiveReceiptSale] = useState<Sale | null>(null);

  // 9. Daily Closings
  const [dailyClosings, setDailyClosings] = useState<DailyClosing[]>(() => {
    const saved = localStorage.getItem('pharmacare_closings');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  // 10. Returns / Refunds
  const [returns, setReturns] = useState<ReturnRecord[]>(() => {
    const saved = localStorage.getItem('pharmacare_returns');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  // 11. Notifications
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-1',
      type: 'critical',
      title: 'Expired Stock Alert',
      message: 'Ciprocin 500mg Batch CP-098 and Maxpro 20mg Batch MX-701 have expired. Sales are blocked.',
      timestamp: 'Just now',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'warning',
      title: 'Stock Expiring Within 30 Days',
      message: 'Seclo 20mg Batch SC-881 will expire in 25 days. Please prioritize dispensing.',
      timestamp: '10m ago',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'stock',
      title: 'Low Stock Triggered',
      message: 'Sergel 20mg and Alatrol 10mg are below minimum safety threshold. Reorder recommended.',
      timestamp: '1h ago',
      read: false,
    }
  ]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pharmacare_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pharmacare_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('pharmacare_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('pharmacare_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('pharmacare_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('pharmacare_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('pharmacare_closings', JSON.stringify(dailyClosings));
  }, [dailyClosings]);

  useEffect(() => {
    localStorage.setItem('pharmacare_returns', JSON.stringify(returns));
  }, [returns]);

  // ==================== POS / CART ACTIONS ====================

  /**
   * Adds a medicine to cart using FEFO (First Expiry, First Out) batch selection.
   * Proactively blocks expired batches per PRD requirement.
   */
  const addToCart = (medicine: Medicine, preferredBatch?: Batch, qty = 1): { success: boolean; error?: string } => {
    // 1. Determine batch: use preferred batch if given, otherwise apply FEFO
    let batchToUse = preferredBatch;
    if (!batchToUse) {
      const sortedBatches = getFEFOBatches(medicine.batches);
      const validBatches = sortedBatches.filter(b => b.quantity > 0 && getDaysUntilExpiry(b.expiryDate) > 0);
      
      if (validBatches.length > 0) {
        batchToUse = validBatches[0];
      } else {
        // Only expired or zero-stock batches remain
        const firstBatch = sortedBatches[0];
        if (firstBatch && getDaysUntilExpiry(firstBatch.expiryDate) <= 0) {
          sounds.playAlertSound();
          return {
            success: false,
            error: `All available stock for ${medicine.name} is EXPIRED (Batch ${firstBatch.batchNumber}). Sale blocked by system.`
          };
        }
        return {
          success: false,
          error: `No stock currently available for ${medicine.name}.`
        };
      }
    }

    // 2. Check if batch is expired
    if (getDaysUntilExpiry(batchToUse.expiryDate) <= 0) {
      sounds.playAlertSound();
      return {
        success: false,
        error: `Batch ${batchToUse.batchNumber} of ${medicine.name} has expired on ${batchToUse.expiryDate}. Sale is blocked.`
      };
    }

    // 3. Check available quantity
    if (batchToUse.quantity <= 0) {
      return {
        success: false,
        error: `Batch ${batchToUse.batchNumber} has no stock remaining.`
      };
    }

    // 4. Update or add to cart
    setCart(prev => {
      const cartKey = `${medicine.id}-${batchToUse.id}`;
      const existingIndex = prev.findIndex(item => item.id === cartKey);

      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = Math.min(existing.quantity + qty, batchToUse.quantity);
        const discountAmount = (existing.unitPrice * newQty * existing.discountPercent) / 100;
        const total = (existing.unitPrice * newQty) - discountAmount;
        const cogs = batchToUse.purchasePrice * newQty;

        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          discountAmount,
          total,
          cogs
        };
        return updated;
      } else {
        const initialQty = Math.min(qty, batchToUse.quantity);
        const unitPrice = batchToUse.sellingPrice || medicine.sellingPrice;
        const cogs = batchToUse.purchasePrice * initialQty;
        const newItem: CartItem = {
          id: cartKey,
          medicine,
          selectedBatch: batchToUse,
          quantity: initialQty,
          unitPrice,
          discountPercent: 0,
          discountAmount: 0,
          total: unitPrice * initialQty,
          cogs
        };
        return [newItem, ...prev];
      }
    });

    sounds.playBeep();
    return { success: true };
  };

  const updateCartItemQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeCartItem(itemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const boundedQty = Math.min(qty, item.selectedBatch.quantity);
        const discountAmount = (item.unitPrice * boundedQty * item.discountPercent) / 100;
        const total = (item.unitPrice * boundedQty) - discountAmount;
        const cogs = item.selectedBatch.purchasePrice * boundedQty;
        return {
          ...item,
          quantity: boundedQty,
          discountAmount,
          total,
          cogs
        };
      }
      return item;
    }));
  };

  const updateCartItemBatch = (itemId: string, batchId: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const targetBatch = item.medicine.batches.find(b => b.id === batchId);
        if (!targetBatch) return item;
        if (getDaysUntilExpiry(targetBatch.expiryDate) <= 0) {
          sounds.playAlertSound();
          alert(`Batch ${targetBatch.batchNumber} has expired and cannot be selected!`);
          return item;
        }
        const unitPrice = targetBatch.sellingPrice || item.medicine.sellingPrice;
        const boundedQty = Math.min(item.quantity, targetBatch.quantity);
        const discountAmount = (unitPrice * boundedQty * item.discountPercent) / 100;
        const total = (unitPrice * boundedQty) - discountAmount;
        const cogs = targetBatch.purchasePrice * boundedQty;
        return {
          ...item,
          id: `${item.medicine.id}-${targetBatch.id}`,
          selectedBatch: targetBatch,
          unitPrice,
          quantity: boundedQty,
          discountAmount,
          total,
          cogs
        };
      }
      return item;
    }));
  };

  const updateCartItemDiscount = (itemId: string, discountPercent: number) => {
    const validPercent = Math.max(0, Math.min(100, discountPercent));
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const discountAmount = (item.unitPrice * item.quantity * validPercent) / 100;
        const total = (item.unitPrice * item.quantity) - discountAmount;
        return {
          ...item,
          discountPercent: validPercent,
          discountAmount,
          total
        };
      }
      return item;
    }));
  };

  const updateCartItemInstruction = (itemId: string, instruction: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, dosageInstruction: instruction };
      }
      return item;
    }));
  };

  const removeCartItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  /**
   * Completes checkout:
   * - Deducts medicine batch quantities and currentStock.
   * - Records customer due if payment is 'due'.
   * - Generates invoice, triggers chime, launches confetti, and opens thermal receipt.
   */
  const completeSale = (
    paymentMethod: PaymentMethod,
    customerId?: string,
    customerName = 'Walk-in Customer',
    customerPhone?: string,
    amountPaid?: number,
    cashierName = 'Pharmacist on Duty',
    branchId = 'branch-1',
    branchName = 'Dhanmondi Central Branch'
  ) => {
    if (cart.length === 0) {
      return { success: false, error: 'Cart is empty.' };
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const discount = cart.reduce((sum, item) => sum + item.discountAmount, 0);
    const total = cart.reduce((sum, item) => sum + item.total, 0);
    const cogs = cart.reduce((sum, item) => sum + item.cogs, 0);
    const profit = total - cogs;

    const tendered = amountPaid !== undefined ? amountPaid : (paymentMethod === 'due' ? 0 : total);
    const changeAmount = paymentMethod === 'cash' && tendered > total ? tendered - total : 0;
    const dueAmount = paymentMethod === 'due' ? total - tendered : 0;

    const invoiceNumber = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      invoiceNumber,
      dateTime: new Date().toISOString(),
      branchId,
      branchName,
      customerId,
      customerName,
      customerPhone,
      items: [...cart],
      subtotal,
      discount,
      total,
      cogs,
      profit,
      paymentMethod,
      paidAmount: tendered - changeAmount,
      changeAmount,
      dueAmount,
      cashierName,
      status: 'completed'
    };

    // 1. Decrement Stock from Medicines and Batches
    setMedicines(prevMedicines => {
      return prevMedicines.map(med => {
        const soldForThisMed = cart.filter(ci => ci.medicine.id === med.id);
        if (soldForThisMed.length === 0) return med;

        let totalDeducted = 0;
        const updatedBatches = med.batches.map(batch => {
          const soldBatchItem = soldForThisMed.find(ci => ci.selectedBatch.id === batch.id);
          if (soldBatchItem) {
            const newBatchQty = Math.max(0, batch.quantity - soldBatchItem.quantity);
            totalDeducted += soldBatchItem.quantity;
            return { ...batch, quantity: newBatchQty };
          }
          return batch;
        });

        const newStock = Math.max(0, med.currentStock - totalDeducted);
        return {
          ...med,
          currentStock: newStock,
          batches: updatedBatches
        };
      });
    });

    // 2. Update Customer Record if linked
    if (customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === customerId) {
          return {
            ...c,
            dueBalance: c.dueBalance + dueAmount,
            totalPurchases: c.totalPurchases + 1,
            totalSpent: c.totalSpent + (tendered - changeAmount),
            lastVisit: new Date().toISOString().split('T')[0]
          };
        }
        return c;
      }));
    }

    // 3. Save Sale
    setSales(prev => [newSale, ...prev]);

    // 4. Micro-interactions: Audio chime & Confetti!
    sounds.playSuccessChime();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#10b981', '#059669', '#3b82f6', '#f59e0b']
      });
    } catch {
      // Confetti fallback
    }

    // 5. Open Thermal Receipt & Clear Cart
    setActiveReceiptSale(newSale);
    clearCart();

    return { success: true, invoiceNumber, sale: newSale };
  };

  // ==================== INVENTORY ACTIONS ====================

  const addMedicine = (
    medicineData: Omit<Medicine, 'id' | 'batches'>,
    initialBatch?: Omit<Batch, 'id' | 'medicineId'>
  ): Medicine => {
    const medId = `med-${Date.now()}`;
    const batches: Batch[] = [];

    if (initialBatch) {
      batches.push({
        id: `b-${Date.now()}`,
        medicineId: medId,
        ...initialBatch
      });
    }

    const newMed: Medicine = {
      ...medicineData,
      id: medId,
      currentStock: initialBatch ? initialBatch.quantity : medicineData.currentStock,
      batches
    };

    setMedicines(prev => [newMed, ...prev]);
    return newMed;
  };

  const updateMedicine = (updatedMedicine: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updatedMedicine.id ? updatedMedicine : m));
  };

  const addBatchToMedicine = (medicineId: string, batchData: Omit<Batch, 'id' | 'medicineId'>) => {
    setMedicines(prev => prev.map(med => {
      if (med.id === medicineId) {
        const newBatch: Batch = {
          id: `b-${Date.now()}`,
          medicineId,
          ...batchData
        };
        const updatedBatches = [...med.batches, newBatch];
        const newStock = updatedBatches.reduce((acc, b) => acc + b.quantity, 0);
        return {
          ...med,
          currentStock: newStock,
          batches: updatedBatches
        };
      }
      return med;
    }));
  };

  const writeOffExpiredBatch = (medicineId: string, batchId: string, _reason: string) => {
    setMedicines(prev => prev.map(med => {
      if (med.id === medicineId) {
        const batch = med.batches.find(b => b.id === batchId);
        const quantityToRemove = batch ? batch.quantity : 0;
        const updatedBatches = med.batches.filter(b => b.id !== batchId);
        return {
          ...med,
          currentStock: Math.max(0, med.currentStock - quantityToRemove),
          batches: updatedBatches
        };
      }
      return med;
    }));
  };

  // ==================== PURCHASE MANAGEMENT ====================

  const createPurchase = (
    supplierId: string, 
    items: PurchaseItem[], 
    paidAmount: number
  ): Purchase => {
    const supplier = suppliers.find(s => s.id === supplierId);
    const supplierName = supplier ? supplier.name : 'Unknown Supplier';
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const dueAmount = Math.max(0, totalAmount - paidAmount);

    const purchase: Purchase = {
      id: `pur-${Date.now()}`,
      invoiceNumber: `PUR-${Math.floor(10000 + Math.random() * 90000)}`,
      supplierId,
      supplierName,
      dateTime: new Date().toISOString(),
      items,
      totalAmount,
      paidAmount,
      dueAmount,
      status: 'received'
    };

    // Auto-update stock and batches for each medicine
    setMedicines(prevMeds => {
      return prevMeds.map(med => {
        const purchaseLine = items.find(pi => pi.medicineId === med.id);
        if (!purchaseLine) return med;

        // Check if batch already exists or add new
        const existingBatchIndex = med.batches.findIndex(b => b.batchNumber === purchaseLine.batchNumber);
        let updatedBatches = [...med.batches];

        if (existingBatchIndex > -1) {
          const b = updatedBatches[existingBatchIndex];
          updatedBatches[existingBatchIndex] = {
            ...b,
            quantity: b.quantity + purchaseLine.quantity,
            purchasePrice: purchaseLine.purchasePrice,
            sellingPrice: purchaseLine.sellingPrice,
            expiryDate: purchaseLine.expiryDate
          };
        } else {
          updatedBatches.push({
            id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            medicineId: med.id,
            batchNumber: purchaseLine.batchNumber,
            purchaseDate: new Date().toISOString().split('T')[0],
            expiryDate: purchaseLine.expiryDate,
            purchasePrice: purchaseLine.purchasePrice,
            sellingPrice: purchaseLine.sellingPrice,
            quantity: purchaseLine.quantity,
            supplierId
          });
        }

        const newStock = updatedBatches.reduce((acc, b) => acc + b.quantity, 0);
        return {
          ...med,
          currentStock: newStock,
          purchasePrice: purchaseLine.purchasePrice,
          sellingPrice: purchaseLine.sellingPrice,
          batches: updatedBatches
        };
      });
    });

    // Update supplier balance
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return {
          ...s,
          totalPurchases: s.totalPurchases + totalAmount,
          totalPaid: s.totalPaid + paidAmount,
          totalDue: s.totalDue + dueAmount
        };
      }
      return s;
    }));

    sounds.playSuccessChime();
    return purchase;
  };

  // ==================== PRESCRIPTION TO SALE WORKFLOW ====================

  const addPrescription = (rx: Omit<Prescription, 'id' | 'status'>): Prescription => {
    const newRx: Prescription = {
      ...rx,
      id: `rx-${Date.now()}`,
      status: 'pending'
    };
    setPrescriptions(prev => [newRx, ...prev]);
    return newRx;
  };

  /**
   * 1-Click Prescription to POS: Matches prescribed medicines with inventory and adds valid batches to cart.
   */
  const dispensePrescriptionToPos = (rxId: string): { itemsAdded: number; outOfStock: string[] } => {
    const rx = prescriptions.find(p => p.id === rxId);
    if (!rx) return { itemsAdded: 0, outOfStock: [] };

    let itemsAdded = 0;
    const outOfStock: string[] = [];

    rx.medicines.forEach(item => {
      // Try to find medicine by matched ID or by fuzzy name matching
      let med = item.matchedMedicineId ? medicines.find(m => m.id === item.matchedMedicineId) : undefined;
      if (!med) {
        med = medicines.find(m => 
          m.name.toLowerCase().includes(item.name.toLowerCase()) || 
          item.name.toLowerCase().includes(m.name.toLowerCase())
        );
      }

      if (med && med.currentStock > 0) {
        const res = addToCart(med, undefined, 10); // standard 1 strip (10 pcs)
        if (res.success) {
          itemsAdded++;
        } else {
          outOfStock.push(item.name);
        }
      } else {
        outOfStock.push(item.name);
      }
    });

    // Update prescription status
    setPrescriptions(prev => prev.map(p => p.id === rxId ? { ...p, status: 'dispensed' } : p));

    return { itemsAdded, outOfStock };
  };

  // ==================== CUSTOMER & SUPPLIER ACTIONS ====================

  const addCustomer = (customerData: Omit<Customer, 'id' | 'dueBalance' | 'totalPurchases' | 'totalSpent' | 'lastVisit'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      dueBalance: 0,
      totalPurchases: 0,
      totalSpent: 0,
      lastVisit: 'Never'
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const collectCustomerDue = (customerId: string, amount: number, paymentMethod: PaymentMethod) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newDue = Math.max(0, c.dueBalance - amount);
        return {
          ...c,
          dueBalance: newDue
        };
      }
      return c;
    }));

    // Record as a payment in sales ledger
    const customer = customers.find(c => c.id === customerId);
    const saleRecord: Sale = {
      id: `due-collection-${Date.now()}`,
      invoiceNumber: `DUE-COL-${Math.floor(1000 + Math.random() * 9000)}`,
      dateTime: new Date().toISOString(),
      branchId: 'branch-1',
      branchName: 'Dhanmondi Central Branch',
      customerId,
      customerName: customer ? customer.name : 'Customer',
      customerPhone: customer?.phone,
      items: [],
      subtotal: amount,
      discount: 0,
      total: amount,
      cogs: 0,
      profit: amount,
      paymentMethod,
      paidAmount: amount,
      changeAmount: 0,
      dueAmount: 0,
      cashierName: 'Cashier on Duty',
      status: 'completed'
    };
    setSales(prev => [saleRecord, ...prev]);
    sounds.playSuccessChime();
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'totalPurchases' | 'totalPaid' | 'totalDue'>): Supplier => {
    const newSup: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
      totalPurchases: 0,
      totalPaid: 0,
      totalDue: 0
    };
    setSuppliers(prev => [newSup, ...prev]);
    return newSup;
  };

  const recordSupplierPayment = (supplierId: string, amount: number) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        const newDue = Math.max(0, s.totalDue - amount);
        return {
          ...s,
          totalPaid: s.totalPaid + amount,
          totalDue: newDue
        };
      }
      return s;
    }));
  };

  // ==================== EXPENSES ====================

  const addExpense = (expenseData: Omit<Expense, 'id'>): Expense => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
    return newExp;
  };

  // ==================== DAILY CLOSING ====================

  const performDailyClosing = (actualCash: number, closedBy: string): DailyClosing => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysSales = sales.filter(s => s.dateTime.startsWith(todayStr));
    const todaysExpenses = expenses.filter(e => e.date.startsWith(todayStr));

    const totalSales = todaysSales.reduce((sum, s) => sum + s.total, 0);
    const cashSales = todaysSales.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.paidAmount, 0);
    const cardSales = todaysSales.filter(s => s.paymentMethod === 'card').reduce((sum, s) => sum + s.paidAmount, 0);
    const mobileSales = todaysSales.filter(s => ['bkash', 'nagad', 'rocket'].includes(s.paymentMethod)).reduce((sum, s) => sum + s.paidAmount, 0);
    const dueSales = todaysSales.filter(s => s.paymentMethod === 'due').reduce((sum, s) => sum + s.dueAmount, 0);
    
    const refunds = 0; // standard 0 for day
    const expenseTotal = todaysExpenses.reduce((sum, e) => sum + e.amount, 0);

    const expectedCash = cashSales - expenseTotal;
    const difference = actualCash - expectedCash;

    const closing: DailyClosing = {
      id: `close-${Date.now()}`,
      date: todayStr,
      totalSales,
      cashSales,
      cardSales,
      mobileSales,
      dueSales,
      refunds,
      expenses: expenseTotal,
      expectedCash,
      actualCash,
      difference,
      closedBy,
      timestamp: new Date().toISOString()
    };

    setDailyClosings(prev => [closing, ...prev]);
    return closing;
  };

  // ==================== RETURN & REFUND ====================

  const processReturn = (
    saleId: string,
    invoiceNumber: string,
    medicineId: string,
    medicineName: string,
    batchNumber: string,
    quantity: number,
    refundAmount: number,
    reason: ReturnRecord['reason'],
    customerName: string,
    processedBy: string
  ) => {
    const returnRecord: ReturnRecord = {
      id: `ret-${Date.now()}`,
      returnNumber: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      saleId,
      invoiceNumber,
      dateTime: new Date().toISOString(),
      customerName,
      medicineName,
      batchNumber,
      quantity,
      refundAmount,
      reason,
      processedBy
    };

    setReturns(prev => [returnRecord, ...prev]);

    // Restore stock to batch if not physically damaged
    if (reason !== 'damaged') {
      setMedicines(prev => prev.map(med => {
        if (med.id === medicineId) {
          const updatedBatches = med.batches.map(b => {
            if (b.batchNumber === batchNumber) {
              return { ...b, quantity: b.quantity + quantity };
            }
            return b;
          });
          return {
            ...med,
            currentStock: med.currentStock + quantity,
            batches: updatedBatches
          };
        }
        return med;
      }));
    }

    sounds.playSuccessChime();
  };

  // ==================== BACKUP & RESET ====================

  const resetToDemoData = () => {
    if (confirm('Are you sure you want to reset all pharmacy data back to the default pre-seeded dataset?')) {
      localStorage.clear();
      setMedicines(INITIAL_MEDICINES);
      setSales(INITIAL_SALES);
      setCustomers(INITIAL_CUSTOMERS);
      setSuppliers(INITIAL_SUPPLIERS);
      setPrescriptions(INITIAL_PRESCRIPTIONS);
      setExpenses(INITIAL_EXPENSES);
      setDailyClosings([]);
      setReturns([]);
      window.location.reload();
    }
  };

  const exportBackupJson = () => {
    const backupData = {
      medicines,
      sales,
      customers,
      suppliers,
      prescriptions,
      expenses,
      dailyClosings,
      returns,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacare-saas-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==================== LOOKUP & HELPERS ====================

  const findMedicineByBarcode = (barcode: string): Medicine | undefined => {
    return medicines.find(m => m.barcode === barcode || m.batches.some(b => b.batchNumber === barcode));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // ==================== COMPUTED KPIS ====================

  const kpis = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysSales = sales.filter(s => s.dateTime.startsWith(todayStr));

    const todaySales = todaysSales.reduce((acc, s) => acc + s.total, 0);
    const todayOrders = todaysSales.length;
    const todayProfit = todaysSales.reduce((acc, s) => acc + s.profit, 0);

    let lowStockCount = 0;
    let expiredCount = 0;
    let expiringSoonCount = 0;

    medicines.forEach(m => {
      if (m.currentStock <= m.minStock) {
        lowStockCount++;
      }
      m.batches.forEach(b => {
        const days = getDaysUntilExpiry(b.expiryDate);
        if (days <= 0) expiredCount++;
        else if (days <= 30) expiringSoonCount++;
      });
    });

    const totalCustomerDue = customers.reduce((sum, c) => sum + c.dueBalance, 0);
    const totalSupplierDue = suppliers.reduce((sum, s) => sum + s.totalDue, 0);

    // Monthly Figures
    const monthSales = sales;
    const monthRevenue = monthSales.reduce((acc, s) => acc + s.total, 0);
    const monthCOGS = monthSales.reduce((acc, s) => acc + s.cogs, 0);
    const monthGrossProfit = monthRevenue - monthCOGS;
    const monthExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const monthNetProfit = monthGrossProfit - monthExpenses;

    return {
      todaySales,
      todayOrders,
      todayProfit,
      lowStockCount,
      expiringSoonCount,
      expiredCount,
      totalCustomerDue,
      totalSupplierDue,
      monthRevenue,
      monthCOGS,
      monthGrossProfit,
      monthExpenses,
      monthNetProfit
    };
  }, [medicines, sales, customers, suppliers, expenses]);

  return (
    <PharmacyContext.Provider
      value={{
        medicines,
        sales,
        customers,
        suppliers,
        prescriptions,
        expenses,
        cart,
        activeReceiptSale,
        dailyClosings,
        notifications,
        returns,
        addToCart,
        updateCartItemQty,
        updateCartItemBatch,
        updateCartItemDiscount,
        updateCartItemInstruction,
        removeCartItem,
        clearCart,
        completeSale,
        setActiveReceiptSale,
        processReturn,
        resetToDemoData,
        exportBackupJson,
        addMedicine,
        updateMedicine,
        addBatchToMedicine,
        writeOffExpiredBatch,
        createPurchase,
        addPrescription,
        dispensePrescriptionToPos,
        addCustomer,
        collectCustomerDue,
        addSupplier,
        recordSupplierPayment,
        addExpense,
        performDailyClosing,
        markNotificationAsRead,
        clearAllNotifications,
        findMedicineByBarcode,
        kpis
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
