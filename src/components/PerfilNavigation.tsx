"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Settings, Bell } from "lucide-react";

export default function PerfilNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion") || "configuracion";

  const secciones = [
    { id: "configuracion", label: "Configuración", icon: Settings },
    { id: "favoritos", label: "Favoritos", icon: Heart },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
  ];

  return (
    <div className="flex gap-2 border-b mb-8" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
      {secciones.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => router.push(`/perfil?seccion=${id}`)}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all"
          style={{
            color: seccion === id ? "var(--neon-cyan)" : "var(--text-secondary)",
            borderBottom: seccion === id ? "2px solid var(--neon-cyan)" : "none",
            cursor: "pointer",
          }}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
