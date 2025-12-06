import { cookies } from "next/headers";
import { getAdminAuth } from "./firebaseAdmin";
import { prisma } from "./prisma";

export async function getCurrentAthlete() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseToken")?.value;

    if (!token) {
      return null;
    }

    // Verify Firebase token
    // During build, Firebase might not be initialized, so we handle that gracefully
    let adminAuth;
    try {
      adminAuth = getAdminAuth();
    } catch (error: any) {
      // If Firebase isn't initialized (e.g., during build), return null
      // This allows the build to complete
      const errorMessage = error?.message || String(error);
      if (
        errorMessage.includes("credentials") ||
        errorMessage.includes("missing") ||
        errorMessage.includes("required")
      ) {
        // During build phase, this is expected - return null to allow build to continue
        if (
          process.env.NEXT_PHASE === "phase-production-build" ||
          process.env.NEXT_PHASE === "phase-development-build"
        ) {
          return null;
        }
      }
      // Re-throw other errors
      throw error;
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Look up Athlete by firebaseId
    const athlete = await prisma.athlete.findUnique({
      where: {
        firebaseId: firebaseUid,
      },
    });

    return athlete;
  } catch (error) {
    console.error("Error getting current athlete:", error);
    return null;
  }
}

