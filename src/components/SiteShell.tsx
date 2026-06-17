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
      <footer
        className="text-center py-6 text-xs mt-8"
        style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border-glass)" }}
      >
        © 2026 Vortex · Solo para uso personal
      </footer>
    </>
  );
}
