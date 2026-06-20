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

      {/* Banner — foto + nombre a la izquierda, descripción a la derecha. Cambia solo. */}
      <div
        className="relative glass-card rounded-3xl overflow-hidden"
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
            <Link href={`/${TIPO_HREF[actual.tipo]}/${actual.slug}`} className="group grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 p-5 md:p-7">
              {/* Imagen (el doble de ancho que la descripción) + nombre debajo */}
              <div>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-3">
                  <Image
                    src={actual.portada}
                    alt={actual.titulo}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                </div>
                <h2
                  className="text-lg md:text-xl font-black leading-tight"
                  style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}
                >
                  {actual.titulo}
                </h2>
              </div>

              {/* Descripción a la derecha */}
              <div className="min-w-0 flex flex-col justify-center">
                <span
                  className="inline-block w-fit text-[10px] font-bold tracking-widest px-2 py-0.5 rounded mb-3"
                  style={{ background: `${color}22`, color, border: `1px solid ${color}55`, fontFamily: "var(--font-orbitron)" }}
                >
                  {actual.tipo.toUpperCase()}
                </span>
                <p className="text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
                  {actual.descripcion}
                </p>
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
