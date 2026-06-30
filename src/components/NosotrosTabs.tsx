"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface NosotrosTabsProps {
  tabs: Tab[];
  children: ReactNode[];
}

export default function NosotrosTabs({ tabs, children }: NosotrosTabsProps) {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(tabs[0].id);

  useEffect(() => {
    const seccion = searchParams.get("seccion");
    if (seccion && tabs.some((t) => t.id === seccion)) {
      setActive(seccion);
    }
  }, [searchParams, tabs]);

  function handleClick(id: string) {
    setActive(id);
    window.history.replaceState(null, "", `?seccion=${id}`);
  }

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === active));

  return (
    <div>
      {/* Selector de secciones - segmented pill glass */}
      <div className="flex justify-center mb-14">
        <div
          className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-full backdrop-blur-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(0,184,255,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.06)",
          }}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                onClick={() => handleClick(tab.id)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(0,184,255,0.35), rgba(139,92,246,0.25))"
                    : "transparent",
                  color: isActive ? "var(--neon-cyan)" : "var(--text-secondary)",
                  boxShadow: isActive ? "0 0 16px rgba(0,184,255,0.25)" : "none",
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {children[activeIndex]}
    </div>
  );
}
