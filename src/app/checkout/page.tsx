import { redirect } from "next/navigation";
import { getSesion } from "@/lib/auth";
import { crearPreferencia } from "@/lib/mercado-pago";

export default async function CheckoutPage() {
  const usuario = await getSesion();
  if (!usuario) {
    redirect("/login");
  }

  try {
    const preferencia = await crearPreferencia(usuario.id, 2990);
    if (preferencia?.init_point) {
      redirect(preferencia.init_point);
    }
  } catch (err) {
    console.error("Error creating preference:", err);
  }

  redirect("/planes?error=pago");
}
