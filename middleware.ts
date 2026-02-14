import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route by host so we have two front doors on the same app:
 * - f3capitalimpact.org        → Volunteer Match (root path goes to /volunteer)
 * - grow.f3capitalimpact.org   → Invigorate (root path stays /)
 *
 * Set in env (optional): VOLUNTEER_HOST, INVIGORATE_HOST (defaults above in production).
 */
const VOLUNTEER_HOST = process.env.VOLUNTEER_HOST || "f3capitalimpact.org";
const INVIGORATE_HOST = process.env.INVIGORATE_HOST || "grow.f3capitalimpact.org";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const pathname = request.nextUrl.pathname;

  // Only redirect on the production Volunteer host (skip localhost / dev)
  if (host === VOLUNTEER_HOST && pathname === "/") {
    return NextResponse.redirect(new URL("/volunteer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
