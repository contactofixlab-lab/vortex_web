import { redirect } from "next/navigation";
import PerfilClient from "@/components/PerfilClient";
import { getSesion } from "@/lib/auth";
import { getFavoritos } from "@/lib/contenido";

export const metadata = { title: "Mi perfil — Vortex" };
export const revalidate = 0;

export default async function PerfilPage() {
  const usuario = await getSesion();
  if (!usuario) redirect("/login");

  const favoritos = await getFavoritos(usuario.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PerfilClient favoritos={favoritos} />
    </div>
  );
}
