import { db } from "./db";
import { admins } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@gravitasacademy.com";
    const password = process.env.ADMIN_PASSWORD || "AdminPass123!";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    await db.insert(admins).values({
      email,
      password: hashedPassword,
      role: "admin",
    }).onConflictDoNothing();

    console.log("✅ Admin user seeded successfully");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("\n⚠️  Please change the default password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
