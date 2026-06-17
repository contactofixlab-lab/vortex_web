import ContentCard from "@/components/ContentCard";
import { ANIMES } from "@/lib/placeholder-data";
import { Filter } from "lucide-react";

export const metadata = { title: "Anime — Vortex" };

const GENEROS = ["Todos", "Acción", "Aventura", "Comedia", "Drama", "Fantasía", "Deportes", "Sobrenatural"];
const AÑOS = ["Todos", "2024", "2023", "2022", "2021", "2020"];
const IDIOMAS = ["Todos", "Sub español", "Latino", "Castellano", "Dual"];

export default function AnimePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-1 h-7 rounded-full"
          style={{ background: "var(--neon-violet)", boxShadow: "0 0 10px var(--neon-violet)" }}
        />
        <h1
          className="text-3xl font-black tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-violet)" }}
        >
          ANIME
        </h1>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {ANIMES.length} títulos
        </span>
      </div>

      {/* Filtros */}
      <div
        className="glass rounded-xl p-4 mb-8 flex flex-wrap gap-4 items-center"
        style={{ border: "1px solid var(--border-glass)" }}
      >
        <div className="flex items-center gap-2" style={{ color: "var(--neon-violet)" }}>
          <Filter size={16} />
          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-orbitron)" }}>
            FILTROS
          </span>
        </div>

        {[
          { label: "Género", options: GENEROS },
          { label: "Año",    options: AÑOS    },
          { label: "Idioma", options: IDIOMAS },
        ].map(({ label, options }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
            <select
              className="text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-glass)",
              }}
            >
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {ANIMES.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
