import { cookies } from "next/headers";
import { adminAuth } from "./firebaseAdmin";
import { prisma } from "./prisma";

export async function getCurrentAthlete() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseToken")?.value;

    if (!token) {
      return null;
    }

    // Verify Firebase token
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

