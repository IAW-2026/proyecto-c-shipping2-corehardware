import Link from "next/link";
import TrackingSearch from "./TrackingSearch";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="flex justify-end mb-6">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-cyan-400 transition"
            >
              Iniciar sesión →
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-5xl">📦</span>
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-white">CORE</span>
              <span className="text-cyan-400">HARDWARE</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Seguimiento de envíos
          </p>
          <div className="w-16 h-0.5 bg-cyan-400 mx-auto mt-4" />
        </div>
        <TrackingSearch />
      </div>
    </main>
  );
}