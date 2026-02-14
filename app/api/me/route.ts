export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/me
 * Returns the current F3HIM (universal person) for the bearer token.
 * Used by f3volunteermatch and other apps that treat Invigorate as the identity source.
 * Accepts: Authorization: Bearer <firebaseIdToken>
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json({ error: "Auth unavailable" }, { status: 500 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const firebaseId = decodedToken.uid;
    const f3him = await prisma.f3HIM.findUnique({
      where: { firebaseId },
    });

    if (!f3him) {
      return NextResponse.json(
        { error: "Not found", message: "No F3HIM for this account. Sign up via Invigorate first." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: f3him.id,
      firebaseId: f3him.firebaseId,
      email: f3him.email,
      firstName: f3him.firstName,
      lastName: f3him.lastName,
      f3Handle: f3him.f3Handle,
      photoURL: f3him.photoURL,
    });
  } catch (err) {
    console.error("GET /api/me error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
