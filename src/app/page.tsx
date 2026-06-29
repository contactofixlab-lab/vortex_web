import Hero from "@/components/Hero";
import ContentSection from "@/components/ContentSection";
import { getAnimes, getSeries, getPeliculas, getDestacados, getUltimos } from "@/lib/contenido";

export const revalidate = 0;

export default async function Home() {
  const [destacados, animes, series, peliculas, ultimos] = await Promise.all([
    getDestacados(6),
    getAnimes(),
    getSeries(),
    getPeliculas(),
    getUltimos(12),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-10">
      {/* Hero — Destacados */}
      <Hero items={destacados} />

      {/* Sección Lo Último */}
      <ContentSection
        titulo="LO ÚLTIMO"
        color="var(--neon-yellow)"
        href="/"
        items={ultimos}
      />

      {/* Sección Anime */}
      <ContentSection
        titulo="ANIME"
        color="var(--neon-violet)"
        href="/anime"
        items={animes}
      />

      {/* Sección Series */}
      <ContentSection
        titulo="SERIES"
        color="var(--neon-cyan)"
        href="/series"
        items={series}
      />

      {/* Sección Películas */}
      <ContentSection
        titulo="PELÍCULAS"
        color="var(--neon-pink)"
        href="/peliculas"
        items={peliculas}
      />
    </div>
  );
}
