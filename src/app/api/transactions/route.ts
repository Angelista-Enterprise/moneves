import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { transactions, budgetCategories, savingsGoals } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  selectEncrypted,
  insertEncrypted,
  selectOneEncrypted,
  updateEncrypted,
} from "@/lib/db/encrypted-db";

// GET /api/transactions - Get all transactions for user
export async function GET() {
  try {
    const session = await auth();

    // For testing purposes, if no session, try to get test user transactions
    let userId = session?.user?.id;
    if (!userId) {
      // Check if we're in development mode and use test user
      if (process.env.NODE_ENV === "development") {
        console.log("[API] No session found, using test user for development");
        userId = "test-user-123";
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const userTransactions = await selectEncrypted(
      transactions,
      "transactions",
      {
        where: eq(transactions.userId, userId),
        orderBy: desc(transactions.date),
      }
    );

    console.log(
      `[API] Found ${userTransactions.length} transactions for user ${userId}`
    );
    return NextResponse.json({ transactions: userTransactions });
  } catch (error) {
    console.error("[API] Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      amount,
      description,
      type,
      date,
      categoryId,
      accountId,
      savingsGoalId,
    } = body;

    // Validate required fields
    if (!amount || !description || !type || !date) {
      return NextResponse.json(
        { error: "Missing required fields: amount, description, type, date" },
        { status: 400 }
      );
    }

    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'income' or 'expense'" },
        { status: 400 }
      );
    }

    // Validate date
    const transactionDate = new Date(date);
    if (isNaN(transactionDate.getTime())) {
      return NextResponse.json(
        { error: "Date must be a valid date" },
        { status: 400 }
      );
    }

    // Check if category exists and belongs to user (if provided)
    if (categoryId) {
      const category = await selectOneEncrypted(
        budgetCategories,
        "budgetCategories",
        and(
          eq(budgetCategories.id, categoryId),
          eq(budgetCategories.userId, session.user.id)
        )!
      );

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
    }

    // Check if savings goal exists and belongs to user (if provided)
    if (savingsGoalId) {
      const goal = await selectOneEncrypted(
        savingsGoals,
        "savingsGoals",
        and(
          eq(savingsGoals.id, savingsGoalId),
          eq(savingsGoals.userId, session.user.id)
        )!
      );

      if (!goal) {
        return NextResponse.json(
          { error: "Savings goal not found" },
          { status: 404 }
        );
      }
    }

    // Create transaction
    const newTransaction = await insertEncrypted(transactions, "transactions", {
      userId: session.user.id,
      amount: numericAmount,
      description,
      type,
      date: transactionDate.toISOString(),
      categoryId: categoryId || null,
      accountId: accountId || null,
    });

    // Update budget category spent amount if category is provided
    if (categoryId) {
      const isExpense = type === "expense";
      const amountToAdd = isExpense ? Math.abs(numericAmount) : 0;

      if (amountToAdd > 0) {
        // Get current category data
        const currentCategory = await selectOneEncrypted(
          budgetCategories,
          "budgetCategories",
          and(
            eq(budgetCategories.id, categoryId),
            eq(budgetCategories.userId, session.user.id)
          )!
        );

        if (currentCategory) {
          await updateEncrypted(
            budgetCategories,
            "budgetCategories",
            {
              spent: (currentCategory.spent as number) + amountToAdd,
              remaining: (currentCategory.remaining as number) - amountToAdd,
              updatedAt: new Date().toISOString(),
            },
            and(
              eq(budgetCategories.id, categoryId),
              eq(budgetCategories.userId, session.user.id)
            )!
          );
        }
      }
    }

    // Update savings goal current amount if savings goal is provided and it's income
    if (savingsGoalId && type === "income") {
      // Get current savings goal data
      const currentGoal = await selectOneEncrypted(
        savingsGoals,
        "savingsGoals",
        and(
          eq(savingsGoals.id, savingsGoalId),
          eq(savingsGoals.userId, session.user.id)
        )!
      );

      if (currentGoal) {
        await updateEncrypted(
          savingsGoals,
          "savingsGoals",
          {
            currentAmount:
              (currentGoal.currentAmount as number) + Math.abs(numericAmount),
          },
          and(
            eq(savingsGoals.id, savingsGoalId),
            eq(savingsGoals.userId, session.user.id)
          )!
        );
      }
    }

    return NextResponse.json({ transaction: newTransaction }, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
