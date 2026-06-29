import { sql } from "./db";
import { esPremium } from "./mercado-pago";

const GIFTS_PREDETERMINADOS = [
  { nombre: "❤️ Corazón", icon: "❤️", tipo: "predeterminado" },
  { nombre: "🔥 Fuego", icon: "🔥", tipo: "predeterminado" },
  { nombre: "⭐ Estrella", icon: "⭐", tipo: "predeterminado" },
  { nombre: "🎉 Celebración", icon: "🎉", tipo: "predeterminado" },
  { nombre: "😍 Enamorado", icon: "😍", tipo: "predeterminado" },
  { nombre: "👏 Aplausos", icon: "👏", tipo: "predeterminado" },
  { nombre: "🎁 Regalo", icon: "🎁", tipo: "predeterminado" },
  { nombre: "✨ Brillo", icon: "✨", tipo: "predeterminado" },
  { nombre: "💎 Diamante", icon: "💎", tipo: "predeterminado" },
  { nombre: "🌟 Destello", icon: "🌟", tipo: "predeterminado" },
];

export async function inicializarGifts(usuarioId: number) {
  try {
    // Crear gifts predeterminados para el usuario
    for (const gift of GIFTS_PREDETERMINADOS) {
      await sql`
        INSERT INTO gift (usuario_id, nombre, icon, tipo)
        VALUES (${usuarioId}, ${gift.nombre}, ${gift.icon}, ${gift.tipo})
        ON CONFLICT DO NOTHING
      `;
    }
  } catch (err) {
    console.log("Gifts already initialized or table doesn't exist yet");
  }
}

export async function obtenerGifts(usuarioId: number) {
  try {
    return await sql`
      SELECT id, nombre, icon, tipo
      FROM gift
      WHERE usuario_id = ${usuarioId}
      ORDER BY tipo DESC
    `;
  } catch (err) {
    return GIFTS_PREDETERMINADOS;
  }
}

export async function enviarGift(
  giftId: number,
  usuarioDeId: number,
  usuarioParaId: number,
  mensaje?: string
) {
  const premium = await esPremium(usuarioDeId);

  if (!premium) {
    const regalosHoy = await sql`
      SELECT COUNT(*) as cantidad
      FROM gift_recibido
      WHERE usuario_de_id = ${usuarioDeId}
        AND DATE(created_at) = CURRENT_DATE
    `;

    // Free users pueden enviar máximo 5 gifts por día
    if ((regalosHoy[0]?.cantidad || 0) >= 5) {
      throw new Error("Has alcanzado el límite de regalos por hoy. Mejora a Premium para ilimitados.");
    }
  }

  const result = await sql`
    INSERT INTO gift_recibido (gift_id, usuario_de_id, usuario_para_id, mensaje)
    VALUES (${giftId}, ${usuarioDeId}, ${usuarioParaId}, ${mensaje || null})
    RETURNING id, created_at
  `;

  return result[0];
}

export async function obtenerRegalos(usuarioId: number) {
  try {
    return await sql`
      SELECT g.nombre, g.icon, gr.usuario_de_id, u.nombre as usuario_nombre, gr.mensaje, gr.created_at
      FROM gift_recibido gr
      JOIN gift g ON g.id = gr.gift_id
      JOIN usuario u ON u.id = gr.usuario_de_id
      WHERE gr.usuario_para_id = ${usuarioId}
      ORDER BY gr.created_at DESC
      LIMIT 50
    `;
  } catch (err) {
    return [];
  }
}
