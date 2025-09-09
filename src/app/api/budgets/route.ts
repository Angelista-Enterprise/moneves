import { NextRequest, NextResponse } from "next/server";
import { budgetCategories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { selectEncrypted, insertEncrypted } from "@/lib/db/encrypted-db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budgets = await selectEncrypted(
      budgetCategories,
      "budgetCategories",
      {
        where: eq(budgetCategories.userId, session.user.id),
        orderBy: desc(budgetCategories.createdAt),
      }
    );

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

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

    const newBudget = await insertEncrypted(
      budgetCategories,
      "budgetCategories",
      {
        userId: session.user.id,
        name,
        icon: icon || "💰",
        color: color || "text-blue-500",
        monthlyLimit: parseFloat(monthlyLimit),
        spent: 0,
        remaining: parseFloat(monthlyLimit),
        status: "on_track",
        isTracked: Boolean(isTracked),
        isGoalLess: Boolean(isGoalLess),
        priority: 1,
        budgetType: "monthly",
        alertThreshold: 0.8,
        rolloverEnabled: false,
        rolloverAmount: 0,
        averageSpending: 0,
        spendingVariance: 0,
      }
    );

    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
