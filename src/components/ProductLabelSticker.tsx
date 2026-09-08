import React, { useRef, useState, useEffect } from 'react';
import { Printer, QrCode, Download, Share2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { BrandProductVariant, BrandLogoEmblem } from './BrandLogoEmblem';
import { getStoredBrandAssets, BrandAssetsMap } from '../lib/brandStorage';

interface ProductLabelStickerProps {
  productName?: string;
  variant?: BrandProductVariant;
  packageSizeGrams?: number;
  ingredientsText?: string;
  batchNumber?: string;
  expirationDate?: string;
  notes?: string;
  showPrintButton?: boolean;
}

export const ProductLabelSticker: React.FC<ProductLabelStickerProps> = ({
  productName = 'Galletas Orgánicas Zanahoria-Manzana',
  variant = 'galletas',
  packageSizeGrams = 250,
  ingredientsText = 'Harina de avena, avena en hojuelas, zanahoria, manzana, mantequilla de maní, huevo y agua',
  batchNumber,
  expirationDate,
  notes,
  showPrintButton = true
}) => {
  const stickerRef = useRef<HTMLDivElement>(null);
  const [assets, setAssets] = useState<BrandAssetsMap>(getStoredBrandAssets());

  useEffect(() => {
    const handleUpdate = () => {
      setAssets(getStoredBrandAssets());
    };
    window.addEventListener('brand_assets_updated', handleUpdate);
    return () => window.removeEventListener('brand_assets_updated', handleUpdate);
  }, []);

  const isHalfKilo = packageSizeGrams >= 500;
  const officialStickerImage = isHalfKilo ? assets.sticker500 : assets.sticker250;

  // Color palette per brand guide
  const styles = {
    main: {
      bgColor: '#334c5c',
      textColor: '#f8b46b',
      titleColor: '#f8b46b',
      bodyColor: '#ffffff',
      borderColor: '#f8b46b'
    },
    galletas: {
      bgColor: '#334c5c',
      textColor: '#f8b46b',
      titleColor: '#f8b46b',
      bodyColor: '#ffffff',
      borderColor: '#f8b46b'
    },
    pollo: {
      bgColor: '#f39205',
      textColor: '#001253',
      titleColor: '#001253',
      bodyColor: '#001253',
      borderColor: '#001253'
    },
    res: {
      bgColor: '#e84b1e',
      textColor: '#ffffff',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#ffffff'
    },
    cerdo: {
      bgColor: '#794092',
      textColor: '#b7d588',
      titleColor: '#b7d588',
      bodyColor: '#ffffff',
      borderColor: '#b7d588'
    }
  }[variant];

  const handlePrint = () => {
    window.print();
  };

  const netContentLabel = isHalfKilo ? 'CONTENIDO NETO 500 GRS' : `CONTENIDO NETO ${packageSizeGrams} GRS`;

  return (
    <div className="flex flex-col gap-3 w-full max-w-[640px]">
      {/* If the exact original sticker image is loaded and matching */}
      {officialStickerImage ? (
        <div className="rounded-xl overflow-hidden shadow-md border border-black/10 bg-white p-2">
          <img
            src={officialStickerImage}
            alt={`Sticker Oficial Cachorro Feliz ${netContentLabel}`}
            className="w-full h-auto object-contain rounded-lg select-none"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        /* Render high-fidelity label matching the exact brand sticker specifications */
        <div
          ref={stickerRef}
          id="sticker-label-print"
          className="w-full rounded-xl p-5 sm:p-6 shadow-md transition-all relative overflow-hidden select-none border border-black/10"
          style={{ backgroundColor: styles.bgColor, color: styles.textColor }}
        >
          {/* Top Header Title: UNA MARCA CON HISTORIA */}
          <div className="text-center mb-3">
            <h2
              className="text-xl sm:text-2xl font-bold tracking-wider uppercase font-bebas leading-none drop-shadow-xs"
              style={{ color: styles.titleColor }}
            >
              UNA MARCA CON HISTORIA
            </h2>
            <div
              className="w-16 h-0.5 mx-auto mt-1 rounded-full opacity-60"
              style={{ backgroundColor: styles.textColor }}
            />
          </div>

          {/* Central Content Layout */}
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Left Column: QR WhatsApp + Pedidos */}
            <div className="col-span-3 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-1.5 rounded-lg shadow-xs border border-black/10 flex flex-col items-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 text-slate-900">
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="5" y="5" width="28" height="28" fill="#111827" rx="3" />
                  <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="#111827" rx="1" />
                  <rect x="67" y="5" width="28" height="28" fill="#111827" rx="3" />
                  <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="#111827" rx="1" />
                  <rect x="5" y="67" width="28" height="28" fill="#111827" rx="3" />
                  <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="#111827" rx="1" />
                  <rect x="38" y="10" width="6" height="6" fill="#111827" />
                  <rect x="48" y="10" width="6" height="6" fill="#111827" />
                  <rect x="38" y="24" width="6" height="6" fill="#111827" />
                  <rect x="48" y="24" width="6" height="6" fill="#111827" />
                  <rect x="10" y="38" width="6" height="6" fill="#111827" />
                  <rect x="24" y="38" width="6" height="6" fill="#111827" />
                  <rect x="67" y="38" width="6" height="6" fill="#111827" />
                  <rect x="81" y="38" width="6" height="6" fill="#111827" />
                  <circle cx="50" cy="50" r="14" fill="#25D366" />
                  <path d="M 44,53 C 44,53 45,46 51,46 C 56,46 57,51 55,54 C 53,56 50,56 48,54" stroke="#ffffff" strokeWidth="2" fill="none" />
                  <circle cx="50" cy="50" r="2" fill="#ffffff" />
                </svg>
              </div>
              <span
                className="font-bebas text-[11px] sm:text-xs font-bold tracking-wider mt-1.5 uppercase leading-tight"
                style={{ color: styles.textColor }}
              >
                PEDIDOS: 3205714504
              </span>
            </div>

            {/* Center Column: Ingredients & Product Info */}
            <div className="col-span-6 px-1 text-center sm:text-left flex flex-col justify-center">
              <div className="mb-1">
                <span
                  className="font-bebas text-xs sm:text-sm font-bold tracking-wider uppercase block"
                  style={{ color: styles.titleColor }}
                >
                  INGREDIENTES :
                </span>
                <p
                  className="text-[11px] sm:text-xs leading-relaxed font-sans mt-0.5"
                  style={{ color: styles.bodyColor }}
                >
                  {ingredientsText}
                </p>
              </div>

              {(batchNumber || expirationDate) && (
                <div className="mt-2 pt-1.5 border-t border-white/20 flex flex-wrap gap-2 text-[10px] opacity-90 font-mono">
                  {batchNumber && <span>Lote: {batchNumber}</span>}
                  {expirationDate && <span>Vence: {expirationDate}</span>}
                </div>
              )}
            </div>

            {/* Right Column: QR Instagram + Handle + Contenido Neto */}
            <div className="col-span-3 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-1.5 rounded-lg shadow-xs border border-black/10 flex flex-col items-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 text-slate-900">
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="5" y="5" width="28" height="28" fill="#111827" rx="3" />
                  <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="#111827" rx="1" />
                  <rect x="67" y="5" width="28" height="28" fill="#111827" rx="3" />
                  <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="#111827" rx="1" />
                  <rect x="5" y="67" width="28" height="28" fill="#111827" rx="3" />
                  <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="#111827" rx="1" />
                  <rect x="42" y="12" width="6" height="6" fill="#111827" />
                  <rect x="52" y="12" width="6" height="6" fill="#111827" />
                  <rect x="42" y="82" width="6" height="6" fill="#111827" />
                  <rect x="52" y="82" width="6" height="6" fill="#111827" />
                  <rect x="72" y="45" width="6" height="6" fill="#111827" />
                  <rect x="82" y="45" width="6" height="6" fill="#111827" />
                  <rect x="36" y="36" width="28" height="28" rx="7" fill="#E1306C" />
                  <circle cx="50" cy="50" r="7" fill="none" stroke="#ffffff" strokeWidth="2.5" />
                  <circle cx="57" cy="43" r="1.5" fill="#ffffff" />
                </svg>
              </div>
              <span
                className="font-bebas text-[10px] sm:text-[11px] font-bold tracking-wider mt-1.5 uppercase leading-tight"
                style={{ color: styles.textColor }}
              >
                @SNACKS_CACHORRO_FELIZ
              </span>
              <span
                className="font-bebas text-[10px] sm:text-xs font-bold tracking-wider mt-0.5 uppercase"
                style={{ color: styles.titleColor }}
              >
                {netContentLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      {showPrintButton && (
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-xs text-slate-500 font-medium">
            Formato oficial para empaque bolsa {isHalfKilo ? '500g (Libra)' : `${packageSizeGrams}g`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] border border-[#f8b46b]/40 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Sticker</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
