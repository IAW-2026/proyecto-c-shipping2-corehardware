import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/api/shipping(.*)",
  "/api/tracking(.*)",
  "/api/webhooks(.*)",
  "/api/health",
  "/api/control-plane(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

function readRole(sessionClaims: unknown): string | undefined {
  const claims = sessionClaims as Record<string, unknown> | null | undefined;
  if (!claims) return undefined;
  const meta =
    (claims.metadata as Record<string, unknown> | undefined) ??
    (claims.publicMetadata as Record<string, unknown> | undefined);
  return meta?.role as string | undefined;
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const role = readRole(sessionClaims);

  if (isAdminRoute(req) && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (isDashboardRoute(req) && role !== "logistics" && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
