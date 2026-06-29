import { sql } from "./db";

const MERCADO_PAGO_API = "https://api.mercadopago.com";
const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const PUBLIC_KEY = process.env.MERCADO_PAGO_PUBLIC_KEY;

if (!ACCESS_TOKEN || !PUBLIC_KEY) {
  throw new Error("Missing Mercado Pago credentials in environment variables");
}

export async function crearPreferencia(usuarioId: number, monto: number) {
  const response = await fetch(`${MERCADO_PAGO_API}/checkout/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: [
        {
          title: "Premium Vortex - 1 Mes",
          quantity: 1,
          currency_id: "CLP",
          unit_price: monto,
        },
      ],
      payer: {
        email: "",
      },
      back_urls: {
        success: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/perfil?subscription=success`,
        failure: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/perfil?subscription=failed`,
        pending: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/perfil?subscription=pending`,
      },
      auto_return: "approved",
      metadata: {
        usuario_id: usuarioId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create Mercado Pago preference");
  }

  const data = await response.json();
  return data;
}

export async function obtenerSuscripcion(usuarioId: number) {
  const result = await sql`
    SELECT * FROM suscripcion WHERE usuario_id = ${usuarioId}
  `;
  return result[0] || null;
}

export async function actualizarSuscripcion(
  usuarioId: number,
  tier: "free" | "premium",
  mercadoPagoData?: any
) {
  const suscripcion = await obtenerSuscripcion(usuarioId);

  if (suscripcion) {
    await sql`
      UPDATE suscripcion
      SET
        tier = ${tier},
        estado = 'active',
        fecha_expiracion = ${tier === "premium" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null},
        updated_at = now()
      WHERE usuario_id = ${usuarioId}
    `;
  } else {
    await sql`
      INSERT INTO suscripcion (usuario_id, tier, fecha_expiracion, estado)
      VALUES (
        ${usuarioId},
        ${tier},
        ${tier === "premium" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null},
        'active'
      )
    `;
  }
}

export async function obtenerTierUsuario(usuarioId: number) {
  const suscripcion = await obtenerSuscripcion(usuarioId);
  return suscripcion?.tier || "free";
}

export async function esPremium(usuarioId: number): Promise<boolean> {
  const tier = await obtenerTierUsuario(usuarioId);
  const suscripcion = await obtenerSuscripcion(usuarioId);

  if (tier !== "premium") return false;
  if (!suscripcion?.fecha_expiracion) return false;

  return new Date(suscripcion.fecha_expiracion) > new Date();
}

export function getPublicKey() {
  return PUBLIC_KEY;
}
