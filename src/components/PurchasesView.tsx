import React, { useState } from 'react';
import { 
  Supplier, 
  PurchaseRecord, 
  RawMaterial 
} from '../types';
import { 
  ShoppingBasket, 
  Plus, 
  Users, 
  Receipt, 
  Calculator, 
  Search, 
  X, 
  CheckCircle2, 
  Truck, 
  Phone, 
  Mail, 
  MapPin 
} from 'lucide-react';

interface PurchasesViewProps {
  suppliers: Supplier[];
  purchases: PurchaseRecord[];
  rawMaterials: RawMaterial[];
  onAddPurchase: (purchase: Omit<PurchaseRecord, 'id' | 'supplierName' | 'rawMaterialName'>) => void;
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  isNewPurchaseModalOpen: boolean;
  setIsNewPurchaseModalOpen: (open: boolean) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  suppliers,
  purchases,
  rawMaterials,
  onAddPurchase,
  onAddSupplier,
  isNewPurchaseModalOpen,
  setIsNewPurchaseModalOpen
}) => {
  const [activeTab, setActiveTab] = useState<'purchases' | 'suppliers'>('purchases');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState<boolean>(false);

  // Form State for Purchase
  const [supplierId, setSupplierId] = useState<string>('');
  const [rawMaterialId, setRawMaterialId] = useState<string>('');
  const [quantityBoughtGross, setQuantityBoughtGross] = useState<number>(10000); // e.g., 10 kg = 10,000g
  const [grossTotalPaid, setGrossTotalPaid] = useState<number>(60000); // $60,000 COP
  const [specificLossPercentage, setSpecificLossPercentage] = useState<number>(25); // 25% default for apple
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [purchaseNotes, setPurchaseNotes] = useState<string>('');

  // Form State for Supplier
  const [supName, setSupName] = useState<string>('');
  const [supContact, setSupContact] = useState<string>('');
  const [supPhone, setSupPhone] = useState<string>('');
  const [supEmail, setSupEmail] = useState<string>('');
  const [supAddress, setSupAddress] = useState<string>('');

  // Live Purchase Net Cost Calculations
  const netUsableGrams = quantityBoughtGross * (1 - (specificLossPercentage / 100));
  const realCostPerNetGram = netUsableGrams > 0 ? grossTotalPaid / netUsableGrams : 0;
  const costPerGrossGram = quantityBoughtGross > 0 ? grossTotalPaid / quantityBoughtGross : 0;

  const handleRawMaterialChange = (rmId: string) => {
    setRawMaterialId(rmId);
    const rm = rawMaterials.find(r => r.id === rmId);
    if (rm) {
      setSpecificLossPercentage(rm.preparationLossPercentage);
      if (rm.supplierId) {
        setSupplierId(rm.supplierId);
      }
    }
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !rawMaterialId) {
      alert('Por favor selecciona un proveedor y una materia prima.');
      return;
    }

    onAddPurchase({
      date: new Date().toISOString().split('T')[0],
      supplierId,
      rawMaterialId,
      quantityBoughtGross: Number(quantityBoughtGross),
      grossTotalPaid: Number(grossTotalPaid),
      specificLossPercentage: Number(specificLossPercentage),
      netUsableGrams,
      realCostPerNetGram,
      invoiceNumber,
      notes: purchaseNotes
    });

    setIsNewPurchaseModalOpen(false);
    setInvoiceNumber('');
    setPurchaseNotes('');
  };

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supPhone) {
      alert('Nombre de empresa y teléfono son requeridos.');
      return;
    }

    onAddSupplier({
      name: supName,
      contactName: supContact,
      phone: supPhone,
      email: supEmail,
      address: supAddress
    });

    setIsSupplierModalOpen(false);
    setSupName('');
    setSupContact('');
    setSupPhone('');
    setSupEmail('');
    setSupAddress('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-[#E0D7C6] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#2D463E] font-display flex items-center space-x-2">
            <ShoppingBasket className="w-6 h-6 text-[#2D463E]" />
            <span>Módulo de Compras, Mermas y Proveedores</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Recálculo automático del costo promedio ponderado neto tras cada compra de insumos
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSupplierModalOpen(true)}
            className="bg-stone-800 hover:bg-stone-900 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#D4A373]" />
            <span>+ Nuevo Proveedor</span>
          </button>

          <button
            onClick={() => setIsNewPurchaseModalOpen(true)}
            className="bg-[#D4A373] hover:bg-[#c29263] text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Compra de Insumos</span>
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E0D7C6] pb-2">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'purchases'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-[#F9F7F4] border border-[#E0D7C6]'
          }`}
        >
          Historial de Compras ({purchases.length})
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'suppliers'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-[#F9F7F4] border border-[#E0D7C6]'
          }`}
        >
          Directorio de Proveedores ({suppliers.length})
        </button>
      </div>

      {/* SUB-TAB 1: Purchases Table */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex justify-between items-center">
            <span className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-[#EF8828]" />
              <span><b>Cálculo de Costo Real:</b> Al registrar cada compra, la app actualiza el stock neto utilizable y el <b>Costo Promedio Ponderado</b> usado en las recetas.</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Fecha / N° Factura</th>
                  <th className="p-3.5">Materia Prima</th>
                  <th className="p-3.5">Proveedor</th>
                  <th className="p-3.5">Cantidad Bruta</th>
                  <th className="p-3.5">% Merma</th>
                  <th className="p-3.5">Cantidad Neta</th>
                  <th className="p-3.5">Total Pagado</th>
                  <th className="p-3.5">Costo Neto / gr</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-800">
                      <div>{p.date}</div>
                      {p.invoiceNumber && <div className="text-[10px] text-slate-400">{p.invoiceNumber}</div>}
                    </td>

                    <td className="p-3.5 font-bold text-[#344E5C]">{p.rawMaterialName}</td>
                    <td className="p-3.5 text-slate-600">{p.supplierName}</td>

                    <td className="p-3.5 text-slate-600 font-semibold">
                      {p.quantityBoughtGross.toLocaleString()} grs
                    </td>

                    <td className="p-3.5">
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold">
                        -{p.specificLossPercentage}% merma
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-slate-900">
                      {p.netUsableGrams.toLocaleString()} grs
                    </td>

                    <td className="p-3.5 font-bold text-slate-900">
                      ${p.grossTotalPaid.toLocaleString('es-CO')}
                    </td>

                    <td className="p-3.5 font-extrabold text-[#E44F27]">
                      ${p.realCostPerNetGram.toFixed(2)} / gr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Suppliers Directory */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(s => (
            <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-[#344E5C] flex items-center justify-center font-bold text-base">
                  🏢
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm font-display">{s.name}</h3>
                  <p className="text-xs text-slate-500">Contacto: {s.contactName}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#EF8828]" />
                  <span>{s.phone}</span>
                </div>
                {s.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-[#EF8828]" />
                    <span>{s.email}</span>
                  </div>
                )}
                {s.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-[#EF8828]" />
                    <span>{s.address}</span>
                  </div>
                )}
              </div>

              {s.notes && (
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                  "{s.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Registrar Nueva Compra */}
      {isNewPurchaseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setIsNewPurchaseModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-3">
              <div className="p-2 bg-[#EF8828] text-white rounded-lg">
                <ShoppingBasket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">Registrar Compra de Insumos</h3>
                <p className="text-xs text-slate-500">Ingresa las mermas específicas para recalcular el costo promedio neto</p>
              </div>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Materia Prima Adquirida *</label>
                  <select
                    value={rawMaterialId}
                    onChange={e => handleRawMaterialChange(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828]"
                    required
                  >
                    <option value="">-- Seleccionar Materia Prima --</option>
                    {rawMaterials.map(rm => (
                      <option key={rm.id} value={rm.id}>{rm.name} ({rm.unit})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proveedor *</label>
                  <select
                    value={supplierId}
                    onChange={e => setSupplierId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828]"
                    required
                  >
                    <option value="">-- Seleccionar Proveedor --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cantidad Bruta *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 10000 grs"
                    value={quantityBoughtGross}
                    onChange={e => setQuantityBoughtGross(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828]"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Peso bruto con cascara/grasa</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Pagado ($ COP) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 60000"
                    value={grossTotalPaid}
                    onChange={e => setGrossTotalPaid(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828]"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Factura de compra</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">% Merma Alistamiento *</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    placeholder="Ej: 25"
                    value={specificLossPercentage}
                    onChange={e => setSpecificLossPercentage(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#EF8828]"
                    required
                  />
                  <span className="text-[10px] text-amber-700 font-semibold">% Pérdida por pelado/limpieza</span>
                </div>
              </div>

              {/* Real Cost Live Simulation Card */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 space-y-1.5">
                <div className="font-bold text-[#344E5C] text-xs flex items-center space-x-1">
                  <Calculator className="w-4 h-4 text-[#EF8828]" />
                  <span>Resumen de Rendimiento y Costo Neto Real:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                  <div>Costo Bruto: <b>${costPerGrossGram.toFixed(2)} / gr</b></div>
                  <div>Gramos Netos: <b>{netUsableGrams.toLocaleString()} grs</b></div>
                  <div className="text-[#E44F27] font-extrabold">Costo Neto Real: ${realCostPerNetGram.toFixed(2)} / gr</div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">N° Factura (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: FAC-8849"
                  value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPurchaseModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#EF8828] hover:bg-[#d6761f] text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Guardar Compra y Recalcular Costo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nuevo Proveedor */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsSupplierModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-slate-800 mb-4">Agregar Nuevo Proveedor</h3>

            <form onSubmit={handleSupplierSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Comercial / Empresa *</label>
                <input
                  type="text"
                  placeholder="Ej: Avícola La Granja"
                  value={supName}
                  onChange={e => setSupName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre de Contacto</label>
                <input
                  type="text"
                  placeholder="Ej: Don Pedro Gómez"
                  value={supContact}
                  onChange={e => setSupContact(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="text"
                  placeholder="Ej: 3109876543"
                  value={supPhone}
                  onChange={e => setSupPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dirección / Plaza</label>
                <input
                  type="text"
                  placeholder="Ej: Plaza Central Lote 14"
                  value={supAddress}
                  onChange={e => setSupAddress(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#344E5C] text-white rounded-xl shadow-md transition-all cursor-pointer"
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
