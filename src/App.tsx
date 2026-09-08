import React, { useState, useEffect } from 'react';
import { 
  initialRawMaterials, 
  initialRecipes, 
  initialFinishedProducts, 
  initialClients, 
  initialSuppliers, 
  initialProductionBatches, 
  initialSales, 
  initialPurchases, 
  initialFixedCosts, 
  initialAdjustments 
} from './initialData';
import { 
  Sale, 
  RawMaterial, 
  FinishedProduct, 
  Recipe, 
  Client, 
  Supplier, 
  ProductionBatch, 
  PurchaseRecord, 
  FixedCost, 
  InventoryAdjustment, 
  OrderStatus, 
  Pet 
} from './types';

import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SalesView } from './components/SalesView';
import { ProductionView } from './components/ProductionView';
import { InventoryView } from './components/InventoryView';
import { PurchasesView } from './components/PurchasesView';
import { ClientsPetsView } from './components/ClientsPetsView';
import { FinancesView } from './components/FinancesView';
import { BrandIdentityView } from './components/BrandIdentityView';
import { AiAgentsStudioView } from './components/AiAgentsStudioView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { DeliveryRoutePlannerView } from './components/DeliveryRoutePlannerView';
import { PublicStoreView } from './components/PublicStoreView';
import { AdminPinModal } from './components/AdminPinModal';
import { ChangePinModal } from './components/ChangePinModal';
import { DatabaseResetModal, ResetMode } from './components/DatabaseResetModal';
import { 
  subscribeCollection, 
  saveDocument, 
  saveBatchDocuments, 
  deleteDocument, 
  clearCollection,
  loadLocalCollection,
  subscribeSecuritySettings
} from './lib/dbService';

// Safe Storage Reader for Private/Incognito Browsers
function checkStoredAdminAuth(): boolean {
  try {
    return localStorage.getItem('cachorro_admin_authenticated') === 'true' || 
           sessionStorage.getItem('cachorro_admin_authenticated') === 'true';
  } catch {
    return false;
  }
}

export function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => checkStoredAdminAuth());
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState<boolean>(false);
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'admin' | 'store'>('store');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // URL Hash/Query listener for direct Chef access
  useEffect(() => {
    const checkUrlAccess = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (window.location.hash === '#admin' || urlParams.get('admin') === 'true') {
          if (checkStoredAdminAuth()) {
            setViewMode('admin');
          } else {
            setIsAdminPinModalOpen(true);
          }
        }
      } catch (e) {
        console.warn('URL parsing notice:', e);
      }
    };

    checkUrlAccess();
    window.addEventListener('hashchange', checkUrlAccess);
    return () => window.removeEventListener('hashchange', checkUrlAccess);
  }, []);

  // Core Application Persistent State with Instant Local Storage Initialization
  const [sales, setSales] = useState<Sale[]>(() => loadLocalCollection('sales', initialSales));
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => loadLocalCollection('rawMaterials', initialRawMaterials));
  const [finishedProducts, setFinishedProducts] = useState<FinishedProduct[]>(() => loadLocalCollection('finishedProducts', initialFinishedProducts));
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadLocalCollection('recipes', initialRecipes));
  const [clients, setClients] = useState<Client[]>(() => loadLocalCollection('clients', initialClients));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadLocalCollection('suppliers', initialSuppliers));
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>(() => loadLocalCollection('productionBatches', initialProductionBatches));
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => loadLocalCollection('purchases', initialPurchases));
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>(() => loadLocalCollection('fixedCosts', initialFixedCosts));
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>(() => loadLocalCollection('inventoryAdjustments', initialAdjustments));

  // Modals Visibility
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState<boolean>(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState<boolean>(false);
  const [isNewPurchaseModalOpen, setIsNewPurchaseModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // --- REAL-TIME CLOUD FIRESTORE & LOCAL DATABASE SYNCHRONIZATION ---
  useEffect(() => {
    const unsubs: Array<() => void> = [];

    try {
      unsubs.push(subscribeCollection<RawMaterial>('rawMaterials', setRawMaterials, initialRawMaterials));
      unsubs.push(subscribeCollection<Recipe>('recipes', setRecipes, initialRecipes));
      unsubs.push(subscribeCollection<FinishedProduct>('finishedProducts', setFinishedProducts, initialFinishedProducts));
      unsubs.push(subscribeCollection<Client>('clients', setClients, initialClients));
      unsubs.push(subscribeCollection<Supplier>('suppliers', setSuppliers, initialSuppliers));
      unsubs.push(subscribeCollection<ProductionBatch>('productionBatches', setProductionBatches, initialProductionBatches));
      unsubs.push(subscribeCollection<Sale>('sales', setSales, initialSales));
      unsubs.push(subscribeCollection<PurchaseRecord>('purchases', setPurchases, initialPurchases));
      unsubs.push(subscribeCollection<FixedCost>('fixedCosts', setFixedCosts, initialFixedCosts));
      unsubs.push(subscribeCollection<InventoryAdjustment>('inventoryAdjustments', setAdjustments, initialAdjustments));
      unsubs.push(subscribeSecuritySettings((pin) => {
        try {
          localStorage.setItem('cachorro_admin_pin', pin);
        } catch {}
      }));
    } catch (err) {
      console.warn('Subscription setup notice:', err);
    }

    return () => {
      unsubs.forEach(unsub => {
        try {
          if (typeof unsub === 'function') unsub();
        } catch {}
      });
    };
  }, []);

  // --- HANDLERS WITH AUTOMATIC CLOUD SYNC ---

  // 1. Add New Sale
  const handleAddSale = async (newSaleData: Omit<Sale, 'id' | 'saleNumber'>) => {
    const nextIdNumber = sales.length + 1;
    const saleNumber = `PED-${String(nextIdNumber).padStart(3, '0')}`;

    const newSale: Sale = {
      ...newSaleData,
      id: `sale-${Date.now()}`,
      saleNumber
    };

    await saveDocument('sales', newSale);

    // Deduct stock from Finished Products
    const updatedProducts = finishedProducts.map(fp => {
      const itemSold = newSale.items.find(i => i.finishedProductId === fp.id);
      if (itemSold) {
        const updatedStock = Math.max(0, fp.stockUnits - itemSold.quantity);
        return { ...fp, stockUnits: updatedStock };
      }
      return fp;
    });

    await saveBatchDocuments('finishedProducts', updatedProducts);

    // Update Client Total Purchases & Add client if newly created
    if (newSale.clientId === 'NEW') {
      const newClient: Client = {
        id: `client-${Date.now()}`,
        name: newSale.clientName,
        phone: '3000000000',
        address: newSale.shippingAddress,
        city: 'Bogotá',
        totalPurchases: newSale.total,
        pets: newSale.petName ? [{
          id: `pet-${Date.now()}`,
          name: newSale.petName,
          type: 'Perro',
          birthday: '2022-08-20'
        }] : []
      };
      await saveDocument('clients', newClient);
    } else {
      const clientToUpdate = clients.find(c => c.id === newSale.clientId);
      if (clientToUpdate) {
        await saveDocument('clients', {
          ...clientToUpdate,
          totalPurchases: clientToUpdate.totalPurchases + newSale.total
        });
      }
    }
  };

  // 2. Update Order Status
  const handleUpdateSaleStatus = async (saleId: string, status: OrderStatus, trackingCode?: string, deliveryPerson?: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (sale) {
      const updatedSale: Sale = {
        ...sale,
        status,
        trackingCode: trackingCode || sale.trackingCode,
        deliveryPerson: deliveryPerson || sale.deliveryPerson
      };
      await saveDocument('sales', updatedSale);
    }
  };

  // 3. Execute Production Batch (Deducts Raw Material Net Stock, Adds Finished Goods, Updates Costs)
  const handleExecuteBatch = async (
    recipe: Recipe,
    multiplier: number,
    producedPackages: { finishedProductId: string; packageSizeGrams: number; unitsProduced: number }[],
    notes: string
  ) => {
    // A. Deduct Raw Materials Net Stock
    const updatedRawMaterials = rawMaterials.map(rm => {
      const ingredient = recipe.ingredients.find(ing => ing.rawMaterialId === rm.id);
      if (ingredient) {
        const totalNetQuantityDeducted = ingredient.requiredNetQuantity * multiplier;
        const newNetStock = Math.max(0, rm.stockNetUsable - totalNetQuantityDeducted);
        return {
          ...rm,
          stockNetUsable: newNetStock
        };
      }
      return rm;
    });

    await saveBatchDocuments('rawMaterials', updatedRawMaterials);

    // B. Calculate Batch Real Total Cost
    let batchRawMaterialsCost = 0;
    recipe.ingredients.forEach(ing => {
      const rm = rawMaterials.find(r => r.id === ing.rawMaterialId);
      const unitNetCost = rm ? rm.weightedAvgNetCostPerUnit : 0;
      batchRawMaterialsCost += (ing.requiredNetQuantity * multiplier) * unitNetCost;
    });

    const fixedCostAllocation = 15000 * multiplier;
    const totalBatchCost = batchRawMaterialsCost + fixedCostAllocation;

    const totalYieldGrams = recipe.postCookFinalYieldGrams * multiplier;
    const costPerGram = totalYieldGrams > 0 ? totalBatchCost / totalYieldGrams : 0;

    // C. Add Produced Package Units to Finished Products and update unit cost
    const updatedFinishedProducts = finishedProducts.map(fp => {
      const packageProduced = producedPackages.find(p => p.finishedProductId === fp.id);
      if (packageProduced) {
        const newStock = fp.stockUnits + packageProduced.unitsProduced;
        const newUnitCost = Math.round(costPerGram * fp.packageSizeGrams);
        return {
          ...fp,
          stockUnits: newStock,
          currentUnitCost: newUnitCost
        };
      }
      return fp;
    });

    await saveBatchDocuments('finishedProducts', updatedFinishedProducts);

    // D. Log Batch Record
    const nextBatchNum = `LOTE-${String(productionBatches.length + 1).padStart(3, '0')}`;
    const newBatch: ProductionBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: nextBatchNum,
      date: new Date().toISOString().split('T')[0],
      recipeId: recipe.id,
      recipeName: recipe.name,
      batchMultiplier: multiplier,
      rawMixWeightGrams: recipe.rawMixTotalGrams * multiplier,
      actualFinalYieldGrams: recipe.postCookFinalYieldGrams * multiplier,
      yieldPackagesProduced: producedPackages.map(p => {
        const fp = finishedProducts.find(f => f.id === p.finishedProductId);
        return {
          finishedProductId: p.finishedProductId,
          finishedProductName: fp ? fp.name : 'Producto',
          packageSizeGrams: p.packageSizeGrams,
          unitsProduced: p.unitsProduced
        };
      }),
      rawMaterialsCostTotal: batchRawMaterialsCost,
      allocatedFixedCost: fixedCostAllocation,
      totalBatchCost,
      costPerFinishedUnit: Math.round(costPerGram * 250),
      notes
    };

    await saveDocument('productionBatches', newBatch);
  };

  // 4. Register Purchase and Recalculate Weighted Average Net Cost
  const handleAddPurchase = async (purchaseData: Omit<PurchaseRecord, 'id' | 'supplierName' | 'rawMaterialName'>) => {
    const rm = rawMaterials.find(r => r.id === purchaseData.rawMaterialId);
    const sup = suppliers.find(s => s.id === purchaseData.supplierId);

    if (!rm) return;

    // Recalculate Weighted Average Costs
    const oldNetStock = rm.stockNetUsable;
    const oldNetCost = rm.weightedAvgNetCostPerUnit;
    const addedNetGrams = purchaseData.netUsableGrams;
    const newNetCostForThisLot = purchaseData.realCostPerNetGram;

    const newNetStockTotal = oldNetStock + addedNetGrams;
    const newWeightedAvgNetCost = newNetStockTotal > 0
      ? ((oldNetStock * oldNetCost) + (addedNetGrams * newNetCostForThisLot)) / newNetStockTotal
      : newNetCostForThisLot;

    const oldGrossStock = rm.stockGross;
    const addedGrossGrams = purchaseData.quantityBoughtGross;
    const newGrossStockTotal = oldGrossStock + addedGrossGrams;

    const updatedRm: RawMaterial = {
      ...rm,
      stockGross: newGrossStockTotal,
      stockNetUsable: newNetStockTotal,
      weightedAvgNetCostPerUnit: newWeightedAvgNetCost
    };

    await saveDocument('rawMaterials', updatedRm);

    const newPurchaseRecord: PurchaseRecord = {
      ...purchaseData,
      id: `purchase-${Date.now()}`,
      supplierName: sup ? sup.name : 'Proveedor',
      rawMaterialName: rm.name
    };

    await saveDocument('purchases', newPurchaseRecord);
  };

  // 5. Add Inventory Manual Adjustment (Damage, Expiration, Samples, Reconciliation)
  const handleAddAdjustment = async (adjData: Omit<InventoryAdjustment, 'id'>) => {
    const newAdj: InventoryAdjustment = {
      ...adjData,
      id: `adj-${Date.now()}`
    };

    await saveDocument('inventoryAdjustments', newAdj);

    if (adjData.itemType === 'RawMaterial') {
      const rm = rawMaterials.find(r => r.id === adjData.itemId);
      if (rm) {
        await saveDocument('rawMaterials', {
          ...rm,
          stockNetUsable: Math.max(0, rm.stockNetUsable + adjData.quantityAdjusted)
        });
      }
    } else {
      const fp = finishedProducts.find(f => f.id === adjData.itemId);
      if (fp) {
        await saveDocument('finishedProducts', {
          ...fp,
          stockUnits: Math.max(0, fp.stockUnits + adjData.quantityAdjusted)
        });
      }
    }
  };

  // 6. Add Client & Pet
  const handleAddClient = async (clientData: Omit<Client, 'id' | 'totalPurchases'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      totalPurchases: 0
    };
    await saveDocument('clients', newClient);
  };

  const handleAddPetToClient = async (clientId: string, petData: Omit<Pet, 'id'>) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const newPet: Pet = {
        ...petData,
        id: `pet-${Date.now()}`
      };
      await saveDocument('clients', {
        ...client,
        pets: [...client.pets, newPet]
      });
    }
  };

  // 7. Add Supplier
  const handleAddSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`
    };
    await saveDocument('suppliers', newSup);
  };

  // 8. Add Fixed Cost
  const handleAddFixedCost = async (fixedCostData: Omit<FixedCost, 'id'>) => {
    const newFc: FixedCost = {
      ...fixedCostData,
      id: `fc-${Date.now()}`
    };
    await saveDocument('fixedCosts', newFc);
  };

  // 9. Add New Recipe (from Cost Calculator)
  const handleAddRecipe = async (recipe: Recipe) => {
    await saveDocument('recipes', recipe);
  };

  // 10. Add Raw Material & Finished Product
  const handleAddRawMaterial = async (rm: RawMaterial) => {
    await saveDocument('rawMaterials', rm);
  };

  const handleAddFinishedProduct = async (fp: FinishedProduct) => {
    await saveDocument('finishedProducts', fp);
  };


  // Update Finished Product (Price & Stock)
  const handleUpdateFinishedProduct = async (updatedFp: FinishedProduct) => {
    await saveDocument('finishedProducts', updatedFp);
    setFinishedProducts(prev => prev.map(p => p.id === updatedFp.id ? updatedFp : p));
  };

  // Delete Finished Product
  const handleDeleteFinishedProduct = async (fpId: string) => {
    await deleteDocument('finishedProducts', fpId);
    setFinishedProducts(prev => prev.filter(p => p.id !== fpId));
  };

  // Delete Client
  const handleDeleteClient = async (clientId: string) => {
    await deleteDocument('clients', clientId);
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  // Update Client
  const handleUpdateClient = async (updatedClient: Client) => {
    await saveDocument('clients', updatedClient);
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  // Delete Pet from Client
  const handleDeletePetFromClient = async (clientId: string, petId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const updatedClient: Client = {
        ...client,
        pets: client.pets.filter(p => p.id !== petId)
      };
      await saveDocument('clients', updatedClient);
      setClients(prev => prev.map(c => c.id === clientId ? updatedClient : c));
    }
  };

  // Reset Database Engine
  const handleResetDatabase = async (mode: ResetMode) => {
    if (mode === 'clean_ops') {
      // Clear operational demo data
      await clearCollection('sales');
      await clearCollection('productionBatches');
      await clearCollection('purchases');
      await clearCollection('inventoryAdjustments');
      await clearCollection('clients');
      
      setSales([]);
      setProductionBatches([]);
      setPurchases([]);
      setAdjustments([]);
      setClients([]);

      // Zero out stock in finished products and raw materials while keeping recipes & catalog
      const zeroedFinished = finishedProducts.map(fp => ({ ...fp, stockUnits: 0 }));
      await saveBatchDocuments('finishedProducts', zeroedFinished);
      setFinishedProducts(zeroedFinished);

      const zeroedRaw = rawMaterials.map(rm => ({ ...rm, stockGross: 0, stockNetUsable: 0 }));
      await saveBatchDocuments('rawMaterials', zeroedRaw);
      setRawMaterials(zeroedRaw);

      localStorage.setItem('cachorro_seeded_v1', 'true');
    } else if (mode === 'factory_reset') {
      // Full Wipe
      await clearCollection('sales');
      await clearCollection('productionBatches');
      await clearCollection('purchases');
      await clearCollection('inventoryAdjustments');
      await clearCollection('clients');
      await clearCollection('rawMaterials');
      await clearCollection('recipes');
      await clearCollection('finishedProducts');
      await clearCollection('suppliers');
      await clearCollection('fixedCosts');

      setSales([]);
      setProductionBatches([]);
      setPurchases([]);
      setAdjustments([]);
      setClients([]);
      setRawMaterials([]);
      setRecipes([]);
      setFinishedProducts([]);
      setSuppliers([]);
      setFixedCosts([]);

      localStorage.setItem('cachorro_seeded_v1', 'true');
    } else if (mode === 'restore_demo') {
      // Restore default demo datasets
      await saveBatchDocuments('rawMaterials', initialRawMaterials);
      await saveBatchDocuments('recipes', initialRecipes);
      await saveBatchDocuments('finishedProducts', initialFinishedProducts);
      await saveBatchDocuments('clients', initialClients);
      await saveBatchDocuments('suppliers', initialSuppliers);
      await saveBatchDocuments('productionBatches', initialProductionBatches);
      await saveBatchDocuments('sales', initialSales);
      await saveBatchDocuments('purchases', initialPurchases);
      await saveBatchDocuments('fixedCosts', initialFixedCosts);
      await saveBatchDocuments('inventoryAdjustments', initialAdjustments);

      setRawMaterials(initialRawMaterials);
      setRecipes(initialRecipes);
      setFinishedProducts(initialFinishedProducts);
      setClients(initialClients);
      setSuppliers(initialSuppliers);
      setProductionBatches(initialProductionBatches);
      setSales(initialSales);
      setPurchases(initialPurchases);
      setFixedCosts(initialFixedCosts);
      setAdjustments(initialAdjustments);

      localStorage.setItem('cachorro_seeded_v1', 'true');
    }
  };

  // Navigation & Modal Action Helpers
  const handleOpenNewSale = () => {
    setActiveTab('sales');
    setIsNewSaleModalOpen(true);
  };

  const handleOpenNewBatch = () => {
    setActiveTab('production');
    setIsNewBatchModalOpen(true);
  };

  const handleOpenNewPurchase = () => {
    setActiveTab('purchases');
    setIsNewPurchaseModalOpen(true);
  };

  const handleRequestAdmin = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setIsAdminPinModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminPinModalOpen(false);
    setViewMode('admin');
  };

  const handleLockAdmin = () => {
    try {
      localStorage.removeItem('cachorro_admin_authenticated');
      sessionStorage.removeItem('cachorro_admin_authenticated');
    } catch {}
    setIsAdminAuthenticated(false);
    setViewMode('store');
  };

  if (viewMode === 'store') {
    return (
      <>
        <PublicStoreView
          finishedProducts={finishedProducts}
          onRequestAdmin={handleRequestAdmin}
        />
        <AdminPinModal
          isOpen={isAdminPinModalOpen}
          onClose={() => setIsAdminPinModalOpen(false)}
          onSuccess={handleAdminAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] font-sans text-[#333333] flex flex-col">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewSale={handleOpenNewSale}
        onOpenNewBatch={handleOpenNewBatch}
        onOpenNewPurchase={handleOpenNewPurchase}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenPublicStore={() => setViewMode('store')}
        onLockAdmin={handleLockAdmin}
        onChangePin={() => setIsChangePinModalOpen(true)}
        onOpenDatabaseReset={() => setIsResetModalOpen(true)}
        lowStockCount={rawMaterials.filter(rm => rm.stockNetUsable <= rm.minStockThreshold).length}
        upcomingBirthdaysCount={clients.flatMap(c => c.pets).length}
      />

      {/* Main Container View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            sales={sales}
            rawMaterials={rawMaterials}
            finishedProducts={finishedProducts}
            clients={clients}
            productionBatches={productionBatches}
            purchases={purchases}
            onNavigateTab={setActiveTab}
            onOpenNewSale={handleOpenNewSale}
            onOpenNewBatch={handleOpenNewBatch}
            onOpenNewPurchase={handleOpenNewPurchase}
            onSelectPetForBirthdayGreeting={() => setActiveTab('clients')}
          />
        )}

        {activeTab === 'sales' && (
          <SalesView
            sales={sales}
            clients={clients}
            finishedProducts={finishedProducts}
            onAddSale={handleAddSale}
            onUpdateSaleStatus={handleUpdateSaleStatus}
            isNewSaleModalOpen={isNewSaleModalOpen}
            setIsNewSaleModalOpen={setIsNewSaleModalOpen}
          />
        )}

        {activeTab === 'routes' && (
          <DeliveryRoutePlannerView
            sales={sales}
            onUpdateSaleStatus={handleUpdateSaleStatus}
          />
        )}

        {activeTab === 'production' && (
          <ProductionView
            recipes={recipes}
            rawMaterials={rawMaterials}
            finishedProducts={finishedProducts}
            productionBatches={productionBatches}
            fixedCosts={fixedCosts}
            onExecuteBatch={handleExecuteBatch}
            onAddRecipe={handleAddRecipe}
            isNewBatchModalOpen={isNewBatchModalOpen}
            setIsNewBatchModalOpen={setIsNewBatchModalOpen}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            rawMaterials={rawMaterials}
            finishedProducts={finishedProducts}
            adjustments={adjustments}
            onAddAdjustment={handleAddAdjustment}
            onOpenNewPurchase={handleOpenNewPurchase}
            onAddRawMaterial={handleAddRawMaterial}
            onAddFinishedProduct={handleAddFinishedProduct}
            onUpdateFinishedProduct={handleUpdateFinishedProduct}
            onDeleteFinishedProduct={handleDeleteFinishedProduct}
          />
        )}

        {activeTab === 'purchases' && (
          <PurchasesView
            suppliers={suppliers}
            purchases={purchases}
            rawMaterials={rawMaterials}
            onAddPurchase={handleAddPurchase}
            onAddSupplier={handleAddSupplier}
            isNewPurchaseModalOpen={isNewPurchaseModalOpen}
            setIsNewPurchaseModalOpen={setIsNewPurchaseModalOpen}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsPetsView
            clients={clients}
            onAddClient={handleAddClient}
            onAddPetToClient={handleAddPetToClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onDeletePetFromClient={handleDeletePetFromClient}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
          />
        )}

        {activeTab === 'finances' && (
          <FinancesView
            fixedCosts={fixedCosts}
            sales={sales}
            purchases={purchases}
            finishedProducts={finishedProducts}
            recipes={recipes}
            onAddFixedCost={handleAddFixedCost}
          />
        )}

        {activeTab === 'brand' && (
          <BrandIdentityView
            recipes={recipes}
            finishedProducts={finishedProducts}
          />
        )}

        {activeTab === 'ai-studio' && (
          <AiAgentsStudioView
            recipes={recipes}
            finishedProducts={finishedProducts}
            rawMaterials={rawMaterials}
            clients={clients}
            suppliers={suppliers}
            sales={sales}
            onAddNewRecipe={async (newRecipeData) => {
              const newRecipe: Recipe = {
                ...newRecipeData,
                id: `recipe-${Date.now()}`
              };
              await handleAddRecipe(newRecipe);
            }}
          />
        )}
      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        contextData={{
          totalSales: sales.length,
          totalClients: clients.length,
          lowStockMaterials: rawMaterials.filter(r => r.stockNetUsable <= r.minStockThreshold)
        }}
      />

      {/* Database Management & Reset Modal */}
      <DatabaseResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleResetDatabase}
      />

      {/* Change Security PIN Modal */}
      <ChangePinModal
        isOpen={isChangePinModalOpen}
        onClose={() => setIsChangePinModalOpen(false)}
      />
    </div>
  );
}

export default App;
