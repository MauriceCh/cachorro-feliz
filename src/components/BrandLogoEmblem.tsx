import React, { useState, useEffect } from 'react';
import { getStoredBrandAssets, BrandAssetsMap } from '../lib/brandStorage';
import { Sparkles, Upload } from 'lucide-react';

export type BrandProductVariant = 'main' | 'galletas' | 'pollo' | 'res' | 'cerdo' | 'white';

interface BrandLogoEmblemProps {
  variant?: BrandProductVariant | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  srcOverride?: string | null;
}

const BRAND_CONFIGS: Record<string, { bgColor: string; accentColor: string; title: string; subtitle: string; label: string }> = {
  main: {
    bgColor: '#334c5c',
    accentColor: '#f8b46b',
    title: 'CACHORRO FELIZ',
    subtitle: 'SNACKS ORGÁNICOS PREMIUM',
    label: 'Marca Principal'
  },
  galletas: {
    bgColor: '#334c5c',
    accentColor: '#f8b46b',
    title: 'CACHORRO FELIZ',
    subtitle: 'GALLETAS ORGÁNICAS PREMIUM',
    label: 'Galletas'
  },
  pollo: {
    bgColor: '#f39205',
    accentColor: '#001253',
    title: 'CACHORRO FELIZ',
    subtitle: 'DESHIDRATADOS PREMIUM DE POLLO',
    label: 'Pollo'
  },
  res: {
    bgColor: '#e84b1e',
    accentColor: '#ffffff',
    title: 'CACHORRO FELIZ',
    subtitle: 'DESHIDRATADOS PREMIUM DE RES',
    label: 'Res'
  },
  cerdo: {
    bgColor: '#794092',
    accentColor: '#b7d588',
    title: 'CACHORRO FELIZ',
    subtitle: 'DESHIDRATADOS PREMIUM DE CERDO',
    label: 'Cerdo'
  },
  white: {
    bgColor: '#ffffff',
    accentColor: '#334c5c',
    title: 'CACHORRO FELIZ',
    subtitle: 'SNACKS ARTESANALES',
    label: 'Blanco'
  }
};

export const BrandLogoEmblem: React.FC<BrandLogoEmblemProps> = ({
  variant = 'main',
  size = 'md',
  className = '',
  showText = false,
  srcOverride = null
}) => {
  const [assets, setAssets] = useState<BrandAssetsMap>(() => {
    try {
      return getStoredBrandAssets();
    } catch {
      return {} as any;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setAssets(getStoredBrandAssets());
      } catch {}
    };
    window.addEventListener('brand_assets_updated', handleUpdate);
    return () => window.removeEventListener('brand_assets_updated', handleUpdate);
  }, []);

  const config = BRAND_CONFIGS[variant] || BRAND_CONFIGS.main;

  const sizePixels = {
    xs: 28,
    sm: 40,
    md: 56,
    lg: 84,
    xl: 140
  }[size];

  // Check if we have an exact uploaded image for this variant
  const currentImageSrc = srcOverride || assets[variant] || (variant === 'galletas' ? assets.main : null);

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {currentImageSrc ? (
        /* Render 100% untouched original image */
        <img
          src={currentImageSrc}
          alt={`Logo Oficial Cachorro Feliz - ${config.title}`}
          width={sizePixels}
          height={sizePixels}
          referrerPolicy="no-referrer"
          className="rounded-full object-cover shrink-0 shadow-md select-none border border-black/10 transition-transform duration-200"
          style={{ width: `${sizePixels}px`, height: `${sizePixels}px` }}
        />
      ) : (
        /* Crisp, typography-only circular emblem without any distorted cartoon drawings */
        <div
          className="rounded-full shrink-0 shadow-md select-none flex flex-col items-center justify-center text-center p-1 border-2 relative overflow-hidden transition-all"
          style={{
            width: `${sizePixels}px`,
            height: `${sizePixels}px`,
            backgroundColor: config.bgColor,
            borderColor: config.accentColor,
            color: config.accentColor
          }}
        >
          {size === 'xs' ? (
            <span className="font-bebas text-[10px] font-bold leading-none tracking-wider">
              CF
            </span>
          ) : size === 'sm' ? (
            <div className="flex flex-col items-center">
              <span className="font-bebas text-[11px] font-bold leading-tight tracking-wider">
                CACHORRO
              </span>
              <span className="font-bebas text-[9px] font-bold leading-none opacity-90">
                FELIZ
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-1">
              <span className="font-bebas text-xs font-bold leading-tight tracking-widest uppercase">
                CACHORRO
              </span>
              <span className="font-bebas text-[11px] font-bold leading-none tracking-wider">
                FELIZ
              </span>
              {size === 'xl' && (
                <span className="text-[9px] uppercase tracking-wide opacity-80 mt-1 font-sans">
                  {config.subtitle}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {showText && (
        <div className="flex flex-col">
          <span className="font-bebas text-lg font-bold tracking-wider leading-none text-[#334c5c]">
            {config.title}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
            {config.subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
