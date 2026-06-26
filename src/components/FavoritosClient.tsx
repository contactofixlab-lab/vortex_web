"use client";

import ContentCard from "./ContentCard";
import { Contenido } from "@/lib/contenido";
import { Heart } from "lucide-react";

interface FavoritosClientProps {
  favoritos: Contenido[];
}

export default function FavoritosClient({ favoritos }: FavoritosClientProps) {
  if (favoritos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart size={48} style={{ color: "var(--neon-pink)", opacity: 0.3, marginBottom: 16 }} />
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Aún no tienes favoritos
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: 8 }}>
          Haz clic en el corazón en cualquier contenido para agregarlo aquí
        </p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
        {favoritos.length} {favoritos.length === 1 ? "favorito" : "favoritos"}
      </p>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        }}
      >
        {favoritos.map(contenido => (
          <ContentCard key={contenido.id} contenido={contenido} />
        ))}
      </div>
    </div>
  );
}
