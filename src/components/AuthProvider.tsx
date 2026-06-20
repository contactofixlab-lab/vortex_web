"use client";

import { createContext, useContext, useState } from "react";
import { toggleFavorito as toggleFavoritoAction } from "@/app/actions";

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
};

interface AuthContextValue {
  usuario: Usuario | null;
  favoritoIds: Set<string>;
  isFavorito: (contenidoId: string) => boolean;
  toggleFavorito: (contenidoId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  usuario, favoritoIds, children,
}: {
  usuario: Usuario | null;
  favoritoIds: string[];
  children: React.ReactNode;
}) {
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set(favoritoIds));

  function isFavorito(contenidoId: string) {
    return favoritos.has(contenidoId);
  }

  function toggleFavorito(contenidoId: string) {
    if (!usuario) return;
    const yaEsFavorito = favoritos.has(contenidoId);

    // Optimista: actualiza la UI antes de que vuelva el servidor.
    setFavoritos(prev => {
      const next = new Set(prev);
      if (yaEsFavorito) next.delete(contenidoId);
      else next.add(contenidoId);
      return next;
    });

    toggleFavoritoAction(Number(contenidoId)).then(res => {
      if (!res.ok) {
        // Revertir si falló (p.ej. sesión expiró).
        setFavoritos(prev => {
          const next = new Set(prev);
          if (yaEsFavorito) next.add(contenidoId);
          else next.delete(contenidoId);
          return next;
        });
      }
    });
  }

  return (
    <AuthContext.Provider value={{ usuario, favoritoIds: favoritos, isFavorito, toggleFavorito }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
