import { sql } from "./db";
import { esPremium } from "./mercado-pago";

const DESCARGAS_DIARIAS_FREE = 3;

export async function getDescargaresHoy(usuarioId: number): Promise<number> {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const result = await sql`
    SELECT COUNT(*) as cantidad
    FROM descarga_log
    WHERE usuario_id = ${usuarioId}
      AND fecha >= ${hoy.toISOString()}
  `;

  return Number(result[0]?.cantidad || 0);
}

export async function canDownload(usuarioId: number): Promise<boolean> {
  const premium = await esPremium(usuarioId);
  if (premium) return true;

  const descargas = await getDescargaresHoy(usuarioId);
  return descargas < DESCARGAS_DIARIAS_FREE;
}

export async function logDescargar(usuarioId: number, contenidoId: number) {
  if (!(await canDownload(usuarioId))) {
    throw new Error("Has alcanzado tu límite de descargas diarias. Mejora a Premium para descargas ilimitadas.");
  }

  await sql`
    INSERT INTO descarga_log (usuario_id, contenido_id)
    VALUES (${usuarioId}, ${contenidoId})
  `;
}

export async function getRemainingDownloads(usuarioId: number): Promise<number> {
  const premium = await esPremium(usuarioId);
  if (premium) return -1; // Ilimitadas

  const descargas = await getDescargaresHoy(usuarioId);
  return Math.max(0, DESCARGAS_DIARIAS_FREE - descargas);
}
