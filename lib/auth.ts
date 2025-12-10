import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET environment variable is required in production");
}

// Use a default only in development
const SECRET = SESSION_SECRET || "dev-secret-change-in-production";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Creates a signed session token using HMAC
 * Format: userId-timestamp-randomString-signature
 */
export async function createSession(userId: string): Promise<string> {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString("hex");
  const payload = `${userId}-${timestamp}-${randomString}`;
  
  // Create HMAC signature
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");
  
  return `${payload}-${signature}`;
}

/**
 * Verifies and extracts user ID from session token
 */
function verifySessionToken(sessionToken: string): string | null {
  const parts = sessionToken.split("-");
  if (parts.length < 4) {
    return null;
  }
  
  // Extract signature (last part)
  const signature = parts.pop()!;
  // Reconstruct payload
  const payload = parts.join("-");
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");
  
  // Use constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }
  
  // Extract timestamp and check expiration (7 days)
  const timestamp = parseInt(parts[1], 10);
  if (isNaN(timestamp)) {
    return null;
  }
  
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  if (Date.now() - timestamp > maxAge) {
    return null;
  }
  
  return parts[0]; // Return userId
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  // Verify and extract user ID from session token
  const userId = verifySessionToken(sessionToken);
  if (!userId) {
    return null;
  }

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

