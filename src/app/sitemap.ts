import { MetadataRoute } from "next";
import { getAnimes, getSeries, getPeliculas } from "@/lib/contenido";

const BASE_URL = "https://vortex-web-beta.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [animes, series, peliculas] = await Promise.all([
    getAnimes(),
    getSeries(),
    getPeliculas(),
  ]);

  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/anime`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/series`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/peliculas`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/planes`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  const animePages = animes.map((anime) => ({
    url: `${BASE_URL}/anime/${anime.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const seriesPages = series.map((s) => ({
    url: `${BASE_URL}/series/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const peliculasPages = peliculas.map((p) => ({
    url: `${BASE_URL}/peliculas/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...animePages, ...seriesPages, ...peliculasPages];
}
