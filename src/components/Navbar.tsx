"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Menu, X } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { href: "/",          label: "Inicio"    },
  { href: "/anime",     label: "Anime"     },
  { href: "/series",    label: "Series"    },
  { href: "/peliculas", label: "Películas" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-glass)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black tracking-widest shrink-0"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
        >
          VORTEX
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-1.5 rounded-full text-sm font-medium tracking-wide transition-all"
                style={{
                  color: active ? "var(--neon-cyan)" : "var(--text-secondary)",
                  background: active ? "rgba(0,245,255,0.08)" : "transparent",
                  border: active ? "1px solid rgba(0,245,255,0.25)" : "1px solid transparent",
                  boxShadow: active ? "0 0 10px rgba(0,245,255,0.15)" : "none",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {/* Búsqueda inline */}
          <div className="hidden md:flex items-center gap-2">
            {search ? (
              <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
                <Search size={14} style={{ color: "var(--neon-cyan)" }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent outline-none text-sm w-40"
                  style={{ color: "var(--text-primary)" }}
                  onBlur={() => setSearch(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setSearch(true)}
                className="p-2 rounded-full glass glass-hover transition-all"
                style={{ color: "var(--text-secondary)" }}
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Login */}
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-all"
            style={{
              color: "var(--neon-violet)",
              border: "1px solid rgba(191,95,255,0.35)",
              boxShadow: "0 0 10px rgba(191,95,255,0.15)",
            }}
          >
            <User size={14} />
            Ingresar
          </Link>

          {/* Hamburger móvil */}
          <button
            className="md:hidden p-2 rounded-full glass"
            onClick={() => setOpen(!open)}
            style={{ color: "var(--text-secondary)" }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-2"
          style={{ borderTop: "1px solid var(--border-glass)" }}
        >
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-2 px-3 rounded-lg text-sm font-medium"
              style={{
                color: pathname === href ? "var(--neon-cyan)" : "var(--text-secondary)",
                background: pathname === href ? "rgba(0,245,255,0.06)" : "transparent",
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="py-2 px-3 rounded-lg text-sm font-medium"
            style={{ color: "var(--neon-violet)" }}
          >
            Ingresar
          </Link>
        </div>
      )}
    </header>
  );
}
