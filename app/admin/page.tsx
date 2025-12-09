import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import AdminDashboard from "@/components/AdminDashboard";
import { Loader2 } from "lucide-react";

function AdminDashboardSuspense() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminDashboardSuspense />;
}

