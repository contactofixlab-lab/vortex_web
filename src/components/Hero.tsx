"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { Contenido } from "@/lib/placeholder-data";

const TIPO_HREF: Record<string, string> = {
  anime:    "anime",
  serie:    "series",
  pelicula: "peliculas",
};

const TIPO_COLOR: Record<string, string> = {
  anime:    "var(--neon-violet)",
  serie:    "var(--neon-cyan)",
  pelicula: "var(--neon-pink)",
};

const AUTOPLAY_MS = 5500;

export default function Hero({ items }: { items: Contenido[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Autoplay — avanza solo, se pausa al pasar el mouse
  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  if (items.length === 0) return null;
  const actual = items[index];
  const color = TIPO_COLOR[actual.tipo];

  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-1 h-6 rounded-full"
          style={{ background: "var(--neon-yellow)", boxShadow: "0 0 8px var(--neon-yellow)" }}
        />
        <h2
          className="text-xl font-bold tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-yellow)" }}
        >
          DESTACADOS
        </h2>
        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
          <Flame size={12} /> lo más visto
        </span>
      </div>

      {/* Banner principal — carrusel autoplay */}
      <div
        className="relative rounded-3xl overflow-hidden min-h-[340px] md:min-h-[420px]"
        style={{
          border: "1px solid var(--border-glass)",
          borderTopColor: "rgba(255,255,255,0.14)",
          boxShadow: "var(--shadow-glass-lg)",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={actual.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Link href={`/${TIPO_HREF[actual.tipo]}/${actual.slug}`} className="group absolute inset-0 block">
              <Image
                src={actual.portada}
                alt={actual.titulo}
                fill
                className="object-cover opacity-55 group-hover:opacity-65 transition-opacity duration-500"
                sizes="100vw"
                priority
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(10,11,20,0.96) 30%, rgba(10,11,20,0.45) 65%, transparent 100%)" }}
              />

              {/* Contenido */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 max-w-2xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
                    style={{ background: `${color}22`, color, border: `1px solid ${color}55`, fontFamily: "var(--font-orbitron)" }}
                  >
                    {actual.tipo.toUpperCase()}
                  </span>
                  {actual.estado && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.5)", color: "var(--neon-green)" }}>
                      {actual.estado}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--neon-yellow)" }}>
                    <Flame size={11} fill="currentColor" /> #{index + 1} en tendencia
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black leading-tight mb-2" style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}>
                  {actual.titulo}
                </h2>

                <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                  {actual.descripcion}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  {actual.genero.map((g) => (
                    <span key={g} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
                      {g}
                    </span>
                  ))}
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {actual.año} · {actual.idioma}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Indicadores con barra de progreso */}
        <div className="absolute top-4 right-4 z-10 flex gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-label={`Ir a ${item.titulo}`}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === index ? 28 : 14, background: "rgba(255,255,255,0.2)" }}
            >
              {i === index && !paused && (
                <motion.div
                  key={`${actual.id}-progress`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                  className="absolute inset-y-0 left-0"
                  style={{ background: "var(--neon-yellow)" }}
                />
              )}
              {i === index && paused && (
                <div className="absolute inset-0" style={{ background: "var(--neon-yellow)" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tira de miniaturas — destacados clicables */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-3">
        {items.map((item, i) => {
          const active = i === index;
          return (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              className="glass-card relative rounded-xl overflow-hidden aspect-[2/3] text-left transition-transform"
              style={{
                outline: active ? "2px solid var(--neon-yellow)" : "none",
                outlineOffset: 2,
                opacity: active ? 1 : 0.7,
              }}
            >
              <Image
                src={item.portada}
                alt={item.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, 16vw"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,11,20,0.85) 0%, transparent 55%)" }} />
              <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[11px] font-bold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                {item.titulo}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
