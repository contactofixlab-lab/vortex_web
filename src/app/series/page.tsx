import ContentCard from "@/components/ContentCard";
import FiltersPanel from "@/components/FiltersPanel";
import { getSeries } from "@/lib/contenido";

export const metadata = { title: "Series — Vortex" };
export const revalidate = 0;

const GENEROS = ["Todos", "Acción", "Comedia", "Drama", "Terror", "Ciencia ficción", "Historia", "Misterio"];
const AÑOS = ["Todos", "2025", "2024", "2023", "2022", "2021", "2020"];
const IDIOMAS = ["Todos", "Sub español", "Latino", "Castellano", "Dual"];

export default async function SeriesPage() {
  const SERIES = await getSeries();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-1 h-7 rounded-full"
          style={{ background: "var(--neon-cyan)", boxShadow: "0 0 10px var(--neon-cyan)" }}
        />
        <h1
          className="text-3xl font-black tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--neon-cyan)" }}
        >
          SERIES
        </h1>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {SERIES.length} títulos
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:flex-1 lg:min-w-0 order-2 lg:order-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {SERIES.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 order-1 lg:order-2">
          <FiltersPanel genero={GENEROS} año={AÑOS} idioma={IDIOMAS} />
        </aside>
      </div>
    </div>
  );
}
