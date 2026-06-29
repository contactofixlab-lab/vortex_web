import { sql } from "./db";
import { esPremium, obtenerTierUsuario } from "./mercado-pago";

const MAX_CONVERSACIONES_FREE = 2;
const MAX_CONVERSACIONES_PREMIUM = -1; // Ilimitadas

export async function crearConversacion(usuarioId: number, titulo: string) {
  const premium = await esPremium(usuarioId);
  const maxConversaciones = premium ? MAX_CONVERSACIONES_PREMIUM : MAX_CONVERSACIONES_FREE;

  if (!premium) {
    const conversacionesActivas = await sql`
      SELECT COUNT(*) as cantidad
      FROM chat_conversacion
      WHERE usuario_id = ${usuarioId} AND estado = 'activa'
    `;

    if ((conversacionesActivas[0]?.cantidad || 0) >= maxConversaciones) {
      throw new Error(`Máximo ${maxConversaciones} conversaciones simultáneas. Mejora a Premium para ilimitadas.`);
    }
  }

  const result = await sql`
    INSERT INTO chat_conversacion (usuario_id, titulo)
    VALUES (${usuarioId}, ${titulo})
    RETURNING id
  `;

  return result[0]?.id;
}

export async function obtenerConversaciones(usuarioId: number) {
  return await sql`
    SELECT id, titulo, estado, created_at
    FROM chat_conversacion
    WHERE usuario_id = ${usuarioId}
    ORDER BY updated_at DESC
  `;
}

export async function enviarMensaje(conversacionId: number, usuarioId: number, contenido: string) {
  const resultado = await sql`
    INSERT INTO chat_mensaje (conversacion_id, usuario_id, contenido)
    VALUES (${conversacionId}, ${usuarioId}, ${contenido})
    RETURNING id, created_at
  `;

  // Actualizar fecha de actualización de conversación
  await sql`
    UPDATE chat_conversacion
    SET updated_at = now()
    WHERE id = ${conversacionId}
  `;

  return resultado[0];
}

export async function obtenerMensajes(conversacionId: number) {
  return await sql`
    SELECT m.id, m.usuario_id, u.nombre, m.contenido, m.created_at
    FROM chat_mensaje m
    JOIN usuario u ON u.id = m.usuario_id
    WHERE m.conversacion_id = ${conversacionId}
    ORDER BY m.created_at ASC
  `;
}

export async function cerrarConversacion(conversacionId: number) {
  await sql`
    UPDATE chat_conversacion
    SET estado = 'cerrada'
    WHERE id = ${conversacionId}
  `;
}

export async function getConversacionesActivas(usuarioId: number): Promise<number> {
  const result = await sql`
    SELECT COUNT(*) as cantidad
    FROM chat_conversacion
    WHERE usuario_id = ${usuarioId} AND estado = 'activa'
  `;

  return result[0]?.cantidad || 0;
}
