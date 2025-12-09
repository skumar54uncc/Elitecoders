import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import BlogEditor from "@/components/BlogEditor";
import { prisma } from "@/lib/prisma";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    redirect("/admin");
  }

  // Parse tags from JSON string for frontend
  let tags: string[] = [];
  try {
    if (typeof post.tags === 'string') {
      tags = JSON.parse(post.tags || '[]');
    } else if (Array.isArray(post.tags)) {
      tags = post.tags;
    }
  } catch {
    tags = [];
  }

  return <BlogEditor post={{ ...post, tags }} />;
}

