import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { budgetCategories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { CategoryFilter } from "@/services/autoCategorization";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const budgetId = parseInt(resolvedParams.id);
    if (isNaN(budgetId)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    const body = await request.json();
    const { filters }: { filters: CategoryFilter } = body;

    if (!filters) {
      return NextResponse.json(
        { error: "Filters are required" },
        { status: 400 }
      );
    }

    // Verify the budget belongs to the user
    const existingBudget = await db
      .select()
      .from(budgetCategories)
      .where(
        and(
          eq(budgetCategories.id, budgetId),
          eq(budgetCategories.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingBudget.length === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Update the budget with new filters
    await db
      .update(budgetCategories)
      .set({
        autoCategorizeFilters: JSON.stringify(filters),
      })
      .where(
        and(
          eq(budgetCategories.id, budgetId),
          eq(budgetCategories.userId, session.user.id)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating budget filters:", error);
    return NextResponse.json(
      { error: "Failed to update budget filters" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const budgetId = parseInt(resolvedParams.id);
    if (isNaN(budgetId)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    // Get the budget filters
    const budget = await db
      .select({ autoCategorizeFilters: budgetCategories.autoCategorizeFilters })
      .from(budgetCategories)
      .where(
        and(
          eq(budgetCategories.id, budgetId),
          eq(budgetCategories.userId, session.user.id)
        )
      )
      .limit(1);

    if (budget.length === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    const filters = budget[0].autoCategorizeFilters
      ? JSON.parse(budget[0].autoCategorizeFilters)
      : null;

    return NextResponse.json({ filters });
  } catch (error) {
    console.error("Error fetching budget filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget filters" },
      { status: 500 }
    );
  }
}
