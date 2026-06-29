import Link from "next/link";
import { Check, X } from "lucide-react";
import { getSesion } from "@/lib/auth";
import { esPremium } from "@/lib/mercado-pago";

const PLANES = [
  {
    nombre: "FREE",
    precio: "Gratis",
    descripcion: "Perfecto para comenzar",
    color: "var(--neon-cyan)",
    features: [
      { name: "20 descargas/día", included: true },
      { name: "Chat (2 conversaciones)", included: true },
      { name: "10 gifts predeterminados", included: true },
      { name: "Descargas ilimitadas", included: false },
      { name: "Chat ilimitado", included: false },
      { name: "Todos los gifts", included: false },
    ],
    boton: { texto: "Plan Actual", href: "#", disabled: true },
  },
  {
    nombre: "PREMIUM",
    precio: "$2.990",
    descripcion: "La experiencia completa",
    color: "var(--neon-yellow)",
    features: [
      { name: "20 descargas/día", included: true },
      { name: "Chat (2 conversaciones)", included: true },
      { name: "10 gifts predeterminados", included: true },
      { name: "Descargas ilimitadas", included: true },
      { name: "Chat ilimitado", included: true },
      { name: "Todos los gifts", included: true },
    ],
    boton: { texto: "Mejorar Ahora", href: "/checkout", disabled: false },
  },
];

export default async function PlanesPage() {
  const usuario = await getSesion();
  const premium = usuario ? await esPremium(usuario.id) : false;

  return (
    <div className="min-h-screen flex flex-col gap-12 py-12 px-4">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1
          className="text-5xl font-black mb-4 tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
        >
          PLANES
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Elige el plan que mejor se adapte a ti. Cambia cuando quieras.
        </p>
      </div>

      {/* Cards de Planes */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 w-full">
        {PLANES.map((plan) => {
          const esPlanActual = (plan.nombre === "FREE" && !premium) || (plan.nombre === "PREMIUM" && premium);

          return (
            <div
              key={plan.nombre}
              className="relative rounded-2xl p-8 transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(10,10,20,0.6)",
                backdropFilter: "blur(20px)",
                border: `2px solid ${plan.color}`,
                boxShadow: `0 0 30px ${plan.color}33, 0 0 60px ${plan.color}22`,
              }}
            >
              {/* Badge Premium */}
              {plan.nombre === "PREMIUM" && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider"
                  style={{
                    background: `linear-gradient(135deg, ${plan.color}44, ${plan.color}22)`,
                    color: plan.color,
                    border: `1px solid ${plan.color}`,
                  }}
                >
                  MÁS POPULAR
                </div>
              )}

              {/* Nombre */}
              <h2
                className="text-3xl font-black mb-2 tracking-widest"
                style={{ fontFamily: "var(--font-orbitron)", color: plan.color }}
              >
                {plan.nombre}
              </h2>

              {/* Descripción */}
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                {plan.descripcion}
              </p>

              {/* Precio */}
              <div className="mb-8">
                <div className="text-4xl font-black" style={{ color: plan.color }}>
                  {plan.precio}
                </div>
                {plan.nombre === "PREMIUM" && (
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                    por mes
                  </p>
                )}
              </div>

              {/* Botón */}
              <Link
                href={plan.boton.href}
                className={`w-full py-3 rounded-xl font-bold tracking-widest text-sm transition-all mb-8 block text-center ${
                  plan.boton.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{
                  background: plan.boton.disabled
                    ? "rgba(100,100,120,0.2)"
                    : `linear-gradient(135deg, ${plan.color}44, ${plan.color}22)`,
                  color: plan.color,
                  border: `1px solid ${plan.color}`,
                }}
                onClick={(e) => plan.boton.disabled && e.preventDefault()}
              >
                {esPlanActual && "✓ "}
                {plan.boton.texto}
              </Link>

              {/* Features */}
              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check size={20} style={{ color: "var(--neon-green)", flexShrink: 0 }} />
                    ) : (
                      <X size={20} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    )}
                    <span style={{ color: feature.included ? "var(--text-primary)" : "var(--text-muted)" }}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {!usuario && (
        <div className="text-center mt-8">
          <p style={{ color: "var(--text-secondary)" }} className="mb-4">
            ¿No tienes cuenta? Regístrate para acceder a los planes premium.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-xl font-bold"
            style={{
              background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))",
              color: "var(--bg-base)",
            }}
          >
            Iniciar Sesión
          </Link>
        </div>
      )}
    </div>
  );
}
