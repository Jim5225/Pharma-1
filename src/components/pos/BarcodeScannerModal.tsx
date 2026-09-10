import React, { useState, useEffect, useRef } from 'react';
import { Barcode, Camera, X, Check, Search, Sparkles, Volume2 } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { sounds } from '../../utils/audio';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductScanned: (barcode: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onProductScanned,
}) => {
  const { medicines } = usePharmacy();
  const [manualBarcode, setManualBarcode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setManualBarcode('');
      setCameraActive(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScanSubmit = (codeToScan: string) => {
    const code = codeToScan.trim();
    if (!code) return;
    sounds.playBeep();
    onProductScanned(code);
    onClose();
  };

  // Sample quick test barcodes from preloaded medicines
  const testBarcodes = [
    { code: '8941112001', name: 'Napa 500mg' },
    { code: '8941112002', name: 'Napa Extra' },
    { code: '8941112003', name: 'Seclo 20mg' },
    { code: '8941112004', name: 'Sergel 20mg' },
    { code: '8941112007', name: 'Zimax 500mg' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Optical & USB Barcode Scanner</h3>
              <p className="text-[11px] text-slate-400">Scan packaging with USB reader or camera</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Camera Scanner Viewport or Hardware Listener */}
          {cameraActive ? (
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center p-4 border-2 border-emerald-500">
              {/* Laser Scanning Line Animation */}
              <div className="absolute inset-x-4 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-bounce top-1/2" />
              <div className="border-2 border-dashed border-emerald-400/70 w-48 h-32 rounded-lg flex items-center justify-center">
                <span className="text-[11px] text-emerald-200 font-mono bg-slate-900/80 px-2 py-1 rounded">
                  Point at 1D / 2D Barcode
                </span>
              </div>
              <p className="absolute bottom-2 text-[10px] text-slate-400">WebCam OCR Scanner Active</p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Barcode className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-800">USB HID Scanner Ready</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Plug your handheld USB barcode reader. Any scan will automatically feed into the field below and trigger item addition.
              </p>
              <button
                onClick={() => setCameraActive(true)}
                className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-lg transition"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Switch to Camera Scanner</span>
              </button>
            </div>
          )}

          {/* Manual Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleScanSubmit(manualBarcode);
            }}
            className="space-y-2"
          >
            <label className="block text-xs font-semibold text-slate-700">
              Barcode / SKU Input
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Scan or type barcode (e.g. 8941112001)..."
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-emerald-600 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Find</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Barcode Buttons */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              ⚡ Click to simulate quick scan:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {testBarcodes.map(tb => (
                <button
                  key={tb.code}
                  onClick={() => handleScanSubmit(tb.code)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 text-xs font-medium text-slate-700 transition flex items-center gap-1.5"
                >
                  <Barcode className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tb.name} ({tb.code.slice(-4)})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
