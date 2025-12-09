import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import CareerEditor from "@/components/CareerEditor";
import { prisma } from "@/lib/prisma";

export default async function EditCareerPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const post = await prisma.careerPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    redirect("/admin?tab=careers");
  }

  return <CareerEditor post={post} />;
}

