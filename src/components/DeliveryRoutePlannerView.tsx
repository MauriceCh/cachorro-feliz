import React, { useState } from 'react';
import { 
  Sale, 
  OrderStatus 
} from '../types';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Copy, 
  Check, 
  ExternalLink, 
  ShoppingBag, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Send,
  AlertCircle,
  Car,
  Package
} from 'lucide-react';

interface DeliveryRoutePlannerViewProps {
  sales: Sale[];
  onUpdateSaleStatus: (saleId: string, status: OrderStatus, trackingCode?: string, deliveryPerson?: string) => void;
}

export const DeliveryRoutePlannerView: React.FC<DeliveryRoutePlannerViewProps> = ({
  sales,
  onUpdateSaleStatus
}) => {
  const [originAddress, setOriginAddress] = useState<string>('Bogotá, Colombia');
  const [selectedSaleIds, setSelectedSaleIds] = useState<string[]>([]);
  const [copiedSaleId, setCopiedSaleId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('Pendientes_Y_Listos');

  // Filter sales that require delivery
  const deliverySales = sales.filter(s => {
    const isPickup = s.deliveryType === 'Recogida Personal';
    if (isPickup) return false;

    if (filterStatus === 'Pendientes_Y_Listos') {
      return s.status === 'Pendiente' || s.status === 'En Preparación' || s.status === 'Listo';
    }
    if (filterStatus === 'Enviados') {
      return s.status === 'Enviado';
    }
    if (filterStatus === 'Todos') {
      return true;
    }
    return s.status === filterStatus;
  });

  const toggleSelectSale = (id: string) => {
    if (selectedSaleIds.includes(id)) {
      setSelectedSaleIds(selectedSaleIds.filter(item => item !== id));
    } else {
      setSelectedSaleIds([...selectedSaleIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSaleIds.length === deliverySales.length) {
      setSelectedSaleIds([]);
    } else {
      setSelectedSaleIds(deliverySales.map(s => s.id));
    }
  };

  // Generate Google Maps multi-destination URL
  const generateGoogleMapsUrl = () => {
    const selectedSales = sales.filter(s => selectedSaleIds.includes(s.id));
    if (selectedSales.length === 0) return '';

    const origin = encodeURIComponent(originAddress);
    const waypoints = selectedSales.map(s => encodeURIComponent(`${s.shippingAddress}, ${s.neighborhoodZone || 'Bogotá'}`));
    
    if (waypoints.length === 1) {
      return `https://www.google.com/maps/dir/${origin}/${waypoints[0]}`;
    }

    const destination = waypoints[waypoints.length - 1];
    const intermediateWaypoints = waypoints.slice(0, waypoints.length - 1).join('|');

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${intermediateWaypoints}&travelmode=driving`;
  };

  // Copy data formatted for Picap / Yango Moto / Interrapidísimo
  const handleCopyCourierInfo = (sale: Sale, courierType: 'moto' | 'interrapidisimo') => {
    let text = '';
    if (courierType === 'moto') {
      text = `📦 *ENTREGA DOMICILIO CACHORRO FELIZ*\n👤 Destinatario: ${sale.clientName}\n📱 Teléfono: ${sale.clientPhone || '3205714504'}\n📍 Dirección: ${sale.shippingAddress} ${sale.neighborhoodZone ? `(${sale.neighborhoodZone})` : ''}\n📝 Pedido: ${sale.saleNumber} ${sale.petName ? `(Para mascota: ${sale.petName})` : ''}\n💵 Cobro al recibir: ${sale.paymentMethod === 'Contraentrega' ? `$${sale.total.toLocaleString('es-CO')} COP` : 'PAGADO (Solo entregar)'}\n📌 Notas: ${sale.notes || 'Entregar con cuidado paquete de alimentos caninos'}`;
    } else {
      text = `📦 *DATOS PARA GUÍA INTERRAPIDÍSIMO / ENCOMIENDA NACIONAL*\nDestinatario: ${sale.clientName}\nTeléfono: ${sale.clientPhone || '3205714504'}\nCiudad/Municipio: ${sale.neighborhoodZone || 'Fuera de Bogotá'}\nDirección de Entrega: ${sale.shippingAddress}\nContenido: Alimentos y snacks deshidratados para mascotas\nValor Declarado: $${sale.total.toLocaleString('es-CO')}\nObservaciones: ${sale.notes || 'Paquete sellado de alimentos'}`;
    }

    navigator.clipboard.writeText(text);
    setCopiedSaleId(sale.id);
    setTimeout(() => setCopiedSaleId(null), 2500);
  };

  // Generate WhatsApp 'En Camino' message for client
  const generateEnCaminoWhatsApp = (sale: Sale) => {
    const text = `¡Hola ${sale.clientName}! 🐾🛵\nTe contamos que tu pedido *${sale.saleNumber}* ${sale.petName ? `para *${sale.petName}*` : ''} ¡ya va en camino hacia tu dirección!\n\n📍 *Dirección:* ${sale.shippingAddress}\n💰 *Total a pagar:* ${sale.paymentMethod === 'Contraentrega' ? `$${sale.total.toLocaleString('es-CO')} COP` : 'Pagado con anticipación'}\n\n¡Atento al timbre o llamada! Gracias por consentir a tu mejor amigo con Cachorro Feliz. ❤️`;
    
    const phone = sale.clientPhone ? sale.clientPhone.replace(/\D/g, '') : '';
    const phoneParam = phone.length >= 10 ? `phone=57${phone}&` : '';
    return `https://api.whatsapp.com/send?${phoneParam}text=${encodeURIComponent(text)}`;
  };

  const mapsUrl = generateGoogleMapsUrl();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-[#E0D7C6] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#2D463E] font-display flex items-center space-x-2">
            <Navigation className="w-6 h-6 text-[#EF8828]" />
            <span>Planificador de Rutas & Despachos (Bogotá & Alrededores)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organiza tus entregas diarias en tu vehículo, genera rutas multiparada en Google Maps y despacha por Picap o Interrapidísimo.
          </p>
        </div>

        {selectedSaleIds.length > 0 && mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#EF8828] hover:bg-[#d6761f] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center space-x-2 transition-all cursor-pointer animate-pulse"
          >
            <MapPin className="w-4 h-4" />
            <span>Abrir Ruta en Google Maps ({selectedSaleIds.length} paradas)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Origin Configuration & Route Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Origin Setup */}
        <div className="bg-white p-4 rounded-xl border border-[#E0D7C6] shadow-sm space-y-2">
          <label className="block text-xs font-bold text-[#2D463E] flex items-center space-x-1">
            <Car className="w-4 h-4 text-[#EF8828]" />
            <span>Punto de Partida (Cocina / Taller)</span>
          </label>
          <input
            type="text"
            value={originAddress}
            onChange={e => setOriginAddress(e.target.value)}
            placeholder="Ej: Calle 140 # 15-20, Bogotá"
            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF8828]"
          />
          <p className="text-[11px] text-slate-400">
            Punto desde donde inicias el recorrido de entregas.
          </p>
        </div>

        {/* Quick Route Summary Card */}
        <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-900 flex items-center justify-between">
              <span>Paradas Seleccionadas</span>
              <span className="bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full text-[11px]">
                {selectedSaleIds.length} de {deliverySales.length}
              </span>
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              {selectedSaleIds.length === 0 
                ? 'Selecciona los pedidos en la tabla inferior para armar tu ruta.' 
                : `Ruta lista con ${selectedSaleIds.length} entregas programadas.`}
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={handleSelectAll}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              {selectedSaleIds.length === deliverySales.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </button>
          </div>
        </div>

        {/* Fast Action / Delivery Channels */}
        <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-amber-900 flex items-center space-x-1">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>Canales de Entrega Habituales</span>
          </div>
          <div className="text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span>🚗 <b>Vehículo Propio:</b> Rutas locales</span>
              <span className="text-amber-800 font-bold">Maps</span>
            </div>
            <div className="flex items-center justify-between">
              <span>🛵 <b>Picap / Yango:</b> Entregas express</span>
              <span className="text-amber-800 font-bold">1-Clic Copy</span>
            </div>
            <div className="flex items-center justify-between">
              <span>📦 <b>Encomienda:</b> Fuera de Bogotá / Nacional</span>
              <span className="text-amber-800 font-bold">Guía</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E0D7C6] pb-2">
        <button
          onClick={() => setFilterStatus('Pendientes_Y_Listos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'Pendientes_Y_Listos'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D7C6]'
          }`}
        >
          Pendientes & Listos para Despacho
        </button>
        <button
          onClick={() => setFilterStatus('Enviados')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'Enviados'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D7C6]'
          }`}
        >
          En Camino / Enviados
        </button>
        <button
          onClick={() => setFilterStatus('Todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'Todos'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D7C6]'
          }`}
        >
          Todos los Domicilios
        </button>
      </div>

      {/* Delivery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliverySales.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl border border-[#E0D7C6] text-center text-slate-400">
            <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-sm">No hay pedidos de domicilio con los filtros seleccionados.</p>
            <p className="text-xs text-slate-400 mt-1">Registra nuevos pedidos desde el módulo de ventas.</p>
          </div>
        ) : (
          deliverySales.map((sale) => {
            const isSelected = selectedSaleIds.includes(sale.id);
            const isOutsideBogota = (sale.neighborhoodZone || sale.shippingAddress || '').toLowerCase().includes('fuera') ||
                                   (sale.neighborhoodZone || sale.shippingAddress || '').toLowerCase().includes('nacional') ||
                                   (sale.neighborhoodZone || sale.shippingAddress || '').toLowerCase().includes('cundinamarca');

            return (
              <div 
                key={sale.id}
                className={`bg-white rounded-xl border transition-all p-4 flex flex-col justify-between shadow-xs ${
                  isSelected 
                    ? 'border-[#EF8828] ring-2 ring-[#EF8828]/20 bg-amber-50/10' 
                    : 'border-[#E0D7C6] hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Bar: Selector & Order Number */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectSale(sale.id)}
                        className="w-4 h-4 text-[#EF8828] rounded border-slate-300 focus:ring-[#EF8828] cursor-pointer"
                      />
                      <span className="font-bold text-[#2D463E] text-xs font-display">
                        {sale.saleNumber}
                      </span>
                    </label>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sale.status === 'Entregado' ? 'bg-emerald-100 text-emerald-800' :
                      sale.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                      sale.status === 'Listo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {sale.status}
                    </span>
                  </div>

                  {/* Client & Pet */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-800 text-sm">{sale.clientName}</div>
                      {sale.petName && (
                        <span className="text-[10px] font-semibold text-[#EF8828] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          🐾 {sale.petName}
                        </span>
                      )}
                    </div>

                    {/* Address & Zone */}
                    <div className="flex items-start space-x-1.5 text-xs text-slate-600 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-[#EF8828] shrink-0 mt-0.5" />
                      <div className="font-medium">
                        <div>{sale.shippingAddress}</div>
                        {sale.neighborhoodZone && (
                          <div className="text-[11px] text-slate-400 font-normal">
                            Zona / Barrio: <span className="font-semibold text-slate-600">{sale.neighborhoodZone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items & Total */}
                    <div className="bg-[#F9F7F4] p-2.5 rounded-lg border border-[#E0D7C6]/60 mt-3 text-xs">
                      <div className="text-slate-500 font-semibold text-[10px] uppercase">Productos a Entregar:</div>
                      <div className="space-y-0.5 mt-1">
                        {sale.items.map((it, idx) => (
                          <div key={idx} className="text-slate-700 flex justify-between">
                            <span>• {it.quantity}x {it.productName}</span>
                            <span className="font-bold">${it.subtotal.toLocaleString('es-CO')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-[#E0D7C6]/40 font-bold text-slate-900">
                        <span>Total (con envío):</span>
                        <span className="text-[#2D463E]">${sale.total.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                        <span>Pago: {sale.paymentMethod || 'Daviplata/Nequi'}</span>
                        <span className="font-semibold text-emerald-700">
                          {sale.paymentMethod === 'Contraentrega' ? '⚠️ Cobrar al entregar' : '✅ Pagado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Copy for Courier */}
                    <button
                      onClick={() => handleCopyCourierInfo(sale, isOutsideBogota ? 'interrapidisimo' : 'moto')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      title="Copiar datos en formato listo para pegar en Picap, Yango o Interrapidísimo"
                    >
                      {copiedSaleId === sale.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>{isOutsideBogota ? 'Copiar Guía Nacional' : 'Copiar Domicilio Local'}</span>
                        </>
                      )}
                    </button>

                    {/* WhatsApp 'En Camino' Alert */}
                    <a
                      href={generateEnCaminoWhatsApp(sale)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      title="Avisar al cliente por WhatsApp que su pedido ya va en camino"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Avisar WhatsApp</span>
                    </a>
                  </div>

                  {/* Status Dropdown Quick Change */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Cambiar Estado:</span>
                    <select
                      value={sale.status}
                      onChange={e => onUpdateSaleStatus(sale.id, e.target.value as OrderStatus)}
                      className="text-[11px] font-bold px-2 py-1 border border-slate-200 rounded-md focus:outline-none cursor-pointer"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Preparación">En Preparación</option>
                      <option value="Listo">Listo para entrega</option>
                      <option value="Enviado">Enviado / En ruta</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

