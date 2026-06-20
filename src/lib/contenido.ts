import { sql } from "./db";

export type Contenido = {
  id: string;
  slug: string;
  titulo: string;
  tipo: "anime" | "serie" | "pelicula";
  portada: string;
  año: number;
  genero: string[];
  idioma: string;
  descripcion: string;
  episodios?: number;
  estado?: "en emisión" | "completo" | "próximamente";
  /** Vistas acumuladas — determina qué entra a Destacados. */
  vistas?: number;
};

type ContenidoRow = {
  id: number;
  tipo: string;
  titulo: string;
  slug: string;
  portada: string | null;
  sinopsis: string | null;
  anio: number | null;
  genero: string[] | null;
  idioma: string | null;
  episodios_total: number | null;
  estado_emision: string | null;
  vistas: number;
};

function mapRow(row: ContenidoRow): Contenido {
  return {
    id: String(row.id),
    slug: row.slug,
    titulo: row.titulo,
    tipo: row.tipo as Contenido["tipo"],
    portada: row.portada || `https://picsum.photos/seed/${row.slug}/600/900`,
    año: row.anio ?? 0,
    genero: row.genero ?? [],
    idioma: row.idioma ?? "",
    descripcion: row.sinopsis ?? "",
    episodios: row.episodios_total ?? undefined,
    estado: (row.estado_emision as Contenido["estado"]) ?? undefined,
    vistas: row.vistas,
  };
}

const SELECT_COLUMNS = `id, tipo, titulo, slug, portada, sinopsis, anio, genero, idioma, episodios_total, estado_emision, vistas`;

export async function getAnimes(): Promise<Contenido[]> {
  const rows = (await sql`SELECT ${sql.unsafe(SELECT_COLUMNS)} FROM contenido WHERE tipo = 'anime' AND estado_publicacion = 'on' ORDER BY created_at DESC`) as ContenidoRow[];
  return rows.map(mapRow);
}

export async function getSeries(): Promise<Contenido[]> {
  const rows = (await sql`SELECT ${sql.unsafe(SELECT_COLUMNS)} FROM contenido WHERE tipo = 'serie' AND estado_publicacion = 'on' ORDER BY created_at DESC`) as ContenidoRow[];
  return rows.map(mapRow);
}

export async function getPeliculas(): Promise<Contenido[]> {
  const rows = (await sql`SELECT ${sql.unsafe(SELECT_COLUMNS)} FROM contenido WHERE tipo = 'pelicula' AND estado_publicacion = 'on' ORDER BY created_at DESC`) as ContenidoRow[];
  return rows.map(mapRow);
}

/**
 * Destacados = contenido más visto del sitio publicado (`vistas`, hoy semilla manual
 * más lo que se acumule). Cuando exista tracking real de reproducción/descarga,
 * reemplazar el ORDER BY por la métrica real sin tocar el resto del pipeline.
 */
export async function getDestacados(n = 6): Promise<Contenido[]> {
  const rows = (await sql`SELECT ${sql.unsafe(SELECT_COLUMNS)} FROM contenido WHERE estado_publicacion = 'on' ORDER BY vistas DESC LIMIT ${n}`) as ContenidoRow[];
  return rows.map(mapRow);
}

export async function getContenidoBySlug(tipo: "anime" | "serie" | "pelicula", slug: string): Promise<Contenido | null> {
  const rows = (await sql`SELECT ${sql.unsafe(SELECT_COLUMNS)} FROM contenido WHERE tipo = ${tipo} AND slug = ${slug} AND estado_publicacion = 'on' LIMIT 1`) as ContenidoRow[];
  return rows[0] ? mapRow(rows[0]) : null;
}
