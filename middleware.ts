import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/api/shipping(.*)",
  "/api/tracking(.*)",
  "/api/webhooks(.*)",
  "/api/health",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const role = (sessionClaims as Record<string, unknown>)?.publicMetadata
    ? ((sessionClaims as Record<string, unknown>).publicMetadata as Record<string, unknown>)?.role
    : undefined;

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