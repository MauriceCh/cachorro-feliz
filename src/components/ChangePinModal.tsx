import React, { useState, useEffect } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { updateAdminPin, fetchCloudAdminPin } from '../lib/dbService';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose }) => {
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeKnownPin, setActiveKnownPin] = useState<string>('1234');

  useEffect(() => {
    if (isOpen) {
      fetchCloudAdminPin().then(p => {
        if (p) setActiveKnownPin(p);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Read stored PIN
    let localPin = '1234';
    try {
      localPin = localStorage.getItem('cachorro_admin_pin') || '1234';
    } catch {}

    const enteredCurrent = currentPinInput.trim();
    if (enteredCurrent !== localPin && enteredCurrent !== activeKnownPin) {
      // Recheck cloud in case it was updated elsewhere
      const refreshed = await fetchCloudAdminPin();
      if (refreshed && enteredCurrent !== refreshed) {
        setErrorMsg('El PIN actual ingresado no es correcto.');
        return;
      }
    }

    if (newPin.trim().length < 4) {
      setErrorMsg('El nuevo PIN debe tener al menos 4 caracteres o dígitos.');
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMsg('El nuevo PIN y la confirmación no coinciden.');
      return;
    }

    try {
      await updateAdminPin(newPin.trim());
      setSuccessMsg('¡PIN de seguridad actualizado en todos tus dispositivos!');
      setTimeout(() => {
        setCurrentPinInput('');
        setNewPin('');
        setConfirmPin('');
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg('Error al guardar el nuevo PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 relative overflow-hidden">
        {/* Top Decorative bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2D463E] to-[#EF8828]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5 mt-2">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs border border-amber-200">
            <KeyRound className="w-6 h-6 text-[#EF8828]" />
          </div>
          <h3 className="font-bebas text-xl text-[#2D463E] tracking-wider leading-none mb-1">
            Seguridad & Clave de Acceso
          </h3>
          <p className="text-xs text-slate-500">
            Cambia el PIN de acceso a tu panel administrativo
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              PIN Actual
            </label>
            <input
              type="password"
              value={currentPinInput}
              onChange={e => setCurrentPinInput(e.target.value)}
              placeholder="Ingresa tu PIN actual (ej: 1234)"
              className="w-full text-center tracking-widest text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#2D463E] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Nuevo PIN Secreto
            </label>
            <input
              type="password"
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
              placeholder="Mínimo 4 dígitos / caracteres"
              className="w-full text-center tracking-widest text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#EF8828] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Confirmar Nuevo PIN
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={e => setConfirmPin(e.target.value)}
              placeholder="Repite el nuevo PIN"
              className="w-full text-center tracking-widest text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#EF8828] focus:outline-hidden"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#2D463E] hover:bg-[#20332c] text-white font-bold text-xs py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Guardar Nueva Clave</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
