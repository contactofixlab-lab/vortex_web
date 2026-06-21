"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, PlayCircle, ListVideo, Heart } from "lucide-react";
import type { Contenido } from "@/lib/contenido";
import type { Temporada } from "@/lib/detalle";
import { useAuth } from "./AuthProvider";
import CommentSection from "./CommentSection";

const TIPO_COLOR: Record<string, string> = {
  anime: "var(--neon-violet)",
  serie: "var(--neon-cyan)",
};

const TIPO_LABEL: Record<string, string> = {
  anime: "ANIME",
  serie: "SERIE",
};

const TIPO_BACK: Record<string, string> = {
  anime: "/anime",
  serie: "/series",
};

const TIPO_BACK_LABEL: Record<string, string> = {
  anime: "anime",
  serie: "series",
};

const TABS = [
  { key: "descripcion", label: "Descripción" },
  { key: "ficha", label: "Ficha técnica" },
  { key: "trailer", label: "Tráiler" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const SERVIDORES = [
  { key: "onedrive", label: "OneDrive", color: "var(--server-onedrive)" },
  { key: "gdrive", label: "Google Drive", color: "var(--server-gdrive)" },
  { key: "mega", label: "Mega", color: "var(--server-mega)" },
] as const;

interface Comentario {
  id: number;
  usuarioNombre: string;
  texto: string;
  createdAt: string;
  usuarioId: number;
}

export default function DetalleSerieAnime({
  item,
  temporadas,
  comentarios = [],
}: {
  item: Contenido;
  temporadas: Temporada[];
  comentarios?: Comentario[];
}) {
  const [tab, setTab] = useState<TabKey>("descripcion");
  const [temporadaAbierta, setTemporadaAbierta] = useState(1);
  const { usuario, isFavorito, toggleFavorito } = useAuth();
  const favorito = isFavorito(item.id);

  const color = TIPO_COLOR[item.tipo] ?? "var(--neon-cyan)";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href={TIPO_BACK[item.tipo] ?? "/"}
        className="inline-flex items-center gap-1 text-sm mb-5 transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        <ChevronLeft size={16} /> Volver a {TIPO_BACK_LABEL[item.tipo] ?? item.tipo}
      </Link>

      {/* Bloque superior: poster + info con subsecciones (tabs) */}
      <div className="glass-card rounded-3xl p-5 md:p-7 flex flex-col md:flex-row gap-6 mb-8">
        {/* Poster */}
        <div className="relative w-full md:w-56 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden">
          <Image
            src={item.portada}
            alt={item.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 224px"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
              style={{ background: `${color}22`, color, border: `1px solid ${color}55`, fontFamily: "var(--font-orbitron)" }}
            >
              {TIPO_LABEL[item.tipo]}
            </span>
            {item.estado && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.4)", color: "var(--neon-green)" }}>
                {item.estado}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl md:text-3xl font-black leading-tight" style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}>
              {item.titulo}
            </h1>
            {usuario && (
              <button
                type="button"
                onClick={() => toggleFavorito(item.id)}
                className="flex items-center justify-center rounded-full shrink-0 transition-transform hover:scale-110"
                style={{
                  width: 36, height: 36,
                  background: favorito ? "rgba(255,79,216,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${favorito ? "var(--neon-pink)" : "var(--border-glass)"}`,
                }}
                aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart size={16} fill={favorito ? "var(--neon-pink)" : "none"} style={{ color: favorito ? "var(--neon-pink)" : "var(--text-secondary)" }} />
              </button>
            )}
          </div>

          {/* Subsecciones — tabs modernos: solo una visible a la vez */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-all"
                  style={{
                    fontFamily: "var(--font-orbitron)",
                    color: active ? "var(--neon-yellow)" : "var(--text-secondary)",
                    background: active ? "rgba(255,212,71,0.12)" : "rgba(255,255,255,0.04)",
                    border: active ? "1px solid rgba(255,212,71,0.3)" : "1px solid var(--border-glass)",
                    boxShadow: active ? "0 0 10px rgba(255,212,71,0.18)" : "none",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {tab === "descripcion" && (
            <div>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                {item.descripcion}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {item.genero.map((g) => (
                  <span key={g} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tab === "ficha" && (
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
              <Ficha label="Tipo" value={TIPO_LABEL[item.tipo] ?? item.tipo} />
              <Ficha label="Año" value={String(item.año)} />
              <Ficha label="Idioma" value={item.idioma} />
              {item.estado && <Ficha label="Estado" value={item.estado} />}
              {item.episodios !== undefined && <Ficha label="Episodios" value={String(item.episodios)} />}
              <Ficha label="Géneros" value={item.genero.join(", ")} />
            </dl>
          )}

          {tab === "trailer" && (
            <div
              className="rounded-xl flex flex-col items-center justify-center gap-2 py-10"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed var(--border-glass)" }}
            >
              <PlayCircle size={28} style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>Tráiler próximamente</span>
            </div>
          )}
        </div>
      </div>

      {/* Acordeón de temporadas */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <h2 className="text-lg font-bold tracking-widest" style={{ fontFamily: "var(--font-orbitron)", color }}>
          EPISODIOS
        </h2>
      </div>

      {temporadas.length === 0 && (
        <div
          className="glass-card rounded-2xl flex flex-col items-center justify-center gap-2 py-10"
          style={{ color: "var(--text-muted)" }}
        >
          <ListVideo size={28} style={{ opacity: 0.4 }} />
          <span className="text-sm">Todavía no hay episodios cargados para este título.</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {temporadas.map((temp) => {
          const abierta = temporadaAbierta === temp.numero;
          return (
            <div key={temp.numero} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setTemporadaAbierta(abierta ? -1 : temp.numero)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-bold text-sm" style={{ color: "var(--text-primary)", fontFamily: "var(--font-orbitron)" }}>
                  {temp.titulo}{" "}
                  <span className="font-normal" style={{ color: "var(--text-muted)" }}>
                    · {temp.episodios.length} ep.
                  </span>
                </span>
                <ChevronDown
                  size={18}
                  style={{ color: "var(--text-secondary)", transform: abierta ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                />
              </button>

              {abierta && (
                <div className="px-5 pb-4 flex flex-col gap-2">
                  {temp.episodios.map((ep) => (
                    <div
                      key={ep.numero}
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                          {ep.numero}. {ep.titulo}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{ep.duracion}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {SERVIDORES.filter((s) => ep.servidores[s.key]).map((s) => (
                          <a
                            key={s.key}
                            href={ep.servidores[s.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-transform hover:-translate-y-0.5"
                            style={{ background: `${s.color}1f`, color: s.color, border: `1px solid ${s.color}55` }}
                          >
                            {s.label}
                          </a>
                        ))}
                        {SERVIDORES.every((s) => !ep.servidores[s.key]) && (
                          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Sin servidores cargados</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sección de comentarios */}
      <CommentSection contenidoId={Number(item.id)} comentariosIniciales={comentarios} />
    </div>
  );
}

function Ficha({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</dt>
      <dd style={{ color: "var(--text-primary)" }}>{value}</dd>
    </div>
  );
}
