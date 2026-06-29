"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  titulo: string;
  url: string;
  descripcion?: string;
}

export default function ShareButtons({ titulo, url, descripcion = "" }: ShareButtonsProps) {
  const [showMenu, setShowMenu] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitulo = encodeURIComponent(titulo);

  const shareLinks = [
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodedTitulo}&url=${encodedUrl}`,
      icon: "𝕏",
      color: "#000",
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodedTitulo} ${encodedUrl}`,
      icon: "💬",
      color: "#25D366",
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitulo}`,
      icon: "✈️",
      color: "#0088cc",
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: "f",
      color: "#1877F2",
    },
    {
      name: "Copiar",
      url: "#",
      icon: "📋",
      color: "var(--neon-cyan)",
      onClick: () => {
        navigator.clipboard.writeText(url);
        setShowMenu(false);
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full transition-all hover:bg-white/10"
        title="Compartir"
        style={{ color: "var(--text-secondary)" }}
      >
        <Share2 size={18} />
      </button>

      {showMenu && (
        <div
          className="glass-card absolute right-0 mt-2 w-max rounded-xl overflow-hidden py-1 z-50"
          style={{ background: "rgba(10,10,20,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {shareLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                if (link.onClick) {
                  link.onClick();
                } else {
                  window.open(link.url, "_blank", "noopener,noreferrer");
                  setShowMenu(false);
                }
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>{link.icon}</span>
              {link.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
