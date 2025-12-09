import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow access to login page without authentication
  // This will be handled by individual pages

  return <>{children}</>;
}

