import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

let app: FirebaseApp;
let auth: Auth;

try {
  const hasConfig = typeof firebaseConfig.apiKey === "string" && firebaseConfig.apiKey.length > 0;
  if (hasConfig && !getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    if (typeof window !== "undefined") {
      setPersistence(auth, browserLocalPersistence).catch(() => {});
    }
  } else if (getApps().length) {
    app = getApp();
    auth = getAuth(app);
  } else {
    app = {} as FirebaseApp;
    auth = {} as Auth;
  }
} catch {
  // Build-time or missing env: avoid auth/invalid-api-key so static generation can complete
  app = {} as FirebaseApp;
  auth = {} as Auth;
}

export { app, auth };

