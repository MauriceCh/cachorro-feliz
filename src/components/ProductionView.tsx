import React, { useState } from 'react';
import { 
  Recipe, 
  RawMaterial, 
  ProductionBatch, 
  FinishedProduct, 
  FixedCost 
} from '../types';
import { 
  ChefHat, 
  Plus, 
  Flame, 
  Droplet, 
  Scale, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  X,
  Package
} from 'lucide-react';

interface ProductionViewProps {
  recipes: Recipe[];
  rawMaterials: RawMaterial[];
  finishedProducts: FinishedProduct[];
  productionBatches: ProductionBatch[];
  fixedCosts: FixedCost[];
  onExecuteBatch: (
    recipe: Recipe, 
    multiplier: number, 
    producedPackages: { finishedProductId: string; packageSizeGrams: number; unitsProduced: number }[],
    notes: string
  ) => void;
  onAddRecipe?: (recipe: Recipe) => void;
  isNewBatchModalOpen: boolean;
  setIsNewBatchModalOpen: (open: boolean) => void;
}

export const ProductionView: React.FC<ProductionViewProps> = ({
  recipes,
  rawMaterials,
  finishedProducts,
  productionBatches,
  fixedCosts,
  onExecuteBatch,
  onAddRecipe,
  isNewBatchModalOpen,
  setIsNewBatchModalOpen
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(recipes[0] || null);
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);
  const [batchNotes, setBatchNotes] = useState<string>('');

  // Recipe Cost Calculator Modal State
  const [isNewRecipeModalOpen, setIsNewRecipeModalOpen] = useState<boolean>(false);
  const [newRecipeName, setNewRecipeName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Galletas' | 'Deshidratados' | 'Otros'>('Deshidratados');
  const [newIngredients, setNewIngredients] = useState<{ rawMaterialId: string; requiredNetQuantity: number }[]>([
    { rawMaterialId: rawMaterials[0]?.id || '', requiredNetQuantity: 500 }
  ]);
  const [newCookingLossPct, setNewCookingLossPct] = useState<number>(35);
  const [newPackageSizesInput, setNewPackageSizesInput] = useState<string>('100, 250, 500');

  // Fixed Cost Monthly Total & Overhead Per Batch Allocation
  const totalMonthlyFixedCost = fixedCosts.reduce((sum, fc) => sum + fc.monthlyAmount, 0);
  // Estimate average 20 batches per month -> allocated fixed cost per batch = totalFixed / 20
  const estimatedAllocatedFixedCostPerBatch = totalMonthlyFixedCost > 0 ? Math.round(totalMonthlyFixedCost / 20) : 15000;

  // Recipe Costing Breakdown based on Weighted Average Net Cost of raw materials
  const calculateRecipeCost = (recipe: Recipe) => {
    let rawMaterialsCost = 0;
    const ingredientDetails = recipe.ingredients.map(ing => {
      const rm = rawMaterials.find(r => r.id === ing.rawMaterialId);
      const netCostUnit = rm ? rm.weightedAvgNetCostPerUnit : 0;
      const ingCost = ing.requiredNetQuantity * netCostUnit;
      rawMaterialsCost += ingCost;
      return {
        ...ing,
        rawMaterial: rm,
        netCostUnit,
        ingCost
      };
    });

    const totalBatchCostWithFixed = rawMaterialsCost + estimatedAllocatedFixedCostPerBatch;
    
    // Cost per gram of finished product
    const costPerFinishedGram = recipe.postCookFinalYieldGrams > 0 ? totalBatchCostWithFixed / recipe.postCookFinalYieldGrams : 0;

    // Package costs
    const packageCosts = recipe.standardPackageSizes.map(sizeGrams => {
      const unitCost = Math.round(costPerFinishedGram * sizeGrams);
      return {
        sizeGrams,
        unitCost
      };
    });

    return {
      ingredientDetails,
      rawMaterialsCost,
      allocatedFixedCost: estimatedAllocatedFixedCostPerBatch,
      totalBatchCostWithFixed,
      costPerFinishedGram,
      packageCosts
    };
  };

  const activeCosting = selectedRecipe ? calculateRecipeCost(selectedRecipe) : null;

  // Package production configuration for execution modal
  const [packageUnitsInput, setPackageUnitsInput] = useState<{ [size: number]: number }>({
    250: 6,
    500: 0,
    100: 3
  });

  // Check stock availability for batch execution
  const checkStockSufficiency = (recipe: Recipe, multiplier: number) => {
    const missing: { name: string; needed: number; available: number; unit: string }[] = [];
    recipe.ingredients.forEach(ing => {
      const rm = rawMaterials.find(r => r.id === ing.rawMaterialId);
      const totalNeeded = ing.requiredNetQuantity * multiplier;
      const available = rm ? rm.stockNetUsable : 0;
      if (totalNeeded > available) {
        missing.push({
          name: ing.rawMaterialName,
          needed: totalNeeded,
          available,
          unit: ing.unit
        });
      }
    });
    return missing;
  };

  const stockMissing = selectedRecipe ? checkStockSufficiency(selectedRecipe, batchMultiplier) : [];

  const handleExecuteBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipe) return;

    if (stockMissing.length > 0) {
      alert(`No hay suficiente inventario de materia prima:\n${stockMissing.map(m => `• ${m.name}: Necesarios ${m.needed}${m.unit}, disponibles ${m.available}${m.unit}`).join('\n')}`);
      return;
    }

    // Build package production output
    const totalYieldGrams = selectedRecipe.postCookFinalYieldGrams * batchMultiplier;
    const producedPackages: { finishedProductId: string; packageSizeGrams: number; unitsProduced: number }[] = [];

    selectedRecipe.standardPackageSizes.forEach(size => {
      const qty = packageUnitsInput[size] || 0;
      if (qty > 0) {
        // Find matching finished product by recipe and package size
        const fp = finishedProducts.find(p => p.recipeId === selectedRecipe.id && p.packageSizeGrams === size);
        if (fp) {
          producedPackages.push({
            finishedProductId: fp.id,
            packageSizeGrams: size,
            unitsProduced: qty
          });
        }
      }
    });

    if (producedPackages.length === 0) {
      alert('Debes ingresar al menos 1 unidad de empaque a producir.');
      return;
    }

    onExecuteBatch(selectedRecipe, batchMultiplier, producedPackages, batchNotes);
    setIsNewBatchModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-[#E0D7C6] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#2D463E] font-display flex items-center space-x-2">
            <ChefHat className="w-6 h-6 text-[#2D463E]" />
            <span>Centro de Producción y Motor de Mermas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Recetas artesanales con merma de alistamiento y merma de deshidratado/horneado con costo promedio
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsNewRecipeModalOpen(true)}
            className="bg-[#D4A373] hover:bg-[#c29263] text-white px-4 py-2.5 rounded-lg font-bold text-xs shadow-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Calculadora & Nueva Receta</span>
          </button>

          <button
            onClick={() => setIsNewBatchModalOpen(true)}
            className="bg-[#2D463E] hover:bg-[#233831] text-white px-4 py-2.5 rounded-lg font-bold text-xs shadow-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
          >
            <Flame className="w-4 h-4 text-[#D4A373]" />
            <span>Ejecutar Lote de Cocina</span>
          </button>
        </div>
      </div>

      {/* Recipe Explorer & Cost Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recipe List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#2D463E] uppercase tracking-wider font-display">
            Recetas Registradas ({recipes.length})
          </h3>

          <div className="space-y-2.5">
            {recipes.map(recipe => {
              const isSelected = selectedRecipe?.id === recipe.id;
              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2D463E] text-white border-[#2D463E] shadow-sm'
                      : 'bg-white text-slate-800 border-[#E0D7C6] hover:border-[#D4A373]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#D4A373] text-white' : 'bg-[#F9F7F4] text-slate-600'
                    }`}>
                      {recipe.category}
                    </span>
                    <span className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {recipe.ingredients.length} Ingredientes
                    </span>
                  </div>

                  <h4 className="font-bold text-sm mb-1">{recipe.name}</h4>

                  <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100/30">
                    <span>Crudo: <b>{recipe.rawMixTotalGrams}g</b></span>
                    <span className={isSelected ? 'text-amber-200 font-bold' : 'text-[#D4A373] font-bold'}>→ Final: {recipe.postCookFinalYieldGrams}g</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Recipe Breakdown & Yield Analysis */}
        {selectedRecipe && activeCosting && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E0D7C6] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E0D7C6]/60 pb-4 gap-2">
              <div>
                <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">Detalle de Receta Seleccionada</span>
                <h3 className="text-2xl font-bold font-display text-[#2D463E]">{selectedRecipe.name}</h3>
              </div>

              <button
                onClick={() => setIsNewBatchModalOpen(true)}
                className="bg-[#D4A373] hover:bg-[#c29263] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 self-start cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cocinar esta Receta</span>
              </button>
            </div>

            {/* Critical Yield & Loss Metric Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 text-[#EF8828] rounded-lg">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Peso Mezcla Cruda</div>
                  <div className="text-lg font-bold text-slate-800">{selectedRecipe.rawMixTotalGrams.toLocaleString()} grs</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 text-[#E44F27] rounded-lg">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Merma por Cocción/Agua</div>
                  <div className="text-lg font-bold text-[#E44F27]">
                    -{selectedRecipe.cookingOrDehydrationLossPercentage}%
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Rendimiento Final Listo</div>
                  <div className="text-lg font-bold text-emerald-700">{selectedRecipe.postCookFinalYieldGrams.toLocaleString()} grs</div>
                </div>
              </div>
            </div>

            {/* Ingredients Table with Preparation Loss & Real Weighted Cost */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-display">
                Ingredientes & Costo Promedio Neto (Por Tanda)
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Ingrediente</th>
                      <th className="p-2.5">Cantidad Neta</th>
                      <th className="p-2.5">% Merma Alist.</th>
                      <th className="p-2.5">Costo Neto / Unid</th>
                      <th className="p-2.5 text-right">Subtotal Insumo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {activeCosting.ingredientDetails.map((ing, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800">{ing.rawMaterialName}</td>
                        <td className="p-2.5 font-semibold">{ing.requiredNetQuantity} {ing.unit}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            (ing.rawMaterial?.preparationLossPercentage || 0) > 0 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ing.rawMaterial?.preparationLossPercentage || 0}% merma
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600">
                          ${ing.netCostUnit.toFixed(2)} / {ing.unit}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          ${Math.round(ing.ingCost).toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50/80 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="p-2.5 text-slate-600">Total Materia Prima (Neto):</td>
                      <td className="p-2.5 text-right text-slate-900">${Math.round(activeCosting.rawMaterialsCost).toLocaleString('es-CO')}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-2.5 text-slate-600">+ Asignación Costos Fijos por Lote:</td>
                      <td className="p-2.5 text-right text-amber-700">${activeCosting.allocatedFixedCost.toLocaleString('es-CO')}</td>
                    </tr>
                    <tr className="bg-amber-100/60 text-sm text-[#344E5C]">
                      <td colSpan={4} className="p-2.5 font-extrabold">COSTO REAL TOTAL LOTE:</td>
                      <td className="p-2.5 text-right font-extrabold">${Math.round(activeCosting.totalBatchCostWithFixed).toLocaleString('es-CO')} COP</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Cost Per Finished Package Size */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display">
                Costo Unitario por Bolsa Producida
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeCosting.packageCosts.map(pkg => {
                  const fp = finishedProducts.find(p => p.recipeId === selectedRecipe.id && p.packageSizeGrams === pkg.sizeGrams);
                  const margin = fp && fp.salePrice > 0 ? ((fp.salePrice - pkg.unitCost) / fp.salePrice) * 100 : 0;
                  return (
                    <div key={pkg.sizeGrams} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
                      <div>
                        <div className="font-bold text-slate-800 text-xs">Bolsa de {pkg.sizeGrams}g</div>
                        <div className="text-[11px] text-slate-500">
                          Precio Venta Sugerido: <span className="font-bold text-emerald-700">${fp?.salePrice.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-[#344E5C]">${pkg.unitCost.toLocaleString('es-CO')} COP</div>
                        <div className="text-[10px] text-amber-600 font-bold">{margin.toFixed(1)}% Margen</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Production History Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-800 font-display flex items-center space-x-2">
          <Layers className="w-5 h-5 text-[#344E5C]" />
          <span>Historial de Lotes Fabricados</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">N° Lote</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Receta</th>
                <th className="p-3">Tandas</th>
                <th className="p-3">Rendimiento Producido</th>
                <th className="p-3">Costo Total Lote</th>
                <th className="p-3">Costo Prom por Bolsa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productionBatches.map(batch => (
                <tr key={batch.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">{batch.batchNumber}</td>
                  <td className="p-3 text-slate-500">{batch.date}</td>
                  <td className="p-3 font-semibold text-slate-800">{batch.recipeName}</td>
                  <td className="p-3 text-slate-700">{batch.batchMultiplier}x</td>
                  <td className="p-3">
                    <div className="space-y-0.5">
                      {batch.yieldPackagesProduced.map((y, idx) => (
                        <span key={idx} className="inline-block bg-amber-50 text-[#EF8828] text-[11px] px-2 py-0.5 rounded font-bold mr-1">
                          {y.unitsProduced}x {y.finishedProductName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-bold text-slate-900">${batch.totalBatchCost.toLocaleString('es-CO')}</td>
                  <td className="p-3 text-emerald-700 font-bold">${batch.costPerFinishedUnit.toLocaleString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Execute Production Batch */}
      {isNewBatchModalOpen && selectedRecipe && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setIsNewBatchModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-3">
              <div className="p-2 bg-[#E44F27] text-white rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">Registrar Lote de Producción</h3>
                <p className="text-xs text-slate-500">Descuenta automáticamente insumos y suma producto terminado</p>
              </div>
            </div>

            <form onSubmit={handleExecuteBatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Receta a Preparar *</label>
                <select
                  value={selectedRecipe.id}
                  onChange={e => {
                    const r = recipes.find(rec => rec.id === e.target.value);
                    if (r) setSelectedRecipe(r);
                  }}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#E44F27]"
                >
                  {recipes.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Número de Tandas (Multiplicador) *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={batchMultiplier}
                  onChange={e => setBatchMultiplier(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#E44F27]"
                  required
                />
              </div>

              {/* Stock Verification Alert */}
              {stockMissing.length > 0 ? (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Insumos Insuficientes en Inventario:</span>
                  </div>
                  {stockMissing.map((m, idx) => (
                    <div key={idx} className="pl-5 text-[11px]">
                      • {m.name}: Requeridos {m.needed} {m.unit} | Disponibles solo {m.available} {m.unit}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Hay suficiente stock de materias primas para este lote!</span>
                </div>
              )}

              {/* Enter Units Produced per Package Size */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Bolsas Empacadas Producidas:
                </label>
                {selectedRecipe.standardPackageSizes.map(size => (
                  <div key={size} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700">Bolsa de {size}g:</span>
                    <input
                      type="number"
                      min="0"
                      value={packageUnitsInput[size] || 0}
                      onChange={e => setPackageUnitsInput({
                        ...packageUnitsInput,
                        [size]: parseInt(e.target.value) || 0
                      })}
                      className="w-20 p-1 border border-slate-300 rounded text-center font-bold"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notas del Lote (Opcional)</label>
                <textarea
                  placeholder="Ej: Temperatura de horneado 160°C. Buena textura y dorado perfecto."
                  value={batchNotes}
                  onChange={e => setBatchNotes(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#E44F27]"
                />
              </div>

              {/* Action */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewBatchModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={stockMissing.length > 0}
                  className="px-5 py-2 text-xs font-bold bg-[#E44F27] hover:bg-[#c93e18] disabled:bg-slate-300 text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirmar y Cocinar Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Calculadora de Costos & Creación de Receta */}
      {isNewRecipeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-[#E0D7C6] relative my-8 text-xs space-y-5">
            <button
              onClick={() => setIsNewRecipeModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-[#E0D7C6]/60 pb-3">
              <div className="p-2.5 bg-[#2D463E] text-white rounded-xl">
                <ChefHat className="w-6 h-6 text-[#D4A373]" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-[#2D463E]">Calculadora de Costos & Creador de Recetas</h3>
                <p className="text-slate-500">Integra costo promedio neto de materias primas, mermas de proceso y asignación de costos fijos</p>
              </div>
            </div>

            {/* Calculations Engine Live Metrics */}
            {(() => {
              const calcRawMixGrams = newIngredients.reduce((sum, ing) => sum + (Number(ing.requiredNetQuantity) || 0), 0);
              const calcProcessLossGrams = Math.round(calcRawMixGrams * (newCookingLossPct / 100));
              const calcYieldGrams = Math.max(1, calcRawMixGrams - calcProcessLossGrams);
              
              let calcIngCost = 0;
              newIngredients.forEach(ing => {
                const rm = rawMaterials.find(r => r.id === ing.rawMaterialId);
                const netUnitCost = rm ? rm.weightedAvgNetCostPerUnit : 0;
                calcIngCost += (Number(ing.requiredNetQuantity) || 0) * netUnitCost;
              });

              const calcTotalBatchCost = calcIngCost + estimatedAllocatedFixedCostPerBatch;
              const calcCostPerGram = calcYieldGrams > 0 ? calcTotalBatchCost / calcYieldGrams : 0;
              const parsedPackageSizes = newPackageSizesInput
                .split(',')
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n) && n > 0);

              const handleSaveRecipeSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                if (!newRecipeName) return;

                const newRecipe: Recipe = {
                  id: `recipe-${Date.now()}`,
                  name: newRecipeName,
                  category: newCategory,
                  ingredients: newIngredients.map(ing => {
                    const rm = rawMaterials.find(r => r.id === ing.rawMaterialId);
                    return {
                      rawMaterialId: ing.rawMaterialId,
                      rawMaterialName: rm ? rm.name : 'Insumo',
                      requiredNetQuantity: Number(ing.requiredNetQuantity) || 0,
                      unit: rm ? rm.unit : 'g'
                    };
                  }),
                  rawMixTotalGrams: calcRawMixGrams,
                  cookingOrDehydrationLossPercentage: newCookingLossPct,
                  postCookFinalYieldGrams: calcYieldGrams,
                  standardPackageSizes: parsedPackageSizes.length > 0 ? parsedPackageSizes : [250]
                };

                if (onAddRecipe) {
                  onAddRecipe(newRecipe);
                }
                setSelectedRecipe(newRecipe);
                setIsNewRecipeModalOpen(false);
              };

              return (
                <form onSubmit={handleSaveRecipeSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Nombre de la Receta *</label>
                      <input
                        type="text"
                        placeholder="Ej: Galletas de Pollo y Camote Deshidratado"
                        value={newRecipeName}
                        onChange={e => setNewRecipeName(e.target.value)}
                        className="w-full p-2.5 border border-[#E0D7C6] rounded-lg font-semibold focus:ring-2 focus:ring-[#D4A373] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Categoría *</label>
                      <select
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value as any)}
                        className="w-full p-2.5 border border-[#E0D7C6] rounded-lg font-semibold focus:ring-2 focus:ring-[#D4A373] focus:outline-none"
                      >
                        <option value="Deshidratados">Deshidratados</option>
                        <option value="Galletas">Galletas / Horneados</option>
                        <option value="Otros">Otros Snacks</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Ingredients list */}
                  <div className="bg-[#F9F7F4] p-4 rounded-xl border border-[#E0D7C6] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#2D463E]">1. Materias Primas Requeridas (Gramos Netos)</h4>
                      <button
                        type="button"
                        onClick={() => setNewIngredients([...newIngredients, { rawMaterialId: rawMaterials[0]?.id || '', requiredNetQuantity: 100 }])}
                        className="bg-[#2D463E] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-[#233831] flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#D4A373]" />
                        <span>Agregar Insumo</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {newIngredients.map((ing, idx) => {
                        const rm = rawMaterials.find(r => r.id === ing.rawMaterialId);
                        const netUnitCost = rm ? rm.weightedAvgNetCostPerUnit : 0;
                        const ingCostTotal = (Number(ing.requiredNetQuantity) || 0) * netUnitCost;

                        return (
                          <div key={idx} className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-lg border border-[#E0D7C6]">
                            <div className="flex-1 min-w-[180px]">
                              <select
                                value={ing.rawMaterialId}
                                onChange={e => {
                                  const updated = [...newIngredients];
                                  updated[idx].rawMaterialId = e.target.value;
                                  setNewIngredients(updated);
                                }}
                                className="w-full p-1.5 border border-slate-200 rounded text-xs"
                              >
                                {rawMaterials.map(r => (
                                  <option key={r.id} value={r.id}>
                                    {r.name} (Merma alistamiento: {r.preparationLossPercentage}%)
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="w-28 flex items-center space-x-1">
                              <input
                                type="number"
                                min="1"
                                placeholder="Gramos"
                                value={ing.requiredNetQuantity}
                                onChange={e => {
                                  const updated = [...newIngredients];
                                  updated[idx].requiredNetQuantity = Number(e.target.value);
                                  setNewIngredients(updated);
                                }}
                                className="w-full p-1.5 border border-slate-200 rounded text-center font-bold text-xs"
                              />
                              <span className="text-slate-500 font-semibold text-[11px]">{rm?.unit || 'g'}</span>
                            </div>

                            <div className="w-32 text-right">
                              <span className="text-[10px] text-slate-400 block">Costo neto estim:</span>
                              <span className="font-bold text-[#2D463E] text-xs">${Math.round(ingCostTotal).toLocaleString('es-CO')}</span>
                            </div>

                            {newIngredients.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setNewIngredients(newIngredients.filter((_, i) => i !== idx))}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Process Waste (Dehydration / Cooking loss) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F9F7F4] p-4 rounded-xl border border-[#E0D7C6]">
                    <div>
                      <h4 className="font-bold text-[#2D463E] mb-2">2. Merma Directa de Proceso (Deshidratado/Cocción)</h4>
                      <label className="block text-[11px] text-slate-600 mb-1">Pérdida por Humedad / Evaporación (%)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="95"
                          value={newCookingLossPct}
                          onChange={e => setNewCookingLossPct(Number(e.target.value))}
                          className="w-24 p-2 border border-[#E0D7C6] bg-white rounded-lg font-bold text-center text-sm"
                        />
                        <span className="text-slate-500 font-semibold">% de agua perdida</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Ej: 70% en carne deshidratada, 35% en galletas horneadas.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#2D463E] mb-2">3. Presentaciones Empacadas (Gramos por Bolsa)</h4>
                      <label className="block text-[11px] text-slate-600 mb-1">Tamaños Estándar (separados por coma)</label>
                      <input
                        type="text"
                        value={newPackageSizesInput}
                        onChange={e => setNewPackageSizesInput(e.target.value)}
                        className="w-full p-2 border border-[#E0D7C6] bg-white rounded-lg font-bold text-xs"
                        placeholder="Ej: 100, 250, 500"
                      />
                    </div>
                  </div>

                  {/* Summary Cost & Yield Output Banner */}
                  <div className="p-4 bg-emerald-50/90 rounded-xl border border-emerald-200 text-[#2D463E] space-y-3">
                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-emerald-800">Resumen de Costos y Rendimiento del Lote Base</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                        <span className="text-[10px] text-slate-500 block">Mezcla Cruda:</span>
                        <span className="font-bold text-sm text-slate-800">{calcRawMixGrams.toLocaleString()} g</span>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                        <span className="text-[10px] text-slate-500 block">Rendimiento Final:</span>
                        <span className="font-bold text-sm text-[#D4A373]">{calcYieldGrams.toLocaleString()} g</span>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                        <span className="text-[10px] text-slate-500 block">Costo Materia Prima:</span>
                        <span className="font-bold text-sm text-slate-800">${Math.round(calcIngCost).toLocaleString('es-CO')}</span>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                        <span className="text-[10px] text-slate-500 block">Costo Lote (con Fijos):</span>
                        <span className="font-bold text-sm text-emerald-800">${Math.round(calcTotalBatchCost).toLocaleString('es-CO')}</span>
                      </div>
                    </div>

                    {/* Calculated Unit Costs per Package */}
                    <div className="pt-2 border-t border-emerald-200/80">
                      <div className="text-[11px] font-bold text-emerald-900 mb-1">Costo Unitario Calculado por Bolsa:</div>
                      <div className="flex flex-wrap gap-2">
                        {parsedPackageSizes.map(size => {
                          const unitCost = Math.round(calcCostPerGram * size);
                          return (
                            <span key={size} className="bg-white px-3 py-1 rounded-lg border border-emerald-200 font-bold text-xs text-[#2D463E] shadow-xs">
                              Bolsa de {size}g: <span className="text-emerald-700 font-extrabold">${unitCost.toLocaleString('es-CO')} COP</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-[#E0D7C6]/60">
                    <button
                      type="button"
                      onClick={() => setIsNewRecipeModalOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold bg-[#2D463E] hover:bg-[#233831] text-white rounded-lg shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4 text-[#D4A373]" />
                      <span>Guardar Receta en Base de Datos</span>
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
