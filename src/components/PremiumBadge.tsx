"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

interface PremiumBadgeProps {
  usuarioId?: number;
}

export default function PremiumBadge({ usuarioId }: PremiumBadgeProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuarioId) {
      setLoading(false);
      return;
    }

    async function checkPremium() {
      try {
        const { esPremium } = await import("@/lib/mercado-pago");
        const id = usuarioId as number;
        const isPrem = await esPremium(id);
        setIsPremium(isPrem);
      } catch (err) {
        console.error("Error checking premium status:", err);
      } finally {
        setLoading(false);
      }
    }

    checkPremium();
  }, [usuarioId]);

  if (!usuarioId || loading || !isPremium) return null;

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"
      style={{
        background: "linear-gradient(135deg, rgba(255,212,71,0.2), rgba(255,212,71,0.1))",
        border: "1px solid rgba(255,212,71,0.4)",
        color: "var(--neon-yellow)",
      }}
    >
      <Crown size={12} />
      PREMIUM
    </div>
  );
}
