import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  Firestore
} from 'firebase/firestore';
import rawFirebaseConfig from '../../firebase-applet-config.json';

// Safe Firebase App Initialization
let app: any;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(rawFirebaseConfig);
} catch (e) {
  console.warn('Firebase app init warning, using default project config:', e);
  try {
    app = initializeApp({
      projectId: 'cachorro-feliz',
      apiKey: (rawFirebaseConfig as any).apiKey || 'AIzaSyDemo',
      authDomain: 'cachorro-feliz.firebaseapp.com'
    });
  } catch (err) {
    console.error('Firebase fallback init failed:', err);
  }
}

// Always use memoryLocalCache for 100% universal compatibility across all browser modes (incognito, safari, etc.)
let dbInstance: Firestore;
try {
  dbInstance = initializeFirestore(app, {
    localCache: memoryLocalCache()
  });
} catch (e) {
  try {
    dbInstance = getFirestore(app);
  } catch (err) {
    console.warn('Firestore fallback instance:', err);
    dbInstance = null as any;
  }
}

export const db = dbInstance;
