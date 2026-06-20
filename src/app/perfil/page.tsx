import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import ContentCard from "@/components/ContentCard";
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
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 rounded-full" style={{ background: "var(--neon-pink)", boxShadow: "0 0 10px var(--neon-pink)" }} />
        <h1 className="text-3xl font-black tracking-widest" style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-pink)" }}>
          MI PERFIL
        </h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        {usuario.nombre} · {usuario.email}
      </p>

      <div className="flex items-center gap-3 mb-5">
        <Heart size={18} style={{ color: "var(--neon-pink)" }} />
        <h2 className="text-lg font-bold tracking-widest" style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}>
          MIS FAVORITOS
        </h2>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{favoritos.length}</span>
      </div>

      {favoritos.length === 0 ? (
        <div className="glass-card rounded-2xl flex flex-col items-center justify-center gap-2 py-14" style={{ color: "var(--text-muted)" }}>
          <Heart size={28} style={{ opacity: 0.4 }} />
          <span className="text-sm">Todavía no agregaste nada a favoritos.</span>
          <span className="text-xs">Toca el corazón en cualquier título para guardarlo aquí.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {favoritos.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
