"use server";

import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { crearSesion, destruirSesion, getSesion } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ActionResult = { ok: true } | { ok: false; error: string };

export async function registrarUsuario(
  nombre: string,
  email: string,
  password: string,
  telefono?: string,
  pais?: string
): Promise<ActionResult> {
  const nombreLimpio = nombre.trim();
  const emailLimpio = email.trim().toLowerCase();
  const telefonoLimpio = telefono?.trim() || null;
  const paisLimpio = pais?.trim() || null;

  if (nombreLimpio.length < 2) return { ok: false, error: "Ingresa tu nombre." };
  if (!EMAIL_RE.test(emailLimpio)) return { ok: false, error: "Ingresa un correo válido." };
  if (password.length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };

  const existente = await sql`SELECT 1 FROM usuario WHERE email = ${emailLimpio} LIMIT 1`;
  if (existente.length > 0) return { ok: false, error: "Ya existe una cuenta con ese correo." };

  const hash = await bcrypt.hash(password, 10);
  const rows = await sql`
    INSERT INTO usuario (email, password_hash, nombre, telefono, pais)
    VALUES (${emailLimpio}, ${hash}, ${nombreLimpio}, ${telefonoLimpio}, ${paisLimpio})
    RETURNING id
  `;
  await crearSesion(rows[0].id as number);
  return { ok: true };
}

export async function iniciarSesion(email: string, password: string): Promise<ActionResult> {
  const emailLimpio = email.trim().toLowerCase();
  const rows = await sql`SELECT id, password_hash FROM usuario WHERE email = ${emailLimpio} LIMIT 1`;
  if (rows.length === 0) return { ok: false, error: "Correo o contraseña incorrectos." };

  const valido = await bcrypt.compare(password, rows[0].password_hash as string);
  if (!valido) return { ok: false, error: "Correo o contraseña incorrectos." };

  await crearSesion(rows[0].id as number);
  return { ok: true };
}

export async function cerrarSesion() {
  await destruirSesion();
}

export async function actualizarPerfil(datos: {
  nombre?: string;
  telefono?: string;
  pais?: string;
  username?: string;
  biografia?: string;
  avatar_url?: string;
  generos_favoritos?: string[];
  idiomas_preferidos?: string[];
  perfil_visible?: boolean;
  notificaciones_habilitadas?: boolean;
}): Promise<ActionResult> {
  const usuario = await getSesion();
  if (!usuario) return { ok: false, error: "Debes iniciar sesión." };

  const updates: string[] = [];
  const values: unknown[] = [];

  if (datos.nombre !== undefined) {
    updates.push(`nombre = $${updates.length + 1}`);
    values.push(datos.nombre.trim());
  }
  if (datos.telefono !== undefined) {
    updates.push(`telefono = $${updates.length + 1}`);
    values.push(datos.telefono.trim() || null);
  }
  if (datos.pais !== undefined) {
    updates.push(`pais = $${updates.length + 1}`);
    values.push(datos.pais.trim() || null);
  }
  if (datos.username !== undefined) {
    updates.push(`username = $${updates.length + 1}`);
    values.push(datos.username.trim() || null);
  }
  if (datos.biografia !== undefined) {
    updates.push(`biografia = $${updates.length + 1}`);
    values.push(datos.biografia.trim() || null);
  }
  if (datos.avatar_url !== undefined) {
    updates.push(`avatar_url = $${updates.length + 1}`);
    values.push(datos.avatar_url.trim() || null);
  }
  if (datos.generos_favoritos !== undefined) {
    updates.push(`generos_favoritos = $${updates.length + 1}`);
    values.push(datos.generos_favoritos);
  }
  if (datos.idiomas_preferidos !== undefined) {
    updates.push(`idiomas_preferidos = $${updates.length + 1}`);
    values.push(datos.idiomas_preferidos);
  }
  if (datos.perfil_visible !== undefined) {
    updates.push(`perfil_visible = $${updates.length + 1}`);
    values.push(datos.perfil_visible);
  }
  if (datos.notificaciones_habilitadas !== undefined) {
    updates.push(`notificaciones_habilitadas = $${updates.length + 1}`);
    values.push(datos.notificaciones_habilitadas);
  }

  if (updates.length === 0) return { ok: true };

  values.push(usuario.id);
  const query = `UPDATE usuario SET ${updates.join(", ")} WHERE id = $${updates.length + 1}`;
  await sql(query as any, values);
  return { ok: true };
}

export async function cambiarPassword(passwordActual: string, passwordNueva: string): Promise<ActionResult> {
  const usuario = await getSesion();
  if (!usuario) return { ok: false, error: "Debes iniciar sesión." };

  const rows = await sql`SELECT password_hash FROM usuario WHERE id = ${usuario.id}`;
  const valido = await bcrypt.compare(passwordActual, rows[0].password_hash as string);
  if (!valido) return { ok: false, error: "Contraseña actual incorrecta." };

  if (passwordNueva.length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
  const hash = await bcrypt.hash(passwordNueva, 10);
  await sql`UPDATE usuario SET password_hash = ${hash} WHERE id = ${usuario.id}`;
  return { ok: true };
}

export async function crearComentario(contenidoId: number, texto: string): Promise<ActionResult> {
  const usuario = await getSesion();
  if (!usuario) return { ok: false, error: "Debes iniciar sesión." };

  const textoLimpio = texto.trim();
  if (textoLimpio.length < 2) return { ok: false, error: "El comentario es muy corto." };
  if (textoLimpio.length > 300) return { ok: false, error: "El comentario es muy largo." };

  try {
    await sql`
      INSERT INTO comentario (contenido_id, usuario_id, texto)
      VALUES (${contenidoId}, ${usuario.id}, ${textoLimpio})
    `;
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Error al crear comentario." };
  }
}

export async function obtenerComentarios(
  contenidoId: number
): Promise<{ id: number; usuarioNombre: string; texto: string; createdAt: string; usuarioId: number; avatarUrl?: string }[]> {
  try {
    const rows = await sql`
      SELECT c.id, u.nombre as "usuarioNombre", c.texto, c.created_at as "createdAt", u.id as "usuarioId", u.avatar_url as "avatarUrl"
      FROM comentario c
      JOIN usuario u ON u.id = c.usuario_id
      WHERE c.contenido_id = ${contenidoId}
      ORDER BY c.created_at DESC
      LIMIT 50
    `;
    return rows.map((r) => ({
      id: r.id as number,
      usuarioNombre: r.usuarioNombre as string,
      texto: r.texto as string,
      createdAt: new Date(r.createdAt as string).toLocaleString("es-CL"),
      usuarioId: r.usuarioId as number,
      avatarUrl: r.avatarUrl as string | undefined,
    }));
  } catch (err) {
    return [];
  }
}

export async function eliminarComentario(comentarioId: number): Promise<ActionResult> {
  const usuario = await getSesion();
  if (!usuario) return { ok: false, error: "Debes iniciar sesión." };

  try {
    const comentario = await sql`SELECT usuario_id FROM comentario WHERE id = ${comentarioId}`;
    if (comentario.length === 0) return { ok: false, error: "Comentario no encontrado." };
    if (comentario[0].usuario_id !== usuario.id) return { ok: false, error: "No puedes eliminar comentarios ajenos." };

    await sql`DELETE FROM comentario WHERE id = ${comentarioId}`;
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Error al eliminar comentario." };
  }
}

export async function toggleFavorito(contenidoId: number): Promise<{ ok: true; favorito: boolean } | { ok: false; error: string }> {
  const usuario = await getSesion();
  if (!usuario) return { ok: false, error: "Debes iniciar sesión." };

  const existente = await sql`SELECT 1 FROM favorito WHERE usuario_id = ${usuario.id} AND contenido_id = ${contenidoId} LIMIT 1`;
  if (existente.length > 0) {
    await sql`DELETE FROM favorito WHERE usuario_id = ${usuario.id} AND contenido_id = ${contenidoId}`;
    return { ok: true, favorito: false };
  }
  await sql`INSERT INTO favorito (usuario_id, contenido_id) VALUES (${usuario.id}, ${contenidoId})`;
  return { ok: true, favorito: true };
}
