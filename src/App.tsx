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

export const App: React.FC = () => {
  // Estado de vista actual
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Escuchar si la URL tiene hash #admin para abrir el acceso sigiloso
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

  // Validación de PIN administrativo (por defecto '1234' o '0000')
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

  // 1. SI ES CLIENTE: Mostrar la Tienda Pública Oficial
  if (!isAdmin) {
    return (
      <div className="relative">
        {/* Barra superior de la tienda pública */}
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

        {/* Vista de Tienda Pública */}
        <PublicStoreView />

        {/* Modal PIN */}
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

  // 2. SI ES ADMIN (CHEF JAVIER): Panel Interno del Taller
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
      {/* Cabecera del Panel */}
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

      {/* Contenedor Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
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

        {/* Menú Mobile Drawer */}
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

        {/* Área de Trabajo Dinámica */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* SI SELECCIONAS 'PRODUCCIÓN & MERMAS' -> MUESTRA PRODUCTIONVIEW */}
            {currentModule === 'produccion' ? (
              <ProductionView />
            ) : (
              /* DE LO CONTRARIO -> MUESTRA EL DASHBOARD PRINCIPAL */
              <>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-2.5 py-0.5 rounded-full">
                      Módulo Operativo Activo
                    </span>
                    <h2 className="text-2xl font-black text-[#334c5c] mt-1">
                      {navigationItems.find(i => i.id === currentModule)?.label || 'Resumen Taller'}
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

                {/* Tarjetas de Métricas Rápidas */}
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

                {/* Estado del Taller */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-base font-bold text-[#334c5c] mb-3">
                    🐾 Estado del Obrador de Normandía
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Bienvenido de nuevo, <strong>Chef Javier</strong>. El taller está listo con la formulación oficial de 4 proteínas: 
                    <strong> Galletas de avena y calabaza</strong>, <strong>Deshidratados de Res</strong>, <strong>Pollo campesino</strong> y <strong>Lomo de Cerdo</strong>. 
                    Haz clic en <strong>"Producción & Mermas"</strong> en el menú lateral para calcular mermas y crear lotes.
                  </p>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
export default App;