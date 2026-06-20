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

      {/* Banner principal — autoplay: foto, título y una descripción breve, nada más */}
      <div
        className="relative rounded-3xl overflow-hidden min-h-[300px] md:min-h-[380px]"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
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

              {/* Contenido — solo lo esencial: tipo, título, descripción */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 max-w-xl">
                <span
                  className="inline-block text-[10px] font-bold tracking-widest px-2 py-0.5 rounded mb-3"
                  style={{ background: `${color}22`, color, border: `1px solid ${color}55`, fontFamily: "var(--font-orbitron)" }}
                >
                  {actual.tipo.toUpperCase()}
                </span>

                <h2 className="text-3xl md:text-4xl font-black leading-tight mb-2" style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}>
                  {actual.titulo}
                </h2>

                <p className="text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>
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
