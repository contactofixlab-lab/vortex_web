"use client";

import { useEffect, useRef, useState } from "react";

interface FireCharacterProps {
  src: string;
  alt?: string;
  /** Proporción de la imagen (ancho/alto) para el contenedor */
  aspectW?: number;
  aspectH?: number;
  /** id único para el filtro SVG (evita colisiones si hay varios) */
  filterId?: string;
  /** "aura" = fuego ajustado al cuerpo (default). "dragon" = alas que respiran + impacto en el suelo + destello de puños. "godpower" = carga de poder ascendente con pico + glow de pelo independiente. "exorcist" = llama azul + destello de disparo/retroceso + filo de espada brillante */
  variant?: "aura" | "dragon" | "godpower" | "exorcist";
  /** Color del fuego/brasas. "exorcist" usa "blue" automáticamente salvo que se pase explícito. */
  palette?: "orange" | "blue";
  /** Posición del cañón del arma en % (solo variant="exorcist") */
  gunPos?: { x: number; y: number };
  /** Inicio/fin del filo de la espada en % (solo variant="exorcist") */
  swordStart?: { x: number; y: number };
  swordEnd?: { x: number; y: number };
}

export default function FireCharacter({
  src,
  alt = "",
  aspectW = 250,
  aspectH = 330,
  filterId = "fireFx",
  variant = "aura",
  palette,
  gunPos = { x: 32, y: 66 },
  swordStart = { x: 16, y: 58 },
  swordEnd = { x: 46, y: 10 },
}: FireCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(false);
  const [, setHover] = useState(false);
  const isBlue = (palette ?? (variant === "exorcist" ? "blue" : "orange")) === "blue";

  // Paleta de color: naranja-fuego (default) o azul demoníaco (exorcist)
  const emberHueMin = isBlue ? 192 : 18;
  const emberHueSpread = isBlue ? 24 : 28;
  const glowSoftA = isBlue ? "0,184,255" : "255,140,20";
  const glowSoftB = isBlue ? "0,110,255" : "255,70,0";
  const glowHoverA = isBlue ? "100,220,255" : "255,180,40";
  const glowHoverB = isBlue ? "0,140,255" : "255,100,0";

  // ---- Brasas ascendentes (canvas, ENCIMA de la imagen) ----
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const W = (canvasEl.width = 280);
    const H = (canvasEl.height = 380);

    type Ember = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hue: number };
    let embers: Ember[] = [];
    let raf = 0;

    function spawn(n: number) {
      for (let i = 0; i < n; i++) {
        const x = W * 0.5 + (Math.random() - 0.5) * W * 0.7;
        const y = H * (0.5 + Math.random() * 0.45);
        embers.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(0.5 + Math.random() * 1.2),
          life: 1,
          max: 1100 + Math.random() * 1400,
          size: 1.2 + Math.random() * 2.8,
          hue: emberHueMin + Math.random() * emberHueSpread,
        });
      }
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const cap = hoverRef.current ? 100 : 60;
      if (embers.length < cap) spawn(hoverRef.current ? 3 : 2);

      embers = embers.filter((e) => {
        e.life -= 16.67;
        if (e.life <= 0) return false;
        e.x += e.vx;
        e.y += e.vy;
        e.vy -= 0.004;
        e.vx += (Math.random() - 0.5) * 0.06;
        const o = Math.max(0, e.life / e.max);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${e.hue}, 100%, 58%, ${o})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${e.hue}, 100%, 52%, ${o})`;
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      raf = requestAnimationFrame(frame);
    }
    frame();
    return () => cancelAnimationFrame(raf);
  }, [emberHueMin, emberHueSpread]);


  return (
    <div
      className="fire-wrap"
      onMouseEnter={() => {
        hoverRef.current = true;
        setHover(true);
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        setHover(false);
      }}
    >
      {/* Filtro SVG: turbulencia con flujo continuo ascendente sobre la propia imagen */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.022"
              numOctaves={3}
              seed={7}
              stitchTiles="stitch"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.012 0.020; 0.015 0.028; 0.011 0.019; 0.012 0.020"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feOffset in="noise" dx="0" dy="0" result="flow">
              <animate attributeName="dy" dur="2.6s" values="0; -48" repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap
              in="SourceGraphic"
              in2="flow"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes fireFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes fireCamera {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.012); }
        }
        @keyframes firePulse {
          0%, 100% {
            filter: brightness(1) saturate(1.05)
                    drop-shadow(0 0 10px rgba(${glowSoftA},0.45))
                    drop-shadow(0 0 26px rgba(${glowSoftB},0.25));
          }
          50% {
            filter: brightness(1.12) saturate(1.2)
                    drop-shadow(0 0 18px rgba(${glowSoftA},0.7))
                    drop-shadow(0 0 46px rgba(${glowSoftB},0.45));
          }
        }

        .fire-wrap {
          position: relative;
          height: 100%;
          aspect-ratio: ${aspectW} / ${aspectH};
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fireCamera 10s ease-in-out infinite;
        }
        .fire-float {
          position: relative;
          width: 100%;
          height: 100%;
          animation: fireFloat 4.5s ease-in-out infinite;
        }
        .fire-glow {
          position: absolute;
          inset: 0;
          animation: firePulse 1.6s ease-in-out infinite;
          transition: filter 0.3s ease;
        }
        .fire-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: url(#${filterId});
        }

        .fire-wrap:hover .fire-glow {
          animation-duration: 0.9s;
          filter: brightness(1.2) saturate(1.35)
                  drop-shadow(0 0 22px rgba(${glowHoverA},0.85))
                  drop-shadow(0 0 55px rgba(${glowHoverB},0.55));
        }
        .fire-wrap:hover .fire-float { animation-duration: 3s; }

        /* ---- Variante "dragon": alas que respiran + impacto en el suelo + destello de puños ---- */
        @keyframes wingBreath {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.75; transform: scale(1.06); }
        }
        @keyframes groundShock {
          0%   { opacity: 0.6; transform: scale(0.7); }
          70%  { opacity: 0;   transform: scale(1.8); }
          100% { opacity: 0;   transform: scale(1.8); }
        }
        @keyframes groundDust {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 0.55; }
        }
        @keyframes fistFlare {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50%      { opacity: 0.9;  transform: scale(1.15); }
        }

        .wing-breath {
          position: absolute;
          top: -8%;
          left: 50%;
          width: 105%;
          height: 68%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(255,140,20,0.5), rgba(255,60,0,0.18) 55%, transparent 75%);
          mix-blend-mode: screen;
          pointer-events: none;
          filter: blur(10px);
          animation: wingBreath 2.8s ease-in-out infinite;
          z-index: 4;
        }
        .ground-impact {
          position: absolute;
          bottom: -4%;
          left: 50%;
          width: 70%;
          height: 18%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 6;
        }
        .ground-dust {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(180,90,30,0.4), transparent 70%);
          filter: blur(6px);
          animation: groundDust 2.4s ease-in-out infinite;
        }
        .ground-shock {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 60%;
          height: 60%;
          transform: translate(-50%, -50%);
          border: 2px solid rgba(255,170,60,0.55);
          border-radius: 50%;
          animation: groundShock 3.2s ease-out infinite;
        }
        .fist-flare {
          position: absolute;
          width: 14%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,220,140,0.9), rgba(255,130,20,0.4) 60%, transparent 75%);
          mix-blend-mode: screen;
          pointer-events: none;
          filter: blur(3px);
          animation: fistFlare 1.9s ease-in-out infinite;
          z-index: 7;
        }

        .fire-wrap:hover .wing-breath  { animation-duration: 1.6s; }
        .fire-wrap:hover .ground-shock { animation-duration: 1.6s; }
        .fire-wrap:hover .fist-flare   { animation-duration: 1s; }

        /* ---- Variante "godpower": carga de poder ascendente con pico + glow de pelo ---- */
        @keyframes powerSurge {
          0%   { filter: brightness(0.95) saturate(1)   drop-shadow(0 0 8px rgba(255,60,40,0.35))  drop-shadow(0 0 18px rgba(255,30,20,0.2)); }
          70%  { filter: brightness(1.05) saturate(1.1)  drop-shadow(0 0 14px rgba(255,80,40,0.55)) drop-shadow(0 0 30px rgba(255,40,20,0.35)); }
          88%  { filter: brightness(1.35) saturate(1.4)  drop-shadow(0 0 28px rgba(255,140,80,0.95)) drop-shadow(0 0 70px rgba(255,60,20,0.7)); }
          100% { filter: brightness(0.95) saturate(1)   drop-shadow(0 0 8px rgba(255,60,40,0.35))  drop-shadow(0 0 18px rgba(255,30,20,0.2)); }
        }
        @keyframes hairGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.08); }
        }

        .power-surge {
          animation: powerSurge 4s ease-in-out infinite !important;
        }
        .hair-glow {
          position: absolute;
          top: -6%;
          left: 50%;
          width: 55%;
          height: 38%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(255,40,40,0.55), rgba(200,0,30,0.2) 55%, transparent 75%);
          mix-blend-mode: screen;
          pointer-events: none;
          filter: blur(8px);
          animation: hairGlow 2.2s ease-in-out infinite;
          z-index: 4;
        }

        .fire-wrap:hover .power-surge { animation-duration: 1.8s !important; }
        .fire-wrap:hover .hair-glow   { animation-duration: 1.1s; }

        /* ---- Variante "exorcist": llama azul + destello de disparo/retroceso + filo de espada ---- */
        @keyframes gunFlash {
          0%, 82% { opacity: 0; transform: scale(0.4); }
          86%     { opacity: 1; transform: scale(1.3); }
          94%     { opacity: 0.3; transform: scale(1); }
          100%    { opacity: 0; transform: scale(0.4); }
        }
        @keyframes recoilShake {
          0%, 82% { transform: translate(0, 0) rotate(0deg); }
          85%     { transform: translate(-2px, 1px) rotate(-0.4deg); }
          89%     { transform: translate(1px, -1px) rotate(0.3deg); }
          93%     { transform: translate(0, 0) rotate(0deg); }
          100%    { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes swordGlint {
          0%, 100% { left: ${swordStart.x}%; top: ${swordStart.y}%; opacity: 0; }
          8%       { opacity: 0.9; }
          48%      { left: ${swordEnd.x}%; top: ${swordEnd.y}%; opacity: 0.9; }
          56%      { opacity: 0; }
          57%, 99% { left: ${swordEnd.x}%; top: ${swordEnd.y}%; opacity: 0; }
        }

        .recoil-shake { animation: recoilShake 2.4s ease-in-out infinite; }
        .gun-flash {
          position: absolute;
          width: 16%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.95), rgba(170,220,255,0.6) 45%, transparent 75%);
          mix-blend-mode: screen;
          pointer-events: none;
          filter: blur(2px);
          animation: gunFlash 2.4s ease-in-out infinite;
          z-index: 8;
        }
        .sword-glint {
          position: absolute;
          width: 16px;
          height: 16px;
          margin-left: -8px;
          margin-top: -8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.95), rgba(180,230,255,0.5) 50%, transparent 75%);
          mix-blend-mode: screen;
          pointer-events: none;
          filter: blur(1.5px);
          animation: swordGlint 3.6s ease-in-out infinite;
          z-index: 8;
        }

        .fire-wrap:hover .gun-flash    { animation-duration: 1.3s; }
        .fire-wrap:hover .recoil-shake { animation-duration: 1.3s; }
        .fire-wrap:hover .sword-glint  { animation-duration: 2s; }
      `}</style>

      <div className={`fire-float${variant === "exorcist" ? " recoil-shake" : ""}`}>
        {variant === "dragon" && <div className="wing-breath" />}
        {variant === "godpower" && <div className="hair-glow" />}

        <div className={`fire-glow${variant === "godpower" ? " power-surge" : ""}`}>
          <img src={src} alt={alt} className="fire-img" />
        </div>

        {variant === "dragon" && (
          <>
            <div className="ground-impact">
              <div className="ground-dust" />
              <div className="ground-shock" />
            </div>
            <div className="fist-flare" style={{ left: "30%", top: "37%", animationDelay: "0s" }} />
            <div className="fist-flare" style={{ left: "56%", top: "40%", animationDelay: "0.5s" }} />
          </>
        )}

        {variant === "exorcist" && (
          <>
            <div className="gun-flash" style={{ left: `${gunPos.x}%`, top: `${gunPos.y}%`, transform: "translate(-50%, -50%)" }} />
            <div className="sword-glint" />
          </>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 13, pointerEvents: "none", mixBlendMode: "screen" }}
        />
      </div>
    </div>
  );
}
