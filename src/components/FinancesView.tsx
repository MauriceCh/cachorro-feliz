import React, { useState } from 'react';
import { 
  FixedCost, 
  Sale, 
  PurchaseRecord, 
  FinishedProduct, 
  Recipe 
} from '../types';
import { 
  DollarSign, 
  Building2, 
  TrendingUp, 
  PieChart, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  X, 
  ShieldAlert, 
  Sparkles,
  Calculator
} from 'lucide-react';

interface FinancesViewProps {
  fixedCosts: FixedCost[];
  sales: Sale[];
  purchases: PurchaseRecord[];
  finishedProducts: FinishedProduct[];
  recipes: Recipe[];
  onAddFixedCost: (fixedCost: Omit<FixedCost, 'id'>) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  fixedCosts,
  sales,
  purchases,
  finishedProducts,
  recipes,
  onAddFixedCost
}) => {
  const [activeTab, setActiveTab] = useState<'pnl' | 'fixedCosts' | 'margins'>('pnl');
  const [isFixedCostModalOpen, setIsFixedCostModalOpen] = useState<boolean>(false);

  // New Fixed Cost Form
  const [costConcept, setCostConcept] = useState<string>('');
  const [costAmount, setCostAmount] = useState<number>(100000);
  const [costCategory, setCostCategory] = useState<FixedCost['category']>('Arriendo');

  const handleFixedCostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!costConcept || costAmount <= 0) return;

    onAddFixedCost({
      concept: costConcept,
      monthlyAmount: Number(costAmount),
      category: costCategory
    });

    setIsFixedCostModalOpen(false);
    setCostConcept('');
    setCostAmount(100000);
  };

  // P&L Metrics
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  
  // Real COGS calculated from sale items unit costs
  const totalCOGS = sales.reduce((acc, s) => {
    const saleCost = s.items.reduce((itemAcc, item) => itemAcc + (item.unitCost * item.quantity), 0);
    return acc + saleCost;
  }, 0);

  const grossProfit = totalRevenue - totalCOGS;
  const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const totalFixedCostsMonth = fixedCosts.reduce((acc, fc) => acc + fc.monthlyAmount, 0);
  const netOperatingProfit = grossProfit - totalFixedCostsMonth;
  const netMarginPercent = totalRevenue > 0 ? (netOperatingProfit / totalRevenue) * 100 : 0;

  const totalPurchasesMonth = purchases.reduce((acc, p) => acc + p.grossTotalPaid, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-[#E0D7C6] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#2D463E] font-display flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-[#2D463E]" />
            <span>Finanzas, Costos Fijos & Rentabilidad Real</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Estado de resultados real incorporando mermas de materias primas y absorción de gastos fijos
          </p>
        </div>

        <button
          onClick={() => setIsFixedCostModalOpen(true)}
          className="bg-[#2D463E] hover:bg-[#233831] text-white px-4 py-2.5 rounded-lg font-bold text-xs shadow-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#D4A373]" />
          <span>+ Registrar Costo Fijo</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E0D7C6] pb-2">
        <button
          onClick={() => setActiveTab('pnl')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pnl'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-[#F9F7F4] border border-[#E0D7C6]'
          }`}
        >
          Estado de Resultados (P&L)
        </button>

        <button
          onClick={() => setActiveTab('fixedCosts')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'fixedCosts'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-[#F9F7F4] border border-[#E0D7C6]'
          }`}
        >
          Estructura de Costos Fijos (${totalFixedCostsMonth.toLocaleString()})
        </button>

        <button
          onClick={() => setActiveTab('margins')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'margins'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-[#F9F7F4] border border-[#E0D7C6]'
          }`}
        >
          Márgenes por Producto
        </button>
      </div>

      {/* SUB-TAB 1: Estado de Resultados P&L */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E0D7C6] shadow-sm">
              <div className="text-xs text-slate-500 font-semibold uppercase">Ventas Brutas Totales</div>
              <div className="text-2xl font-bold text-[#2D463E] mt-1 font-display">
                ${totalRevenue.toLocaleString('es-CO')} COP
              </div>
              <div className="text-xs text-emerald-700 font-bold mt-2 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
                Ingreso por productos y envíos
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E0D7C6] shadow-sm">
              <div className="text-xs text-slate-500 font-semibold uppercase">Utilidad Bruta (Post-mermas)</div>
              <div className="text-2xl font-bold text-[#D4A373] mt-1 font-display">
                ${grossProfit.toLocaleString('es-CO')} COP
              </div>
              <div className="text-xs text-amber-800 font-bold mt-2">
                Margen Bruto: {grossMarginPercent.toFixed(1)}%
              </div>
            </div>

            <div className={`p-5 rounded-xl border shadow-sm ${
              netOperatingProfit >= 0 ? 'bg-emerald-50/80 border-emerald-200' : 'bg-red-50/80 border-red-200'
            }`}>
              <div className="text-xs font-semibold uppercase text-slate-600">Utilidad Neta Operativa</div>
              <div className={`text-2xl font-bold mt-1 font-display ${netOperatingProfit >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
                ${netOperatingProfit.toLocaleString('es-CO')} COP
              </div>
              <div className={`text-xs font-bold mt-2 ${netOperatingProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                Margen Neto: {netMarginPercent.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Income Statement Detailed Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-800 flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-[#344E5C]" />
              <span>Estado de Resultados Detallado (P&L)</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {/* Ingresos */}
              <div className="py-3 flex justify-between items-center font-bold text-slate-800 bg-slate-50 px-3 rounded-lg">
                <span>(+) INGRESOS POR VENTAS DE ALIMENTOS ARTESANALES</span>
                <span className="text-emerald-700 text-sm">${totalRevenue.toLocaleString('es-CO')} COP</span>
              </div>

              {/* COGS */}
              <div className="py-2.5 flex justify-between items-center text-slate-600 pl-4 pr-3">
                <span>(-) Costo de Productos Vendidos (COGS Real con Mermas)</span>
                <span className="text-red-600 font-semibold">-${totalCOGS.toLocaleString('es-CO')} COP</span>
              </div>

              {/* Utilidad Bruta */}
              <div className="py-3 flex justify-between items-center font-bold text-slate-900 bg-amber-50 px-3 rounded-lg">
                <span>(=) UTILIDAD BRUTA EN VENTAS</span>
                <span className="text-[#EF8828] text-sm">${grossProfit.toLocaleString('es-CO')} COP ({grossMarginPercent.toFixed(1)}%)</span>
              </div>

              {/* Costos Fijos */}
              <div className="py-2.5 flex justify-between items-center text-slate-600 pl-4 pr-3">
                <span>(-) Gastos & Costos Fijos de Operación (Arriendo, Servicios, Salarios)</span>
                <span className="text-red-600 font-semibold">-${totalFixedCostsMonth.toLocaleString('es-CO')} COP</span>
              </div>

              {/* Utilidad Neta */}
              <div className="py-3 flex justify-between items-center font-extrabold text-white bg-[#344E5C] px-4 rounded-xl text-sm shadow-xs">
                <span>(=) UTILIDAD NETA REAL OPERATIVA</span>
                <span>${netOperatingProfit.toLocaleString('es-CO')} COP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Fixed Costs Management */}
      {activeTab === 'fixedCosts' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-800">Estructura de Costos Fijos Mensuales</h3>
              <p className="text-xs text-slate-500">Estos gastos se prorratean en cada lote de producción para obtener el costo unitario real</p>
            </div>

            <button
              onClick={() => setIsFixedCostModalOpen(true)}
              className="bg-[#344E5C] hover:bg-[#283e4a] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Concepto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {fixedCosts.map(fc => (
              <div key={fc.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    {fc.category}
                  </span>
                  <div className="font-bold text-slate-800 text-sm mt-1">{fc.concept}</div>
                </div>
                <div className="font-extrabold text-[#344E5C] text-sm">
                  ${fc.monthlyAmount.toLocaleString('es-CO')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Product Profitability Margins */}
      {activeTab === 'margins' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Producto Terminado</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Presentación</th>
                  <th className="p-3.5">Costo Producción Real</th>
                  <th className="p-3.5">Precio de Venta</th>
                  <th className="p-3.5">Ganancia por Bolsa</th>
                  <th className="p-3.5">Margen de Utilidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {finishedProducts.map(fp => {
                  const profitPerUnit = fp.salePrice - fp.currentUnitCost;
                  const marginPercent = fp.salePrice > 0 ? (profitPerUnit / fp.salePrice) * 100 : 0;
                  return (
                    <tr key={fp.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-800">{fp.name}</td>
                      <td className="p-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {fp.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{fp.packageSizeGrams}g</td>
                      <td className="p-3.5 font-semibold text-slate-800">${fp.currentUnitCost.toLocaleString('es-CO')}</td>
                      <td className="p-3.5 font-bold text-emerald-700">${fp.salePrice.toLocaleString('es-CO')}</td>
                      <td className="p-3.5 font-bold text-slate-900">${profitPerUnit.toLocaleString('es-CO')}</td>
                      <td className="p-3.5">
                        <span className="bg-amber-100 text-[#EF8828] font-extrabold px-2.5 py-1 rounded-full text-xs">
                          {marginPercent.toFixed(1)}% Margen
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Nuevo Costo Fijo */}
      {isFixedCostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsFixedCostModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-slate-800 mb-4">Registrar Costo Fijo Mensual</h3>

            <form onSubmit={handleFixedCostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Concepto *</label>
                <input
                  type="text"
                  placeholder="Ej: Servicio de Gas Cocina o Publicidad IG"
                  value={costConcept}
                  onChange={e => setCostConcept(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                <select
                  value={costCategory}
                  onChange={e => setCostCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                >
                  <option value="Arriendo">Arriendo Local / Taller</option>
                  <option value="Servicios">Servicios Públicos (Luz/Agua/Gas)</option>
                  <option value="Salarios">Salarios / Nómina Operativa</option>
                  <option value="Publicidad">Publicidad & Marketing</option>
                  <option value="Transporte">Transporte / Envíos Fijos</option>
                  <option value="Otro">Otro Gastos Fijos</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monto Mensual ($ COP) *</label>
                <input
                  type="number"
                  min="1"
                  value={costAmount}
                  onChange={e => setCostAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFixedCostModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#344E5C] text-white rounded-xl shadow-md cursor-pointer"
                >
                  Guardar Costo Fijo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
