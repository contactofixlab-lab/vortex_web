import { notFound } from "next/navigation";
import { getContenidoBySlug } from "@/lib/contenido";
import { getTemporadas } from "@/lib/detalle";
import DetalleSerieAnime from "@/components/DetalleSerieAnime";
import { obtenerComentarios } from "@/app/actions";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getContenidoBySlug("serie", slug);
  return { title: item ? `${item.titulo} — Vortex` : "Series — Vortex" };
}

export default async function SerieDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getContenidoBySlug("serie", slug);
  if (!item) notFound();

  const [temporadas, comentarios] = await Promise.all([
    getTemporadas(Number(item.id)),
    obtenerComentarios(Number(item.id)),
  ]);

  return <DetalleSerieAnime item={item} temporadas={temporadas} comentarios={comentarios} />;
}
