export type UnitType = 'g' | 'kg' | 'unidad';

export type AdjustmentReason = 'Daño/Merma' | 'Vencimiento' | 'Muestra/Regalo' | 'Ajuste de Conteo' | 'Otro';

export type OrderStatus = 'Pendiente' | 'En Preparación' | 'Listo' | 'Enviado' | 'Entregado';

export interface RawMaterial {
  id: string;
  name: string;
  unit: UnitType;
  stockGross: number; // Stock total comprado
  preparationLossPercentage: number; // % Merma alistamiento (ej: 25% manzana, 9% zanahoria)
  stockNetUsable: number; // Stock neto utilizable (después de merma)
  weightedAvgGrossCostPerUnit: number; // Costo prom por unidad bruta
  weightedAvgNetCostPerUnit: number; // Costo real por unidad neto utilizable
  supplierId: string;
  minStockThreshold: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  supplierId: string;
  supplierName: string;
  rawMaterialId: string;
  rawMaterialName: string;
  quantityBoughtGross: number; // Cantidad bruta comprada (gr/unidades)
  grossTotalPaid: number; // Valor total pagado
  specificLossPercentage: number; // Merma por alistamiento de esta compra (%)
  netUsableGrams: number; // Gramos netos aprovechables
  realCostPerNetGram: number; // Costo real por gramo neto utilizable
  invoiceNumber?: string;
  notes?: string;
}

export interface RecipeIngredient {
  rawMaterialId: string;
  rawMaterialName: string;
  requiredNetQuantity: number; // Gramos o unidades netas utilizables
  unit: UnitType;
}

export interface Recipe {
  id: string;
  name: string;
  category: 'Galletas' | 'Deshidratados' | 'Otros';
  ingredients: RecipeIngredient[];
  rawMixTotalGrams: number; // Suma peso bruto crudo de ingredientes
  cookingOrDehydrationLossPercentage: number; // % Pérdida por agua/cocción
  postCookFinalYieldGrams: number; // Peso neto final cocido o deshidratado
  standardPackageSizes: number[]; // Ej: [250, 500] gramos por bolsa
  instructions?: string;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  recipeId: string;
  recipeName: string;
  date: string;
  batchMultiplier: number;
  rawMixWeightGrams: number;
  actualFinalYieldGrams: number;
  yieldPackagesProduced: {
    packageSizeGrams: number;
    unitsProduced: number;
    finishedProductId: string;
    finishedProductName: string;
  }[];
  rawMaterialsCostTotal: number;
  allocatedFixedCost: number;
  totalBatchCost: number;
  costPerFinishedUnit: number;
  notes?: string;
}

export interface FinishedProduct {
  id: string;
  name: string;
  recipeId: string;
  packageSizeGrams: number;
  stockUnits: number;
  currentUnitCost: number;
  salePrice: number;
  category: 'Galletas' | 'Deshidratados' | 'Otros';
}

export interface InventoryAdjustment {
  id: string;
  date: string;
  itemType: 'RawMaterial' | 'FinishedProduct';
  itemId: string;
  itemName: string;
  quantityAdjusted: number; // Positivo para incremento, Negativo para pérdida
  reason: AdjustmentReason;
  unitCost: number;
  financialLossValue: number;
  notes: string;
}

export interface Pet {
  id: string;
  name: string;
  type: 'Perro' | 'Gato' | 'Otro';
  breed?: string;
  birthday: string; // YYYY-MM-DD
  weightKg?: number;
  allergiesOrNotes?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  pets: Pet[];
  totalPurchases: number;
  notes?: string;
}

export interface SaleItem {
  finishedProductId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  date: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  petId?: string;
  petName?: string;
  items: SaleItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  neighborhoodZone?: string;
  deliveryType?: 'Vehículo Propio' | 'Picap / Moto' | 'Yango Moto' | 'Interrapidísimo' | 'Recogida Personal';
  deliveryPerson?: string;
  trackingCode?: string;
  paymentMethod?: 'Daviplata' | 'Nequi' | 'Bancolombia' | 'Contraentrega' | 'Efectivo';
  notes?: string;
}

export interface FixedCost {
  id: string;
  name: string;
  monthlyAmount: number;
  category: 'Arriendo' | 'Servicios' | 'Mano de Obra' | 'Marketing' | 'Otros';
}
