import { sql } from "./db";

export type Servidores = {
  onedrive?: string;
  gdrive?: string;
  mega?: string;
};

export type Episodio = {
  numero: number;
  titulo: string;
  duracion: string;
  servidores: Servidores;
};

export type Temporada = {
  numero: number;
  titulo: string;
  episodios: Episodio[];
};

type EpisodioRow = {
  temporada: number;
  numero: number;
  titulo: string | null;
  duracion: string | null;
  urls: Servidores | null;
};

/**
 * Trae las temporadas/episodios reales cargados desde vortex-admin para un
 * contenido. Si todavía no se cargó ningún episodio, devuelve un arreglo vacío
 * (la ficha de detalle simplemente no muestra el bloque de episodios).
 */
export async function getTemporadas(contenidoId: number): Promise<Temporada[]> {
  const rows = (await sql`
    SELECT temporada, numero, titulo, duracion, urls
    FROM episodio
    WHERE contenido_id = ${contenidoId}
    ORDER BY temporada ASC, numero ASC
  `) as EpisodioRow[];

  const porTemporada = new Map<number, Episodio[]>();
  for (const row of rows) {
    const episodio: Episodio = {
      numero: row.numero,
      titulo: row.titulo ?? `Episodio ${row.numero}`,
      duracion: row.duracion ?? "",
      servidores: row.urls ?? {},
    };
    const lista = porTemporada.get(row.temporada) ?? [];
    lista.push(episodio);
    porTemporada.set(row.temporada, lista);
  }

  return [...porTemporada.entries()]
    .sort(([a], [b]) => a - b)
    .map(([numero, episodios]) => ({ numero, titulo: `Temporada ${numero}`, episodios }));
}
