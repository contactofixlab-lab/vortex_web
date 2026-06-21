"use client";

import { useState, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { crearComentario, obtenerComentarios, eliminarComentario } from "@/app/actions";
import { MessageSquare, Send, Trash2, Smile, ChevronDown } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

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
  const [expanded, setExpanded] = useState(usuario !== null);
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !texto.trim()) return;

    setCargando(true);
    try {
      const res = await crearComentario(contenidoId, texto);
      if (res.ok) {
        setTexto("");
        setShowEmoji(false);
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

  const handleEmojiClick = (emojiObject: any) => {
    setTexto(texto + emojiObject.emoji);
  };

  return (
    <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-6 text-base font-semibold transition-colors hover:opacity-80"
        style={{ color: "var(--text-primary)" }}
      >
        <MessageSquare size={20} style={{ color: "var(--neon-cyan)" }} />
        Comentarios ({comentarios.length})
        <ChevronDown size={16} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
      </button>

      {expanded && (
        <div className="space-y-6">
          {usuario ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Chat Input Area */}
              <div
                className="rounded-xl p-1"
                style={{
                  background: "linear-gradient(135deg, rgba(0,245,255,0.08) 0%, rgba(191,95,255,0.08) 100%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex gap-3 p-3">
                  {usuario.avatar_url ? (
                    <img
                      src={usuario.avatar_url}
                      alt={usuario.nombre}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(191,95,255,0.2))", color: "var(--neon-cyan)" }}
                    >
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {usuario.nombre}
                    </div>
                    <textarea
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      placeholder="Comparte tu opinión..."
                      maxLength={300}
                      className="w-full px-3 py-2.5 rounded-lg bg-transparent border text-sm resize-none focus:outline-none transition-colors"
                      style={{
                        borderColor: texto ? "rgba(0,245,255,0.3)" : "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                        minHeight: "60px",
                      }}
                      rows={2}
                    />

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowEmoji(!showEmoji)}
                          className="p-2 rounded-lg transition-all hover:bg-opacity-20"
                          style={{
                            background: showEmoji ? "rgba(0,245,255,0.1)" : "transparent",
                            color: showEmoji ? "var(--neon-cyan)" : "var(--text-muted)",
                          }}
                          title="Agregar emoji"
                        >
                          <Smile size={18} />
                        </button>

                        {showEmoji && (
                          <div
                            ref={emojiRef}
                            className="absolute bottom-full mb-2 z-50"
                            style={{
                              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.3))",
                            }}
                          >
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                          {texto.length}/300
                        </span>
                        <button
                          type="submit"
                          disabled={cargando || !texto.trim()}
                          className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                          style={{
                            background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(191,95,255,0.15))",
                            border: "1px solid rgba(0,245,255,0.3)",
                            color: "var(--neon-cyan)",
                            opacity: cargando || !texto.trim() ? 0.5 : 1,
                            cursor: cargando || !texto.trim() ? "not-allowed" : "pointer",
                          }}
                        >
                          <Send size={16} />
                          {cargando ? "Enviando..." : "Enviar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div
              className="rounded-xl p-4 text-center text-sm font-medium"
              style={{
                background: "linear-gradient(135deg, rgba(255,212,71,0.1), rgba(191,95,255,0.1))",
                border: "1px solid rgba(255,212,71,0.2)",
                color: "var(--neon-yellow)",
              }}
            >
              🔐 Inicia sesión para comentar y compartir tu opinión
            </div>
          )}

          {/* Comments List */}
          {comentarios.length === 0 ? (
            <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Sé el primero en comentar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comentarios.map((comentario) => (
                <div
                  key={comentario.id}
                  className="group flex gap-3 p-3 rounded-lg transition-all hover:bg-opacity-30"
                  style={{
                    background: "rgba(191,95,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {comentario.avatarUrl ? (
                    <img
                      src={comentario.avatarUrl}
                      alt={comentario.usuarioNombre}
                      className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(191,95,255,0.2))", color: "var(--neon-cyan)" }}
                    >
                      {comentario.usuarioNombre.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between mb-1">
                      <div className="flex items-center gap-2">
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
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10"
                          style={{ color: "var(--neon-pink)" }}
                          title="Eliminar comentario"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <p className="text-sm leading-relaxed break-words" style={{ color: "var(--text-secondary)" }}>
                      {comentario.texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
