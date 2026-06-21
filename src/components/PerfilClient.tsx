"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { actualizarPerfil, cambiarPassword } from "@/app/actions";
import { Heart, Save, X, Eye, EyeOff, Lock, Mail, User, Phone, Globe, MessageSquare } from "lucide-react";
import ContentCard from "./ContentCard";
import { Contenido } from "@/lib/contenido";

interface PerfilClientProps {
  favoritos: Contenido[];
  notificaciones?: {
    comentarios: boolean;
    favoritos: boolean;
    seguidores: boolean;
    info: boolean;
  };
}

type Seccion = "info" | "social" | "preferencias" | "privacidad" | "notificaciones" | "seguridad" | "pedir" | "favoritos";

const GENEROS = ["Anime", "Serie", "Película"];
const IDIOMAS = ["Español", "Inglés", "Japonés", "Francés"];

export default function PerfilClient({ favoritos, notificaciones }: PerfilClientProps) {
  const { usuario } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("info");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Estados de edición
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [telefono, setTelefono] = useState(usuario?.telefono || "");
  const [pais, setPais] = useState(usuario?.pais || "");
  const [username, setUsername] = useState(usuario?.username || "");
  const [biografia, setBiografia] = useState(usuario?.biografia || "");
  const [avatarUrl, setAvatarUrl] = useState(usuario?.avatar_url || "");
  const [generosSeleccionados, setGenerosSeleccionados] = useState<string[]>(usuario?.generos_favoritos || []);
  const [idiomasSeleccionados, setIdiomasSeleccionados] = useState<string[]>(usuario?.idiomas_preferidos || []);
  const [perfilVisible, setPerfilVisible] = useState(usuario?.perfil_visible !== false);
  const [notificacionesHabilitadas, setNotificacionesHabilitadas] = useState(usuario?.notificaciones_habilitadas !== false);
  const [notifComentarios, setNotifComentarios] = useState(notificaciones?.comentarios ?? true);
  const [notifFavoritos, setNotifFavoritos] = useState(notificaciones?.favoritos ?? true);
  const [notifSeguidores, setNotifSeguidores] = useState(notificaciones?.seguidores ?? true);
  const [notifInfo, setNotifInfo] = useState(notificaciones?.info ?? true);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [solicitudContenido, setSolicitudContenido] = useState("");

  async function guardarCambios(tipo: string) {
    setGuardando(true);
    setMensaje(null);

    try {
      if (tipo === "info") {
        const res = await actualizarPerfil({ nombre, telefono, pais });
        if (res.ok) {
          setMensaje({ tipo: "exito", texto: "Información guardada ✓" });
        } else {
          setMensaje({ tipo: "error", texto: res.error });
        }
      } else if (tipo === "social") {
        const res = await actualizarPerfil({ username, biografia, avatar_url: avatarUrl });
        if (res.ok) {
          setMensaje({ tipo: "exito", texto: "Perfil actualizado ✓" });
        } else {
          setMensaje({ tipo: "error", texto: res.error });
        }
      } else if (tipo === "preferencias") {
        const res = await actualizarPerfil({ generos_favoritos: generosSeleccionados, idiomas_preferidos: idiomasSeleccionados });
        if (res.ok) {
          setMensaje({ tipo: "exito", texto: "Preferencias guardadas ✓" });
        } else {
          setMensaje({ tipo: "error", texto: res.error });
        }
      } else if (tipo === "privacidad") {
        const res = await actualizarPerfil({
          perfil_visible: perfilVisible,
          notificaciones_habilitadas: notificacionesHabilitadas
        });
        if (res.ok) {
          setMensaje({ tipo: "exito", texto: "Configuración guardada ✓" });
        } else {
          setMensaje({ tipo: "error", texto: res.error });
        }
      } else if (tipo === "notificaciones") {
        const res = await actualizarPerfil({
          notificaciones_habilitadas: notificacionesHabilitadas,
          notif_comentarios_habilitada: notifComentarios,
          notif_favoritos_habilitada: notifFavoritos,
          notif_seguidores_habilitada: notifSeguidores,
          notif_info_habilitada: notifInfo,
        });
        if (res.ok) {
          setMensaje({ tipo: "exito", texto: "Notificaciones configuradas ✓" });
        } else {
          setMensaje({ tipo: "error", texto: res.error });
        }
      } else if (tipo === "seguridad") {
        if (passwordNueva !== passwordConfirm) {
          setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden." });
          setGuardando(false);
          return;
        }
        const res = await cambiarPassword(passwordActual, passwordNueva);
        if (res.ok) {
          setMensaje({ tipo: "exito", texto: "Contraseña actualizada ✓" });
          setPasswordActual("");
          setPasswordNueva("");
          setPasswordConfirm("");
        } else {
          setMensaje({ tipo: "error", texto: res.error });
        }
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al guardar cambios." });
    }

    setGuardando(false);
  }

  if (!usuario) return <div style={{ color: "var(--text-muted)" }}>Cargando...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-widest" style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}>
          MI PERFIL
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          {usuario.email}
        </p>
      </div>

      {/* Navegación de secciones */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "info" as Seccion, label: "Información", icon: "👤" },
          { id: "social" as Seccion, label: "Perfil Social", icon: "🎭" },
          { id: "preferencias" as Seccion, label: "Preferencias", icon: "🎬" },
          { id: "privacidad" as Seccion, label: "Privacidad", icon: "🔒" },
          { id: "notificaciones" as Seccion, label: "Notificaciones", icon: "🔔" },
          { id: "seguridad" as Seccion, label: "Seguridad", icon: "🔐" },
          { id: "pedir" as Seccion, label: "Pedir", icon: "📨" },
          { id: "favoritos" as Seccion, label: "Favoritos", icon: "❤️" },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setSeccionActiva(id)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: seccionActiva === id ? "rgba(0,184,255,0.2)" : "rgba(255,255,255,0.04)",
              border: seccionActiva === id ? "1px solid rgba(0,184,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
              color: seccionActiva === id ? "var(--neon-cyan)" : "var(--text-secondary)",
            }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div
          className="px-4 py-3 rounded-lg text-sm flex items-center gap-2"
          style={{
            background: mensaje.tipo === "exito" ? "rgba(57,255,20,0.1)" : "rgba(255,79,216,0.1)",
            border: `1px solid ${mensaje.tipo === "exito" ? "rgba(57,255,20,0.3)" : "rgba(255,79,216,0.3)"}`,
            color: mensaje.tipo === "exito" ? "#39ff14" : "var(--neon-pink)",
          }}
        >
          {mensaje.tipo === "exito" ? "✓" : "⚠"} {mensaje.texto}
        </div>
      )}

      {/* Sección: Información Básica */}
      {seccionActiva === "info" && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Información Básica</h3>

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Email</label>
            <input
              type="email"
              value={usuario.email}
              disabled
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm opacity-50"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>No se puede cambiar por seguridad</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Teléfono (opcional)</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>País</label>
              <input
                type="text"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                placeholder="Chile"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <button
            onClick={() => guardarCambios("info")}
            disabled={guardando}
            className="mt-4 px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: guardando ? "rgba(255,255,255,0.05)" : "rgba(0,184,255,0.2)",
              border: "1px solid rgba(0,184,255,0.3)",
              color: "var(--neon-cyan)",
              opacity: guardando ? 0.5 : 1,
            }}
          >
            <Save size={16} /> {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}

      {/* Sección: Perfil Social */}
      {seccionActiva === "social" && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Perfil Social</h3>

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Nombre de usuario (handle)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_usuario"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Para menciones en comentarios (próximamente)</p>
          </div>

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Biografía</label>
            <textarea
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              maxLength={200}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm resize-none"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
              rows={3}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{biografia.length}/200</p>
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Avatar (URL)</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>PNG, JPG o GIF (máx 5MB)</p>
            </div>
            {avatarUrl && (
              <div className="w-12 h-12 rounded-full overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <button
            onClick={() => guardarCambios("social")}
            disabled={guardando}
            className="mt-4 px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: guardando ? "rgba(255,255,255,0.05)" : "rgba(139,92,246,0.2)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "var(--neon-violet)",
              opacity: guardando ? 0.5 : 1,
            }}
          >
            <Save size={16} /> {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}

      {/* Sección: Preferencias */}
      {seccionActiva === "preferencias" && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Preferencias de Contenido</h3>

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Géneros favoritos</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {GENEROS.map((genero) => (
                <button
                  key={genero}
                  onClick={() =>
                    setGenerosSeleccionados((prev) =>
                      prev.includes(genero) ? prev.filter((g) => g !== genero) : [...prev, genero]
                    )
                  }
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: generosSeleccionados.includes(genero) ? "rgba(255,212,71,0.2)" : "rgba(255,255,255,0.04)",
                    border: generosSeleccionados.includes(genero) ? "1px solid rgba(255,212,71,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    color: generosSeleccionados.includes(genero) ? "var(--neon-yellow)" : "var(--text-secondary)",
                  }}
                >
                  {generosSeleccionados.includes(genero) ? "✓ " : ""}{genero}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Idiomas preferidos</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {IDIOMAS.map((idioma) => (
                <button
                  key={idioma}
                  onClick={() =>
                    setIdiomasSeleccionados((prev) =>
                      prev.includes(idioma) ? prev.filter((i) => i !== idioma) : [...prev, idioma]
                    )
                  }
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: idiomasSeleccionados.includes(idioma) ? "rgba(255,79,216,0.2)" : "rgba(255,255,255,0.04)",
                    border: idiomasSeleccionados.includes(idioma) ? "1px solid rgba(255,79,216,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    color: idiomasSeleccionados.includes(idioma) ? "var(--neon-pink)" : "var(--text-secondary)",
                  }}
                >
                  {idiomasSeleccionados.includes(idioma) ? "✓ " : ""}{idioma}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => guardarCambios("preferencias")}
            disabled={guardando}
            className="mt-4 px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: guardando ? "rgba(255,255,255,0.05)" : "rgba(255,212,71,0.2)",
              border: "1px solid rgba(255,212,71,0.3)",
              color: "var(--neon-yellow)",
              opacity: guardando ? 0.5 : 1,
            }}
          >
            <Save size={16} /> {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}

      {/* Sección: Privacidad */}
      {seccionActiva === "privacidad" && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Privacidad y Notificaciones</h3>

          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Perfil visible</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Otros usuarios pueden ver tu perfil</p>
            </div>
            <button
              onClick={() => setPerfilVisible(!perfilVisible)}
              className="w-12 h-6 rounded-full transition-all relative flex items-center"
              style={{ background: perfilVisible ? "rgba(57,255,20,0.3)" : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-5 h-5 rounded-full absolute transition-all"
                style={{
                  background: perfilVisible ? "#39ff14" : "rgba(255,255,255,0.3)",
                  left: perfilVisible ? "calc(100% - 22px)" : "3px",
                }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Notificaciones</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Recibir notificaciones en general</p>
            </div>
            <button
              onClick={() => setNotificacionesHabilitadas(!notificacionesHabilitadas)}
              className="w-12 h-6 rounded-full transition-all relative flex items-center"
              style={{ background: notificacionesHabilitadas ? "rgba(57,255,20,0.3)" : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-5 h-5 rounded-full absolute transition-all"
                style={{
                  background: notificacionesHabilitadas ? "#39ff14" : "rgba(255,255,255,0.3)",
                  left: notificacionesHabilitadas ? "calc(100% - 22px)" : "3px",
                }}
              />
            </button>
          </div>

          <button
            onClick={() => guardarCambios("privacidad")}
            disabled={guardando}
            className="mt-4 px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: guardando ? "rgba(255,255,255,0.05)" : "rgba(57,255,20,0.2)",
              border: "1px solid rgba(57,255,20,0.3)",
              color: "#39ff14",
              opacity: guardando ? 0.5 : 1,
            }}
          >
            <Save size={16} /> {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}

      {/* Sección: Notificaciones */}
      {seccionActiva === "notificaciones" && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Tipos de Notificaciones</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Elige qué tipo de notificaciones quieres recibir</p>

          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2">
              <span>💬</span>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Comentarios</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Cuando publicas un comentario</p>
              </div>
            </div>
            <button
              onClick={() => setNotifComentarios(!notifComentarios)}
              className="w-12 h-6 rounded-full transition-all relative flex items-center"
              style={{ background: notifComentarios ? "rgba(0,184,255,0.3)" : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-5 h-5 rounded-full absolute transition-all"
                style={{
                  background: notifComentarios ? "var(--neon-cyan)" : "rgba(255,255,255,0.3)",
                  left: notifComentarios ? "calc(100% - 22px)" : "3px",
                }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2">
              <span>❤️</span>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Favoritos</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Cuando agregas contenido a favoritos</p>
              </div>
            </div>
            <button
              onClick={() => setNotifFavoritos(!notifFavoritos)}
              className="w-12 h-6 rounded-full transition-all relative flex items-center"
              style={{ background: notifFavoritos ? "rgba(255,79,216,0.3)" : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-5 h-5 rounded-full absolute transition-all"
                style={{
                  background: notifFavoritos ? "var(--neon-pink)" : "rgba(255,255,255,0.3)",
                  left: notifFavoritos ? "calc(100% - 22px)" : "3px",
                }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2">
              <span>👥</span>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Seguidores</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Cuando alguien te sigue (próximamente)</p>
              </div>
            </div>
            <button
              onClick={() => setNotifSeguidores(!notifSeguidores)}
              className="w-12 h-6 rounded-full transition-all relative flex items-center"
              style={{ background: notifSeguidores ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-5 h-5 rounded-full absolute transition-all"
                style={{
                  background: notifSeguidores ? "var(--neon-violet)" : "rgba(255,255,255,0.3)",
                  left: notifSeguidores ? "calc(100% - 22px)" : "3px",
                }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2">
              <span>ℹ️</span>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Información</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Actualizaciones y avisos importantes</p>
              </div>
            </div>
            <button
              onClick={() => setNotifInfo(!notifInfo)}
              className="w-12 h-6 rounded-full transition-all relative flex items-center"
              style={{ background: notifInfo ? "rgba(255,212,71,0.3)" : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-5 h-5 rounded-full absolute transition-all"
                style={{
                  background: notifInfo ? "var(--neon-yellow)" : "rgba(255,255,255,0.3)",
                  left: notifInfo ? "calc(100% - 22px)" : "3px",
                }}
              />
            </button>
          </div>

          <button
            onClick={() => guardarCambios("notificaciones")}
            disabled={guardando}
            className="mt-4 px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: guardando ? "rgba(255,255,255,0.05)" : "rgba(0,184,255,0.2)",
              border: "1px solid rgba(0,184,255,0.3)",
              color: "var(--neon-cyan)",
              opacity: guardando ? 0.5 : 1,
            }}
          >
            <Save size={16} /> {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}

      {/* Sección: Seguridad */}
      {seccionActiva === "seguridad" && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Cambiar Contraseña</h3>

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Contraseña actual</label>
            <input
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Contraseña nueva</label>
            <input
              type="password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Confirmar contraseña</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border text-sm"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
            />
          </div>

          <button
            onClick={() => guardarCambios("seguridad")}
            disabled={guardando || !passwordActual || !passwordNueva || !passwordConfirm}
            className="mt-4 px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: guardando ? "rgba(255,255,255,0.05)" : "rgba(255,79,216,0.2)",
              border: "1px solid rgba(255,79,216,0.3)",
              color: "var(--neon-pink)",
              opacity: guardando || !passwordActual || !passwordNueva || !passwordConfirm ? 0.5 : 1,
              cursor: guardando || !passwordActual || !passwordNueva || !passwordConfirm ? "not-allowed" : "pointer",
            }}
          >
            <Lock size={16} /> {guardando ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </div>
      )}

      {/* Sección: Pedir Contenido */}
      {seccionActiva === "pedir" && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Pedir Contenido</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            ¿No encontraste algo que quieres? Cuéntanos y lo agregaremos si es posible.
          </p>

          <textarea
            value={solicitudContenido}
            onChange={(e) => setSolicitudContenido(e.target.value)}
            placeholder="Ej: La serie 'Breaking Bad' en 1080p..."
            maxLength={500}
            className="w-full px-3 py-2 rounded-lg bg-transparent border text-sm resize-none"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
            rows={4}
          />
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{solicitudContenido.length}/500</p>

          <button
            className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: "rgba(139,92,246,0.2)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "var(--neon-violet)",
              opacity: solicitudContenido.trim().length === 0 ? 0.5 : 1,
              cursor: solicitudContenido.trim().length === 0 ? "not-allowed" : "pointer",
            }}
          >
            <MessageSquare size={16} /> Enviar solicitud
          </button>
        </div>
      )}

      {/* Sección: Favoritos */}
      {seccionActiva === "favoritos" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Mis Favoritos</h3>

          {favoritos.length === 0 ? (
            <div className="px-6 py-12 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ color: "var(--text-muted)" }}>Todavía no tienes favoritos.</p>
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Toca el ♥ en cualquier título para guardarlo aquí.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {favoritos.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
