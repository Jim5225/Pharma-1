import { 
  Medicine, 
  Supplier, 
  Customer, 
  Prescription, 
  Expense, 
  Branch, 
  Sale 
} from '../types';

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'branch-1', name: 'Dhanmondi Central Branch', code: 'DHD-01', address: 'House 42, Road 7/A, Dhanmondi, Dhaka', phone: '+880 1711-234567' },
  { id: 'branch-2', name: 'Gulshan Model Town Branch', code: 'GLS-02', address: 'Plot 18, Road 113, Gulshan-2, Dhaka', phone: '+880 1819-345678' },
  { id: 'branch-3', name: 'Uttara Sector 7 Branch', code: 'UTR-03', address: 'Sector 7, Sonargaon Janapath, Uttara, Dhaka', phone: '+880 1912-456789' }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Square Pharmaceuticals Ltd.',
    company: 'Square Group',
    phone: '+880 2-8833047',
    email: 'distribution@squarepharma.com.bd',
    address: 'Square Centre, 48 Mohakhali C/A, Dhaka-1212',
    paymentTerms: 'Net 30 Days',
    totalPurchases: 285400,
    totalPaid: 260000,
    totalDue: 25400
  },
  {
    id: 'sup-2',
    name: 'Beximco Pharmaceuticals Ltd.',
    company: 'Beximco Group',
    phone: '+880 2-58611001',
    email: 'sales@bpl.net',
    address: '19 Dhanmondi R/A, Road No. 7, Dhaka-1205',
    paymentTerms: 'Net 15 Days',
    totalPurchases: 194200,
    totalPaid: 180000,
    totalDue: 14200
  },
  {
    id: 'sup-3',
    name: 'Incepta Pharmaceuticals Ltd.',
    company: 'Incepta Group',
    phone: '+880 2-8891688',
    email: 'trade@inceptapharma.com',
    address: '40 Shahid Tajuddin Ahmed Sarani, Tejgaon I/A, Dhaka',
    paymentTerms: 'Net 30 Days',
    totalPurchases: 142000,
    totalPaid: 142000,
    totalDue: 0
  },
  {
    id: 'sup-4',
    name: 'Renata Limited',
    company: 'Renata Pharma',
    phone: '+880 2-8001450',
    email: 'contact@renata-ltd.com',
    address: 'Plot # 1, Milk Vita Road, Section-7, Mirpur, Dhaka',
    paymentTerms: 'Net 45 Days',
    totalPurchases: 89000,
    totalPaid: 80000,
    totalDue: 9000
  },
  {
    id: 'sup-5',
    name: 'The ACME Laboratories Ltd.',
    company: 'ACME Group',
    phone: '+880 2-9004194',
    email: 'supply@acmeglobal.com',
    address: '1/4, Kallayanpur, Mirpur Road, Dhaka-1207',
    paymentTerms: 'Net 30 Days',
    totalPurchases: 64500,
    totalPaid: 64500,
    totalDue: 0
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rahim Ahmed',
    phone: '01712-345678',
    address: 'Flat 4B, Road 4, Dhanmondi',
    dueBalance: 2450,
    totalPurchases: 18,
    totalSpent: 16800,
    lastVisit: '2026-09-08'
  },
  {
    id: 'cust-2',
    name: 'Shamima Akhter',
    phone: '01819-876543',
    address: 'House 12, Road 11, Dhanmondi',
    dueBalance: 1200,
    totalPurchases: 12,
    totalSpent: 9400,
    lastVisit: '2026-09-09'
  },
  {
    id: 'cust-3',
    name: 'Tanvir Hasan',
    phone: '01911-554433',
    address: 'Lake Circus, Kalabagan, Dhaka',
    dueBalance: 0,
    totalPurchases: 25,
    totalSpent: 28500,
    lastVisit: '2026-09-10'
  },
  {
    id: 'cust-4',
    name: 'Nusrat Jahan',
    phone: '01678-990011',
    address: 'Green Corner, Green Road, Dhaka',
    dueBalance: 850,
    totalPurchases: 7,
    totalSpent: 6200,
    lastVisit: '2026-09-07'
  },
  {
    id: 'cust-5',
    name: 'Anisur Rahman',
    phone: '01552-443322',
    address: 'Jigatola Bus Stand, Dhaka',
    dueBalance: 0,
    totalPurchases: 31,
    totalSpent: 42100,
    lastVisit: '2026-09-10'
  }
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Napa',
    genericName: 'Paracetamol',
    brand: 'Beximco',
    manufacturer: 'Beximco Pharmaceuticals Ltd.',
    category: 'Analgesic & Antipyretic',
    dosageForm: 'Tablet',
    strength: '500mg',
    unit: 'Box (510 pcs)',
    barcode: '8941112001',
    sku: 'NAP-500-TAB',
    purchasePrice: 1.00,
    sellingPrice: 1.20,
    mrp: 1.20,
    minSellingPrice: 1.10,
    currentStock: 420,
    minStock: 100,
    maxStock: 1000,
    reorderQuantity: 500,
    supplierId: 'sup-2',
    batches: [
      {
        id: 'b-101',
        medicineId: 'med-1',
        batchNumber: 'NP-26A',
        purchaseDate: '2026-01-10',
        expiryDate: '2027-02-15',
        purchasePrice: 1.00,
        sellingPrice: 1.20,
        quantity: 120,
        supplierId: 'sup-2'
      },
      {
        id: 'b-102',
        medicineId: 'med-1',
        batchNumber: 'NP-26B',
        purchaseDate: '2026-04-12',
        expiryDate: '2027-08-30',
        purchasePrice: 1.00,
        sellingPrice: 1.20,
        quantity: 300,
        supplierId: 'sup-2'
      }
    ]
  },
  {
    id: 'med-2',
    name: 'Napa Extra',
    genericName: 'Paracetamol + Caffeine',
    brand: 'Beximco',
    manufacturer: 'Beximco Pharmaceuticals Ltd.',
    category: 'Analgesic',
    dosageForm: 'Tablet',
    strength: '500mg + 65mg',
    unit: 'Strip (10 pcs)',
    barcode: '8941112002',
    sku: 'NAP-EXT-TAB',
    purchasePrice: 2.20,
    sellingPrice: 2.50,
    mrp: 2.50,
    minSellingPrice: 2.35,
    currentStock: 180,
    minStock: 50,
    maxStock: 500,
    reorderQuantity: 250,
    supplierId: 'sup-2',
    batches: [
      {
        id: 'b-103',
        medicineId: 'med-2',
        batchNumber: 'NX-110',
        purchaseDate: '2026-02-14',
        expiryDate: '2027-04-20',
        purchasePrice: 2.20,
        sellingPrice: 2.50,
        quantity: 180,
        supplierId: 'sup-2'
      }
    ]
  },
  {
    id: 'med-3',
    name: 'Seclo',
    genericName: 'Omeprazole',
    brand: 'Square',
    manufacturer: 'Square Pharmaceuticals Ltd.',
    category: 'Antacid / PPI',
    dosageForm: 'Capsule',
    strength: '20mg',
    unit: 'Strip (10 pcs)',
    barcode: '8941112003',
    sku: 'SEC-020-CAP',
    purchasePrice: 5.20,
    sellingPrice: 6.00,
    mrp: 6.00,
    minSellingPrice: 5.60,
    currentStock: 160,
    minStock: 60,
    maxStock: 600,
    reorderQuantity: 300,
    supplierId: 'sup-1',
    batches: [
      {
        id: 'b-104',
        medicineId: 'med-3',
        batchNumber: 'SC-881',
        purchaseDate: '2025-11-05',
        expiryDate: '2026-10-05', // Expiring in ~25 days (Critical Alert)
        purchasePrice: 5.20,
        sellingPrice: 6.00,
        quantity: 40,
        supplierId: 'sup-1'
      },
      {
        id: 'b-105',
        medicineId: 'med-3',
        batchNumber: 'SC-924',
        purchaseDate: '2026-03-10',
        expiryDate: '2027-11-20',
        purchasePrice: 5.20,
        sellingPrice: 6.00,
        quantity: 120,
        supplierId: 'sup-1'
      }
    ]
  },
  {
    id: 'med-4',
    name: 'Sergel',
    genericName: 'Esomeprazole',
    brand: 'Incepta',
    manufacturer: 'Incepta Pharmaceuticals Ltd.',
    category: 'Antacid / PPI',
    dosageForm: 'Capsule',
    strength: '20mg',
    unit: 'Strip (10 pcs)',
    barcode: '8941112004',
    sku: 'SER-020-CAP',
    purchasePrice: 6.10,
    sellingPrice: 7.00,
    mrp: 7.00,
    minSellingPrice: 6.50,
    currentStock: 8, // Low Stock trigger (< 30 min stock)
    minStock: 30,
    maxStock: 200,
    reorderQuantity: 150,
    supplierId: 'sup-3',
    batches: [
      {
        id: 'b-106',
        medicineId: 'med-4',
        batchNumber: 'SR-412',
        purchaseDate: '2026-02-01',
        expiryDate: '2027-06-15',
        purchasePrice: 6.10,
        sellingPrice: 7.00,
        quantity: 8,
        supplierId: 'sup-3'
      }
    ]
  },
  {
    id: 'med-5',
    name: 'Ciprocin',
    genericName: 'Ciprofloxacin',
    brand: 'Square',
    manufacturer: 'Square Pharmaceuticals Ltd.',
    category: 'Antibiotic',
    dosageForm: 'Tablet',
    strength: '500mg',
    unit: 'Strip (10 pcs)',
    barcode: '8941112005',
    sku: 'CIP-500-TAB',
    purchasePrice: 12.50,
    sellingPrice: 15.00,
    mrp: 15.00,
    minSellingPrice: 14.00,
    currentStock: 95,
    minStock: 40,
    maxStock: 300,
    reorderQuantity: 150,
    supplierId: 'sup-1',
    batches: [
      {
        id: 'b-107',
        medicineId: 'med-5',
        batchNumber: 'CP-098',
        purchaseDate: '2025-05-10',
        expiryDate: '2026-08-15', // Already Expired (Test blocker!)
        purchasePrice: 12.50,
        sellingPrice: 15.00,
        quantity: 25,
        supplierId: 'sup-1'
      },
      {
        id: 'b-108',
        medicineId: 'med-5',
        batchNumber: 'CP-152',
        purchaseDate: '2026-01-20',
        expiryDate: '2027-09-10',
        purchasePrice: 12.50,
        sellingPrice: 15.00,
        quantity: 70,
        supplierId: 'sup-1'
      }
    ]
  },
  {
    id: 'med-6',
    name: 'Alatrol',
    genericName: 'Cetirizine Hydrochloride',
    brand: 'Square',
    manufacturer: 'Square Pharmaceuticals Ltd.',
    category: 'Antihistamine',
    dosageForm: 'Tablet',
    strength: '10mg',
    unit: 'Strip (10 pcs)',
    barcode: '8941112006',
    sku: 'ALA-010-TAB',
    purchasePrice: 2.80,
    sellingPrice: 3.50,
    mrp: 3.50,
    minSellingPrice: 3.00,
    currentStock: 6, // Low stock alert
    minStock: 25,
    maxStock: 150,
    reorderQuantity: 100,
    supplierId: 'sup-1',
    batches: [
      {
        id: 'b-109',
        medicineId: 'med-6',
        batchNumber: 'AL-331',
        purchaseDate: '2026-03-01',
        expiryDate: '2027-10-30',
        purchasePrice: 2.80,
        sellingPrice: 3.50,
        quantity: 6,
        supplierId: 'sup-1'
      }
    ]
  },
  {
    id: 'med-7',
    name: 'Zimax',
    genericName: 'Azithromycin',
    brand: 'Beximco',
    manufacturer: 'Beximco Pharmaceuticals Ltd.',
    category: 'Antibiotic',
    dosageForm: 'Tablet',
    strength: '500mg',
    unit: 'Strip (6 pcs)',
    barcode: '8941112007',
    sku: 'ZIM-500-TAB',
    purchasePrice: 28.00,
    sellingPrice: 35.00,
    mrp: 35.00,
    minSellingPrice: 32.00,
    currentStock: 54,
    minStock: 20,
    maxStock: 200,
    reorderQuantity: 100,
    supplierId: 'sup-2',
    batches: [
      {
        id: 'b-110',
        medicineId: 'med-7',
        batchNumber: 'ZX-812',
        purchaseDate: '2026-02-18',
        expiryDate: '2027-12-01',
        purchasePrice: 28.00,
        sellingPrice: 35.00,
        quantity: 54,
        supplierId: 'sup-2'
      }
    ]
  },
  {
    id: 'med-8',
    name: 'Montene',
    genericName: 'Montelukast Sodium',
    brand: 'Incepta',
    manufacturer: 'Incepta Pharmaceuticals Ltd.',
    category: 'Respiratory / Anti-asthmatic',
    dosageForm: 'Tablet',
    strength: '10mg',
    unit: 'Strip (10 pcs)',
    barcode: '8941112008',
    sku: 'MON-010-TAB',
    purchasePrice: 14.00,
    sellingPrice: 17.50,
    mrp: 17.50,
    minSellingPrice: 16.00,
    currentStock: 80,
    minStock: 30,
    maxStock: 300,
    reorderQuantity: 150,
    supplierId: 'sup-3',
    batches: [
      {
        id: 'b-111',
        medicineId: 'med-8',
        batchNumber: 'MN-903',
        purchaseDate: '2026-01-15',
        expiryDate: '2026-10-25', // Expiring in ~45 days (Warning Alert)
        purchasePrice: 14.00,
        sellingPrice: 17.50,
        quantity: 30,
        supplierId: 'sup-3'
      },
      {
        id: 'b-112',
        medicineId: 'med-8',
        batchNumber: 'MN-944',
        purchaseDate: '2026-04-05',
        expiryDate: '2028-01-10',
        purchasePrice: 14.00,
        sellingPrice: 17.50,
        quantity: 50,
        supplierId: 'sup-3'
      }
    ]
  },
  {
    id: 'med-9',
    name: 'Tufnil',
    genericName: 'Tolfenamic Acid',
    brand: 'Renata',
    manufacturer: 'Renata Limited',
    category: 'Anti-migraine',
    dosageForm: 'Tablet',
    strength: '200mg',
    unit: 'Strip (10 pcs)',
    barcode: '8941112009',
    sku: 'TUF-200-TAB',
    purchasePrice: 8.50,
    sellingPrice: 10.00,
    mrp: 10.00,
    minSellingPrice: 9.50,
    currentStock: 4, // Critical low stock
    minStock: 20,
    maxStock: 150,
    reorderQuantity: 100,
    supplierId: 'sup-4',
    batches: [
      {
        id: 'b-113',
        medicineId: 'med-9',
        batchNumber: 'TF-202',
        purchaseDate: '2026-02-28',
        expiryDate: '2027-08-15',
        purchasePrice: 8.50,
        sellingPrice: 10.00,
        quantity: 4,
        supplierId: 'sup-4'
      }
    ]
  },
  {
    id: 'med-10',
    name: 'Maxpro',
    genericName: 'Esomeprazole Magnesium',
    brand: 'Renata',
    manufacturer: 'Renata Limited',
    category: 'Antacid / PPI',
    dosageForm: 'Tablet',
    strength: '20mg',
    unit: 'Strip (10 pcs)',
    barcode: '8941112010',
    sku: 'MAX-020-TAB',
    purchasePrice: 6.00,
    sellingPrice: 7.00,
    mrp: 7.00,
    minSellingPrice: 6.50,
    currentStock: 120,
    minStock: 40,
    maxStock: 400,
    reorderQuantity: 200,
    supplierId: 'sup-4',
    batches: [
      {
        id: 'b-114',
        medicineId: 'med-10',
        batchNumber: 'MX-701',
        purchaseDate: '2025-06-10',
        expiryDate: '2026-07-20', // Expired batch
        purchasePrice: 6.00,
        sellingPrice: 7.00,
        quantity: 20,
        supplierId: 'sup-4'
      },
      {
        id: 'b-115',
        medicineId: 'med-10',
        batchNumber: 'MX-845',
        purchaseDate: '2026-03-12',
        expiryDate: '2027-11-30',
        purchasePrice: 6.00,
        sellingPrice: 7.00,
        quantity: 100,
        supplierId: 'sup-4'
      }
    ]
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    invoiceNumber: 'INV-10450',
    dateTime: '2026-09-10T10:15:00',
    branchId: 'branch-1',
    branchName: 'Dhanmondi Central Branch',
    customerId: 'cust-1',
    customerName: 'Rahim Ahmed',
    customerPhone: '01712-345678',
    items: [
      {
        id: 'ci-1',
        medicine: INITIAL_MEDICINES[0], // Napa
        selectedBatch: INITIAL_MEDICINES[0].batches[0],
        quantity: 20,
        unitPrice: 1.20,
        discountPercent: 0,
        discountAmount: 0,
        total: 24.00,
        cogs: 20.00
      },
      {
        id: 'ci-2',
        medicine: INITIAL_MEDICINES[2], // Seclo
        selectedBatch: INITIAL_MEDICINES[2].batches[1],
        quantity: 10,
        unitPrice: 6.00,
        discountPercent: 0,
        discountAmount: 0,
        total: 60.00,
        cogs: 52.00
      }
    ],
    subtotal: 84.00,
    discount: 0,
    total: 84.00,
    cogs: 72.00,
    profit: 12.00,
    paymentMethod: 'cash',
    paidAmount: 100.00,
    changeAmount: 16.00,
    dueAmount: 0,
    cashierName: 'Dr. Rahman (Pharmacist)',
    status: 'completed'
  },
  {
    id: 'sale-2',
    invoiceNumber: 'INV-10451',
    dateTime: '2026-09-10T11:42:00',
    branchId: 'branch-1',
    branchName: 'Dhanmondi Central Branch',
    customerId: 'cust-3',
    customerName: 'Tanvir Hasan',
    customerPhone: '01911-554433',
    items: [
      {
        id: 'ci-3',
        medicine: INITIAL_MEDICINES[6], // Zimax 500mg
        selectedBatch: INITIAL_MEDICINES[6].batches[0],
        quantity: 6,
        unitPrice: 35.00,
        discountPercent: 5,
        discountAmount: 10.50,
        total: 199.50,
        cogs: 168.00
      }
    ],
    subtotal: 210.00,
    discount: 10.50,
    total: 199.50,
    cogs: 168.00,
    profit: 31.50,
    paymentMethod: 'bkash',
    paidAmount: 199.50,
    changeAmount: 0,
    dueAmount: 0,
    cashierName: 'Dr. Rahman (Pharmacist)',
    status: 'completed'
  },
  {
    id: 'sale-3',
    invoiceNumber: 'INV-10452',
    dateTime: '2026-09-10T14:20:00',
    branchId: 'branch-1',
    branchName: 'Dhanmondi Central Branch',
    customerId: 'cust-2',
    customerName: 'Shamima Akhter',
    customerPhone: '01819-876543',
    items: [
      {
        id: 'ci-4',
        medicine: INITIAL_MEDICINES[4], // Ciprocin
        selectedBatch: INITIAL_MEDICINES[4].batches[1],
        quantity: 14,
        unitPrice: 15.00,
        discountPercent: 0,
        discountAmount: 0,
        total: 210.00,
        cogs: 175.00
      },
      {
        id: 'ci-5',
        medicine: INITIAL_MEDICINES[7], // Montene
        selectedBatch: INITIAL_MEDICINES[7].batches[1],
        quantity: 20,
        unitPrice: 17.50,
        discountPercent: 0,
        discountAmount: 0,
        total: 350.00,
        cogs: 280.00
      }
    ],
    subtotal: 560.00,
    discount: 0,
    total: 560.00,
    cogs: 455.00,
    profit: 105.00,
    paymentMethod: 'due',
    paidAmount: 200.00,
    changeAmount: 0,
    dueAmount: 360.00,
    cashierName: 'Kazi Tanvir (Cashier)',
    status: 'completed'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    prescriptionNumber: 'RX-2026-0821',
    patientName: 'Mrs. Salma Begum',
    patientAge: 48,
    patientGender: 'Female',
    doctorName: 'Prof. Dr. M. A. Jalil (Cardiologist)',
    hospital: 'Labaid Specialized Hospital, Dhanmondi',
    date: '2026-09-09',
    notes: 'Patient complaints of persistent heartburn and chest tightness after meals.',
    status: 'pending',
    medicines: [
      {
        name: 'Seclo 20mg',
        dosage: '1 Cap',
        frequency: '1 + 0 + 1 (Before meal)',
        duration: '14 days',
        instructions: 'Take 30 minutes before breakfast and dinner',
        matchedMedicineId: 'med-3'
      },
      {
        name: 'Napa Extra',
        dosage: '1 Tab',
        frequency: '1 + 0 + 1 (If pain persists)',
        duration: '5 days',
        instructions: 'Take after meal when headache or body ache occurs',
        matchedMedicineId: 'med-2'
      },
      {
        name: 'Montene 10mg',
        dosage: '1 Tab',
        frequency: '0 + 0 + 1 (At bedtime)',
        duration: '1 month',
        instructions: 'Take at night before sleeping',
        matchedMedicineId: 'med-8'
      }
    ]
  },
  {
    id: 'rx-2',
    prescriptionNumber: 'RX-2026-0822',
    patientName: 'Master Abrar Zahin',
    patientAge: 12,
    patientGender: 'Male',
    doctorName: 'Dr. Farhana Yasmin (Pediatrician)',
    hospital: 'Popular Diagnostic Center, Dhanmondi',
    date: '2026-09-10',
    notes: 'Seasonal allergic rhinitis and dry cough.',
    status: 'pending',
    medicines: [
      {
        name: 'Alatrol 10mg',
        dosage: '1/2 Tab',
        frequency: '0 + 0 + 1 (At bedtime)',
        duration: '7 days',
        instructions: 'At bedtime',
        matchedMedicineId: 'med-6'
      },
      {
        name: 'Napa 500mg',
        dosage: '1 Tab',
        frequency: '1 + 1 + 1 (For fever)',
        duration: '3 days',
        instructions: 'Only if body temperature exceeds 100°F',
        matchedMedicineId: 'med-1'
      }
    ]
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    category: 'Rent',
    amount: 35000,
    date: '2026-09-01',
    paymentMethod: 'Bank Transfer',
    note: 'September shop rent for Dhanmondi premises'
  },
  {
    id: 'exp-2',
    category: 'Electricity',
    amount: 7850,
    date: '2026-09-05',
    paymentMethod: 'bKash Merchant',
    note: 'DESCO electricity bill for air-conditioning and refrigeration'
  },
  {
    id: 'exp-3',
    category: 'Internet',
    amount: 1500,
    date: '2026-09-04',
    paymentMethod: 'Cash',
    note: 'Carnival Broadband 50 Mbps optical fiber'
  },
  {
    id: 'exp-4',
    category: 'Transport',
    amount: 650,
    date: '2026-09-09',
    paymentMethod: 'Cash',
    note: 'Emergency stock courier collection from Mitford market'
  }
];
