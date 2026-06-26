"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, Sliders, Globe } from "lucide-react";

type Seccion = "info" | "social" | "preferencias" | "privacidad";

interface PerfilNavigationProps {
  onSeccionChange?: (seccion: Seccion) => void;
}

export default function PerfilNavigation({ onSeccionChange }: PerfilNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seccion = (searchParams.get("seccion") || "info") as Seccion;

  const secciones: Array<{ id: Seccion; label: string; icon: typeof User }> = [
    { id: "info", label: "Mi Perfil", icon: User },
    { id: "privacidad", label: "Privacidad", icon: Lock },
    { id: "preferencias", label: "Preferencias", icon: Sliders },
    { id: "social", label: "Perfil Social", icon: Globe },
  ];

  const handleClick = (id: Seccion) => {
    router.push(`/perfil?seccion=${id}`);
    onSeccionChange?.(id);
  };

  return (
    <div className="flex gap-2 border-b mb-8 overflow-x-auto" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
      {secciones.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => handleClick(id)}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap"
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
