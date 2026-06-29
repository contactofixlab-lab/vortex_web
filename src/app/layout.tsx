import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import SiteShell from "@/components/SiteShell";
import { AuthProvider } from "@/components/AuthProvider";
import { getSesion } from "@/lib/auth";
import { getFavoritoIds } from "@/lib/favoritos";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vortex — Descarga Series, Películas y Anime Gratis",
  description: "Descarga gratis tus series, películas y anime favoritas en HD. Catálogo completo, sin límites. Acceso a miles de títulos en español.",
  keywords: "descargar anime, descargar series, descargar películas, anime gratis, series gratis, películas gratis, descarga directa",
  authors: [{ name: "Vortex" }],
  creator: "Vortex",
  publisher: "Vortex",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://vortex-web-beta.vercel.app",
    siteName: "Vortex",
    title: "Vortex — Descarga Series, Películas y Anime Gratis",
    description: "Descarga gratis tus series, películas y anime favoritos en HD.",
    images: [
      {
        url: "https://vortex-web-beta.vercel.app/vortex-logo.png",
        width: 1200,
        height: 630,
        alt: "Vortex",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vortex — Descargas de Anime, Series y Películas",
    description: "Tu portal de descargas en español sin límites",
    images: ["https://vortex-web-beta.vercel.app/vortex-logo.png"],
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const usuario = await getSesion();
  const favoritoIds = usuario ? await getFavoritoIds(usuario.id) : [];

  return (
    <html lang="es" className={`${orbitron.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--bg-base)" }}>
        <AuthProvider usuario={usuario} favoritoIds={favoritoIds}>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
