import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  Percent, 
  Flame, 
  Package, 
  ShieldCheck 
} from 'lucide-react';

interface FixedCostItem {
  id: string;
  concept: string;
  category: 'Servicios' | 'Arriendo' | 'Empaques' | 'Mantenimiento' | 'Otros';
  monthlyAmount: number;
}

interface ProductProfitability {
  id: string;
  name: string;
  category: 'Galletas' | 'Res' | 'Pollo' | 'Cerdo';
  presentation: string;
  salePrice: number;
  rawMaterialCost: number;
  packagingCost: number;
  fixedCostProrated: number;
  salesVolumeMonth: number;
}

export const FinancesView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('Octubre 2024');

  // Costos fijos del taller (Normandía, Bogotá)
  const [fixedCosts, setFixedCosts] = useState<FixedCostItem[]>([
    { id: '1', concept: 'Energía / Electricidad Deshidratadores & Hornos', category: 'Servicios', monthlyAmount: 380000 },
    { id: '2', concept: 'Gas Natural Cocción & Secado', category: 'Servicios', monthlyAmount: 140000 },
    { id: '3', concept: 'Arriendo proporcional Taller Normandía', category: 'Arriendo', monthlyAmount: 850000 },
    { id: '4', concept: 'Bolsas Doypack, Vinilos & Rótulos ICA', category: 'Empaques', monthlyAmount: 260000 },
    { id: '5', concept: 'Plan Conectividad & Almacenamiento Cloud', category: 'Servicios', monthlyAmount: 95000 },
    { id: '6', concept: 'Mantenimiento preventivo de rebanadoras & deshidratador', category: 'Mantenimiento', monthlyAmount: 120000 },
  ]);

  // Rentabilidad unitaria por producto
  const [products] = useState<ProductProfitability[]>([
    {
      id: 'res-250',
      name: 'Deshidratados Res Premium',
      category: 'Res',
      presentation: '250 g',
      salePrice: 28000,
      rawMaterialCost: 11400,
      packagingCost: 1200,
      fixedCostProrated: 2100,
      salesVolumeMonth: 85
    },
    {
      id: 'pollo-250',
      name: 'Deshidratados Pollo Magro',
      category: 'Pollo',
      presentation: '250 g',
      salePrice: 24000,
      rawMaterialCost: 8900,
      packagingCost: 1200,
      fixedCostProrated: 2100,
      salesVolumeMonth: 110
    },
    {
      id: 'cerdo-250',
      name: 'Deshidratados Cerdo Gourmet',
      category: 'Cerdo',
      presentation: '250 g',
      salePrice: 26000,
      rawMaterialCost: 9800,
      packagingCost: 1200,
      fixedCostProrated: 2100,
      salesVolumeMonth: 65
    },
    {
      id: 'galletas-250',
      name: 'Galletas Artesanales Orgánicas',
      category: 'Galletas',
      presentation: '250 g',
      salePrice: 18000,
      rawMaterialCost: 4500,
      packagingCost: 1100,
      fixedCostProrated: 1800,
      salesVolumeMonth: 140
    }
  ]);

  // Modal para agregar costo fijo
  const [showAddCostModal, setShowAddCostModal] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  const [newCategory, setNewCategory] = useState<FixedCostItem['category']>('Servicios');
  const [newAmount, setNewAmount] = useState('');

  // Cálculos consolidados de Finanzas
  const totalFixedCosts = fixedCosts.reduce((acc, curr) => acc + curr.monthlyAmount, 0);

  const totalGrossRevenue = products.reduce((acc, p) => acc + (p.salePrice * p.salesVolumeMonth), 0);
  const totalDirectCosts = products.reduce((acc, p) => acc + ((p.rawMaterialCost + p.packagingCost) * p.salesVolumeMonth), 0);
  const grossProfit = totalGrossRevenue - totalDirectCosts;
  const grossMarginPercentage = totalGrossRevenue > 0 ? ((grossProfit / totalGrossRevenue) * 100).toFixed(1) : '0';

  const netOperatingProfit = grossProfit - totalFixedCosts;
  const netMarginPercentage = totalGrossRevenue > 0 ? ((netOperatingProfit / totalGrossRevenue) * 100).toFixed(1) : '0';

  // Punto de equilibrio aproximado en unidades
  const averageSalePrice = products.length > 0 
    ? products.reduce((acc, p) => acc + p.salePrice, 0) / products.length 
    : 1;
  const averageDirectCost = products.length > 0 
    ? products.reduce((acc, p) => acc + (p.rawMaterialCost + p.packagingCost), 0) / products.length 
    : 1;
  const averageContributionMargin = averageSalePrice - averageDirectCost;
  const breakEvenUnits = averageContributionMargin > 0 ? Math.ceil(totalFixedCosts / averageContributionMargin) : 0;
  const totalUnitsSold = products.reduce((acc, p) => acc + p.salesVolumeMonth, 0);

  const handleAddCost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConcept.trim() || !newAmount) return;
    const item: FixedCostItem = {
      id: Date.now().toString(),
      concept: newConcept.trim(),
      category: newCategory,
      monthlyAmount: parseFloat(newAmount) || 0
    };
    setFixedCosts([...fixedCosts, item]);
    setNewConcept('');
    setNewAmount('');
    setShowAddCostModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Encabezado Principal */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#f8b46b]" /> Estado de Resultados P&L
            </span>
            <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Rentabilidad Taller Normandía
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#334c5c]">
            Finanzas, Costos Fijos & Rentabilidad Neta
          </h2>
          <p className="text-xs text-gray-500">
            Seguimiento de ingresos reales, prorrateo de mermas e insumos, y punto de equilibrio operativo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#fbf9f6] border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-[#334c5c]">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-black focus:outline-none cursor-pointer"
            >
              <option value="Octubre 2024">Octubre 2024</option>
              <option value="Septiembre 2024">Septiembre 2024</option>
              <option value="Agosto 2024">Agosto 2024</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4" /> Exportar Reporte
          </button>
        </div>
      </div>

      {/* 4 KPIs Clave de Finanzas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ingresos Brutos */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block">
              Ventas Totales
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-[#334c5c]">
              ${totalGrossRevenue.toLocaleString('es-CO')}
            </span>
            <span className="text-[11px] text-green-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs mes anterior
            </span>
          </div>
        </div>

        {/* Margen Bruto */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block">
              Margen Bruto
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-[#334c5c]">
              {grossMarginPercentage}%
            </span>
            <span className="text-[11px] text-gray-500 font-bold block mt-1">
              Ganancia bruta: ${grossProfit.toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        {/* Costos Fijos Totales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block">
              Costos Fijos Taller
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-[#334c5c]">
              ${totalFixedCosts.toLocaleString('es-CO')}
            </span>
            <span className="text-[11px] text-gray-500 font-bold block mt-1">
              Servicios, arriendo y empaques
            </span>
          </div>
        </div>

        {/* Utilidad Operativa Neta */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#334c5c] shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-black uppercase text-[#334c5c] tracking-wider block">
              Utilidad Neta Taller
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#334c5c] text-[#f8b46b] flex items-center justify-center font-black text-xs">
              P&L
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-2xl font-black ${netOperatingProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              ${netOperatingProfit.toLocaleString('es-CO')}
            </span>
            <span className="text-[11px] font-extrabold text-[#334c5c] block mt-1">
              Margen neto operativo: {netMarginPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Punto de Equilibrio & Estado de Salud Financiera */}
      <div className="bg-[#334c5c] text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#f8b46b]" />
            <h3 className="text-lg font-black text-[#f8b46b]">
              Punto de Equilibrio Alcanzado & Superado
            </h3>
          </div>
          <p className="text-xs text-white/80 max-w-xl">
            Para cubrir el 100% de los costos fijos (${totalFixedCosts.toLocaleString('es-CO')}), el taller necesita despachar <strong>{breakEvenUnits} bolsas</strong> al mes. Actualmente has vendido <strong>{totalUnitsSold} bolsas</strong> ({totalUnitsSold - breakEvenUnits} bolsas en zona de ganancia neta directa).
          </p>
        </div>

        <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 text-center min-w-[200px]">
          <span className="text-[10px] uppercase font-black text-[#f8b46b] tracking-wider block">
            Margen de Seguridad
          </span>
          <span className="text-3xl font-black text-white">
            +{Math.max(0, Math.round(((totalUnitsSold - breakEvenUnits) / breakEvenUnits) * 100))}%
          </span>
          <span className="text-[10px] text-white/70 block mt-0.5">
            Sobre el umbral mínimo
          </span>
        </div>
      </div>

      {/* Grid: Desglose de Rentabilidad por Producto & Tabla de Costos Fijos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tabla Izquierda: Rentabilidad por Producto (7 columnas) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-sm font-black text-[#334c5c] uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-[#f8b46b]" /> Rentabilidad Unitaria por Receta
              </h3>
              <p className="text-[11px] text-gray-500">
                Margen neto estimado deduciendo insumo, bolsa y costo fijo por unidad.
              </p>
            </div>
            <span className="text-xs font-bold text-gray-400">{products.length} productos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase font-black text-gray-400">
                  <th className="pb-2">Producto</th>
                  <th className="pb-2 text-right">PVP</th>
                  <th className="pb-2 text-right">Costo Insumo</th>
                  <th className="pb-2 text-right">Costo Fijo</th>
                  <th className="pb-2 text-right">Utilidad Unit.</th>
                  <th className="pb-2 text-right">Margen %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {products.map((p) => {
                  const unitTotalCost = p.rawMaterialCost + p.packagingCost + p.fixedCostProrated;
                  const unitProfit = p.salePrice - unitTotalCost;
                  const marginPct = ((unitProfit / p.salePrice) * 100).toFixed(0);

                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="py-3">
                        <div className="font-black text-[#334c5c]">{p.name}</div>
                        <div className="text-[10px] text-gray-400">{p.presentation} • {p.salesVolumeMonth} uds vendidas</div>
                      </td>
                      <td className="py-3 text-right font-black text-[#334c5c]">
                        ${p.salePrice.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 text-right text-gray-600">
                        ${(p.rawMaterialCost + p.packagingCost).toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 text-right text-gray-500">
                        ${p.fixedCostProrated.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 text-right font-black text-green-700">
                        +${unitProfit.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-black px-2 py-0.5 rounded-full text-[10px] bg-green-50 text-green-700 border border-green-200">
                          {marginPct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla Derecha: Costos Fijos Mensuales del Taller (5 columnas) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-sm font-black text-[#334c5c] uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" /> Costos Fijos Operativos
              </h3>
              <p className="text-[11px] text-gray-500">
                Prorrateados en cada bolsa de producción.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCostModal(true)}
              className="text-[11px] font-black text-[#334c5c] hover:text-[#f8b46b] flex items-center gap-1 bg-[#fbf9f6] border border-gray-200 px-2.5 py-1.5 rounded-xl cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Agregar
            </button>
          </div>

          <div className="space-y-2.5">
            {fixedCosts.map((cost) => (
              <div 
                key={cost.id} 
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#fbf9f6] border border-gray-100 hover:border-gray-200 transition text-xs"
              >
                <div>
                  <span className="font-bold text-[#334c5c] block">{cost.concept}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-black">{cost.category}</span>
                </div>
                <span className="font-mono font-black text-[#334c5c]">
                  ${cost.monthlyAmount.toLocaleString('es-CO')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
            <span className="font-black text-gray-600 uppercase">Total Costos Fijos Mes:</span>
            <span className="text-sm font-black text-[#334c5c]">
              ${totalFixedCosts.toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      </div>

      {/* Modal para Agregar Costo Fijo */}
      {showAddCostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-gray-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-black text-base text-[#334c5c]">
                Registrar Nuevo Costo Fijo
              </h4>
              <button 
                type="button" 
                onClick={() => setShowAddCostModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xs"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleAddCost} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Concepto o Detalle</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Internet taller, empaques adicionales..."
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as FixedCostItem['category'])}
                    className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Servicios">Servicios</option>
                    <option value="Arriendo">Arriendo</option>
                    <option value="Empaques">Empaques</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Monto Mensual ($ COP)</label>
                  <input
                    type="number"
                    required
                    placeholder="Ej: 150000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddCostModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 font-bold hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#334c5c] text-[#f8b46b] font-black hover:bg-[#273a46] shadow-sm"
                >
                  Guardar Costo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancesView;