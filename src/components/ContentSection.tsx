import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";
import type { Contenido } from "@/lib/placeholder-data";

type Props = {
  titulo: string;
  color: string;
  href: string;
  items: Contenido[];
};

export default function ContentSection({ titulo, color, href, items }: Props) {
  return (
    <section className="w-full">
      {/* Encabezado de sección */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Línea vertical neon */}
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          />
          <h2
            className="text-xl font-bold tracking-widest"
            style={{ fontFamily: "var(--font-orbitron)", color }}
          >
            {titulo}
          </h2>
        </div>

        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium transition-all hover:gap-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Ver todos
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* Línea separadora */}
      <div
        className="mb-5 h-px"
        style={{ background: `linear-gradient(90deg, ${color}44, transparent)` }}
      />

      {/* Grid de cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
