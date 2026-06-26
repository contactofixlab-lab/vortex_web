"use client";

import { useState } from "react";
import { Check, SlidersHorizontal, ChevronDown } from "lucide-react";

type Grupo = {
  label: string;
  options: string[];
  color: string;
  icon: string;
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
    { label: "Género", options: genero, color: "var(--neon-violet)", icon: "🎬" },
    { label: "Año", options: año, color: "var(--neon-cyan)", icon: "📅" },
    { label: "Idioma", options: idioma, color: "var(--neon-pink)", icon: "🗣️" },
  ];

  const [seleccion, setSeleccion] = useState<Record<string, Set<string>>>({});
  const [expandido, setExpandido] = useState<Record<string, boolean>>({
    Género: true,
    Año: true,
    Idioma: true,
  });

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

  function toggleExpand(grupo: string) {
    setExpandido((prev) => ({ ...prev, [grupo]: !prev[grupo] }));
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-2">
        <SlidersHorizontal size={16} style={{ color: "var(--neon-yellow)" }} />
        <span
          className="text-sm font-bold tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-yellow)" }}
        >
          FILTROS
        </span>
      </div>

      {/* Filtros como accordions independientes */}
      {grupos.map((g) => {
        const activos = seleccion[g.label] ?? new Set<string>();
        const abierto = expandido[g.label] ?? true;

        return (
          <div
            key={g.label}
            className="glass-card rounded-2xl overflow-hidden transition-all"
            style={{
              border: `1px solid ${g.color}33`,
              boxShadow: abierto ? `0 0 16px ${g.color}22` : "var(--shadow-float)",
            }}
          >
            {/* Header del filtro */}
            <button
              onClick={() => toggleExpand(g.label)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all"
              style={{
                background: abierto ? `${g.color}08` : "transparent",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{g.icon}</span>
                <div className="flex flex-col items-start">
                  <span
                    className="text-sm font-bold"
                    style={{ color: g.color, fontFamily: "var(--font-orbitron)" }}
                  >
                    {g.label.toUpperCase()}
                  </span>
                  {activos.size > 0 && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {activos.size} seleccionado{activos.size !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown
                size={18}
                style={{
                  color: g.color,
                  transform: abierto ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </button>

            {/* Contenido del filtro */}
            {abierto && (
              <div
                className="px-5 py-4 border-t flex flex-col gap-2"
                style={{ borderColor: `${g.color}22` }}
              >
                {g.options.map((o) => {
                  const checked = o === "Todos" ? activos.size === 0 : activos.has(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => toggle(g.label, o)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-white/5"
                      style={{
                        background: checked ? `${g.color}12` : "transparent",
                      }}
                    >
                      <span
                        className="w-4 h-4 rounded shrink-0 flex items-center justify-center transition-all"
                        style={{
                          border: `1.5px solid ${checked ? g.color : "rgba(255,255,255,0.2)"}`,
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
            )}
          </div>
        );
      })}
    </div>
  );
}
