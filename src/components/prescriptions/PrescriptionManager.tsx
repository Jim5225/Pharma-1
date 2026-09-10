import React, { useState } from 'react';
import { 
  FileHeart, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  User, 
  Calendar, 
  Building2, 
  Pill, 
  Sparkles,
  Eye,
  PlusCircle,
  X
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Prescription } from '../../types';
import { formatDate } from '../../utils/formatters';

interface PrescriptionManagerProps {
  onNavigate: (tab: string) => void;
}

export const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({ onNavigate }) => {
  const { prescriptions, dispensePrescriptionToPos, addPrescription } = usePharmacy();
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(prescriptions[0] || null);
  const [isAddRxOpen, setIsAddRxOpen] = useState(false);

  // New Rx form state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('35');
  const [doctorName, setDoctorName] = useState('Dr. Farhana Yasmin, MBBS, FCPS');
  const [hospital, setHospital] = useState('Apollo Diagnostic, Dhaka');
  const [medicineInput, setMedicineInput] = useState('Napa 500mg (1+0+1), Seclo 20mg (1+0+1 before meal)');

  const handleDispenseToPos = (rxId: string) => {
    const res = dispensePrescriptionToPos(rxId);
    alert(`Dispensed: ${res.itemsAdded} prescribed items transferred directly to active POS Cart!`);
    onNavigate('pos');
  };

  const handleCreateRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    addPrescription({
      prescriptionNumber: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      patientAge: parseInt(patientAge) || 30,
      doctorName,
      hospital,
      date: new Date().toISOString().split('T')[0],
      notes: 'Consultation Rx note recorded at front desk',
      medicines: [
        {
          name: 'Napa 500mg',
          dosage: '1 Tab',
          frequency: '1 + 0 + 1',
          duration: '5 days',
          matchedMedicineId: 'med-1'
        },
        {
          name: 'Seclo 20mg',
          dosage: '1 Cap',
          frequency: '1 + 0 + 1 (Before meal)',
          duration: '14 days',
          matchedMedicineId: 'med-3'
        }
      ]
    });

    setIsAddRxOpen(false);
    setPatientName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileHeart className="w-5 h-5 text-rose-600" />
            <span>Prescription & Digital Dispensing</span>
          </h2>
          <p className="text-xs text-slate-500">
            Upload doctor prescriptions and 1-Click convert directly into POS billing carts
          </p>
        </div>

        <button
          onClick={() => setIsAddRxOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Doctor Prescription</span>
        </button>
      </div>

      {/* 2-Column Layout: Rx List on Left, Selected Rx Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Prescription Directory List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Prescriptions Queue ({prescriptions.length})
            </span>
            <span className="text-[11px] text-slate-500">Click to preview</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {prescriptions.map(rx => {
              const isSelected = selectedRx?.id === rx.id;
              const isPending = rx.status === 'pending';

              return (
                <div
                  key={rx.id}
                  onClick={() => setSelectedRx(rx)}
                  className={`p-4 cursor-pointer transition flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{rx.prescriptionNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        isPending ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {rx.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-800 text-sm">{rx.patientName}</div>
                    <div className="text-[11px] text-slate-500">{rx.doctorName}</div>
                  </div>

                  <div className="text-right shrink-0 text-[10px] text-slate-400">
                    <div>{formatDate(rx.date)}</div>
                    <div className="text-emerald-700 font-bold mt-2">
                      {rx.medicines.length} medicine(s)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Prescription Detail & Dispense Trigger (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedRx ? (
            <>
              {/* Prescription Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {selectedRx.prescriptionNumber}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{selectedRx.patientName}</h3>
                  <p className="text-xs text-slate-500">
                    Age: {selectedRx.patientAge} years • Gender: {selectedRx.patientGender || 'Not specified'}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="font-bold text-xs text-slate-800">{selectedRx.doctorName}</div>
                  <div className="text-xs text-slate-500">{selectedRx.hospital}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Date: {formatDate(selectedRx.date)}</div>
                </div>
              </div>

              {/* Prescribed Medicines List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span>Prescribed Items & Regimen</span>
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-medium">Ready for stock match</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {selectedRx.medicines.map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          Dosage: <strong className="text-slate-800">{m.dosage}</strong> • Frequency: {m.frequency}
                        </div>
                        {m.instructions && (
                          <div className="text-[10px] text-slate-500 italic mt-0.5">{m.instructions}</div>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {m.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Clinical Notes */}
              {selectedRx.notes && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-700 block mb-1">Doctor's Clinical Advice:</span>
                  <p>{selectedRx.notes}</p>
                </div>
              )}

              {/* 1-Click Dispense to POS CTA */}
              <div className="pt-2">
                <button
                  onClick={() => handleDispenseToPos(selectedRx.id)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm transition shadow-lg shadow-emerald-700/20 flex items-center justify-center space-x-2 transform active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Dispense Medicines to POS Cart (1-Click)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  System automatically selects unexpired FEFO batches and loads items into checkout
                </p>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400">
              Select a prescription from the left to view details
            </div>
          )}
        </div>
      </div>

      {/* Upload Rx Modal */}
      {isAddRxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Upload & Record Prescription</h3>
              <button onClick={() => setIsAddRxOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRx} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Mahbuba Nasrin"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient Age</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {/* Upload Image Placeholder */}
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-1 bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-700">Attach Scanned Rx Image</p>
                <p className="text-[10px] text-slate-400">Supports PNG, JPG, or PDF photo</p>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRxOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
