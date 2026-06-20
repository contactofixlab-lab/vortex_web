import { notFound } from "next/navigation";
import { ANIMES } from "@/lib/placeholder-data";
import DetalleSerieAnime from "@/components/DetalleSerieAnime";

export function generateStaticParams() {
  return ANIMES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = ANIMES.find((a) => a.slug === slug);
  return { title: item ? `${item.titulo} — Vortex` : "Anime — Vortex" };
}

export default async function AnimeDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = ANIMES.find((a) => a.slug === slug);
  if (!item) notFound();
  return <DetalleSerieAnime item={item} />;
}
