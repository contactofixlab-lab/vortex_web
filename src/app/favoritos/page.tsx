import { redirect } from "next/navigation";
import FavoritosClient from "@/components/FavoritosClient";
import { getSesion } from "@/lib/auth";
import { getFavoritos } from "@/lib/contenido";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Mis Favoritos — Vortex" };
export const revalidate = 0;

export default async function FavoritosPage() {
  const usuario = await getSesion();
  if (!usuario) redirect("/login");

  const favoritos = await getFavoritos(usuario.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm mb-6 transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        <ChevronLeft size={16} /> Volver al inicio
      </Link>

      <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>
        Mis Favoritos
      </h1>

      <FavoritosClient favoritos={favoritos} />
    </div>
  );
}
