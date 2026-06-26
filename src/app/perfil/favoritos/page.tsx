import { redirect } from "next/navigation";
import PerfilNavigation from "@/components/PerfilNavigation";
import FavoritosClient from "@/components/FavoritosClient";
import { getSesion } from "@/lib/auth";
import { getFavoritos } from "@/lib/contenido";

export const metadata = { title: "Mis Favoritos — Vortex" };
export const revalidate = 0;

export default async function FavoritosPage() {
  const usuario = await getSesion();
  if (!usuario) redirect("/login");

  const favoritos = await getFavoritos(usuario.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>
        Mis Favoritos
      </h1>

      <PerfilNavigation />

      <FavoritosClient favoritos={favoritos} />
    </div>
  );
}
