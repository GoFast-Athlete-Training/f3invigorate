import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App;
let adminAuth: Auth;

if (typeof window === "undefined") {
  // Server-side only
  if (getApps().length === 0) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    app = initializeApp({
      credential: cert(serviceAccount as any),
    });
  } else {
    app = getApps()[0];
  }
  adminAuth = getAuth(app);
}

export { adminAuth };

