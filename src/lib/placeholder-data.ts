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
  /** Vistas acumuladas — determina qué entra a Destacados. Hoy es un valor semilla;
   *  cuando el sitio esté en producción esto debe venir de analítica real de reproducción/descarga. */
  vistas?: number;
};

export const ANIMES: Contenido[] = [
  { id: "1", slug: "solo-leveling", titulo: "Solo Leveling", tipo: "anime", portada: "https://picsum.photos/seed/solo/300/420", año: 2024, genero: ["Acción", "Fantasía"], idioma: "Sub español", descripcion: "Sung Jinwoo, el cazador más débil de la humanidad, obtiene poderes sin límite.", episodios: 24, estado: "completo", vistas: 18500 },
  { id: "2", slug: "demon-slayer-s4", titulo: "Demon Slayer S4", tipo: "anime", portada: "https://picsum.photos/seed/demon/300/420", año: 2024, genero: ["Acción", "Sobrenatural"], idioma: "Latino", descripcion: "Tanjiro y sus amigos entrenan bajo los Hashira para la batalla final.", episodios: 8, estado: "completo", vistas: 9200 },
  { id: "3", slug: "blue-lock", titulo: "Blue Lock S2", tipo: "anime", portada: "https://picsum.photos/seed/bluelock/300/420", año: 2024, genero: ["Deportes", "Drama"], idioma: "Sub español", descripcion: "El programa Blue Lock continúa su selección del goleador definitivo.", episodios: 13, estado: "en emisión", vistas: 7600 },
  { id: "4", slug: "one-piece", titulo: "One Piece", tipo: "anime", portada: "https://picsum.photos/seed/onepiece/300/420", año: 2024, genero: ["Aventura", "Acción"], idioma: "Latino", descripcion: "Luffy y su tripulación continúan su viaje hacia el Gran Line.", episodios: 1100, estado: "en emisión", vistas: 13800 },
  { id: "5", slug: "jujutsu-kaisen-s3", titulo: "Jujutsu Kaisen S3", tipo: "anime", portada: "https://picsum.photos/seed/jujutsu/300/420", año: 2024, genero: ["Acción", "Sobrenatural"], idioma: "Sub español", descripcion: "El arco de Culling Game lleva la batalla a un nuevo nivel.", episodios: 21, estado: "en emisión", vistas: 11700 },
  { id: "6", slug: "dungeon-meshi", titulo: "Dungeon Meshi", tipo: "anime", portada: "https://picsum.photos/seed/dungeon/300/420", año: 2024, genero: ["Fantasía", "Comedia"], idioma: "Sub español", descripcion: "Laios y su grupo sobreviven en una mazmorra cocinando los monstruos que derrotan.", episodios: 24, estado: "completo", vistas: 6400 },
];

export const SERIES: Contenido[] = [
  { id: "7", slug: "breaking-bad", titulo: "Breaking Bad", tipo: "serie", portada: "https://picsum.photos/seed/breaking/300/420", año: 2008, genero: ["Drama", "Crimen"], idioma: "Latino", descripcion: "Un profesor de química se convierte en el mayor productor de metanfetamina.", episodios: 62, estado: "completo", vistas: 8900 },
  { id: "8", slug: "the-last-of-us", titulo: "The Last of Us", tipo: "serie", portada: "https://picsum.photos/seed/lastofus/300/420", año: 2023, genero: ["Drama", "Terror"], idioma: "Latino", descripcion: "Joel y Ellie atraviesan un mundo post-apocalíptico lleno de infectados.", episodios: 16, estado: "en emisión", vistas: 10200 },
  { id: "9", slug: "house-of-dragon", titulo: "House of Dragon S2", tipo: "serie", portada: "https://picsum.photos/seed/dragon/300/420", año: 2024, genero: ["Fantasía", "Drama"], idioma: "Latino", descripcion: "La guerra civil de los Targaryen continúa con devastadoras consecuencias.", episodios: 8, estado: "completo", vistas: 15200 },
  { id: "10", slug: "severance", titulo: "Severance S2", tipo: "serie", portada: "https://picsum.photos/seed/severance/300/420", año: 2025, genero: ["Ciencia ficción", "Misterio"], idioma: "Sub español", descripcion: "Los empleados de Lumon exploran más secretos de la escalofriante corporación.", episodios: 10, estado: "completo", vistas: 7100 },
  { id: "11", slug: "shogun", titulo: "Shōgun", tipo: "serie", portada: "https://picsum.photos/seed/shogun/300/420", año: 2024, genero: ["Drama", "Historia"], idioma: "Sub español", descripcion: "Un samurái y un navegante inglés se alían en el Japón feudal.", episodios: 10, estado: "completo", vistas: 9800 },
  { id: "12", slug: "the-bear", titulo: "The Bear S3", tipo: "serie", portada: "https://picsum.photos/seed/thebear/300/420", año: 2024, genero: ["Drama", "Comedia"], idioma: "Sub español", descripcion: "Carmy busca llevar su restaurante a otro nivel mientras el equipo lucha.", episodios: 10, estado: "completo", vistas: 5600 },
];

export const PELICULAS: Contenido[] = [
  { id: "13", slug: "dune-part-2", titulo: "Dune: Parte 2", tipo: "pelicula", portada: "https://picsum.photos/seed/dune/300/420", año: 2024, genero: ["Ciencia ficción", "Aventura"], idioma: "Latino", descripcion: "Paul Atreides lidera a los Fremen en su guerra santa contra los Harkonnen.", vistas: 14100 },
  { id: "14", slug: "oppenheimer", titulo: "Oppenheimer", tipo: "pelicula", portada: "https://picsum.photos/seed/oppenheimer/300/420", año: 2023, genero: ["Drama", "Historia"], idioma: "Latino", descripcion: "La historia del físico que lideró el proyecto de la primera bomba atómica.", vistas: 8300 },
  { id: "15", slug: "godzilla-kong", titulo: "Godzilla vs. Kong 2", tipo: "pelicula", portada: "https://picsum.photos/seed/godzilla/300/420", año: 2024, genero: ["Acción", "Ciencia ficción"], idioma: "Latino", descripcion: "Los dos titanes se unen frente a una nueva amenaza que surge del interior de la Tierra.", vistas: 6900 },
  { id: "16", slug: "alien-romulus", titulo: "Alien: Romulus", tipo: "pelicula", portada: "https://picsum.photos/seed/alien/300/420", año: 2024, genero: ["Terror", "Ciencia ficción"], idioma: "Sub español", descripcion: "Un grupo de jóvenes colonos descubre algo aterrador en una estación espacial abandonada.", vistas: 5200 },
  { id: "17", slug: "inside-out-2", titulo: "Intensamente 2", tipo: "pelicula", portada: "https://picsum.photos/seed/insideout/300/420", año: 2024, genero: ["Animación", "Comedia"], idioma: "Latino", descripcion: "Riley enfrenta la adolescencia con nuevas emociones que llegan a su mente.", vistas: 9600 },
  { id: "18", slug: "deadpool-wolverine", titulo: "Deadpool & Wolverine", tipo: "pelicula", portada: "https://picsum.photos/seed/deadpool/300/420", año: 2024, genero: ["Acción", "Comedia"], idioma: "Latino", descripcion: "El mercenario bocazas se une a Wolverine en una aventura multiversal.", vistas: 12900 },
];

/**
 * Destacados = contenido más visto del sitio (hoy: semilla manual vía `vistas`).
 * Cuando exista tracking real de reproducción/descarga, reemplazar la fuente de
 * `vistas` por la métrica real sin tocar el resto del pipeline (Hero ya consume esto).
 */
export function getDestacados(n = 6): Contenido[] {
  return [...ANIMES, ...SERIES, ...PELICULAS]
    .slice()
    .sort((a, b) => (b.vistas ?? 0) - (a.vistas ?? 0))
    .slice(0, n);
}

export const DESTACADOS = getDestacados(6);
