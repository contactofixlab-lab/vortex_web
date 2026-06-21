import { notFound } from "next/navigation";
import { getContenidoBySlug } from "@/lib/contenido";
import { getTemporadas } from "@/lib/detalle";
import DetalleSerieAnime from "@/components/DetalleSerieAnime";
import { obtenerComentarios } from "@/app/actions";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getContenidoBySlug("anime", slug);
  return { title: item ? `${item.titulo} — Vortex` : "Anime — Vortex" };
}

export default async function AnimeDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getContenidoBySlug("anime", slug);
  if (!item) notFound();

  const [temporadas, comentarios] = await Promise.all([
    getTemporadas(Number(item.id)),
    obtenerComentarios(Number(item.id)),
  ]);

  return <DetalleSerieAnime item={item} temporadas={temporadas} comentarios={comentarios} />;
}
