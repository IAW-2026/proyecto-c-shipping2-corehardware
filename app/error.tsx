"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-8xl font-bold text-red-400 mb-4">Error</h1>
      <h2 className="text-2xl font-semibold text-white mb-2">
        Algo salió mal
      </h2>
      <p className="text-gray-400 mb-8">
        Ocurrió un error inesperado.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}