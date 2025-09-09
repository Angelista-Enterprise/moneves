import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { budgetCategories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { selectEncrypted, insertEncrypted } from "@/lib/db/encrypted-db";

// GET /api/budget-categories - Get all budget categories for user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userBudgetCategories = await selectEncrypted(
      budgetCategories,
      "budgetCategories",
      {
        where: eq(budgetCategories.userId, session.user.id),
        orderBy: desc(budgetCategories.createdAt),
      }
    );

    return NextResponse.json({ budgetCategories: userBudgetCategories });
  } catch (error) {
    console.error("[BUDGET_CATEGORIES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch budget categories" },
      { status: 500 }
    );
  }
}

// POST /api/budget-categories - Create new budget category
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, icon, color, monthlyLimit, isTracked, isGoalLess } = body;

    if (!name || !monthlyLimit) {
      return NextResponse.json(
        { error: "Name and monthly limit are required" },
        { status: 400 }
      );
    }

    const remaining = monthlyLimit; // Initially, remaining = limit

    const newBudgetCategory = await insertEncrypted(
      budgetCategories,
      "budgetCategories",
      {
        userId: session.user.id,
        name,
        icon: icon || null,
        color: color || null,
        monthlyLimit,
        spent: 0,
        remaining,
        status: "on_track",
        isTracked: isTracked ?? true,
        isGoalLess: isGoalLess ?? false,
      }
    );

    return NextResponse.json({ budgetCategory: newBudgetCategory });
  } catch (error) {
    console.error("[BUDGET_CATEGORIES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create budget category" },
      { status: 500 }
    );
  }
}
