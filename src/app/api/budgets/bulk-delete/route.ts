import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { budgetCategories } from "@/lib/db/schema";
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

    // Delete all budget categories for the user
    const deletedBudgets = await db
      .delete(budgetCategories)
      .where(eq(budgetCategories.userId, userId))
      .returning();

    console.log(`[API] Deleted ${deletedBudgets.length} budget categories for user ${userId}`);
    
    return NextResponse.json({ 
      success: true, 
      count: deletedBudgets.length 
    });
  } catch (error) {
    console.error("[API] Error bulk deleting budgets:", error);
    return NextResponse.json(
      { error: "Failed to delete budgets" },
      { status: 500 }
    );
  }
}
