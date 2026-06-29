import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    slug: "top-10-anime-2024",
    titulo: "Top 10 Mejores Anime de 2024",
    fecha: "2024-12-20",
    categoria: "Anime",
    resumen: "Descubre los anime más épicos y emocionantes que se lanzaron en 2024. Desde shounen explosivos hasta historias emocionales.",
    color: "var(--neon-violet)",
  },
  {
    slug: "series-que-debes-ver",
    titulo: "Series Imprescindibles para Principiantes",
    fecha: "2024-12-15",
    categoria: "Series",
    resumen: "No sabes por dónde empezar? Aquí te dejamos las mejores series para introducirte en este universo.",
    color: "var(--neon-cyan)",
  },
  {
    slug: "peliculas-anime-recomendadas",
    titulo: "Películas de Anime que Debes Ver Sí o Sí",
    fecha: "2024-12-10",
    categoria: "Películas",
    resumen: "Las mejores películas de anime de todos los tiempos. Desde clásicos hasta estrenos recientes.",
    color: "var(--neon-pink)",
  },
  {
    slug: "como-descargar-seguro",
    titulo: "Guía: Cómo Descargar Seguro desde Vortex",
    fecha: "2024-12-05",
    categoria: "Tutorial",
    resumen: "Aprende a descargar tus contenidos favoritos de forma segura y rápida desde nuestra plataforma.",
    color: "var(--neon-yellow)",
  },
  {
    slug: "studio-ghibli-masterclass",
    titulo: "Análisis: El Legado de Studio Ghibli",
    fecha: "2024-11-28",
    categoria: "Análisis",
    resumen: "Descubre por qué Studio Ghibli es considerado el mejor estudio de animación del mundo.",
    color: "var(--neon-green)",
  },
  {
    slug: "tendencias-anime-2025",
    titulo: "Tendencias de Anime que Veremos en 2025",
    fecha: "2024-11-20",
    categoria: "Tendencias",
    resumen: "¿Qué esperar en el mundo del anime en 2025? Aquí las predicciones de nuestros expertos.",
    color: "var(--neon-violet)",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className="text-5xl font-black mb-4 tracking-widest"
            style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
          >
            BLOG
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
            Artículos, análisis y recomendaciones sobre anime, series y películas.
          </p>
        </div>

        {/* Grid de Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group glass-card rounded-2xl overflow-hidden transition-all hover:scale-105"
            >
              <div
                className="h-32 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${post.color}22, ${post.color}11)`,
                  borderBottom: `2px solid ${post.color}`,
                }}
              />

              <div className="p-6">
                {/* Categoría */}
                <div
                  className="inline-block text-xs font-bold tracking-widest px-2.5 py-1 rounded mb-3"
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
                  className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {post.titulo}
                </h2>

                {/* Resumen */}
                <p
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {post.resumen}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Calendar size={12} />
                    {new Date(post.fecha).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <ArrowRight size={14} style={{ color: post.color }} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-12 p-8 rounded-2xl"
          style={{
            background: "rgba(0,184,255,0.05)",
            border: "1px solid rgba(0,184,255,0.2)",
          }}
        >
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            ¿Tienes una sugerencia de tema?
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Nos encantaría escribir sobre el tema que te interesa. Contáctanos en nuestras redes.
          </p>
        </div>
      </div>
    </div>
  );
}
