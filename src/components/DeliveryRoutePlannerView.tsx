import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Copy, 
  Check, 
  ExternalLink, 
  Truck, 
  Clock, 
  Phone, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  phone: string;
  petName: string;
  zone: 'Norte' | 'Chapinero' | 'Normandía/Occidente' | 'Centro/Sur';
  address: string;
  packages: string;
  totalCOP: number;
  paymentStatus: 'Pagado Nequi' | 'Pagado Daviplata' | 'Contraentrega';
  deliverySlot: string;
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
    deliverySlot: '2:00 PM - 4:00 PM',
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
    deliverySlot: '3:30 PM - 5:30 PM',
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
    deliverySlot: '1:30 PM - 2:30 PM',
    notes: 'Tiene billete de $100.000, llevar $32.000 de cambio.'
  },
  {
    id: 'del-4',
    orderNumber: '#CF-1085',
    clientName: 'Felipe Duarte',
    phone: '+57 315 620 9911',
    petName: 'Max (Bulldog Francés)',
    zone: 'Chapinero',
    address: 'Cra 7 # 54-80 Torre A Apto 804',
    packages: '1x Res 500g, 1x Galletas 250g',
    totalCOP: 120000,
    paymentStatus: 'Pagado Nequi',
    deliverySlot: '4:00 PM - 6:00 PM',
    notes: 'Entregar antes de las 6:00 PM.'
  }
];

export const DeliveryRoutePlannerView: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>(INITIAL_DELIVERIES);
  const [selectedZone, setSelectedZone] = useState<string>('Todas');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dirección base del taller del Chef Javier
  const originAddress = 'Cra 73 # 48-43, Normandía, Bogotá, Colombia';

  const filteredDeliveries = selectedZone === 'Todas'
    ? deliveries
    : deliveries.filter(d => d.zone === selectedZone);

  // Copiar formato listo para Picap / Domiciliario
  const copyForMessenger = (order: DeliveryOrder) => {
    const text = `📦 SERVICIO PICAP / REPARTO CACHORRO FELIZ\n` +
      `----------------------------------------\n` +
      `📍 RECOGER EN: Cra 73 # 48-43, Normandía (Taller Chef Javier)\n` +
      `📍 DESTINO: ${order.address} (${order.zone})\n` +
      `👤 RECIBE: ${order.clientName} (Mascota: ${order.petName})\n` +
      `📞 CONTACTO: ${order.phone}\n` +
      `🛍️ PAQUETE: ${order.packages}\n` +
      `💵 ESTADO PAGO: ${order.paymentStatus}\n` +
      `📝 NOTAS: ${order.notes}\n`;

    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Abrir ruta completa en Google Maps
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
    <div className="space-y-6 font-sans">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-2">
            <Truck className="w-3.5 h-3.5" /> Logística & Envíos Bogotá
          </span>
          <h2 className="text-2xl font-black text-[#334c5c]">
            Planificador de Rutas & Despachos
          </h2>
          <p className="text-xs text-gray-500">
            Punto de Partida: <strong>Normandía (Cra 73 # 48-43)</strong>. Enrutamiento optimizado para entregas rápidas.
          </p>
        </div>

        <button
          onClick={openGoogleMapsRoute}
          className="flex items-center gap-2 bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition active:scale-95"
        >
          <Navigation className="w-4 h-4 text-[#f8b46b]" />
          Abrir Ruta Completa en Google Maps
        </button>
      </div>

      {/* Selector de Zonas */}
      <div className="flex flex-wrap items-center gap-2">
        {['Todas', 'Normandía/Occidente', 'Chapinero', 'Norte', 'Centro/Sur'].map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
              selectedZone === zone
                ? 'bg-[#334c5c] text-white border-2 border-[#f8b46b]'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {zone} ({zone === 'Todas' ? deliveries.length : deliveries.filter(d => d.zone === zone).length})
          </button>
        ))}
      </div>

      {/* Lista de Pedidos en Ruta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeliveries.map((order, index) => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-[#334c5c] transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#f8b46b] text-[#334c5c] font-black text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-extrabold text-sm text-[#334c5c]">{order.orderNumber}</span>
                  <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
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
                <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#ff7043] flex-shrink-0" />
                  {order.address}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  {order.phone}
                </p>
              </div>

              <div className="bg-[#fbf9f6] p-3 rounded-xl border border-gray-100 space-y-1">
                <p className="text-[11px] font-bold text-[#334c5c] uppercase">Paquete:</p>
                <p className="text-xs text-gray-700 font-medium">{order.packages}</p>
                {order.notes && (
                  <p className="text-[11px] text-amber-700 italic pt-1">
                    Nota: {order.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total a Cobrar</span>
                <span className="text-base font-black text-[#334c5c]">
                  ${order.totalCOP.toLocaleString('es-CO')} COP
                </span>
              </div>

              <button
                onClick={() => copyForMessenger(order)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  copiedId === order.id
                    ? 'bg-green-600 text-white'
                    : 'bg-[#f5f3f0] hover:bg-gray-200 text-[#334c5c]'
                }`}
              >
                {copiedId === order.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copiado para Picap
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar para Domicilio
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
📂 Paso 2: Actualizar src/App.tsx (Enlazar Rutas & Producción juntos)
Para que ambos módulos queden conectados sin enredos de código, abre src/App.tsx en GitHub (github.dev), reemplázalo por completo con este código y guarda (Ctrl + S):

import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  ShoppingBag, 
  Package, 
  MapPin, 
  Users, 
  DollarSign, 
  Bot, 
  Tag, 
  Settings, 
  LogOut, 
  Lock, 
  Printer, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

import PublicStoreView from './components/PublicStoreView';
import ProductionView from './components/ProductionView';
import DeliveryRoutePlannerView from './components/DeliveryRoutePlannerView';

export const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setShowPinModal(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '0000') {
      setIsAdmin(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('PIN incorrecto. Intenta de nuevo.');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    window.location.hash = '';
    setCurrentModule('dashboard');
  };

  if (!isAdmin) {
    return (
      <div className="relative">
        <header className="bg-[#334c5c] text-white py-3 px-4 sm:px-8 flex items-center justify-between border-b border-[#f8b46b]/40">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => {
              window.location.hash = 'admin';
              setShowPinModal(true);
            }}
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#f8b46b] overflow-hidden bg-white p-0.5">
              <img 
                src="/brand/LOGO%20DEFINITVO%20CACHORRO.png" 
                alt="Logo Cachorro Feliz" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/brand/LOGO%20DEFINITVO%20GALLETAS.jpg';
                }}
              />
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-base sm:text-lg block leading-none text-[#f8b46b]">
                CACHORRO FELIZ
              </span>
              <span className="text-[10px] text-gray-300 uppercase tracking-widest">
                Snacks Orgánicos Premium
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://api.whatsapp.com/send?phone=573205714504" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transition"
            >
              📲 WhatsApp Directo
            </a>
            <button
              onClick={() => setShowPinModal(true)}
              className="text-xs text-gray-300 hover:text-white bg-[#22333e] px-2.5 py-1 rounded-lg border border-gray-700 transition"
              title="Acceso Taller del Chef"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <PublicStoreView />

        {showPinModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-[#334c5c]">
              <div className="w-16 h-16 bg-[#334c5c] text-[#f8b46b] rounded-full mx-auto flex items-center justify-center mb-4 shadow-md">
                <ChefHat className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-[#334c5c]">Acceso Taller del Chef</h3>
              <p className="text-xs text-gray-500 mt-1 mb-5">
                Ingresa el PIN de seguridad de 4 dígitos para acceder al panel de gestión de Cachorro Feliz.
              </p>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-40 text-center tracking-[1em] text-2xl font-bold py-2 border-2 border-[#334c5c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f8b46b] mx-auto block"
                />

                {pinError && (
                  <p className="text-xs font-bold text-red-500">{pinError}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPinModal(false);
                      setPinError('');
                      window.location.hash = '';
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#334c5c] hover:bg-[#283c49] text-white shadow-md transition"
                  >
                    Ingresar al Panel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Resumen Taller', icon: ChefHat },
    { id: 'produccion', label: 'Producción & Mermas', icon: Package },
    { id: 'rutas', label: 'Rutas & Despachos', icon: MapPin },
    { id: 'crm', label: 'CRM Clientes & Mascotas', icon: Users },
    { id: 'finanzas', label: 'Finanzas & Rentabilidad', icon: DollarSign },
    { id: 'etiquetas', label: 'Diseñador de Etiquetas', icon: Tag },
    { id: 'ia', label: 'Asistente IA (Gemini)', icon: Bot },
    { id: 'impresion', label: 'Rótulos Térmicos', icon: Printer },
  ];

  return (
    <div className="min-h-screen bg-[#f5f3f0] flex flex-col font-sans">
      <header className="bg-[#334c5c] text-white px-4 sm:px-6 py-3 shadow-md flex items-center justify-between border-b-2 border-[#f8b46b] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-[#273a46] text-[#f8b46b]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="w-9 h-9 rounded-full border-2 border-[#f8b46b] overflow-hidden bg-white p-0.5">
            <img 
              src="/brand/LOGO%20DEFINITVO%20CACHORRO.png" 
              alt="Oreo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/brand/LOGO%20DEFINITVO%20GALLETAS.jpg';
              }}
            />
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wide leading-none text-[#f8b46b]">
              PANEL DEL CHEF JAVIER
            </h1>
            <span className="text-[10px] text-gray-300 uppercase tracking-wider">
              Taller & Obrador Cachorro Feliz
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdmin(false)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-[#f8b46b] hover:bg-[#e29d53] text-[#334c5c] px-3 py-1.5 rounded-xl shadow-sm transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Ver Tienda Pública
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden md:flex flex-col w-64 bg-[#2b404e] text-white p-4 space-y-2 border-r border-[#334c5c]/40">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1">
            Módulos del Taller
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentModule(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                  active 
                    ? 'bg-[#f8b46b] text-[#334c5c] shadow-sm' 
                    : 'text-gray-200 hover:bg-[#334c5c]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-6 mt-auto border-t border-gray-600/50 text-[11px] text-gray-400 px-3 space-y-1">
            <p className="font-bold text-gray-300">Bogotá, Normandía</p>
            <p>Salida: Cra 73 # 48-43</p>
            <p className="text-[10px] text-[#f8b46b]">Oreo C.E.O. Activo 🐾</p>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div 
              className="w-64 bg-[#2b404e] text-white h-full p-4 space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f8b46b]">Módulos</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentModule(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      currentModule === item.id 
                        ? 'bg-[#f8b46b] text-[#334c5c]' 
                        : 'text-gray-200 hover:bg-[#334c5c]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Contenido Dinámico según el módulo seleccionado */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {currentModule === 'produccion' && <ProductionView />}

            {currentModule === 'rutas' && <DeliveryRoutePlannerView />}

            {currentModule === 'dashboard' && (
              <>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-2.5 py-0.5 rounded-full">
                      Módulo Operativo Activo
                    </span>
                    <h2 className="text-2xl font-black text-[#334c5c] mt-1">
                      Resumen Taller del Chef
                    </h2>
                    <p className="text-xs text-gray-500">
                      Control integral de formulaciones artesanales, costos e inventario.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsAdmin(false)}
                      className="text-xs font-bold text-[#334c5c] border border-[#334c5c] hover:bg-gray-50 px-3.5 py-2 rounded-xl transition"
                    >
                      Ir a Tienda Clientes
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block uppercase">Pedidos Hoy</span>
                    <span className="text-2xl font-black text-[#334c5c]">12 pedidos</span>
                    <span className="text-[11px] text-green-600 font-bold block mt-1">✓ 100% WhatsApp listos</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block uppercase">Producción Galletas</span>
                    <span className="text-2xl font-black text-[#f8b46b]">4.8 kg horneados</span>
                    <span className="text-[11px] text-gray-500 block mt-1">Lote #2024-BOG-04</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block uppercase">Deshidratados Res/Pollo</span>
                    <span className="text-2xl font-black text-[#ff7043]">6.2 kg en deshidratador</span>
                    <span className="text-[11px] text-gray-500 block mt-1">Merma estimada: ~65%</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block uppercase">Margen Promedio</span>
                    <span className="text-2xl font-black text-[#7cb342]">68.4%</span>
                    <span className="text-[11px] text-gray-500 block mt-1">Punto de equilibrio superado</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-base font-bold text-[#334c5c] mb-3">
                    🐾 Estado del Obrador de Normandía
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Bienvenido de nuevo, <strong>Chef Javier</strong>. Selecciona en el menú lateral <strong>"Producción & Mermas"</strong> para costeo y lotes, o <strong>"Rutas & Despachos"</strong> para despachar con Google Maps y Picap.
                  </p>
                </div>
              </>
            )}

            {currentModule !== 'dashboard' && currentModule !== 'produccion' && currentModule !== 'rutas' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center space-y-3">
                <h3 className="text-lg font-black text-[#334c5c]">
                  Módulo en proceso de carga
                </h3>
                <p className="text-xs text-gray-500">
                  Estamos integrando los módulos paso a paso. Haz clic en <strong>Producción & Mermas</strong> o <strong>Rutas & Despachos</strong> para ver los ya activos.
                </p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
export default App;