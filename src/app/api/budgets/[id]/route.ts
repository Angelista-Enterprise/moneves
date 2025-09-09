import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { budgetCategories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const budget = await db
      .select()
      .from(budgetCategories)
      .where(
        and(
          eq(budgetCategories.id, parseInt(id)),
          eq(budgetCategories.userId, session.user.id)
        )
      )
      .limit(1);

    if (budget.length === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(budget[0]);
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, icon, color, monthlyLimit, isTracked, isGoalLess } = body;

    if (!name || !monthlyLimit) {
      return NextResponse.json(
        { error: "Name and monthly limit are required" },
        { status: 400 }
      );
    }

    const updatedBudget = await db
      .update(budgetCategories)
      .set({
        name,
        icon: icon || "💰",
        color: color || "text-blue-500",
        monthlyLimit: parseFloat(monthlyLimit),
        remaining: parseFloat(monthlyLimit),
        isTracked: Boolean(isTracked),
        isGoalLess: Boolean(isGoalLess),
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(budgetCategories.id, parseInt(id)),
          eq(budgetCategories.userId, session.user.id)
        )
      )
      .returning();

    if (updatedBudget.length === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBudget[0]);
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const deletedBudget = await db
      .delete(budgetCategories)
      .where(
        and(
          eq(budgetCategories.id, parseInt(id)),
          eq(budgetCategories.userId, session.user.id)
        )
      )
      .returning();

    if (deletedBudget.length === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
