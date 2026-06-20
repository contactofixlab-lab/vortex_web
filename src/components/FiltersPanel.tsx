"use client";

import { SlidersHorizontal } from "lucide-react";

type Grupo = {
  label: string;
  options: string[];
  color: string;
};

export default function FiltersPanel({
  genero,
  año,
  idioma,
}: {
  genero: string[];
  año: string[];
  idioma: string[];
}) {
  const grupos: Grupo[] = [
    { label: "Género", options: genero, color: "var(--neon-violet)" },
    { label: "Año", options: año, color: "var(--neon-cyan)" },
    { label: "Idioma", options: idioma, color: "var(--neon-pink)" },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-5" style={{ boxShadow: "var(--shadow-float)" }}>
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} style={{ color: "var(--neon-yellow)" }} />
        <span
          className="text-sm font-bold tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-yellow)" }}
        >
          FILTROS
        </span>
      </div>

      {grupos.map((g) => (
        <div key={g.label} className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-wide" style={{ color: g.color, fontFamily: "var(--font-orbitron)" }}>
            {g.label.toUpperCase()}
          </span>
          <select
            className="text-sm rounded-xl px-3 py-2 cursor-pointer w-full outline-none transition-shadow"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "var(--text-primary)",
              border: `1px solid ${g.color}40`,
              boxShadow: `0 0 10px ${g.color}1f, 0 1px 3px rgba(0,0,0,0.3) inset`,
            }}
          >
            {g.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
