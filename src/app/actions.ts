"use server";

import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { crearSesion, destruirSesion, getSesion } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ActionResult = { ok: true } | { ok: false; error: string };

export async function registrarUsuario(nombre: string, email: string, password: string): Promise<ActionResult> {
  const nombreLimpio = nombre.trim();
  const emailLimpio = email.trim().toLowerCase();

  if (nombreLimpio.length < 2) return { ok: false, error: "Ingresa tu nombre." };
  if (!EMAIL_RE.test(emailLimpio)) return { ok: false, error: "Ingresa un correo válido." };
  if (password.length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };

  const existente = await sql`SELECT 1 FROM usuario WHERE email = ${emailLimpio} LIMIT 1`;
  if (existente.length > 0) return { ok: false, error: "Ya existe una cuenta con ese correo." };

  const hash = await bcrypt.hash(password, 10);
  const rows = await sql`INSERT INTO usuario (email, password_hash, nombre) VALUES (${emailLimpio}, ${hash}, ${nombreLimpio}) RETURNING id`;
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
