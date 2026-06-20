import { notFound } from "next/navigation";
import { SERIES } from "@/lib/placeholder-data";
import DetalleSerieAnime from "@/components/DetalleSerieAnime";

export function generateStaticParams() {
  return SERIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = SERIES.find((s) => s.slug === slug);
  return { title: item ? `${item.titulo} — Vortex` : "Series — Vortex" };
}

export default async function SerieDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = SERIES.find((s) => s.slug === slug);
  if (!item) notFound();
  return <DetalleSerieAnime item={item} />;
}
