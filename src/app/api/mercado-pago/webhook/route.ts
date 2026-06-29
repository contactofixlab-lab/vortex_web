import { NextRequest, NextResponse } from "next/server";
import { actualizarSuscripcion } from "@/lib/mercado-pago";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Webhook Mercado Pago:", body);

    const { type, data } = body;

    if (type === "payment" || type === "subscription") {
      const preferenceId = body.data?.id;
      const status = body.data?.status;
      const metadata = body.data?.metadata;

      if (!metadata?.usuario_id) {
        return NextResponse.json({ error: "No user ID in metadata" }, { status: 400 });
      }

      const usuarioId = metadata.usuario_id;

      // payment.completed
      if (type === "payment" && status === "approved") {
        await actualizarSuscripcion(usuarioId, "premium");
        return NextResponse.json({ success: true });
      }

      // subscription.updated
      if (type === "subscription") {
        if (status === "authorized" || status === "active") {
          await actualizarSuscripcion(usuarioId, "premium");
        } else if (status === "cancelled") {
          await actualizarSuscripcion(usuarioId, "free");
        }
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
