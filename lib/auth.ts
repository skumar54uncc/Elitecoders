import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-this-in-production";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId: string): Promise<string> {
  // Simple session token (in production, use JWT or a proper session store)
  const sessionToken = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  return sessionToken;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  // Extract user ID from session token (simple implementation)
  // In production, use proper JWT or session store
  const userId = sessionToken.split("-")[0];

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

