"use client";

import { useState } from "react";
import Link from "next/link";
import { marcarNotificacionLeida } from "@/app/actions";
import { ChevronRight, MessageSquare, Heart, User, Info } from "lucide-react";

interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  createdAt: string;
  enlace?: string;
}

interface NotificacionesClientProps {
  notificacionesIniciales: Notificacion[];
}

const TIPO_ICON: Record<string, any> = {
  comentario: MessageSquare,
  favorito: Heart,
  seguidor: User,
  info: Info,
};

const TIPO_COLOR: Record<string, string> = {
  comentario: "var(--neon-cyan)",
  favorito: "var(--neon-pink)",
  seguidor: "var(--neon-violet)",
  info: "var(--neon-yellow)",
};

export default function NotificacionesClient({ notificacionesIniciales }: NotificacionesClientProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesIniciales);

  async function handleMarcarLeida(id: number) {
    const res = await marcarNotificacionLeida(id);
    if (res.ok) {
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-widest" style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}>
          NOTIFICACIONES
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          {notificaciones.length} notificación{notificaciones.length !== 1 ? "es" : ""}
        </p>
      </div>

      {notificaciones.length === 0 ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
          <p>No hay notificaciones</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notificaciones.map((notif) => {
            const Icon = TIPO_ICON[notif.tipo] || Info;
            const color = TIPO_COLOR[notif.tipo] || "var(--neon-yellow)";

            return (
              <div
                key={notif.id}
                className="p-4 rounded-xl flex items-start gap-4 cursor-pointer transition-all"
                onClick={() => {
                  if (!notif.leida) handleMarcarLeida(notif.id);
                  if (notif.enlace) window.location.href = notif.enlace;
                }}
                style={{
                  background: notif.leida ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                  border: notif.leida ? "1px solid rgba(255,255,255,0.05)" : `1px solid ${color}30`,
                }}
              >
                <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${color}20` }}>
                  <Icon size={18} style={{ color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    {notif.titulo}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    {notif.mensaje}
                  </p>
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                    {notif.createdAt}
                  </p>
                </div>

                {!notif.leida && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                  />
                )}

                {notif.enlace && (
                  <ChevronRight size={18} style={{ color: "var(--text-muted)" }} className="flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
