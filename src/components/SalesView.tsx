import React, { useState } from 'react';
import { 
  Sale, 
  Client, 
  FinishedProduct, 
  OrderStatus, 
  SaleItem 
} from '../types';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  Truck, 
  Printer, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Package, 
  X, 
  UserPlus, 
  Dog, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface SalesViewProps {
  sales: Sale[];
  clients: Client[];
  finishedProducts: FinishedProduct[];
  onAddSale: (newSale: Omit<Sale, 'id' | 'saleNumber'>) => void;
  onUpdateSaleStatus: (saleId: string, status: OrderStatus, trackingCode?: string, deliveryPerson?: string) => void;
  isNewSaleModalOpen: boolean;
  setIsNewSaleModalOpen: (open: boolean) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  sales,
  clients,
  finishedProducts,
  onAddSale,
  onUpdateSaleStatus,
  isNewSaleModalOpen,
  setIsNewSaleModalOpen
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<Sale | null>(null);

  // Form State for New Sale
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientPhone, setNewClientPhone] = useState<string>('');
  const [newClientAddress, setNewClientAddress] = useState<string>('');
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  
  const [saleItems, setSaleItems] = useState<{ finishedProductId: string; quantity: number }[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(8000);
  const [deliveryPerson, setDeliveryPerson] = useState<string>('Mensajería / Domicilio');
  const [notes, setNotes] = useState<string>('');

  // Filter Sales
  const filteredSales = sales.filter(s => {
    const matchesStatus = selectedStatusFilter === 'Todos' || s.status === selectedStatusFilter;
    const matchesSearch = s.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.petName && s.petName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Client Selection logic
  const activeClient = clients.find(c => c.id === selectedClientId);

  const handleAddProductToSale = (productId: string) => {
    if (!productId) return;
    const existing = saleItems.find(i => i.finishedProductId === productId);
    if (existing) {
      setSaleItems(saleItems.map(i => i.finishedProductId === productId ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setSaleItems([...saleItems, { finishedProductId: productId, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setSaleItems(saleItems.filter(i => i.finishedProductId !== productId));
  };

  const handleQuantityChange = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
    } else {
      setSaleItems(saleItems.map(i => i.finishedProductId === productId ? { ...i, quantity: newQty } : i));
    }
  };

  // Calculate totals for new sale
  const computedItems: SaleItem[] = saleItems.map(item => {
    const product = finishedProducts.find(p => p.id === item.finishedProductId);
    const unitPrice = product ? product.salePrice : 0;
    const unitCost = product ? product.currentUnitCost : 0;
    return {
      finishedProductId: item.finishedProductId,
      productName: product ? product.name : 'Producto',
      quantity: item.quantity,
      unitCost,
      unitPrice,
      subtotal: unitPrice * item.quantity
    };
  });

  const subtotal = computedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal + Number(shippingCost);

  const handleCreateSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (computedItems.length === 0) {
      alert('Debes agregar al menos un producto al pedido.');
      return;
    }

    let clientName = '';
    let address = '';

    if (selectedClientId === 'NEW') {
      if (!newClientName || !newClientPhone) {
        alert('Por favor completa el nombre y teléfono del nuevo cliente.');
        return;
      }
      clientName = newClientName;
      address = newClientAddress;
    } else if (activeClient) {
      clientName = activeClient.name;
      address = newClientAddress || activeClient.address;
    } else {
      alert('Por favor selecciona un cliente.');
      return;
    }

    const selectedPet = activeClient?.pets.find(p => p.id === selectedPetId);

    onAddSale({
      date: new Date().toISOString().split('T')[0],
      clientId: selectedClientId,
      clientName,
      petId: selectedPet ? selectedPet.id : undefined,
      petName: selectedPet ? selectedPet.name : undefined,
      items: computedItems,
      subtotal,
      shippingCost: Number(shippingCost),
      total,
      status: 'En Preparación',
      shippingAddress: address,
      deliveryPerson,
      notes
    });

    // Reset form
    setSaleItems([]);
    setSelectedClientId('');
    setNewClientName('');
    setNewClientPhone('');
    setNewClientAddress('');
    setSelectedPetId('');
    setIsNewSaleModalOpen(false);
  };

  const generateWhatsAppMessage = (sale: Sale) => {
    const text = `¡Hola ${sale.clientName}! 🐾 Te saludamos de *Cachorro Feliz*.
Confirmamos tu pedido *${sale.saleNumber}* ${sale.petName ? `para consentir a *${sale.petName}* 🐶` : ''}:

${sale.items.map(i => `• ${i.quantity}x ${i.productName} - $${i.subtotal.toLocaleString('es-CO')}`).join('\n')}

*Envío:* $${sale.shippingCost.toLocaleString('es-CO')}
*TOTAL:* $${sale.total.toLocaleString('es-CO')} COP

*Dirección de entrega:* ${sale.shippingAddress}
*Estado:* ${sale.status}

¡Muchas gracias por elegir la alimentación natural de Cachorro Feliz! ❤️`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/?text=${encoded}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-[#E0D7C6] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#2D463E] font-display flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-[#2D463E]" />
            <span>Módulo de Ventas y Envíos</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de pedidos, clientes, transportadoras y comprobantes digitales
          </p>
        </div>

        <button
          onClick={() => setIsNewSaleModalOpen(true)}
          className="bg-[#2D463E] hover:bg-[#233831] text-white px-4 py-2.5 rounded-lg font-bold text-xs shadow-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#D4A373]" />
          <span>Registrar Nueva Venta</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por N° pedido, cliente o mascota..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E0D7C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {['Todos', 'Pendiente', 'En Preparación', 'Listo', 'Enviado', 'Entregado'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-[#2D463E] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-[#E0D7C6] hover:bg-[#F9F7F4]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Sales List Table */}
      <div className="bg-white rounded-xl border border-[#E0D7C6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F7F4] text-[#2D463E] uppercase font-semibold border-b border-[#E0D7C6]">
              <tr>
                <th className="p-3.5">N° Pedido / Fecha</th>
                <th className="p-3.5">Cliente & Mascota</th>
                <th className="p-3.5">Productos</th>
                <th className="p-3.5">Total Venta</th>
                <th className="p-3.5">Envío / Dirección</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0D7C6]/30">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    No se encontraron ventas con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-[#F9F7F4]/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-[#2D463E] text-sm">{sale.saleNumber}</div>
                      <div className="text-[11px] text-slate-400">{sale.date}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{sale.clientName}</div>
                      {sale.petName && (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#D4A373] bg-[#F9F7F4] border border-[#E0D7C6]/60 px-1.5 py-0.5 rounded mt-0.5">
                          <Dog className="w-3 h-3 text-[#D4A373]" />
                          <span>{sale.petName}</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="text-slate-700 font-medium text-[11px]">
                            {item.quantity}x {item.productName}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900 text-sm">
                        ${sale.total.toLocaleString('es-CO')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Subtotal: ${sale.subtotal.toLocaleString('es-CO')}
                      </div>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="text-slate-700 font-medium truncate">{sale.shippingAddress}</div>
                      <div className="text-[10px] text-slate-500">
                        {sale.deliveryPerson || 'Domicilio local'} {sale.trackingCode ? `(${sale.trackingCode})` : ''}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={sale.status}
                        onChange={e => onUpdateSaleStatus(sale.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          sale.status === 'Entregado' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          sale.status === 'Enviado' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          sale.status === 'En Preparación' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Preparación">En Preparación</option>
                        <option value="Listo">Listo</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => setSelectedSaleForReceipt(sale)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer"
                        title="Ver Comprobante / Ticket"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Ticket</span>
                      </button>

                      <a
                        href={generateWhatsAppMessage(sale)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer"
                        title="Enviar Confirmación por WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Nueva Venta */}
      {isNewSaleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setIsNewSaleModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-3">
              <div className="p-2 bg-[#EF8828] text-white rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">Registrar Nueva Venta</h3>
                <p className="text-xs text-slate-500">Selecciona cliente, mascota y productos listos para despacho</p>
              </div>
            </div>

            <form onSubmit={handleCreateSaleSubmit} className="space-y-4">
              {/* Cliente & Mascota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cliente *</label>
                  <select
                    value={selectedClientId}
                    onChange={e => {
                      setSelectedClientId(e.target.value);
                      if (e.target.value !== 'NEW') {
                        const cli = clients.find(c => c.id === e.target.value);
                        if (cli) setNewClientAddress(cli.address);
                      }
                    }}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
                    required
                  >
                    <option value="">-- Seleccionar Cliente --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                    ))}
                    <option value="NEW">+ Crear Nuevo Cliente</option>
                  </select>
                </div>

                {selectedClientId === 'NEW' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Nuevo Cliente *</label>
                      <input
                        type="text"
                        placeholder="Ej: Laura Gómez"
                        value={newClientName}
                        onChange={e => setNewClientName(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="text"
                        placeholder="Ej: 3001234567"
                        value={newClientPhone}
                        onChange={e => setNewClientPhone(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mascota (Opcional)</label>
                    <select
                      value={selectedPetId}
                      onChange={e => setSelectedPetId(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
                    >
                      <option value="">-- Sin especificar --</option>
                      {activeClient?.pets.map(p => (
                        <option key={p.id} value={p.id}>🐶 {p.name} ({p.breed || p.type})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Dirección de Envío */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dirección de Entrega *</label>
                <input
                  type="text"
                  placeholder="Ej: Calle 100 # 15-24 Apt 302, Bogotá"
                  value={newClientAddress}
                  onChange={e => setNewClientAddress(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
                  required
                />
              </div>

              {/* Agregar Productos */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-2">Seleccionar Productos *</label>
                <div className="flex gap-2">
                  <select
                    id="productSelector"
                    className="flex-1 text-xs p-2 border border-slate-300 rounded-xl bg-white"
                    defaultValue=""
                    onChange={e => {
                      if (e.target.value) {
                        handleAddProductToSale(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="" disabled>-- Selecciona un producto para añadir --</option>
                    {finishedProducts.map(fp => (
                      <option key={fp.id} value={fp.id} disabled={fp.stockUnits <= 0}>
                        {fp.name} - Stock: {fp.stockUnits} u | Price: ${fp.salePrice.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Added Product Items List */}
                {saleItems.length > 0 && (
                  <div className="mt-3 divide-y divide-slate-200 bg-white rounded-lg border border-slate-200 p-2">
                    {saleItems.map(item => {
                      const prod = finishedProducts.find(p => p.id === item.finishedProductId);
                      if (!prod) return null;
                      return (
                        <div key={item.finishedProductId} className="py-2 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-800">{prod.name}</div>
                            <div className="text-[11px] text-slate-500">${prod.salePrice.toLocaleString('es-CO')} c/u</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              max={prod.stockUnits}
                              value={item.quantity}
                              onChange={e => handleQuantityChange(item.finishedProductId, parseInt(e.target.value) || 1)}
                              className="w-14 p-1 border border-slate-300 rounded text-center font-bold"
                            />
                            <span className="font-bold text-slate-900 w-20 text-right">
                              ${(prod.salePrice * item.quantity).toLocaleString('es-CO')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.finishedProductId)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Costos de Envío & Repartidor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Costo de Envío ($ COP)</label>
                  <input
                    type="number"
                    min="0"
                    value={shippingCost}
                    onChange={e => setShippingCost(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Repartidor / Mensajería</label>
                  <input
                    type="text"
                    placeholder="Ej: Interrapidísimo / Mensajero Propio"
                    value={deliveryPerson}
                    onChange={e => setDeliveryPerson(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828]"
                  />
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-600 font-semibold">Subtotal:</span> ${subtotal.toLocaleString('es-CO')}
                  <span className="mx-2">|</span>
                  <span className="text-slate-600 font-semibold">Envío:</span> ${Number(shippingCost).toLocaleString('es-CO')}
                </div>
                <div className="text-base font-extrabold text-[#344E5C]">
                  TOTAL: ${total.toLocaleString('es-CO')} COP
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSaleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#EF8828] hover:bg-[#d6761f] text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirmar y Guardar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ticket / Receipt View */}
      {selectedSaleForReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedSaleForReceipt(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Ticket Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <div className="w-12 h-12 bg-[#EF8828] rounded-full text-white flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Dog className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-800">CACHORRO FELIZ</h3>
              <p className="text-[11px] text-slate-500">Alimentos Artesanales & Saludables</p>
              <p className="text-[10px] text-slate-400 mt-1">Pedidos: 3205714504 • Instagram: @OREO_CACHORRO_FELIZ</p>
            </div>

            {/* Ticket Info */}
            <div className="py-3 text-xs border-b border-dashed border-slate-300 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Comprobante: {selectedSaleForReceipt.saleNumber}</span>
                <span>{selectedSaleForReceipt.date}</span>
              </div>
              <div>Cliente: <span className="font-semibold text-slate-800">{selectedSaleForReceipt.clientName}</span></div>
              {selectedSaleForReceipt.petName && (
                <div className="text-[#EF8828] font-bold">Mascota: 🐾 {selectedSaleForReceipt.petName}</div>
              )}
              <div className="text-slate-500">Dirección: {selectedSaleForReceipt.shippingAddress}</div>
            </div>

            {/* Items */}
            <div className="py-3 space-y-2 text-xs border-b border-dashed border-slate-300">
              {selectedSaleForReceipt.items.map((i, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-700 font-medium">
                  <div>
                    <div>{i.productName}</div>
                    <div className="text-[10px] text-slate-400">{i.quantity} x ${i.unitPrice.toLocaleString()}</div>
                  </div>
                  <div className="font-bold text-slate-900">${i.subtotal.toLocaleString('es-CO')}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="py-3 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${selectedSaleForReceipt.subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío:</span>
                <span>${selectedSaleForReceipt.shippingCost.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#344E5C] pt-2 border-t border-slate-200">
                <span>TOTAL:</span>
                <span>${selectedSaleForReceipt.total.toLocaleString('es-CO')} COP</span>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Ticket</span>
              </button>

              <a
                href={generateWhatsAppMessage(selectedSaleForReceipt)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
