import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@surgicalcoders.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";
  const name = "Admin User";

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Admin user already exists!");
    console.log("Email:", email);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log("Admin user created successfully!");
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("\n⚠️  IMPORTANT: Change the password after first login!");
  console.log("Set ADMIN_PASSWORD environment variable to set a custom password.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

