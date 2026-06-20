import Link from "next/link";
import Image from "next/image";
import { Download, Star, Play } from "lucide-react";
import type { Contenido } from "@/lib/placeholder-data";

const TIPO_HREF: Record<string, string> = {
  anime:    "anime",
  serie:    "series",
  pelicula: "peliculas",
};

export default function Hero({ items }: { items: Contenido[] }) {
  const principal = items[0];
  const secundarios = items.slice(1, 5);

  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-1 h-6 rounded-full"
          style={{ background: "var(--neon-cyan)", boxShadow: "0 0 8px var(--neon-cyan)" }}
        />
        <h2
          className="text-xl font-bold tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
        >
          DESTACADOS
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Card principal grande */}
        <Link
          href={`/${TIPO_HREF[principal.tipo]}/${principal.slug}`}
          className="group lg:col-span-2 relative rounded-3xl overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-1"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-glass)",
            borderTopColor: "rgba(255,255,255,0.14)",
            boxShadow: "var(--shadow-glass-lg)",
            minHeight: 260,
          }}
        >
          <Image
            src={principal.portada}
            alt={principal.titulo}
            fill
            className="object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
          {/* Gradiente de texto */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,10,15,0.95) 40%, transparent 80%)" }}
          />

          {/* Contenido */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
                style={{
                  background: "rgba(0,184,255,0.15)",
                  color: "var(--neon-cyan)",
                  border: "1px solid rgba(0,184,255,0.3)",
                  fontFamily: "var(--font-orbitron)",
                }}
              >
                {principal.tipo.toUpperCase()}
              </span>
              {principal.estado && (
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{ background: "rgba(0,0,0,0.5)", color: "var(--neon-green)" }}
                >
                  {principal.estado}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--neon-yellow)" }}>
                <Star size={11} fill="currentColor" /> Destacado
              </span>
            </div>

            <h2
              className="text-3xl font-black leading-tight mb-2"
              style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}
            >
              {principal.titulo}
            </h2>

            <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--text-secondary)", maxWidth: 480 }}>
              {principal.descripcion}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {principal.genero.map((g) => (
                <span
                  key={g}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
                >
                  {g}
                </span>
              ))}
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {principal.año} · {principal.idioma}
              </span>
            </div>
          </div>

          {/* Hover glow border */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
            style={{ boxShadow: "inset 0 0 0 1px rgba(0,184,255,0.3)" }}
          />
        </Link>

        {/* Cards secundarias */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {secundarios.map((item) => {
            const color =
              item.tipo === "anime" ? "var(--neon-violet)"
              : item.tipo === "serie" ? "var(--neon-cyan)"
              : "var(--neon-pink)";

            return (
              <Link
                key={item.id}
                href={`/${TIPO_HREF[item.tipo]}/${item.slug}`}
                className="glass-card group relative rounded-2xl overflow-hidden flex gap-3 p-3"
              >
                {/* Miniatura */}
                <div className="relative w-14 h-20 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.portada}
                    alt={item.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="56px"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center min-w-0">
                  <span
                    className="text-[9px] font-bold tracking-widest mb-1"
                    style={{ color, fontFamily: "var(--font-orbitron)" }}
                  >
                    {item.tipo.toUpperCase()}
                  </span>
                  <h3
                    className="text-sm font-bold leading-tight line-clamp-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.titulo}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {item.año} · {item.genero[0]}
                  </p>
                </div>

                {/* Hover border */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                  style={{ boxShadow: `inset 0 0 0 1px ${color}44` }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
