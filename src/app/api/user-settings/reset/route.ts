import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    // Verify the user is resetting their own settings
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Reset user settings to defaults (keep essential fields)
    const updatedUser = await db
      .update(users)
      .set({
        // Reset to default values
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
        bunqApiKey: null,
        bunqApiUrl: "http://localhost:8000",
        bunqTransactionLimit: 100,
      })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[API] Reset settings for user ${userId}`);
    
    return NextResponse.json({ 
      success: true,
      message: "Settings reset to defaults"
    });
  } catch (error) {
    console.error("[API] Error resetting user settings:", error);
    return NextResponse.json(
      { error: "Failed to reset settings" },
      { status: 500 }
    );
  }
}
