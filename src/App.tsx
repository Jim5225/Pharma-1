import React, { useState, useEffect } from 'react';
import { AuthRoleProvider, useAuthRole } from './context/AuthRoleContext';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { PosScreen } from './components/pos/PosScreen';
import { InventoryList } from './components/inventory/InventoryList';
import { ExpiryCenter } from './components/expiry/ExpiryCenter';
import { PurchaseList } from './components/purchases/PurchaseList';
import { PrescriptionManager } from './components/prescriptions/PrescriptionManager';
import { CustomerDueLedger } from './components/customers/CustomerDueLedger';
import { SupplierList } from './components/suppliers/SupplierList';
import { ExpenseList } from './components/expenses/ExpenseList';
import { ReportsDashboard } from './components/reports/ReportsDashboard';
import { SalesList } from './components/sales/SalesList';

// Modals
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ThermalReceiptModal } from './components/common/ThermalReceiptModal';
import { AddMedicineModal } from './components/inventory/AddMedicineModal';
import { NewPurchaseModal } from './components/purchases/NewPurchaseModal';
import { BarcodeScannerModal } from './components/pos/BarcodeScannerModal';
import { DailyClosingModal } from './components/closing/DailyClosingModal';
import { PacketOcrScannerModal } from './components/scanner/PacketOcrScannerModal';
import { Sale } from './types';

const MainAppContent: React.FC = () => {
  const { currentRole, canAccess } = useAuthRole();
  const { activeReceiptSale, setActiveReceiptSale, findMedicineByBarcode, addToCart } = usePharmacy();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isClosingOpen, setIsClosingOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isPacketScannerOpen, setIsPacketScannerOpen] = useState(false);

  // If role changes and cannot access current tab, fallback to dashboard
  useEffect(() => {
    if (!canAccess(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [currentRole, activeTab, canAccess]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K for Global Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      // F2 for POS
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('pos');
      }
      // F4 for Barcode
      if (e.key === 'F4') {
        e.preventDefault();
        setIsBarcodeOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBarcodeScanned = (barcode: string) => {
    const med = findMedicineByBarcode(barcode);
    if (med) {
      addToCart(med);
      setActiveTab('pos');
    } else {
      alert(`Barcode ${barcode} not found in inventory.`);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* 240px Fixed Sidebar for Desktop */}
      <div className="hidden md:flex h-full">
        <Sidebar
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenClosingModal={() => setIsClosingOpen(true)}
        />
      </div>

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigate={(tab) => setActiveTab(tab)}
        />

        {/* Scrollable View Container with mobile bottom bar clearance */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-[1440px] mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
                onOpenAddCustomer={() => setActiveTab('customers')}
                onOpenNewPurchase={() => setIsNewPurchaseOpen(true)}
                onOpenBarcodeModal={() => setIsBarcodeOpen(true)}
                onOpenPacketScanner={() => setIsPacketScannerOpen(true)}
                onViewInvoice={(sale: Sale) => setActiveReceiptSale(sale)}
              />
            )}

            {activeTab === 'pos' && (
              <PosScreen
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenAddCustomer={() => setActiveTab('customers')}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryList
                onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'expiry' && (
              <ExpiryCenter />
            )}

            {activeTab === 'purchases' && (
              <PurchaseList
                onOpenNewPurchase={() => setIsNewPurchaseOpen(true)}
              />
            )}

            {activeTab === 'prescriptions' && (
              <PrescriptionManager
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'customers' && (
              <CustomerDueLedger />
            )}

            {activeTab === 'suppliers' && (
              <SupplierList />
            )}

            {activeTab === 'expenses' && (
              <ExpenseList />
            )}

            {activeTab === 'reports' && (
              <ReportsDashboard />
            )}

            {activeTab === 'sales' && (
              <SalesList
                onViewInvoice={(sale: Sale) => setActiveReceiptSale(sale)}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation with Floating Camera & Drawer */}
        <MobileNav
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenMoreMenu={() => setIsClosingOpen(true)}
          onOpenPacketScanner={() => setIsPacketScannerOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      </div>

      {/* ==================== GLOBAL MODALS ==================== */}

      {/* Global Search (Ctrl + K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* 58mm / 80mm Thermal Receipt Printer Modal */}
      <ThermalReceiptModal
        sale={activeReceiptSale}
        onClose={() => setActiveReceiptSale(null)}
      />

      {/* Packet OCR Scanner Modal (AI Photo Grab) */}
      <PacketOcrScannerModal
        isOpen={isPacketScannerOpen}
        onClose={() => setIsPacketScannerOpen(false)}
      />

      {/* Add New Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddMedicineOpen}
        onClose={() => setIsAddMedicineOpen(false)}
      />

      {/* New Purchase Modal */}
      <NewPurchaseModal
        isOpen={isNewPurchaseOpen}
        onClose={() => setIsNewPurchaseOpen(false)}
      />

      {/* Barcode Scanner Modal (F4) */}
      <BarcodeScannerModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        onProductScanned={handleBarcodeScanned}
      />

      {/* End of Day Daily Closing Modal */}
      <DailyClosingModal
        isOpen={isClosingOpen}
        onClose={() => setIsClosingOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthRoleProvider>
      <PharmacyProvider>
        <MainAppContent />
      </PharmacyProvider>
    </AuthRoleProvider>
  );
}
