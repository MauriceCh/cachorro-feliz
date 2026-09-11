import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  Search, 
  Plus, 
  Minus,
  Phone, 
  MessageCircle, 
  Globe, 
  Store, 
  DollarSign, 
  TrendingDown, 
  ExternalLink,
  Edit2,
  Trash2,
  Sliders,
  CheckCircle2,
  Clock,
  X,
  AlertCircle
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
  lastAdjustmentReason?: string;
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
    minStock: 12.0,
    unit: 'kg',
    costPerUnitCOP: 14500,
    supplierId: 'sup-1',
    supplierName: 'Frigorífico & Cárnicos del Norte',
    lastRestockDate: '2024-10-18',
    lastAdjustmentReason: 'Ingreso lote de compra'
  },
  {
    id: 'mat-2',
    name: 'Pechuga de Pollo Fresca sin Piel',
    category: 'Proteínas',
    currentStock: 8.0,
    minStock: 15.0,
    unit: 'kg',
    costPerUnitCOP: 18200,
    supplierId: 'sup-2',
    supplierName: 'Avícola Santa Mónica',
    lastRestockDate: '2024-10-21',
    lastAdjustmentReason: 'Merma por limpieza previa'
  },
  {
    id: 'mat-3',
    name: 'Carne de Res Pulpa Limpia (Deshidratados)',
    category: 'Proteínas',
    currentStock: 16.0,
    minStock: 10.0,
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
    minStock: 15.0,
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
    minStock: 150,
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
    minStock: 3.0,
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
  
  // MODALES
  // 1. Ajuste manual de merma / ingreso
  const [adjustingMaterial, setAdjustingMaterial] = useState<RawMaterial | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(1);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('subtract');
  const [adjustReason, setAdjustReason] = useState<string>('Deterioro / Merma natural');
  const [adjustNote, setAdjustNote] = useState<string>('');

  // 2. Crear / Editar Materia Prima
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [matFormName, setMatFormName] = useState('');
  const [matFormCategory, setMatFormCategory] = useState<'Proteínas' | 'Harinas & Vegetales' | 'Empaques' | 'Otros'>('Proteínas');
  const [matFormStock, setMatFormStock] = useState<number>(10);
  const [matFormMinStock, setMatFormMinStock] = useState<number>(10);
  const [matFormUnit, setMatFormUnit] = useState<'kg' | 'und' | 'g'>('kg');
  const [matFormCost, setMatFormCost] = useState<number>(15000);
  const [matFormSupplierId, setMatFormSupplierId] = useState<string>('sup-1');

  // 3. Crear / Editar Proveedor
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supFormName, setSupFormName] = useState('');
  const [supFormCategory, setSupFormCategory] = useState<'Carnes & Vísceras' | 'Cereales & Harinas' | 'Empaques & Rótulos' | 'Supermercado General'>('Carnes & Vísceras');
  const [supFormContactType, setSupFormContactType] = useState<'whatsapp' | 'web' | 'phone' | 'store'>('whatsapp');
  const [supFormPhone, setSupFormPhone] = useState('');
  const [supFormWebsite, setSupFormWebsite] = useState('');
  const [supFormAddress, setSupFormAddress] = useState('');
  const [supFormPerson, setSupFormPerson] = useState('');
  const [supFormPayment, setSupFormPayment] = useState('Transferencia / Contado');
  const [supFormLeadTime, setSupFormLeadTime] = useState<number>(1);
  const [supFormNotes, setSupFormNotes] = useState('');

  // INVENTARIO CALCULADO
  const lowStockMaterials = materials.filter(m => m.currentStock < m.minStock);
  const totalInventoryValueCOP = materials.reduce((acc, m) => acc + (m.currentStock * m.costPerUnitCOP), 0);

  // AJUSTE RÁPIDO (+ / - 1)
  const handleQuickStep = (id: string, delta: number) => {
    setMaterials(materials.map(m => {
      if (m.id === id) {
        const step = m.unit === 'und' ? 1 : 0.5;
        const newStock = Math.max(0, parseFloat((m.currentStock + (delta * step)).toFixed(2)));
        return {
          ...m,
          currentStock: newStock,
          lastAdjustmentReason: delta > 0 ? 'Ajuste manual rápido (+)' : 'Ajuste manual rápido (-)'
        };
      }
      return m;
    }));
  };

  // EJECUTAR AJUSTE DETALLADO (MERMA, VENCIMIENTO, ACCIDENTE)
  const handleApplyDetailedAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingMaterial || adjustQuantity <= 0) return;

    setMaterials(materials.map(m => {
      if (m.id === adjustingMaterial.id) {
        const factor = adjustType === 'add' ? 1 : -1;
        const newStock = Math.max(0, parseFloat((m.currentStock + (factor * adjustQuantity)).toFixed(2)));
        const reasonDesc = `${adjustType === 'add' ? 'Ingreso: ' : 'Baja: '} ${adjustReason} ${adjustNote ? `(${adjustNote})` : ''}`;
        return {
          ...m,
          currentStock: newStock,
          lastAdjustmentReason: reasonDesc
        };
      }
      return m;
    }));

    setAdjustingMaterial(null);
    setAdjustQuantity(1);
    setAdjustNote('');
  };

  // GUARDAR MATERIA PRIMA (NUEVA O EDICIÓN)
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matFormName.trim()) return;

    const supplierObj = suppliers.find(s => s.id === matFormSupplierId);
    const supplierName = supplierObj ? supplierObj.name : 'Proveedor General';

    if (editingMaterial) {
      // Editar
      setMaterials(materials.map(m => {
        if (m.id === editingMaterial.id) {
          return {
            ...m,
            name: matFormName,
            category: matFormCategory,
            currentStock: Number(matFormStock),
            minStock: Number(matFormMinStock),
            unit: matFormUnit,
            costPerUnitCOP: Number(matFormCost),
            supplierId: matFormSupplierId,
            supplierName: supplierName
          };
        }
        return m;
      }));
    } else {
      // Crear nueva
      const newMat: RawMaterial = {
        id: `mat-${Date.now()}`,
        name: matFormName,
        category: matFormCategory,
        currentStock: Number(matFormStock),
        minStock: Number(matFormMinStock),
        unit: matFormUnit,
        costPerUnitCOP: Number(matFormCost),
        supplierId: matFormSupplierId,
        supplierName: supplierName,
        lastRestockDate: new Date().toISOString().split('T')[0],
        lastAdjustmentReason: 'Registro inicial'
      };
      setMaterials([...materials, newMat]);
    }

    setShowMaterialModal(false);
    setEditingMaterial(null);
  };

  // ELIMINAR MATERIA PRIMA
  const handleDeleteMaterial = (id: string, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar la materia prima "${name}" del inventario?`)) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  // GUARDAR PROVEEDOR (NUEVO O EDICIÓN)
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supFormName.trim()) return;

    if (editingSupplier) {
      // Editar
      setSuppliers(suppliers.map(s => {
        if (s.id === editingSupplier.id) {
          return {
            ...s,
            name: supFormName,
            category: supFormCategory,
            contactType: supFormContactType,
            phone: supFormPhone,
            websiteUrl: supFormWebsite,
            storeAddress: supFormAddress,
            contactPerson: supFormPerson,
            paymentMethod: supFormPayment,
            leadTimeDays: Number(supFormLeadTime),
            notes: supFormNotes
          };
        }
        return s;
      }));
    } else {
      // Crear nuevo
      const newSup: Supplier = {
        id: `sup-${Date.now()}`,
        name: supFormName,
        category: supFormCategory,
        contactType: supFormContactType,
        phone: supFormPhone,
        websiteUrl: supFormWebsite,
        storeAddress: supFormAddress,
        contactPerson: supFormPerson || 'Contacto Principal',
        paymentMethod: supFormPayment,
        leadTimeDays: Number(supFormLeadTime),
        notes: supFormNotes || 'Proveedor registrado en el taller.'
      };
      setSuppliers([...suppliers, newSup]);
    }

    setShowSupplierModal(false);
    setEditingSupplier(null);
  };

  // ELIMINAR PROVEEDOR
  const handleDeleteSupplier = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar al proveedor "${name}"? Las materias primas vinculadas mantendrán su nombre como histórico.`)) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  // CONTACTAR PROVEEDOR
  const handleContactSupplier = (supplier: Supplier, materialName?: string) => {
    if (supplier.contactType === 'whatsapp' && supplier.phone) {
      const cleanPhone = supplier.phone.replace(/\D/g, '');
      const text = materialName 
        ? `¡Hola ${supplier.contactPerson}! Te saluda el Chef Javier de Cachorro Feliz (Normandía).\nQuisiera consultar precio y disponibilidad para pedir reposición de: ${materialName}.\n¿Para cuándo tendrías despacho?`
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

  // FILTROS
  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header Principal */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Package className="w-3.5 h-3.5" /> Materias Primas & Proveedores
          </span>
          <h2 className="text-2xl font-black text-[#334c5c]">
            Inventario, Mermas & Proveedores
          </h2>
          <p className="text-xs text-gray-500">
            Ajuste manual de stock por vencimientos o mermas, edición directa y directorio multicanal.
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
            🚚 Proveedores ({suppliers.length})
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
                ¡Alerta de Stock Crítico! ({lowStockMaterials.length} insumos en mínimo)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-red-700 uppercase bg-red-100 px-2.5 py-0.5 rounded-full">
              Reponer para no frenar la producción
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
              onClick={() => {
                setEditingMaterial(null);
                setMatFormName('');
                setMatFormCategory('Proteínas');
                setMatFormStock(10);
                setMatFormMinStock(10);
                setMatFormUnit('kg');
                setMatFormCost(15000);
                setMatFormSupplierId(suppliers[0]?.id || '');
                setShowMaterialModal(true);
              }}
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
                    <th className="py-3 px-3 text-center">Ajuste Manual</th>
                    <th className="py-3 px-3 text-center">Mínimo</th>
                    <th className="py-3 px-3 text-right">Costo Unitario</th>
                    <th className="py-3 px-4">Proveedor Habitual</th>
                    <th className="py-3 px-3 text-center">Acciones</th>
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
                          <div className="font-black text-[#334c5c] text-sm">{mat.name}</div>
                          {mat.lastAdjustmentReason && (
                            <span className="text-[10px] text-gray-500 block italic">
                              Último mov: {mat.lastAdjustmentReason}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            {mat.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block font-black px-2.5 py-1 rounded-xl text-xs ${
                            isLow 
                              ? 'bg-red-100 text-red-800' 
                              : isNear 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {mat.currentStock} {mat.unit}
                          </span>
                        </td>

                        {/* Botones de Ajuste Manual Rápido (+ / -) y Merma */}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-[#f5f3f0] p-1 rounded-xl border border-gray-200">
                            <button
                              type="button"
                              onClick={() => handleQuickStep(mat.id, -1)}
                              className="w-6 h-6 rounded-lg bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center justify-center font-black shadow-xs transition"
                              title="Restar 1 paso"
                            >
                              <Minus className="w-3 h-3 stroke-[3]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAdjustingMaterial(mat);
                                setAdjustQuantity(1);
                                setAdjustType('subtract');
                                setAdjustReason('Deterioro / Merma natural');
                              }}
                              className="px-2 py-1 text-[10px] font-extrabold text-[#334c5c] hover:bg-white rounded-lg transition"
                              title="Registrar merma, deterioro o accidente"
                            >
                              Merma / Ajuste
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickStep(mat.id, 1)}
                              className="w-6 h-6 rounded-lg bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center justify-center font-black shadow-xs transition"
                              title="Sumar 1 paso"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>
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
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMaterial(mat);
                                setMatFormName(mat.name);
                                setMatFormCategory(mat.category);
                                setMatFormStock(mat.currentStock);
                                setMatFormMinStock(mat.minStock);
                                setMatFormUnit(mat.unit);
                                setMatFormCost(mat.costPerUnitCOP);
                                setMatFormSupplierId(mat.supplierId);
                                setShowMaterialModal(true);
                              }}
                              className="p-1.5 text-gray-400 hover:text-[#334c5c] hover:bg-gray-100 rounded-lg transition"
                              title="Editar materia prima"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(mat.id, mat.name)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Eliminar materia prima"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* PESTAÑA 2: DIRECTORIO DE PROVEEDORES (EDITABLE & BORRABLE) */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, categoría o nota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#334c5c] focus:outline-none bg-white shadow-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingSupplier(null);
                setSupFormName('');
                setSupFormCategory('Carnes & Vísceras');
                setSupFormContactType('whatsapp');
                setSupFormPhone('');
                setSupFormWebsite('');
                setSupFormAddress('');
                setSupFormPerson('');
                setSupFormPayment('Transferencia Bancolombia / Nequi');
                setSupFormLeadTime(1);
                setSupFormNotes('');
                setShowSupplierModal(true);
              }}
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
                      <h4 className="font-black text-base text-[#334c5c]">{supplier.name}</h4>
                      <span className="text-[10px] font-bold bg-[#f5f3f0] text-[#334c5c] px-2 py-0.5 rounded inline-block mt-1">
                        {supplier.category}
                      </span>
                    </div>

                    {/* Botones Editar y Borrar Proveedor */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSupplier(supplier);
                          setSupFormName(supplier.name);
                          setSupFormCategory(supplier.category);
                          setSupFormContactType(supplier.contactType);
                          setSupFormPhone(supplier.phone || '');
                          setSupFormWebsite(supplier.websiteUrl || '');
                          setSupFormAddress(supplier.storeAddress || '');
                          setSupFormPerson(supplier.contactPerson);
                          setSupFormPayment(supplier.paymentMethod);
                          setSupFormLeadTime(supplier.leadTimeDays);
                          setSupFormNotes(supplier.notes);
                          setShowSupplierModal(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-[#334c5c] hover:bg-gray-100 rounded-lg transition"
                        title="Editar proveedor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSupplier(supplier.id, supplier.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar proveedor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Badge Canal */}
                  <div className="inline-block">
                    {supplier.contactType === 'whatsapp' && (
                      <span className="bg-green-100 text-green-800 text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold">
                        <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" /> Pedidos por WhatsApp
                      </span>
                    )}
                    {supplier.contactType === 'web' && (
                      <span className="bg-blue-100 text-blue-800 text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold">
                        <Globe className="w-3.5 h-3.5 text-blue-600" /> Tienda Web B2B
                      </span>
                    )}
                    {supplier.contactType === 'phone' && (
                      <span className="bg-amber-100 text-amber-800 text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold">
                        <Phone className="w-3.5 h-3.5 text-amber-600" /> Pedido Telefónico
                      </span>
                    )}
                    {supplier.contactType === 'store' && (
                      <span className="bg-purple-100 text-purple-800 text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold">
                        <Store className="w-3.5 h-3.5 text-purple-600" /> Compra Presencial en Tienda
                      </span>
                    )}
                  </div>

                  {/* Detalles Operativos */}
                  <div className="bg-[#fbf9f6] p-3 rounded-xl border border-gray-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Asesor / Contacto:</span>
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
                        <span className="text-gray-400">Dirección:</span>
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
                        {supplier.leadTimeDays === 0 ? 'Inmediato (En tienda)' : `${supplier.leadTimeDays} día(s)`}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 italic bg-white p-2 rounded-lg border border-gray-100">
                    💡 <strong>Nota del Chef:</strong> {supplier.notes}
                  </p>
                </div>

                {/* Botón de Contacto Directo */}
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

      {/* MODAL 1: REGISTRAR MERMA / AJUSTE MANUAL */}
      {adjustingMaterial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#334c5c]">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400">Control de Mermas e Imprevistos</span>
                <h3 className="text-base font-black text-[#334c5c]">
                  Ajustar Stock: {adjustingMaterial.name}
                </h3>
              </div>
              <button type="button" onClick={() => setAdjustingMaterial(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleApplyDetailedAdjustment} className="space-y-4">
              <div className="bg-[#fbf9f6] p-3 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-gray-600 font-bold">Stock Actual en Taller:</span>
                <span className="font-black text-sm text-[#334c5c]">{adjustingMaterial.currentStock} {adjustingMaterial.unit}</span>
              </div>

              {/* Tipo de Ajuste */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('subtract')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition ${
                    adjustType === 'subtract'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  - Descontar / Merma
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition ${
                    adjustType === 'add'
                      ? 'bg-green-700 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  + Ingresar / Reposición
                </button>
              </div>

              {/* Cantidad */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  Cantidad ({adjustingMaterial.unit}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-black p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                />
              </div>

              {/* Motivo del Ajuste */}
              {adjustType === 'subtract' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Motivo de la Salida / Baja</label>
                  <select
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none bg-white font-medium"
                  >
                    <option value="Deterioro / Merma natural">Deterioro / Merma natural en cocción o corte</option>
                    <option value="Fecha de Vencimiento">Fecha de Vencimiento / Caducidad</option>
                    <option value="Accidente / Caída o rotura">Accidente / Caída o rotura de empaque</option>
                    <option value="Prueba o Degustación">Prueba de calidad o degustación canina</option>
                    <option value="Ajuste de Conteo Físico">Diferencia en conteo físico de inventario</option>
                  </select>
                </div>
              )}

              {/* Nota Adicional */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Nota adicional del Chef (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Bolsa rota durante el traslado o grasa recortada"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setAdjustingMaterial(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-black bg-[#334c5c] text-[#f8b46b] hover:bg-[#273a46] shadow-md transition"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREAR O EDITAR MATERIA PRIMA */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#334c5c]">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-base font-black text-[#334c5c]">
                {editingMaterial ? 'Editar Materia Prima' : '+ Nueva Materia Prima'}
              </h3>
              <button type="button" onClick={() => setShowMaterialModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Nombre del Insumo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carne de Cerdo Magra"
                  value={matFormName}
                  onChange={(e) => setMatFormName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Categoría</label>
                  <select
                    value={matFormCategory}
                    onChange={(e) => setMatFormCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Proteínas">Proteínas</option>
                    <option value="Harinas & Vegetales">Harinas & Vegetales</option>
                    <option value="Empaques">Empaques</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Unidad de Medida</label>
                  <select
                    value={matFormUnit}
                    onChange={(e) => setMatFormUnit(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="und">Unidades (und)</option>
                    <option value="g">Gramos (g)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Stock Actual</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={matFormStock}
                    onChange={(e) => setMatFormStock(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Stock Mínimo (Alarma)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={matFormMinStock}
                    onChange={(e) => setMatFormMinStock(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Costo Unitario (COP)</label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    required
                    value={matFormCost}
                    onChange={(e) => setMatFormCost(parseInt(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Proveedor Habitual</label>
                  <select
                    value={matFormSupplierId}
                    onChange={(e) => setMatFormSupplierId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-black bg-[#334c5c] text-[#f8b46b] rounded-xl shadow"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREAR O EDITAR PROVEEDOR */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#334c5c] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-base font-black text-[#334c5c]">
                {editingSupplier ? 'Editar Proveedor' : '+ Nuevo Proveedor'}
              </h3>
              <button type="button" onClick={() => setShowSupplierModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Nombre de la Empresa o Negocio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Distribuidora Cárnica La Sabana"
                  value={supFormName}
                  onChange={(e) => setSupFormName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Categoría</label>
                  <select
                    value={supFormCategory}
                    onChange={(e) => setSupFormCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Carnes & Vísceras">Carnes & Vísceras</option>
                    <option value="Cereales & Harinas">Cereales & Harinas</option>
                    <option value="Empaques & Rótulos">Empaques & Rótulos</option>
                    <option value="Supermercado General">Supermercado General</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Canal de Pedido</label>
                  <select
                    value={supFormContactType}
                    onChange={(e) => setSupFormContactType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="whatsapp">Vía WhatsApp</option>
                    <option value="web">Página Web B2B</option>
                    <option value="phone">Llamada Telefónica</option>
                    <option value="store">Compra en Tienda Física</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+57 300 000 0000"
                    value={supFormPhone}
                    onChange={(e) => setSupFormPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Contacto / Asesor</label>
                  <input
                    type="text"
                    placeholder="Ej: Don Carlos"
                    value={supFormPerson}
                    onChange={(e) => setSupFormPerson(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              {supFormContactType === 'web' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">URL de la Tienda Web</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={supFormWebsite}
                    onChange={(e) => setSupFormWebsite(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              )}

              {supFormContactType === 'store' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Dirección de la Tienda</label>
                  <input
                    type="text"
                    placeholder="Ej: Av. Boyacá # 55-20"
                    value={supFormAddress}
                    onChange={(e) => setSupFormAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Forma de Pago</label>
                  <input
                    type="text"
                    placeholder="Nequi / Bancolombia / Efectivo"
                    value={supFormPayment}
                    onChange={(e) => setSupFormPayment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Días de Entrega</label>
                  <input
                    type="number"
                    min="0"
                    value={supFormLeadTime}
                    onChange={(e) => setSupFormLeadTime(parseInt(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Notas del Chef</label>
                <textarea
                  rows={2}
                  placeholder="Horarios de pedido, calidades especiales, etc."
                  value={supFormNotes}
                  onChange={(e) => setSupFormNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-black bg-[#334c5c] text-[#f8b46b] rounded-xl shadow"
                >
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPurchasesView;