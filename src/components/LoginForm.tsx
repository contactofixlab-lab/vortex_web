"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { iniciarSesion, registrarUsuario } from "@/app/actions";

type Tab = "login" | "registro";

export default function LoginForm() {
  const router = useRouter();
  const [tab, setTab]             = useState<Tab>("login");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [nombre, setNombre]       = useState("");
  const [telefono, setTelefono]   = useState("");
  const [pais, setPais]           = useState("");
  const [error, setError]         = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = tab === "login"
      ? await iniciarSesion(email, password)
      : await registrarUsuario(nombre, email, password, telefono, pais);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    /* ── Fondo con imagen estática ── */
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image src="/fondo login.png" alt="Login background" fill style={{ objectFit: "cover" }} priority />
      </div>

      {/* Grid sutil de fondo */}
      <div
        className="login-grid absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,184,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,184,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Línea de scan */}
      <div
        className="scan-line absolute left-0 right-0 h-px pointer-events-none z-[2]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,184,255,0.3), transparent)" }}
      />

      {/* ── Card de login ── */}
      <div
        className="relative z-20 w-full max-w-md mx-4"
        style={{
          background: "rgba(10,10,20,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0,184,255,0.2)",
          borderTopColor: "rgba(0,184,255,0.35)",
          borderRadius: "1.75rem",
          boxShadow: "var(--shadow-glass-lg), 0 0 60px rgba(0,184,255,0.08), 0 0 0 1px rgba(139,92,246,0.08) inset",
        }}
      >
        {/* Borde superior neon */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,184,255,0.6), rgba(139,92,246,0.6), transparent)" }}
        />

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <h1
                className="login-logo text-4xl font-black tracking-widest inline-block"
                style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
              >
                VORTEX
              </h1>
            </Link>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              {tab === "login" ? "Bienvenido de vuelta" : "Únete a la comunidad"}
            </p>
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-8"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-glass)" }}
          >
            {(["login", "registro"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(null); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300"
                style={{
                  fontFamily: "var(--font-orbitron)",
                  background: tab === t ? "rgba(255,212,71,0.12)" : "transparent",
                  color: tab === t ? "var(--neon-yellow)" : "var(--text-muted)",
                  boxShadow: tab === t ? "0 0 12px rgba(255,212,71,0.2)" : "none",
                  border: tab === t ? "1px solid rgba(255,212,71,0.3)" : "1px solid transparent",
                }}
              >
                {t === "login" ? "Ingresar" : "Registrarse"}
              </button>
            ))}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Nombre (solo en registro) */}
            {tab === "registro" && (
              <>
                <InputField
                  icon={<User size={16} />}
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={setNombre}
                />
                <InputField
                  icon={<User size={16} />}
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={telefono}
                  onChange={setTelefono}
                />
                <InputField
                  icon={<User size={16} />}
                  type="text"
                  placeholder="País"
                  value={pais}
                  onChange={setPais}
                />
              </>
            )}

            {/* Email */}
            <InputField
              icon={<Mail size={16} />}
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={setEmail}
            />

            {/* Contraseña */}
            <div className="relative">
              <InputField
                icon={<Lock size={16} />}
                type={showPass ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={setPassword}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs"
                style={{ background: "rgba(255,79,216,0.1)", border: "1px solid rgba(255,79,216,0.3)", color: "var(--neon-pink)" }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Olvidé contraseña (solo login) */}
            {tab === "login" && (
              <div className="text-right -mt-1">
                <button type="button" className="text-xs transition-colors hover:underline"
                  style={{ color: "var(--neon-violet)" }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative mt-2 w-full py-3 rounded-xl font-bold tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden group"
              style={{
                fontFamily: "var(--font-orbitron)",
                background: "linear-gradient(135deg, rgba(255,212,71,0.22), rgba(139,92,246,0.12))",
                color: "var(--neon-yellow)",
                border: "1px solid rgba(255,212,71,0.45)",
                boxShadow: "0 0 20px rgba(255,212,71,0.18)",
              }}
            >
              {/* Hover overlay */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, rgba(255,212,71,0.12), rgba(139,92,246,0.08))" }}
              />

              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {tab === "login" ? "Ingresar" : "Crear cuenta"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "var(--border-glass)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>o continúa sin cuenta</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-glass)" }} />
          </div>

          {/* Volver al inicio */}
          <div className="text-center">
            <Link
              href="/"
              className="text-sm transition-colors hover:underline"
              style={{ color: "var(--text-secondary)" }}
            >
              ← Explorar sin iniciar sesión
            </Link>
          </div>
        </div>

        {/* Borde inferior neon */}
        <div
          className="absolute bottom-0 left-8 right-8 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(0,184,255,0.4), transparent)" }}
        />
      </div>
    </div>
  );
}

/* Input reutilizable con icono y glow al foco */
function InputField({
  icon, type, placeholder, value, onChange,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "rgba(0,184,255,0.5)" : "var(--border-glass)"}`,
        boxShadow: focused
          ? "0 0 16px rgba(0,184,255,0.12), 0 1px 3px rgba(0,0,0,0.3) inset"
          : "0 1px 3px rgba(0,0,0,0.3) inset",
      }}
    >
      <span style={{ color: focused ? "var(--neon-cyan)" : "var(--text-muted)", transition: "color 0.2s" }}>
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: "var(--text-primary)", caretColor: "var(--neon-cyan)" }}
      />
    </div>
  );
}
