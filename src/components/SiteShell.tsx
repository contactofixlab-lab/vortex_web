"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const AUTH_ROUTES = ["/login", "/registro"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth   = AUTH_ROUTES.includes(pathname);

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="px-3 md:px-6 mt-10 mb-4">
        <div className="glass-card max-w-7xl mx-auto rounded-2xl text-center py-5 text-xs" style={{ color: "var(--text-muted)" }}>
          © 2026 Vortex · Solo para uso personal
        </div>
      </footer>
    </>
  );
}
