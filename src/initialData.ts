import {
  RawMaterial,
  Supplier,
  PurchaseRecord,
  Recipe,
  FinishedProduct,
  Client,
  Sale,
  FixedCost,
  InventoryAdjustment,
  ProductionBatch
} from './types';

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Frutas y Verduras El Campesino',
    contactName: 'Don Carlos Mendoza',
    phone: '3104567890',
    email: 'ventas@elcampesino.com',
    address: 'Plaza de Mercado Central, Local 42',
    notes: 'Proveedor principal de manzana roja, zanahoria fresca y huevos orgánicos.'
  },
  {
    id: 'sup-2',
    name: 'Molinos & Cereales del Valle',
    contactName: 'María Fernanda Ruiz',
    phone: '3159876543',
    email: 'contacto@molinosdelvalle.co',
    address: 'Zona Industrial Lote 12',
    notes: 'Avena en hojuelas entera y harina de avena de alta pureza.'
  },
  {
    id: 'sup-3',
    name: 'Avícola San José',
    contactName: 'Jorge Ramírez',
    phone: '3123334455',
    email: 'distribucion@avicolasanjose.com',
    address: 'Av. Principal # 45-10',
    notes: 'Suministro de pechuga de pollo magra y cortes de res selectos.'
  }
];

export const initialRawMaterials: RawMaterial[] = [
  {
    id: 'raw-1',
    name: 'Manzana Roja Fresca',
    unit: 'g',
    stockGross: 15000, // 15 kg brutos comprados
    preparationLossPercentage: 25, // 25% merma por pelado y corazón
    stockNetUsable: 11250, // 15000 * 0.75
    weightedAvgGrossCostPerUnit: 6, // $6/g bruto ($6.000 / kg)
    weightedAvgNetCostPerUnit: 8, // $6 / 0.75 = $8/g neto utilizable
    supplierId: 'sup-1',
    minStockThreshold: 3000
  },
  {
    id: 'raw-2',
    name: 'Zanahoria Fresca',
    unit: 'g',
    stockGross: 20000, // 20 kg
    preparationLossPercentage: 9, // 9% merma alistamiento
    stockNetUsable: 18200, // 20000 * 0.91
    weightedAvgGrossCostPerUnit: 3.2, // $3.2/g bruto ($3.200 / kg)
    weightedAvgNetCostPerUnit: 3.516, // $3.2 / 0.91 = $3.516/g
    supplierId: 'sup-1',
    minStockThreshold: 4000
  },
  {
    id: 'raw-3',
    name: 'Avena en Hojuelas',
    unit: 'g',
    stockGross: 12000,
    preparationLossPercentage: 0,
    stockNetUsable: 12000,
    weightedAvgGrossCostPerUnit: 5.5,
    weightedAvgNetCostPerUnit: 5.5,
    supplierId: 'sup-2',
    minStockThreshold: 2500
  },
  {
    id: 'raw-4',
    name: 'Harina de Avena',
    unit: 'g',
    stockGross: 25000,
    preparationLossPercentage: 0,
    stockNetUsable: 25000,
    weightedAvgGrossCostPerUnit: 6.2,
    weightedAvgNetCostPerUnit: 6.2,
    supplierId: 'sup-2',
    minStockThreshold: 5000
  },
  {
    id: 'raw-5',
    name: 'Mantequilla de Maní Natural',
    unit: 'g',
    stockGross: 3000,
    preparationLossPercentage: 0,
    stockNetUsable: 3000,
    weightedAvgGrossCostPerUnit: 22,
    weightedAvgNetCostPerUnit: 22,
    supplierId: 'sup-2',
    minStockThreshold: 500
  },
  {
    id: 'raw-6',
    name: 'Huevos Frescos',
    unit: 'unidad',
    stockGross: 120,
    preparationLossPercentage: 0,
    stockNetUsable: 120,
    weightedAvgGrossCostPerUnit: 500, // $500 por unidad
    weightedAvgNetCostPerUnit: 500,
    supplierId: 'sup-1',
    minStockThreshold: 30
  },
  {
    id: 'raw-7',
    name: 'Agua Filtrada',
    unit: 'g',
    stockGross: 50000,
    preparationLossPercentage: 0,
    stockNetUsable: 50000,
    weightedAvgGrossCostPerUnit: 0.1,
    weightedAvgNetCostPerUnit: 0.1,
    supplierId: 'sup-1',
    minStockThreshold: 10000
  },
  {
    id: 'raw-8',
    name: 'Pechuga de Pollo limpia',
    unit: 'g',
    stockGross: 18000,
    preparationLossPercentage: 15, // 15% recortes de grasa/hueso
    stockNetUsable: 15300,
    weightedAvgGrossCostPerUnit: 18, // $18/g ($18.000 / kg)
    weightedAvgNetCostPerUnit: 21.176, // $18 / 0.85
    supplierId: 'sup-3',
    minStockThreshold: 5000
  },
  {
    id: 'raw-9',
    name: 'Carne de Res Magra',
    unit: 'g',
    stockGross: 15000,
    preparationLossPercentage: 12, // 12% merma
    stockNetUsable: 13200,
    weightedAvgGrossCostPerUnit: 26, // $26/g ($26.000 / kg)
    weightedAvgNetCostPerUnit: 29.545,
    supplierId: 'sup-3',
    minStockThreshold: 4000
  },
  {
    id: 'raw-10',
    name: 'Lomo de Cerdo Magro',
    unit: 'g',
    stockGross: 12000,
    preparationLossPercentage: 10, // 10% merma por perfilado
    stockNetUsable: 10800,
    weightedAvgGrossCostPerUnit: 20, // $20/g ($20.000 / kg)
    weightedAvgNetCostPerUnit: 22.22,
    supplierId: 'sup-3',
    minStockThreshold: 3500
  }
];

export const initialRecipes: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Galletas de Zanahoria-Manzana Orgánicas',
    category: 'Galletas',
    ingredients: [
      { rawMaterialId: 'raw-3', rawMaterialName: 'Avena en Hojuelas', requiredNetQuantity: 400, unit: 'g' },
      { rawMaterialId: 'raw-4', rawMaterialName: 'Harina de Avena', requiredNetQuantity: 1000, unit: 'g' },
      { rawMaterialId: 'raw-1', rawMaterialName: 'Manzana Roja Fresca', requiredNetQuantity: 237, unit: 'g' },
      { rawMaterialId: 'raw-2', rawMaterialName: 'Zanahoria Fresca', requiredNetQuantity: 431, unit: 'g' },
      { rawMaterialId: 'raw-5', rawMaterialName: 'Mantequilla de Maní Natural', requiredNetQuantity: 32, unit: 'g' },
      { rawMaterialId: 'raw-6', rawMaterialName: 'Huevos Frescos', requiredNetQuantity: 3, unit: 'unidad' },
      { rawMaterialId: 'raw-7', rawMaterialName: 'Agua Filtrada', requiredNetQuantity: 200, unit: 'g' }
    ],
    rawMixTotalGrams: 2450, // 400 + 1000 + 237 + 431 + 32 + (3*50g eggs) + 200
    cookingOrDehydrationLossPercentage: 38.77, // Pérdida de agua por horneado (2450g crudo -> 1500g horneado)
    postCookFinalYieldGrams: 1500, // 1500g de galletas horneadas
    standardPackageSizes: [250, 500],
    instructions: 'Mezclar la manzana y zanahoria rallada con agua y huevo. Incorporar avena y harina. Moldear y hornear a 160°C hasta obtener textura crocante.'
  },
  {
    id: 'rec-2',
    name: 'Deshidratados de Pollo Natural',
    category: 'Deshidratados',
    ingredients: [
      { rawMaterialId: 'raw-8', rawMaterialName: 'Pechuga de Pollo limpia', requiredNetQuantity: 1000, unit: 'g' }
    ],
    rawMixTotalGrams: 1000,
    cookingOrDehydrationLossPercentage: 70, // 70% pérdida por deshidratación
    postCookFinalYieldGrams: 300,
    standardPackageSizes: [100],
    instructions: 'Cortar en tiras delgadas de 3mm. Colocar en deshidratador a 70°C durante 10 horas hasta sequedad completa.'
  },
  {
    id: 'rec-3',
    name: 'Deshidratados de Res Premium',
    category: 'Deshidratados',
    ingredients: [
      { rawMaterialId: 'raw-9', rawMaterialName: 'Carne de Res Magra', requiredNetQuantity: 1000, unit: 'g' }
    ],
    rawMixTotalGrams: 1000,
    cookingOrDehydrationLossPercentage: 68,
    postCookFinalYieldGrams: 320,
    standardPackageSizes: [100],
    instructions: 'Filetear en láminas delgadas, retirar excesos de grasa visible. Deshidratar a 68°C por 12 horas.'
  },
  {
    id: 'rec-4',
    name: 'Deshidratados de Cerdo Crocantes',
    category: 'Deshidratados',
    ingredients: [
      { rawMaterialId: 'raw-10', rawMaterialName: 'Lomo de Cerdo Magro', requiredNetQuantity: 1000, unit: 'g' }
    ],
    rawMixTotalGrams: 1000,
    cookingOrDehydrationLossPercentage: 67,
    postCookFinalYieldGrams: 330,
    standardPackageSizes: [100],
    instructions: 'Retirar grasa exterior del lomo, laminar a 3mm y deshidratar a 68°C por 11 horas.'
  }
];

export const initialFinishedProducts: FinishedProduct[] = [
  {
    id: 'prod-1',
    name: 'Galletas Orgánicas Zanahoria-Manzana 250g',
    recipeId: 'rec-1',
    packageSizeGrams: 250,
    stockUnits: 24,
    currentUnitCost: 2850, // Costo de producción por empaque
    salePrice: 16000,
    category: 'Galletas'
  },
  {
    id: 'prod-2',
    name: 'Galletas Orgánicas Zanahoria-Manzana 500g',
    recipeId: 'rec-1',
    packageSizeGrams: 500,
    stockUnits: 12,
    currentUnitCost: 5600,
    salePrice: 28000,
    category: 'Galletas'
  },
  {
    id: 'prod-3',
    name: 'Deshidratados de Pollo 100g',
    recipeId: 'rec-2',
    packageSizeGrams: 100,
    stockUnits: 18,
    currentUnitCost: 7800,
    salePrice: 22000,
    category: 'Deshidratados'
  },
  {
    id: 'prod-4',
    name: 'Deshidratados de Res Premium 100g',
    recipeId: 'rec-3',
    packageSizeGrams: 100,
    stockUnits: 15,
    currentUnitCost: 10200,
    salePrice: 26000,
    category: 'Deshidratados'
  },
  {
    id: 'prod-5',
    name: 'Deshidratados de Cerdo Crocantes 100g',
    recipeId: 'rec-4',
    packageSizeGrams: 100,
    stockUnits: 14,
    currentUnitCost: 8900,
    salePrice: 24000,
    category: 'Deshidratados'
  }
];

export const initialClients: Client[] = [
  {
    id: 'cli-1',
    name: 'Camila Ospina',
    phone: '3001234567',
    email: 'camila.ospina@gmail.com',
    address: 'Calle 100 # 15-24 Apt 302',
    city: 'Bogotá',
    totalPurchases: 128000,
    notes: 'Cliente frecuente, le encantan las galletas para su Golden.',
    pets: [
      {
        id: 'pet-1',
        name: 'Oreo',
        type: 'Perro',
        breed: 'Golden Retriever',
        birthday: '2022-08-18', // Birthday coming soon!
        weightKg: 28,
        allergiesOrNotes: 'Ninguna alergia conocida. Le apasionan los snacks de manzana.'
      }
    ]
  },
  {
    id: 'cli-2',
    name: 'Santiago Gutiérrez',
    phone: '3119876543',
    email: 'sgutierrez@hotmail.com',
    address: 'Cra 43A # 12-50 Int 801',
    city: 'Medellín',
    totalPurchases: 92000,
    notes: 'Pide semanalmente deshidratado de res.',
    pets: [
      {
        id: 'pet-2',
        name: 'Luna',
        type: 'Perro',
        breed: 'French Bulldog',
        birthday: '2023-08-25', // Birthday coming soon!
        weightKg: 11,
        allergiesOrNotes: 'Piel sensible, solo pollo y res 100% natural.'
      },
      {
        id: 'pet-3',
        name: 'Simba',
        type: 'Gato',
        breed: 'Mestizo',
        birthday: '2021-11-05',
        weightKg: 4.5,
        allergiesOrNotes: 'Disfruta tiritas finas de pollo deshidratado.'
      }
    ]
  },
  {
    id: 'cli-3',
    name: 'Valeria Martínez',
    phone: '3205714504',
    email: 'valeria.m@yahoo.com',
    address: 'Calle 45 # 22-10',
    city: 'Cali',
    totalPurchases: 64000,
    notes: 'Contacto a través de Instagram @OREO_CACHORRO_FELIZ',
    pets: [
      {
        id: 'pet-4',
        name: 'Rocky',
        type: 'Perro',
        breed: 'Pastor Alemán',
        birthday: '2020-04-12',
        weightKg: 34,
        allergiesOrNotes: 'Le encanta el entreno con premios de galleta.'
      }
    ]
  }
];

export const initialSales: Sale[] = [
  {
    id: 'sale-1',
    saleNumber: 'PED-001',
    date: '2026-08-24',
    clientId: 'cli-1',
    clientName: 'Camila Ospina',
    clientPhone: '3001234567',
    petId: 'pet-1',
    petName: 'Oreo',
    items: [
      {
        finishedProductId: 'prod-1',
        productName: 'Galletas Orgánicas Zanahoria-Manzana 250g',
        quantity: 2,
        unitCost: 2850,
        unitPrice: 16000,
        subtotal: 32000
      },
      {
        finishedProductId: 'prod-3',
        productName: 'Deshidratados de Pollo 100g',
        quantity: 1,
        unitCost: 7800,
        unitPrice: 22000,
        subtotal: 22000
      }
    ],
    subtotal: 54000,
    shippingCost: 8000,
    total: 62000,
    status: 'Listo',
    shippingAddress: 'Calle 140 # 15-24 Apt 302',
    neighborhoodZone: 'Cedritos / Norte Bogotá',
    deliveryType: 'Vehículo Propio',
    paymentMethod: 'Daviplata',
    notes: 'Entregar en portería. Mascota de cumpleaños esta semana.'
  },
  {
    id: 'sale-2',
    saleNumber: 'PED-002',
    date: '2026-08-25',
    clientId: 'cli-2',
    clientName: 'Santiago Gutiérrez',
    clientPhone: '3119876543',
    petId: 'pet-2',
    petName: 'Luna',
    items: [
      {
        finishedProductId: 'prod-4',
        productName: 'Deshidratados de Res Premium 100g',
        quantity: 2,
        unitCost: 10200,
        unitPrice: 26000,
        subtotal: 52000
      },
      {
        finishedProductId: 'prod-5',
        productName: 'Deshidratados de Cerdo Crocantes 100g',
        quantity: 1,
        unitCost: 8900,
        unitPrice: 24000,
        subtotal: 24000
      }
    ],
    subtotal: 76000,
    shippingCost: 8000,
    total: 84000,
    status: 'En Preparación',
    shippingAddress: 'Cra 7 # 67-40 Apt 501',
    neighborhoodZone: 'Chapinero Alto, Bogotá',
    deliveryType: 'Picap / Moto',
    paymentMethod: 'Nequi',
    notes: 'Llamar antes de subir. Envío por Picap en la tarde.'
  },
  {
    id: 'sale-3',
    saleNumber: 'PED-003',
    date: '2026-08-25',
    clientId: 'cli-3',
    clientName: 'Valeria Martínez',
    clientPhone: '3205714504',
    petId: 'pet-4',
    petName: 'Rocky',
    items: [
      {
        finishedProductId: 'prod-2',
        productName: 'Galletas Orgánicas Zanahoria-Manzana 500g',
        quantity: 1,
        unitCost: 5600,
        unitPrice: 28000,
        subtotal: 28000
      },
      {
        finishedProductId: 'prod-5',
        productName: 'Deshidratados de Cerdo Crocantes 100g',
        quantity: 1,
        unitCost: 8900,
        unitPrice: 24000,
        subtotal: 24000
      }
    ],
    subtotal: 52000,
    shippingCost: 12000,
    total: 64000,
    status: 'Listo',
    shippingAddress: 'Calle 15 # 9-45 Conjunto Bosque Real Casa 18',
    neighborhoodZone: 'Fuera de Bogotá (Cundinamarca)',
    deliveryType: 'Interrapidísimo',
    trackingCode: 'INT-7749102',
    paymentMethod: 'Daviplata',
    notes: 'Despachar por encomienda nacional.'
  },
  {
    id: 'sale-4',
    saleNumber: 'PED-004',
    date: '2026-08-25',
    clientId: 'cli-1',
    clientName: 'Diana Marcela Ruiz',
    clientPhone: '3158889900',
    petName: 'Simba',
    items: [
      {
        finishedProductId: 'prod-1',
        productName: 'Galletas Orgánicas Zanahoria-Manzana 250g',
        quantity: 1,
        unitCost: 2850,
        unitPrice: 16000,
        subtotal: 16000
      }
    ],
    subtotal: 16000,
    shippingCost: 8000,
    total: 24000,
    status: 'Pendiente',
    shippingAddress: 'Av Suba # 115-30 Torre 2 Apt 804',
    neighborhoodZone: 'Suba / Pontevedra Bogotá',
    deliveryType: 'Vehículo Propio',
    paymentMethod: 'Contraentrega',
    notes: 'Cobro en efectivo contraentrega.'
  }
];

export const initialPurchases: PurchaseRecord[] = [
  {
    id: 'pur-1',
    date: '2026-08-01',
    supplierId: 'sup-1',
    supplierName: 'Frutas y Verduras El Campesino',
    rawMaterialId: 'raw-1',
    rawMaterialName: 'Manzana Roja Fresca',
    quantityBoughtGross: 20000, // 20 kg brutos
    grossTotalPaid: 120000, // $120.000 COP
    specificLossPercentage: 25, // 25% merma alistamiento
    netUsableGrams: 15000, // 15.000g usables netos
    realCostPerNetGram: 8, // $120.000 / 15.000g = $8 / g
    invoiceNumber: 'FAC-4821',
    notes: 'Manzana fresca de primera calidad.'
  },
  {
    id: 'pur-2',
    date: '2026-08-02',
    supplierId: 'sup-1',
    supplierName: 'Frutas y Verduras El Campesino',
    rawMaterialId: 'raw-2',
    rawMaterialName: 'Zanahoria Fresca',
    quantityBoughtGross: 25000, // 25 kg
    grossTotalPaid: 80000, // $80.000 COP
    specificLossPercentage: 9, // 9% merma alistamiento
    netUsableGrams: 22750, // 22.750g netos
    realCostPerNetGram: 3.516, // $80.000 / 22.750g = $3.516/g
    invoiceNumber: 'FAC-4822',
    notes: 'Zanahorias medianas lavadas.'
  },
  {
    id: 'pur-3',
    date: '2026-08-03',
    supplierId: 'sup-3',
    supplierName: 'Avícola San José',
    rawMaterialId: 'raw-8',
    rawMaterialName: 'Pechuga de Pollo limpia',
    quantityBoughtGross: 20000, // 20 kg
    grossTotalPaid: 360000, // $360.000 COP
    specificLossPercentage: 15, // 15% mermas
    netUsableGrams: 17000, // 17.000g netos
    realCostPerNetGram: 21.176, // $360.000 / 17.000g
    invoiceNumber: 'FAC-9012',
    notes: 'Pechuga deshuesada fresca.'
  }
];

export const initialFixedCosts: FixedCost[] = [
  {
    id: 'fix-1',
    name: 'Arriendo de Taller de Cocina',
    monthlyAmount: 850000,
    category: 'Arriendo'
  },
  {
    id: 'fix-2',
    name: 'Servicios Públicos (Luz / Gas / Agua)',
    monthlyAmount: 320000,
    category: 'Servicios'
  },
  {
    id: 'fix-3',
    name: 'Sueldo Operario de Cocina',
    monthlyAmount: 1400000,
    category: 'Mano de Obra'
  },
  {
    id: 'fix-4',
    name: 'Internet y Teléfono de Pedidos',
    monthlyAmount: 90000,
    category: 'Marketing'
  },
  {
    id: 'fix-5',
    name: 'Bolsas y Etiquetas Impresas (Insumo general)',
    monthlyAmount: 180000,
    category: 'Otros'
  }
];

export const initialAdjustments: InventoryAdjustment[] = [
  {
    id: 'adj-1',
    date: '2026-08-05',
    itemType: 'RawMaterial',
    itemId: 'raw-1',
    itemName: 'Manzana Roja Fresca',
    quantityAdjusted: -500, // -500g perdidos por ablandamiento
    reason: 'Daño/Merma',
    unitCost: 8,
    financialLossValue: 4000,
    notes: '500g de manzana maduraron en exceso y no cumplieron estándar de crocancia.'
  },
  {
    id: 'adj-2',
    date: '2026-08-08',
    itemType: 'FinishedProduct',
    itemId: 'prod-1',
    itemName: 'Galletas Orgánicas Zanahoria-Manzana 250g',
    quantityAdjusted: -2, // 2 bolsas regaladas para degustación a cliente VIP
    reason: 'Muestra/Regalo',
    unitCost: 2850,
    financialLossValue: 5700,
    notes: 'Muestra enviada a cliente nuevo con orden grande.'
  }
];

export const initialProductionBatches: ProductionBatch[] = [
  {
    id: 'bat-1',
    batchNumber: 'LOT-20260805-01',
    recipeId: 'rec-1',
    recipeName: 'Galletas de Zanahoria-Manzana Orgánicas',
    date: '2026-08-05',
    batchMultiplier: 4, // 4 tandas (9,800g crudo -> 6,000g galletas horneadas)
    rawMixWeightGrams: 9800,
    actualFinalYieldGrams: 6000,
    yieldPackagesProduced: [
      {
        packageSizeGrams: 250,
        unitsProduced: 16,
        finishedProductId: 'prod-1',
        finishedProductName: 'Galletas Orgánicas Zanahoria-Manzana 250g'
      },
      {
        packageSizeGrams: 500,
        unitsProduced: 4,
        finishedProductId: 'prod-2',
        finishedProductName: 'Galletas Orgánicas Zanahoria-Manzana 500g'
      }
    ],
    rawMaterialsCostTotal: 52400,
    allocatedFixedCost: 18000,
    totalBatchCost: 70400,
    costPerFinishedUnit: 3520,
    notes: 'Horneado parejo. Muy buena aceptación del lote.'
  }
];
