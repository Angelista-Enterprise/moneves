import { savingsGoals } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { selectEncrypted, selectOneEncrypted, insertEncrypted, updateEncrypted, deleteEncrypted } from "@/lib/db/encrypted-db";

export async function getSavingsGoals(userId: string) {
  try {
    const goals = await selectEncrypted(savingsGoals, "savingsGoals", {
      where: eq(savingsGoals.userId, userId),
      orderBy: desc(savingsGoals.createdAt),
    });

    return goals;
  } catch (error) {
    console.error("[savingsGoals] Error fetching savings goals:", error);
    throw new Error("Failed to fetch savings goals");
  }
}

export async function getSavingsGoalById(id: number, userId: string) {
  try {
    const goal = await selectOneEncrypted(
      savingsGoals,
      "savingsGoals",
      and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId))!
    );

    return goal;
  } catch (error) {
    console.error("[savingsGoals] Error fetching savings goal:", error);
    throw new Error("Failed to fetch savings goal");
  }
}

export async function createSavingsGoal(
  userId: string,
  accountId: string,
  name: string,
  targetAmount: number,
  targetDate?: string
) {
  try {
    const newGoal = await insertEncrypted(savingsGoals, "savingsGoals", {
      userId,
      accountId,
      name,
      targetAmount,
      currentAmount: 0,
      targetDate,
    });

    return newGoal;
  } catch (error) {
    console.error("[savingsGoals] Error creating savings goal:", error);
    throw new Error("Failed to create savings goal");
  }
}

export async function updateSavingsGoal(
  id: number,
  userId: string,
  updates: {
    name?: string;
    targetAmount?: number;
    currentAmount?: number;
    targetDate?: string;
  }
) {
  try {
    await updateEncrypted(
      savingsGoals,
      "savingsGoals",
      updates,
      and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId))!
    );

    // Return the updated goal by fetching it
    return await getSavingsGoalById(id, userId);
  } catch (error) {
    console.error("[savingsGoals] Error updating savings goal:", error);
    throw new Error("Failed to update savings goal");
  }
}

export async function deleteSavingsGoal(id: number, userId: string) {
  try {
    // Get the goal before deleting for return value
    const goal = await getSavingsGoalById(id, userId);
    
    await deleteEncrypted(
      savingsGoals,
      and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId))!
    );

    return goal;
  } catch (error) {
    console.error("[savingsGoals] Error deleting savings goal:", error);
    throw new Error("Failed to delete savings goal");
  }
}

export async function updateSavingsGoalCurrentAmount(
  id: number,
  userId: string,
  currentAmount: number
) {
  try {
    await updateEncrypted(
      savingsGoals,
      "savingsGoals",
      { currentAmount },
      and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId))!
    );

    // Return the updated goal by fetching it
    return await getSavingsGoalById(id, userId);
  } catch (error) {
    console.error("[savingsGoals] Error updating savings goal amount:", error);
    throw new Error("Failed to update savings goal amount");
  }
}

// Helper function to calculate progress percentage
export function calculateSavingsGoalProgress(
  currentAmount: number,
  targetAmount: number
): number {
  if (targetAmount <= 0) return 0;
  return Math.min((currentAmount / targetAmount) * 100, 100);
}

// Helper function to determine goal status
export function getSavingsGoalStatus(
  currentAmount: number,
  targetAmount: number,
  targetDate?: string
): "on_track" | "behind" | "ahead" | "completed" {
  const progress = calculateSavingsGoalProgress(currentAmount, targetAmount);

  if (progress >= 100) return "completed";

  if (targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    const daysRemaining = Math.ceil(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysElapsed = Math.ceil(
      (now.getTime() - new Date().setMonth(new Date().getMonth() - 12)) /
        (1000 * 60 * 60 * 24)
    );
    const expectedProgress = Math.min(
      (daysElapsed / (daysElapsed + daysRemaining)) * 100,
      100
    );

    if (progress < expectedProgress - 10) return "behind";
    if (progress > expectedProgress + 10) return "ahead";
  }

  return "on_track";
}
