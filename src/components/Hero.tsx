"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { Contenido } from "@/lib/contenido";

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

      {/* Banner — foto premium + descripción en card neon */}
      <div
        className="relative rounded-3xl overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={actual.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link href={`/${TIPO_HREF[actual.tipo]}/${actual.slug}`} className="group grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-6 md:gap-8">
              {/* Foto Premium — con glow y border neon */}
              <div className="flex flex-col gap-4">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden group/img">
                  <Image
                    src={actual.portada}
                    alt={actual.titulo}
                    fill
                    className="object-cover transition-all duration-700 group-hover/img:scale-110 group-hover/img:brightness-110"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                  {/* Glow neon alrededor de la imagen */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 0 2px ${color}, 0 0 30px ${color}44`,
                      opacity: 0.8,
                      transition: "all 0.5s ease",
                    }}
                  />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-black leading-tight tracking-tight"
                  style={{
                    fontFamily: "var(--font-orbitron)",
                    background: `linear-gradient(135deg, ${color}, var(--neon-cyan))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {actual.titulo}
                </h2>
              </div>

              {/* Descripción en Card Glass + Neon Border */}
              <div
                className="rounded-2xl p-6 md:p-7 flex flex-col justify-center gap-4"
                style={{
                  background: `linear-gradient(135deg, rgba(0,184,255,0.05) 0%, ${color}08 100%)`,
                  backdropFilter: "blur(12px)",
                  border: `1.5px solid ${color}`,
                  boxShadow: `0 0 20px ${color}33, inset 0 1px 0 rgba(255,255,255,0.1)`,
                }}
              >
                {/* Tipo Badge */}
                <span
                  className="inline-block w-fit text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-lg"
                  style={{
                    background: `${color}22`,
                    color: color,
                    border: `1px solid ${color}66`,
                    fontFamily: "var(--font-orbitron)",
                    boxShadow: `0 0 10px ${color}33`,
                  }}
                >
                  {actual.tipo.toUpperCase()}
                </span>

                {/* Metadata */}
                {(actual.año || actual.genero) && (
                  <div className="flex flex-wrap gap-2">
                    {actual.año && (
                      <span className="text-xs px-2 py-1 rounded" style={{
                        background: "rgba(255,212,71,0.1)",
                        color: "var(--neon-yellow)",
                        border: "1px solid rgba(255,212,71,0.3)",
                      }}>
                        📅 {actual.año}
                      </span>
                    )}
                    {actual.genero && actual.genero.length > 0 && (
                      <span className="text-xs px-2 py-1 rounded" style={{
                        background: "rgba(57,255,20,0.1)",
                        color: "#39ff14",
                        border: "1px solid rgba(57,255,20,0.3)",
                      }}>
                        🎬 {actual.genero.slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>
                )}

                {/* Descripción */}
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {actual.descripcion}
                </p>

                {/* CTA Button */}
                <button
                  className="mt-4 w-full py-2.5 rounded-lg font-semibold text-sm transition-all"
                  style={{
                    background: `${color}22`,
                    color: color,
                    border: `1.5px solid ${color}`,
                    boxShadow: `0 0 15px ${color}44`,
                  }}
                >
                  Ver más →
                </button>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Indicadores — solo puntos, sin revelar qué viene después */}
        <div className="absolute bottom-5 right-6 z-10 flex gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-label={`Ir a destacado ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                background: i === index ? "var(--neon-yellow)" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
