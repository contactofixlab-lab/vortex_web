"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, Menu, X, Heart, LogOut, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { cerrarSesion } from "@/app/actions";

const LINKS = [
  { href: "/",          label: "Inicio"    },
  { href: "/anime",     label: "Anime"     },
  { href: "/series",    label: "Series"    },
  { href: "/peliculas", label: "Películas" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario } = useAuth();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: Event) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    setTimeout(() => {
      document.addEventListener("click", onOutside);
    }, 0);
    return () => document.removeEventListener("click", onOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await cerrarSesion();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-3 z-50 w-full px-3 md:px-6">
      <div className="glass-nav max-w-7xl mx-auto rounded-2xl">
        <div className="px-4 flex items-center justify-between gap-6" style={{ height: "6rem" }}>

          {/* Logo */}
          <Link href="/" className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
            <Image src="/vortex logo.png" alt="Vortex" fill sizes="80px" style={{ objectFit: "contain" }} />
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
                    color: active ? "var(--neon-yellow)" : "var(--text-secondary)",
                    background: active ? "rgba(255,212,71,0.1)" : "transparent",
                    border: active ? "1px solid rgba(255,212,71,0.3)" : "1px solid transparent",
                    boxShadow: active ? "0 0 10px rgba(255,212,71,0.2)" : "none",
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
                <div className="glass-card flex items-center gap-2 rounded-full px-3 py-1.5">
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
                  className="glass-card p-2 rounded-full transition-all"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Sesión */}
            {usuario ? (
              <div ref={menuRef} className="hidden md:block relative">
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-all"
                  style={{
                    color: "var(--neon-yellow)",
                    border: "1px solid rgba(255,212,71,0.4)",
                    boxShadow: "0 0 10px rgba(255,212,71,0.18)",
                  }}
                >
                  <User size={14} />
                  {usuario.nombre.split(" ")[0]}
                  <ChevronDown size={13} style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {menuOpen && (
                  <div
                    className="glass-card absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden py-1.5 z-50"
                  >
                    <Link
                      href="/perfil"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Heart size={14} />
                      Mis favoritos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: "var(--neon-pink)" }}
                    >
                      <LogOut size={14} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-all"
                style={{
                  color: "var(--neon-yellow)",
                  border: "1px solid rgba(255,212,71,0.4)",
                  boxShadow: "0 0 10px rgba(255,212,71,0.18)",
                }}
              >
                <User size={14} />
                Ingresar
              </Link>
            )}

            {/* Hamburger móvil */}
            <button
              className="glass-card md:hidden p-2 rounded-full"
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
                  color: pathname === href ? "var(--neon-yellow)" : "var(--text-secondary)",
                  background: pathname === href ? "rgba(255,212,71,0.08)" : "transparent",
                }}
              >
                {label}
              </Link>
            ))}
            {usuario ? (
              <>
                <Link
                  href="/perfil"
                  onClick={() => setOpen(false)}
                  className="py-2 px-3 rounded-lg text-sm font-medium flex items-center gap-2"
                  style={{ color: "var(--neon-yellow)" }}
                >
                  <Heart size={14} /> Mis favoritos ({usuario.nombre.split(" ")[0]})
                </Link>
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="py-2 px-3 rounded-lg text-sm font-medium flex items-center gap-2 text-left"
                  style={{ color: "var(--neon-pink)" }}
                >
                  <LogOut size={14} /> Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="py-2 px-3 rounded-lg text-sm font-medium"
                style={{ color: "var(--neon-yellow)" }}
              >
                Ingresar
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
