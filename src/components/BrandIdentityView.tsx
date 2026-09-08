import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Printer, 
  Sparkles, 
  Tag, 
  Info, 
  Copy, 
  Check, 
  Phone, 
  Instagram, 
  CheckCircle2,
  FileText,
  Layers,
  Upload,
  Image as ImageIcon,
  Trash2,
  Download,
  Eye
} from 'lucide-react';
import { BrandLogoEmblem, BrandProductVariant } from './BrandLogoEmblem';
import { ProductLabelSticker } from './ProductLabelSticker';
import { Recipe, FinishedProduct } from '../types';
import { getStoredBrandAssets, saveStoredBrandAssets, setBrandAsset, BrandAssetsMap } from '../lib/brandStorage';

interface BrandIdentityViewProps {
  recipes: Recipe[];
  finishedProducts: FinishedProduct[];
}

export const BrandIdentityView: React.FC<BrandIdentityViewProps> = ({
  recipes,
  finishedProducts
}) => {
  const [selectedVariant, setSelectedVariant] = useState<BrandProductVariant>('galletas');
  const [selectedWeight, setSelectedWeight] = useState<number>(250);
  const [customIngredients, setCustomIngredients] = useState<string>(
    'Harina de avena, avena en hojuelas, zanahoria, manzana, mantequilla de maní, huevo y agua'
  );
  const [batchCode, setBatchCode] = useState<string>('LOT-2026-08');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Brand assets state (original un-intervened images)
  const [assets, setAssets] = useState<BrandAssetsMap>(getStoredBrandAssets());
  const [uploadSuccessKey, setUploadSuccessKey] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setAssets(getStoredBrandAssets());
    };
    window.addEventListener('brand_assets_updated', handleUpdate);
    return () => window.removeEventListener('brand_assets_updated', handleUpdate);
  }, []);

  const handleFileUpload = (key: keyof BrandAssetsMap, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setBrandAsset(key, result);
          setUploadSuccessKey(key);
          setTimeout(() => setUploadSuccessKey(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAsset = (key: keyof BrandAssetsMap) => {
    setBrandAsset(key, null);
  };

  const brandPalettes = [
    {
      id: 'main' as BrandProductVariant,
      assetKey: 'main' as keyof BrandAssetsMap,
      fileName: 'LOGO DEFINITVO CACHORRO.png',
      name: 'Marca Principal',
      category: 'Identidad Corporativa & Global',
      bgHex: '#334c5c',
      bgCmyk: 'C: 81.19, M: 56.66, Y: 97.37, K: 0.02',
      accentHex: '#f8b46b',
      accentCmyk: 'C: 0.01, M: 35.68, Y: 43.03, K: 0',
      titlesFont: 'Wingdings / Bebas Neue Regular',
      subtitlesFont: 'Bebas Neue Regular',
      bodyFont: 'Myriad Pro / Plus Jakarta Sans',
      desc: 'Utilizado en el encabezado principal de la aplicación y en las etiquetas maestras.'
    },
    {
      id: 'galletas' as BrandProductVariant,
      assetKey: 'galletas' as keyof BrandAssetsMap,
      fileName: 'LOGO DEFINITVO GALLETAS.jpg',
      name: 'Galletas Orgánicas',
      category: 'Línea de Horneados',
      bgHex: '#334c5c',
      bgCmyk: 'C: 81.19, M: 56.66, Y: 97.37, K: 0.02',
      accentHex: '#f8b46b',
      accentCmyk: 'C: 0.01, M: 35.68, Y: 43.03, K: 0',
      titlesFont: 'Wingdings / Bebas Neue Regular',
      subtitlesFont: 'Bebas Neue Regular',
      bodyFont: 'Myriad Pro / Plus Jakarta Sans',
      desc: 'Fondo Azul Petróleo con tipografía Dorada Cálida para galletas orgánicas premium.'
    },
    {
      id: 'pollo' as BrandProductVariant,
      assetKey: 'pollo' as keyof BrandAssetsMap,
      fileName: 'LOGO DEFINITVO DESHIDRATADOS pollo.png',
      name: 'Deshidratados de Pollo',
      category: 'Línea Aviar',
      bgHex: '#f39205',
      bgCmyk: 'C: 0.19, M: 50.25, Y: 97.37, K: 0.02',
      accentHex: '#001253',
      accentCmyk: 'C: 100, M: 95, Y: 5, K: 0',
      titlesFont: 'Wingdings / Bebas Neue Regular',
      subtitlesFont: 'Bebas Neue Regular',
      bodyFont: 'Myriad Pro / Plus Jakarta Sans',
      desc: 'Fondo naranja brillante con letras en azul marino profundo para pechuga y snacks de pollo.'
    },
    {
      id: 'res' as BrandProductVariant,
      assetKey: 'res' as keyof BrandAssetsMap,
      fileName: 'LOGO DEFINITVO DESHIDRATADOS RES.png',
      name: 'Deshidratados de Res',
      category: 'Línea Bovina',
      bgHex: '#e84b1e',
      bgCmyk: 'C: 0, M: 81.18, Y: 93.75, K: 0',
      accentHex: '#ffffff',
      accentCmyk: 'Blanco Puro #FFFFFF',
      titlesFont: 'Wingdings / Bebas Neue Regular',
      subtitlesFont: 'Bebas Neue Regular',
      bodyFont: 'Myriad Pro / Plus Jakarta Sans',
      desc: 'Fondo rojo ladrillo / terracotta con tipografía en blanco puro para cortes de res magra.'
    },
    {
      id: 'cerdo' as BrandProductVariant,
      assetKey: 'cerdo' as keyof BrandAssetsMap,
      fileName: 'LOGO DEFINITVO DESHIDRATADOS CERDO.png',
      name: 'Deshidratados de Cerdo',
      category: 'Línea Porcina',
      bgHex: '#794092',
      bgCmyk: 'C: 64.31, M: 84.31, Y: 0, K: 0',
      accentHex: '#b7d588',
      accentCmyk: 'C: 35.29, M: 0, Y: 58.43, K: 0',
      titlesFont: 'Wingdings / Bebas Neue Regular',
      subtitlesFont: 'Bebas Neue Regular',
      bodyFont: 'Myriad Pro / Plus Jakarta Sans',
      desc: 'Fondo púrpura distintivo con acentos en verde lima suave para snacks crocantes de cerdo.'
    }
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSelectPresetRecipe = (rec: Recipe) => {
    const ingText = rec.ingredients.map(i => i.rawMaterialName).join(', ');
    setCustomIngredients(ingText);
    if (rec.name.toLowerCase().includes('pollo')) {
      setSelectedVariant('pollo');
    } else if (rec.name.toLowerCase().includes('res')) {
      setSelectedVariant('res');
    } else if (rec.name.toLowerCase().includes('cerdo')) {
      setSelectedVariant('cerdo');
    } else {
      setSelectedVariant('galletas');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#334c5c] text-white rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-[#f8b46b]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8b46b]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <BrandLogoEmblem variant="main" size="lg" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-bebas tracking-wide text-[#f8b46b]">
                  CACHORRO FELIZ • IDENTIDAD & ETIQUETAS
                </h1>
                <span className="bg-[#f8b46b]/20 border border-[#f8b46b]/50 text-[#f8b46b] text-xs font-semibold px-2 py-0.5 rounded uppercase font-sans">
                  ARCHIVOS ORIGINALES
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl font-sans">
                Visualización y gestión de los archivos de logo originales (sin intervenciones ni dibujos simplificados) y generador de stickers oficiales de empaque.
              </p>
            </div>
          </div>

          {/* Official Contact Badges */}
          <div className="bg-black/25 backdrop-blur-xs rounded-xl p-3 border border-white/10 flex flex-col gap-1.5 text-xs text-slate-200">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#f8b46b]" />
              <span><strong>WhatsApp Pedidos:</strong> 3205714504</span>
            </div>
            <div className="flex items-center space-x-2">
              <Instagram className="w-4 h-4 text-[#f8b46b]" />
              <span><strong>Instagram:</strong> @snacks_cachorro_feliz</span>
            </div>
            <div className="flex items-center space-x-2 text-[#f8b46b]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-bebas tracking-wider text-xs">"UNA MARCA CON HISTORIA"</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Official Original Logo Assets Manager */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C6] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-[#334c5c] font-bebas tracking-wide flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#f8b46b]" />
              Archivos Originales de Logo por Línea de Producto
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Carga o visualiza los archivos de imagen originales (PNG / JPG). Las imágenes cargadas se muestran a 100% de resolución sin ninguna intervención vectorial.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {brandPalettes.map((p) => {
            const hasCustomImage = !!assets[p.assetKey];
            const isUploadSuccess = uploadSuccessKey === p.assetKey;

            return (
              <div
                key={p.id}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">
                      {p.category}
                    </span>
                    {hasCustomImage && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3" /> Original
                      </span>
                    )}
                  </div>

                  <h3 className="font-bebas text-base font-bold text-slate-800 tracking-wide mb-1">
                    {p.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block mb-3 truncate" title={p.fileName}>
                    {p.fileName}
                  </span>

                  {/* Logo Display Container */}
                  <div 
                    className="w-full aspect-square rounded-xl flex items-center justify-center p-3 mb-3 border relative overflow-hidden shadow-inner"
                    style={{ backgroundColor: p.bgHex, borderColor: p.accentHex }}
                  >
                    {hasCustomImage ? (
                      <img
                        src={assets[p.assetKey]!}
                        alt={p.name}
                        className="w-full h-full object-contain rounded-full shadow-md select-none"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2 text-white">
                        <div 
                          className="w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center mb-2 shadow-md"
                          style={{ borderColor: p.accentHex, color: p.accentHex }}
                        >
                          <span className="font-bebas text-xs font-bold leading-tight">CACHORRO</span>
                          <span className="font-bebas text-[10px] font-bold leading-none">FELIZ</span>
                        </div>
                        <span className="text-[10px] font-medium opacity-80 font-sans">
                          Haz clic abajo para cargar {p.fileName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload & Management Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="w-full bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] border border-[#f8b46b]/40 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{hasCustomImage ? 'Reemplazar Imagen' : 'Cargar Original'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={(e) => handleFileUpload(p.assetKey, e)}
                    />
                  </label>

                  {hasCustomImage && (
                    <button
                      onClick={() => handleRemoveAsset(p.assetKey)}
                      className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 py-1 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Restablecer</span>
                    </button>
                  )}

                  {isUploadSuccess && (
                    <p className="text-[10px] text-emerald-600 text-center font-bold animate-pulse">
                      ✓ Imagen cargada exitosamente
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Official Stickers for Packaging (250g and 500g Libra) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C6] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-[#334c5c] font-bebas tracking-wide flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#f8b46b]" />
              Archivos de Stickers Oficiales de Empaque
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Archivos de etiquetas completas para bolsas de 250g y 500g (Libra).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sticker Bolsa 250g */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bebas text-lg font-bold text-[#334c5c]">
                  Sticker Bolsa 250 g
                </span>
                <span className="text-xs font-mono text-slate-500">stiker bolsa.png</span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-inner mb-4 flex items-center justify-center min-h-[160px]">
                {assets.sticker250 ? (
                  <img
                    src={assets.sticker250}
                    alt="Sticker Oficial 250g"
                    className="max-h-56 w-auto object-contain rounded select-none shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">
                      Carga el archivo <strong>stiker bolsa.png</strong> para visualización directa
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1 bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] border border-[#f8b46b]/40 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
                <Upload className="w-4 h-4" />
                <span>{assets.sticker250 ? 'Reemplazar Sticker 250g' : 'Cargar stiker bolsa.png'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={(e) => handleFileUpload('sticker250', e)}
                />
              </label>

              {assets.sticker250 && (
                <button
                  onClick={() => handleRemoveAsset('sticker250')}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 cursor-pointer"
                  title="Restablecer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sticker Bolsa 500g Libra */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bebas text-lg font-bold text-[#334c5c]">
                  Sticker Bolsa 500 g (Libra)
                </span>
                <span className="text-xs font-mono text-slate-500">stiker bolsa libra.png</span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-inner mb-4 flex items-center justify-center min-h-[160px]">
                {assets.sticker500 ? (
                  <img
                    src={assets.sticker500}
                    alt="Sticker Oficial 500g Libra"
                    className="max-h-56 w-auto object-contain rounded select-none shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">
                      Carga el archivo <strong>stiker bolsa libra.png</strong> para visualización directa
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1 bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] border border-[#f8b46b]/40 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
                <Upload className="w-4 h-4" />
                <span>{assets.sticker500 ? 'Reemplazar Sticker Libra' : 'Cargar stiker bolsa libra.png'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={(e) => handleFileUpload('sticker500', e)}
                />
              </label>

              {assets.sticker500 && (
                <button
                  onClick={() => handleRemoveAsset('sticker500')}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 cursor-pointer"
                  title="Restablecer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Interactive Sticker Generator with QR & Recipes */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C6] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-bebas tracking-wide text-[#334c5c] flex items-center gap-2">
              <Printer className="w-6 h-6 text-[#f8b46b]" />
              Generador & Impresión de Stickers de Producción
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              Personaliza el lote, fecha de vencimiento y lista de ingredientes para generar etiquetas listas para impresión.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Línea activa:</span>
            {(['galletas', 'pollo', 'res', 'cerdo'] as BrandProductVariant[]).map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVariant(v)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedVariant === v
                    ? 'bg-[#334c5c] text-[#f8b46b] shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Controls & Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Left Configuration Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              Datos del Empaque y Receta
            </h3>

            {/* Quick Recipe Selector */}
            {recipes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Cargar ingredientes desde una receta:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {recipes.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => handleSelectPresetRecipe(rec)}
                      className="text-[11px] bg-slate-100 hover:bg-[#f8b46b]/20 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition-all text-left cursor-pointer"
                    >
                      {rec.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Package Size / Weight */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Presentación / Contenido Neto:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[100, 250, 500].map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      selectedWeight === w
                        ? 'bg-[#334c5c] text-white border-[#334c5c] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {w === 500 ? '500g (Libra)' : `${w} gramos`}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients Text Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Listado de Ingredientes:
              </label>
              <textarea
                value={customIngredients}
                onChange={(e) => setCustomIngredients(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#334c5c] focus:border-[#334c5c] font-sans"
                placeholder="Ej: Harina de avena, avena en hojuelas, zanahoria..."
              />
            </div>

            {/* Optional Lot Code */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Código de Lote:
                </label>
                <input
                  type="text"
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  placeholder="LOT-2026-08"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Fecha Vencimiento:
                </label>
                <input
                  type="text"
                  defaultValue="Consumir en 6 meses"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Right Live Sticker Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="w-full max-w-[620px] mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-bebas">
                Vista Previa del Sticker ({selectedWeight}g)
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Formato Oficial
              </span>
            </div>

            {/* Render Sticker Component */}
            <ProductLabelSticker
              variant={selectedVariant}
              packageSizeGrams={selectedWeight}
              ingredientsText={customIngredients}
              batchNumber={batchCode}
              expirationDate="Consumir en 6 meses"
              showPrintButton={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
