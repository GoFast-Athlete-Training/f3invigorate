import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * No redirects for now — just public URLs. Root / is splash, /f3serve is opportunities.
 * Add host-based or auth logic here later if needed.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}
