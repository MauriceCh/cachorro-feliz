import React, { useState } from 'react';
import { 
  Store, 
  ChefHat, 
  Package, 
  Truck, 
  Users, 
  Tag, 
  DollarSign, 
  Boxes, 
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  HeartHandshake,
  ExternalLink
} from 'lucide-react';

// Importación de submódulos del Taller de Normandía
import PublicStoreView from './components/PublicStoreView';
import ProductionView from './components/ProductionView';
import DeliveryRoutePlannerView from './components/DeliveryRoutePlannerView';
import ClientsPetsView from './components/ClientsPetsView';
import { InventoryView } from './components/InventoryView';
import LabelDesignerStickyView from './components/LabelDesignerStickyView';
import FinancesView from './components/FinancesView';

export const App: React.FC = () => {
  // Estado para alternar entre el Taller Administrativo y la Tienda Pública
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true);

  // Pestaña activa dentro del Panel del Chef Javier
  const [activeTab, setActiveTab] = useState<
    'production' | 'delivery' | 'crm' | 'inventory' | 'labels' | 'finances'
  >('finances');

  // Menú móvil responsivo
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Navegación del Taller
  const navItems = [
    {
      id: 'finances',
      label: 'Finanzas & P&L',
      icon: DollarSign,
      badge: 'Nuevo'
    },
    {
      id: 'production',
      label: 'Producción & Mermas',
      icon: ChefHat,
    },
    {
      id: 'delivery',
      label: 'Rutas & Despachos',
      icon: Truck,
    },
    {
      id: 'crm',
      label: 'CRM & Mascotas',
      icon: Users,
    },
    {
      id: 'inventory',
      label: 'Insumos & Inventario',
      icon: Boxes,
    },
    {
      id: 'labels',
      label: 'Diseñador Etiquetas',
      icon: Tag,
    }
  ];

  // Si no está en modo admin, muestra directamente la Tienda Pública de clientes
  if (!isAdminMode) {
    return (
      <div className="relative min-h-screen bg-[#fbf9f6]">
        {/* Barra superior discreta para volver al Panel del Chef */}
        <div className="bg-[#334c5c] text-white px-4 py-2 flex justify-between items-center text-xs">
          <span className="flex items-center gap-1.5 font-medium">
            <Store className="w-3.5 h-3.5 text-[#f8b46b]" /> Vista previa de Tienda para Clientes
          </span>
          <button
            onClick={() => setIsAdminMode(true)}
            className="flex items-center gap-1 bg-[#f8b46b] hover:bg-[#e5a359] text-[#334c5c] font-black px-3 py-1 rounded-lg transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Volver al Taller del Chef
          </button>
        </div>
        <PublicStoreView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0] flex flex-col md:flex-row text-gray-800 font-sans">
      {/* Barra lateral / Sidebar para Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#334c5c] text-white border-r border-[#263a47] shrink-0 min-h-screen">
        {/* Cabecera Sidebar con Identidad */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#f8b46b] flex items-center justify-center text-[#334c5c] font-black text-xl shadow-md">
            🐾
          </div>
          <div>
            <h1 className="font-black text-base text-white tracking-wide leading-tight">
              CACHORRO FELIZ
            </h1>
            <p className="text-[10px] text-[#f8b46b] font-bold uppercase tracking-wider">
              Taller Normandía • Chef Javier
            </p>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#f8b46b] text-[#334c5c] shadow-sm shadow-black/20'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#334c5c]' : 'text-[#f8b46b]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#334c5c] text-[#f8b46b]' : 'bg-[#f8b46b] text-[#334c5c]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pie de la Barra Lateral: Ver Tienda Pública */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setIsAdminMode(false)}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer"
          >
            <Store className="w-4 h-4 text-[#f8b46b]" />
            <span>Ver Tienda Pública</span>
            <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
          </button>

          <div className="text-center pt-2">
            <span className="text-[10px] text-white/50 block">
              Inspirado por Oreo 🐕 • CEO de 4 patas
            </span>
          </div>
        </div>
      </aside>

      {/* Encabezado para Dispositivos Móviles */}
      <div className="md:hidden bg-[#334c5c] text-white p-4 flex justify-between items-center border-b border-[#263a47]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#f8b46b] flex items-center justify-center text-[#334c5c] font-black text-sm">
            🐾
          </div>
          <span className="font-black text-sm tracking-wide">CACHORRO FELIZ</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdminMode(false)}
            className="text-[11px] bg-white/10 px-2.5 py-1.5 rounded-lg text-white font-bold"
          >
            Tienda
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#273a46] text-white p-3 border-b border-black/20 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-[#f8b46b] text-[#334c5c]' : 'text-white/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-[#334c5c] text-[#f8b46b] px-2 py-0.5 rounded-full font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Área de Contenido Central (Donde se evalúa y carga cada módulo) */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {activeTab === 'finances' && <FinancesView />}
        {activeTab === 'production' && <ProductionView />}
        {activeTab === 'delivery' && <DeliveryRoutePlannerView />}
        {activeTab === 'crm' && <ClientsPetsView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'labels' && <LabelDesignerStickyView />}
      </main>
    </div>
  );
};

export default App;