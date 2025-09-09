import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSavingsGoals, createSavingsGoal } from "@/services/savingsGoals";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await getSavingsGoals(session.user.id);
    return NextResponse.json(goals);
  } catch (error) {
    console.error("[API] Error fetching savings goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch savings goals" },
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
    const { accountId, name, targetAmount, targetDate } = body;

    if (!accountId || !name || !targetAmount) {
      return NextResponse.json(
        { error: "Missing required fields: accountId, name, targetAmount" },
        { status: 400 }
      );
    }

    const goal = await createSavingsGoal(
      session.user.id,
      accountId,
      name,
      targetAmount,
      targetDate
    );

    return NextResponse.json(goal);
  } catch (error) {
    console.error("[API] Error creating savings goal:", error);
    return NextResponse.json(
      { error: "Failed to create savings goal" },
      { status: 500 }
    );
  }
}
