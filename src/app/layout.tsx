import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import SiteShell from "@/components/SiteShell";
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
  title: "Vortex — Descarga series, películas y anime",
  description: "Tu portal de descargas de series, películas y anime en español.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${orbitron.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--bg-base)" }}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
