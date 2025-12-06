import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App | undefined;
let adminAuth: Auth | undefined;

/**
 * Check if we're in a Next.js build phase
 */
function isBuildPhase(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PHASE === "phase-development-build" ||
    process.env.NEXT_PHASE === "phase-export" ||
    (typeof process.env.NEXT_RUNTIME === "undefined" &&
      process.env.NODE_ENV === "production" &&
      !process.env.VERCEL_ENV)
  );
}

/**
 * Get Firebase Admin Auth instance with lazy initialization.
 * This prevents build-time errors when environment variables are not available.
 */
export function getAdminAuth(): Auth {
  if (typeof window !== "undefined") {
    throw new Error("Firebase Admin can only be used on the server side");
  }

  // Return cached instance if available
  if (adminAuth) {
    return adminAuth;
  }

  // Initialize if not already initialized
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // During build time, env vars might not be available
    // Only initialize if we have all required values
    if (!projectId || !clientEmail || !privateKey) {
      const isBuild = isBuildPhase();
      
      // During build phase, we need to handle this gracefully
      // Next.js will try to analyze API routes during build
      if (isBuild) {
        // For build phase, we'll create a minimal stub that allows build to complete
        // but will fail at runtime with a clear error
        console.warn(
          "⚠️ Firebase Admin credentials missing during build. " +
          "API routes requiring authentication will fail at runtime if credentials are not set."
        );
        // We can't create a real auth instance, so we'll let it fail
        // but with a more helpful error message
        throw new Error(
          "Firebase Admin credentials are required but not available during build. " +
          "Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY " +
          "are set in your Vercel environment variables. " +
          "The build will fail, but once credentials are set, the build will succeed."
        );
      }
      
      // At runtime, throw a clear error
      throw new Error(
        "Firebase Admin credentials are missing. " +
        "Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY " +
        "in your environment variables."
      );
    }

    // Validate that values are not empty strings
    if (
      projectId.trim() === "" ||
      clientEmail.trim() === "" ||
      privateKey.trim() === ""
    ) {
      throw new Error(
        "Firebase Admin credentials are empty. " +
        "Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY " +
        "are set with valid (non-empty) values."
      );
    }

    const serviceAccount = {
      projectId: projectId.trim(),
      clientEmail: clientEmail.trim(),
      privateKey: privateKey.replace(/\\n/g, "\n").trim(),
    };

    try {
      app = initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error: any) {
      // If initialization fails, provide a helpful error message
      const errorMessage = error?.message || String(error);
      throw new Error(
        `Failed to initialize Firebase Admin: ${errorMessage}. ` +
        "Please verify that your FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY " +
        "are correctly set and valid."
      );
    }
  } else {
    app = getApps()[0];
  }

  adminAuth = getAuth(app);
  return adminAuth;
}

