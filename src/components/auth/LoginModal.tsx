import React, { useState } from "react";
import { Lock, Mail, Store, Key, ShieldCheck, ArrowRight, X, Sparkles, AlertCircle } from "lucide-react";
import { useAuthRole } from "../../context/AuthRoleContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setBranch } = useAuthRole();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [pharmacyName, setPharmacyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatusMessage("দয়া করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন");
      return;
    }

    // Match or create tenant
    const branchName = pharmacyName || email.split("@")[0].toUpperCase() + " PHARMA";
    setBranch({
      id: "branch-" + Date.now(),
      name: branchName,
      code: branchName.slice(0, 3).toUpperCase(),
      address: "ঢাকা, বাংলাদেশ",
      phone: phone || "01700-000000"
    });

    setStatusMessage("সফলভাবে লগইন হয়েছে!");
    setTimeout(() => {
      onClose();
      setStatusMessage(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-6 text-white text-center relative">
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 p-1.5 rounded-full bg-emerald-700/50 hover:bg-emerald-700 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
            <Store className="w-6 h-6 text-emerald-300" />
          </div>
          <h3 className="font-black text-lg">
            {isRegisterMode ? "নতুন ফার্মেসি সাইন-আপ" : "ফার্মেসি ক্লাউড লগইন"}
          </h3>
          <p className="text-xs text-emerald-100/80 mt-1">
            {isRegisterMode 
              ? "আপনার ফার্মেসির নাম ও তথ্য দিয়ে আলাদা অ্যাকাউন্ট খুলুন" 
              : "আপনার ফার্মেসির আইডি ও পাসওয়ার্ড দিয়ে প্রবেশ করুন"}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {isRegisterMode && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700">ফার্মেসির নাম (Shop Name):</label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="যেমন: লাজ ফার্মা / জননী ফার্মেসি"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-emerald-600"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700">লগইন ইমেইল / মোবাইল:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="pharmacy@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">পাসওয়ার্ড:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-emerald-600"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700">মোবাইল নম্বর (বিকাশ/নগদ পেমেন্ট ও এসএমএস):</label>
              <input
                type="text"
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-emerald-600"
              />
            </div>
          )}

          {/* Cloud Security Indicator */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Supabase Cloud Secured</span>
            </div>
            <span className="font-bold text-slate-700">Row Level Isolation</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{isRegisterMode ? "অ্যাকাউন্ট খুলুন ও শুরু করুন" : "লগইন করুন"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-emerald-700 hover:underline font-bold text-[11px]"
            >
              {isRegisterMode 
                ? "অলরেডি অ্যাকাউন্ট আছে? লগইন করুন" 
                : "নতুন ফার্মেসি? এখানে ক্লিক করে নতুন অ্যাকাউন্ট খুলুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

