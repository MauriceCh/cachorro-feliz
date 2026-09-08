import React, { useState } from 'react';
import { FinishedProduct } from '../types';
import { BrandLogoEmblem } from './BrandLogoEmblem';
import { 
  ShoppingBag, 
  Sparkles, 
  Heart, 
  ChefHat, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Send, 
  Plus, 
  Minus, 
  Trash2, 
  Dog, 
  Calendar, 
  CheckCircle2, 
  Phone, 
  ChevronRight,
  Info,
  X,
  CreditCard,
  Truck,
  Lock
} from 'lucide-react';

interface CartItem {
  product: FinishedProduct;
  quantity: number;
}

interface PublicStoreViewProps {
  finishedProducts: FinishedProduct[];
  onRequestAdmin?: () => void;
}

export const PublicStoreView: React.FC<PublicStoreViewProps> = ({
  finishedProducts,
  onRequestAdmin
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Customer Checkout Form
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [clientZone, setClientZone] = useState<string>('Bogotá');
  const [petName, setPetName] = useState<string>('');
  const [petBirthday, setPetBirthday] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Daviplata' | 'Nequi' | 'Bancolombia' | 'Contraentrega'>('Daviplata');
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Secret Chef Access: Triple click on the logo
  const [secretClicks, setSecretClicks] = useState<number>(0);
  const handleSecretLogoClick = () => {
    const next = secretClicks + 1;
    if (next >= 3) {
      setSecretClicks(0);
      if (onRequestAdmin) onRequestAdmin();
    } else {
      setSecretClicks(next);
      setTimeout(() => setSecretClicks(0), 2000);
    }
  };

  // Cart operations
  const addToCart = (product: FinishedProduct) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Calculations
  const subtotal = (cart || []).reduce((sum, item) => {
    if (!item || !item.product) return sum;
    const price = item.product.salePrice || 0;
    const qty = item.quantity || 0;
    return sum + (price * qty);
  }, 0);
  const isOutside = (clientZone || '').toLowerCase().includes('fuera') || (clientZone || '').toLowerCase().includes('nacional');
  const shippingCost = clientZone === 'Recogida en Taller'
    ? 0
    : isOutside
      ? 14000
      : subtotal >= 65000 ? 0 : 8000;
  const total = subtotal + shippingCost;
  const totalItemsCount = (cart || []).reduce((sum, item) => sum + (item?.quantity || 0), 0);

  // WhatsApp Order Submission
  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega tus snacks favoritos antes de continuar.');
      return;
    }
    if (!clientName || !clientPhone || !clientAddress) {
      alert('Por favor completa tu nombre, teléfono y dirección de entrega.');
      return;
    }

    const itemsText = cart.map(i => `• ${i.quantity}x ${i.product.name} (${i.product.packageSizeGrams}g) - $${(i.product.salePrice * i.quantity).toLocaleString('es-CO')}`).join('\n');
    
    const message = `¡Hola Chef Javier! 🐾 Quiero realizar este pedido de *Cachorro Feliz*:

👤 *Cliente:* ${clientName}
📱 *Teléfono:* ${clientPhone}
📍 *Dirección de Entrega:* ${clientAddress} (${clientZone})
${petName ? `🐶 *Mascota:* ${petName} ${petBirthday ? `(🎂 Cumpleaños: ${petBirthday})` : ''}` : ''}

🛒 *PRODUCTOS SOLICITADOS:*
${itemsText}

${shippingCost === 0 ? '🎁 *Envío:* GRATIS (Por compras mayores a $65.000)' : `📦 *Envío:* $${shippingCost.toLocaleString('es-CO')}`}
💰 *TOTAL A PAGAR:* $${total.toLocaleString('es-CO')} COP

💳 *Método de Pago Preferido:* ${paymentMethod}
${orderNotes ? `📝 *Observaciones:* ${orderNotes}` : ''}

Quedo atento(a) para confirmar la transferencia. ¡Muchas gracias! ❤️`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=573205714504&text=${encoded}`, '_blank');
  };

  const productList = Array.isArray(finishedProducts) && finishedProducts.length > 0 
    ? finishedProducts 
    : [];

  const filteredProducts = productList.filter(p => {
    if (!p) return false;
    if (selectedCategory === 'Todos') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans">
      {/* Top Banner */}
      <div className="bg-[#2D463E] text-amber-100 text-xs py-2 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>✨ <b>Recetas de Chef</b> • 100% Ingredientes de Grado Humano • Sin Conservantes</span>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-amber-200/80">
          <Truck className="w-3.5 h-3.5" />
          <span>🛵 Envíos a Bogotá & Todo el País</span>
        </div>
      </div>

      {/* Header & Brand Identity */}
      <header className="bg-white border-b border-[#E0D7C6] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            onClick={handleSecretLogoClick}
            className="flex items-center space-x-3 cursor-pointer select-none"
            title="Cachorro Feliz"
          >
            <BrandLogoEmblem variant="main" size="md" />
            <div>
              <h1 className="font-bebas text-2xl tracking-wider text-[#2D463E] leading-none">
                CACHORRO FELIZ
              </h1>
              <p className="text-[11px] font-semibold text-[#EF8828] uppercase tracking-widest">
                Una marca con historia
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="https://api.whatsapp.com/send?phone=573205714504&text=Hola%20Chef%20Javier!%20Tengo%20una%20consulta%20sobre%20Cachorro%20Feliz%20🐾"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-[#2D463E] hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp: 3205714504</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-[#EF8828] hover:bg-[#d6761f] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md cursor-pointer relative active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Pedido</span>
              {totalItemsCount > 0 && (
                <span className="bg-white text-[#EF8828] w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Storytelling */}
      <section className="bg-gradient-to-b from-white to-[#FAF8F5] border-b border-[#E0D7C6] py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-amber-100/70 border border-amber-300 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
              <ChefHat className="w-4 h-4 text-[#EF8828]" />
              <span>De la Cocina de un Chef para su Mejor Amigo</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D463E] font-display tracking-tight leading-tight">
              Snacks Artesanales y Deshidratados que Cuidan la Vida de tu Mascota ❤️🐾
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              En <b>Cachorro Feliz</b> cocinamos con ingredientes 100% orgánicos, limpios y aptos para consumo humano. Sin harinas refinadas, sin azúcar, sin conservantes químicos y con todo el amor y rigor gastronómico que tu peludo merece.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3 rounded-xl border border-[#E0D7C6] shadow-xs text-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-800">Grado Humano</div>
                <div className="text-[10px] text-slate-500">Materia prima premium</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E0D7C6] shadow-xs text-center">
                <Heart className="w-5 h-5 text-[#EF8828] mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-800">100% Natural</div>
                <div className="text-[10px] text-slate-500">Cero químicos</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E0D7C6] shadow-xs text-center">
                <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-800">Envíos Locales</div>
                <div className="text-[10px] text-slate-500">Bogotá & Nacional</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-white shadow-2xl overflow-hidden relative bg-[#334c5c]">
                <img
                  src="/brand/LOGO DEFINITVO CACHORRO.png"
                  alt="Oreo, la inspiración de Cachorro Feliz"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white px-4 py-2 rounded-2xl shadow-lg border border-amber-200 text-center">
                <span className="text-[10px] font-extrabold text-[#EF8828] uppercase tracking-wider block">Oreo 🐾 (El C.E.O. de 4 Patas)</span>
                <span className="font-bebas text-base text-[#2D463E] tracking-wide">"Una marca con historia"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#2D463E] font-display">
              Nuestras Líneas de Snacks
            </h3>
            <p className="text-xs text-slate-500">
              Selecciona los favoritos de tu mascota y enviaremos el pedido directo al WhatsApp del Chef.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {['Todos', 'Galletas', 'Deshidratados'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2D463E] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-[#E0D7C6] hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(prod => {
            if (!prod) return null;
            const prodName = prod.name || 'Snack Cachorro Feliz';
            const isCerdo = prodName.toLowerCase().includes('cerdo');
            const isRes = prodName.toLowerCase().includes('res');
            const isPollo = prodName.toLowerCase().includes('pollo');
            const isGalleta = (prod.category || '') === 'Galletas';

            const badgeLogoVariant = isCerdo ? 'cerdo' : isRes ? 'res' : isPollo ? 'pollo' : isGalleta ? 'galletas' : 'main';

            const cartItem = cart.find(c => c && c.product && c.product.id === prod.id);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-[#E0D7C6] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Emblem */}
                  <div className="p-5 bg-gradient-to-r from-[#FAF8F5] to-white border-b border-[#E0D7C6]/50 flex items-center space-x-3">
                    <BrandLogoEmblem variant={badgeLogoVariant} size="sm" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#EF8828]">
                        {prod.category} • {prod.packageSizeGrams}g
                      </span>
                      <h4 className="font-bold text-[#2D463E] text-base leading-snug">
                        {prod.name}
                      </h4>
                    </div>
                  </div>

                  {/* Body & Benefits */}
                  <div className="p-5 space-y-3 text-xs">
                    <p className="text-slate-600 leading-relaxed">
                      {isGalleta 
                        ? 'Elaboradas con avena en hojuelas, zanahoria fresca, manzana, mantequilla de maní 100% natural, huevo y agua. ¡Crujientes y digestivas!'
                        : `Proteína pura deshidratada lentamente a baja temperatura para preservar nutrientes, aroma y sabor irresistible.`}
                    </p>

                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E0D7C6]/60 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Beneficios Clave:</div>
                      <div className="text-[11px] text-slate-700 space-y-0.5">
                        <div>✨ Libre de sal, azúcar añadida y químicos</div>
                        <div>✨ Alta palatabilidad y premio saludable</div>
                        <div>✨ Apto para perros de todas las razas y edades</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Price & Add CTA */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Precio:</span>
                    <span className="text-lg font-extrabold text-[#2D463E]">
                      ${prod.salePrice.toLocaleString('es-CO')}
                    </span>
                  </div>

                  {cartItem ? (
                    <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 rounded-xl">
                      <button
                        onClick={() => updateQuantity(prod.id, -1)}
                        className="text-emerald-800 hover:bg-emerald-200 p-1 rounded-md cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-emerald-900 text-xs w-4 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(prod.id, 1)}
                        className="text-emerald-800 hover:bg-emerald-200 p-1 rounded-md cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(prod)}
                      className="bg-[#2D463E] hover:bg-[#233831] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span>Agregar al Pedido</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Cart Button for Mobile */}
      {totalItemsCount > 0 && !isCartOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#EF8828] hover:bg-[#d6761f] text-white px-5 py-3.5 rounded-2xl font-bold text-sm shadow-2xl flex items-center space-x-3 cursor-pointer animate-bounce"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Ver mi Pedido ({totalItemsCount})</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
              ${total.toLocaleString('es-CO')}
            </span>
          </button>
        </div>
      )}

      {/* Footer & Storytelling */}
      <footer className="bg-[#1E302A] text-slate-300 py-12 px-4 mt-16 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <BrandLogoEmblem variant="white" size="sm" />
            <div>
              <p className="font-bebas text-2xl tracking-wider text-amber-100 leading-none">CACHORRO FELIZ</p>
              <p className="text-[11px] text-slate-400 font-medium">
                Snacks artesanales de Chef con grado humano • Bogotá, Colombia
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <a
              href="https://api.whatsapp.com/send?phone=573205714504&text=Hola%20Chef%20Javier!%20Tengo%20una%20consulta%20🐾"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 font-semibold transition-colors flex items-center space-x-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: 3205714504</span>
            </a>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center text-[11px] text-slate-500 mt-8 pt-4 border-t border-slate-800/80">
          © {new Date().getFullYear()} Cachorro Feliz. Una marca con historia. Todos los derechos reservados.
        </div>
      </footer>

      {/* Cart & Checkout Modal / Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setIsCartOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
              <div className="p-2 bg-[#EF8828] text-white rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">
                  Tu Pedido Cachorro Feliz
                </h3>
                <p className="text-xs text-slate-500">
                  Completa tus datos para enviarle el pedido directo al Chef Javier por WhatsApp
                </p>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-3">
                <Dog className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-semibold">Tu carrito está vacío.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#2D463E] text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Ver Catálogo de Snacks
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendWhatsAppOrder} className="space-y-4">
                {/* Cart Items List */}
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E0D7C6] max-h-48 overflow-y-auto divide-y divide-slate-200">
                  {cart.map(item => (
                    <div key={item.product.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{item.product.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {item.product.packageSizeGrams}g • ${item.product.salePrice.toLocaleString('es-CO')} c/u
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                        <span className="font-bold text-slate-900 w-16 text-right">
                          ${(item.product.salePrice * item.quantity).toLocaleString('es-CO')}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Client Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tu Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Carolina Gómez"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tu Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 3101234567"
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pet Information (Birthday CRM!) */}
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center space-x-1">
                      <Dog className="w-3.5 h-3.5 text-[#EF8828]" />
                      <span>Nombre de tu Mascota</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Toby / Luna"
                      value={petName}
                      onChange={e => setPetName(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF8828]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#EF8828]" />
                      <span>Cumpleaños (¡Para su regalo!)</span>
                    </label>
                    <input
                      type="date"
                      value={petBirthday}
                      onChange={e => setPetBirthday(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF8828]"
                    />
                  </div>
                </div>

                {/* Delivery Address & Zone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dirección de Entrega *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Calle 127 # 19-45 Apt 501"
                      value={clientAddress}
                      onChange={e => setClientAddress(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Zona / Ciudad *</label>
                    <select
                      value={clientZone}
                      onChange={e => setClientZone(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] bg-white"
                    >
                      <option value="Bogotá (Zona Norte / Cedritos / Usaquén)">Bogotá (Zona Norte / Cedritos / Usaquén)</option>
                      <option value="Bogotá (Zona Centro / Chapinero / Teusaquillo)">Bogotá (Zona Centro / Chapinero / Teusaquillo)</option>
                      <option value="Bogotá (Zona Noroccidente / Suba / Colina)">Bogotá (Zona Noroccidente / Suba / Colina)</option>
                      <option value="Bogotá (Zona Occidente / Fontibón / Salitre / Engativá)">Bogotá (Zona Occidente / Fontibón / Salitre / Engativá)</option>
                      <option value="Bogotá (Zona Sur)">Bogotá (Zona Sur)</option>
                      <option value="Fuera de Bogotá (Alrededores y Municipios)">Fuera de Bogotá (Alrededores y Municipios)</option>
                      <option value="Nacional (Otras Ciudades de Colombia)">Nacional (Otras Ciudades de Colombia)</option>
                      <option value="Recogida en Taller">Recogida personal en el taller del Chef (Gratis)</option>
                    </select>
                  </div>
                </div>

                {/* Payment Method Preferences */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                    <CreditCard className="w-3.5 h-3.5 text-[#EF8828]" />
                    <span>¿Cómo prefieres realizar el pago?</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Daviplata', 'Nequi', 'Bancolombia', 'Contraentrega'] as const).map(method => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          paymentMethod === method
                            ? 'bg-[#2D463E] text-white border-[#2D463E] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {method === 'Daviplata' && '🔴 Daviplata'}
                        {method === 'Nequi' && '🟣 Nequi'}
                        {method === 'Bancolombia' && '🟡 Bancolombia'}
                        {method === 'Contraentrega' && '💵 Contraentrega'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Totals Breakdown */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-600 font-semibold">Subtotal:</span> ${subtotal.toLocaleString('es-CO')}
                    <span className="mx-2">|</span>
                    <span className="text-slate-600 font-semibold">Envío:</span> {shippingCost === 0 ? '¡GRATIS!' : `$${shippingCost.toLocaleString('es-CO')}`}
                  </div>
                  <div className="text-base font-extrabold text-[#2D463E]">
                    TOTAL: ${total.toLocaleString('es-CO')} COP
                  </div>
                </div>

                {/* Big WhatsApp Action Button */}
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Pedido a WhatsApp del Chef (3205714504)</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Al hacer clic se abrirá tu WhatsApp con el detalle listo para enviar sin complicaciones.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

