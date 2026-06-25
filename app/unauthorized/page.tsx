import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

function getRole(sessionClaims: unknown): string | undefined {
  const claims = sessionClaims as Record<string, unknown> | null | undefined;
  if (!claims) return undefined;
  const meta =
    (claims.metadata as Record<string, unknown> | undefined) ??
    (claims.publicMetadata as Record<string, unknown> | undefined);
  return meta?.role as string | undefined;
}

export default async function UnauthorizedPage() {
  const { sessionClaims } = await auth();
  const role = getRole(sessionClaims);

  // Decide a dónde mandar al usuario según su rol.
  const panelHref =
    role === "admin"
      ? "/admin/envios"
      : role === "logistics"
        ? "/dashboard"
        : null;

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-8xl font-bold text-yellow-400 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-white mb-2">
        Acceso no autorizado
      </h2>
      <p className="text-gray-400 mb-8">
        No tenés permisos para acceder a esta sección.
      </p>
      <div className="flex gap-4">
        {panelHref && (
          <Link
            href={panelHref}
            className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 px-6 py-3 rounded-lg font-semibold transition"
          >
            Volver a mi panel
          </Link>
        )}
        <Link
          href="/"
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
