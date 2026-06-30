"use client";

import { useState } from "react";
import { Mail, Send, AlertCircle, Check } from "lucide-react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setMensaje(null);

    try {
      // Simulación de envío (en producción conectar con API de email)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMensaje({
        tipo: "exito",
        texto: "¡Mensaje enviado! Nos pondremos en contacto pronto.",
      });

      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: "Error al enviar el mensaje. Intenta de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className="text-5xl font-black mb-4 tracking-widest"
            style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
          >
            CONTACTO
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Nos encantaría escuchar de ti. Completa el formulario y nos pondremos en contacto.
          </p>
        </div>

        {/* Formulario */}
        <div
          className="glass-card rounded-2xl p-8"
          style={{
            border: "1px solid rgba(0,184,255,0.2)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label
                className="block text-sm font-bold mb-2 tracking-wide"
                style={{ color: "var(--neon-cyan)" }}
              >
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-transparent border outline-none transition-all"
                style={{
                  borderColor: "rgba(0,184,255,0.3)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,184,255,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,184,255,0.3)")}
                placeholder="Tu nombre"
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-bold mb-2 tracking-wide"
                style={{ color: "var(--neon-cyan)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-transparent border outline-none transition-all"
                style={{
                  borderColor: "rgba(0,184,255,0.3)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,184,255,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,184,255,0.3)")}
                placeholder="tu@email.com"
              />
            </div>

            {/* Asunto */}
            <div>
              <label
                className="block text-sm font-bold mb-2 tracking-wide"
                style={{ color: "var(--neon-cyan)" }}
              >
                Asunto
              </label>
              <input
                type="text"
                value={formData.asunto}
                onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-transparent border outline-none transition-all"
                style={{
                  borderColor: "rgba(0,184,255,0.3)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,184,255,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,184,255,0.3)")}
                placeholder="Asunto del mensaje"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label
                className="block text-sm font-bold mb-2 tracking-wide"
                style={{ color: "var(--neon-cyan)" }}
              >
                Mensaje
              </label>
              <textarea
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-transparent border outline-none transition-all resize-none"
                style={{
                  borderColor: "rgba(0,184,255,0.3)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,184,255,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,184,255,0.3)")}
                placeholder="Tu mensaje..."
              />
            </div>

            {/* Mensaje de estado */}
            {mensaje && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                style={{
                  background: mensaje.tipo === "exito" ? "rgba(0,255,0,0.1)" : "rgba(255,79,216,0.1)",
                  border: `1px solid ${mensaje.tipo === "exito" ? "rgba(0,255,0,0.3)" : "rgba(255,79,216,0.3)"}`,
                  color: mensaje.tipo === "exito" ? "#00ff00" : "var(--neon-pink)",
                }}
              >
                {mensaje.tipo === "exito" ? (
                  <Check size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {mensaje.texto}
              </div>
            )}

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={enviando}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-widest transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(0,184,255,0.3), rgba(139,92,246,0.2))",
                color: "var(--neon-cyan)",
                border: "1px solid rgba(0,184,255,0.4)",
              }}
            >
              {enviando ? (
                <>
                  <div className="w-4 h-4 border-2 border-transparent border-t-cyan-500 rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Enviar mensaje
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info adicional */}
        <div className="mt-12 text-center space-y-4">
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            También puedes contactarnos por:
          </h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="https://t.me/vortex_descargas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-all hover:scale-110"
              style={{ color: "#0088cc" }}
            >
              📱 Telegram
            </a>
            <a
              href="https://instagram.com/vortex_descargas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-all hover:scale-110"
              style={{ color: "#d9238e" }}
            >
              📸 Instagram
            </a>
            <a
              href="mailto:soporte@vortex.com"
              className="text-sm transition-all hover:scale-110"
              style={{ color: "var(--neon-cyan)" }}
            >
              ✉️ soporte@vortex.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
