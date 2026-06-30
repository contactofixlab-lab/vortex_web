"use client";

interface ReiatsuCharacterProps {
  src: string;
  alt?: string;
  aspectW?: number;
  aspectH?: number;
  filterId?: string;
  /** Posición aproximada de la venda colgante en % (para el overlay con sway independiente) */
  bandagePos?: { x: number; y: number; height: number };
}

export default function ReiatsuCharacter({
  src,
  alt = "",
  aspectW = 195,
  aspectH = 305,
  filterId = "reiatsuFx",
  bandagePos = { x: 14, y: 8, height: 46 },
}: ReiatsuCharacterProps) {
  return (
    <div className="reiatsu-wrap">
      {/* Filtro SVG: distorsión sutil de presión, más lenta y contenida que el fuego */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.016"
              numOctaves={2}
              seed={11}
              stitchTiles="stitch"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="11s"
                values="0.009 0.014; 0.011 0.018; 0.008 0.013; 0.009 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feOffset in="noise" dx="0" dy="0" result="flow">
              <animate attributeName="dy" dur="4s" values="0; -22" repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap
              in="SourceGraphic"
              in2="flow"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes reiatsuCamera {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.012); }
        }
        /* Ropa pesada: balanceo lento y de mayor amplitud que una tela liviana */
        @keyframes robeSway {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          30%      { transform: rotate(0.6deg) translateX(2.5px); }
          70%      { transform: rotate(-0.5deg) translateX(-2px); }
        }
        /* Manto de presión espiritual: pulso oscuro, no brillo de fuego */
        @keyframes reiatsuPulse {
          0%, 100% {
            filter: brightness(1) contrast(1.02)
                    drop-shadow(0 0 10px rgba(40,20,70,0.4))
                    drop-shadow(0 0 24px rgba(10,5,30,0.3));
          }
          50% {
            filter: brightness(0.93) contrast(1.1)
                    drop-shadow(0 0 18px rgba(70,30,110,0.6))
                    drop-shadow(0 0 40px rgba(20,10,45,0.45));
          }
        }
        @keyframes reiatsuRing {
          0%, 100% { opacity: 0.18; transform: scale(0.96); }
          50%      { opacity: 0.4;  transform: scale(1.04); }
        }
        /* Venda: sway independiente, más rápido y de menor amplitud que el cuerpo */
        @keyframes bandageSway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25%      { transform: translateX(3px) rotate(2deg); }
          50%      { transform: translateX(-1px) rotate(-1deg); }
          75%      { transform: translateX(2.5px) rotate(1.5deg); }
        }
        .reiatsu-wrap {
          position: relative;
          height: 100%;
          aspect-ratio: ${aspectW} / ${aspectH};
          display: flex;
          align-items: center;
          justify-content: center;
          animation: reiatsuCamera 10s ease-in-out infinite;
        }
        .reiatsu-aura {
          position: absolute;
          inset: -6%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(60,20,90,0.35), rgba(10,5,25,0.12) 60%, transparent 78%);
          mix-blend-mode: multiply;
          pointer-events: none;
          filter: blur(10px);
          animation: reiatsuRing 3.2s ease-in-out infinite;
          z-index: 2;
        }
        .robe-sway {
          position: relative;
          width: 100%;
          height: 100%;
          transform-origin: 50% 88%;
          animation: robeSway 5.2s ease-in-out infinite;
        }
        .reiatsu-glow {
          position: relative;
          width: 100%;
          height: 100%;
          animation: reiatsuPulse 2.4s ease-in-out infinite;
          transition: filter 0.3s ease;
        }
        .reiatsu-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: url(#${filterId});
        }
        .bandage-accent {
          position: absolute;
          width: 6%;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.0), rgba(230,225,255,0.22), rgba(255,255,255,0.0));
          mix-blend-mode: screen;
          pointer-events: none;
          filter: blur(1.5px);
          transform-origin: top center;
          animation: bandageSway 2.6s ease-in-out infinite;
          z-index: 6;
        }

        .reiatsu-wrap:hover .reiatsu-glow    { animation-duration: 1.3s; }
        .reiatsu-wrap:hover .reiatsu-aura    { animation-duration: 1.6s; }
        .reiatsu-wrap:hover .robe-sway       { animation-duration: 2.6s; }
        .reiatsu-wrap:hover .bandage-accent  { animation-duration: 1.2s; }
      `}</style>

      <div className="robe-sway">
        <div className="reiatsu-aura" />
        <div className="reiatsu-glow">
          <img src={src} alt={alt} className="reiatsu-img" />
        </div>
        <div
          className="bandage-accent"
          style={{
            left: `${bandagePos.x}%`,
            top: `${bandagePos.y}%`,
            height: `${bandagePos.height}%`,
          }}
        />
      </div>
    </div>
  );
}
