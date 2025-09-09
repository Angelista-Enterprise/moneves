import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getSavingsGoalById,
  updateSavingsGoal,
  deleteSavingsGoal,
  updateSavingsGoalCurrentAmount,
} from "@/services/savingsGoals";

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
    const goalId = parseInt(id);

    if (isNaN(goalId)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const goal = await getSavingsGoalById(goalId, session.user.id);

    if (!goal) {
      return NextResponse.json(
        { error: "Savings goal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("[API] Error fetching savings goal:", error);
    return NextResponse.json(
      { error: "Failed to fetch savings goal" },
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
    const goalId = parseInt(id);

    if (isNaN(goalId)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, targetAmount, currentAmount, targetDate } = body;

    const updates: {
      name?: string;
      targetAmount?: number;
      currentAmount?: number;
      targetDate?: string;
    } = {};
    if (name !== undefined) updates.name = name;
    if (targetAmount !== undefined) updates.targetAmount = targetAmount;
    if (currentAmount !== undefined) updates.currentAmount = currentAmount;
    if (targetDate !== undefined) updates.targetDate = targetDate;

    const goal = await updateSavingsGoal(goalId, session.user.id, updates);

    if (!goal) {
      return NextResponse.json(
        { error: "Savings goal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("[API] Error updating savings goal:", error);
    return NextResponse.json(
      { error: "Failed to update savings goal" },
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
    const goalId = parseInt(id);

    if (isNaN(goalId)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const goal = await deleteSavingsGoal(goalId, session.user.id);

    if (!goal) {
      return NextResponse.json(
        { error: "Savings goal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error deleting savings goal:", error);
    return NextResponse.json(
      { error: "Failed to delete savings goal" },
      { status: 500 }
    );
  }
}

// Special endpoint to update current amount (for transaction matching)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const goalId = parseInt(id);

    if (isNaN(goalId)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const body = await request.json();
    const { currentAmount } = body;

    if (currentAmount === undefined) {
      return NextResponse.json(
        { error: "Missing currentAmount" },
        { status: 400 }
      );
    }

    const goal = await updateSavingsGoalCurrentAmount(
      goalId,
      session.user.id,
      currentAmount
    );

    if (!goal) {
      return NextResponse.json(
        { error: "Savings goal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("[API] Error updating savings goal amount:", error);
    return NextResponse.json(
      { error: "Failed to update savings goal amount" },
      { status: 500 }
    );
  }
}
