import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import BlogEditor from "@/components/BlogEditor";

export default async function BlogEditorPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <BlogEditor />;
}

