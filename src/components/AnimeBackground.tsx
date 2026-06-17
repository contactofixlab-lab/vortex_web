"use client";

import { useEffect, useRef } from "react";

interface KiOrb          { x:number; y:number; vx:number; vy:number; radius:number; r:number; g:number; b:number; phase:number; }
interface AuraRing        { x:number; y:number; radius:number; maxRadius:number; alpha:number; r:number; g:number; b:number; }
interface ChakraParticle  { x:number; y:number; vy:number; vx:number; size:number; alpha:number; r:number; g:number; b:number; }
interface LightningBolt   { segs:{x:number;y:number}[]; life:number; maxLife:number; r:number; g:number; b:number; }
interface Rasengan        { x:number; y:number; angle:number; radius:number; alpha:number; }

function rand(min:number, max:number){ return min + Math.random()*(max-min); }

function lightningPath(x1:number,y1:number,x2:number,y2:number,rough=12){
  const pts=[{x:x1,y:y1}];
  for(let i=1;i<10;i++){const t=i/10;pts.push({x:x1+(x2-x1)*t+rand(-rough,rough),y:y1+(y2-y1)*t+rand(-rough,rough)});}
  pts.push({x:x2,y:y2});
  return pts;
}

/* ══════════════════════════════════════════════════════════
   KI DRAGON BALL — aura pura, sin personaje
   Posición: izquierda, zona media-baja de la pantalla
   Ciclo de 320 frames:
     0-100  carga lenta (ki azul/dorado acumulándose)
     100-200 explosión SSJ (aura dorada máxima + rayos)
     200-260 onda de ki expandiéndose
     260-320 cooldown → fade
══════════════════════════════════════════════════════════ */
function drawDragonBallKi(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  frame: number
) {
  const CYCLE = 320;
  const ph = frame % CYCLE;

  let charge = 0;     // 0..1 — intensidad general
  let blast  = 0;     // 0..1 — onda expansiva
  let ssj    = false; // true = color dorado

  if (ph < 100) {
    charge = ph / 100;
    ssj    = charge > 0.55;
  } else if (ph < 200) {
    charge = 1;
    blast  = (ph - 100) / 100;
    ssj    = true;
  } else if (ph < 260) {
    const p = (ph - 200) / 60;
    charge = 1 - p * 0.6;
    blast  = 1;
    ssj    = true;
  } else {
    const p = (ph - 260) / 60;
    charge = (1 - p) * 0.4;
    ssj    = charge > 0.15;
  }

  const R1 = ssj ? 255 : 0;
  const G1 = ssj ? 200 : 160;
  const B1 = ssj ? 0   : 255;

  // ── Aura base difusa ─────────────────────────────────
  const auraPulse = 1 + 0.08 * Math.sin(frame * 0.12);
  const auraW = (80 + charge * 220) * auraPulse;
  const auraH = (120 + charge * 320) * auraPulse;

  for (let layer = 4; layer >= 0; layer--) {
    const lf = 1 + layer * 0.28;
    const la = (charge * 0.35) / (layer + 1);
    const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraW * lf);
    g.addColorStop(0,   `rgba(${R1},${G1},${B1},${la * 2.5})`);
    g.addColorStop(0.5, `rgba(${R1},${G1},${B1},${la})`);
    g.addColorStop(1,   `rgba(${R1},${G1},${B1},0)`);
    ctx.beginPath();
    ctx.ellipse(cx, cy, auraW * lf * 0.5, auraH * lf * 0.65, 0, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  // ── Llamas de aura (ki flames) ────────────────────────
  if (charge > 0.1) {
    const flameCount = Math.round(8 + charge * 14);
    for (let f = 0; f < flameCount; f++) {
      const fa   = (f / flameCount) * Math.PI * 2 + frame * 0.04;
      const fH   = (40 + charge * 140) * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.09 + f * 1.7)));
      const fW   = 10 + charge * 18;
      const dist = auraW * 0.38 * (0.7 + 0.3 * Math.sin(frame * 0.07 + f));
      const bx   = cx + Math.cos(fa) * dist * 0.55;
      const by   = cy + Math.sin(fa) * dist * 0.85;

      ctx.save();
      ctx.translate(bx, by);
      // las llamas siempre apuntan hacia afuera
      ctx.rotate(fa + Math.PI * 0.5 + (ssj ? 0 : 0.15));
      const fg = ctx.createLinearGradient(0, 0, 0, -fH);
      fg.addColorStop(0, `rgba(${R1},${G1},${B1},${charge * 0.85})`);
      fg.addColorStop(0.5, `rgba(${R1},${Math.min(255,G1+40)},${B1},${charge * 0.4})`);
      fg.addColorStop(1, `rgba(${R1},${G1},${B1},0)`);
      ctx.beginPath();
      ctx.moveTo(-fW / 2, 0);
      ctx.quadraticCurveTo(fW * 0.6, -fH * 0.45, 0, -fH);
      ctx.quadraticCurveTo(-fW * 0.6, -fH * 0.45, fW / 2, 0);
      ctx.closePath();
      ctx.fillStyle = fg;
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Chispas / relámpagos de ki ─────────────────────────
  if (charge > 0.4) {
    const sparkCount = Math.round(6 + charge * 18);
    for (let s = 0; s < sparkCount; s++) {
      const sa  = (s / sparkCount) * Math.PI * 2 + frame * 0.22;
      const sd  = (30 + charge * 90) * (0.6 + 0.4 * Math.sin(frame * 0.35 + s * 2.1));
      const sx  = cx + Math.cos(sa) * sd * 0.55;
      const sy  = cy + Math.sin(sa) * sd * 0.80;
      const sz  = 2 + charge * 4;

      ctx.beginPath();
      ctx.arc(sx, sy, sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${R1},${G1},${B1},${charge * 0.9})`;
      ctx.fill();

      // rayito entre chispas cercanas
      if (s % 2 === 0 && charge > 0.65) {
        const s2  = (s + 3) % sparkCount;
        const sa2 = (s2 / sparkCount) * Math.PI * 2 + frame * 0.22;
        const sd2 = (30 + charge * 90) * (0.6 + 0.4 * Math.sin(frame * 0.35 + s2 * 2.1));
        const sx2 = cx + Math.cos(sa2) * sd2 * 0.55;
        const sy2 = cy + Math.sin(sa2) * sd2 * 0.80;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx2, sy2);
        ctx.strokeStyle = `rgba(${R1},${G1},${B1},${charge * 0.5})`;
        ctx.lineWidth = 1.5; ctx.stroke();
      }
    }
  }

  // ── Núcleo central brillante ──────────────────────────
  if (charge > 0.2) {
    const coreR = 18 + charge * 40;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
    cg.addColorStop(0,   `rgba(255,255,255,${charge * 0.95})`);
    cg.addColorStop(0.3, `rgba(${R1},${G1},${B1},${charge * 0.8})`);
    cg.addColorStop(1,   `rgba(${R1},${G1},${B1},0)`);
    ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fillStyle = cg; ctx.fill();

    // halo blanco interior
    const haloR = coreR * 0.35;
    ctx.beginPath(); ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${charge * 0.9})`; ctx.fill();
  }

  // ── Onda expansiva (blast) ─────────────────────────────
  if (blast > 0 && blast < 1) {
    const waveR = blast * (Math.min(ctx.canvas.width, ctx.canvas.height) * 0.65);
    const wa    = blast < 0.5 ? blast * 2 : (1 - blast) * 2;

    // onda principal
    ctx.beginPath(); ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${R1},${G1},${B1},${wa * 0.7})`;
    ctx.lineWidth = 6 * (1 - blast * 0.5); ctx.stroke();

    // onda exterior difusa
    ctx.beginPath(); ctx.arc(cx, cy, waveR * 1.18, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${R1},${G1},${B1},${wa * 0.25})`;
    ctx.lineWidth = 18 * (1 - blast * 0.6); ctx.stroke();

    // rayos de ki disparados en todas direcciones
    const rayCount = 24;
    for (let r = 0; r < rayCount; r++) {
      const ra   = (r / rayCount) * Math.PI * 2 + blast * 0.8;
      const rLen = (50 + Math.sin(blast * Math.PI * 3 + r) * 30) + blast * 80;
      const rx1  = cx + Math.cos(ra) * waveR * 0.85;
      const ry1  = cy + Math.sin(ra) * waveR * 0.85;
      const rx2  = cx + Math.cos(ra) * (waveR * 0.85 + rLen);
      const ry2  = cy + Math.sin(ra) * (waveR * 0.85 + rLen);

      ctx.beginPath(); ctx.moveTo(rx1, ry1); ctx.lineTo(rx2, ry2);
      ctx.strokeStyle = `rgba(${R1},${G1},${B1},${wa * 0.75})`;
      ctx.lineWidth = 2.5 + Math.sin(r + blast * 6) * 1.5; ctx.stroke();

      ctx.beginPath(); ctx.moveTo(rx1, ry1); ctx.lineTo(rx2, ry2);
      ctx.strokeStyle = `rgba(255,255,255,${wa * 0.55})`;
      ctx.lineWidth = 0.8; ctx.stroke();
    }
  }

  // ── Anillos de ki (concentración de energía) ──────────
  if (charge > 0.5) {
    const ringCount = 3;
    for (let r = 0; r < ringCount; r++) {
      const ringPhase = (frame * 0.06 + (r / ringCount) * Math.PI * 2) % (Math.PI * 2);
      const ringR     = (30 + charge * 70) * (0.6 + 0.4 * Math.abs(Math.sin(ringPhase)));
      const ringA     = charge * 0.45 * Math.abs(Math.sin(ringPhase));
      ctx.beginPath();
      ctx.ellipse(cx, cy, ringR * 0.6, ringR, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${R1},${G1},${B1},${ringA})`;
      ctx.lineWidth = 2.5; ctx.stroke();
    }
  }
}

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function AnimeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0, t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    const KI_COLORS = [
      {r:0,  g:180,b:255},{r:255,g:215,b:0  },{r:0,  g:245,b:255},
      {r:255,g:107,b:0  },{r:191,g:95, b:255},{r:255,g:230,b:0  },
    ];

    /* Ki orbs */
    const orbs: KiOrb[] = Array.from({length:6},()=>{
      const c=KI_COLORS[Math.floor(Math.random()*KI_COLORS.length)];
      return {x:rand(0,W()),y:rand(0,H()),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),
              radius:rand(14,35),...c,phase:rand(0,Math.PI*2)};
    });

    /* Partículas chakra */
    const particles: ChakraParticle[] = Array.from({length:100},()=>{
      const c=KI_COLORS[Math.floor(Math.random()*KI_COLORS.length)];
      return {x:rand(0,W()),y:rand(0,H()),vx:rand(-0.2,0.2),vy:rand(-0.4,-1.2),
              size:rand(1,2.5),alpha:rand(0.3,0.8),...c};
    });

    /* Aura rings */
    const rings: AuraRing[] = [];
    function spawnRing(){
      const side=Math.random()<0.5?"left":"right";
      const c=KI_COLORS[Math.floor(Math.random()*KI_COLORS.length)];
      rings.push({x:side==="left"?rand(-60,100):rand(W()-100,W()+60),
        y:rand(H()*0.1,H()*0.9),radius:0,maxRadius:rand(100,240),alpha:0.55,...c});
    }

    /* Lightning */
    const bolts: LightningBolt[] = [];
    function spawnBolt(){
      const c=Math.random()<0.5?{r:255,g:230,b:0}:{r:191,g:95,b:255};
      const corner=Math.floor(Math.random()*4);
      let x1=0,y1=0,x2=0,y2=0;
      const w=W(),h=H();
      if(corner===0){x1=0;y1=0;x2=rand(60,180);y2=rand(60,200);}
      else if(corner===1){x1=w;y1=0;x2=w-rand(60,180);y2=rand(60,200);}
      else if(corner===2){x1=0;y1=h;x2=rand(60,180);y2=h-rand(60,200);}
      else{x1=w;y1=h;x2=w-rand(60,180);y2=h-rand(60,200);}
      bolts.push({segs:lightningPath(x1,y1,x2,y2),life:0,maxLife:28,...c});
    }

    /* Rasengans */
    const rasengans: Rasengan[] = [
      {x:0,y:0,angle:0,      radius:130,alpha:0.72},
      {x:0,y:0,angle:Math.PI,radius:110,alpha:0.68},
    ];

    function drawRasengan(rs: Rasengan){
      const pulse=0.85+0.15*Math.sin(t*0.05+rs.angle);
      ctx.save();
      const auraR=rs.radius*2.2*pulse;
      const aura=ctx.createRadialGradient(rs.x,rs.y,rs.radius*0.3,rs.x,rs.y,auraR);
      aura.addColorStop(0,"rgba(80,220,255,0.28)");
      aura.addColorStop(0.4,"rgba(0,160,255,0.12)");
      aura.addColorStop(1,"rgba(0,80,255,0)");
      ctx.beginPath();ctx.arc(rs.x,rs.y,auraR,0,Math.PI*2);ctx.fillStyle=aura;ctx.fill();

      const sphere=ctx.createRadialGradient(rs.x,rs.y,0,rs.x,rs.y,rs.radius*0.9);
      sphere.addColorStop(0,"rgba(200,240,255,0.45)");
      sphere.addColorStop(0.5,"rgba(0,180,255,0.20)");
      sphere.addColorStop(1,"rgba(0,100,255,0.04)");
      ctx.beginPath();ctx.arc(rs.x,rs.y,rs.radius*0.9,0,Math.PI*2);ctx.fillStyle=sphere;ctx.fill();

      const NUM_ARMS=4,STEPS=100,TURNS=2.0;
      ctx.lineCap="round";ctx.lineJoin="round";
      for(let arm=0;arm<NUM_ARMS;arm++){
        const off=(arm/NUM_ARMS)*Math.PI*2;
        for(let s=0;s<STEPS-1;s++){
          const f1=s/STEPS,f2=(s+1)/STEPS;
          const a1=rs.angle+off+f1*Math.PI*2*TURNS;
          const a2=rs.angle+off+f2*Math.PI*2*TURNS;
          const r1=f1*rs.radius*pulse,r2=f2*rs.radius*pulse;
          const x1=rs.x+Math.cos(a1)*r1,y1=rs.y+Math.sin(a1)*r1;
          const x2=rs.x+Math.cos(a2)*r2,y2=rs.y+Math.sin(a2)*r2;
          const w=Math.max(2,22*(1-f1)*pulse);
          const al=0.90-f1*0.45;
          ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
          ctx.lineWidth=w*2;ctx.strokeStyle=`rgba(0,150,255,${al*0.3})`;ctx.stroke();
          ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
          ctx.lineWidth=w;ctx.strokeStyle=`rgba(30,220,255,${al})`;ctx.stroke();
          ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
          ctx.lineWidth=w*0.4;ctx.strokeStyle=`rgba(255,255,255,${al*0.88})`;ctx.stroke();
        }
      }
      const SPARKS=16;
      for(let i=0;i<SPARKS;i++){
        const a=rs.angle*2.3+(i/SPARKS)*Math.PI*2;
        const d=rs.radius*(0.78+0.3*Math.sin(t*0.07+i));
        const px=rs.x+Math.cos(a)*d*pulse,py=rs.y+Math.sin(a)*d*pulse;
        const sz=3+2*Math.abs(Math.sin(t*0.1+i));
        ctx.beginPath();ctx.arc(px,py,sz,0,Math.PI*2);
        ctx.fillStyle=`rgba(150,230,255,${rs.alpha*0.85})`;ctx.fill();
        ctx.beginPath();ctx.arc(px,py,sz*0.4,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${rs.alpha*0.75})`;ctx.fill();
      }
      const coreR=rs.radius*0.22*pulse;
      const core=ctx.createRadialGradient(rs.x,rs.y,0,rs.x,rs.y,coreR);
      core.addColorStop(0,"rgba(255,255,255,1)");
      core.addColorStop(0.4,"rgba(180,240,255,0.9)");
      core.addColorStop(1,"rgba(0,200,255,0)");
      ctx.beginPath();ctx.arc(rs.x,rs.y,coreR,0,Math.PI*2);ctx.fillStyle=core;ctx.fill();
      ctx.restore();
      rs.angle+=0.05;
    }

    function drawKiOrb(o: KiOrb){
      const pulse=0.7+0.3*Math.sin(t*0.04+o.phase);
      const r=o.radius*pulse,glow=r*3.2;
      const g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,glow);
      g.addColorStop(0,`rgba(${o.r},${o.g},${o.b},0.85)`);
      g.addColorStop(0.3,`rgba(${o.r},${o.g},${o.b},0.35)`);
      g.addColorStop(0.7,`rgba(${o.r},${o.g},${o.b},0.08)`);
      g.addColorStop(1,`rgba(${o.r},${o.g},${o.b},0)`);
      ctx.beginPath();ctx.arc(o.x,o.y,glow,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(o.x,o.y,r*0.32,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.8)";ctx.fill();
    }

    function updateOrbs(){
      const w=W(),h=H();
      for(const o of orbs){
        o.x+=o.vx;o.y+=o.vy;
        if(o.x<-80)o.x=w+60;if(o.x>w+80)o.x=-60;
        if(o.y<-80)o.y=h+60;if(o.y>h+80)o.y=-60;
      }
    }

    function drawParticles(){
      const w=W(),h=H();
      for(const p of particles){
        ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.r},${p.g},${p.b},${p.alpha})`;ctx.fill();
        p.x+=p.vx;p.y+=p.vy;p.alpha-=0.003;
        if(p.y<-10||p.alpha<=0){
          const c=KI_COLORS[Math.floor(Math.random()*KI_COLORS.length)];
          p.x=rand(0,w);p.y=h+10;p.vy=rand(-0.4,-1.2);p.vx=rand(-0.2,0.2);
          p.alpha=rand(0.4,0.85);p.r=c.r;p.g=c.g;p.b=c.b;
        }
      }
    }

    function drawRings(){
      for(let i=rings.length-1;i>=0;i--){
        const r=rings[i];
        ctx.beginPath();ctx.arc(r.x,r.y,r.radius,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${r.r},${r.g},${r.b},${r.alpha})`;
        ctx.lineWidth=2;ctx.stroke();
        r.radius+=1.4;r.alpha-=0.55/r.maxRadius;
        if(r.radius>=r.maxRadius)rings.splice(i,1);
      }
    }

    function drawBolts(){
      for(let i=bolts.length-1;i>=0;i--){
        const b=bolts[i];
        const prog=b.life/b.maxLife;
        const al=prog<0.3?prog/0.3:1-(prog-0.3)/0.7;
        ctx.beginPath();ctx.moveTo(b.segs[0].x,b.segs[0].y);
        for(let s=1;s<b.segs.length;s++)ctx.lineTo(b.segs[s].x,b.segs[s].y);
        ctx.strokeStyle=`rgba(${b.r},${b.g},${b.b},${al*0.3})`;ctx.lineWidth=6;ctx.stroke();
        ctx.strokeStyle=`rgba(255,255,255,${al*0.88})`;ctx.lineWidth=1.5;ctx.stroke();
        b.life++;if(b.life>=b.maxLife)bolts.splice(i,1);
      }
    }

    let ringTimer=0, boltTimer=0;

    function loop(){
      const w=W(),h=H();
      ctx.clearRect(0,0,w,h);

      rasengans[0].x=w*0.10; rasengans[0].y=h*0.18;
      rasengans[1].x=w*0.90; rasengans[1].y=h*0.78;

      ctx.save();ctx.globalAlpha=0.55;
      drawParticles();
      updateOrbs();for(const o of orbs)drawKiOrb(o);
      drawRings();drawBolts();
      ctx.restore();

      for(const rs of rasengans)drawRasengan(rs);

      // Ki Dragon Ball — izquierda media-baja
      drawDragonBallKi(ctx, w * 0.10, h * 0.68, t);

      ringTimer++;if(ringTimer>90){spawnRing();ringTimer=0;}
      boltTimer++;if(boltTimer>170){spawnBolt();boltTimer=0;}
      t++;
      raf=requestAnimationFrame(loop);
    }

    spawnRing();spawnRing();spawnBolt();
    loop();

    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  },[]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" style={{opacity:0.9}} />;
}
