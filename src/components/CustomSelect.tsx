"use client";

import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
  placeholder: string;
  color: "cyan" | "violet" | "yellow";
}

const colorMap = {
  cyan: {
    rgb: "0,184,255",
    text: "var(--neon-cyan)",
  },
  violet: {
    rgb: "139,92,246",
    text: "var(--neon-violet)",
  },
  yellow: {
    rgb: "255,212,71",
    text: "var(--neon-yellow)",
  },
};

export default function CustomSelect({
  value,
  onChange,
  options,
  label,
  placeholder,
  color,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colors = colorMap[color];
  const displayValue = value || placeholder;

  const border = `rgba(${colors.rgb},0.4)`;
  const bg = `linear-gradient(135deg, rgba(${colors.rgb},0.15), rgba(${colors.rgb},0.08))`;
  const bgHover = `linear-gradient(135deg, rgba(${colors.rgb},0.3), rgba(${colors.rgb},0.18))`;
  const glow = `rgba(${colors.rgb},0.2)`;
  const optionSelected = `rgba(${colors.rgb},0.22)`;
  const optionHover = `rgba(${colors.rgb},0.38)`;
  const optionBorder = `rgba(${colors.rgb},0.2)`;

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="text-xs font-black tracking-widest" style={{ color: colors.text, textTransform: "uppercase" }}>
        {label}
      </label>

      <div className="relative">
        {/* Button (preseleccionador) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 rounded-xl text-sm font-bold text-left flex items-center justify-between transition-all"
          style={{
            background: bg,
            border: `2px solid ${border}`,
            color: colors.text,
            boxShadow: `0 0 15px ${glow}, inset 0 1px 1px rgba(255,255,255,0.1)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = bgHover;
            e.currentTarget.style.boxShadow = `0 0 22px ${glow}, inset 0 1px 1px rgba(255,255,255,0.15)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = bg;
            e.currentTarget.style.boxShadow = `0 0 15px ${glow}, inset 0 1px 1px rgba(255,255,255,0.1)`;
          }}
        >
          <span>{displayValue}</span>
          <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
            ▼
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
            style={{
              background: "rgba(10,10,20,0.95)",
              border: `2px solid ${border}`,
              boxShadow: `0 12px 48px rgba(0,0,0,0.5), 0 0 20px ${glow}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="max-h-64 overflow-y-auto">
              <button
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm font-bold transition-all"
                style={{
                  background: value === "" ? optionSelected : "transparent",
                  color: colors.text,
                  borderBottom: `1px solid ${optionBorder}`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = optionHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = value === "" ? optionSelected : "transparent"; }}
              >
                {placeholder}
              </button>

              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-bold transition-all border-b"
                  style={{
                    background: value === option ? optionSelected : "transparent",
                    color: colors.text,
                    borderBottomColor: optionBorder,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = optionHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = value === option ? optionSelected : "transparent"; }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
