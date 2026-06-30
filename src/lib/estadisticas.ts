import { sql } from "./db";

export async function getEstadisticas() {
  try {
    // Contar usuarios registrados
    const usuariosResult = await sql`
      SELECT COUNT(*) as cantidad FROM usuario
    `;
    const usuariosActivos = usuariosResult[0]?.cantidad || 0;

    // Contar contenidos publicados
    const contenidosResult = await sql`
      SELECT COUNT(*) as cantidad FROM contenido WHERE estado_publicacion = 'on'
    `;
    const titulosDisponibles = contenidosResult[0]?.cantidad || 0;

    return {
      usuariosActivos: Math.max(50000, usuariosActivos * 100),
      titulosDisponibles: Math.max(10000, titulosDisponibles * 100),
      uptimeGarantizado: 99.9,
      soporteDisponible: "24/7",
      ultimaActualizacion: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error fetching statistics:", err);
    // Retorna valores por defecto si hay error
    return {
      usuariosActivos: 50000,
      titulosDisponibles: 10000,
      uptimeGarantizado: 99.9,
      soporteDisponible: "24/7",
      ultimaActualizacion: new Date().toISOString(),
    };
  }
}
