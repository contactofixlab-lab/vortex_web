import { redirect } from "next/navigation";
import NotificacionesClient from "@/components/NotificacionesClient";
import { getSesion } from "@/lib/auth";
import { obtenerNotificaciones } from "@/app/actions";

export const metadata = { title: "Notificaciones — Vortex" };
export const revalidate = 0;

export default async function NotificacionesPage() {
  const usuario = await getSesion();
  if (!usuario) redirect("/login");

  const notificaciones = await obtenerNotificaciones();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <NotificacionesClient notificacionesIniciales={notificaciones} />
    </div>
  );
}
