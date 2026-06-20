"use client";

import { useState } from "react";
import { Check, SlidersHorizontal } from "lucide-react";

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

  const [seleccion, setSeleccion] = useState<Record<string, Set<string>>>({});

  function toggle(grupo: string, opcion: string) {
    setSeleccion((prev) => {
      const actual = new Set(prev[grupo] ?? []);
      if (opcion === "Todos") {
        return { ...prev, [grupo]: new Set() };
      }
      actual.has(opcion) ? actual.delete(opcion) : actual.add(opcion);
      return { ...prev, [grupo]: actual };
    });
  }

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

      {grupos.map((g) => {
        const activos = seleccion[g.label] ?? new Set<string>();
        return (
          <div key={g.label} className="flex flex-col gap-1.5">
            <span
              className="text-xs font-bold tracking-wide mb-1"
              style={{ color: g.color, fontFamily: "var(--font-orbitron)" }}
            >
              {g.label.toUpperCase()}
            </span>

            {g.options.map((o) => {
              const checked = o === "Todos" ? activos.size === 0 : activos.has(o);
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggle(g.label, o)}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-all"
                  style={{ background: checked ? `${g.color}14` : "transparent" }}
                >
                  <span
                    className="w-4 h-4 rounded shrink-0 flex items-center justify-center transition-all"
                    style={{
                      border: `1.5px solid ${checked ? g.color : "var(--border-glass-hover)"}`,
                      background: checked ? g.color : "transparent",
                      boxShadow: checked ? `0 0 8px ${g.color}66` : "none",
                    }}
                  >
                    {checked && <Check size={11} strokeWidth={3} style={{ color: "var(--bg-base)" }} />}
                  </span>
                  <span className="text-sm" style={{ color: checked ? g.color : "var(--text-secondary)" }}>
                    {o}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
