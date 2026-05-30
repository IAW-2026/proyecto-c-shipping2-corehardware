import Link from "next/link";
import TrackingSearch from "./TrackingSearch";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="flex justify-end mb-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Acceso operadores →
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            📦 CoreHardware
          </h1>
          <p className="text-gray-400 text-lg">
            Seguimiento de envíos
          </p>
        </div>
        <TrackingSearch />
      </div>
    </main>
  );
}