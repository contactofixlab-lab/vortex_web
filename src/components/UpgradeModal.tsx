"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo?: string;
  mensaje?: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  titulo = "Mejora a Premium",
  mensaje = "Desbloquea descargas ilimitadas y más funciones.",
}: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        style={{
          background: "rgba(10,10,20,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,212,71,0.3)",
          boxShadow: "0 0 60px rgba(255,212,71,0.2)",
        }}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-white/10"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mb-6 text-center">
          <div className="inline-block p-4 rounded-full" style={{ background: "rgba(255,212,71,0.1)" }}>
            <Zap size={32} style={{ color: "var(--neon-yellow)" }} />
          </div>
        </div>

        {/* Título */}
        <h2
          className="text-3xl font-black mb-3 text-center tracking-wider"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-yellow)" }}
        >
          {titulo}
        </h2>

        {/* Mensaje */}
        <p className="text-center mb-8" style={{ color: "var(--text-secondary)" }}>
          {mensaje}
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <span style={{ color: "var(--neon-yellow)" }}>✓</span>
            <span style={{ color: "var(--text-primary)" }}>Descargas ilimitadas</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: "var(--neon-yellow)" }}>✓</span>
            <span style={{ color: "var(--text-primary)" }}>Chat ilimitado</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: "var(--neon-yellow)" }}>✓</span>
            <span style={{ color: "var(--text-primary)" }}>Todos los gifts</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: "var(--neon-yellow)" }}>✓</span>
            <span style={{ color: "var(--text-primary)" }}>Acceso prioritario</span>
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <Link
            href="/planes"
            className="w-full py-3 rounded-xl font-bold text-center transition-all block"
            style={{
              background: "linear-gradient(135deg, rgba(255,212,71,0.3), rgba(255,212,71,0.1))",
              color: "var(--neon-yellow)",
              border: "1px solid rgba(255,212,71,0.5)",
            }}
          >
            Ver Planes
          </Link>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-center transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "var(--text-secondary)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Más tarde
          </button>
        </div>

        {/* Precio */}
        <p className="text-center mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
          Solo <span style={{ color: "var(--neon-yellow)", fontWeight: "bold" }}>$2.990/mes</span> sin compromiso
        </p>
      </div>
    </div>
  );
}
