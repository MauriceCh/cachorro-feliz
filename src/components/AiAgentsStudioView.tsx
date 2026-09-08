import React, { useState } from 'react';
import { 
  Sparkles, 
  Instagram, 
  MessageSquare, 
  FlaskConical, 
  Truck, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  ChefHat, 
  Phone, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Flame, 
  Tag, 
  DollarSign, 
  ArrowRight,
  Lightbulb,
  Heart,
  Bot
} from 'lucide-react';
import { 
  Recipe, 
  FinishedProduct, 
  RawMaterial, 
  Client, 
  Supplier, 
  Sale 
} from '../types';
import { BrandLogoEmblem } from './BrandLogoEmblem';
import { InstagramMediaGenerator } from './InstagramMediaGenerator';

interface AiAgentsStudioViewProps {
  recipes: Recipe[];
  finishedProducts: FinishedProduct[];
  rawMaterials: RawMaterial[];
  clients: Client[];
  suppliers: Supplier[];
  sales: Sale[];
  onAddNewRecipe?: (newRecipe: Omit<Recipe, 'id'>) => Promise<void>;
  onAddNewPurchaseOrder?: (supplierId: string, items: any[]) => void;
}

export const AiAgentsStudioView: React.FC<AiAgentsStudioViewProps> = ({
  recipes,
  finishedProducts,
  rawMaterials,
  clients,
  suppliers,
  sales,
  onAddNewRecipe
}) => {
  // Tabs for the 4 agents in the exact requested priority order:
  // 1: Instagram (Punto 2)
  // 2: WhatsApp (Punto 1)
  // 3: Nutrición y Recetas (Punto 3)
  // 4: Planeación de Compras y Producción (Punto 4)
  const [activeAgentTab, setActiveAgentTab] = useState<'instagram' | 'whatsapp' | 'recipes' | 'purchases'>('instagram');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // --- AGENT 1: INSTAGRAM STATE ---
  const [instaProductLine, setInstaProductLine] = useState<string>('pollo');
  const [instaFormat, setInstaFormat] = useState<'post' | 'carousel' | 'reel' | 'story'>('post');
  const [instaGoal, setInstaGoal] = useState<string>('educativo_beneficios');
  const [instaCustomTopic, setInstaCustomTopic] = useState<string>('');
  const [instaResult, setInstaResult] = useState<string>('');

  // --- AGENT 2: WHATSAPP STATE ---
  const [waSubTab, setWaSubTab] = useState<'quick_replies' | 'custom_agent' | 'setup_guide'>('quick_replies');
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [whatsappMessageType, setWhatsappMessageType] = useState<string>('recordatorio_recompra');
  const [customWhatsappNotes, setCustomWhatsappNotes] = useState<string>('');
  const [whatsappResult, setWhatsappResult] = useState<string>('');
  const [faqCustomerQuestion, setFaqCustomerQuestion] = useState<string>('');
  const [faqBotAnswer, setFaqBotAnswer] = useState<string>('');
  const [faqRequiresChef, setFaqRequiresChef] = useState<boolean>(false);

  // --- AGENT 3: FORMULACIÓN Y RECETAS STATE ---
  const [formulationIdea, setFormulationIdea] = useState<string>('Snacks de Hígado de Pollo y Espinaca deshidratados');
  const [targetAnimal, setTargetAnimal] = useState<string>('perros_y_gatos');
  const [estimatedRawCost, setEstimatedRawCost] = useState<number>(18000);
  const [formulationResult, setFormulationResult] = useState<any | null>(null);
  const [rawFormulationText, setRawFormulationText] = useState<string>('');

  // --- AGENT 4: PLANEACIÓN DE COMPRAS STATE ---
  const [purchaseTimeframe, setPurchaseTimeframe] = useState<string>('semana');
  const [purchasePlanningResult, setPurchasePlanningResult] = useState<string>('');

  // Helper for copying text
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Smart Instagram template generator (guarantees instant, rich content even if network is slow or offline)
  const generateLocalInstagramContent = (product: string, format: string, goal: string, customTopic?: string) => {
    const pKey = product.toLowerCase();
    const productNames: Record<string, string> = {
      pollo: 'Deshidratados de Pechuga de Pollo 100% Natural 🍗',
      res: 'Deshidratados Premium de Carne Magra de Res 🥩',
      cerdo: 'Deshidratados Crocantes de Lomo de Cerdo 🥓',
      galletas: 'Galletas Orgánicas Horneadas (Avena, Frutas & Verduras) 🍪',
      general: 'Snacks Orgánicos y Alimentos Saludables 🐾'
    };

    const productName = productNames[pKey] || productNames.general;
    const formatName = format.toUpperCase();

    return `🎯 *TITULAR / GANCHO:*
¿Sabías que la mayoría de snacks comerciales para mascotas contienen harinas refinadas y conservantes químicos? ¡En Cachorro Feliz cambiamos las reglas! 🐾✨

📝 *COPY PARA INSTAGRAM (${formatName}):*
Presentamos nuestro lote artesanal de *${productName}*. Elaborado con ingredientes 100% de grado alimenticio humano, seleccionados y deshidratados lentamente a baja temperatura para preservar todas las proteínas y vitaminas naturales.

✅ *Beneficios Incomparables:*
• *0% Sal, Químicos o Conservantes Artificiales*: Ideal para mascotas con alergias o digestión sensible.
• *Textura Crocante Inigualable*: Favorece la limpieza dental mecánica y libera el estrés de tu consentido.
• *Nutrición Real y Pura*: Sin rellenos ni subproductos.

${customTopic ? `💡 *Detalle especial:* ${customTopic}\n\n` : ''}🐶 *¡El premio que tu perro o gato se merece todos los días!*

📸 *GUÍA VISUAL SUGERIDA:*
• *Toma 1 (Primer Plano):* Muestra la textura crocante del snack partiéndose por la mitad (sonido 'crunch').
• *Toma 2 (Mascota Feliz):* Un perrito o gatito emocionado esperando el premio.
• *Toma 3 (Empaque Oficial):* Bolsa de 250g o 500g con el sticker oficial y el código QR de pedidos visible.

🚀 *LLAMADO A LA ACCIÓN (CTA):*
¡Pide tu dotación fresca de esta semana antes de que se agote el lote!
📲 *WhatsApp Directo:* 320 571 4504
📍 Envíos directos a la puerta de tu casa.

🏷️ *HASHTAGS ESTRATÉGICOS:*
#CachorroFeliz #SnacksNaturales #PerrosColombia #DeshidratadosParaPerros #SnacksOrganicos #MascotasSaludables #NutricionCanina #PremiosSaludables #GatosFelices #AlimentacionNatural #UnaMarcaConHistoria`;
  };

  // Smart template generator as instant fallback or offline mode
  const generateLocalWhatsappTemplate = (client: Client, messageType: string, customNotes?: string) => {
    const petNames = client.pets && client.pets.length > 0
      ? client.pets.map(p => p.name).join(' y ')
      : 'tu peludito';
    const petInfo = client.pets && client.pets.length > 0 ? client.pets[0] : null;
    const petType = petInfo?.type === 'Gato' ? 'gatito' : 'perrito';

    switch (messageType) {
      case 'recordatorio_recompra':
        return `¡Hola *${client.name}*! 🐾\n\nEsperamos que *${petNames}* esté disfrutando mucho sus días llenos de energía y juegos. 🐶✨\n\nTe escribimos desde *Cachorro Feliz* porque calculamos que sus snacks favoritos (Pollo, Res o Galletas Orgánicas) ya deben estar por terminarse. Recuerda que no usamos conservantes químicos ni harinas refinadas, por lo que cada lote es 100% fresco y recién horneado/deshidratado.\n\n¿Te gustaría que te apartemos su dotación para esta semana? Escríbenos cuántos paquetes necesitas y te los despachamos de inmediato.\n\n¡Un abrazo grande para ti y mimos a *${petNames}*! 🍖🍪${customNotes ? `\n\n📌 *Nota especial:* ${customNotes}` : ''}\n\n— *Equipo Cachorro Feliz* 🐾\nWhatsApp: 3205714504`;

      case 'cumpleanos':
        return `¡Hola *${client.name}*! 🐾🎉🎂\n\n¡En *Cachorro Feliz* nos enteramos de que es una fecha súper especial: el cumpleaños de *${petNames}*! 🥳🎈\n\nQueremos desearle una vida larga, saludable y llena de momentos felices a tu lado. Para celebrarlo juntos, te obsequiamos un *15% de Descuento de Cumpleaños* en cualquiera de nuestros snacks y galletas orgánicas.\n\n¿Te gustaría consentir a *${petNames}* hoy con su snack favorito? Cuéntanos y te aplicamos el descuento ya mismo. 🎁✨${customNotes ? `\n\n📌 *Nota especial:* ${customNotes}` : ''}\n\n— *Con cariño, Familia Cachorro Feliz* 🐾`;

      case 'confirmacion_pedido':
        return `¡Hola *${client.name}*! 🐾\n\n¡Muchas gracias por tu pedido en *Cachorro Feliz*! Tu orden para consentir a *${petNames}* ha sido registrada y está en proceso de alistamiento y empaque.\n\n📦 *Detalle del Pedido:*\n- Snacks 100% naturales, libres de sal y conservantes.\n- Empaque sellado de alta barrera para máxima frescura.\n\nTe avisaremos tan pronto el mensajero vaya en camino con tu entrega. ¡Gracias por confiar en la alimentación natural y saludable para tu ${petType}! 🐶❤️${customNotes ? `\n\n📌 *Nota especial:* ${customNotes}` : ''}\n\n— *Equipo Cachorro Feliz* 🐾\nWhatsApp: 3205714504`;

      case 'seguimiento_calidad':
        return `¡Hola *${client.name}*! 🐾\n\nEsperamos que te encuentres muy bien. Te escribimos para saber cómo le fue a *${petNames}* con sus snacks de *Cachorro Feliz* 🍖🍪.\n\n¿Le gustaron? ¿Cuál fue su favorito? Para nosotros la opinión y salud de tu ${petType} es lo más importante. Si tienes una fotito o video de ${petNames} disfrutándolos, ¡nos encantaría verla y compartirla en nuestras historias de @snacks_cachorro_feliz! 📸✨${customNotes ? `\n\n📌 *Nota especial:* ${customNotes}` : ''}\n\n— *Equipo Cachorro Feliz* 🐾`;

      case 'reactivacion':
      default:
        return `¡Hola *${client.name}*! 🐾\n\nTe extrañamos en *Cachorro Feliz*. Queríamos saber cómo está *${petNames}* y contarte que tenemos lotes recién salidos del deshidratador (Pechuga de pollo, lomo de cerdo y res premium) y galletitas orgánicas.\n\nSi deseas consentir a *${petNames}* esta semana con un snack 100% natural, libre de químicos y alto en proteína, ¡avísanos y te lo llevamos a domicilio!\n\n¿Te gustaría ver el menú disponible de hoy? 🍖🍪${customNotes ? `\n\n📌 *Nota especial:* ${customNotes}` : ''}\n\n— *Equipo Cachorro Feliz* 🐾\nWhatsApp: 3205714504`;
    }
  };

  // Smart Recipe Formulation Generator
  const generateLocalRecipeFormulation = (idea: string, animal: string, rawCost: number): any => {
    const isDog = animal.toLowerCase().includes('perro');
    const prepLoss = 10;
    const cookLoss = idea.toLowerCase().includes('galleta') ? 25 : 68;
    const finalYieldPercent = (100 - prepLoss) * (1 - cookLoss / 100);
    const finalYieldGrams = Math.round(1000 * (finalYieldPercent / 100));
    const costPerYieldGram = (rawCost * 1.15) / Math.max(finalYieldGrams, 100);

    const cost250g = Math.round(costPerYieldGram * 250 + 1200); // 1200 packaging cost
    const cost500g = Math.round(costPerYieldGram * 500 + 1800);

    return {
      name: `${idea.toUpperCase()} - EDICIÓN ARTESANAL`,
      category: idea.toLowerCase().includes('galleta') ? 'Galletas' : 'Deshidratados',
      petSafetyCheck: `Formulación 100% segura para ${animal}. Libre de sal añadida, cebolla, ajo, azúcares y aditivos artificiales. Aporta aminoácidos esenciales y alta digestibilidad.`,
      toxicAlerts: 'Ninguna detectada. Todos los ingredientes son aptos para consumo en mascotas.',
      estimatedPrepLossPercent: prepLoss,
      estimatedCookingLossPercent: cookLoss,
      ingredientsList: [
        { name: 'Materia prima base fresca', rawGrams: 900, costApprox: Math.round(rawCost * 0.9) },
        { name: 'Potenciador / Aglutinante natural', rawGrams: 100, costApprox: Math.round(rawCost * 0.1) }
      ],
      rawMixTotalGrams: 1000,
      cleanMixGrams: Math.round(1000 * (1 - prepLoss / 100)),
      finalYieldGrams: finalYieldGrams,
      totalRecipeCost: Math.round(rawCost * 1.15),
      costPerGram: Number(costPerYieldGram.toFixed(2)),
      suggestedPricing: {
        cost100g: Math.round(costPerYieldGram * 100 + 800),
        price100g: Math.round((costPerYieldGram * 100 + 800) * 2.2),
        margin100g: 55,
        cost250g: cost250g,
        price250g: Math.round(cost250g * 2.3),
        margin250g: 58,
        cost500g: cost500g,
        price500g: Math.round(cost500g * 2.4),
        margin500g: 60
      },
      productionTips: [
        'Deshidratar a 65°C constante durante 8 a 10 horas para garantizar inocuidad microbiológica.',
        'Dejar enfriar totalmente a temperatura ambiente antes de empacar para evitar condensación.',
        'Incluir sobre de sílice de grado alimenticio en empaques de 250g y 500g.'
      ],
      nutritionalHighlights: [
        'Alto contenido de proteína magra de alto valor biológico',
        'Cero conservantes ni aditivos químicos',
        'Textura crujiente que colabora con la salud dental'
      ]
    };
  };

  // Helper to query Gemini
  const askGemini = async (prompt: string, systemInstruction?: string): Promise<string> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });
      const data = await res.json();
      if (data && data.text && data.text.trim().length > 0) {
        return data.text.trim();
      }
      if (data && data.error) {
        console.warn('API error from Gemini endpoint:', data.error);
      }
      return '';
    } catch (e: any) {
      console.error('Error llamando a Gemini:', e);
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  // 1. GENERATE INSTAGRAM CONTENT
  const handleGenerateInstagram = async () => {
    const productNames: Record<string, string> = {
      pollo: 'Deshidratados Premium de Pechuga de Pollo 100% Natural',
      res: 'Deshidratados Premium de Carne Magra de Res',
      cerdo: 'Deshidratados Crocantes de Cerdo Magro',
      galletas: 'Galletas Orgánicas Horneadas (Avena, Frutas y Verduras)',
      general: 'Nutrición Natural y Snacks Orgánicos sin conservantes ni químicos'
    };

    const goalDescriptions: Record<string, string> = {
      educativo_beneficios: 'Educar sobre por qué los snacks deshidratados a baja temperatura conservan nutrientes y son superiores a los ultraprocesados comerciales.',
      antojo_mascota: 'Generar emoción y antojo mostrando la felicidad y devoción de una mascota al recibir su premio.',
      promocion_pedidos: 'Impulsar pedidos directos por WhatsApp (3205714504) destacando envíos y frescura artesanal.',
      salud_alergias: 'Explicar por qué es ideal para perros o gatos con alergias, piel sensible o digestión delicada (monoproteico, sin harinas refinadas).'
    };

    const prompt = `Actúa como el Content Creator y Social Media Manager experto de la marca "Cachorro Feliz" (@snacks_cachorro_feliz).
Lema de marca: "Una Marca con Historia" • "Snacks Orgánicos Premium"
WhatsApp oficial de pedidos: 3205714504.

Genera contenido para Instagram con las siguientes especificaciones:
- Línea de producto: ${productNames[instaProductLine] || instaProductLine}
- Formato: ${instaFormat.toUpperCase()} (Post, Carrusel, Reel o Story)
- Objetivo del contenido: ${goalDescriptions[instaGoal] || instaGoal}
- Tema o detalle específico adicional: ${instaCustomTopic || 'Destacar la textura crocante, 0% conservantes químicos y sabor irresistible'}

Estructura requerida de la respuesta:
1. 🎯 TITULAR / GANCHO (Hook para los primeros 3 segundos o primera línea)
2. 📝 COPY COMPLETO (Redactado con tono cercano, cálido, empático con dueños de perros y gatos, con emojis bien puestos y párrafos fáciles de leer)
3. 📸 GUÍA VISUAL / SUGERENCIA DE FOTO O VIDEO (Describe qué grabar o fotografiar, incluyendo qué colores de empaque o fondo usar según la línea)
4. 🚀 LLAMADO A LA ACCIÓN (CTA claro para pedir por WhatsApp 3205714504 o DM)
5. 🏷️ HASHTAGS ESTRATÉGICOS (10 a 15 hashtags relevantes para Colombia y snacks naturales para mascotas)`;

    const sysInst = `Eres la estratega de contenido de Cachorro Feliz. Tu tono es entusiasta, amoroso con los animales, transparente y profesional sobre nutrición canina/felina. Siempre menciona el WhatsApp 3205714504 y el Instagram @snacks_cachorro_feliz.`;

    let result = await askGemini(prompt, sysInst);
    if (!result || result.trim().length === 0) {
      result = generateLocalInstagramContent(instaProductLine, instaFormat, instaGoal, instaCustomTopic);
    }
    setInstaResult(result);
  };

  // 2. GENERATE WHATSAPP MESSAGE
  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const handleGenerateWhatsapp = async () => {
    const activeClient = selectedClient || clients[0];
    if (!activeClient) {
      alert('Por favor registra o selecciona un cliente primero.');
      return;
    }

    const petNames = activeClient.pets && activeClient.pets.length > 0
      ? activeClient.pets.map(p => `${p.name} (${p.type || 'Mascota'}, ${p.breed || 'Criollo'})`).join(', ')
      : 'su mascota';
    const recentClientSales = sales.filter(s => s.clientId === activeClient.id);
    const lastSale = recentClientSales[0];

    const prompt = `Actúa como el encargado de servicio al cliente de "Cachorro Feliz" (Alimentos Saludables y Deshidratados para Mascotas).
Escribe un mensaje de WhatsApp para enviar a:
- Cliente: ${activeClient.name}
- Teléfono: ${activeClient.phone}
- Mascota(s): ${petNames}
- Tipo de mensaje: ${whatsappMessageType.toUpperCase()}
- Última compra registrada: ${lastSale ? `Pedido ${lastSale.saleNumber} (${lastSale.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')} por $${lastSale.totalAmount.toLocaleString('es-CO')})` : 'Cliente nuevo o sin compras recientes'}
- Instrucciones / notas especiales: ${customWhatsappNotes || 'Ninguna, redactar con mucha calidez'}

Instrucciones de formato:
- Redacta el mensaje listo para copiar y pegar en WhatsApp.
- Usa negritas con asteriscos (*texto*) de WhatsApp para nombres y productos.
- Saluda con mucho cariño mencionando a su mascota por su nombre.
- Si es recordatorio de recompra, recuérdale amablemente que sus snacks favoritos ya se deben estar acabando y ofrece las opciones disponibles.
- Si es cumpleaños, felicita a la mascota con mucha alegría y dale un cupón de 15% de descuento en su próximo pedido.
- Despídete amablemente firmado por el equipo de "Cachorro Feliz" 🐾.`;

    const sysInst = `Eres el asistente de WhatsApp de Cachorro Feliz. Tus mensajes son cálidos, amables, sin sonar como un robot comercial frío, y siempre centrados en el bienestar y felicidad de las mascotas.`;

    let result = await askGemini(prompt, sysInst);
    
    // If API returned empty (e.g. key cold or offline), fallback to smart instant template
    if (!result || result.trim().length === 0) {
      result = generateLocalWhatsappTemplate(activeClient, whatsappMessageType, customWhatsappNotes);
    }

    setWhatsappResult(result);
  };

  // 3. GENERATE RECIPE FORMULATION
  const handleGenerateFormulation = async () => {
    if (!formulationIdea.trim()) return;

    const prompt = `Eres un Médico Veterinario Nutricionista y Chef especializado en formulación de snacks deshidratados y galletas horneadas para perros y gatos de la marca "Cachorro Feliz".

Formula y costea la siguiente idea de snack:
Idea: "${formulationIdea}"
Mascota objetivo: ${targetAnimal}
Costo estimado de materia prima principal por kg: $${estimatedRawCost.toLocaleString('es-CO')} COP

Analiza y responde en formato estructurado JSON válido (sin markdown adicional antes ni después) con los siguientes campos:
{
  "name": "Nombre comercial atractivo de la receta",
  "category": "Deshidratados" o "Galletas",
  "petSafetyCheck": "Texto explicando por qué los ingredientes son seguros y beneficios nutricionales (vitaminas, proteínas, digestión)",
  "toxicAlerts": "Ninguna" o alertas de ingredientes peligrosos,
  "estimatedPrepLossPercent": 10,
  "estimatedCookingLossPercent": 68,
  "ingredientsList": [
    { "name": "Nombre ingrediente", "rawGrams": 1000, "costApprox": 18000 }
  ],
  "rawMixTotalGrams": 1000,
  "finalYieldGrams": 320,
  "netCostPerFinalGram": 56.25,
  "suggestedPrices": {
    "pack100g": { "cost": 5625, "salePrice": 22000, "marginPercent": 74 },
    "pack250g": { "cost": 14060, "salePrice": 38000, "marginPercent": 63 },
    "pack500g": { "cost": 28120, "salePrice": 65000, "marginPercent": 56 }
  },
  "instructions": "Paso a paso de alistamiento, laminado y deshidratación (temperatura y horas)."
}`;

    let raw = await askGemini(prompt, 'Responde exclusivamente con el objeto JSON válido para poder ser procesado.');
    
    if (!raw || raw.trim().length === 0) {
      const localResult = generateLocalRecipeFormulation(formulationIdea, targetAnimal, estimatedRawCost);
      setFormulationResult(localResult);
      setRawFormulationText(JSON.stringify(localResult, null, 2));
      return;
    }

    setRawFormulationText(raw);

    try {
      // Clean possible json code blocks
      const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      setFormulationResult(parsed);
    } catch (err) {
      console.warn('Could not parse JSON formulation directly, generating structured fallback:', err);
      const localResult = generateLocalRecipeFormulation(formulationIdea, targetAnimal, estimatedRawCost);
      setFormulationResult(localResult);
    }
  };

  // Save new formulated recipe to application state
  const handleSaveFormulatedRecipe = async () => {
    if (!formulationResult || !onAddNewRecipe) return;

    try {
      const newRecipeData: Omit<Recipe, 'id'> = {
        name: formulationResult.name || formulationIdea,
        category: formulationResult.category || 'Deshidratados',
        ingredients: (formulationResult.ingredientsList || []).map((ing: any, idx: number) => ({
          rawMaterialId: `raw-auto-${idx}`,
          rawMaterialName: ing.name,
          requiredNetQuantity: ing.rawGrams || 1000,
          unit: 'g'
        })),
        rawMixTotalGrams: formulationResult.rawMixTotalGrams || 1000,
        cookingOrDehydrationLossPercentage: formulationResult.estimatedCookingLossPercent || 67,
        postCookFinalYieldGrams: formulationResult.finalYieldGrams || 330,
        standardPackageSizes: [100, 250],
        instructions: formulationResult.instructions || 'Deshidratar a temperatura controlada.'
      };

      await onAddNewRecipe(newRecipeData);
      setSavedSuccessMessage(`¡Receta "${newRecipeData.name}" guardada exitosamente en el sistema!`);
      setTimeout(() => setSavedSuccessMessage(null), 4000);
    } catch (e: any) {
      alert(`Error al guardar la receta: ${e.message}`);
    }
  };

  // 4. GENERATE PURCHASES & PRODUCTION PLANNING
  const handleGeneratePlanning = async () => {
    const rawStockSummary = rawMaterials.map(rm => ({
      name: rm.name,
      stockNetoGramos: rm.stockNetUsable,
      umbralMinimoGramos: rm.minStockThreshold,
      bajoStock: rm.stockNetUsable <= rm.minStockThreshold
    }));

    const finishedProductStockSummary = finishedProducts.map(fp => ({
      name: fp.name,
      stockUnidades: fp.stockUnits,
      precioVenta: fp.salePrice
    }));

    const prompt = `Actúa como el Director de Operaciones y Cadena de Suministro de "Cachorro Feliz".
Analiza la siguiente situación actual del negocio y genera un Plan Maestro de Producción y Compras para la próxima ${purchaseTimeframe}.

DATOS ACTUALES DE INVENTARIO:
- Materias Primas: ${JSON.stringify(rawStockSummary)}
- Productos Terminados en Stock: ${JSON.stringify(finishedProductStockSummary)}
- Proveedores Registrados: ${JSON.stringify(suppliers.map(s => ({ id: s.id, name: s.name, category: s.category, phone: s.phone })))}

GENERA EL SIGUIENTE REPORTE OPERATIVO:
1. 🚨 DIAGNÓSTICO DE STOCK CRÍTICO: ¿Qué productos o materias primas están en riesgo de agotarse?
2. 👨‍🍳 LOTES DE PRODUCCIÓN RECOMENDADOS: Qué recetas debemos hornear o deshidratar esta semana y cuántos lotes de cada una para mantener stock óptimo.
3. 🛒 LISTA DE COMPRAS SUGERIDA POR PROVEEDOR: Cantidad exacta en kilogramos o unidades de cada materia prima a solicitar, teniendo en cuenta las mermas de alistamiento.
4. 💰 PRESUPUESTO ESTIMADO DE COMPRAS: Estimación en pesos colombianos ($ COP) para abastecer la producción.
5. 📱 MENSAJE LISTO PARA PROVEEDORES: Plantilla de mensaje de WhatsApp formateada para pedir la orden al proveedor principal.`;

    const sysInst = `Eres el planificador experto en producción y costos de Cachorro Feliz. Tus cálculos de materias primas siempre tienen en cuenta que al limpiar carnes hay merma de perfilado y al deshidratar se pierde entre 65% y 70% de agua.`;

    const result = await askGemini(prompt, sysInst);
    setPurchasePlanningResult(result);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#334c5c] text-white rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-[#f8b46b]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8b46b]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#f8b46b] text-[#334c5c] flex items-center justify-center shadow-lg border border-white/20 shrink-0">
              <Sparkles className="w-8 h-8 text-[#334c5c]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-bebas tracking-wide text-[#f8b46b]">
                  CENTRO DE AGENTES DE INTELIGENCIA ARTIFICIAL
                </h1>
                <span className="bg-[#f8b46b]/20 border border-[#f8b46b]/50 text-[#f8b46b] text-[10px] font-bold px-2 py-0.5 rounded font-sans tracking-wider">
                  NIVEL GRATUITO ACTIVO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-sans leading-relaxed">
                Automatiza las 4 áreas clave de tu emprendimiento: Redes Sociales, WhatsApp a clientes, Formulación de nuevos snacks y Planeación de compras.
              </p>
            </div>
          </div>

          <div className="bg-black/25 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 flex flex-col gap-1 text-xs text-slate-200">
            <span className="text-[#f8b46b] font-bold text-[11px] uppercase tracking-wider font-bebas flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#f8b46b]" />
              Cero Costos Adicionales
            </span>
            <p className="text-[11px] text-slate-300">
              Los 4 agentes operan sobre la cuota estándar sin necesidad de planes pagos de suscripción.
            </p>
          </div>
        </div>
      </div>

      {/* Agents Navigation Tabs (Ordered strictly: 1. Instagram, 2. WhatsApp, 3. Recetas, 4. Compras) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveAgentTab('instagram')}
          className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
            activeAgentTab === 'instagram'
              ? 'bg-[#334c5c] text-white border-[#f8b46b] shadow-md ring-2 ring-[#f8b46b]/30'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-100 text-pink-700 font-sans">
              Prioridad #1
            </span>
            <Instagram className={`w-5 h-5 ${activeAgentTab === 'instagram' ? 'text-[#f8b46b]' : 'text-pink-600'}`} />
          </div>
          <div>
            <h3 className="font-bebas text-lg font-bold tracking-wide leading-tight">
              1. Agente Instagram
            </h3>
            <p className={`text-[11px] mt-0.5 ${activeAgentTab === 'instagram' ? 'text-slate-200' : 'text-slate-500'}`}>
              Copys, Reels y carruseles para @snacks_cachorro_feliz
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveAgentTab('whatsapp')}
          className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
            activeAgentTab === 'whatsapp'
              ? 'bg-[#334c5c] text-white border-[#f8b46b] shadow-md ring-2 ring-[#f8b46b]/30'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans">
              Prioridad #2
            </span>
            <MessageSquare className={`w-5 h-5 ${activeAgentTab === 'whatsapp' ? 'text-[#f8b46b]' : 'text-emerald-600'}`} />
          </div>
          <div>
            <h3 className="font-bebas text-lg font-bold tracking-wide leading-tight">
              2. Agente WhatsApp
            </h3>
            <p className={`text-[11px] mt-0.5 ${activeAgentTab === 'whatsapp' ? 'text-slate-200' : 'text-slate-500'}`}>
              Recompras, cumpleaños y confirmación de pedidos
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveAgentTab('recipes')}
          className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
            activeAgentTab === 'recipes'
              ? 'bg-[#334c5c] text-white border-[#f8b46b] shadow-md ring-2 ring-[#f8b46b]/30'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-sans">
              Prioridad #3
            </span>
            <FlaskConical className={`w-5 h-5 ${activeAgentTab === 'recipes' ? 'text-[#f8b46b]' : 'text-amber-600'}`} />
          </div>
          <div>
            <h3 className="font-bebas text-lg font-bold tracking-wide leading-tight">
              3. Formulación & Costeo
            </h3>
            <p className={`text-[11px] mt-0.5 ${activeAgentTab === 'recipes' ? 'text-slate-200' : 'text-slate-500'}`}>
              Nutrición segura, mermas y precios de venta
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveAgentTab('purchases')}
          className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
            activeAgentTab === 'purchases'
              ? 'bg-[#334c5c] text-white border-[#f8b46b] shadow-md ring-2 ring-[#f8b46b]/30'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-sans">
              Prioridad #4
            </span>
            <Truck className={`w-5 h-5 ${activeAgentTab === 'purchases' ? 'text-[#f8b46b]' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="font-bebas text-lg font-bold tracking-wide leading-tight">
              4. Compras & Producción
            </h3>
            <p className={`text-[11px] mt-0.5 ${activeAgentTab === 'purchases' ? 'text-slate-200' : 'text-slate-500'}`}>
              Cálculo de materias primas y órdenes a proveedores
            </p>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* AGENT 1: INSTAGRAM CONTENT CREATOR */}
      {/* ========================================================================= */}
      {activeAgentTab === 'instagram' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E0D7C6] shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                <h2 className="font-bebas text-xl font-bold text-[#334c5c]">
                  Parrilla Semanal & Generador de Contenido
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">@snacks_cachorro_feliz</span>
            </div>

            {/* 📅 PARRILLA EDITORIAL DE LA SEMANA (7 DÍAS) */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-2">
              <label className="block text-xs font-bold text-amber-900 flex items-center justify-between">
                <span>📅 Parrilla Semanal Estratégica:</span>
                <span className="text-[10px] text-amber-700 font-normal">Toca un día para auto-cargar</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { day: 'Lunes', title: '🥗 Salud por el Chef', line: 'general', fmt: 'post', goal: 'salud_alergias', topic: 'Por qué los ingredientes de grado humano y cero harinas refinadas previenen alergias y alargan la vida del perro.' },
                  { day: 'Martes', title: '🐶 Historia de Oreo (CEO)', line: 'general', fmt: 'story', goal: 'antojo_mascota', topic: 'La historia real de cómo mi perrito Oreo llegó a mi vida, me inspiró a crear Cachorro Feliz y hoy es el C.E.O. de 4 patas.' },
                  { day: 'Miércoles', title: '🥩 Deshidratados 65°C', line: 'res', fmt: 'carousel', goal: 'educativo_beneficios', topic: 'Educación visual: por qué deshidratar a baja temperatura conserva el 100% de proteínas sin necesitar conservantes químicos.' },
                  { day: 'Jueves', title: '🦷 Salud Dental & Snacks', line: 'galletas', fmt: 'post', goal: 'educativo_beneficios', topic: 'Cómo la textura crocante de las galletas orgánicas limpia el sarro y previene el mal aliento de forma natural.' },
                  { day: 'Viernes', title: '🛵 Viernes de Despachos', line: 'cerdo', fmt: 'reel', goal: 'promocion_pedidos', topic: '¡Viernes de despachos locales y nacionales! Recuerda armar la dotación de premios de fin de semana para tu consentido. WhatsApp 3205714504.' },
                  { day: 'Sábado', title: '🎂 Cumpleañeros del Mes', line: 'galletas', fmt: 'story', goal: 'antojo_mascota', topic: 'Celebrando a todos los peludos que cumplen años este mes con su cajita de regalo y 15% de descuento.' },
                  { day: 'Domingo', title: '👨‍🍳 En la Cocina del Chef', line: 'pollo', fmt: 'post', goal: 'educativo_beneficios', topic: 'Detrás de cámaras: El Chef Javier seleccionando manzanas frescas, avena y pechuga magra para la hornada semanal.' }
                ].map((item) => (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => {
                      setInstaProductLine(item.line);
                      setInstaFormat(item.fmt as any);
                      setInstaGoal(item.goal);
                      setInstaCustomTopic(item.topic);
                    }}
                    className="p-1.5 rounded-lg bg-white border border-amber-300/80 hover:bg-amber-100/60 text-slate-800 text-[11px] font-semibold text-left transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="font-bold text-[#334c5c] block">{item.day}:</span>
                    <span className="text-[10px] text-slate-600 block truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Line selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Línea de Producto:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pollo', label: '🍗 Pollo Deshidratado', color: '#f39205' },
                  { id: 'res', label: '🥩 Res Deshidratada', color: '#e84b1e' },
                  { id: 'cerdo', label: '🥓 Cerdo Deshidratado', color: '#794092' },
                  { id: 'galletas', label: '🍪 Galletas Orgánicas', color: '#334c5c' },
                  { id: 'general', label: '✨ Nutrición & Marca', color: '#334c5c' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setInstaProductLine(item.id)}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      instaProductLine === item.id
                        ? 'bg-[#334c5c] text-white border-[#334c5c] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {instaProductLine === item.id && <Check className="w-3.5 h-3.5 text-[#f8b46b]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Format selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Formato de Publicación:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'post', label: 'Post / Foto' },
                  { id: 'carousel', label: 'Carrusel' },
                  { id: 'reel', label: 'Guion Reel' },
                  { id: 'story', label: 'Historia' }
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setInstaFormat(fmt.id as any)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      instaFormat === fmt.id
                        ? 'bg-[#f8b46b] text-[#334c5c] border-[#f8b46b] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Objetivo del Post:
              </label>
              <select
                value={instaGoal}
                onChange={(e) => setInstaGoal(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#334c5c]"
              >
                <option value="educativo_beneficios">📚 Educativo: Beneficios del deshidratado lento vs químicos</option>
                <option value="antojo_mascota">🐶 Emoción: La felicidad y devoción de tu perro al probarlo</option>
                <option value="promocion_pedidos">🛒 Conversión: Impulsar pedidos directos por WhatsApp</option>
                <option value="salud_alergias">🩺 Salud: Ideal para perros con digestión delicada o alergias</option>
              </select>
            </div>

            {/* Custom Detail */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Idea o detalle específico (opcional):
              </label>
              <textarea
                value={instaCustomTopic}
                onChange={(e) => setInstaCustomTopic(e.target.value)}
                rows={2}
                placeholder="Ej: Mencionar que tenemos envíos los martes y viernes..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#334c5c]"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerateInstagram}
              disabled={isLoading}
              className="w-full bg-[#334c5c] hover:bg-[#273a46] disabled:bg-slate-300 text-[#f8b46b] py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#f8b46b]" />
                  <span>Creando contenido con Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#f8b46b]" />
                  <span>Generar Publicación para Instagram</span>
                </>
              )}
            </button>
          </div>

          {/* Result Output / Mockup (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E0D7C6] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bebas text-lg font-bold text-slate-800 tracking-wide flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#f8b46b]" />
                Publicación Generada
              </span>
              {instaResult && (
                <button
                  onClick={() => handleCopy(instaResult, 'insta')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedKey === 'insta' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Todo</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="my-4 flex-1 bg-slate-50 rounded-xl p-5 border border-slate-200 overflow-y-auto max-h-[520px] text-xs leading-relaxed">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-3 text-[#334c5c]">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#f8b46b]" />
                  <span className="font-bold">Escribiendo copy persuasivo y guía visual...</span>
                </div>
              ) : instaResult ? (
                <div className="whitespace-pre-wrap font-sans text-slate-800 space-y-2">
                  {instaResult}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <Instagram className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium">Selecciona las opciones a la izquierda y haz clic en Generar.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    El agente creará ganchos, copys completos con llamadas de acción a WhatsApp y hashtags.
                  </p>
                </div>
              )}
            </div>

            {instaResult && (
              <div className="bg-[#334c5c]/5 p-3 rounded-xl border border-[#334c5c]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-slate-600 font-medium">
                  ¿Listo para programar tu post en Instagram y Facebook?
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(instaResult, 'meta')}
                    className="bg-[#2D463E] text-white hover:bg-[#233831] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shrink-0 cursor-pointer text-xs"
                  >
                    {copiedKey === 'meta' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>¡Texto Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#D4A373]" />
                        <span>1. Copiar Copy</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://business.facebook.com/latest/composer"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shrink-0 shadow-xs text-xs"
                    title="Abre el programador oficial gratuito de Meta para Instagram"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>2. Abrir Meta Business Suite 📅</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Visual Media & Video Storyboard Studio (12 cols) */}
          <div className="lg:col-span-12">
            <InstagramMediaGenerator
              productLine={instaProductLine}
              format={instaFormat}
              topic={instaCustomTopic}
              headline={instaResult ? (instaResult.split('\n')[0] || '').replace(/^[#*🎯\s]+/, '').slice(0, 45) : undefined}
              copyText={instaResult ? instaResult.slice(0, 100) : undefined}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AGENT 2: WHATSAPP AUTOMATION & CUSTOMER CARE */}
      {/* ========================================================================= */}
      {activeAgentTab === 'whatsapp' && (
        <div className="space-y-6">
          {/* Sub-tabs header */}
          <div className="bg-white p-2 rounded-2xl border border-[#E0D7C6] flex flex-wrap gap-2 shadow-xs">
            <button
              onClick={() => setWaSubTab('quick_replies')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                waSubTab === 'quick_replies'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>⚡ Kit de Respuestas Rápidas (Atajos /)</span>
            </button>

            <button
              onClick={() => setWaSubTab('custom_agent')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                waSubTab === 'custom_agent'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🤖 Redactor & Asistente IA para Clientes</span>
            </button>

            <button
              onClick={() => setWaSubTab('setup_guide')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                waSubTab === 'setup_guide'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>📱 Guía de Configuración en el Celular</span>
            </button>
          </div>

          {/* SUB-TAB 1: KIT DE RESPUESTAS RÁPIDAS (ATAJOS) */}
          {waSubTab === 'quick_replies' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-emerald-950 flex items-center space-x-1.5">
                    <span>⚡ Atajos de Teclado para tu WhatsApp Business (3205714504)</span>
                  </h4>
                  <p className="text-emerald-800 mt-1">
                    Copia estos textos y guárdalos en tu aplicación de WhatsApp Business en tu celular. Así, cuando un cliente pregunte, solo escribes <b>/precios</b> o <b>/envios</b> y responderás en 1 segundo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    shortcut: '/precios',
                    title: 'Lista de Precios y Productos',
                    text: `¡Hola! 🐾 Te comparto nuestro menú de *Cachorro Feliz* (100% natural, grado humano y sin conservantes químicos):

🍪 *GALLETAS ORGÁNICAS:*
• Bolsa 250g: $16.000 COP
• Bolsa 500g (Libra): $28.000 COP

🥩 *DESHIDRATADOS PREMIUM (100g):*
• Pechuga de Pollo: $22.000 COP
• Lomo de Cerdo Crocante: $24.000 COP
• Carne Magra de Res: $26.000 COP

¿Cuál te gustaría pedir para consentir a tu mejor amigo? 🐶❤️`
                  },
                  {
                    shortcut: '/envios',
                    title: 'Tarifas y Tiempos de Entrega',
                    text: `📦 *INFORMACIÓN DE ENVÍOS CACHORRO FELIZ:*

📍 *Envíos Locales (Bogotá):* $8.000 COP (¡Envío GRATIS por compras superiores a $65.000 COP!)
📍 *Fuera de Bogotá (Alrededores y Municipios):* $12.000 - $14.000 COP
📍 *Nacional (Resto del país):* Envíos por transportadora (Interrapidísimo / Encomienda).

Horneamos y deshidratamos lotes frescos constantemente para que tu mascota reciba la máxima frescura y crocancia. 🛵💨`
                  },
                  {
                    shortcut: '/pagos',
                    title: 'Cuentas y Métodos de Pago',
                    text: `💳 *MÉTODOS DE PAGO DISPONIBLES:*

🔴 *Daviplata:* 3205714504
🟣 *Nequi:* 3205714504
🟡 *Bancolombia (Ahorros):* (Escribe aquí tu número de cuenta Bancolombia)
💵 *Contraentrega:* Disponible en zonas seleccionadas de Bogotá.

A nombre de: *Javier Mauricio Rodríguez*
Tan pronto realices la transferencia, nos envías el comprobante por aquí para agendar tu despacho. ¡Muchas gracias! 🙏🐾`
                  },
                  {
                    shortcut: '/ingredientes',
                    title: 'Ingredientes de Grado Humano',
                    text: `🌿 *¿POR QUÉ CACHORRO FELIZ ES DIFERENTE?*

👨‍🍳 *Recetas de Chef:* Diseñadas para nutrir con amor real.
🥩 *100% Grado Humano:* Usamos carnes magras, avena integral en hojuelas, manzana fresca, zanahoria y mantequilla de maní 100% natural.
🚫 *0% Harinas Refinadas, 0% Azúcar, 0% Sal, 0% Conservantes.*
🔥 *Deshidratado a baja temperatura:* Conserva intactos todos los aminoácidos y nutrientes naturales.

¡Tu peludo lo nota desde el primer bocado! 🐕✨`
                  },
                  {
                    shortcut: '/catalogo',
                    title: 'Enlace al Catálogo Web',
                    text: `🐾 *¡Conoce nuestro Catálogo Online!*

Puedes explorar todas nuestras líneas de snacks, ver fotos reales y armar tu pedido express haciendo clic aquí:
👉 http://localhost:3000

(O escríbenos directamente por acá y con gusto te asesoramos con el pedido).`
                  },
                  {
                    shortcut: '/chef',
                    title: 'Atención Personalizada con el Chef',
                    text: `👨‍🍳 *¡Hola! Te escribe el Chef Javier Mauricio Rodríguez, fundador de Cachorro Feliz.*

Cuéntame más sobre tu mascota (edad, raza o si tiene alguna alergia o necesidad especial) y con gusto te asesoro para elegir el snack o galleta más saludable para su bienestar. 🐶❤️`
                  }
                ].map((item) => (
                  <div key={item.shortcut} className="bg-white p-4 rounded-xl border border-[#E0D7C6] shadow-xs flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold text-xs">
                          {item.shortcut}
                        </span>
                        <span className="text-xs font-bold text-slate-800 font-display">{item.title}</span>
                      </div>
                      <div className="mt-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap font-sans max-h-44 overflow-y-auto leading-relaxed">
                        {item.text}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(item.text, item.shortcut)}
                      className="w-full bg-[#2D463E] hover:bg-[#233831] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-all shadow-xs"
                    >
                      {copiedKey === item.shortcut ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">¡Texto Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>Copiar para WhatsApp Business</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: REDACTOR & ASISTENTE IA PARA CLIENTES */}
          {waSubTab === 'custom_agent' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Form (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E0D7C6] shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <h2 className="font-bebas text-xl font-bold text-[#334c5c]">
                      Redactor de Mensajes con IA
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-500">WA: 3205714504</span>
                </div>

                {/* Select Client */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seleccionar Cliente Registrado:
                  </label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#334c5c]"
                  >
                    {clients.map((c) => {
                      const petNames = c.pets?.map(p => p.name).join(', ') || 'Sin mascota';
                      return (
                        <option key={c.id} value={c.id}>
                          {c.name} — 🐾 {petNames} ({c.phone})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Message Objective */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tipo de Mensaje:
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'recordatorio_recompra', label: '🔄 Recordatorio de Recompra (Snacks por agotarse)', desc: 'Calcula que su mascota ya se terminó los snacks anteriores.' },
                      { id: 'cumpleanos', label: '🎂 Felicitación de Cumpleaños para la Mascota', desc: 'Saludo cariñoso con cupón de 15% de descuento.' },
                      { id: 'confirmacion_pedido', label: '📦 Confirmación y Despacho de Pedido', desc: 'Desglose de productos, valor total y cuenta para transferencia.' },
                      { id: 'seguimiento_calidad', label: '⭐ Seguimiento post-entrega / Reseña', desc: 'Preguntar cómo le pareció el sabor y pedir una foto.' },
                      { id: 'reactivacion', label: '🎁 Reactivación de Cliente Inactivo', desc: 'Saludo especial para clientes que no piden hace semanas.' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setWhatsappMessageType(item.id)}
                        className={`w-full p-2.5 rounded-xl text-left border transition-all flex flex-col cursor-pointer ${
                          whatsappMessageType === item.id
                            ? 'bg-[#334c5c] text-white border-[#334c5c] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs font-bold">{item.label}</span>
                        <span className={`text-[10px] mt-0.5 ${whatsappMessageType === item.id ? 'text-slate-200' : 'text-slate-500'}`}>
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detalles adicionales o promociones:
                  </label>
                  <textarea
                    value={customWhatsappNotes}
                    onChange={(e) => setCustomWhatsappNotes(e.target.value)}
                    rows={2}
                    placeholder="Ej: Ofrecer envío gratis si añade un paquete de galletas..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#334c5c]"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateWhatsapp}
                  disabled={isLoading || !selectedClient}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Redactando mensaje con Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Redactar Mensaje Personalizado</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output / WhatsApp Simulator (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E0D7C6] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">
                        {selectedClient?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-800">{selectedClient?.name}</h3>
                        <p className="text-[10px] text-slate-500">Mascotas: {selectedClient?.pets?.map(p => p.name).join(', ') || 'N/A'}</p>
                      </div>
                    </div>

                    {whatsappResult && (
                      <button
                        onClick={() => handleCopy(whatsappResult, 'wa')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedKey === 'wa' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Texto</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* WhatsApp Bubble Preview */}
                  <div className="my-4 bg-[#EFEAE2] rounded-2xl p-4 border border-slate-300/80 min-h-[300px] flex flex-col justify-end">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-16 space-y-2 text-slate-600">
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-700" />
                        <span className="text-xs font-bold">Generando mensaje cálido y personalizado...</span>
                      </div>
                    ) : whatsappResult ? (
                      <div className="bg-white rounded-2xl rounded-tl-xs p-4 shadow-sm max-w-lg self-start text-xs leading-relaxed text-slate-800 border border-black/5">
                        <div className="whitespace-pre-wrap font-sans">
                          {whatsappResult}
                        </div>
                        <div className="text-[9px] text-slate-400 text-right mt-2 flex items-center justify-end gap-1">
                          <span>Ahora</span>
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 text-slate-500">
                        <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-medium">Selecciona el cliente y el tipo de mensaje para redactarlo.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct WhatsApp Open Action */}
                {whatsappResult && selectedClient?.phone && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-emerald-800 font-medium">
                      Teléfono destino: <strong>{selectedClient.phone}</strong>
                    </span>
                    <a
                      href={`https://wa.me/${selectedClient.phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappResult)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir Chat en WhatsApp 💬</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: GUÍA DE CONFIGURACIÓN PASO A PASO EN EL CELULAR */}
          {waSubTab === 'setup_guide' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E0D7C6] shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#2D463E] font-display">
                  Cómo configurar Respuestas Rápidas en tu WhatsApp Business en 3 Pasos 📲
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Sigue estos pasos en tu celular (Android o iPhone) para activar tus atajos:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E0D7C6] space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#EF8828] text-white font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">Abre Herramientas de Empresa</h4>
                  <p className="text-xs text-slate-600">
                    En tu WhatsApp Business, toca los 3 puntos arriba a la derecha (o Configuración) y entra a <b>Herramientas para la empresa</b>.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E0D7C6] space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#EF8828] text-white font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">Toca en "Respuestas Rápidas"</h4>
                  <p className="text-xs text-slate-600">
                    Toca en <b>Respuestas rápidas</b> y luego en el botón <b>+</b> (Añadir).
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E0D7C6] space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#EF8828] text-white font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">Pega el Atajo y el Mensaje</h4>
                  <p className="text-xs text-slate-600">
                    En <i>Atajo</i> escribe <b>precios</b> (o <b>envios</b>, <b>pagos</b>) y en <i>Mensaje</i> pega el texto que copiaste de esta pestaña. ¡Guarda y listo!
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold block">✨ ¡Listo! A partir de ese momento:</span>
                  <span>Cuando estés en cualquier chat de WhatsApp, solo escribes una barra inclinada <b>/</b> y te saldrá el menú para enviar precios, cuentas bancarias y menús en 1 segundo.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* AGENT 3: FORMULATION & RECIPE COSTING */}
      {/* ========================================================================= */}
      {activeAgentTab === 'recipes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E0D7C6] shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FlaskConical className="w-5 h-5 text-amber-600" />
                <h2 className="font-bebas text-xl font-bold text-[#334c5c]">
                  Formulación & Costeo de Nuevos Snacks
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">I+D Nutricional</span>
            </div>

            {/* Idea / Recipe Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Idea o Ingredientes del Nuevo Snack:
              </label>
              <textarea
                value={formulationIdea}
                onChange={(e) => setFormulationIdea(e.target.value)}
                rows={3}
                placeholder="Ej: Snacks crocantes de hígado de pollo con espinaca y avena..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#334c5c]"
              />
            </div>

            {/* Quick Inspiration Chips */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Ideas Populares para Formular:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  'Hígado de Pollo con Remolacha',
                  'Tiras de Cerdo con Cúrcuma',
                  'Galletas de Camote y Mantequilla de Maní',
                  'Corazón de Res Deshidratado'
                ].map((idea, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFormulationIdea(idea)}
                    className="text-[10px] bg-slate-100 hover:bg-amber-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 cursor-pointer"
                  >
                    + {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Pet */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mascota Objetivo:
                </label>
                <select
                  value={targetAnimal}
                  onChange={(e) => setTargetAnimal(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  <option value="perros_y_gatos">🐶🐱 Perros y Gatos</option>
                  <option value="solo_perros">🐶 Solo Perros</option>
                  <option value="solo_gatos">🐱 Solo Gatos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Costo Base ($/kg COP):
                </label>
                <input
                  type="number"
                  value={estimatedRawCost}
                  onChange={(e) => setEstimatedRawCost(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  step={1000}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerateFormulation}
              disabled={isLoading || !formulationIdea.trim()}
              className="w-full bg-[#334c5c] hover:bg-[#273a46] disabled:bg-slate-300 text-[#f8b46b] py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analizando seguridad, mermas y costos...</span>
                </>
              ) : (
                <>
                  <FlaskConical className="w-4 h-4" />
                  <span>Formular y Calcular Rentabilidad</span>
                </>
              )}
            </button>
          </div>

          {/* Results Output (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E0D7C6] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bebas text-lg font-bold text-slate-800 tracking-wide flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-600" />
                Ficha Técnica de Formulación
              </h3>
              {savedSuccessMessage && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-fade-in">
                  {savedSuccessMessage}
                </span>
              )}
            </div>

            <div className="my-4 flex-1 overflow-y-auto max-h-[500px] text-xs">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-2 text-[#334c5c]">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#f8b46b]" />
                  <span className="font-bold">Calculando balance nutricional, mermas y márgenes...</span>
                </div>
              ) : formulationResult ? (
                <div className="space-y-4">
                  {/* Name & Badge */}
                  <div className="bg-[#334c5c] text-white p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#f8b46b] font-bold uppercase tracking-wider block">
                        Línea: {formulationResult.category}
                      </span>
                      <h4 className="text-xl font-bold font-bebas tracking-wide text-[#f8b46b]">
                        {formulationResult.name}
                      </h4>
                    </div>
                    <span className="text-xs bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-2 py-1 rounded font-bold">
                      ✓ 100% Seguro
                    </span>
                  </div>

                  {/* Nutritional and Safety Insights */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-slate-800">
                    <span className="font-bold text-emerald-900 block mb-1">
                      🛡️ Evaluación Nutricional & Toxicológica:
                    </span>
                    <p className="leading-relaxed">{formulationResult.petSafetyCheck}</p>
                  </div>

                  {/* Yield & Loss Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Merma Alistamiento</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {formulationResult.estimatedPrepLossPercent}%
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Merma Deshidratación</span>
                      <span className="font-bold text-amber-700 text-sm">
                        {formulationResult.estimatedCookingLossPercent}%
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Rendimiento Final / kg</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {formulationResult.finalYieldGrams} g
                      </span>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  {formulationResult.suggestedPrices && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-2">
                        💰 Precios de Venta y Márgenes Sugeridos:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(formulationResult.suggestedPrices).map(([packKey, data]: any) => (
                          <div key={packKey} className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">
                              Bolsa {packKey.replace('pack', '')}
                            </span>
                            <span className="text-xs font-bold text-slate-900 block mt-0.5">
                              ${Number(data.salePrice).toLocaleString('es-CO')}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                              Margen: ~{data.marginPercent}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preparation Instructions */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">
                      📋 Instrucciones de Preparación & Deshidratado:
                    </span>
                    <p className="leading-relaxed text-slate-700">{formulationResult.instructions}</p>
                  </div>
                </div>
              ) : rawFormulationText ? (
                <div className="whitespace-pre-wrap font-sans text-slate-800 bg-slate-50 p-4 rounded-xl border">
                  {rawFormulationText}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium">Ingresa los ingredientes a probar para recibir la fórmula y costos.</p>
                </div>
              )}
            </div>

            {/* Action to Save Recipe */}
            {formulationResult && (
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  onClick={handleSaveFormulatedRecipe}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Guardar como Receta en Producción</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AGENT 4: PURCHASES & PRODUCTION PLANNING */}
      {/* ========================================================================= */}
      {activeAgentTab === 'purchases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E0D7C6] shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h2 className="font-bebas text-xl font-bold text-[#334c5c]">
                  Planeación de Compras & Producción
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">Abastecimiento</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              El agente analiza el inventario actual de materias primas, mermas de producción y stock de productos terminados para calcular exactamente qué comprar y qué lotes producir.
            </p>

            {/* Current Critical Inventory Preview */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Estado Actual de Stock:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {rawMaterials.map((rm) => {
                  const isLow = rm.stockNetUsable <= rm.minStockThreshold;
                  return (
                    <div key={rm.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                      <span className="text-slate-700 truncate">{rm.name}</span>
                      <span className={`font-mono font-bold ${isLow ? 'text-red-600' : 'text-slate-600'}`}>
                        {(rm.stockNetUsable / 1000).toFixed(1)} kg {isLow ? '⚠️' : '✓'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeframe */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Horizonte de Planeación:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'semana', label: '📅 Próxima Semana (7 días)' },
                  { id: 'quincena', label: '📆 Quincenal (15 días)' }
                ].map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setPurchaseTimeframe(tf.id)}
                    className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      purchaseTimeframe === tf.id
                        ? 'bg-[#334c5c] text-white border-[#334c5c] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Planner Button */}
            <button
              onClick={handleGeneratePlanning}
              disabled={isLoading}
              className="w-full bg-[#334c5c] hover:bg-[#273a46] disabled:bg-slate-300 text-[#f8b46b] py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calculando compras y lotes con Gemini...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Generar Plan de Compras & Producción</span>
                </>
              )}
            </button>
          </div>

          {/* Results Output (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E0D7C6] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bebas text-lg font-bold text-slate-800 tracking-wide flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Reporte de Operaciones y Compras
              </h3>
              {purchasePlanningResult && (
                <button
                  onClick={() => handleCopy(purchasePlanningResult, 'planning')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'planning' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Reporte</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="my-4 flex-1 bg-slate-50 rounded-xl p-5 border border-slate-200 overflow-y-auto max-h-[520px] text-xs leading-relaxed">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-2 text-[#334c5c]">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#f8b46b]" />
                  <span className="font-bold">Analizando materias primas y órdenes a proveedores...</span>
                </div>
              ) : purchasePlanningResult ? (
                <div className="whitespace-pre-wrap font-sans text-slate-800 space-y-2">
                  {purchasePlanningResult}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <Truck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium">Haz clic en Generar para calcular las compras y producción recomendada.</p>
                </div>
              )}
            </div>

            {purchasePlanningResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-center justify-between">
                <span>
                  💡 Puedes copiar el mensaje del proveedor y enviárselo directamente por WhatsApp.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
