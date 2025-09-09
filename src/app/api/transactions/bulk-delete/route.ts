import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
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

    // Delete all transactions for the user
    const deletedTransactions = await db
      .delete(transactions)
      .where(eq(transactions.userId, userId))
      .returning();

    console.log(`[API] Deleted ${deletedTransactions.length} transactions for user ${userId}`);
    
    return NextResponse.json({ 
      success: true, 
      count: deletedTransactions.length 
    });
  } catch (error) {
    console.error("[API] Error bulk deleting transactions:", error);
    return NextResponse.json(
      { error: "Failed to delete transactions" },
      { status: 500 }
    );
  }
}
