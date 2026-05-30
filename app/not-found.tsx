import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-8xl font-bold text-blue-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-2">
        Página no encontrada
      </h2>
      <p className="text-gray-400 mb-8">
        El recurso que buscás no existe o fue eliminado.
      </p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        Volver al inicio
      </Link>
    </main>
  );
}