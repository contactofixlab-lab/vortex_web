"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { actualizarPerfil, cambiarPassword } from "@/app/actions";
import { Heart, Save, X, Eye, EyeOff, Lock, Mail, User, Phone, Globe, MessageSquare, Send, AlertCircle, Check } from "lucide-react";
import ContentCard from "./ContentCard";
import CustomSelect from "./CustomSelect";
import NarutoAnimation from "./NarutoAnimation";
import FireCharacter from "./FireCharacter";
import RageCharacter from "./RageCharacter";
import ReiatsuCharacter from "./ReiatsuCharacter";
import { Contenido } from "@/lib/contenido";

interface PerfilClientProps {
  notificaciones?: {
    comentarios: boolean;
    favoritos: boolean;
    seguidores: boolean;
    info: boolean;
  };
}

type Seccion = "info" | "social" | "preferencias" | "privacidad" | "notificaciones" | "seguridad" | "pedir";

const GENEROS = [
  "Acción", "Aventura", "Comedia", "Drama", "Fantasía", "Horror",
  "Misterio", "Romance", "Sci-Fi", "Thriller", "Historia", "Crimen",
  "Animación", "Deportes", "Slice of Life", "Sobrenatural", "Psicológico",
  "Mecha", "Musical", "Ecchi", "Isekai", "Shonen", "Seinen", "Shojo",
];
const IDIOMAS = ["Español", "Inglés", "Japonés", "Francés"];

export default function PerfilClient({ notificaciones }: PerfilClientProps) {
  const { usuario } = useAuth();
  const searchParams = useSearchParams();
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("info");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  useEffect(() => {
    const seccion = searchParams.get("seccion") as Seccion || "info";
    if (["info", "social", "preferencias", "privacidad", "notificaciones", "seguridad", "pedir"].includes(seccion)) {
      setSeccionActiva(seccion);
    }
  }, [searchParams]);

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
  const [solicitudTipo, setSolicitudTipo] = useState("");
  const [solicitudAsunto, setSolicitudAsunto] = useState("");
  const [solicitudContenido, setSolicitudContenido] = useState("");
  const [solicitudEnviando, setSolicitudEnviando] = useState(false);

  const TIPOS_SOLICITUD = [
    "🎌 Anime",
    "📺 Serie",
    "🎬 Película",
    "📝 Artículo Blog",
    "🐛 Reportar Bug",
    "💡 Sugerencia",
  ];

  const ASUNTOS_POR_TIPO: Record<string, string[]> = {
    "🎌 Anime": [
      "Solicitar nuevo anime",
      "Solicitar más episodios",
      "Falta de episodios",
      "Calidad de video",
      "Traducción incorrecta",
      "Falta de subtítulos",
      "Enlaces rotos",
      "Otro",
    ],
    "📺 Serie": [
      "Solicitar nueva serie",
      "Solicitar nueva temporada",
      "Falta de episodios",
      "Calidad de video",
      "Traducción incorrecta",
      "Falta de subtítulos",
      "Enlaces rotos",
      "Otro",
    ],
    "🎬 Película": [
      "Solicitar nueva película",
      "Calidad de video",
      "Traducción incorrecta",
      "Falta de subtítulos",
      "Enlaces rotos",
      "Otro",
    ],
    "📝 Artículo Blog": [
      "Sugerencia de tema",
      "Corrección de artículo existente",
      "Colaborar como autor",
      "Otro",
    ],
    "🐛 Reportar Bug": [
      "Problema de descarga",
      "Problema de reproducción",
      "Enlaces rotos",
      "Error en mi perfil o cuenta",
      "Problema técnico general",
      "Otro",
    ],
    "💡 Sugerencia": [
      "Mejor organización del catálogo",
      "Nueva sección o funcionalidad",
      "Mejora de diseño",
      "Sistema de notificaciones",
      "Otro",
    ],
  };

  const ASUNTOS_PREDEFINIDOS = ASUNTOS_POR_TIPO[solicitudTipo] ?? [];

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

  async function enviarSolicitud() {
    setSolicitudEnviando(true);
    setMensaje(null);

    try {
      // Simulación de envío (en producción conectar con API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMensaje({
        tipo: "exito",
        texto: "¡Solicitud enviada! Revisaremos tu pedido pronto.",
      });

      setSolicitudAsunto("");
      setSolicitudContenido("");
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: "Error al enviar la solicitud. Intenta de nuevo.",
      });
    } finally {
      setSolicitudEnviando(false);
    }
  }

  if (!usuario) return <div style={{ color: "var(--text-muted)" }}>Cargando...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

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
        <div className="flex items-center gap-6">
        <div
          className="flex-1 flex flex-col gap-6 p-8 rounded-3xl backdrop-blur-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(0,184,255,0.3), rgba(0,110,255,0.2))",
            border: "2px solid rgba(0,184,255,0.5)",
            boxShadow: "0 12px 48px rgba(0,184,255,0.25), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          <h3 className="text-2xl font-black tracking-wide" style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}>Información Básica</h3>

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

          {/* Ace (One Piece) animado - FUERA del recuadro */}
          <div className="hidden lg:flex items-center justify-center w-[360px] h-[470px] flex-shrink-0">
            <FireCharacter src="/one piece.png" alt="Ace" aspectW={250} aspectH={330} filterId="aceFire" />
          </div>
        </div>
      )}

      {/* Sección: Perfil Social */}
      {seccionActiva === "social" && (
        <div className="flex items-center gap-6">
        <div
          className="flex-1 flex flex-col gap-6 p-8 rounded-3xl backdrop-blur-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(180,60,255,0.2))",
            border: "2px solid rgba(139,92,246,0.5)",
            boxShadow: "0 12px 48px rgba(139,92,246,0.25), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          <h3 className="text-2xl font-black tracking-wide" style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-violet)" }}>Perfil Social</h3>

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

          {/* Natsu (Fairy Tail) animado - FUERA del recuadro */}
          <div className="hidden lg:flex items-center justify-center w-[360px] h-[470px] flex-shrink-0">
            <FireCharacter src="/fairy tail.png" alt="Natsu Dragneel" aspectW={235} aspectH={305} filterId="natsuFire" variant="dragon" />
          </div>
        </div>
      )}

      {/* Sección: Preferencias */}
      {seccionActiva === "preferencias" && (
        <div className="flex items-center gap-6">
        <div
          className="flex-1 flex flex-col gap-6 p-8 rounded-3xl backdrop-blur-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(255,140,20,0.3), rgba(255,212,71,0.2))",
            border: "2px solid rgba(255,140,20,0.5)",
            boxShadow: "0 12px 48px rgba(255,140,20,0.25), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          <h3 className="text-2xl font-black tracking-wide" style={{ fontFamily: "var(--font-orbitron)", color: "#ff8c1a" }}>Preferencias de Contenido</h3>

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

          {/* Goku (Super Saiyan God) animado - FUERA del recuadro */}
          <div className="hidden lg:flex items-center justify-center w-[360px] h-[470px] flex-shrink-0">
            <FireCharacter src="/goku.png" alt="Goku Super Saiyan God" aspectW={365} aspectH={580} filterId="gokuFire" variant="godpower" />
          </div>
        </div>
      )}

      {/* Sección: Privacidad */}
      {seccionActiva === "privacidad" && (
        <div className="flex items-center gap-6">
        <div
          className="flex-1 flex flex-col gap-6 p-8 rounded-3xl backdrop-blur-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(57,255,20,0.25), rgba(0,200,140,0.2))",
            border: "2px solid rgba(57,255,20,0.5)",
            boxShadow: "0 12px 48px rgba(57,255,20,0.2), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          <h3 className="text-2xl font-black tracking-wide" style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-green)" }}>Privacidad y Notificaciones</h3>

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

          {/* Ichigo (presión espiritual) animado - FUERA del recuadro */}
          <div className="hidden lg:flex items-center justify-center w-[330px] h-[460px] flex-shrink-0">
            <ReiatsuCharacter src="/ichigo.png" alt="Ichigo Kurosaki" aspectW={195} aspectH={305} bandagePos={{ x: 14, y: 6, height: 48 }} />
          </div>
        </div>
      )}

      {/* Sección: Notificaciones */}
      {seccionActiva === "notificaciones" && (
        <div className="flex items-center gap-6">
        <div
          className="flex-1 flex flex-col gap-6 p-8 rounded-3xl backdrop-blur-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(255,70,60,0.3), rgba(255,120,30,0.2))",
            border: "2px solid rgba(255,70,60,0.5)",
            boxShadow: "0 12px 48px rgba(255,70,60,0.25), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          <h3 className="text-2xl font-black tracking-wide" style={{ fontFamily: "var(--font-orbitron)", color: "#ff4d4d" }}>Tipos de Notificaciones</h3>
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

          {/* Gon (rabia contenida) animado - FUERA del recuadro */}
          <div className="hidden lg:flex items-center justify-center w-[408px] h-[324px] flex-shrink-0">
            <RageCharacter src="/gon.png" alt="Gon Freecss" aspectW={436} aspectH={346} />
          </div>
        </div>
      )}

      {/* Sección: Seguridad */}
      {seccionActiva === "seguridad" && (
        <div className="flex items-center gap-6">
        <div
          className="flex-1 flex flex-col gap-6 p-8 rounded-3xl backdrop-blur-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(255,79,216,0.3), rgba(160,20,120,0.25))",
            border: "2px solid rgba(255,79,216,0.5)",
            boxShadow: "0 12px 48px rgba(255,79,216,0.25), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          <h3 className="text-2xl font-black tracking-wide" style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-pink)" }}>Cambiar Contraseña</h3>

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

          {/* Ao no Exorcist (Rin + Yukio) animado - FUERA del recuadro */}
          <div className="hidden lg:flex items-center justify-center w-[340px] h-[440px] flex-shrink-0">
            <FireCharacter
              src="/a no exorcist.png"
              alt="Ao no Exorcist - Rin y Yukio Okumura"
              aspectW={230}
              aspectH={300}
              filterId="exorcistFire"
              variant="exorcist"
              gunPos={{ x: 32, y: 68 }}
              swordStart={{ x: 18, y: 56 }}
              swordEnd={{ x: 50, y: 8 }}
            />
          </div>
        </div>
      )}

      {/* Sección: Pedir Contenido */}
      {seccionActiva === "pedir" && (
        <div className="flex items-center gap-6">
          {/* Formulario - Lado Izquierdo (con su recuadro glass) */}
          <div
            className="flex-1 flex flex-col gap-6 p-8 rounded-3xl backdrop-blur-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(0,184,255,0.3), rgba(139,92,246,0.25))",
              border: "2px solid rgba(0,184,255,0.5)",
              boxShadow: "0 12px 48px rgba(0,184,255,0.25), inset 0 1px 2px rgba(255,255,255,0.3)",
            }}
          >
          <div>
            <h3 className="text-2xl font-black tracking-wide" style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}>
              Pedir Contenido
            </h3>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              ¿No encontraste algo que quieres? Cuéntanos los detalles.
            </p>
          </div>

          {/* Tipo de solicitud */}
          <CustomSelect
            value={solicitudTipo}
            onChange={(v) => {
              setSolicitudTipo(v);
              setSolicitudAsunto("");
            }}
            options={TIPOS_SOLICITUD}
            label="Tipo"
            placeholder="📌 Selecciona un tipo..."
            color="cyan"
          />

          {/* Asunto - depende del Tipo seleccionado */}
          <CustomSelect
            value={solicitudAsunto}
            onChange={setSolicitudAsunto}
            options={ASUNTOS_PREDEFINIDOS}
            label="Asunto"
            placeholder={solicitudTipo ? "📋 Selecciona un asunto..." : "⬆️ Primero elige un tipo"}
            color="violet"
          />

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--neon-cyan)" }}>Descripción</label>
            <textarea
              value={solicitudContenido}
              onChange={(e) => setSolicitudContenido(e.target.value)}
              placeholder="Cuéntanos más detalles: título, año, calidad deseada, etc..."
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl backdrop-blur-sm outline-none transition-all text-sm resize-none"
              style={{
                background: "rgba(255,212,71,0.08)",
                border: "1.5px solid rgba(255,212,71,0.3)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(255,212,71,0.15)";
                e.target.style.borderColor = "rgba(255,212,71,0.6)";
                e.target.style.boxShadow = "0 0 12px rgba(255,212,71,0.3)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(255,212,71,0.08)";
                e.target.style.borderColor = "rgba(255,212,71,0.3)";
                e.target.style.boxShadow = "none";
              }}
              rows={4}
            />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{solicitudContenido.length}/500</p>
          </div>

            {/* Botón enviar */}
            <button
              onClick={enviarSolicitud}
              disabled={solicitudEnviando || !solicitudAsunto.trim() || !solicitudContenido.trim()}
              className="px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all tracking-wide"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,0,0.2), rgba(0,255,0,0.1))",
                border: "1.5px solid rgba(0,255,0,0.4)",
                color: "#00ff00",
                boxShadow: "0 0 20px rgba(0,255,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)",
                opacity: solicitudEnviando || !solicitudAsunto.trim() || !solicitudContenido.trim() ? 0.5 : 1,
                cursor: solicitudEnviando || !solicitudAsunto.trim() || !solicitudContenido.trim() ? "not-allowed" : "pointer",
              }}
            >
              {solicitudEnviando ? (
                <>
                  <div className="w-4 h-4 border-2 border-transparent border-t-green-400 rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} /> Enviar solicitud
                </>
              )}
            </button>
          </div>

          {/* Naruto Animation - FUERA del recuadro del formulario */}
          <div className="hidden lg:flex items-center justify-center w-[420px] h-[585px] flex-shrink-0">
            <NarutoAnimation />
          </div>
        </div>
      )}

    </div>
  );
}
