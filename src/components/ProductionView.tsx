import React, { useState } from 'react';
import { 
  Package, 
  Scale, 
  Flame, 
  TrendingDown, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Sparkles,
  DollarSign
} from 'lucide-react';

interface BatchProduction {
  id: string;
  batchCode: string;
  productName: string;
  proteinType: 'Galletas' | 'Res' | 'Pollo' | 'Cerdo';
  date: string;
  rawWeightGrams: number;
  finalWeightGrams: number;
  shrinkagePercent: number;
  units100g: number;
  units250g: number;
  units500g: number;
  costRaw: number;
  status: 'Completado' | 'En Deshidratación' | 'Horneando';
  notes: string;
}

const INITIAL_BATCHES: BatchProduction[] = [
  {
    id: 'b-101',
    batchCode: 'LOT-2024-RES-01',
    productName: 'Deshidratados Premium de Res',
    proteinType: 'Res',
    date: '2024-10-24',
    rawWeightGrams: 5000,
    finalWeightGrams: 1750,
    shrinkagePercent: 65,
    units100g: 10,
    units250g: 3,
    units500g: 0,
    costRaw: 90000,
    status: 'Completado',
    notes: 'Solomito limpio magro. 16h a 68°C. Textura crujiente perfecta aprobada por Oreo.'
  },
  {
    id: 'b-102',
    batchCode: 'LOT-2024-GAL-04',
    productName: 'Galletas Artesanales Horneadas',
    proteinType: 'Galletas',
    date: '2024-10-25',
    rawWeightGrams: 4800,
    finalWeightGrams: 4200,
    shrinkagePercent: 12.5,
    units100g: 22,
    units250g: 8,
    units500g: 0,
    costRaw: 38000,
    status: 'Completado',
    notes: 'Avena, calabaza y manzana criolla. Horneado a 160°C por 45 min.'
  },
  {
    id: 'b-103',
    batchCode: 'LOT-2024-POL-02',
    productName: 'Tiras Deshidratadas de Pollo',
    proteinType: 'Pollo',
    date: '2024-10-26',
    rawWeightGrams: 6000,
    finalWeightGrams: 2100,
    shrinkagePercent: 65,
    units100g: 15,
    units250g: 2,
    units500g: 0,
    costRaw: 72000,
    status: 'En Deshidratación',
    notes: 'Pechuga campesina fileteada a 4mm. Finaliza ciclo hoy a las 8:00 PM.'
  }
];

export const ProductionView: React.FC = () => {
  const [batches, setBatches] = useState<BatchProduction[]>(INITIAL_BATCHES);

  // Formulario nuevo lote
  const [productName, setProductName] = useState('Deshidratados Premium de Res');
  const [proteinType, setProteinType] = useState<'Galletas' | 'Res' | 'Pollo' | 'Cerdo'>('Res');
  const [rawWeight, setRawWeight] = useState<number>(4000);
  const [finalWeight, setFinalWeight] = useState<number>(1400);
  const [rawCost, setRawCost] = useState<number>(75000);
  const [units100, setUnits100] = useState<number>(8);
  const [units250, setUnits250] = useState<number>(2);
  const [units500, setUnits500] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Cálculo en vivo de merma
  const calculatedShrinkage = rawWeight > 0 && finalWeight > 0 
    ? Number((((rawWeight - finalWeight) / rawWeight) * 100).toFixed(1))
    : 0;

  const costPerGramFinal = finalWeight > 0 ? Number((rawCost / finalWeight).toFixed(2)) : 0;

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: BatchProduction = {
      id: `b-${Date.now()}`,
      batchCode: `LOT-${new Date().getFullYear()}-${proteinType.toUpperCase().slice(0, 3)}-${Math.floor(10 + Math.random() * 89)}`,
      productName,
      proteinType,
      date: new Date().toISOString().split('T')[0],
      rawWeightGrams: Number(rawWeight),
      finalWeightGrams: Number(finalWeight),
      shrinkagePercent: calculatedShrinkage,
      units100g: Number(units100),
      units250g: Number(units250),
      units500g: Number(units500),
      costRaw: Number(rawCost),
      status: 'Completado',
      notes: notes || 'Lote elaborado y validado en taller Normandía.'
    };

    setBatches([newBatch, ...batches]);
    setNotes('');
    alert(`¡Lote ${newBatch.batchCode} registrado exitosamente!`);
  };

  return (
    <div className="space-y-8">
      {/* Encabezado del Módulo */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#f8b46b] uppercase tracking-wider bg-[#334c5c] px-3 py-1 rounded-full w-fit mb-2">
            <Flame className="w-3.5 h-3.5" /> Producción Activa & Control Bromatológico
          </div>
          <h2 className="text-2xl font-black text-[#334c5c]">
            Registro de Lotes, Cocción & Control de Mermas
          </h2>
          <p className="text-xs text-gray-500">
            Calcula el rendimiento real crudo vs. terminado para asegurar rentabilidad y costeo exacto por gramo.
          </p>
        </div>

        <div className="bg-[#fbf9f6] p-4 rounded-xl border border-gray-200 text-right">
          <span className="text-[11px] font-bold text-gray-500 block uppercase">Lotes Elaborados Mes</span>
          <span className="text-2xl font-black text-[#334c5c]">{batches.length} Lotes</span>
        </div>
      </div>

      {/* Grid: Formulario de Pesaje a la Izquierda + Histórico a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario Calculadora de Merma */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-1 space-y-5">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-[#334c5c] text-lg flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#f8b46b]" /> Nuevo Lote de Producción
            </h3>
            <p className="text-xs text-gray-500">Ingresa los pesos para calcular merma y costo neto</p>
          </div>

          <form onSubmit={handleCreateBatch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Producto / Proteína</label>
              <select
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  if (e.target.value.includes('Galletas')) setProteinType('Galletas');
                  else if (e.target.value.includes('Res')) setProteinType('Res');
                  else if (e.target.value.includes('Pollo')) setProteinType('Pollo');
                  else setProteinType('Cerdo');
                }}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] bg-white"
              >
                <option value="Galletas Artesanales Horneadas">Galletas Horneadas (Calabaza/Avena)</option>
                <option value="Deshidratados Premium de Res">Deshidratados Premium de Res</option>
                <option value="Tiras Deshidratadas de Pollo">Tiras Deshidratadas de Pollo</option>
                <option value="Snacks Crocantes de Lomo de Cerdo">Lomo de Cerdo Crocante</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Peso Crudo (g)</label>
                <input
                  type="number"
                  value={rawWeight}
                  onChange={(e) => setRawWeight(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c]"
                  placeholder="Ej: 5000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Peso Final (g)</label>
                <input
                  type="number"
                  value={finalWeight}
                  onChange={(e) => setFinalWeight(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c]"
                  placeholder="Ej: 1750"
                />
              </div>
            </div>

            {/* Widget Merma Calculada */}
            <div className="bg-[#334c5c] text-white p-4 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300">Merma de Deshidratación:</span>
                <span className="font-black text-[#f8b46b] text-base">{calculatedShrinkage}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300">Costo Gramo Terminado:</span>
                <span className="font-bold text-white">${costPerGramFinal} COP/g</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-[#f8b46b] h-full" 
                  style={{ width: `${Math.min(calculatedShrinkage, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Costo Total Materia Prima ($)</label>
              <input
                type="number"
                value={rawCost}
                onChange={(e) => setRawCost(Number(e.target.value))}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c]"
                placeholder="Ej: 90000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Unidades Empacadas</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 block">100g</span>
                  <input
                    type="number"
                    value={units100}
                    onChange={(e) => setUnits100(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border text-center font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">250g</span>
                  <input
                    type="number"
                    value={units250}
                    onChange={(e) => setUnits250(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border text-center font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">500g</span>
                  <input
                    type="number"
                    value={units500}
                    onChange={(e) => setUnits500(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border text-center font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Notas de Cocción / Lote</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Temperatura del deshidratador, proveedor de carne, lote ICA..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#f8b46b] hover:bg-[#e29d53] text-[#334c5c] font-black py-3 rounded-xl shadow-md transition active:scale-95"
            >
              <Plus className="w-4 h-4" /> Registrar Lote en Taller
            </button>
          </form>
        </div>

        {/* Lista de Lotes Producidos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-extrabold text-[#334c5c] text-lg">Historial de Lotes & Trazabilidad</h3>
              <p className="text-xs text-gray-500">Registro cronológico de horneados y deshidratados</p>
            </div>
            <span className="text-xs font-bold text-gray-400">{batches.length} registros</span>
          </div>

          <div className="space-y-3">
            {batches.map((batch) => (
              <div 
                key={batch.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#334c5c] transition bg-gray-50/50 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-[#334c5c] text-[#f8b46b] px-2.5 py-1 rounded-md">
                      {batch.batchCode}
                    </span>
                    <h4 className="font-bold text-sm text-[#334c5c]">{batch.productName}</h4>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    batch.status === 'Completado' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {batch.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Fecha</span>
                    <span className="font-semibold text-gray-700">{batch.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Crudo ➔ Terminado</span>
                    <span className="font-bold text-[#334c5c]">{(batch.rawWeightGrams / 1000).toFixed(1)}kg ➔ {(batch.finalWeightGrams / 1000).toFixed(1)}kg</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Merma Real</span>
                    <span className="font-black text-[#ff7043]">{batch.shrinkagePercent}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Empacado</span>
                    <span className="font-bold text-gray-800">
                      {batch.units100g > 0 && `${batch.units100g}x100g `}
                      {batch.units250g > 0 && `${batch.units250g}x250g `}
                      {batch.units500g > 0 && `${batch.units500g}x500g`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic bg-amber-50/50 p-2 rounded-md border border-amber-100">
                  💬 {batch.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductionView;
