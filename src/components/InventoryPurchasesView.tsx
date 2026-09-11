import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  Search, 
  Plus, 
  Phone, 
  MessageCircle, 
  Globe, 
  Store, 
  DollarSign, 
  TrendingDown, 
  ExternalLink,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';

export interface Supplier {
  id: string;
  name: string;
  category: 'Carnes & Vísceras' | 'Cereales & Harinas' | 'Empaques & Rótulos' | 'Supermercado General';
  contactType: 'whatsapp' | 'web' | 'phone' | 'store';
  phone?: string;
  websiteUrl?: string;
  storeAddress?: string;
  contactPerson: string;
  paymentMethod: string;
  leadTimeDays: number;
  notes: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  category: 'Proteínas' | 'Harinas & Vegetales' | 'Empaques' | 'Otros';
  currentStock: number; // en kg o unidades
  minStock: number;     // alarma si baja de aquí
  unit: 'kg' | 'und' | 'g';
  costPerUnitCOP: number;
  supplierId: string;
  supplierName: string;
  lastRestockDate: string;
}

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Frigorífico & Cárnicos del Norte',
    category: 'Carnes & Vísceras',
    contactType: 'whatsapp',
    phone: '+57 311 890 1234',
    contactPerson: 'Don Hernán (Asesor Mayorista)',
    paymentMethod: 'Transferencia Bancolombia / Contraentrega',
    leadTimeDays: 1,
    notes: 'Hígado de res y recortes de pulpa magra frescos. Despacha los martes y viernes al taller.'
  },
  {
    id: 'sup-2',
    name: 'Avícola Santa Mónica',
    category: 'Carnes & Vísceras',
    contactType: 'phone',
    phone: '+57 315 443 8920',
    contactPerson: 'Gladys Morales',
    paymentMethod: 'Daviplata o Efectivo',
    leadTimeDays: 1,
    notes: 'Pechugas y corazones de pollo limpios sin piel. Llamar antes de las 9:00 AM para entrega el mismo día.'
  },
  {
    id: 'sup-3',
    name: 'Molinos & Granos El Dorado',
    category: 'Cereales & Harinas',
    contactType: 'web',
    websiteUrl: 'https://www.distribuidoragranosbogota.com',
    contactPerson: 'Portal de Clientes B2B',
    paymentMethod: 'PSE / Tarjeta Débito',
    leadTimeDays: 2,
    notes: 'Bultos de 25kg de avena hojuela y harina de linaza 100% natural sin aditivos.'
  },
  {
    id: 'sup-4',
    name: 'Empaques Ecológicos & Bolsas Kraft Bogotá',
    category: 'Empaques & Rótulos',
    contactType: 'whatsapp',
    phone: '+57 320 655 4321',
    contactPerson: 'Camilo Rueda',
    paymentMethod: 'Nequi / Transferencia',
    leadTimeDays: 3,
    notes: 'Bolsas pouch herméticas kraft con ventana y cierre zipper (100g, 250g, 500g).'
  },
  {
    id: 'sup-5',
    name: 'Makro Supermayorista (Av. Boyacá)',
    category: 'Supermercado General',
    contactType: 'store',
    storeAddress: 'Av. Boyacá # 55-20 (Cerca de Normandía)',
    contactPerson: 'Compras directas de contado',
    paymentMethod: 'Tarjeta / Efectivo en caja',
    leadTimeDays: 0,
    notes: 'Para compras imprevistas: zanahorias frescas, aceite de coco virgen, romero fresco y huevos criollos.'
  }
];

const INITIAL_MATERIALS: RawMaterial[] = [
  {
    id: 'mat-1',
    name: 'Hígado de Res Magro Fresco',
    category: 'Proteínas',
    currentStock: 4.5,
    minStock: 12.0, // Alerta Crítica 🔴
    unit: 'kg',
    costPerUnitCOP: 14500,
    supplierId: 'sup-1',
    supplierName: 'Frigorífico & Cárnicos del Norte',
    lastRestockDate: '2024-10-18'
  },
  {
    id: 'mat-2',
    name: 'Pechuga de Pollo Fresca sin Piel',
    category: 'Proteínas',
    currentStock: 8.0,
    minStock: 15.0, // Alerta Crítica 🔴
    unit: 'kg',
    costPerUnitCOP: 18200,
    supplierId: 'sup-2',
    supplierName: 'Avícola Santa Mónica',
    lastRestockDate: '2024-10-21'
  },
  {
    id: 'mat-3',
    name: 'Carne de Res Pulpa Limpia (Deshidratados)',
    category: 'Proteínas',
    currentStock: 16.0,
    minStock: 10.0, // Óptimo 🟢
    unit: 'kg',
    costPerUnitCOP: 26000,
    supplierId: 'sup-1',
    supplierName: 'Frigorífico & Cárnicos del Norte',
    lastRestockDate: '2024-10-23'
  },
  {
    id: 'mat-4',
    name: 'Avena en Hojuelas Integral',
    category: 'Harinas & Vegetales',
    currentStock: 18.5,
    minStock: 15.0, // Advertencia 🟡
    unit: 'kg',
    costPerUnitCOP: 6800,
    supplierId: 'sup-3',
    supplierName: 'Molinos & Granos El Dorado',
    lastRestockDate: '2024-10-15'
  },
  {
    id: 'mat-5',
    name: 'Bolsas Kraft con Ventana 100g',
    category: 'Empaques',
    currentStock: 85,
    minStock: 150, // Alerta Crítica 🔴
    unit: 'und',
    costPerUnitCOP: 520,
    supplierId: 'sup-4',
    supplierName: 'Empaques Ecológicos & Bolsas Kraft Bogotá',
    lastRestockDate: '2024-10-10'
  },
  {
    id: 'mat-6',
    name: 'Zanahoria & Romero Fresco',
    category: 'Harinas & Vegetales',
    currentStock: 5.0,
    minStock: 3.0, // Óptimo 🟢
    unit: 'kg',
    costPerUnitCOP: 3800,
    supplierId: 'sup-5',
    supplierName: 'Makro Supermayorista (Av. Boyacá)',
    lastRestockDate: '2024-10-22'
  }
];

export const InventoryPurchasesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'suppliers'>('inventory');
  const [materials, setMaterials] = useState<RawMaterial[]>(INITIAL_MATERIALS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modales
  const [showNewMaterialModal, setShowNewMaterialModal] = useState(false);
  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);

  // Insumos críticos (por debajo del stock mínimo)
  const lowStockMaterials = materials.filter(m => m.currentStock < m.minStock);

  // Valor total del inventario actual
  const totalInventoryValueCOP = materials.reduce((acc, m) => acc + (m.currentStock * m.costPerUnitCOP), 0);

  // Contactar Proveedor
  const handleContactSupplier = (supplier: Supplier, materialName?: string) => {
    if (supplier.contactType === 'whatsapp' && supplier.phone) {
      const cleanPhone = supplier.phone.replace(/\D/g, '');
      const text = materialName 
        ? `¡Hola ${supplier.contactPerson}! Te saluda el Chef Javier de Cachorro Feliz (Normandía).\nQuisiera consultar precio y disponibilidad para pedir reposición urgente de: ${materialName}.\n¿Para cuándo tendrías despacho?`
        : `¡Hola ${supplier.contactPerson}! Te saluda el Chef Javier de Cachorro Feliz. Quisiera hacer una cotización de insumos para el taller.`;
      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (supplier.contactType === 'web' && supplier.websiteUrl) {
      window.open(supplier.websiteUrl, '_blank');
    } else if (supplier.contactType === 'phone' && supplier.phone) {
      window.location.href = `tel:${supplier.phone}`;
    } else if (supplier.contactType === 'store' && supplier.storeAddress) {
      const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(supplier.name + ' ' + supplier.storeAddress)}`;
      window.open(gmapsUrl, '_blank');
    }
  };

  // Filtrado de Inventario
  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrado de Proveedores
  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Encabezado Principal */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Package className="w-3.5 h-3.5" /> Materias Primas & Proveedores
          </span>
          <h2 className="text-2xl font-black text-[#334c5c]">
            Inventario de Insumos & Abastecimiento
          </h2>
          <p className="text-xs text-gray-500">
            Control de stocks críticos con alarmas automáticas y contacto directo multicanal (WhatsApp, Web, Teléfono, Tienda).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-sm ${
              activeTab === 'inventory' 
                ? 'bg-[#334c5c] text-[#f8b46b] border border-[#f8b46b]' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📦 Materias Primas ({materials.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('suppliers')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-sm ${
              activeTab === 'suppliers' 
                ? 'bg-[#334c5c] text-[#f8b46b] border border-[#f8b46b]' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🚚 Directorio Proveedores ({suppliers.length})
          </button>
        </div>
      </div>

      {/* Alerta de Insumos Críticos */}
      {lowStockMaterials.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 animate-bounce" />
              <h3 className="text-sm font-black">
                ¡Alerta de Stock Crítico! ({lowStockMaterials.length} insumos próximos a agotarse)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-red-700 uppercase bg-red-100 px-2.5 py-0.5 rounded-full">
              Reponer urgente para no detener hornos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {lowStockMaterials.map((mat) => {
              const sup = suppliers.find(s => s.id === mat.supplierId);
              return (
                <div key={mat.id} className="bg-white p-3.5 rounded-xl border border-red-200 shadow-xs flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-black text-xs text-[#334c5c]">{mat.name}</span>
                      <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        Quedan {mat.currentStock} {mat.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Mínimo requerido: <strong>{mat.minStock} {mat.unit}</strong>
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Proveedor: {mat.supplierName}
                    </p>
                  </div>

                  {sup && (
                    <button
                      type="button"
                      onClick={() => handleContactSupplier(sup, mat.name)}
                      className="w-full text-center text-[11px] font-bold bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] py-1.5 rounded-lg transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      {sup.contactType === 'whatsapp' && <MessageCircle className="w-3 h-3 text-[#25d366]" />}
                      {sup.contactType === 'web' && <Globe className="w-3 h-3 text-blue-400" />}
                      {sup.contactType === 'phone' && <Phone className="w-3 h-3 text-amber-400" />}
                      {sup.contactType === 'store' && <Store className="w-3 h-3 text-purple-400" />}
                      Pedir a {sup.name.split(' ')[0]}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Métricas Resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <span className="text-[10px] font-bold uppercase text-gray-400 block">Valor Inventario Insumos</span>
          <span className="text-2xl font-black text-green-700">${totalInventoryValueCOP.toLocaleString('es-CO')}</span>
          <span className="text-[11px] text-gray-500 block mt-0.5">Capital en bodega / taller</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <span className="text-[10px] font-bold uppercase text-gray-400 block">Insumos en Alarma</span>
          <span className={`text-2xl font-black ${lowStockMaterials.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {lowStockMaterials.length} críticos
          </span>
          <span className="text-[11px] text-gray-500 block mt-0.5">Por debajo de stock de seguridad</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <span className="text-[10px] font-bold uppercase text-gray-400 block">Proveedores Activos</span>
          <span className="text-2xl font-black text-[#334c5c]">{suppliers.length} registrados</span>
          <span className="text-[11px] text-gray-500 block mt-0.5">Bogotá & Mayoristas</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <span className="text-[10px] font-bold uppercase text-gray-400 block">Canales de Pedido</span>
          <div className="flex gap-2 mt-1.5 text-xs text-gray-600 font-bold">
            <span title="WhatsApp" className="flex items-center gap-0.5"><MessageCircle className="w-3.5 h-3.5 text-[#25d366]" /> 2</span>
            <span title="Página Web" className="flex items-center gap-0.5"><Globe className="w-3.5 h-3.5 text-blue-500" /> 1</span>
            <span title="Teléfono" className="flex items-center gap-0.5"><Phone className="w-3.5 h-3.5 text-amber-500" /> 1</span>
            <span title="Presencial" className="flex items-center gap-0.5"><Store className="w-3.5 h-3.5 text-purple-500" /> 1</span>
          </div>
          <span className="text-[10px] text-gray-400 block mt-1">Multi-modalidad flexible</span>
        </div>
      </div>

      {/* PESTAÑA 1: INVENTARIO DE MATERIAS PRIMAS */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar materia prima, categoría o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#334c5c] focus:outline-none bg-white shadow-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => alert('Para registrar una nueva materia prima, agrégala con su proveedor y stock mínimo')}
              className="flex items-center gap-1.5 bg-[#f8b46b] hover:bg-[#e29d53] text-[#334c5c] text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> + Nueva Materia Prima
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fbf9f6] text-gray-600 font-bold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Materia Prima / Insumo</th>
                    <th className="py-3 px-3">Categoría</th>
                    <th className="py-3 px-3 text-center">Stock Actual</th>
                    <th className="py-3 px-3 text-center">Mínimo</th>
                    <th className="py-3 px-3 text-right">Costo Unitario</th>
                    <th className="py-3 px-4">Proveedor Habitual</th>
                    <th className="py-3 px-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMaterials.map((mat) => {
                    const isLow = mat.currentStock < mat.minStock;
                    const isNear = mat.currentStock >= mat.minStock && mat.currentStock <= mat.minStock * 1.25;
                    const sup = suppliers.find(s => s.id === mat.supplierId);

                    return (
                      <tr key={mat.id} className={`hover:bg-gray-50/80 transition ${isLow ? 'bg-red-50/40' : ''}`}>
                        <td className="py-3 px-4">
                          <div className="font-black text-[#334c5c]">{mat.name}</div>
                          <span className="text-[10px] text-gray-400">Última reposición: {mat.lastRestockDate}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            {mat.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block font-black px-2 py-1 rounded-lg text-xs ${
                            isLow 
                              ? 'bg-red-100 text-red-800' 
                              : isNear 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {mat.currentStock} {mat.unit}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-gray-500 font-bold">
                          {mat.minStock} {mat.unit}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-gray-800">
                          ${mat.costPerUnitCOP.toLocaleString('es-CO')} / {mat.unit}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#334c5c] flex items-center gap-1.5">
                            {sup?.contactType === 'whatsapp' && <span title="Vía WhatsApp" className="text-[#25d366] text-xs">💬</span>}
                            {sup?.contactType === 'web' && <span title="Página Web" className="text-blue-500 text-xs">🌐</span>}
                            {sup?.contactType === 'phone' && <span title="Llamada" className="text-amber-500 text-xs">📞</span>}
                            {sup?.contactType === 'store' && <span title="Tienda física" className="text-purple-500 text-xs">🏬</span>}
                            {mat.supplierName}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {sup && (
                            <button
                              type="button"
                              onClick={() => handleContactSupplier(sup, mat.name)}
                              className="text-[11px] font-bold bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] px-3 py-1.5 rounded-lg shadow-xs transition"
                            >
                              Reponer
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: DIRECTORIO MULTICANAL DE PROVEEDORES */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, categoría o nota de entrega..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#334c5c] focus:outline-none bg-white shadow-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => alert('Puedes sumar distribuidores con su canal de pedido preferido')}
              className="flex items-center gap-1.5 bg-[#f8b46b] hover:bg-[#e29d53] text-[#334c5c] text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> + Nuevo Proveedor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-[#334c5c] transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-[#334c5c]">{supplier.name}</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-[#f5f3f0] text-[#334c5c] px-2 py-0.5 rounded inline-block mt-1">
                        {supplier.category}
                      </span>
                    </div>

                    {/* Badge del tipo de contacto */}
                    <div className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xs">
                      {supplier.contactType === 'whatsapp' && (
                        <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold">
                          <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" /> Vía WhatsApp
                        </span>
                      )}
                      {supplier.contactType === 'web' && (
                        <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold">
                          <Globe className="w-3.5 h-3.5 text-blue-600" /> Página Web B2B
                        </span>
                      )}
                      {supplier.contactType === 'phone' && (
                        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold">
                          <Phone className="w-3.5 h-3.5 text-amber-600" /> Por Teléfono
                        </span>
                      )}
                      {supplier.contactType === 'store' && (
                        <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold">
                          <Store className="w-3.5 h-3.5 text-purple-600" /> Compras Presenciales
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Detalles Operativos */}
                  <div className="bg-[#fbf9f6] p-3 rounded-xl border border-gray-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contacto / Asesor:</span>
                      <span className="font-bold text-gray-800">{supplier.contactPerson}</span>
                    </div>

                    {supplier.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tel / Celular:</span>
                        <span className="font-semibold text-gray-800">{supplier.phone}</span>
                      </div>
                    )}

                    {supplier.websiteUrl && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sitio Web:</span>
                        <a href={supplier.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold flex items-center gap-1">
                          Abrir catálogo online <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {supplier.storeAddress && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dirección Tienda:</span>
                        <span className="font-medium text-gray-700">{supplier.storeAddress}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-400">Forma de Pago:</span>
                      <span className="font-medium text-gray-700">{supplier.paymentMethod}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Tiempo de Entrega:</span>
                      <span className="font-bold text-[#334c5c]">
                        {supplier.leadTimeDays === 0 ? 'Inmediato (En tienda)' : `${supplier.leadTimeDays} día(s) hábil(es)`}
                      </span>
                    </div>
                  </div>

                  {/* Notas del Chef */}
                  <p className="text-[11px] text-gray-500 italic bg-white p-2 rounded-lg border border-gray-100">
                    💡 <strong>Nota del Chef:</strong> {supplier.notes}
                  </p>
                </div>

                {/* Botón de Acción Principal Según el Canal */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleContactSupplier(supplier)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition shadow-sm bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b]"
                  >
                    {supplier.contactType === 'whatsapp' && (
                      <>
                        <MessageCircle className="w-4 h-4 text-[#25d366]" /> Enviar Pedido por WhatsApp
                      </>
                    )}
                    {supplier.contactType === 'web' && (
                      <>
                        <Globe className="w-4 h-4 text-blue-400" /> Ir a la Tienda / Web del Proveedor
                      </>
                    )}
                    {supplier.contactType === 'phone' && (
                      <>
                        <Phone className="w-4 h-4 text-amber-400" /> Marcar / Llamar al Proveedor
                      </>
                    )}
                    {supplier.contactType === 'store' && (
                      <>
                        <Store className="w-4 h-4 text-purple-400" /> Ver Ubicación en Google Maps
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPurchasesView;