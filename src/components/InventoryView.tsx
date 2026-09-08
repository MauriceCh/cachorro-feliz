import React, { useState } from 'react';
import { 
  RawMaterial, 
  FinishedProduct, 
  InventoryAdjustment, 
  AdjustmentReason,
  UnitType 
} from '../types';
import { 
  Package,
  Edit2,
  DollarSign,
  CheckCircle2, 
  Layers, 
  AlertTriangle, 
  SlidersHorizontal, 
  Plus, 
  Minus, 
  Search, 
  Sparkles, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface InventoryViewProps {
  rawMaterials: RawMaterial[];
  finishedProducts: FinishedProduct[];
  adjustments: InventoryAdjustment[];
  onAddAdjustment: (adj: Omit<InventoryAdjustment, 'id'>) => void;
  onOpenNewPurchase: () => void;
  onAddRawMaterial?: (rm: RawMaterial) => void;
  onAddFinishedProduct?: (fp: FinishedProduct) => void;
  onUpdateFinishedProduct?: (fp: FinishedProduct) => void;
  onDeleteFinishedProduct?: (fpId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  rawMaterials,
  finishedProducts,
  adjustments,
  onAddAdjustment,
  onOpenNewPurchase,
  onAddRawMaterial,
  onAddFinishedProduct,
  onUpdateFinishedProduct,
  onDeleteFinishedProduct
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'raw' | 'finished' | 'adjustments'>('raw');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState<boolean>(false);

  // New Item Modals State
  const [isNewRawModalOpen, setIsNewRawModalOpen] = useState<boolean>(false);
  const [newRawName, setNewRawName] = useState<string>('');
  const [newRawUnit, setNewRawUnit] = useState<UnitType>('g');
  const [newRawLossPct, setNewRawLossPct] = useState<number>(10);
  const [newRawMinStock, setNewRawMinStock] = useState<number>(1000);

  const [isNewFinishedModalOpen, setIsNewFinishedModalOpen] = useState<boolean>(false);
  const [newFinishedName, setNewFinishedName] = useState<string>('');
  const [newFinishedPackageSize, setNewFinishedPackageSize] = useState<number>(250);
  const [newFinishedCategory, setNewFinishedCategory] = useState<'Galletas' | 'Deshidratados' | 'Otros'>('Deshidratados');
  const [newFinishedPrice, setNewFinishedPrice] = useState<number>(18000);


  // Edit Finished Product Price/Stock Modal State
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<FinishedProduct | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  const handleOpenEditProduct = (fp: FinishedProduct) => {
    setEditingProduct(fp);
    setEditPrice(fp.salePrice);
    setEditStock(fp.stockUnits);
    setIsEditProductModalOpen(true);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (onUpdateFinishedProduct) {
      onUpdateFinishedProduct({
        ...editingProduct,
        salePrice: Number(editPrice),
        stockUnits: Number(editStock)
      });
    }

    setIsEditProductModalOpen(false);
    setEditingProduct(null);
  };

  // Adjustment Form State
  const [itemType, setItemType] = useState<'RawMaterial' | 'FinishedProduct'>('RawMaterial');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantityAdjusted, setQuantityAdjusted] = useState<number>(-100);
  const [reason, setReason] = useState<AdjustmentReason>('Daño/Merma');
  const [notes, setNotes] = useState<string>('');

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      alert('Por favor selecciona un ítem para ajustar.');
      return;
    }

    let itemName = '';
    let unitCost = 0;

    if (itemType === 'RawMaterial') {
      const rm = rawMaterials.find(r => r.id === selectedItemId);
      if (rm) {
        itemName = rm.name;
        unitCost = rm.weightedAvgNetCostPerUnit;
      }
    } else {
      const fp = finishedProducts.find(p => p.id === selectedItemId);
      if (fp) {
        itemName = fp.name;
        unitCost = fp.currentUnitCost;
      }
    }

    const financialLossValue = Math.abs(quantityAdjusted) * unitCost;

    onAddAdjustment({
      date: new Date().toISOString().split('T')[0],
      itemType,
      itemId: selectedItemId,
      itemName,
      quantityAdjusted: Number(quantityAdjusted),
      reason,
      unitCost,
      financialLossValue,
      notes
    });

    setIsAdjustmentModalOpen(false);
    setSelectedItemId('');
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-[#E0D7C6] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#2D463E] font-display flex items-center space-x-2">
            <Package className="w-6 h-6 text-[#2D463E]" />
            <span>Gestión de Inventarios y Ajustes Manuales</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Control exacto de stock bruto vs utilizable, costo promedio neto y bajas por mermas o daño
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsNewRawModalOpen(true)}
            className="bg-[#2D463E] hover:bg-[#233831] text-white px-3 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4A373]" />
            <span>Materia Prima</span>
          </button>

          <button
            onClick={() => setIsNewFinishedModalOpen(true)}
            className="bg-[#2D463E] hover:bg-[#233831] text-white px-3 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4A373]" />
            <span>Producto Terminado</span>
          </button>

          <button
            onClick={() => setIsAdjustmentModalOpen(true)}
            className="bg-stone-800 hover:bg-stone-900 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D4A373]" />
            <span>Ajuste Manual</span>
          </button>

          <button
            onClick={onOpenNewPurchase}
            className="bg-[#D4A373] hover:bg-[#c29263] text-white px-3 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Comprar Insumos</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E0D7C6] pb-2">
        <button
          onClick={() => setActiveSubTab('raw')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'raw'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-[#F9F7F4] border border-[#E0D7C6]'
          }`}
        >
          Materias Primas ({rawMaterials.length})
        </button>

        <button
          onClick={() => setActiveSubTab('finished')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'finished'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-[#F9F7F4] border border-[#E0D7C6]'
          }`}
        >
          Producto Terminado ({finishedProducts.length})
        </button>

        <button
          onClick={() => setActiveSubTab('adjustments')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'adjustments'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-[#F9F7F4] border border-[#E0D7C6]'
          }`}
        >
          Historial de Ajustes Manuales ({adjustments.length})
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E0D7C6] rounded-lg focus:ring-2 focus:ring-[#D4A373] focus:outline-none"
        />
      </div>

      {/* SUB-TAB 1: Materias Primas */}
      {activeSubTab === 'raw' && (
        <div className="bg-white rounded-xl border border-[#E0D7C6] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#F9F7F4] border-b border-[#E0D7C6] text-xs text-slate-600 flex justify-between items-center">
            <span><b>Nota de Costo Real:</b> El costo neto considera la merma de alistamiento observada en compras.</span>
            <span className="font-bold text-[#2D463E]">Costo Neto = Costo Bruto / (1 - % Merma)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Materia Prima</th>
                  <th className="p-3.5">% Merma Alistamiento</th>
                  <th className="p-3.5">Stock Bruto</th>
                  <th className="p-3.5">Stock Neto Utilizable</th>
                  <th className="p-3.5">Costo Bruto / Unid</th>
                  <th className="p-3.5">Costo Neto Real / Unid</th>
                  <th className="p-3.5">Estado Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rawMaterials
                  .filter(rm => rm.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(rm => {
                    const isLow = rm.stockNetUsable <= rm.minStockThreshold;
                    return (
                      <tr key={rm.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-800">{rm.name}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            rm.preparationLossPercentage > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {rm.preparationLossPercentage}% merma
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 font-medium">
                          {rm.stockGross.toLocaleString()} {rm.unit}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {rm.stockNetUsable.toLocaleString()} {rm.unit}
                        </td>
                        <td className="p-3.5 text-slate-500">
                          ${rm.weightedAvgGrossCostPerUnit.toFixed(2)}
                        </td>
                        <td className="p-3.5 font-bold text-[#E44F27]">
                          ${rm.weightedAvgNetCostPerUnit.toFixed(2)} / {rm.unit}
                        </td>
                        <td className="p-3.5">
                          {isLow ? (
                            <span className="inline-flex items-center space-x-1 text-red-700 bg-red-100 px-2 py-0.5 rounded text-[10px] font-bold">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Stock Bajo (Mín: {rm.minStockThreshold})</span>
                            </span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                              OK Óptimo
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Producto Terminado */}
      {activeSubTab === 'finished' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Producto Terminado</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Presentación</th>
                  <th className="p-3.5">Stock en Bolsas</th>
                  <th className="p-3.5">Costo Unitario</th>
                  <th className="p-3.5">Precio Venta</th>
                  <th className="p-3.5">Margen %</th>
                  <th className="p-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {finishedProducts
                  .filter(fp => fp.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(fp => {
                    const margin = fp.salePrice > 0 ? ((fp.salePrice - fp.currentUnitCost) / fp.salePrice) * 100 : 0;
                    return (
                      <tr key={fp.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-800">{fp.name}</td>
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                            {fp.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">{fp.packageSizeGrams} gramos</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                            fp.stockUnits > 10 ? 'bg-emerald-100 text-emerald-800' :
                            fp.stockUnits > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {fp.stockUnits} bolsas
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800">${fp.currentUnitCost.toLocaleString('es-CO')}</td>
                        <td className="p-3.5 font-bold text-emerald-700">${fp.salePrice.toLocaleString('es-CO')}</td>
                        <td className="p-3.5 font-extrabold text-[#EF8828]">{margin.toFixed(1)}%</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleOpenEditProduct(fp)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg font-bold text-[11px] inline-flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
                            title="Cambiar precio de venta o stock"
                          >
                            <Edit2 className="w-3 h-3 text-[#EF8828]" />
                            <span>Fijar Precio</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Historial de Ajustes Manuales */}
      {activeSubTab === 'adjustments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5">Ítem Ajustado</th>
                  <th className="p-3.5">Ajuste Cantidad</th>
                  <th className="p-3.5">Causal / Motivo</th>
                  <th className="p-3.5">Costo Unitario</th>
                  <th className="p-3.5">Impacto Financiero</th>
                  <th className="p-3.5">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adjustments.map(adj => (
                  <tr key={adj.id} className="hover:bg-slate-50">
                    <td className="p-3.5 text-slate-500">{adj.date}</td>
                    <td className="p-3.5 font-bold text-slate-800">{adj.itemName}</td>
                    <td className="p-3.5 font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        adj.quantityAdjusted < 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {adj.quantityAdjusted > 0 ? `+${adj.quantityAdjusted}` : adj.quantityAdjusted}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                        {adj.reason}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">${adj.unitCost.toFixed(2)}</td>
                    <td className="p-3.5 font-extrabold text-red-600">
                      -${adj.financialLossValue.toLocaleString('es-CO')}
                    </td>
                    <td className="p-3.5 text-slate-500 italic max-w-xs">{adj.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Ajuste Manual de Inventario */}
      {isAdjustmentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setIsAdjustmentModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-3">
              <div className="p-2 bg-red-600 text-white rounded-lg">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">Ajuste Manual de Inventario</h3>
                <p className="text-xs text-slate-500">Registrar mermas por daño, vencimiento o regalas de muestra</p>
              </div>
            </div>

            <form onSubmit={handleAdjustmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Inventario *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setItemType('RawMaterial');
                      setSelectedItemId('');
                    }}
                    className={`py-2 rounded-xl font-bold border ${
                      itemType === 'RawMaterial'
                        ? 'bg-[#344E5C] text-white border-[#344E5C]'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    Materia Prima
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setItemType('FinishedProduct');
                      setSelectedItemId('');
                    }}
                    className={`py-2 rounded-xl font-bold border ${
                      itemType === 'FinishedProduct'
                        ? 'bg-[#344E5C] text-white border-[#344E5C]'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    Producto Terminado
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Seleccionar Ítem *</label>
                <select
                  value={selectedItemId}
                  onChange={e => setSelectedItemId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#344E5C]"
                  required
                >
                  <option value="">-- Seleccionar --</option>
                  {itemType === 'RawMaterial' ? (
                    rawMaterials.map(rm => (
                      <option key={rm.id} value={rm.id}>
                        {rm.name} (Stock Neto: {rm.stockNetUsable} {rm.unit})
                      </option>
                    ))
                  ) : (
                    finishedProducts.map(fp => (
                      <option key={fp.id} value={fp.id}>
                        {fp.name} (Stock: {fp.stockUnits} bolsas)
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cantidad del Ajuste *</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="Ej: -100 (para restar) o 100"
                    value={quantityAdjusted}
                    onChange={e => setQuantityAdjusted(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#344E5C]"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Negativo = Pérdida / Baja | Positivo = Entrada</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Causal / Motivo *</label>
                  <select
                    value={reason}
                    onChange={e => setReason(e.target.value as AdjustmentReason)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#344E5C]"
                  >
                    <option value="Daño/Merma">Daño / Deterioro</option>
                    <option value="Vencimiento">Vencimiento</option>
                    <option value="Muestra/Regalo">Muestra Gratis / Regalo</option>
                    <option value="Ajuste de Conteo">Ajuste de Conteo Físico</option>
                    <option value="Otro">Otro Motivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observaciones / Detalle *</label>
                <textarea
                  placeholder="Ej: 100g de manzana ablandada por calor en cocina."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#344E5C]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nueva Materia Prima */}
      {isNewRawModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E0D7C6] relative my-8 text-xs space-y-4">
            <button
              onClick={() => setIsNewRawModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-[#E0D7C6]/60 pb-3">
              <div className="p-2.5 bg-[#2D463E] text-white rounded-xl">
                <Package className="w-5 h-5 text-[#D4A373]" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-[#2D463E]">Registrar Nueva Materia Prima</h3>
                <p className="text-slate-500">Añade insumo con su merma inicial de alistamiento</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newRawName) return;
                const newRm: RawMaterial = {
                  id: `rm-${Date.now()}`,
                  name: newRawName,
                  unit: newRawUnit,
                  stockGross: 0,
                  preparationLossPercentage: newRawLossPct,
                  stockNetUsable: 0,
                  weightedAvgGrossCostPerUnit: 0,
                  weightedAvgNetCostPerUnit: 0,
                  supplierId: 'sup-1',
                  minStockThreshold: newRawMinStock
                };
                if (onAddRawMaterial) onAddRawMaterial(newRm);
                setIsNewRawModalOpen(false);
                setNewRawName('');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre de la Materia Prima *</label>
                <input
                  type="text"
                  placeholder="Ej: Trozos de Pavo, Camote Orgánico"
                  value={newRawName}
                  onChange={e => setNewRawName(e.target.value)}
                  className="w-full p-2.5 border border-[#E0D7C6] rounded-xl font-semibold focus:ring-2 focus:ring-[#D4A373]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unidad *</label>
                  <select
                    value={newRawUnit}
                    onChange={e => setNewRawUnit(e.target.value as UnitType)}
                    className="w-full p-2.5 border border-[#E0D7C6] rounded-xl font-semibold"
                  >
                    <option value="g">Gramos (g)</option>
                    <option value="kg">Kilos (kg)</option>
                    <option value="unidad">Unidades</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">% Merma Alistamiento *</label>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    value={newRawLossPct}
                    onChange={e => setNewRawLossPct(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#E0D7C6] rounded-xl font-bold text-center"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stock Mínimo de Alerta ({newRawUnit}) *</label>
                <input
                  type="number"
                  min="0"
                  value={newRawMinStock}
                  onChange={e => setNewRawMinStock(Number(e.target.value))}
                  className="w-full p-2.5 border border-[#E0D7C6] rounded-xl font-semibold"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#E0D7C6]/60">
                <button
                  type="button"
                  onClick={() => setIsNewRawModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#2D463E] hover:bg-[#233831] text-white rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Guardar Materia Prima
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nuevo Producto Terminado */}
      {isNewFinishedModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E0D7C6] relative my-8 text-xs space-y-4">
            <button
              onClick={() => setIsNewFinishedModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-[#E0D7C6]/60 pb-3">
              <div className="p-2.5 bg-[#2D463E] text-white rounded-xl">
                <Package className="w-5 h-5 text-[#D4A373]" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-[#2D463E]">Registrar Producto Terminado</h3>
                <p className="text-slate-500">Agrega una presentación empacada lista para venta</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newFinishedName) return;
                const newFp: FinishedProduct = {
                  id: `fp-${Date.now()}`,
                  name: newFinishedName,
                  recipeId: 'rec-1',
                  packageSizeGrams: newFinishedPackageSize,
                  stockUnits: 0,
                  currentUnitCost: 0,
                  salePrice: newFinishedPrice,
                  category: newFinishedCategory
                };
                if (onAddFinishedProduct) onAddFinishedProduct(newFp);
                setIsNewFinishedModalOpen(false);
                setNewFinishedName('');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  placeholder="Ej: Snacks de Pavo Deshidratado 250g"
                  value={newFinishedName}
                  onChange={e => setNewFinishedName(e.target.value)}
                  className="w-full p-2.5 border border-[#E0D7C6] rounded-xl font-semibold focus:ring-2 focus:ring-[#D4A373]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tamaño (Gramos) *</label>
                  <input
                    type="number"
                    min="10"
                    value={newFinishedPackageSize}
                    onChange={e => setNewFinishedPackageSize(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#E0D7C6] rounded-xl font-bold text-center"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría *</label>
                  <select
                    value={newFinishedCategory}
                    onChange={e => setNewFinishedCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-[#E0D7C6] rounded-xl font-semibold"
                  >
                    <option value="Deshidratados">Deshidratados</option>
                    <option value="Galletas">Galletas</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Precio de Venta Sugerido ($ COP) *</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={newFinishedPrice}
                  onChange={e => setNewFinishedPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-[#E0D7C6] rounded-xl font-extrabold text-[#2D463E]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#E0D7C6]/60">
                <button
                  type="button"
                  onClick={() => setIsNewFinishedModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#2D463E] hover:bg-[#233831] text-white rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Guardar Producto Terminado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Editar Precio de Venta y Stock */}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => {
                setIsEditProductModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-[#EF8828]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-800 leading-tight">
                  Fijar Precio de Venta
                </h3>
                <p className="text-xs text-slate-500 font-semibold">{editingProduct.name} ({editingProduct.packageSizeGrams}g)</p>
              </div>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Costo Unitario de Producción:</span>
                  <span className="font-bold text-slate-800">${editingProduct.currentUnitCost.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ganancia Neta Estimada por Bolsa:</span>
                  <span className="font-bold text-emerald-700">
                    ${Math.max(0, editPrice - editingProduct.currentUnitCost).toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 border-t border-slate-200/80 pt-1.5">
                  <span>Margen de Rentabilidad:</span>
                  <span className="font-extrabold text-[#EF8828] text-sm">
                    {editPrice > 0 ? (((editPrice - editingProduct.currentUnitCost) / editPrice) * 100).toFixed(1) : '0.0'}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nuevo Precio de Venta al Público ($ COP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={editPrice}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 text-sm font-extrabold text-[#2D463E] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D463E] focus:outline-none"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Este precio se actualizará inmediatamente en la Tienda Web y en el Catálogo de WhatsApp.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Stock Disponible en Inventario (Bolsas)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editStock}
                  onChange={e => setEditStock(Number(e.target.value))}
                  className="w-full p-2.5 text-sm font-bold text-slate-800 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#2D463E] hover:bg-[#233831] text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Guardar Precio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

