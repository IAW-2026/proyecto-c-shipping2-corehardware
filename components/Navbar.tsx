"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  const links = [
    { href: "/dashboard", label: "Mis envíos", roles: ["logistics"] },
    { href: "/admin/envios", label: "Admin — Envíos", roles: ["admin"] },
    { href: "/admin/operadores", label: "Admin — Operadores", roles: ["admin"] },
  ];

  const visibleLinks = links.filter((l) => role && l.roles.includes(role));

  return (
    <SignedIn>
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
            {visibleLinks.map((link) => (
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
    </SignedIn>
  );
}
