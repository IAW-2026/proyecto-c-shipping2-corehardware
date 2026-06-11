import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type SessionMetadata = { role?: string };

function getRole(sessionClaims: unknown): string | undefined {
  const claims = sessionClaims as Record<string, unknown> | null | undefined;
  const meta = claims?.publicMetadata as SessionMetadata | undefined;
  return meta?.role;
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
