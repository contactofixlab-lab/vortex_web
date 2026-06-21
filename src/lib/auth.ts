import "server-only";
import { randomBytes } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { sql } from "./db";

const COOKIE_NAME = "vortex_session";
const SESSION_DAYS = 30;

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  // Campos opcionales - existirán después de ejecutar ALTER TABLE en Neon
  telefono?: string;
  pais?: string;
  avatar_url?: string;
  username?: string;
  biografia?: string;
  generos_favoritos?: string[];
  idiomas_preferidos?: string[];
  perfil_visible?: boolean;
  notificaciones_habilitadas?: boolean;
  notif_comentarios_habilitada?: boolean;
  notif_favoritos_habilitada?: boolean;
  notif_seguidores_habilitada?: boolean;
  notif_info_habilitada?: boolean;
};

export async function crearSesion(usuarioId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await sql`INSERT INTO sesion (token, usuario_id, expires_at) VALUES (${token}, ${usuarioId}, ${expiresAt.toISOString()})`;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destruirSesion() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await sql`DELETE FROM sesion WHERE token = ${token}`;
  }
  cookieStore.delete(COOKIE_NAME);
}

export const getSesion = cache(async (): Promise<Usuario | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const rows = await sql`
    SELECT u.id, u.nombre, u.email
    FROM sesion s
    JOIN usuario u ON u.id = s.usuario_id
    WHERE s.token = ${token} AND s.expires_at > now()
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  return {
    id: rows[0].id as number,
    nombre: rows[0].nombre as string,
    email: rows[0].email as string,
    // Campos opcionales serán undefined hasta ejecutar ALTER TABLE en Neon
  };
});
