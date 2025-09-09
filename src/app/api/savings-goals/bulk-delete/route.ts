import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { savingsGoals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    // Verify the user is deleting their own data
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete all savings goals for the user
    const deletedGoals = await db
      .delete(savingsGoals)
      .where(eq(savingsGoals.userId, userId))
      .returning();

    console.log(`[API] Deleted ${deletedGoals.length} savings goals for user ${userId}`);
    
    return NextResponse.json({ 
      success: true, 
      count: deletedGoals.length 
    });
  } catch (error) {
    console.error("[API] Error bulk deleting savings goals:", error);
    return NextResponse.json(
      { error: "Failed to delete savings goals" },
      { status: 500 }
    );
  }
}
