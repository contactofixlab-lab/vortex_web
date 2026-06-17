import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Ingresar — Vortex",
  description: "Inicia sesión o regístrate en Vortex para guardar tus favoritos y ver tu historial.",
};

export default function LoginPage() {
  return <LoginForm />;
}
