"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { obtenerCountNotificacionesNoLeidas } from "@/app/actions";

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const c = await obtenerCountNotificacionesNoLeidas();
      setCount(c);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return null;

  return (
    <Link
      href="/notificaciones"
      className="relative p-2.5 rounded-full transition-all"
      style={{
        background: "rgba(255,212,71,0.08)",
        border: "1px solid rgba(255,212,71,0.2)",
        color: "var(--neon-yellow)",
      }}
      title={`${count} notificación${count !== 1 ? "es" : ""} no leída${count !== 1 ? "s" : ""}`}
    >
      <Bell size={18} />
      {count > 0 && (
        <div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "var(--neon-pink)", color: "white" }}
        >
          {count > 9 ? "9+" : count}
        </div>
      )}
    </Link>
  );
}
