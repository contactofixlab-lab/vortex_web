import { Users, Zap, Shield, Globe, Calendar, ArrowRight } from "lucide-react";
import { getEstadisticas } from "@/lib/estadisticas";
import NosotrosTabs from "@/components/NosotrosTabs";
import Link from "next/link";

const VALORES = [
  {
    icon: Zap,
    titulo: "Velocidad",
    descripcion: "Descargas ultra rápidas desde múltiples servidores premium. Tu tiempo es valioso.",
    emoji: "⚡",
  },
  {
    icon: Shield,
    titulo: "Seguridad",
    descripcion: "Plataforma 100% segura con servidores confiables. Descarga sin preocupaciones.",
    emoji: "🔒",
  },
  {
    icon: Users,
    titulo: "Comunidad",
    descripcion: "Una comunidad global de amantes del anime, series y películas. Interactúa con fans.",
    emoji: "👥",
  },
  {
    icon: Globe,
    titulo: "Accesibilidad",
    descripcion: "Disponible en español y accesible desde cualquier dispositivo. Para todos.",
    emoji: "🌍",
  },
];

const PASOS = [
  {
    numero: 1,
    titulo: "Busca tu contenido",
    descripcion: "Usa la barra de búsqueda o navega por categorías (Anime, Series, Películas) para encontrar el contenido que deseas.",
    imagen: "/paso-1-busca.svg",
  },
  {
    numero: 2,
    titulo: "Abre la ficha del contenido",
    descripcion: "Haz clic en la portada del anime, serie o película para ver todos los detalles, episodios y opciones de descarga.",
    imagen: "/paso-2-ficha.svg",
  },
  {
    numero: 3,
    titulo: "Selecciona el episodio",
    descripcion: "Elige el episodio o película que deseas descargar. Verás la lista de servidores disponibles para ese contenido.",
    imagen: "/paso-3-episodio.svg",
  },
  {
    numero: 4,
    titulo: "Elige tu servidor",
    descripcion: "Selecciona uno de los servidores disponibles (OneDrive, Google Drive, Mega). Haz clic en el enlace para descargar.",
    imagen: "/paso-4-servidor.svg",
  },
  {
    numero: 5,
    titulo: "Descarga completada",
    descripcion: "¡Listo! Tu archivo comenzará a descargar. Abre tu gestor de descargas para ver el progreso y la ubicación del archivo.",
    imagen: "/paso-5-descarga.svg",
  },
];

const BLOG_POSTS = [
  {
    slug: "top-10-anime-2024",
    titulo: "Top 10 Mejores Anime de 2024",
    fecha: "2024-12-20",
    categoria: "Anime",
    resumen: "Descubre los anime más épicos y emocionantes que se lanzaron en 2024. Desde shounen explosivos hasta historias emocionales que te dejarán sin palabras.",
    imagen: "🔥",
    color: "var(--neon-violet)",
  },
  {
    slug: "series-que-debes-ver",
    titulo: "Series Imprescindibles para Principiantes",
    fecha: "2024-12-15",
    categoria: "Series",
    resumen: "No sabes por dónde empezar? Aquí te dejamos las mejores series para introducirte en este universo. Guía completa para nuevos fans.",
    imagen: "📺",
    color: "var(--neon-cyan)",
  },
  {
    slug: "peliculas-anime-recomendadas",
    titulo: "Películas de Anime que Debes Ver Sí o Sí",
    fecha: "2024-12-10",
    categoria: "Películas",
    resumen: "Las mejores películas de anime de todos los tiempos. Desde clásicos hasta estrenos recientes que redefinirán tu perspectiva del cine animado.",
    imagen: "🎬",
    color: "var(--neon-pink)",
  },
  {
    slug: "como-descargar-seguro",
    titulo: "Guía: Cómo Descargar Seguro desde Vortex",
    fecha: "2024-12-05",
    categoria: "Tutorial",
    resumen: "Aprende a descargar tus contenidos favoritos de forma segura y rápida desde nuestra plataforma. Paso a paso, sin complicaciones.",
    imagen: "⚡",
    color: "var(--neon-yellow)",
  },
  {
    slug: "studio-ghibli-masterclass",
    titulo: "Análisis: El Legado de Studio Ghibli",
    fecha: "2024-11-28",
    categoria: "Análisis",
    resumen: "Descubre por qué Studio Ghibli es considerado el mejor estudio de animación del mundo. Un viaje por sus obras maestras.",
    imagen: "✨",
    color: "var(--neon-green)",
  },
  {
    slug: "tendencias-anime-2025",
    titulo: "Tendencias de Anime que Veremos en 2025",
    fecha: "2024-11-20",
    categoria: "Tendencias",
    resumen: "¿Qué esperar en el mundo del anime en 2025? Aquí las predicciones de nuestros expertos basadas en tendencias actuales.",
    imagen: "🚀",
    color: "var(--neon-violet)",
  },
];

export default async function NosotrosPage() {
  const stats = await getEstadisticas();

  const estadisticas = [
    { numero: `${(stats.usuariosActivos / 1000).toFixed(0)}K+`, label: "Usuarios activos" },
    { numero: `${(stats.titulosDisponibles / 1000).toFixed(0)}K+`, label: "Títulos disponibles" },
    { numero: `${stats.uptimeGarantizado}%`, label: "Uptime garantizado" },
    { numero: stats.soporteDisponible, label: "Soporte disponible" },
  ];

  const quienesSomos = (
    <>
      {/* Sección Hero */}
      <div
        className="glass-card rounded-2xl p-12 mb-16"
        style={{
          background: "linear-gradient(135deg, rgba(0,184,255,0.1), rgba(139,92,246,0.05))",
          border: "1px solid rgba(0,184,255,0.2)",
        }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <h2
              className="text-3xl font-black mb-6 tracking-wide"
              style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
            >
              ¿Quiénes somos?
            </h2>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Vortex nació en 2024 con una misión simple pero ambiciosa: crear la plataforma de descargas más rápida, segura y fácil de usar para anime, series y películas en español.
            </p>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Somos un equipo de desarrolladores y diseñadores apasionados por el cine y la animación. Creemos que todo fan merece acceso fácil a su contenido favorito.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Hoy, miles de usuarios confían en Vortex para sus descargas diarias. Y eso nos motiva a mejorar cada día.
            </p>
          </div>

          {/* Imagen/Emoji */}
          <div
            className="flex items-center justify-center text-9xl h-64 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(0,184,255,0.1), rgba(139,92,246,0.1))",
              border: "2px solid rgba(0,184,255,0.2)",
            }}
          >
            🚀
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        {estadisticas.map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-6 text-center transition-all hover:scale-105"
            style={{
              border: "1px solid rgba(0,184,255,0.2)",
            }}
          >
            <div
              className="text-3xl font-black mb-2"
              style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
            >
              {stat.numero}
            </div>
            <p style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Nota de actualización */}
      <div
        className="text-center mb-8 text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        📊 Datos actualizados en tiempo real desde la consola admin
      </div>

      {/* Valores */}
      <div className="mb-16">
        <h2
          className="text-3xl font-black mb-12 text-center tracking-wide"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
        >
          Nuestros Valores
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {VALORES.map((valor) => (
            <div
              key={valor.titulo}
              className="glass-card rounded-2xl p-8 flex gap-6"
              style={{
                border: "1px solid rgba(0,184,255,0.2)",
              }}
            >
              <div className="text-5xl flex-shrink-0">{valor.emoji}</div>
              <div>
                <h3
                  className="text-xl font-bold mb-2 tracking-wide"
                  style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
                >
                  {valor.titulo}
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>{valor.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Misión */}
      <div
        className="glass-card rounded-2xl p-12"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,184,255,0.05))",
          border: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        <h2
          className="text-3xl font-black mb-6 tracking-wide text-center"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-violet)" }}
        >
          Nuestra Misión
        </h2>
        <p
          className="text-center text-lg leading-relaxed"
          style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}
        >
          Ser la plataforma de descargas más confiable, rápida y segura del mundo hispanohablante.
          Queremos que cada usuario disfrute de su contenido favorito sin limitaciones, con la mejor
          calidad posible y sin complicaciones técnicas.
        </p>
      </div>

      {/* Contacto */}
      <div
        className="text-center mt-16 p-8 rounded-2xl"
        style={{
          background: "rgba(0,184,255,0.05)",
          border: "1px solid rgba(0,184,255,0.2)",
        }}
      >
        <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)", fontFamily: "var(--font-orbitron)" }}>
          ¿Quieres contactarnos?
        </h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Síguenos en redes sociales o usa nuestro formulario de contacto
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="https://t.me/vortex_descargas"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-lg font-bold transition-all hover:scale-105"
            style={{
              background: "rgba(0,136,204,0.2)",
              border: "1px solid rgba(0,136,204,0.4)",
              color: "#0088cc",
            }}
          >
            📱 Telegram
          </a>
          <a
            href="https://instagram.com/vortex_descargas"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-lg font-bold transition-all hover:scale-105"
            style={{
              background: "rgba(217,35,126,0.2)",
              border: "1px solid rgba(217,35,126,0.4)",
              color: "#d9238e",
            }}
          >
            📸 Instagram
          </a>
          <a
            href="/contacto"
            className="px-6 py-2 rounded-lg font-bold transition-all hover:scale-105"
            style={{
              background: "rgba(255,212,71,0.2)",
              border: "1px solid rgba(255,212,71,0.4)",
              color: "var(--neon-yellow)",
            }}
          >
            ✉️ Formulario
          </a>
        </div>
      </div>
    </>
  );

  const comoDescargar = (
    <>
      {/* Timeline de Pasos */}
      <div className="space-y-8 mb-16">
        {PASOS.map((paso, idx) => (
          <div key={paso.numero} className="flex gap-6">
            {/* Círculo numerado */}
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black"
                style={{
                  background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))",
                  color: "var(--bg-base)",
                }}
              >
                {paso.numero}
              </div>
              {idx < PASOS.length - 1 && (
                <div
                  className="w-1 h-20 mt-2"
                  style={{ background: "linear-gradient(180deg, var(--neon-cyan)55, transparent)" }}
                />
              )}
            </div>

            {/* Contenido */}
            <div className="flex-1 pt-2 pb-8">
              <div
                className="glass-card rounded-2xl p-8"
                style={{
                  border: "1px solid rgba(0,184,255,0.2)",
                }}
              >
                <h2
                  className="text-2xl font-bold tracking-wide mb-4"
                  style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
                >
                  {paso.titulo}
                </h2>

                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)", marginLeft: "64px" }}
                >
                  {paso.descripcion}
                </p>

                {/* Imagen SVG */}
                <img
                  src={paso.imagen}
                  alt={paso.titulo}
                  className="mt-6 rounded-lg w-full"
                  style={{
                    marginLeft: "64px",
                    background: "rgba(0,184,255,0.05)",
                    border: "1px solid rgba(0,184,255,0.2)",
                    maxWidth: "500px",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Consejos */}
      <div
        className="glass-card rounded-2xl p-8"
        style={{
          background: "linear-gradient(135deg, rgba(0,184,255,0.1), rgba(139,92,246,0.05))",
          border: "1px solid rgba(0,184,255,0.2)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-6 tracking-wide"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
        >
          💡 Consejos Útiles
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              ✨ Velocidad de descarga
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              La velocidad depende del servidor elegido y tu conexión. Mega y OneDrive generalmente ofrecen las mejores velocidades.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              🔒 Seguridad garantizada
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Todos nuestros servidores son seguros y confiables. Descarga sin preocupaciones desde plataformas líderes.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              📱 Compatible con todo
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Descarga en tu PC, mobile o tablet. Los archivos funcionan en cualquier dispositivo con reproductor de video.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              🎬 Calidad HD
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Todos nuestros contenidos están disponibles en calidad HD o superior para la mejor experiencia de visualización.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const blog = (
    <>
      <div className="space-y-8">
        {BLOG_POSTS.map((post, idx) => (
          <div
            key={post.slug}
            className={`glass-card rounded-2xl overflow-hidden transition-all hover:scale-[1.02] flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            style={{
              border: `1px solid ${post.color}33`,
            }}
          >
            {/* Imagen / Emoji */}
            <div
              className="w-full md:w-48 h-48 flex-shrink-0 flex items-center justify-center text-7xl"
              style={{
                background: `linear-gradient(135deg, ${post.color}22, ${post.color}11)`,
                borderRight: idx % 2 === 0 ? `2px solid ${post.color}33` : "none",
                borderLeft: idx % 2 === 1 ? `2px solid ${post.color}33` : "none",
              }}
            >
              {post.imagen}
            </div>

            {/* Contenido */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              {/* Categoría */}
              <div>
                <div
                  className="inline-block text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-3"
                  style={{
                    background: `${post.color}22`,
                    color: post.color,
                    border: `1px solid ${post.color}44`,
                  }}
                >
                  {post.categoria}
                </div>

                {/* Título */}
                <h2
                  className="text-2xl md:text-3xl font-black mb-4 tracking-wide"
                  style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}
                >
                  {post.titulo}
                </h2>

                {/* Resumen */}
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {post.resumen}
                </p>
              </div>

              {/* Footer con fecha y botón */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                  <Calendar size={14} />
                  {new Date(post.fecha).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {/* Botón Ver Más */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all hover:gap-3"
                  style={{
                    background: `${post.color}22`,
                    color: post.color,
                    border: `1px solid ${post.color}44`,
                  }}
                >
                  Ver más
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="text-center mt-16 p-8 rounded-2xl"
        style={{
          background: "rgba(0,184,255,0.05)",
          border: "1px solid rgba(0,184,255,0.2)",
        }}
      >
        <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "var(--font-orbitron)" }}>
          ¿Tienes una sugerencia de tema?
        </h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Nos encantaría escribir sobre el tema que te interesa. Contáctanos en nuestras redes.
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className="text-5xl font-black mb-4 tracking-widest"
            style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
          >
            NOSOTROS
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
            Conoce la historia detrás de Vortex, aprende a usar la plataforma y lee nuestras últimas publicaciones.
          </p>
        </div>

        <NosotrosTabs
          tabs={[
            { id: "quienes-somos", label: "Quiénes somos", icon: "🚀" },
            { id: "descargar", label: "Cómo Descargar", icon: "⬇️" },
            { id: "blog", label: "Blog", icon: "📝" },
          ]}
        >
          {[quienesSomos, comoDescargar, blog]}
        </NosotrosTabs>
      </div>
    </div>
  );
}
