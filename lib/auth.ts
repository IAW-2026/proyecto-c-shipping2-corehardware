import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Lee el rol del session token, aceptando tanto la convención `metadata`
// (Clerk compartido del equipo) como `publicMetadata` (Clerk privado anterior).
function getRole(sessionClaims: unknown): string | undefined {
  const claims = sessionClaims as Record<string, unknown> | null | undefined;
  if (!claims) return undefined;
  const meta =
    (claims.metadata as Record<string, unknown> | undefined) ??
    (claims.publicMetadata as Record<string, unknown> | undefined);
  return meta?.role as string | undefined;
}

export async function requireAdmin(): Promise<NextResponse | null> {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (getRole(sessionClaims) !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function requireOperador(): Promise<
  { userId: string; role: string } | NextResponse
> {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const role = getRole(sessionClaims);
  if (role !== "logistics" && role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return { userId, role };
}
