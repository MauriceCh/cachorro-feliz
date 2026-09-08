import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  RefreshCw, 
  Check, 
  Palette, 
  Film, 
  Play, 
  Pause,
  Upload, 
  Copy, 
  ExternalLink, 
  Layers, 
  Award, 
  Heart, 
  Tag, 
  Sliders,
  Flame,
  CheckCircle2,
  FileText,
  Share2
} from 'lucide-react';

interface InstagramMediaGeneratorProps {
  productLine: string;
  format: 'post' | 'carousel' | 'reel' | 'story';
  topic: string;
  headline?: string;
  copyText?: string;
}

export const InstagramMediaGenerator: React.FC<InstagramMediaGeneratorProps> = ({
  productLine,
  format: initialFormat,
  topic,
  headline = 'SNACKS 100% NATURALES',
  copyText = 'El premio más saludable y crocante para consentir a tu mascota con amor real 🐾'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Format & Layout Modes
  const [currentFormat, setCurrentFormat] = useState<'post' | 'story'>(initialFormat === 'story' || initialFormat === 'reel' ? 'story' : 'post');
  const [activeVisualMode, setActiveVisualMode] = useState<'canvas' | 'video_studio' | 'copy_hub'>('canvas');
  const [templateStyle, setTemplateStyle] = useState<'hero_spotlight' | 'product_focus' | 'infographic_vs' | 'promo_flash' | 'artisan_process'>('hero_spotlight');
  
  // Text Customization
  const [postTitle, setPostTitle] = useState(headline || 'PECHUGA DE POLLO CROCANTE');
  const [postSubtitle, setPostSubtitle] = useState('0% QUÍMICOS • 100% CARNE REAL');
  const [promoBadgeText, setPromoBadgeText] = useState('LOTE FRESCO • 250g & 500g');
  const [customPriceOrOffer, setCustomPriceOrOffer] = useState('PIDE POR WHATSAPP');
  const [badge1, setBadge1] = useState('✓ 100% Proteína Real');
  const [badge2, setBadge2] = useState('✓ 0% Sal o Aditivos');
  const [badge3, setBadge3] = useState('✓ Deshidratado a 65°C');
  
  // Photo & Image State
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>('');
  const [uploadedCustomPhoto, setUploadedCustomPhoto] = useState<string | null>(null);
  const [isGeneratingAiImg, setIsGeneratingAiImg] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadedImageObj, setLoadedImageObj] = useState<HTMLImageElement | null>(null);
  
  // Video Animation & Recording State
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [currentVideoScene, setCurrentVideoScene] = useState(0);
  const [videoZoomFactor, setVideoZoomFactor] = useState(1.0);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Feedback states
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Brand Palette based on official Brand Manual
  const colorMap: Record<string, { bg: string; text: string; accent: string; label: string; icon: string; nameDisplay: string }> = {
    pollo: { bg: '#f39205', text: '#001253', accent: '#ffffff', label: 'POLLO DESHIDRATADO', icon: '🍗', nameDisplay: 'Pechuga de Pollo Deshidratada' },
    res: { bg: '#e84b1e', text: '#ffffff', accent: '#f8b46b', label: 'RES DESHIDRATADA', icon: '🥩', nameDisplay: 'Carne Magra de Res Premium' },
    cerdo: { bg: '#794092', text: '#b7d588', accent: '#ffffff', label: 'CERDO CROCANTE', icon: '🥓', nameDisplay: 'Lomo de Cerdo Deshidratado' },
    galletas: { bg: '#334c5c', text: '#f8b46b', accent: '#ffffff', label: 'GALLETAS ORGÁNICAS', icon: '🍪', nameDisplay: 'Galletas Orgánicas Horneadas' },
    general: { bg: '#334c5c', text: '#f8b46b', accent: '#ffffff', label: 'SNACKS ORGÁNICOS', icon: '🐾', nameDisplay: 'Snacks y Alimentos Saludables' }
  };

  const currentTheme = colorMap[productLine] || colorMap.general;

  // Official Brand Photography and Real Oreo Dog Gallery
  const photographyPresets: Record<string, Array<{ url: string; title: string; desc: string }>> = {
    pollo: [
      {
        url: '/brand/LOGO DEFINITVO DESHIDRATADOS pollo.png',
        title: 'Logo Oficial Pollo Deshidratado',
        desc: 'Identidad oficial Cachorro Feliz Pollo'
      },
      {
        url: '/photos/20230430_164054.jpg',
        title: 'Oreo disfrutando su snack',
        desc: 'Foto real de Oreo disfrutando de su premio'
      },
      {
        url: '/photos/20230305_083141.jpg',
        title: 'Mascota feliz y consentida',
        desc: 'Pelaje brillante y alimentación natural'
      }
    ],
    res: [
      {
        url: '/brand/LOGO DEFINITVO DESHIDRATADOS RES.png',
        title: 'Logo Oficial Res Premium',
        desc: 'Identidad oficial Cachorro Feliz Res'
      },
      {
        url: '/photos/20230430_164706.jpg',
        title: 'Primer plano de Oreo con pañoleta',
        desc: 'Oreo luciendo la pañoleta oficial de Cachorro Feliz'
      },
      {
        url: '/photos/20230326_173716.jpg',
        title: 'Proteína pura magra',
        desc: 'Snacks deshidratados a 65°C'
      }
    ],
    cerdo: [
      {
        url: '/brand/LOGO DEFINITVO DESHIDRATADOS CERDO.png',
        title: 'Logo Oficial Cerdo Crocante',
        desc: 'Identidad oficial Cachorro Feliz Cerdo'
      },
      {
        url: '/photos/20230430_171258.jpg',
        title: 'Oreo atento y feliz',
        desc: 'Retrato de máxima fidelidad y nutrición natural'
      },
      {
        url: '/photos/20230521_103447.jpg',
        title: 'Alegría en casa',
        desc: 'Momentos felices con snacks saludables'
      }
    ],
    galletas: [
      {
        url: '/brand/LOGO DEFINITVO GALLETAS.png',
        title: 'Logo Oficial Galletas Orgánicas',
        desc: 'Identidad oficial Cachorro Feliz Galletas'
      },
      {
        url: '/photos/1.jpg',
        title: 'Galletas de Avena y Frutas',
        desc: 'Avena, zanahoria, manzana y mantequilla de maní'
      },
      {
        url: '/photos/20221111_105350.jpg',
        title: 'Premios horneados por el Chef',
        desc: 'Ingredientes 100% de grado humano'
      }
    ],
    general: [
      {
        url: '/brand/LOGO DEFINITVO CACHORRO.png',
        title: 'Logo Principal Cachorro Feliz',
        desc: 'Una marca con historia'
      },
      {
        url: '/photos/20230430_164054.jpg',
        title: 'Oreo, el perrito de la marca',
        desc: 'La inspiración de todas las recetas'
      }
    ]
  };

  // Video Storyboard Scenes for Reels/TikTok/Stories
  const videoScenes = [
    {
      time: '0:00 - 0:03s',
      title: '🎯 GANCHO VISUAL (HOOK)',
      description: `Primer plano en cámara lenta de una mascota abriendo los ojos de felicidad al oler el ${currentTheme.label}.`,
      audio: 'Sonido crujiente ("CRUNCH") + Música rítmica en tendencia.',
      screenText: `¿Tu perro haría ESTO por un snack? 🐶✨`
    },
    {
      time: '0:03 - 0:12s',
      title: '🥩 CALIDAD & ELABORACIÓN',
      description: 'Corte rápido mostrando carne magra seleccionada entrando al deshidratador a 65°C.',
      audio: 'Voz en off: "Sin harinas, sin conservantes químicos y 100% artesanal."',
      screenText: '100% Proteína Real • 0% Sal o Químicos'
    },
    {
      time: '0:12 - 0:22s',
      title: '🐾 DEGUSTACIÓN & TEXTURA',
      description: 'Toma macro de la textura crocante partiéndose con la mano y la mascota disfrutándolo.',
      audio: 'Efecto de masticado crocante limpio y satisfactorio.',
      screenText: 'Digestión Ligera & Pelaje Brillante'
    },
    {
      time: '0:22 - 0:30s',
      title: '🚀 LLAMADO A LA ACCIÓN (CTA)',
      description: 'Aparece el empaque con el sticker oficial y el WhatsApp en pantalla gigante.',
      audio: 'Voz en off: "Pide el tuyo por WhatsApp al 3205714504 y recibe en la puerta de tu casa."',
      screenText: '¡PIDE HOY! 📲 WhatsApp: 3205714504\n@snacks_cachorro_feliz'
    }
  ];

  // Set default photo on product line change
  useEffect(() => {
    const presets = photographyPresets[productLine] || photographyPresets.general;
    if (presets && presets.length > 0 && !uploadedCustomPhoto) {
      setSelectedPhotoUrl(presets[0].url);
    }
    
    // Auto-update headline and badges based on product line
    if (productLine === 'pollo') {
      setPostTitle('PECHUGA DE POLLO CROCANTE');
      setPostSubtitle('0% QUÍMICOS • 100% PECHUGA MAGRA');
      setBadge1('✓ 100% Pechuga Real');
      setBadge2('✓ Sin Sal ni Químicos');
      setBadge3('✓ Deshidratado a 65°C');
    } else if (productLine === 'res') {
      setPostTitle('CARNE DE RES PREMIUM');
      setPostSubtitle('ALTA PROTEÍNA • ENERGÍA PURA');
      setBadge1('✓ 100% Carne Magra');
      setBadge2('✓ Cero Rellenos o Harina');
      setBadge3('✓ Textura Irresistible');
    } else if (productLine === 'cerdo') {
      setPostTitle('LOMO DE CERDO CROCANTE');
      setPostSubtitle('SABOR ÚNICO • DIGESTIÓN FÁCIL');
      setBadge1('✓ Lomo Magro Seleccionado');
      setBadge2('✓ Hipoalergénico Natural');
      setBadge3('✓ Máxima Crocancia');
    } else if (productLine === 'galletas') {
      setPostTitle('GALLETAS ORGÁNICAS HORNEADAS');
      setPostSubtitle('AVENA, MANZANA & ZANAHORIA');
      setBadge1('✓ Avena Integral Pura');
      setBadge2('✓ Frutas & Verduras');
      setBadge3('✓ Horneadas con Amor');
    }
  }, [productLine]);

  // Pre-load image object with crossOrigin enabled for canvas rendering
  useEffect(() => {
    const targetUrl = uploadedCustomPhoto || selectedPhotoUrl;
    if (!targetUrl) return;

    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = targetUrl;
    img.onload = () => {
      setLoadedImageObj(img);
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.warn('Could not load image directly with CORS, fallback will be used');
      setImageLoaded(false);
      setLoadedImageObj(null);
    };
  }, [selectedPhotoUrl, uploadedCustomPhoto]);

  // Video playback simulation timer
  useEffect(() => {
    let interval: any;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setCurrentVideoScene((prev) => (prev + 1) % videoScenes.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, videoScenes.length]);

  // =========================================================================
  // MASTER CANVAS RENDERER FUNCTION (COMPOSITES PHOTO + BRANDING + TEXT)
  // =========================================================================
  const drawCompositeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = currentFormat === 'story' ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. BASE BACKGROUND FILL
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, width, height);

    // 2. DRAW HERO PHOTO WITH ZOOM / POSITIONING
    if (loadedImageObj && imageLoaded) {
      ctx.save();
      
      // Calculate crop & fill aspect ratio
      const imgRatio = loadedImageObj.width / loadedImageObj.height;
      const canvasRatio = width / height;
      let renderW = width;
      let renderH = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        renderW = height * imgRatio;
        offsetX = (width - renderW) / 2;
      } else {
        renderH = width / imgRatio;
        offsetY = (height - renderH) / 2;
      }

      // Apply subtle video zoom if active
      if (isVideoPlaying) {
        ctx.translate(width / 2, height / 2);
        ctx.scale(videoZoomFactor, videoZoomFactor);
        ctx.translate(-width / 2, -height / 2);
      }

      ctx.drawImage(loadedImageObj, offsetX, offsetY, renderW, renderH);
      ctx.restore();
    } else {
      // Elegant Geometric Fallback Pattern if image is loading
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.45, 380, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. GRADIENT OVERLAYS (Ensures pristine legibility over any photo)
    const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (templateStyle === 'hero_spotlight') {
      overlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
      overlayGrad.addColorStop(0.18, 'rgba(0, 0, 0, 0.35)');
      overlayGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.15)');
      overlayGrad.addColorStop(0.68, 'rgba(0, 0, 0, 0.75)');
      overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    } else if (templateStyle === 'product_focus') {
      overlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      overlayGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.25)');
      overlayGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.65)');
      overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    } else {
      overlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      overlayGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
      overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.92)');
    }
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, 0, width, height);

    // 4. TOP RIBBON / BRANDING BAR
    const topBarHeight = height === 1920 ? 160 : 130;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, width, topBarHeight);
    
    // Gold Accent Underline
    ctx.fillStyle = '#f8b46b';
    ctx.fillRect(0, topBarHeight - 5, width, 5);

    // Brand Title in Top Ribbon
    ctx.fillStyle = '#f8b46b';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐾 CACHORRO FELIZ • UNA MARCA CON HISTORIA 🐾', width / 2, topBarHeight * 0.48);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 22px sans-serif';
    ctx.fillText('SNACKS ORGÁNICOS & ALIMENTOS SALUDABLES PARA MASCOTAS', width / 2, topBarHeight * 0.82);

    // 5. PRODUCT CATEGORY BADGE (FLOATING PILL)
    const badgeY = topBarHeight + 35;
    ctx.fillStyle = currentTheme.bg;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 280, badgeY, 560, 64, 32);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = currentTheme.text;
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${currentTheme.icon}  ${currentTheme.label}  ${currentTheme.icon}`, width / 2, badgeY + 44);

    // 6. TEMPLATE SPECIFIC CONTENT LAYOUT
    if (templateStyle === 'hero_spotlight') {
      // HERO CARD AT BOTTOM
      const cardY = height === 1920 ? height - 680 : height - 480;
      const cardHeight = height === 1920 ? 460 : 310;

      // Card Background Glass Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(60, cardY, width - 120, cardHeight, 28);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = currentTheme.accent;
      ctx.stroke();

      // Main Headline
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      ctx.textAlign = 'center';
      
      const words = (postTitle || currentTheme.label).split(' ');
      let line = '';
      let textY = cardY + 75;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - 200 && n > 0) {
          ctx.fillText(line.toUpperCase(), width / 2, textY);
          line = words[n] + ' ';
          textY += 60;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.toUpperCase(), width / 2, textY);

      // Subtitle / Tagline
      ctx.fillStyle = '#f8b46b';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(postSubtitle, width / 2, textY + 55);

      // 3 Nutritional Badge Pills
      const pillsY = textY + 105;
      const pills = [badge1, badge2, badge3];
      const pillW = 290;
      const startX = (width - (pillW * 3 + 30)) / 2;

      pills.forEach((p, idx) => {
        const px = startX + idx * (pillW + 15);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.roundRect(px, pillsY, pillW, 50, 25);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(p, px + pillW / 2, pillsY + 33);
      });

    } else if (templateStyle === 'product_focus') {
      // PRODUCT FOCUS: Large Center Sticker
      const centerBoxY = height === 1920 ? 450 : 280;
      
      // Floating Stamp / Discount Badge
      ctx.fillStyle = '#e84b1e';
      ctx.beginPath();
      ctx.arc(width - 160, centerBoxY + 40, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('100%', width - 160, centerBoxY + 25);
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('NATURAL', width - 160, centerBoxY + 55);

      // Lower Info Bar
      const infoY = height === 1920 ? height - 600 : height - 420;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
      ctx.beginPath();
      ctx.roundRect(70, infoY, width - 140, height === 1920 ? 380 : 250, 24);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#f8b46b';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText(postTitle.toUpperCase(), width / 2, infoY + 70);

      ctx.fillStyle = '#f8b46b';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(promoBadgeText, width / 2, infoY + 125);

      ctx.fillStyle = '#ffffff';
      ctx.font = '500 22px sans-serif';
      ctx.fillText('✓ Sin Harinas  ✓ Grado Alimenticio Humano  ✓ Súper Crocante', width / 2, infoY + 180);

    } else if (templateStyle === 'promo_flash') {
      // PROMO FLASH: Big Discount & Urgency Call
      const promoY = height === 1920 ? 500 : 320;

      ctx.fillStyle = '#f8b46b';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 320, promoY, 640, 180, 30);
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#334c5c';
      ctx.stroke();

      ctx.fillStyle = '#334c5c';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText('¡PROMO SEMANAL!', width / 2, promoY + 80);
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(promoBadgeText, width / 2, promoY + 140);

      // Urgency Box
      const urgY = promoY + 230;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.beginPath();
      ctx.roundRect(90, urgY, width - 180, 160, 20);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(postTitle.toUpperCase(), width / 2, urgY + 60);

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('⚡ Lotes Limitados Frescos de la Semana ⚡', width / 2, urgY + 115);

    } else {
      // INFOGRAPHIC VS / ARTISAN PROCESS
      const boxY = height === 1920 ? 460 : 300;
      
      // Comparison Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(60, boxY, width - 120, height === 1920 ? 600 : 360, 24);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#f8b46b';
      ctx.stroke();

      ctx.fillStyle = '#f8b46b';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('¿POR QUÉ ELEGIR CACHORRO FELIZ?', width / 2, boxY + 70);

      // Left Column (Conventional Snacks)
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('❌ Snacks Industriales:', width / 2 - 240, boxY + 140);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '22px sans-serif';
      ctx.fillText('• Harinas y rellenos', width / 2 - 240, boxY + 190);
      ctx.fillText('• Conservantes químicos', width / 2 - 240, boxY + 235);
      ctx.fillText('• Exceso de sal y azúcares', width / 2 - 240, boxY + 280);

      // Right Column (Cachorro Feliz)
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('✅ Cachorro Feliz:', width / 2 + 240, boxY + 140);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('• 100% Proteína Real Pura', width / 2 + 240, boxY + 190);
      ctx.fillText('• Deshidratación lenta a 65°C', width / 2 + 240, boxY + 235);
      ctx.fillText('• Digestión ligera & Pelaje sano', width / 2 + 240, boxY + 280);
    }

    // 7. FOOTER CALL-TO-ACTION BANNER (OFFICIAL WHATSAPP & INSTAGRAM)
    const footerHeight = height === 1920 ? 200 : 160;
    const footerY = height - footerHeight;

    ctx.fillStyle = '#334c5c';
    ctx.fillRect(0, footerY, width, footerHeight);

    // Top border on footer
    ctx.fillStyle = '#f8b46b';
    ctx.fillRect(0, footerY, width, 6);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PEDIDOS POR WHATSAPP: 320 571 4504', width / 2, footerY + 65);

    ctx.fillStyle = '#f8b46b';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('Instagram: @snacks_cachorro_feliz  •  Envíos a Domicilio', width / 2, footerY + 120);

  }, [
    currentFormat, 
    templateStyle, 
    postTitle, 
    postSubtitle, 
    promoBadgeText, 
    badge1, 
    badge2, 
    badge3, 
    currentTheme, 
    loadedImageObj, 
    imageLoaded, 
    isVideoPlaying, 
    videoZoomFactor
  ]);

  // Redraw canvas whenever dependencies change
  useEffect(() => {
    drawCompositeCanvas();
  }, [drawCompositeCanvas]);

  // Video Animation Loop
  useEffect(() => {
    if (isVideoPlaying) {
      let startTime = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - startTime) % 4000;
        const factor = 1.0 + (elapsed / 4000) * 0.08; // Smooth 8% Ken Burns zoom
        setVideoZoomFactor(factor);
        drawCompositeCanvas();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setVideoZoomFactor(1.0);
      drawCompositeCanvas();
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isVideoPlaying, drawCompositeCanvas]);

  // 1-CLICK DOWNLOAD HIGH-RES PNG
  const handleDownloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.download = `Cachorro_Feliz_${productLine.toUpperCase()}_${templateStyle}_${currentFormat}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (e) {
      console.warn('Canvas export triggered directly:', e);
    }
  };

  // RECORD & EXPORT VIDEO (.WEBM / .MP4)
  const handleExportVideoClip = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsRecordingVideo(true);
      setRecordingProgress(0);
      setIsVideoPlaying(true);
      recordedChunksRef.current = [];

      // Capture 30fps stream from canvas
      const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (!stream) {
        alert('Grabación no compatible en este navegador. Puedes usar la descarga de imagen HD.');
        setIsRecordingVideo(false);
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Cachorro_Feliz_Reel_${productLine.toUpperCase()}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          setIsRecordingVideo(false);
          setIsVideoPlaying(false);
        }, 100);
      };

      mediaRecorder.start();

      // Record for 6 seconds (sample animation loop)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setRecordingProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          mediaRecorder.stop();
        }
      }, 1200);

    } catch (err: any) {
      console.error('Error recording video:', err);
      setIsRecordingVideo(false);
      setIsVideoPlaying(false);
      alert('Error iniciando grabación de video: ' + err.message);
    }
  };

  // Upload Custom Photo handler
  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedCustomPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Copy Full Instagram Caption to Clipboard
  const handleCopyFullCaption = () => {
    const fullCaptionText = `🐾 ${postTitle.toUpperCase()} • SNACKS 100% NATURALES 🐾

${copyText}

✨ ¿Por qué es el snack favorito de los consentidos?
${badge1}
${badge2}
${badge3}
🍗 Textura crocante que ayuda a la limpieza dental
❤️ 100% Grado Alimenticio Humano y digestión ligera

📦 Presentaciones disponibles: Bolsa 250g y 500g (Libra).
🏷️ Conserva la frescura con empaque hermético sellado.

🚀 ¡Haz tu pedido fresco de esta semana!
📲 WhatsApp Directo: 320 571 4504
🔗 Enlace de Pedidos: https://wa.me/573205714504?text=Hola%20Cachorro%20Feliz!%20Quiero%20pedir%20snacks%20de%20${encodeURIComponent(currentTheme.label)}

Síguenos en Instagram: @snacks_cachorro_feliz
"Una Marca con Historia" • Snacks Orgánicos Premium

#CachorroFeliz #${productLine}Deshidratado #SnacksNaturales #PerrosColombia #MascotasSaludables #NutricionCanina #PremiosSaludables #SnacksParaPerros #AlimentacionNatural #UnaMarcaConHistoria`;

    navigator.clipboard.writeText(fullCaptionText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E0D7C6] shadow-sm space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#334c5c] text-[#f8b46b]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bebas text-2xl font-bold text-[#334c5c] leading-none">
                Estudio Creativo Autónomo • Instagram & Video
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Genera piezas gráficas HD de alta conversión y guiones de video listos para publicar
              </p>
            </div>
          </div>
        </div>

        {/* Studio View Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveVisualMode('canvas')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeVisualMode === 'canvas' 
                ? 'bg-[#334c5c] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Diseño Gráfico HD</span>
          </button>

          <button
            onClick={() => setActiveVisualMode('video_studio')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeVisualMode === 'video_studio' 
                ? 'bg-[#334c5c] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Reels & Video</span>
          </button>

          <button
            onClick={() => setActiveVisualMode('copy_hub')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeVisualMode === 'copy_hub' 
                ? 'bg-[#334c5c] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Copy & Hashtags</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: VISUAL DESIGN STUDIO (CANVAS HD WITH PHOTO COMPOSITION) */}
      {/* ========================================================================= */}
      {activeVisualMode === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Template Layout Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <label className="text-xs font-bold text-[#334c5c] block uppercase tracking-wider">
                1. Estilo de Plantilla Gráfica:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hero_spotlight', label: '🌟 Hero Mascota & Snack', desc: 'Foto de impacto + Tarjeta de beneficios' },
                  { id: 'product_focus', label: '🥩 Foco en Producto', desc: 'Primer plano + Sello 100% Natural' },
                  { id: 'promo_flash', label: '🎁 Promo de la Semana', desc: 'Insignia de oferta + Urgencia' },
                  { id: 'infographic_vs', label: '⚖️ Infografía VS Químicos', desc: 'Comparativa con snacks comerciales' }
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setTemplateStyle(tpl.id as any)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      templateStyle === tpl.id
                        ? 'bg-[#334c5c] text-white border-[#334c5c] shadow-sm ring-2 ring-[#f8b46b]/40'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold block">{tpl.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${templateStyle === tpl.id ? 'text-slate-200' : 'text-slate-500'}`}>
                      {tpl.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Photo Selector & Upload */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#334c5c] block uppercase tracking-wider">
                  2. Foto Principal de la Publicación:
                </label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#334c5c] hover:text-[#f8b46b] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Mi Foto</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomPhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Photo presets thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                {(photographyPresets[productLine] || photographyPresets.general).map((preset, idx) => {
                  const isSelected = selectedPhotoUrl === preset.url && !uploadedCustomPhoto;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setUploadedCustomPhoto(null);
                        setSelectedPhotoUrl(preset.url);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                        isSelected ? 'border-[#f8b46b] ring-2 ring-[#f8b46b]/50 scale-102' : 'border-slate-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1">
                        <span className="text-[9px] text-white font-bold truncate leading-tight">
                          {preset.title}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-[#f8b46b] text-[#334c5c] p-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {uploadedCustomPhoto && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-medium">
                  <span>📸 Usando tu foto personalizada cargada</span>
                  <button
                    onClick={() => setUploadedCustomPhoto(null)}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>

            {/* 3. Text Customizer */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <label className="text-xs font-bold text-[#334c5c] block uppercase tracking-wider">
                3. Textos & Mensajes en el Arte:
              </label>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Título Principal:
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#334c5c]"
                  placeholder="Ej: PECHUGA DE POLLO CROCANTE"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Subtítulo / Lema:
                  </label>
                  <input
                    type="text"
                    value={postSubtitle}
                    onChange={(e) => setPostSubtitle(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300"
                    placeholder="Ej: 0% QUÍMICOS • 100% CARNE REAL"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Insignia Destacada:
                  </label>
                  <input
                    type="text"
                    value={promoBadgeText}
                    onChange={(e) => setPromoBadgeText(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300"
                    placeholder="Ej: BOLSA 250g & 500g"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <input
                  type="text"
                  value={badge1}
                  onChange={(e) => setBadge1(e.target.value)}
                  className="text-[10px] p-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                />
                <input
                  type="text"
                  value={badge2}
                  onChange={(e) => setBadge2(e.target.value)}
                  className="text-[10px] p-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                />
                <input
                  type="text"
                  value={badge3}
                  onChange={(e) => setBadge3(e.target.value)}
                  className="text-[10px] p-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                />
              </div>
            </div>

            {/* 4. Format Selector (Feed 1:1 vs Story 9:16) */}
            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-2xl">
              <span className="text-xs font-bold text-slate-700">Dimensión de la Imagen:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentFormat('post')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currentFormat === 'post' ? 'bg-[#334c5c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cuadrado 1:1 (Feed)
                </button>
                <button
                  onClick={() => setCurrentFormat('story')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currentFormat === 'story' ? 'bg-[#334c5c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vertical 9:16 (Historia)
                </button>
              </div>
            </div>

            {/* Action Download Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDownloadCanvas}
                className="w-full bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer active:scale-95 border border-[#f8b46b]/40"
              >
                <Download className="w-4 h-4 text-[#f8b46b]" />
                <span>📥 Descargar Imagen PNG en Alta Definición (1080px)</span>
              </button>

              <button
                onClick={handleCopyFullCaption}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer border border-slate-300"
              >
                {copiedCaption ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">¡Copy y Hashtags Copiados al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Copiar Texto Completo para el Post</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visual Preview Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Top Preview Bar */}
            <div className="w-full flex items-center justify-between mb-3 text-slate-400 text-xs font-mono">
              <span>CANVAS HD • {currentFormat === 'story' ? '1080 x 1920 px (9:16)' : '1080 x 1080 px (1:1)'}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Listo para Publicar
              </span>
            </div>

            {/* Canvas Container */}
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all ${
              currentFormat === 'story' ? 'max-w-[260px] sm:max-w-[300px]' : 'max-w-[340px] sm:max-w-[420px]'
            }`}>
              <canvas
                ref={canvasRef}
                className="w-full h-auto object-contain block"
              />
            </div>

            {/* Quick Live Preview Caption */}
            <div className="mt-4 w-full bg-black/40 p-3 rounded-2xl border border-white/10 text-center">
              <span className="text-[11px] text-[#f8b46b] font-bold block mb-1">
                🐾 Color Oficial: {currentTheme.label} ({currentTheme.bg})
              </span>
              <p className="text-[10px] text-slate-300 max-w-md mx-auto">
                Esta pieza contiene los datos exactos del Manual de Marca: tipografía estilizada, color oficial de línea, WhatsApp de pedidos y sello artesanal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: REEL & VIDEO STUDIO (ANIMATED EXPORT & STORYBOARD) */}
      {/* ========================================================================= */}
      {activeVisualMode === 'video_studio' && (
        <div className="space-y-6">
          {/* Top Video Player Simulation */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-[#f8b46b] font-bold uppercase tracking-wider block">
                  Generador de Reels & TikToks (30 Segundos)
                </span>
                <h4 className="font-bebas text-2xl text-white tracking-wide">
                  Guion Cinematográfico: {currentTheme.label}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isVideoPlaying ? 'bg-amber-500 text-slate-900' : 'bg-[#f8b46b] text-[#334c5c]'
                  }`}
                >
                  {isVideoPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pausar Simulación</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Simular Video en Vivo</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportVideoClip}
                  disabled={isRecordingVideo}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:bg-slate-700"
                >
                  {isRecordingVideo ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Grabando ({recordingProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <span>🎥 Exportar Video Clip (.webm)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Video Scenes Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
              {videoScenes.map((scene, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentVideoScene(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    currentVideoScene === idx
                      ? 'bg-white/15 border-[#f8b46b] ring-2 ring-[#f8b46b]/40 shadow-xl scale-102'
                      : 'bg-black/40 border-white/10 hover:bg-white/5 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-[#f8b46b] font-bold">
                        {scene.time}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">Escena {idx + 1}</span>
                    </div>
                    <h5 className="font-bebas text-lg text-white tracking-wide mb-1.5">
                      {scene.title}
                    </h5>
                    <p className="text-xs text-slate-300 leading-snug mb-3">
                      {scene.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-white/10 text-[11px] space-y-1.5">
                    <p className="text-amber-300 font-medium">
                      🎵 <strong>Audio:</strong> {scene.audio}
                    </p>
                    <p className="text-emerald-300 font-bold">
                      📝 <strong>Texto en Pantalla:</strong> {scene.screenText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: COPYWRITING & HASHTAGS HUB */}
      {/* ========================================================================= */}
      {activeVisualMode === 'copy_hub' && (
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h4 className="font-bebas text-2xl text-[#334c5c]">
                Estrategia de Redacción & Conversión (Copywriting)
              </h4>
              <p className="text-xs text-slate-500">
                Texto estructurado para generar confianza, educar sobre ingredientes y cerrar ventas por WhatsApp
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyFullCaption}
                className="bg-[#334c5c] text-[#f8b46b] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer hover:bg-[#273a46]"
              >
                {copiedCaption ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCaption ? '¡Copiado!' : 'Copiar Texto Completo'}</span>
              </button>

              <a
                href={`https://wa.me/573205714504?text=Hola%20Cachorro%20Feliz!%20Quiero%20pedir%20snacks%20de%20${encodeURIComponent(currentTheme.label)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer hover:bg-emerald-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Probar Enlace WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans shadow-xs">
            {`🐾 ${postTitle.toUpperCase()} • SNACKS 100% NATURALES 🐾

${copyText}

✨ ¿Por qué es el snack favorito de los consentidos?
${badge1}
${badge2}
${badge3}
🍗 Textura crocante que ayuda a la limpieza dental
❤️ 100% Grado Alimenticio Humano y digestión ligera

📦 Presentaciones disponibles: Bolsa 250g y 500g (Libra).
🏷️ Conserva la frescura con empaque hermético sellado.

🚀 ¡Haz tu pedido fresco de esta semana!
📲 WhatsApp Directo: 320 571 4504
📍 Envíos directos a tu puerta.

Síguenos en Instagram: @snacks_cachorro_feliz
"Una Marca con Historia" • Snacks Orgánicos Premium

#CachorroFeliz #${productLine}Deshidratado #SnacksNaturales #PerrosColombia #MascotasSaludables #NutricionCanina #PremiosSaludables #SnacksParaPerros #AlimentacionNatural #UnaMarcaConHistoria`}
          </div>
        </div>
      )}
    </div>
  );
};
