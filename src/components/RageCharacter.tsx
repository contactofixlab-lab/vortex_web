"use client";

interface RageCharacterProps {
  src: string;
  alt?: string;
  aspectW?: number;
  aspectH?: number;
  /** Posición de cada ojo en % del contenedor (ajustar según la imagen) */
  eyeLeft?: { x: number; y: number };
  eyeRight?: { x: number; y: number };
}

export default function RageCharacter({
  src,
  alt = "",
  aspectW = 436,
  aspectH = 346,
  eyeLeft = { x: 38, y: 48 },
  eyeRight = { x: 58, y: 46 },
}: RageCharacterProps) {
  return (
    <div className="rage-wrap">
      <style>{`
        @keyframes rageCamera {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.012); }
        }
        /* Latido doble (tum-tum... pausa) en contraste/brillo de toda la imagen */
        @keyframes rageHeartbeat {
          0%   { filter: brightness(1) contrast(1) saturate(1); }
          8%   { filter: brightness(1.1) contrast(1.12) saturate(1.08); }
          16%  { filter: brightness(1) contrast(1) saturate(1); }
          24%  { filter: brightness(1.14) contrast(1.16) saturate(1.12); }
          34%  { filter: brightness(1) contrast(1) saturate(1); }
          100% { filter: brightness(1) contrast(1) saturate(1); }
        }
        /* Ojos que laten con intensidad, en su propio ciclo desfasado del latido */
        @keyframes eyeGlowPulse {
          0%, 100% { opacity: 0.35; transform: scale(0.9); }
          50%      { opacity: 1;    transform: scale(1.25); }
        }

        .rage-wrap {
          position: relative;
          height: 100%;
          aspect-ratio: ${aspectW} / ${aspectH};
          display: flex;
          align-items: center;
          justify-content: center;
          animation: rageCamera 10s ease-in-out infinite;
        }
        .rage-body {
          position: relative;
          width: 100%;
          height: 100%;
          animation: rageHeartbeat 2.6s ease-in-out infinite;
          transition: filter 0.3s ease;
        }
        .rage-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .eye-glow {
          position: absolute;
          width: 9%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,180,40,0.95), rgba(255,90,0,0.45) 55%, transparent 75%);
          mix-blend-mode: screen;
          pointer-events: none;
          filter: blur(2.5px);
          animation: eyeGlowPulse 1.3s ease-in-out infinite;
          z-index: 5;
        }

        .rage-wrap:hover .rage-body { animation-duration: 1.4s; }
        .rage-wrap:hover .eye-glow  { animation-duration: 0.7s; }
      `}</style>

      <div className="rage-body">
        <img src={src} alt={alt} className="rage-img" />
        <div
          className="eye-glow"
          style={{ left: `${eyeLeft.x}%`, top: `${eyeLeft.y}%`, transform: "translate(-50%, -50%)", animationDelay: "0s" }}
        />
        <div
          className="eye-glow"
          style={{ left: `${eyeRight.x}%`, top: `${eyeRight.y}%`, transform: "translate(-50%, -50%)", animationDelay: "0.12s" }}
        />
      </div>
    </div>
  );
}
