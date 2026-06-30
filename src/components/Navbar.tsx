"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, Menu, X, Heart, LogOut, ChevronDown, Bell, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { cerrarSesion } from "@/app/actions";
import NotificationBell from "./NotificationBell";

const LINKS = [
  { href: "/",          label: "Inicio"    },
  { href: "/anime",     label: "Anime"     },
  { href: "/series",    label: "Series"    },
  { href: "/peliculas", label: "Películas" },
  { href: "/nosotros",  label: "Nosotros"  },
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
        <div className="px-6 flex items-center justify-between gap-8" style={{ height: "7rem" }}>

          {/* Logo — grande pero navbar más compacto */}
          <Link href="/" className="relative flex-shrink-0 -my-4" style={{ width: 160, height: 160 }}>
            <Image src="/vortex logo.png" alt="Vortex" fill sizes="160px" style={{ objectFit: "contain" }} />
          </Link>

          {/* Nav links — desktop, segmented pill unificado */}
          <nav
            className="hidden md:flex items-center gap-1 p-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="px-5 py-2 rounded-full text-base font-medium tracking-wide transition-all"
                  style={{
                    color: active ? "var(--neon-yellow)" : "var(--text-secondary)",
                    background: active
                      ? "linear-gradient(135deg, rgba(255,212,71,0.18), rgba(255,212,71,0.08))"
                      : "transparent",
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
                <div className="glass-card flex items-center gap-2 rounded-full px-4 py-2">
                  <Search size={18} style={{ color: "var(--neon-cyan)" }} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Buscar..."
                    className="bg-transparent outline-none text-base w-40"
                    style={{ color: "var(--text-primary)" }}
                    onBlur={() => setSearch(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setSearch(true)}
                  className="glass-card p-2.5 rounded-full transition-all"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Notificaciones y Sesión */}
            {usuario && <NotificationBell />}

            {usuario ? (
              <div ref={menuRef} className="hidden md:block relative">
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold tracking-wide transition-all"
                  style={{
                    color: "var(--neon-yellow)",
                    border: "1px solid rgba(255,212,71,0.4)",
                    boxShadow: "0 0 10px rgba(255,212,71,0.18)",
                  }}
                >
                  {usuario.avatar_url ? (
                    <img
                      src={usuario.avatar_url}
                      alt={usuario.nombre}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                  {usuario.nombre.split(" ")[0]}
                  <ChevronDown size={13} style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {menuOpen && (
                  <div
                    className="glass-card absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden py-1.5 z-50"
                  >
                    <Link
                      href="/notificaciones"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,212,71,0.12)"; e.currentTarget.style.color = "var(--neon-yellow)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      <Bell size={14} style={{ color: "var(--neon-yellow)" }} />
                      Notificaciones
                    </Link>

                    <div
                      style={{
                        height: "1px",
                        background: "rgba(255,255,255,0.1)",
                        margin: "0.5rem 0",
                      }}
                    />

                    <Link
                      href="/favoritos"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,79,216,0.12)"; e.currentTarget.style.color = "var(--neon-pink)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      <Heart size={14} style={{ color: "var(--neon-pink)" }} />
                      Mis Favoritos
                    </Link>

                    <Link
                      href="/perfil"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,184,255,0.12)"; e.currentTarget.style.color = "var(--neon-cyan)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      <Settings size={14} style={{ color: "var(--neon-cyan)" }} />
                      Mi Perfil
                    </Link>

                    <div
                      style={{
                        height: "1px",
                        background: "rgba(255,255,255,0.1)",
                        margin: "0.5rem 0",
                      }}
                    />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: "var(--neon-pink)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,79,216,0.14)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
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
