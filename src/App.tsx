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
  LogOut, 
  Lock, 
  Printer, 
  Menu,
  X,
  Compass,
  Boxes
} from 'lucide-react';

import PublicStoreView from './components/PublicStoreView';
import ProductionView from './components/ProductionView';
import DeliveryRoutePlannerView from './components/DeliveryRoutePlannerView';
import ClientsPetsView from './components/ClientsPetsView';
import InventoryPurchasesView from './components/InventoryPurchasesView';

export const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  
  // Estado del módulo activo: 'dashboard' | 'inventario' | 'produccion' | 'rutas' | 'crm'
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Auto-activar si tiene hash #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.includes('admin')) {
        setShowPinModal(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '0000') {
      setIsAdmin(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('PIN incorrecto. Intenta con 1234');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    window.location.hash = '';
    setCurrentModule('dashboard');
  };

  // 1. TIENDA PÚBLICA PARA CLIENTES
  if (!isAdmin) {
    return (
      <div className="relative">
        <header className="bg-[#334c5c] text-white py-3 px-4 sm:px-8 flex items-center justify-between border-b border-[#f8b46b]/40 sticky top-0 z-50">
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

          <div className="flex items-center gap-3">
            <a 
              href="https://api.whatsapp.com/send?phone=573205714504" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm transition"
            >
              📲 WhatsApp Directo
            </a>
            <button
              onClick={() => setShowPinModal(true)}
              className="text-xs font-bold flex items-center gap-1 text-[#f8b46b] bg-[#22333e] px-3 py-1.5 rounded-xl border border-gray-700 hover:border-[#f8b46b] transition"
              title="Acceso Taller del Chef"
            >
              <Lock className="w-3.5 h-3.5" /> Acceso Chef
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
                Ingresa el PIN de seguridad (por defecto: <strong>1234</strong>)
              </p>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-40 text-center tracking-[0.8em] text-2xl font-bold py-2 border-2 border-[#334c5c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f8b46b] mx-auto block"
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
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#334c5c] hover:bg-[#283c49] text-white shadow-md transition"
                  >
                    Entrar al Panel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. PANEL ADMINISTRATIVO DEL CHEF JAVIER
  const menuItems = [
    { id: 'dashboard', label: 'Resumen Taller', icon: ChefHat },
    { id: 'inventario', label: 'Insumos & Proveedores', icon: Boxes },
    { id: 'produccion', label: 'Producción & Mermas', icon: Package },
    { id: 'rutas', label: 'Rutas & Despachos', icon: MapPin },
    { id: 'crm', label: 'CRM Canino', icon: Users },
    { id: 'finanzas', label: 'Finanzas & P&L', icon: DollarSign },
    { id: 'etiquetas', label: 'Diseñador Etiquetas', icon: Tag },
    { id: 'ia', label: 'Asistente IA (Gemini)', icon: Bot },
    { id: 'impresion', label: 'Rótulos Térmicos', icon: Printer },
  ];

  return (
    <div className="min-h-screen bg-[#f5f3f0] flex flex-col font-sans">
      {/* Barra superior */}
      <header className="bg-[#334c5c] text-white px-4 sm:px-6 py-3 shadow-md flex items-center justify-between border-b-2 border-[#f8b46b] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            type="button"
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
              Normandía (Cra 73 # 48-43) • Oreo C.E.O. 🐾
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsAdmin(false)}
            className="flex items-center gap-1.5 text-xs font-bold bg-[#f8b46b] hover:bg-[#e29d53] text-[#334c5c] px-3 py-1.5 rounded-xl shadow-sm transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Ver</span> Tienda
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </header>

      {/* Tabs superiores */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-2 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline">
          Navegación:
        </span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentModule(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#334c5c] text-[#f8b46b] shadow-sm border border-[#f8b46b]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Contenedor Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-[#2b404e] text-white p-4 space-y-1.5 border-r border-[#334c5c]/40">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 mb-1">
            Módulos del Taller
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentModule(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                  isActive 
                    ? 'bg-[#f8b46b] text-[#334c5c] shadow-md font-black' 
                    : 'text-gray-200 hover:bg-[#334c5c]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-6 mt-auto border-t border-gray-600/50 text-[11px] text-gray-400 px-3 space-y-1">
            <p className="font-bold text-gray-200">Taller Central Normandía</p>
            <p className="text-gray-400">Cra 73 # 48-43, Bogotá</p>
            <p className="text-[10px] text-[#f8b46b] font-semibold">Despachos diarios activos 🛵</p>
          </div>
        </aside>

        {/* Menú Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div 
              className="w-64 bg-[#2b404e] text-white h-full p-4 space-y-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f8b46b]">Módulos del Chef</span>
                <button type="button" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentModule(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      isActive 
                        ? 'bg-[#f8b46b] text-[#334c5c] font-black' 
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

        {/* Zona de Renderizado Principal */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* VISTA: MATERIAS PRIMAS & PROVEEDORES */}
            {currentModule === 'inventario' && (
              <div className="space-y-4">
                <InventoryPurchasesView />
              </div>
            )}

            {/* VISTA: PRODUCCIÓN Y MERMAS */}
            {currentModule === 'produccion' && (
              <div className="space-y-4">
                <ProductionView />
              </div>
            )}

            {/* VISTA: RUTAS Y DESPACHOS BOGOTÁ */}
            {currentModule === 'rutas' && (
              <div className="space-y-4">
                <DeliveryRoutePlannerView />
              </div>
            )}

            {/* VISTA: CRM CANINO */}
            {currentModule === 'crm' && (
              <div className="space-y-4">
                <ClientsPetsView />
              </div>
            )}

            {/* VISTA: DASHBOARD / RESUMEN */}
            {currentModule === 'dashboard' && (
              <>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-2.5 py-0.5 rounded-full inline-block">
                      Módulo Operativo Activo
                    </span>
                    <h2 className="text-2xl font-black text-[#334c5c] mt-1">
                      Resumen General del Taller
                    </h2>
                    <p className="text-xs text-gray-500">
                      Inventario de materias primas con alertas, recetas, rutas de despacho y CRM.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button 
                      type="button"
                      onClick={() => setCurrentModule('inventario')}
                      className="text-xs font-black bg-[#ff7043] text-white hover:bg-[#f4511e] px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
                    >
                      <Boxes className="w-3.5 h-3.5" /> Ver Insumos & Alertas
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCurrentModule('produccion')}
                      className="text-xs font-bold bg-[#334c5c] text-[#f8b46b] hover:bg-[#273a46] px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5" /> Producción & Mermas
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block uppercase">Pedidos Hoy</span>
                    <span className="text-2xl font-black text-[#334c5c]">12 pedidos</span>
                    <span className="text-[11px] text-green-600 font-bold block mt-1">✓ Listos para despacho</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block uppercase">Insumos Críticos</span>
                    <span className="text-2xl font-black text-[#ff7043]">3 en alerta</span>
                    <span className="text-[11px] text-red-600 font-bold block mt-1">Requiere pedido hoy</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block uppercase">Deshidratados Res/Pollo</span>
                    <span className="text-2xl font-black text-[#334c5c]">6.2 kg en ciclo</span>
                    <span className="text-[11px] text-gray-500 block mt-1">Merma estimada: ~65%</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block uppercase">Margen Promedio</span>
                    <span className="text-2xl font-black text-[#7cb342]">68.4%</span>
                    <span className="text-[11px] text-gray-500 block mt-1">Rentabilidad asegurada</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-base font-bold text-[#334c5c] mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#f8b46b]" /> Atajos Operativos del Chef
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Selecciona a dónde deseas dirigirte hoy en tu taller de Normandía:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentModule('inventario')}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#334c5c] text-left hover:bg-gray-50 transition"
                    >
                      <h4 className="font-bold text-sm text-[#334c5c] flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-[#ff7043]" /> 1. Insumos & Proveedores
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Control de stock mínimo, alarmas y contacto por WhatsApp/Web/Tienda.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentModule('produccion')}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#334c5c] text-left hover:bg-gray-50 transition"
                    >
                      <h4 className="font-bold text-sm text-[#334c5c] flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#f8b46b]" /> 2. Producción & Mermas
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Control de hornos, pesaje crudo vs. terminado y costos de lotes.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentModule('rutas')}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#334c5c] text-left hover:bg-gray-50 transition"
                    >
                      <h4 className="font-bold text-sm text-[#334c5c] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#7cb342]" /> 3. Rutas & Despachos
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Rutas optimizadas desde Normandía en Google Maps y apps de entrega.
                      </p>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Módulos en preparación */}
            {currentModule !== 'dashboard' && 
             currentModule !== 'inventario' && 
             currentModule !== 'produccion' && 
             currentModule !== 'rutas' && 
             currentModule !== 'crm' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center space-y-3">
                <h3 className="text-lg font-black text-[#334c5c]">
                  Módulo en preparación
                </h3>
                <p className="text-xs text-gray-500">
                  Usa las pestañas superiores para alternar entre <strong>"Insumos & Proveedores"</strong>, <strong>"Producción & Mermas"</strong>, <strong>"Rutas & Despachos"</strong> y <strong>"CRM Canino"</strong>.
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