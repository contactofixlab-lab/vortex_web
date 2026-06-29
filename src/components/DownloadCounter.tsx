"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { getRemainingDownloads } from "@/lib/descargas";
import { esPremium } from "@/lib/mercado-pago";

interface DownloadCounterProps {
  usuarioId?: number;
}

export default function DownloadCounter({ usuarioId }: DownloadCounterProps) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!usuarioId) return;

    async function fetchData() {
      try {
        const id = usuarioId as number;
        const isPrem = await esPremium(id);
        setIsPremium(isPrem);

        if (!isPrem) {
          const rem = await getRemainingDownloads(id);
          setRemaining(rem ?? 0);
        }
      } catch (err) {
        console.error("Error fetching download info:", err);
      }
    }

    fetchData();
  }, [usuarioId]);

  if (!usuarioId) return null;
  if (isPremium) return null;
  if (remaining === null) return null;

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
      style={{
        background: remaining <= 2 ? "rgba(255,79,216,0.1)" : "rgba(0,184,255,0.1)",
        border: remaining <= 2 ? "1px solid rgba(255,79,216,0.3)" : "1px solid rgba(0,184,255,0.3)",
        color: remaining <= 2 ? "var(--neon-pink)" : "var(--neon-cyan)",
      }}
    >
      <Download size={14} />
      <span>{remaining} descargas hoy</span>
    </div>
  );
}
