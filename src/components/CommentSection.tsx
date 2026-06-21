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
  avatarUrl?: string;
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
  const [expanded, setExpanded] = useState(false || usuario !== null); // Expandir si está logueado

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
            <form onSubmit={handleSubmit} className="mb-6 gap-2 flex items-end gap-2">
              {usuario.avatar_url ? (
                <img
                  src={usuario.avatar_url}
                  alt={usuario.nombre}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(0,184,255,0.2)", color: "var(--neon-cyan)" }}
                >
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 flex items-end gap-2">
                <div className="flex-1 flex flex-col">
                  <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escribe un comentario..."
                    maxLength={300}
                    className="w-full px-3 py-2 rounded-lg bg-transparent border text-sm resize-none"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
                    rows={2}
                  />
                  <div className="flex items-center justify-end mt-1">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {texto.length}/300
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={cargando || !texto.trim()}
                  className="px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-all flex-shrink-0"
                  style={{
                    background: "rgba(57,255,20,0.2)",
                    border: "1px solid rgba(57,255,20,0.3)",
                    color: "#39ff14",
                    opacity: cargando || !texto.trim() ? 0.5 : 1,
                    cursor: cargando || !texto.trim() ? "not-allowed" : "pointer",
                    width: 36,
                    height: 36,
                  }}
                  title="Enviar comentario"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 rounded-lg text-sm text-center" style={{ background: "rgba(255,212,71,0.1)", color: "var(--neon-yellow)" }}>
              🔐 Inicia sesión para comentar y compartir tu opinión
            </div>
          )}

          {comentarios.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
              Sé el primero en comentar 💬
            </p>
          ) : (
            <div className="space-y-3 bg-gradient-to-b from-transparent to-rgba(191,95,255,0.02) rounded-lg p-4">
              {comentarios.map((comentario) => (
                <div
                  key={comentario.id}
                  className="flex gap-3 group"
                >
                  {comentario.avatarUrl ? (
                    <img
                      src={comentario.avatarUrl}
                      alt={comentario.usuarioNombre}
                      className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(0,184,255,0.2)", color: "var(--neon-cyan)" }}
                    >
                      {comentario.usuarioNombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {comentario.usuarioNombre}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {comentario.createdAt}
                        </p>
                      </div>
                      {usuario && usuario.id === comentario.usuarioId && (
                        <button
                          onClick={() => handleDelete(comentario.id)}
                          className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "var(--neon-pink)" }}
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm mt-1.5 break-words leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {comentario.texto}
                    </p>
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
