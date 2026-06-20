import type { Contenido } from "./placeholder-data";

export type Servidores = {
  onedrive?: boolean;
  gdrive?: boolean;
  mega?: boolean;
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

const MAX_EPISODIOS_DEMO = 16;

/**
 * Servidores de descarga — hoy es un placeholder con los 3 habilitados.
 * Cuando exista backend real esto debe venir de la tabla `links_descarga`
 * por episodio/contenido (ver PLAN.md), sin tocar el resto del componente.
 */
export function servidoresDemo(): Servidores {
  return { onedrive: true, gdrive: true, mega: true };
}

/**
 * Genera la(s) temporada(s) de una ficha a partir del conteo `episodios` del
 * catálogo. Hoy cada ficha del catálogo representa una sola temporada, así que
 * siempre arma 1 bloque — pero el acordeón soporta varias, listo para cuando el
 * modelo de datos agrupe varias temporadas bajo una misma ficha.
 * Tope de MAX_EPISODIOS_DEMO filas para no inflar la página con catálogos
 * de cientos de episodios (ej. One Piece).
 */
export function temporadasDemo(item: Contenido): Temporada[] {
  const total = Math.min(item.episodios ?? 1, MAX_EPISODIOS_DEMO);
  return [
    {
      numero: 1,
      titulo: "Temporada 1",
      episodios: Array.from({ length: total }, (_, i) => ({
        numero: i + 1,
        titulo: `Episodio ${i + 1}`,
        duracion: "24 min",
        servidores: servidoresDemo(),
      })),
    },
  ];
}
