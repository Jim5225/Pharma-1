import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Barcode, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Wallet, 
  CheckCircle2, 
  User, 
  UserPlus, 
  AlertCircle, 
  Layers, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { Medicine, Batch, PaymentMethod, Customer } from '../../types';
import { formatBDT, getFEFOBatches, getDaysUntilExpiry, formatDate } from '../../utils/formatters';
import { ExpiredWarningModal } from './ExpiredWarningModal';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { QuickPieceCounter } from './QuickPieceCounter';

interface PosScreenProps {
  onNavigate: (tab: string) => void;
  onOpenAddCustomer: () => void;
}

export const PosScreen: React.FC<PosScreenProps> = ({ onNavigate, onOpenAddCustomer }) => {
  const { 
    medicines, 
    cart, 
    customers, 
    addToCart, 
    updateCartItemQty, 
    updateCartItemBatch, 
    updateCartItemDiscount, 
    updateCartItemInstruction,
    removeCartItem, 
    clearCart, 
    completeSale,
    findMedicineByBarcode
  } = usePharmacy();
  const { userName, currentBranch } = useAuthRole();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const [posMode, setPosMode] = useState<'cart' | 'quick_counter'>('quick_counter');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [blockedMedicine, setBlockedMedicine] = useState<{ medicine: Medicine; batch: Batch } | null>(null);

  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [invoiceNote, setInvoiceNote] = useState('');

  // Auto-focus search input on mount and F2/F4 keyboard shortcuts
  useEffect(() => {
    searchInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
      if (e.key === 'F4') {
        e.preventDefault();
        setShowBarcodeModal(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCompleteCheckout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, paymentMethod, selectedCustomerId, cashTendered]);

  // Live filter search query
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      return;
    }
    const filtered = medicines.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.barcode.includes(q) ||
      m.brand.toLowerCase().includes(q)
    ).slice(0, 8);

    setSearchResults(filtered);
    setSelectedSearchIndex(0);
  }, [searchQuery, medicines]);

  // Handle Search Input Key Navigation (Up/Down/Enter)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = searchResults[selectedSearchIndex];
      if (target) {
        handleAddMedicine(target);
      }
    }
  };

  const handleAddMedicine = (med: Medicine) => {
    // 1. Check if all stock is expired before adding
    const validBatches = getFEFOBatches(med.batches).filter(b => getDaysUntilExpiry(b.expiryDate) > 0);
    if (validBatches.length === 0 && med.batches.length > 0) {
      // Trigger blocked modal
      setBlockedMedicine({ medicine: med, batch: med.batches[0] });
      return;
    }

    const res = addToCart(med);
    if (!res.success && res.error?.includes('EXPIRED')) {
      const expiredBatch = med.batches.find(b => getDaysUntilExpiry(b.expiryDate) <= 0) || med.batches[0];
      setBlockedMedicine({ medicine: med, batch: expiredBatch });
    } else {
      setSearchQuery('');
      setSearchResults([]);
      searchInputRef.current?.focus();
    }
  };

  const handleBarcodeScanned = (barcode: string) => {
    const med = findMedicineByBarcode(barcode);
    if (med) {
      handleAddMedicine(med);
    } else {
      alert(`No medicine found with barcode: ${barcode}`);
    }
  };

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discountAmount, 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Cash calculation
  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - grandTotal);

  const handleCompleteCheckout = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'due' && !selectedCustomerId) {
      alert('Please select a customer for Due/Credit sale to record on their ledger.');
      return;
    }

    completeSale(
      paymentMethod,
      selectedCustomerId || undefined,
      selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      selectedCustomer?.phone,
      paymentMethod === 'cash' ? (tenderedNum > 0 ? tenderedNum : grandTotal) : undefined,
      userName,
      currentBranch.id,
      currentBranch.name
    );

    // Reset local form
    setCashTendered('');
    setSelectedCustomerId('');
    setInvoiceNote('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12 items-start">
      {/* ==================== LEFT 65%: MEDICINE SEARCH & CART ==================== */}
      <div className="w-full lg:w-[65%] space-y-4">
        {/* Search Bar & Barcode Scanner Button */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search medicine, generic, brand or scan barcode (F2)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-emerald-600 focus:border-emerald-600 transition text-slate-800 font-medium"
              />
              <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
                F2
              </span>
            </div>

            <button
              onClick={() => setShowBarcodeModal(true)}
              className="px-3.5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
              title="Barcode Scanner (F4)"
            >
              <Barcode className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Scan (F4)</span>
            </button>
          </div>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30 divide-y divide-slate-100 max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
              {searchResults.map((med, index) => {
                const isSelected = index === selectedSearchIndex;
                const isLowStock = med.currentStock <= med.minStock;
                const hasExpired = med.batches.some(b => getDaysUntilExpiry(b.expiryDate) <= 0);

                return (
                  <div
                    key={med.id}
                    onClick={() => handleAddMedicine(med)}
                    onMouseEnter={() => setSelectedSearchIndex(index)}
                    className={`p-3 sm:p-3.5 flex items-center justify-between cursor-pointer transition ${
                      isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold">
                          {med.strength}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">({med.brand})</span>
                        {hasExpired && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded font-bold">
                            Has Expired Batch
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>Generic: <strong className="text-slate-700">{med.genericName}</strong></span>
                        <span>•</span>
                        <span>Form: {med.dosageForm}</span>
                        <span>•</span>
                        <span className={isLowStock ? 'text-amber-600 font-bold' : 'text-slate-700 font-semibold'}>
                          Stock: {med.currentStock} {med.unit.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      <div className="text-base font-extrabold text-slate-900">
                        {formatBDT(med.sellingPrice, true)}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                        Select (Enter) →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* View Mode Toggle: Quick Piece Counter vs Detailed Cart */}
        <div className="flex items-center justify-between bg-slate-200/70 p-1 rounded-2xl">
          <button
            onClick={() => setPosMode('quick_counter')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              posMode === 'quick_counter'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>⚡ দ্রুত পিস কাউন্টার (১-ক্লিক সেল ও স্টক/মেয়াদ অ্যালার্ট)</span>
          </button>
          <button
            onClick={() => setPosMode('cart')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              posMode === 'cart'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🛒 আইটেম কার্ট তালিকা ({cart.length})</span>
          </button>
        </div>

        {/* Quick Piece Counter View */}
        {posMode === 'quick_counter' && (
          <QuickPieceCounter
            onAddMedicineWithQty={(med, qty) => {
              addToCart(med, undefined, qty);
            }}
          />
        )}

        {/* POS Cart Table */}
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${posMode === 'quick_counter' && cart.length === 0 ? 'hidden' : 'block'}`}>
          <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 text-sm">Cart Items (রসিদ তৈরির তালিকা)</span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                {cart.length}
              </span>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-medium text-slate-400 hover:text-rose-600 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cart</span>
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <p className="font-semibold text-slate-700 text-sm">Cart is currently empty</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Search a medicine name above or press <kbd className="px-1 py-0.5 bg-slate-100 border rounded font-mono">F4</kbd> to scan a barcode.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto">
              {cart.map((item) => {
                const isEarliestExpiry = item.medicine.batches.length > 1;
                const daysRemaining = getDaysUntilExpiry(item.selectedBatch.expiryDate);

                return (
                  <div key={item.id} className="p-4 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Item Description & Smart FEFO Batch Selector */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.medicine.name}</span>
                        <span className="text-xs px-2 py-0.2 rounded bg-slate-100 text-slate-700 font-mono font-medium">
                          {item.medicine.strength}
                        </span>
                        <span className="text-xs text-slate-400">({item.medicine.brand})</span>
                      </div>

                      {/* Smart Batch Selection Control */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-400">Batch:</span>
                        <select
                          value={item.selectedBatch.id}
                          onChange={(e) => updateCartItemBatch(item.id, e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-emerald-600 shadow-2xs"
                        >
                          {item.medicine.batches.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.batchNumber} (Exp: {formatDate(b.expiryDate)} — Stock: {b.quantity})
                            </option>
                          ))}
                        </select>

                        {/* FEFO Recommendation Tag */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                          <Sparkles className="w-3 h-3 mr-1 text-emerald-500" />
                          FEFO Recommended
                        </span>
                      </div>

                      {/* Quick Dosage Instruction (সেবনবিধি) */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">সেবনবিধি:</span>
                        <select
                          value={item.dosageInstruction || ''}
                          onChange={(e) => updateCartItemInstruction(item.id, e.target.value)}
                          className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] text-slate-700 outline-none font-medium"
                        >
                          <option value="">-- প্রেসক্রিপশন সেবনবিধি দিন --</option>
                          <option value="১ + ০ + ১ (খাবারের পরে)">১ + ০ + ১ (খাবারের পরে)</option>
                          <option value="১ + ১ + ১ (খাবারের পরে)">১ + ১ + ১ (খাবারের পরে)</option>
                          <option value="১ + ০ + ০ (খাবার ৩০ মিনিট আগে)">১ + ০ + ০ (খাবার ৩০ মিনিট আগে)</option>
                          <option value="১ + ০ + ১ (খাবার ৩০ মিনিট আগে)">১ + ০ + ১ (খাবার ৩০ মিনিট আগে)</option>
                          <option value="০ + ০ + ১ (রাতে শোবার আগে)">০ + ০ + ১ (রাতে শোবার আগে)</option>
                          <option value="জ্বরের সময় ১টি">জ্বরের সময় ১টি</option>
                          <option value="প্রয়োজনে ১টি">প্রয়োজনে ১টি</option>
                        </select>
                      </div>
                    </div>

                    {/* Quantity Stepper & Price Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                        <button
                          onClick={() => updateCartItemQty(item.id, item.quantity - 1)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartItemQty(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center text-xs font-bold text-slate-900 outline-none"
                        />
                        <button
                          onClick={() => updateCartItemQty(item.id, item.quantity + 1)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Unit Price */}
                      <div className="text-right min-w-[70px]">
                        <div className="text-[10px] text-slate-400">Unit Price</div>
                        <div className="text-xs font-semibold text-slate-700">
                          {formatBDT(item.unitPrice, true)}
                        </div>
                      </div>

                      {/* Row Total */}
                      <div className="text-right min-w-[85px]">
                        <div className="text-[10px] text-slate-400">Total</div>
                        <div className="text-sm font-extrabold text-slate-900">
                          {formatBDT(item.total, true)}
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ==================== RIGHT 35%: BILL SUMMARY & PAYMENT ==================== */}
      <div className="w-full lg:w-[35%] space-y-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-5 sticky top-20">
          {/* Customer Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customer</span>
              </label>
              <button
                onClick={onOpenAddCustomer}
                className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <UserPlus className="w-3 h-3" />
                <span>+ New</span>
              </button>
            </div>

            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-emerald-600 focus:bg-white transition"
            >
              <option value="">Walk-in Customer (General)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) {c.dueBalance > 0 ? `— Due: ${formatBDT(c.dueBalance)}` : ''}
                </option>
              ))}
            </select>

            {/* Existing Customer Due Warning Alert */}
            {selectedCustomer && selectedCustomer.dueBalance > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Existing Due Balance:</span>
                </div>
                <span className="font-extrabold text-amber-800 font-mono">
                  {formatBDT(selectedCustomer.dueBalance)}
                </span>
              </div>
            )}
          </div>

          {/* Grand Total Display */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Grand Total</span>
              <span>{cart.length} item(s)</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight font-sans">
              {formatBDT(grandTotal, true)}
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Subtotal: {formatBDT(subtotal, true)}</span>
              <span>Discount: {formatBDT(totalDiscount, true)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash</span>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod('bkash')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                  paymentMethod === 'bkash'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-700/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 text-rose-500" />
                <span>bKash</span>
              </button>

              <button
                onClick={() => setPaymentMethod('nagad')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                  paymentMethod === 'nagad'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-700/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 text-orange-500" />
                <span>Nagad</span>
              </button>

              <button
                onClick={() => setPaymentMethod('rocket')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                  paymentMethod === 'rocket'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-700/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 text-purple-500" />
                <span>Rocket</span>
              </button>

              <button
                onClick={() => setPaymentMethod('due')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                  paymentMethod === 'due'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-700/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Due / Credit</span>
              </button>
            </div>
          </div>

          {/* Cash Tendered Calculator (If Cash selected) */}
          {paymentMethod === 'cash' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Cash Tendered:</span>
                <input
                  type="number"
                  placeholder={grandTotal.toFixed(2)}
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  className="w-28 px-2.5 py-1 text-right text-xs font-bold border border-slate-300 rounded-lg outline-emerald-600 bg-white"
                />
              </div>

              {/* Quick Cash Presets */}
              <div className="flex gap-1.5 pt-1">
                {[100, 500, 1000].map(val => (
                  <button
                    key={val}
                    onClick={() => setCashTendered(val.toString())}
                    className="flex-1 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-600"
                  >
                    ৳{val}
                  </button>
                ))}
              </div>

              {tenderedNum > 0 && (
                <div className="pt-2 border-t border-slate-200 flex justify-between text-xs">
                  <span className="font-semibold text-slate-600">Change Due:</span>
                  <span className="font-extrabold text-emerald-700 font-mono">
                    {formatBDT(changeDue, true)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Primary CTA: Complete Sale */}
          <button
            onClick={handleCompleteCheckout}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition shadow-lg transform active:scale-98 ${
              cart.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/30 hover:shadow-xl'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Complete Sale (Ctrl + Enter)</span>
          </button>

          <div className="text-center text-[10px] text-slate-400">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono text-slate-500">Ctrl + Enter</kbd> to complete instantly
          </div>
        </div>
      </div>

      {/* Expired Stock Blocker Dialog */}
      <ExpiredWarningModal
        medicine={blockedMedicine?.medicine || null}
        batch={blockedMedicine?.batch || null}
        onClose={() => setBlockedMedicine(null)}
        onViewExpiryCenter={() => {
          setBlockedMedicine(null);
          onNavigate('expiry');
        }}
      />

      {/* Optical / USB Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={showBarcodeModal}
        onClose={() => setShowBarcodeModal(false)}
        onProductScanned={handleBarcodeScanned}
      />
    </div>
  );
};
