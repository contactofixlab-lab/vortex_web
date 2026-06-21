"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { crearComentario, obtenerComentarios, eliminarComentario } from "@/app/actions";
import { MessageSquare, Send, Trash2 } from "lucide-react";

interface Comentario {
  id: number;
  usuarioNombre: string;
  texto: string;
  createdAt: string;
  usuarioId: number;
}

interface CommentSectionProps {
  contenidoId: number;
  comentariosIniciales: Comentario[];
}

export default function CommentSection({ contenidoId, comentariosIniciales }: CommentSectionProps) {
  const { usuario } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>(comentariosIniciales);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !texto.trim()) return;

    setCargando(true);
    try {
      const res = await crearComentario(contenidoId, texto);
      if (res.ok) {
        setTexto("");
        // Refrescar comentarios
        const nuevos = await obtenerComentarios(contenidoId);
        setComentarios(nuevos);
      }
    } catch (err) {
      console.error(err);
    }
    setCargando(false);
  }

  async function handleDelete(comentarioId: number) {
    try {
      const res = await eliminarComentario(comentarioId);
      if (res.ok) {
        const nuevos = await obtenerComentarios(contenidoId);
        setComentarios(nuevos);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-4 text-sm font-semibold transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        <MessageSquare size={18} />
        {comentarios.length} comentario{comentarios.length !== 1 ? "s" : ""}
      </button>

      {expanded && (
        <>
          {usuario ? (
            <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Comparte tu opinión..."
                maxLength={300}
                className="w-full px-3 py-2 rounded-lg bg-transparent border text-sm resize-none"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {texto.length}/300
                </span>
                <button
                  type="submit"
                  disabled={cargando || !texto.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                  style={{
                    background: "rgba(57,255,20,0.2)",
                    border: "1px solid rgba(57,255,20,0.3)",
                    color: "#39ff14",
                    opacity: cargando || !texto.trim() ? 0.5 : 1,
                    cursor: cargando || !texto.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  <Send size={12} /> {cargando ? "Enviando..." : "Comentar"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-3 rounded-lg text-xs" style={{ background: "rgba(255,212,71,0.1)", color: "var(--neon-yellow)" }}>
              Inicia sesión para comentar
            </div>
          )}

          {comentarios.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Sé el primero en comentar
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {comentarios.map((comentario) => (
                <div
                  key={comentario.id}
                  className="p-3 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                        {comentario.usuarioNombre}
                      </p>
                      <p className="text-xs mt-1 break-words" style={{ color: "var(--text-secondary)" }}>
                        {comentario.texto}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {comentario.createdAt}
                      </p>
                    </div>
                    {usuario && usuario.id === comentario.usuarioId && (
                      <button
                        onClick={() => handleDelete(comentario.id)}
                        className="p-1 rounded transition-colors hover:bg-red-500/10"
                        style={{ color: "var(--neon-pink)" }}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
