"use client";

import { useEffect, useRef, useState } from "react";

export default function NarutoAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(false);
  const [, setHover] = useState(false);

  // ---- Brasas de chakra ascendentes (canvas, ENCIMA de la imagen) ----
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const W = (canvasEl.width = 260);
    const H = (canvasEl.height = 450);

    type Ember = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hue: number };
    let embers: Ember[] = [];
    let raf = 0;

    function spawn(n: number) {
      for (let i = 0; i < n; i++) {
        const x = W * 0.5 + (Math.random() - 0.5) * W * 0.55;
        const y = H * (0.55 + Math.random() * 0.4);
        embers.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(0.4 + Math.random() * 1.1),
          life: 1,
          max: 1200 + Math.random() * 1400,
          size: 1.2 + Math.random() * 2.6,
          hue: 25 + Math.random() * 25, // naranja → dorado
        });
      }
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const cap = hoverRef.current ? 95 : 55;
      if (embers.length < cap) spawn(hoverRef.current ? 3 : 2);

      embers = embers.filter((e) => {
        e.life -= 16.67;
        if (e.life <= 0) return false;
        e.x += e.vx;
        e.y += e.vy;
        e.vy -= 0.004; // aceleran al subir
        e.vx += (Math.random() - 0.5) * 0.05; // bamboleo
        const o = Math.max(0, e.life / e.max);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${e.hue}, 100%, 60%, ${o})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${e.hue}, 100%, 55%, ${o})`;
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      raf = requestAnimationFrame(frame);
    }
    frame();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="kcm-wrap"
      onMouseEnter={() => {
        hoverRef.current = true;
        setHover(true);
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        setHover(false);
      }}
    >
      {/* Filtro SVG: turbulencia animada que ondula las llamas de la propia imagen */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="kcmFire" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.022"
              numOctaves={3}
              seed={4}
              stitchTiles="stitch"
              result="noise"
            >
              {/* "hervor" lento del chakra */}
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.012 0.020; 0.015 0.028; 0.011 0.019; 0.012 0.020"
                repeatCount="indefinite"
              />
            </feTurbulence>
            {/* flujo continuo ASCENDENTE: el ruido se desplaza hacia arriba sin parar */}
            <feOffset in="noise" dx="0" dy="0" result="flow">
              <animate
                attributeName="dy"
                dur="2.6s"
                values="0; -48"
                repeatCount="indefinite"
              />
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
        @keyframes kcmFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes kcmCamera {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.012); }
        }
        @keyframes kcmPulse {
          0%, 100% {
            filter: brightness(1) saturate(1.05)
                    drop-shadow(0 0 10px rgba(255,150,30,0.45))
                    drop-shadow(0 0 26px rgba(255,90,0,0.25));
          }
          50% {
            filter: brightness(1.12) saturate(1.2)
                    drop-shadow(0 0 18px rgba(255,180,40,0.7))
                    drop-shadow(0 0 46px rgba(255,110,0,0.45));
          }
        }
        @keyframes orbBob {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%      { transform: translateY(-4px); opacity: 0.9; }
        }

        .kcm-wrap {
          position: relative;
          height: 100%;
          aspect-ratio: 175 / 305;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: kcmCamera 10s ease-in-out infinite;
        }
        .kcm-float {
          position: relative;
          width: 100%;
          height: 100%;
          animation: kcmFloat 4.5s ease-in-out infinite;
        }
        /* Capa de glow/pulso (envuelve a la imagen) */
        .kcm-glow {
          position: absolute;
          inset: 0;
          animation: kcmPulse 1.6s ease-in-out infinite;
          transition: filter 0.3s ease;
        }
        /* La imagen real, con la turbulencia de fuego aplicada a SÍ MISMA */
        .kcm-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: url(#kcmFire);
        }
        /* Esferas Gudōdama: realces sobre las bolas rojas que ya están en la imagen */
        .orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 35%, rgba(255,80,60,0.9), rgba(140,0,0,0.5) 60%, transparent 75%);
          mix-blend-mode: screen;
          pointer-events: none;
          filter: blur(1px);
          animation: orbBob 2.4s ease-in-out infinite;
          z-index: 12;
        }

        /* HOVER: fuego e intensidad al máximo */
        .kcm-wrap:hover .kcm-glow {
          animation-duration: 0.9s;
          filter: brightness(1.2) saturate(1.35)
                  drop-shadow(0 0 22px rgba(255,190,50,0.85))
                  drop-shadow(0 0 55px rgba(255,120,0,0.55));
        }
        .kcm-wrap:hover .kcm-float { animation-duration: 3s; }
        .kcm-wrap:hover .orb { animation-duration: 1.4s; }
      `}</style>

      <div className="kcm-float">
        <div className="kcm-glow">
          <img src="/naruto.png" alt="Naruto Modo Chakra" className="kcm-img" />
        </div>

        {/* Realces sobre las esferas Gudōdama (lado derecho) — ajustar si hace falta */}
        <div className="orb" style={{ width: 22, height: 22, right: "6%", top: "12%", animationDelay: "0s" }} />
        <div className="orb" style={{ width: 20, height: 20, right: "2%", top: "22%", animationDelay: "0.3s" }} />
        <div className="orb" style={{ width: 24, height: 24, right: "8%", top: "33%", animationDelay: "0.6s" }} />
        <div className="orb" style={{ width: 18, height: 18, right: "3%", top: "44%", animationDelay: "0.9s" }} />

        {/* Brasas ascendentes ENCIMA de la imagen */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 13, pointerEvents: "none", mixBlendMode: "screen" }}
        />
      </div>
    </div>
  );
}
