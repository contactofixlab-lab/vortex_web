"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Seccion = "info" | "social" | "preferencias" | "privacidad" | "notificaciones" | "seguridad" | "pedir";

interface PerfilNavigationProps {
  onSeccionChange?: (seccion: Seccion) => void;
}

export default function PerfilNavigation({ onSeccionChange }: PerfilNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seccion = (searchParams.get("seccion") || "info") as Seccion;

  const secciones: Array<{ id: Seccion; label: string; icon: string }> = [
    { id: "info", label: "Información", icon: "👤" },
    { id: "social", label: "Perfil Social", icon: "🎭" },
    { id: "preferencias", label: "Preferencias", icon: "🎬" },
    { id: "privacidad", label: "Privacidad", icon: "🔒" },
    { id: "notificaciones", label: "Notificaciones", icon: "🔔" },
    { id: "seguridad", label: "Seguridad", icon: "🔐" },
    { id: "pedir", label: "Pedir", icon: "📨" },
  ];

  const handleClick = (id: Seccion) => {
    router.push(`/perfil?seccion=${id}`);
    onSeccionChange?.(id);
  };

  return (
    <div
      className="flex gap-2 border-b overflow-x-auto pb-4"
      style={{
        borderColor: "rgba(0,184,255,0.2)",
        marginBottom: "2rem",
      }}
    >
      {secciones.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => handleClick(id)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap tracking-wide"
          style={{
            background: seccion === id ? "rgba(0,184,255,0.2)" : "rgba(255,255,255,0.04)",
            color: seccion === id ? "var(--neon-cyan)" : "var(--text-secondary)",
            border: seccion === id ? "1px solid rgba(0,184,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
            boxShadow: seccion === id ? "0 0 10px rgba(0,184,255,0.2)" : "none",
            cursor: "pointer",
          }}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
