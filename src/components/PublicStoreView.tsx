import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Heart, ShieldCheck, Truck, Sparkles, Plus, Minus, Check, MapPin, Award } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: 'galletas' | 'deshidratados-res' | 'deshidratados-pollo' | 'deshidratados-cerdo';
  categoryLabel: string;
  badge: string;
  description: string;
  price100g: number;
  price250g?: number;
  price500g?: number;
  image: string;
  ingredients: string;
  benefits: string[];
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'galletas-clasicas',
    name: 'Galletas Artesanales Horneadas',
    category: 'galletas',
    categoryLabel: 'Galletas Orgánicas',
    badge: 'Receta Insignia de Oreo',
    description: 'Elaboradas a fuego lento con avena integral, calabaza orgánica y toque de manzana fresca. Textura crujiente ideal para la higiene dental.',
    price100g: 15000,
    price250g: 32000,
    price500g: 58000,
    image: '/brand/LOGO%20DEFINITVO%20GALLETAS.jpg',
    ingredients: 'Avena en hojuelas, pulpa de calabaza 100% natural, harina de coco, manzana criolla, aceite de coco virgen virgen.',
    benefits: ['Ricas en fibra prebiótica', 'Sin harinas refinadas', 'Cero azúcar y sal añadida']
  },
  {
    id: 'deshidratado-res',
    name: 'Deshidratados Premium de Res',
    category: 'deshidratados-res',
    categoryLabel: 'Deshidratados Res',
    badge: '100% Carne Magra',
    description: 'Cortes seleccionados de res deshidratados a temperatura controlada por 16 horas para preservar proteínas, hierro y enzimas esenciales.',
    price100g: 22000,
    price250g: 48000,
    price500g: 88000,
    image: '/brand/LOGO%20DEFINITVO%20DESHIDRATADOS%20RES.png',
    ingredients: '100% solomito y pulpa magra de res fresca inspeccionada.',
    benefits: ['Alto valor biológico', 'Premio masticable de alta palatabilidad', 'Monoproteico y bajo en grasa']
  },
  {
    id: 'deshidratado-pollo',
    name: 'Tiras Deshidratadas de Pollo',
    category: 'deshidratados-pollo',
    categoryLabel: 'Deshidratados Pollo',
    badge: 'Pechuga 100% Natural',
    description: 'Finas láminas de pechuga de pollo deshidratadas lentamente. Snack suave, digestivo y altamente digestible para perros sensibles.',
    price100g: 19000,
    price250g: 42000,
    price500g: 76000,
    image: '/brand/LOGO%20DEFINITVO%20DESHIDRATADOS%20pollo.png',
    ingredients: '100% pechuga de pollo campesino libre de conservantes.',
    benefits: ['Fácil asimilación gástrica', 'Ideal para cachorros y adultos mayores', 'Excelente refuerzo en adiestramiento']
  },
  {
    id: 'deshidratado-cerdo',
    name: 'Snacks Crocantes de Lomo de Cerdo',
    category: 'deshidratados-cerdo',
    categoryLabel: 'Deshidratados Cerdo',
    badge: 'Sabor Irresistible',
    description: 'Lomo limpio de cerdo deshidratado de forma artesanal. Aroma intenso natural que estimula el apetito y satisface su instinto carnívoro.',
    price100g: 20000,
    price250g: 44000,
    price500g: 80000,
    image: '/brand/LOGO%20DEFINITVO%20DESHIDRATADOS%20CERDO.png',
    ingredients: '100% lomo y carne magra de cerdo fresca seleccionada.',
    benefits: ['Rico en tiamina (Vit B1)', 'Alternativa para mascotas alérgicas a otras proteínas', '100% libre de aditivos']
  }
];

export const PublicStoreView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [cart, setCart] = useState<{ [key: string]: { item: ProductItem; grams: string; price: number; quantity: number } }>({});
  const [selectedGrammage, setSelectedGrammage] = useState<{ [key: string]: '100g' | '250g' | '500g' }>({
    'galletas-clasicas': '100g',
    'deshidratado-res': '100g',
    'deshidratado-pollo': '100g',
    'deshidratado-cerdo': '100g',
  });

  // Datos del cliente para WhatsApp
  const [clientName, setClientName] = useState('');
  const [petName, setPetName] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('Norte de Bogotá ($8.000)');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const filteredProducts = selectedCategory === 'todos' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const getPriceForGram = (product: ProductItem, grams: '100g' | '250g' | '500g') => {
    if (grams === '250g' && product.price250g) return product.price250g;
    if (grams === '500g' && product.price500g) return product.price500g;
    return product.price100g;
  };

  const addToCart = (product: ProductItem) => {
    const grams = selectedGrammage[product.id] || '100g';
    const key = `${product.id}-${grams}`;
    const price = getPriceForGram(product, grams);

    setCart(prev => {
      const current = prev[key];
      return {
        ...prev,
        [key]: {
          item: product,
          grams,
          price,
          quantity: current ? current.quantity + 1 : 1
        }
      };
    });
  };

  const updateQuantity = (key: string, delta: number) => {
    setCart(prev => {
      const current = prev[key];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return {
        ...prev,
        [key]: { ...current, quantity: newQty }
      };
    });
  };

  const totalCart = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  const sendWhatsAppOrder = () => {
    if (Object.keys(cart).length === 0) {
      alert('Por favor agrega al menos un producto al carrito.');
      return;
    }

    const itemsSummary = Object.values(cart)
      .map(i => `• *${i.item.name}* (${i.grams}) x${i.quantity} = $${(i.price * i.quantity).toLocaleString('es-CO')}`)
      .join('\n');

    const message = `¡Hola Chef Javier! 🐾 Quiero realizar un pedido para mi consentido:\n\n` +
      `👤 *Tutor:* ${clientName || 'Cliente'}\n` +
      `🐶 *Mascota:* ${petName || 'Perrito Feliz'}\n` +
      `📍 *Zona de Envío:* ${deliveryZone}\n` +
      (address ? `🏠 *Dirección:* ${address}\n` : '') +
      (notes ? `📝 *Observaciones:* ${notes}\n` : '') +
      `\n🛍️ *Resumen del Pedido:*\n${itemsSummary}\n\n` +
      `💰 *Total Estimado Productos:* $${totalCart.toLocaleString('es-CO')} COP\n\n` +
      `Quedo atento a los medios de pago (Nequi, Daviplata o Bancolombia) y fecha de horneado/despacho. ¡Muchas gracias!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=573205714504&text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#22292f] font-sans pb-20">
      {/* Hero Banner Artesanal */}
      <section className="relative bg-[#334c5c] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-[#f8b46b] overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-3/5 space-y-4 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-2 bg-[#f8b46b]/20 text-[#f8b46b] border border-[#f8b46b]/40 text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full">
              <Award className="w-3.5 h-3.5" /> 100% Artesanal & Sin Químicos
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Snacks y Premios Naturales para Consentir a tu Mejor Amigo 🐾
            </h1>
            <p className="text-gray-200 text-sm sm:text-base max-w-xl leading-relaxed">
              Formulados por el <strong>Chef Javier Mauricio</strong> junto a <strong>Oreo</strong> en nuestro taller gastronómico en Bogotá. Horneados lentamente, sin sal, sin azúcar y con ingredientes de grado humano.
            </p>
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#7cb342]" /> Registro Sanitario ICA en trámite</span>
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#f8b46b]" /> Envíos a toda Bogotá y Colombia</span>
            </div>
          </div>

          <div className="md:w-2/5 flex flex-col items-center justify-center relative">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-[#f8b46b] shadow-2xl overflow-hidden bg-white">
              <img 
                src="/brand/LOGO%20DEFINITVO%20CACHORRO.png" 
                alt="Oreo - Cachorro Feliz" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback al logo de galletas si no carga
                  (e.target as HTMLImageElement).src = '/brand/LOGO%20DEFINITVO%20GALLETAS.jpg';
                }}
              />
            </div>
            <p className="mt-3 text-xs tracking-wider text-[#f8b46b] uppercase font-bold flex items-center gap-1">
              <span>Oreo</span> • C.E.O. & Catador Oficial 🐶
            </p>
          </div>
        </div>
      </section>

      {/* Selector de Categorías */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'todos', label: 'Todos los Snacks', color: '#334c5c' },
            { id: 'galletas', label: '🍪 Galletas Horneadas', color: '#334c5c' },
            { id: 'deshidratados-res', label: '🥩 Deshidratados de Res', color: '#ff7043' },
            { id: 'deshidratados-pollo', label: '🍗 Deshidratados de Pollo', color: '#ffa726' },
            { id: 'deshidratados-cerdo', label: '🥓 Deshidratados de Cerdo', color: '#ab47bc' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
                selectedCategory === tab.id
                  ? 'bg-[#334c5c] text-white shadow-md scale-105 border-2 border-[#f8b46b]'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Productos */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProducts.map((product) => {
            const currentGram = selectedGrammage[product.id] || '100g';
            const currentPrice = getPriceForGram(product, currentGram);

            return (
              <div 
                key={product.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="p-6 flex flex-col sm:flex-row items-center gap-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                    <div className="w-32 h-32 flex-shrink-0 rounded-2xl border-2 border-gray-100 p-1 shadow-inner bg-white">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left">
                      <span className="inline-block text-[11px] font-bold text-[#f8b46b] bg-[#334c5c] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {product.badge}
                      </span>
                      <h3 className="text-xl font-bold text-[#334c5c] leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Selector de Presentación */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Selecciona Presentación:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['100g', '250g', '500g'] as const).map((gram) => (
                          <button
                            key={gram}
                            type="button"
                            onClick={() => setSelectedGrammage(prev => ({ ...prev, [product.id]: gram }))}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all ${
                              currentGram === gram
                                ? 'border-[#334c5c] bg-[#334c5c] text-white shadow-sm'
                                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {gram}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Beneficios */}
                    <div className="bg-[#fbf9f6] p-3 rounded-xl border border-gray-100 space-y-1">
                      <p className="text-[11px] font-bold text-[#334c5c] uppercase">Beneficios clave:</p>
                      <ul className="text-xs text-gray-600 space-y-0.5">
                        {product.benefits.map((b, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f8b46b]"></span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer de Tarjeta con Precio y Botón */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Precio ({currentGram})</span>
                    <span className="text-2xl font-black text-[#334c5c]">
                      ${currentPrice.toLocaleString('es-CO')}
                      <span className="text-xs font-normal text-gray-500 ml-1">COP</span>
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 bg-[#f8b46b] hover:bg-[#e29d53] text-[#334c5c] font-black px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen de Carrito y Checkout a WhatsApp */}
        <section className="mt-14 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#334c5c]/10">
          <div className="flex items-center gap-3 border-b pb-4 mb-6">
            <div className="p-3 bg-[#334c5c] text-white rounded-2xl">
              <ShoppingBag className="w-6 h-6 text-[#f8b46b]" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#334c5c]">
                Tu Pedido de Snacks ({totalItemsCount} productos)
              </h2>
              <p className="text-xs text-gray-500">
                Completa tus datos y confirmaremos tu despacho directamente por WhatsApp
              </p>
            </div>
          </div>

          {Object.keys(cart).length === 0 ? (
            <div className="text-center py-8 text-gray-400 space-y-2">
              <p className="text-sm">Tu canasta está vacía. ¡Elige las delicias favoritas de tu peludo arriba!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lista de Items */}
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-2">
                {Object.entries(cart).map(([key, item]) => (
                  <div key={key} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-[#334c5c]">{item.item.name}</p>
                      <span className="text-xs text-gray-500 font-medium">Presentación: {item.grams} • ${item.price.toLocaleString('es-CO')} c/u</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button 
                          onClick={() => updateQuantity(key, -1)}
                          className="p-1.5 hover:bg-gray-200 text-gray-600 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(key, 1)}
                          className="p-1.5 hover:bg-gray-200 text-gray-600 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-[#334c5c] w-24 text-right">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulario de Despacho */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Paula Gómez"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#334c5c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Nombre de tu Peludo 🐶🐱 *
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Ej. Toby / Luna"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#334c5c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Zona de Despacho en Bogotá / Colombia
                  </label>
                  <select
                    value={deliveryZone}
                    onChange={(e) => setDeliveryZone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#334c5c] bg-white"
                  >
                    <option value="Norte de Bogotá ($8.000)">Norte de Bogotá ($8.000)</option>
                    <option value="Chapinero / Teusaquillo ($7.000)">Chapinero / Teusaquillo ($7.000)</option>
                    <option value="Occidente / Normandía ($6.000)">Occidente / Normandía ($6.000)</option>
                    <option value="Centro / Sur de Bogotá ($9.000)">Centro / Sur de Bogotá ($9.000)</option>
                    <option value="Recoger en Taller (Normandía - Gratis)">Recoger en Taller (Normandía - Gratis)</option>
                    <option value="Envío Nacional por Transportadora ($15.000)">Envío Nacional por Transportadora ($15.000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Calle 140 # 15-30 Apto 402"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#334c5c]"
                  />
                </div>
              </div>

              {/* Total y Botón de WhatsApp */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold">Subtotal de Productos:</span>
                  <div className="text-3xl font-black text-[#334c5c]">
                    ${totalCart.toLocaleString('es-CO')} <span className="text-xs font-normal text-gray-500">COP</span>
                  </div>
                </div>

                <button
                  onClick={sendWhatsAppOrder}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#25d366] hover:bg-[#20ba59] text-white font-black text-base px-8 py-3.5 rounded-2xl shadow-lg transition-all transform active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-white" /> Enviar Pedido a WhatsApp (+57 320 571 4504)
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer Artesanal con Acceso Sigiloso para el Chef */}
      <footer className="mt-16 border-t border-gray-200 bg-white py-8 text-center text-xs text-gray-500 space-y-2">
        <p className="font-medium">
          🐾 <strong>Cachorro Feliz</strong> • Obrador & Taller Gastronómico Canino
        </p>
        <p>Bogotá, Colombia • Hecho a mano con amor por el Chef Javier & Oreo</p>
        <div className="pt-2">
          <a 
            href="#admin" 
            className="text-gray-400 hover:text-[#334c5c] text-[11px] underline transition"
          >
            Acceso Taller del Chef
          </a>
        </div>
      </footer>
    </div>
  );
};
export default PublicStoreView;