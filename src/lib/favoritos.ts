import "server-only";
import { sql } from "./db";

export async function getFavoritoIds(usuarioId: number): Promise<string[]> {
  const rows = await sql`SELECT contenido_id FROM favorito WHERE usuario_id = ${usuarioId}`;
  return rows.map((r) => String(r.contenido_id));
}
