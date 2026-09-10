export type DosageForm = 
  | 'Tablet' 
  | 'Capsule' 
  | 'Syrup' 
  | 'Suspension' 
  | 'Injection' 
  | 'Ointment' 
  | 'Eye Drops'
  | 'Inhaler';

export type ExpiryStatus = 'expired' | 'critical' | 'warning' | 'safe';

export type StockStatus = 'out_of_stock' | 'low_stock' | 'healthy' | 'overstocked';

export interface Batch {
  id: string;
  medicineId: string;
  batchNumber: string;
  purchaseDate: string;
  expiryDate: string; // YYYY-MM-DD
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  supplierId: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  manufacturer: string;
  category: string;
  dosageForm: DosageForm;
  strength: string;
  unit: string;
  barcode: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  minSellingPrice?: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderQuantity: number;
  supplierId: string;
  batches: Batch[];
}

export interface CartItem {
  id: string; // Unique cart item key
  medicine: Medicine;
  selectedBatch: Batch;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  cogs: number; // Cost basis for calculating profit
  dosageInstruction?: string; // e.g. "১+০+১ খাবারের পরে"
}

export interface ReturnRecord {
  id: string;
  returnNumber: string;
  saleId: string;
  invoiceNumber: string;
  dateTime: string;
  customerName: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  refundAmount: number;
  reason: 'wrong_medicine' | 'damaged' | 'customer_return' | 'other';
  processedBy: string;
}

export type PaymentMethod = 'cash' | 'card' | 'bkash' | 'nagad' | 'rocket' | 'due';

export interface Sale {
  id: string;
  invoiceNumber: string;
  dateTime: string;
  branchId: string;
  branchName: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  cogs: number;
  profit: number;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  changeAmount: number;
  dueAmount: number;
  cashierName: string;
  status: 'completed' | 'refunded';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  dueBalance: number;
  totalPurchases: number;
  totalSpent: number;
  lastVisit: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: string;
  totalPurchases: number;
  totalPaid: number;
  totalDue: number;
}

export interface PurchaseItem {
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  dateTime: string;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'received' | 'pending';
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  matchedMedicineId?: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  doctorName: string;
  hospital?: string;
  date: string;
  medicines: PrescriptionMedicine[];
  notes?: string;
  imageUrl?: string;
  status: 'pending' | 'dispensed' | 'completed';
}

export type ExpenseCategory = 
  | 'Rent' 
  | 'Electricity' 
  | 'Salary' 
  | 'Transport' 
  | 'Internet' 
  | 'Maintenance' 
  | 'Other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: string;
  note: string;
}

export interface DailyClosing {
  id: string;
  date: string;
  totalSales: number;
  cashSales: number;
  cardSales: number;
  mobileSales: number;
  dueSales: number;
  refunds: number;
  expenses: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  closedBy: string;
  timestamp: string;
}

export type UserRole = 'owner' | 'pharmacist' | 'cashier';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
}

export interface SystemNotification {
  id: string;
  type: 'critical' | 'warning' | 'stock' | 'due' | 'info';
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  timestamp: string;
  read: boolean;
}
