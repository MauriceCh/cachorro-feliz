// Store and retrieve uncompressed, un-intervened original brand assets
const STORAGE_KEY = 'cachorro_feliz_brand_assets_v1';

export interface BrandAssetsMap {
  main: string | null;      // LOGO DEFINITVO CACHORRO.png
  galletas: string | null;  // LOGO DEFINITVO GALLETAS.jpg
  pollo: string | null;     // LOGO DEFINITVO DESHIDRATADOS pollo.png
  res: string | null;       // LOGO DEFINITVO DESHIDRATADOS RES.png
  cerdo: string | null;     // LOGO DEFINITVO DESHIDRATADOS CERDO.png
  sticker250: string | null; // stiker bolsa.png (250g)
  sticker500: string | null; // stiker bolsa libra.png (500g)
}

const DEFAULT_ASSETS: BrandAssetsMap = {
  main: '/brand/LOGO DEFINITVO CACHORRO.png',
  galletas: '/brand/LOGO DEFINITVO GALLETAS.png',
  pollo: '/brand/LOGO DEFINITVO DESHIDRATADOS pollo.png',
  res: '/brand/LOGO DEFINITVO DESHIDRATADOS RES.png',
  cerdo: '/brand/LOGO DEFINITVO DESHIDRATADOS CERDO.png',
  sticker250: '/brand/stiker bolsa (16 X 5).png',
  sticker500: '/brand/stiker bolsa libra.png'
};

export const getStoredBrandAssets = (): BrandAssetsMap => {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_ASSETS, ...JSON.parse(saved) };
      }
    }
  } catch (e) {
    // Quiet fallback
  }
  return DEFAULT_ASSETS;
};

export const saveStoredBrandAssets = (assets: BrandAssetsMap) => {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
      window.dispatchEvent(new Event('brand_assets_updated'));
    }
  } catch (e) {
    // Quiet fallback
  }
};

export const setBrandAsset = (key: keyof BrandAssetsMap, dataUrl: string | null) => {
  const current = getStoredBrandAssets();
  current[key] = dataUrl;
  saveStoredBrandAssets(current);
};
