import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import CareerEditor from "@/components/CareerEditor";

export default async function CareerEditorPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <CareerEditor />;
}

