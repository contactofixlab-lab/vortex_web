import Hero from "@/components/Hero";
import ContentSection from "@/components/ContentSection";
import { ANIMES, SERIES, PELICULAS, DESTACADOS } from "@/lib/placeholder-data";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-10">
      {/* Hero — Destacados */}
      <Hero items={DESTACADOS} />

      {/* Sección Anime */}
      <ContentSection
        titulo="ANIME"
        color="var(--neon-violet)"
        href="/anime"
        items={ANIMES}
      />

      {/* Sección Series */}
      <ContentSection
        titulo="SERIES"
        color="var(--neon-cyan)"
        href="/series"
        items={SERIES}
      />

      {/* Sección Películas */}
      <ContentSection
        titulo="PELÍCULAS"
        color="var(--neon-pink)"
        href="/peliculas"
        items={PELICULAS}
      />
    </div>
  );
}
