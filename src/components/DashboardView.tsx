import React from 'react';
import { 
  Sale, 
  RawMaterial, 
  FinishedProduct, 
  Client, 
  ProductionBatch, 
  PurchaseRecord 
} from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  Cake, 
  ChefHat, 
  ShoppingBag, 
  Truck, 
  ArrowUpRight, 
  PieChart, 
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface DashboardViewProps {
  sales: Sale[];
  rawMaterials: RawMaterial[];
  finishedProducts: FinishedProduct[];
  clients: Client[];
  productionBatches: ProductionBatch[];
  purchases: PurchaseRecord[];
  onNavigateTab: (tab: string) => void;
  onOpenNewSale: () => void;
  onOpenNewBatch: () => void;
  onOpenNewPurchase: () => void;
  onSelectPetForBirthdayGreeting?: (client: Client, petName: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sales,
  rawMaterials,
  finishedProducts,
  clients,
  productionBatches,
  purchases,
  onNavigateTab,
  onOpenNewSale,
  onOpenNewBatch,
  onOpenNewPurchase,
  onSelectPetForBirthdayGreeting
}) => {
  // Calculations
  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalSalesCOGS = sales.reduce((acc, s) => {
    const saleCost = s.items.reduce((itemAcc, item) => itemAcc + (item.unitCost * item.quantity), 0);
    return acc + saleCost;
  }, 0);
  const totalGrossProfit = totalSalesRevenue - totalSalesCOGS;
  const grossMarginPercentage = totalSalesRevenue > 0 ? (totalGrossProfit / totalSalesRevenue) * 100 : 0;

  // Inventory Valuations
  const rawMaterialValuationNet = rawMaterials.reduce((acc, rm) => acc + (rm.stockNetUsable * rm.weightedAvgNetCostPerUnit), 0);
  const finishedGoodsValuation = finishedProducts.reduce((acc, fp) => acc + (fp.stockUnits * fp.currentUnitCost), 0);

  // Alerts
  const lowStockMaterials = rawMaterials.filter(rm => rm.stockNetUsable <= rm.minStockThreshold);

  // Upcoming Pet Birthdays in current & next month (August/September)
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-indexed

  const petsWithBirthdays = clients.flatMap(client => 
    client.pets.map(pet => {
      const birthDate = new Date(pet.birthday);
      const petMonth = birthDate.getMonth() + 1;
      const isThisMonth = petMonth === currentMonth;
      return {
        client,
        pet,
        isThisMonth
      };
    })
  ).filter(item => item.isThisMonth || item.pet.birthday.includes('-08-') || item.pet.birthday.includes('-09-'));

  const pendingDeliveries = sales.filter(s => s.status === 'Pendiente' || s.status === 'En Preparación' || s.status === 'Listo');

  return (
    <div className="space-y-6 pb-12">
      {/* Banner Welcome & Brand Intro */}
      <div className="bg-[#2D463E] rounded-xl p-6 text-white shadow-sm border border-[#E0D7C6] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#D4A373] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Cachorro Feliz Dashboard Central</span>
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-white">
              Control de Producción & Margen con Mermas
            </h2>
            <p className="text-emerald-100/80 text-sm max-w-2xl mt-1">
              Monitoreo en tiempo real del costo promedio neto por gramo, mermas de alistamiento y cocción, ventas y cumpleaños de tus clientes peludos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewSale}
              className="bg-[#D4A373] hover:bg-[#c29263] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Registrar Venta</span>
            </button>
            <button
              onClick={onOpenNewBatch}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-white/20 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <ChefHat className="w-4 h-4 text-[#D4A373]" />
              <span>Cocinar Lote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Revenue */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E0D7C6] hover:border-[#D4A373] transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ventas Totales</span>
            <div className="p-2 bg-[#F9F7F4] text-[#2D463E] rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#2D463E]">
            ${totalSalesRevenue.toLocaleString('es-CO')} COP
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-emerald-700 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {sales.length} pedidos
            </span>
            <span className="text-slate-400">Bruto</span>
          </div>
        </div>

        {/* Gross Profit & Margin */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E0D7C6] hover:border-[#D4A373] transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Utilidad Bruta</span>
            <div className="p-2 bg-[#F9F7F4] text-[#D4A373] rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#2D463E]">
            ${totalGrossProfit.toLocaleString('es-CO')} COP
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-[#D4A373] font-bold">
              {grossMarginPercentage.toFixed(1)}% Margen Bruto
            </span>
            <span className="text-slate-400">Post-mermas</span>
          </div>
        </div>

        {/* Inventory Value Raw + Finished */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E0D7C6] hover:border-[#D4A373] transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Valor Inventario</span>
            <div className="p-2 bg-[#F9F7F4] text-[#2D463E] rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#2D463E]">
            ${(rawMaterialValuationNet + finishedGoodsValuation).toLocaleString('es-CO')} COP
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-slate-600 font-medium">
              MP: ${(rawMaterialValuationNet/1000).toFixed(0)}k | PT: ${(finishedGoodsValuation/1000).toFixed(0)}k
            </span>
            <span className="text-slate-400">Costo Neto</span>
          </div>
        </div>

        {/* Pending Shipments */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E0D7C6] hover:border-[#D4A373] transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Envíos Pendientes</span>
            <div className="p-2 bg-[#F9F7F4] text-[#D4A373] rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#2D463E]">
            {pendingDeliveries.length} pedidos
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <button 
              onClick={() => onNavigateTab('sales')}
              className="text-[#2D463E] font-semibold hover:underline flex items-center"
            >
              Ver despachos →
            </button>
            <span className="text-slate-400">Por entregar</span>
          </div>
        </div>
      </div>

      {/* Special Operational Alerts & Pet Birthday Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pet Birthdays Widget */}
        <div className="bg-white rounded-xl p-5 border border-[#E0D7C6] shadow-sm relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#F9F7F4] text-[#D4A373] rounded-lg">
                <Cake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2D463E] font-display">
                  Próximos Cumpleaños de Mascotas
                </h3>
                <p className="text-xs text-slate-600">
                  ¡Fideliza tus clientes enviando saludos y regalos de cumpleaños!
                </p>
              </div>
            </div>
            <span className="bg-[#D4A373] text-white text-xs px-2.5 py-1 rounded-full font-bold">
              {petsWithBirthdays.length} Activos
            </span>
          </div>

          {petsWithBirthdays.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">No hay cumpleaños registrados en las próximas semanas.</p>
          ) : (
            <div className="space-y-2.5">
              {petsWithBirthdays.map(({ client, pet }) => (
                <div 
                  key={pet.id} 
                  className="bg-[#F9F7F4] p-3.5 rounded-lg border border-[#E0D7C6]/60 flex items-center justify-between hover:border-[#D4A373] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E0D7C6] flex items-center justify-center font-bold text-[#D4A373] text-sm">
                      🐶
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{pet.name}</span>
                        <span className="text-xs text-slate-500">({pet.breed || pet.type})</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Dueño: <span className="font-medium text-slate-700">{client.name}</span> ({client.phone})
                      </p>
                      <p className="text-[11px] text-[#D4A373] font-medium">
                        🎂 Cumple: {pet.birthday}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectPetForBirthdayGreeting) {
                        onSelectPetForBirthdayGreeting(client, pet.name);
                      } else {
                        onNavigateTab('clients');
                      }
                    }}
                    className="bg-[#2D463E] hover:bg-[#233831] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>Saludar WhatsApp</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Raw Material Alerts */}
        <div className="bg-white rounded-xl p-5 border border-[#E0D7C6] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2D463E] font-display">
                  Alertas de Stock de Materia Prima
                </h3>
                <p className="text-xs text-slate-500">
                  Insumos bajo el nivel de reabastecimiento crítico
                </p>
              </div>
            </div>
            <button
              onClick={onOpenNewPurchase}
              className="text-xs text-[#2D463E] font-semibold hover:underline"
            >
              + Comprar insumos
            </button>
          </div>

          {lowStockMaterials.length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>¡Excelente! Todos los insumos de materia prima están por encima del umbral mínimo.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockMaterials.map(rm => (
                <div key={rm.id} className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{rm.name}</div>
                      <div className="text-xs text-amber-800">
                        Disponible Neto: <span className="font-bold">{rm.stockNetUsable.toLocaleString()} {rm.unit}</span> (Mín: {rm.minStockThreshold} {rm.unit})
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onOpenNewPurchase}
                    className="bg-[#D4A373] hover:bg-[#c29263] text-white text-xs px-2.5 py-1 rounded font-semibold cursor-pointer"
                  >
                    Reabastecer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity & Products Inventory Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Finished Products Stock Summary */}
        <div className="bg-white rounded-xl p-5 border border-[#E0D7C6] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2D463E] font-display flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-[#D4A373]" />
              <span>Stock Producto Terminado</span>
            </h3>
            <button 
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-[#2D463E] font-semibold hover:underline"
            >
              Ver todo
            </button>
          </div>

          <div className="divide-y divide-[#E0D7C6]/40">
            {finishedProducts.map(fp => (
              <div key={fp.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">{fp.name}</div>
                  <div className="text-[11px] text-slate-500">
                    Costo unit: ${fp.currentUnitCost.toLocaleString()} | Venta: ${fp.salePrice.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    fp.stockUnits > 10 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : fp.stockUnits > 0 
                      ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {fp.stockUnits} unid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales Table */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-[#E0D7C6] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2D463E] font-display flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4A373]" />
              <span>Últimas Ventas Registradas</span>
            </h3>
            <button 
              onClick={() => onNavigateTab('sales')}
              className="text-xs text-[#2D463E] font-semibold hover:underline"
            >
              Gestionar ventas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9F7F4] text-[#2D463E] uppercase font-semibold border-b border-[#E0D7C6]">
                <tr>
                  <th className="p-2.5">N° Pedido</th>
                  <th className="p-2.5">Cliente & Mascota</th>
                  <th className="p-2.5">Items</th>
                  <th className="p-2.5">Total</th>
                  <th className="p-2.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0D7C6]/30 text-slate-700">
                {sales.slice(0, 5).map(s => (
                  <tr key={s.id} className="hover:bg-[#F9F7F4]/60">
                    <td className="p-2.5 font-bold text-[#2D463E]">{s.saleNumber}</td>
                    <td className="p-2.5">
                      <div className="font-semibold text-slate-800">{s.clientName}</div>
                      {s.petName && <div className="text-[11px] text-[#D4A373] font-medium">🐾 {s.petName}</div>}
                    </td>
                    <td className="p-2.5 text-slate-600">
                      {s.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                    </td>
                    <td className="p-2.5 font-bold text-slate-900">
                      ${s.total.toLocaleString('es-CO')}
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'Entregado' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        s.status === 'Enviado' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                        s.status === 'En Preparación' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
