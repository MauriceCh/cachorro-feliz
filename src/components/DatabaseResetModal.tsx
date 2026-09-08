import React, { useState } from 'react';
import { 
  Trash2, 
  RotateCcw, 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Sparkles,
  Database,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { fetchCloudAdminPin } from '../lib/dbService';

export type ResetMode = 'clean_ops' | 'factory_reset' | 'restore_demo';

interface DatabaseResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (mode: ResetMode) => Promise<void>;
}

export const DatabaseResetModal: React.FC<DatabaseResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset
}) => {
  const [selectedMode, setSelectedMode] = useState<ResetMode>('clean_ops');
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const enteredPin = pinInput.trim();

    // Validate against local PIN or cloud PIN
    let storedPin = '1234';
    try {
      storedPin = localStorage.getItem('cachorro_admin_pin') || '1234';
    } catch {}

    let validPin = storedPin;
    if (enteredPin !== storedPin) {
      const cloudPin = await fetchCloudAdminPin();
      if (cloudPin) validPin = cloudPin;
    }

    if (enteredPin !== storedPin && enteredPin !== validPin) {
      setErrorMsg('El PIN de seguridad ingresado es incorrecto.');
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirmReset(selectedMode);
      setSuccessMsg('¡Base de datos actualizada con éxito!');
      setTimeout(() => {
        setIsProcessing(false);
        setPinInput('');
        setSuccessMsg(null);
        onClose();
      }, 1800);
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg('Ocurrió un error al procesar el reseteo de datos.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 overflow-hidden">
        {/* Top Decorative Warning Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-[#2D463E]" />

        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5 mt-2">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs border border-rose-200">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-bebas text-2xl text-[#2D463E] tracking-wider leading-none mb-1">
            Gestión y Limpieza de Base de Datos
          </h3>
          <p className="text-xs text-slate-500">
            Prepara tu sistema para comenzar a registrar datos 100% reales de tu taller
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleExecuteReset} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-2 uppercase text-[11px]">
              Selecciona el tipo de limpieza:
            </label>

            <div className="space-y-2.5">
              {/* Option 1: Clean Ops */}
              <label
                onClick={() => setSelectedMode('clean_ops')}
                className={`flex items-start p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedMode === 'clean_ops'
                    ? 'border-[#2D463E] bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="resetMode"
                  value="clean_ops"
                  checked={selectedMode === 'clean_ops'}
                  onChange={() => setSelectedMode('clean_ops')}
                  className="mt-0.5 text-[#2D463E] focus:ring-[#2D463E]"
                />
                <div className="ml-3">
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <span>🌟 Poner en Ceros Operaciones (Recomendado)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Borra todas las ventas, lotes de producción, compras y clientes de prueba. 
                    <b> Mantiene el catálogo de recetas y snacks</b> pero con stock en cero (0) para que empieces a registrar producción real.
                  </p>
                </div>
              </label>

              {/* Option 2: Factory Reset */}
              <label
                onClick={() => setSelectedMode('factory_reset')}
                className={`flex items-start p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedMode === 'factory_reset'
                    ? 'border-rose-600 bg-rose-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="resetMode"
                  value="factory_reset"
                  checked={selectedMode === 'factory_reset'}
                  onChange={() => setSelectedMode('factory_reset')}
                  className="mt-0.5 text-rose-600 focus:ring-rose-600"
                />
                <div className="ml-3">
                  <div className="font-bold text-rose-900 flex items-center space-x-1.5">
                    <span>⚠️ Reset Completo de Fábrica (100% Vacío)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Vacía absolutamente todo (incluyendo recetas e insumos) para crear todo desde cero absoluto.
                  </p>
                </div>
              </label>

              {/* Option 3: Restore Demo */}
              <label
                onClick={() => setSelectedMode('restore_demo')}
                className={`flex items-start p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedMode === 'restore_demo'
                    ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="resetMode"
                  value="restore_demo"
                  checked={selectedMode === 'restore_demo'}
                  onChange={() => setSelectedMode('restore_demo')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-600"
                />
                <div className="ml-3">
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <span>🔄 Restaurar Datos de Ejemplo / Demostración</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Vuelve a cargar los ejemplos iniciales de galletas, deshidratados, lotes y clientes.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[11px]">
              Ingresa tu PIN del Chef para Confirmar:
            </label>
            <input
              type="password"
              placeholder="Ingresa tu PIN (ej: 1234)"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              className="w-full text-center tracking-widest text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#2D463E] focus:outline-none"
              required
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 px-5 py-2.5 font-bold text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs ${
                selectedMode === 'factory_reset'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : selectedMode === 'restore_demo'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-[#2D463E] hover:bg-[#233831]'
              }`}
            >
              {isProcessing ? (
                <span>Procesando...</span>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Confirmar y Ejecutar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
