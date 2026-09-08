import React, { useRef, useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ChefHat, 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign, 
  PlusCircle, 
  Sparkles,
  ShoppingBasket,
  Palette,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Navigation,
  ExternalLink,
  Store,
  Lock,
  KeyRound,
  Database
} from 'lucide-react';
import { BrandLogoEmblem } from './BrandLogoEmblem';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewSale: () => void;
  onOpenNewBatch: () => void;
  onOpenNewPurchase: () => void;
  onOpenAiAssistant: () => void;
  onOpenPublicStore?: () => void;
  onLockAdmin?: () => void;
  onChangePin?: () => void;
  onOpenDatabaseReset?: () => void;
  lowStockCount: number;
  upcomingBirthdaysCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewSale,
  onOpenNewBatch,
  onOpenNewPurchase,
  onOpenAiAssistant,
  onOpenPublicStore,
  onLockAdmin,
  onChangePin,
  onOpenDatabaseReset,
  lowStockCount,
  upcomingBirthdaysCount
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Resumen', icon: TrendingUp },
    { id: 'sales', label: 'Ventas y Pedidos', icon: ShoppingBag },
    { id: 'routes', label: 'Rutas & Despacho 🗺️', icon: Navigation },
    { id: 'production', label: 'Producción y Recetas', icon: ChefHat },
    { id: 'inventory', label: 'Inventarios y Mermas', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null },
    { id: 'purchases', label: 'Compras y Proveedores', icon: ShoppingBasket },
    { id: 'clients', label: 'Clientes y Mascotas', icon: Users, badge: upcomingBirthdaysCount > 0 ? `${upcomingBirthdaysCount} 🎂` : null },
    { id: 'finances', label: 'Finanzas y Costos Fijos', icon: DollarSign },
    { id: 'brand', label: 'Etiquetas & Marca', icon: Palette },
    { id: 'ai-studio', label: 'Agentes IA 🤖', icon: Sparkles }
  ];

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Auto-scroll into view when active tab changes
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const activeBtn = el.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -250 : 250;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#334c5c] text-white shadow-md border-b-2 border-[#f8b46b]">
      {/* Top Branding Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3 border-b border-white/10">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <BrandLogoEmblem variant="main" size="sm" />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold tracking-wider text-[#f8b46b] font-bebas leading-none">
                    CACHORRO FELIZ
                  </h1>
                  <span className="bg-[#f8b46b]/20 border border-[#f8b46b]/60 text-[#f8b46b] text-[10px] px-2 py-0.5 rounded font-bold tracking-wider font-sans">
                    SNACKS ORGÁNICOS
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-sans flex items-center space-x-2 mt-0.5">
                  <span className="hidden sm:inline">Alimentos Saludables • Deshidratados • Galletas</span>
                  <span className="inline-flex items-center space-x-1 text-[10px] bg-white/10 text-amber-200 px-2 py-0.5 rounded-full border border-[#f8b46b]/30 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f8b46b] animate-ping"></span>
                    <span>Sincronizado ☁️</span>
                  </span>
                </p>
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-xl border border-white/20 text-[#f8b46b] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              aria-label="Abrir menú de módulos"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="text-xs font-bold font-bebas tracking-wider">MÓDULOS</span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {onOpenPublicStore && (
              <button
                onClick={onOpenPublicStore}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Ver cómo ven los clientes tu catálogo online y probar pedidos por WhatsApp"
              >
                <Store className="w-4 h-4 text-emerald-200" />
                <span>Tienda Online 🌐</span>
              </button>
            )}

            <button
              onClick={onOpenNewSale}
              className="bg-[#f8b46b] hover:bg-[#e5a057] text-[#334c5c] px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nueva Venta</span>
            </button>

            <button
              onClick={onOpenNewBatch}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all border border-white/15 cursor-pointer"
            >
              <ChefHat className="w-4 h-4 text-[#f8b46b]" />
              <span>Nuevo Lote</span>
            </button>

            <button
              onClick={onOpenNewPurchase}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all border border-white/15 cursor-pointer"
            >
              <ShoppingBasket className="w-4 h-4 text-emerald-200" />
              <span>Registrar Compra</span>
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="bg-[#f8b46b]/20 hover:bg-[#f8b46b]/30 text-[#f8b46b] border border-[#f8b46b]/50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#f8b46b] animate-pulse" />
              <span>Asistente IA</span>
            </button>

            {onChangePin && (
              <button
                onClick={onChangePin}
                className="bg-amber-900/30 hover:bg-amber-900/50 text-amber-200 border border-amber-700/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Cambiar PIN de seguridad"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#f8b46b]" />
                <span className="hidden sm:inline">Clave PIN</span>
              </button>
            )}

            {onOpenDatabaseReset && (
              <button
                onClick={onOpenDatabaseReset}
                className="bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-600/50 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Gestión y reseteo de Base de Datos"
              >
                <Database className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Base de Datos</span>
              </button>
            )}

            {onLockAdmin && (
              <button
                onClick={onLockAdmin}
                className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border border-rose-800/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Bloquear panel y salir a la Tienda Pública"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Drawer for Instant Access on Small Screens */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-b border-white/15 bg-[#273a46]/98 rounded-b-2xl px-3 my-2 shadow-2xl space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#f8b46b] font-bold uppercase tracking-wider block">
                Seleccionar Módulo de Gestión:
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white text-[11px] p-1"
              >
                Cerrar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#f8b46b] text-[#334c5c] font-bold shadow-md'
                        : 'bg-white/5 text-slate-200 hover:bg-white/15 border border-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                        isActive ? 'bg-[#334c5c] text-white' : 'bg-[#f8b46b] text-[#334c5c]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Navigation Menu with Navigation Arrows & Touch Scrolling */}
        <div className="relative flex items-center py-2">
          {/* Left Arrow Button */}
          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              aria-label="Desplazar menú a la izquierda"
              className="absolute left-0 z-20 bg-[#334c5c]/95 hover:bg-[#273a46] text-[#f8b46b] p-1.5 rounded-full border border-[#f8b46b]/60 shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur-xs flex items-center justify-center -ml-2"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          {/* Scrollable Tabs Track */}
          <nav
            ref={scrollContainerRef}
            className="flex space-x-1.5 overflow-x-auto py-1 scroll-smooth touch-pan-x select-none w-full scrollbar-thin scrollbar-thumb-[#f8b46b]/50 scrollbar-track-transparent px-1"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#f8b46b transparent',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  data-tab={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#f8b46b] text-[#334c5c] font-bold shadow-md scale-102 ring-2 ring-[#f8b46b]/50'
                      : 'text-slate-200 hover:bg-white/15 hover:text-white bg-white/5 border border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#334c5c] text-white' : 'bg-[#f8b46b] text-[#334c5c]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Arrow Button */}
          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              aria-label="Desplazar menú a la derecha"
              className="absolute right-0 z-20 bg-[#334c5c]/95 hover:bg-[#273a46] text-[#f8b46b] p-1.5 rounded-full border border-[#f8b46b]/60 shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur-xs flex items-center justify-center -mr-2"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
