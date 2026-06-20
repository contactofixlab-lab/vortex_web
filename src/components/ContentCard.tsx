import Link from "next/link";
import Image from "next/image";
import type { Contenido } from "@/lib/placeholder-data";

const TIPO_COLOR: Record<string, string> = {
  anime:    "var(--neon-violet)",
  serie:    "var(--neon-cyan)",
  pelicula: "var(--neon-pink)",
};

const TIPO_LABEL: Record<string, string> = {
  anime:    "ANIME",
  serie:    "SERIE",
  pelicula: "PELÍCULA",
};

const ESTADO_COLOR: Record<string, string> = {
  "en emisión":    "var(--neon-green)",
  "completo":      "var(--text-secondary)",
  "próximamente":  "var(--neon-yellow)",
};

export default function ContentCard({ item }: { item: Contenido }) {
  const color = TIPO_COLOR[item.tipo];
  const href  = `/${item.tipo === "pelicula" ? "peliculas" : item.tipo}/${item.slug}`;

  return (
    <Link href={href} className="group block">
      <div className="glass-card relative rounded-2xl overflow-hidden">
        {/* Portada */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={item.portada}
            alt={item.titulo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          {/* Overlay gradiente */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(to top, ${color}22, transparent)` }}
          />

          {/* Badge tipo */}
          <span
            className="absolute top-2 left-2 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
            style={{
              background: `${color}22`,
              color,
              border: `1px solid ${color}55`,
              fontFamily: "var(--font-orbitron)",
            }}
          >
            {TIPO_LABEL[item.tipo]}
          </span>

          {/* Badge estado */}
          {item.estado && (
            <span
              className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{
                background: "rgba(0,0,0,0.6)",
                color: ESTADO_COLOR[item.estado] ?? "var(--text-secondary)",
              }}
            >
              {item.estado}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3
            className="text-sm font-bold leading-tight truncate group-hover:transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {item.titulo}
          </h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {item.año} · {item.genero[0]}
            {item.episodios ? ` · ${item.episodios} ep.` : ""}
          </p>
          <p
            className="text-xs mt-1 truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            {item.idioma}
          </p>
        </div>

        {/* Borde neon en hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          style={{ boxShadow: `inset 0 0 0 1px ${color}55` }}
        />
      </div>
    </Link>
  );
}
