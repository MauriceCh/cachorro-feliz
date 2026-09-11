import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Copy, 
  Check, 
  Truck, 
  Phone
} from 'lucide-react';

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  phone: string;
  petName: string;
  zone: string;
  address: string;
  packages: string;
  totalCOP: number;
  paymentStatus: string;
  notes: string;
}

const INITIAL_DELIVERIES: DeliveryOrder[] = [
  {
    id: 'del-1',
    orderNumber: '#CF-1082',
    clientName: 'Carolina Mendoza',
    phone: '+57 312 458 9012',
    petName: 'Bruno (Golden)',
    zone: 'Chapinero',
    address: 'Calle 67 # 9-24 Apto 302',
    packages: '2x Galletas 250g, 1x Res 100g',
    totalCOP: 86000,
    paymentStatus: 'Pagado Nequi',
    notes: 'Timbre 302. Dejar en portería si no responden.'
  },
  {
    id: 'del-2',
    orderNumber: '#CF-1083',
    clientName: 'Alejandro Restrepo',
    phone: '+57 320 891 4455',
    petName: 'Kira (Beagle)',
    zone: 'Norte',
    address: 'Cra 15 # 134-18 Interior 2',
    packages: '1x Pollo 250g, 1x Cerdo 100g',
    totalCOP: 62000,
    paymentStatus: 'Pagado Daviplata',
    notes: 'Kira sale a recibir el paquete con su tutor.'
  },
  {
    id: 'del-3',
    orderNumber: '#CF-1084',
    clientName: 'Valeria Gómez',
    phone: '+57 310 776 2200',
    petName: 'Simba (Criollo)',
    zone: 'Normandía/Occidente',
    address: 'Calle 53 # 71D-15 Casa 4',
    packages: '2x Galletas 100g, 2x Pollo 100g',
    totalCOP: 68000,
    paymentStatus: 'Contraentrega',
    notes: 'Tiene billete de $100.000, llevar $32.000 de cambio.'
  },
  {
    id: 'del-4',
    orderNumber: '#CF-1085',
    clientName: 'Felipe Duarte',
    phone: '+57 315 620 9911',
    petName: 'Max (Bulldog)',
    zone: 'Chapinero',
    address: 'Cra 7 # 54-80 Torre A Apto 804',
    packages: '1x Res 500g, 1x Galletas 250g',
    totalCOP: 120000,
    paymentStatus: 'Pagado Nequi',
    notes: 'Entregar antes de las 6:00 PM.'
  }
];

export const DeliveryRoutePlannerView: React.FC = () => {
  const [deliveries] = useState<DeliveryOrder[]>(INITIAL_DELIVERIES);
  const [selectedZone, setSelectedZone] = useState<string>('Todas');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const originAddress = 'Cra 73 # 48-43, Normandía, Bogotá, Colombia';

  const filteredDeliveries = selectedZone === 'Todas'
    ? deliveries
    : deliveries.filter(d => d.zone === selectedZone);

  const copyForMessenger = (order: DeliveryOrder) => {
    const text = `📦 SERVICIO REPARTO CACHORRO FELIZ\n` +
      `----------------------------------------\n` +
      `📍 ORIGEN: Cra 73 # 48-43, Normandía (Taller Chef Javier)\n` +
      `📍 DESTINO: ${order.address} (${order.zone})\n` +
      `👤 RECIBE: ${order.clientName} (Mascota: ${order.petName})\n` +
      `📞 TEL: ${order.phone}\n` +
      `🛍️ PEDIDO: ${order.packages}\n` +
      `💵 PAGO: ${order.paymentStatus} - Total: $${order.totalCOP.toLocaleString('es-CO')} COP\n` +
      `📝 NOTAS: ${order.notes}\n`;

    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openGoogleMapsRoute = () => {
    if (filteredDeliveries.length === 0) return;
    const origin = encodeURIComponent(originAddress);
    const destination = encodeURIComponent(filteredDeliveries[filteredDeliveries.length - 1].address + ', Bogotá');
    const waypoints = filteredDeliveries
      .slice(0, -1)
      .map(d => encodeURIComponent(d.address + ', Bogotá'))
      .join('|');

    let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (waypoints) {
      mapsUrl += `&waypoints=${waypoints}`;
    }
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Truck className="w-3.5 h-3.5" /> Logística & Envíos Bogotá
          </span>
          <h2 className="text-2xl font-black text-[#334c5c]">
            Planificador de Rutas & Despachos
          </h2>
          <p className="text-xs text-gray-500">
            Salida Taller: <strong>Normandía (Cra 73 # 48-43)</strong>
          </p>
        </div>

        <button
          onClick={openGoogleMapsRoute}
          className="flex items-center gap-2 bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
        >
          <Navigation className="w-4 h-4" /> Abrir Ruta en Google Maps
        </button>
      </div>

      {/* Filtro de Zonas */}
      <div className="flex flex-wrap gap-2">
        {['Todas', 'Normandía/Occidente', 'Chapinero', 'Norte'].map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              selectedZone === zone
                ? 'bg-[#334c5c] text-white border-2 border-[#f8b46b]'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {zone} ({zone === 'Todas' ? deliveries.length : deliveries.filter(d => d.zone === zone).length})
          </button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeliveries.map((order, index) => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#f8b46b] text-[#334c5c] font-black text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-extrabold text-sm text-[#334c5c]">{order.orderNumber}</span>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {order.zone}
                  </span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  order.paymentStatus === 'Contraentrega'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-base text-gray-900">
                  {order.clientName} <span className="text-xs font-normal text-gray-500">({order.petName})</span>
                </h4>
                <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ff7043] flex-shrink-0" />
                  {order.address}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  {order.phone}
                </p>
              </div>

              <div className="bg-[#fbf9f6] p-3 rounded-xl border border-gray-100 text-xs">
                <p className="font-bold text-[#334c5c] text-[10px] uppercase">Productos:</p>
                <p className="text-gray-700 font-medium">{order.packages}</p>
                {order.notes && (
                  <p className="text-amber-700 italic pt-1 text-[11px]">Nota: {order.notes}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total</span>
                <span className="text-base font-black text-[#334c5c]">
                  ${order.totalCOP.toLocaleString('es-CO')}
                </span>
              </div>

              <button
                onClick={() => copyForMessenger(order)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  copiedId === order.id
                    ? 'bg-green-600 text-white'
                    : 'bg-[#f5f3f0] hover:bg-gray-200 text-[#334c5c]'
                }`}
              >
                {copiedId === order.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar para Picap
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryRoutePlannerView;