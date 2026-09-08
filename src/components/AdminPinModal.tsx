import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { fetchCloudAdminPin } from '../lib/dbService';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [cloudPin, setCloudPin] = useState<string>('1234');

  // Fetch the latest security PIN from cloud on open
  useEffect(() => {
    if (isOpen) {
      fetchCloudAdminPin().then(p => {
        if (p) setCloudPin(p);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredPin = pin.trim();

    let localPin = '1234';
    try {
      localPin = localStorage.getItem('cachorro_admin_pin') || '1234';
    } catch {}

    // Verify against local PIN or latest cloud PIN
    let latestPin = cloudPin;
    if (enteredPin !== localPin && enteredPin !== cloudPin) {
      // Re-fetch cloud in case it was updated right before
      const fetched = await fetchCloudAdminPin();
      if (fetched) latestPin = fetched;
    }

    if (enteredPin === localPin || enteredPin === latestPin) {
      try {
        localStorage.setItem('cachorro_admin_pin', enteredPin);
        if (rememberDevice) {
          localStorage.setItem('cachorro_admin_authenticated', 'true');
        } else {
          sessionStorage.setItem('cachorro_admin_authenticated', 'true');
        }
      } catch {}
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 relative overflow-hidden">
        {/* Top Decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2D463E] to-[#EF8828]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mt-2 mb-6">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-7 h-7 text-[#2D463E]" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Acceso Chef Javier</h3>
          <p className="text-xs text-slate-500 mt-1">
            Panel Administrativo y Producción Cachorro Feliz
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ingresa tu PIN de Seguridad (Por defecto: 1234)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={8}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-xl tracking-widest font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#2D463E] focus:bg-white transition-all"
              />
            </div>
            {error && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 font-semibold mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>PIN incorrecto. Intenta nuevamente (PIN por defecto: 1234).</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <input
              type="checkbox"
              id="remember"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="rounded text-[#2D463E] focus:ring-[#2D463E] cursor-pointer"
            />
            <label htmlFor="remember" className="cursor-pointer select-none">
              Recordar acceso en este dispositivo
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D463E] hover:bg-[#1E302A] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ingresar al Panel de Gestión</span>
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400 mt-4">
          Solo tú tienes acceso a tus ventas, clientes, costos y Agentes de IA.
        </p>
      </div>
    </div>
  );
};
