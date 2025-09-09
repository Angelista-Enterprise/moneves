import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function seedTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "test@example.com"))
      .limit(1);

    if (existingUser.length > 0) {
      return existingUser[0];
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("password123", 10);

    const testUser = await db
      .insert(users)
      .values({
        id: "test-user-123",
        email: "test@example.com",
        name: "Test User",
        password: hashedPassword,
        currency: "USD",
        locale: "en-US",
        timezone: "UTC",
        dateFormat: "MM/dd/yyyy",
        numberFormat: "US",
        emailNotifications: true,
        budgetAlerts: true,
        goalReminders: true,
        weeklyReports: false,
        dataSharing: false,
        analyticsOptIn: true,
        bunqApiUrl: "http://localhost:8000",
        bunqTransactionLimit: 100,
        subscriptionTier: "free",
        subscriptionStatus: "active",
      })
      .returning();

    return testUser[0];
  } catch (error) {
    console.error("Error creating test user:", error);
    throw error;
  }
}
