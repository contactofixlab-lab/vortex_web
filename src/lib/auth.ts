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
    SELECT u.id, u.nombre, u.email,
           COALESCE(u.telefono, NULL) as "telefono",
           COALESCE(u.pais, NULL) as "pais",
           COALESCE(u.avatar_url, NULL) as "avatar_url",
           COALESCE(u.username, NULL) as "username",
           COALESCE(u.biografia, NULL) as "biografia",
           COALESCE(u.generos_favoritos, NULL) as "generos_favoritos",
           COALESCE(u.idiomas_preferidos, NULL) as "idiomas_preferidos",
           COALESCE(u.perfil_visible, true) as "perfil_visible",
           COALESCE(u.notificaciones_habilitadas, true) as "notificaciones_habilitadas",
           COALESCE(u.notif_comentarios_habilitada, true) as "notif_comentarios_habilitada",
           COALESCE(u.notif_favoritos_habilitada, true) as "notif_favoritos_habilitada",
           COALESCE(u.notif_seguidores_habilitada, true) as "notif_seguidores_habilitada",
           COALESCE(u.notif_info_habilitada, true) as "notif_info_habilitada"
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
    telefono: rows[0].telefono as string | undefined,
    pais: rows[0].pais as string | undefined,
    avatar_url: rows[0].avatar_url as string | undefined,
    username: rows[0].username as string | undefined,
    biografia: rows[0].biografia as string | undefined,
    generos_favoritos: rows[0].generos_favoritos as string[] | undefined,
    idiomas_preferidos: rows[0].idiomas_preferidos as string[] | undefined,
    perfil_visible: rows[0].perfil_visible as boolean | undefined,
    notificaciones_habilitadas: rows[0].notificaciones_habilitadas as boolean | undefined,
    notif_comentarios_habilitada: rows[0].notif_comentarios_habilitada as boolean | undefined,
    notif_favoritos_habilitada: rows[0].notif_favoritos_habilitada as boolean | undefined,
    notif_seguidores_habilitada: rows[0].notif_seguidores_habilitada as boolean | undefined,
    notif_info_habilitada: rows[0].notif_info_habilitada as boolean | undefined,
  };
});
