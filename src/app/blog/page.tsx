import { redirect } from "next/navigation";

export default function BlogPage() {
  redirect("/nosotros?seccion=blog");
}
