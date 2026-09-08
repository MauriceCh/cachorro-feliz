import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// Helper to recursively strip any undefined values before saving to Firestore
function cleanUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined) as unknown as T;
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanUndefined(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

// ----------------------------------------------------
// 1. LOCAL STORAGE PERSISTENCE LAYER (100% RELIABLE)
// ----------------------------------------------------
const STORAGE_PREFIX = 'cachorro_db_v2_';

export function loadLocalCollection<T>(collectionName: string, defaultFallback: T[] = []): T[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultFallback;
    }
    const raw = localStorage.getItem(STORAGE_PREFIX + collectionName);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return defaultFallback;
  } catch (e) {
    console.warn(`Error reading local storage for ${collectionName}:`, e);
    return defaultFallback;
  }
}

export function saveLocalCollection<T>(collectionName: string, items: T[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify(items));
    }
  } catch (e) {
    console.warn(`Error saving local storage for ${collectionName}:`, e);
  }
}

export function clearLocalCollection(collectionName: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify([]));
    }
  } catch (e) {
    console.warn(`Error clearing local storage for ${collectionName}:`, e);
  }
}

// ----------------------------------------------------
// 2. SAFE ASYNC TIMEOUT RUNNER (PREVENTS HANGING)
// ----------------------------------------------------
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500): Promise<T | null> {
  let timeoutHandle: any;
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutHandle = setTimeout(() => resolve(null), timeoutMs);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle);
    return result;
  } catch (err) {
    clearTimeout(timeoutHandle);
    console.warn('Async cloud operation timed out/notice:', err);
    return null;
  }
}

// ----------------------------------------------------
// 3. SECURITY & PIN SYNCHRONIZATION (CROSS-DEVICE)
// ----------------------------------------------------
export async function fetchCloudAdminPin(): Promise<string> {
  try {
    if (!db) {
      return localStorage.getItem('cachorro_admin_pin') || '1234';
    }
    const secDoc = await withTimeout(getDoc(doc(db, 'systemSettings', 'security')), 2000);
    if (secDoc && secDoc.exists()) {
      const data = secDoc.data();
      if (data && data.adminPin) {
        try {
          localStorage.setItem('cachorro_admin_pin', data.adminPin);
        } catch {}
        return String(data.adminPin);
      }
    }
  } catch (err) {
    console.warn('Could not fetch cloud PIN:', err);
  }
  return localStorage.getItem('cachorro_admin_pin') || '1234';
}

export function subscribeSecuritySettings(callback: (pin: string) => void): () => void {
  try {
    if (!db) return () => {};
    const docRef = doc(db, 'systemSettings', 'security');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.adminPin) {
          const pin = String(data.adminPin);
          try {
            localStorage.setItem('cachorro_admin_pin', pin);
          } catch {}
          callback(pin);
        }
      }
    }, (err) => {
      console.warn('Security settings listener notice:', err.message);
    });
    return typeof unsub === 'function' ? unsub : () => {};
  } catch (err) {
    return () => {};
  }
}

export async function updateAdminPin(newPin: string): Promise<void> {
  const pinClean = newPin.trim();
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cachorro_admin_pin', pinClean);
    }
  } catch {}

  if (db) {
    await withTimeout(
      setDoc(doc(db, 'systemSettings', 'security'), {
        id: 'security',
        adminPin: pinClean,
        updatedAt: new Date().toISOString()
      }, { merge: true }),
      2500
    );
  }
}

// ----------------------------------------------------
// 4. CLOUD FIRESTORE ASYNC SYNC (NON-BLOCKING)
// ----------------------------------------------------

export function subscribeCollection<T extends { id: string }>(
  collectionName: string, 
  callback: (data: T[]) => void,
  initialDataIfEmpty?: T[]
): () => void {
  try {
    // 1. Immediately provide local stored data or fallback
    const localData = loadLocalCollection<T>(collectionName, initialDataIfEmpty || []);
    callback(localData);

    if (!db) {
      return () => {};
    }

    const colRef = collection(db, collectionName);
    
    const unsub = onSnapshot(colRef, (snapshot) => {
      try {
        const cloudItems: T[] = snapshot.docs.map(d => ({
          ...d.data(),
          id: d.id
        } as T));

        // When cloud responds, cloud items are the single source of truth across all devices!
        saveLocalCollection(collectionName, cloudItems);
        callback(cloudItems);
      } catch (innerErr) {
        console.warn(`Snapshot parse error for ${collectionName}:`, innerErr);
      }
    }, (error) => {
      console.warn(`Firestore listener notice for ${collectionName} (using local storage):`, error.message);
    });

    return typeof unsub === 'function' ? unsub : () => {};
  } catch (err) {
    console.warn(`Could not subscribe to ${collectionName}:`, err);
    return () => {};
  }
}

export async function saveDocument<T extends { id: string }>(collectionName: string, item: T) {
  try {
    // 1. Update local storage immediately
    const current = loadLocalCollection<T>(collectionName);
    const index = current.findIndex(i => i.id === item.id);
    let updated: T[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = item;
    } else {
      updated = [...current, item];
    }
    saveLocalCollection(collectionName, updated);

    // 2. Asynchronously sync to Cloud with timeout
    if (db) {
      await withTimeout(setDoc(doc(db, collectionName, item.id), cleanUndefined(item), { merge: true }), 2500);
    }
  } catch (err) {
    console.warn(`Cloud save notice for ${collectionName}:`, err);
  }
}

export async function deleteDocument<T extends { id: string }>(collectionName: string, id: string) {
  try {
    // 1. Update local storage immediately
    const current = loadLocalCollection<T>(collectionName);
    const updated = current.filter(i => i.id !== id);
    saveLocalCollection(collectionName, updated);

    // 2. Asynchronously delete from Cloud with timeout
    if (db) {
      await withTimeout(deleteDoc(doc(db, collectionName, id)), 2500);
    }
  } catch (err) {
    console.warn(`Cloud delete notice for ${collectionName}:`, err);
  }
}

export async function saveBatchDocuments<T extends { id: string }>(collectionName: string, items: T[]) {
  try {
    // 1. Update local storage immediately
    saveLocalCollection(collectionName, items);

    // 2. Asynchronously batch save to Cloud with timeout
    if (db && items.length > 0) {
      await withTimeout((async () => {
        const batch = writeBatch(db);
        for (const item of items) {
          const docRef = doc(db, collectionName, item.id);
          batch.set(docRef, cleanUndefined(item), { merge: true });
        }
        await batch.commit();
      })(), 3000);
    }
  } catch (err) {
    console.warn(`Cloud batch save notice for ${collectionName}:`, err);
  }
}

export async function clearCollection(collectionName: string) {
  try {
    // 1. Wipe local storage immediately
    clearLocalCollection(collectionName);

    // 2. Asynchronously wipe Cloud collection with timeout
    if (db) {
      await withTimeout((async () => {
        const colRef = collection(db, collectionName);
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          const batch = writeBatch(db);
          snap.docs.forEach(d => {
            batch.delete(d.ref);
          });
          await batch.commit();
        }
      })(), 3000);
    }
  } catch (err) {
    console.warn(`Cloud clear notice for ${collectionName}:`, err);
  }
}
