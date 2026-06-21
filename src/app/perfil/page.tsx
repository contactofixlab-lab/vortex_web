import { redirect } from "next/navigation";
import PerfilClient from "@/components/PerfilClient";
import { getSesion } from "@/lib/auth";
import { getFavoritos } from "@/lib/contenido";
import { sql } from "@/lib/db";

export const metadata = { title: "Mi perfil — Vortex" };
export const revalidate = 0;

export default async function PerfilPage() {
  const usuario = await getSesion();
  if (!usuario) redirect("/login");

  const [favoritos, prefs] = await Promise.all([
    getFavoritos(usuario.id),
    sql`
      SELECT
        notif_comentarios_habilitada,
        notif_favoritos_habilitada,
        notif_seguidores_habilitada,
        notif_info_habilitada
      FROM usuario WHERE id = ${usuario.id}
    `,
  ]);

  const notificaciones = prefs[0]
    ? {
        comentarios: (prefs[0].notif_comentarios_habilitada as boolean) ?? true,
        favoritos: (prefs[0].notif_favoritos_habilitada as boolean) ?? true,
        seguidores: (prefs[0].notif_seguidores_habilitada as boolean) ?? true,
        info: (prefs[0].notif_info_habilitada as boolean) ?? true,
      }
    : { comentarios: true, favoritos: true, seguidores: true, info: true };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PerfilClient favoritos={favoritos} notificaciones={notificaciones} />
    </div>
  );
}
