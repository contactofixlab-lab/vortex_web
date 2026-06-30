import { redirect } from "next/navigation";

export default function ComoDescargarPage() {
  redirect("/nosotros?seccion=descargar");
}
