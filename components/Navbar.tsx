"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Mis envíos" },
    { href: "/admin/envios", label: "Admin — Envíos" },
    { href: "/admin/operadores", label: "Admin — Operadores" },
  ];

  return (
    <nav className="bg-gray-900 border-b border-cyan-900 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📦</span>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-white">CORE</span>
            <span className="text-cyan-400">HARDWARE</span>
          </span>
        </Link>
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition ${
                pathname === link.href
                  ? "text-cyan-400 font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <UserButton />
    </nav>
  );
}