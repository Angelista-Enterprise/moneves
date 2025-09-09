import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { budgetCategories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/budget-categories/[id] - Get specific budget category
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
    const budgetCategory = await db
      .select()
      .from(budgetCategories)
      .where(
        and(
          eq(budgetCategories.id, parseInt(id)),
          eq(budgetCategories.userId, session.user.id)
        )
      )
      .limit(1);

    if (budgetCategory.length === 0) {
      return NextResponse.json(
        { error: "Budget category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ budgetCategory: budgetCategory[0] });
  } catch (error) {
    console.error("[BUDGET_CATEGORY_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch budget category" },
      { status: 500 }
    );
  }
}

// PUT /api/budget-categories/[id] - Update budget category
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

    // First check if the budget category exists and belongs to the user
    const existingCategory = await db
      .select()
      .from(budgetCategories)
      .where(
        and(
          eq(budgetCategories.id, parseInt(id)),
          eq(budgetCategories.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Budget category not found" },
        { status: 404 }
      );
    }

    // Calculate new remaining amount
    const currentSpent = existingCategory[0].spent;
    const newRemaining = monthlyLimit - currentSpent;

    // Update status based on spending
    let newStatus = "on_track";
    if (currentSpent > monthlyLimit) {
      newStatus = "over_budget";
    } else if (currentSpent > monthlyLimit * 0.8) {
      newStatus = "near_limit";
    }

    const updatedBudgetCategory = await db
      .update(budgetCategories)
      .set({
        name: name || existingCategory[0].name,
        icon: icon !== undefined ? icon : existingCategory[0].icon,
        color: color !== undefined ? color : existingCategory[0].color,
        monthlyLimit: monthlyLimit || existingCategory[0].monthlyLimit,
        remaining: newRemaining,
        status: newStatus,
        isTracked:
          isTracked !== undefined ? isTracked : existingCategory[0].isTracked,
        isGoalLess:
          isGoalLess !== undefined
            ? isGoalLess
            : existingCategory[0].isGoalLess,
      })
      .where(eq(budgetCategories.id, parseInt(id)))
      .returning();

    return NextResponse.json({ budgetCategory: updatedBudgetCategory[0] });
  } catch (error) {
    console.error("[BUDGET_CATEGORY_PUT]", error);
    return NextResponse.json(
      { error: "Failed to update budget category" },
      { status: 500 }
    );
  }
}

// DELETE /api/budget-categories/[id] - Delete budget category
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

    // First check if the budget category exists and belongs to the user
    const existingCategory = await db
      .select()
      .from(budgetCategories)
      .where(
        and(
          eq(budgetCategories.id, parseInt(id)),
          eq(budgetCategories.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Budget category not found" },
        { status: 404 }
      );
    }

    await db
      .delete(budgetCategories)
      .where(eq(budgetCategories.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BUDGET_CATEGORY_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete budget category" },
      { status: 500 }
    );
  }
}
