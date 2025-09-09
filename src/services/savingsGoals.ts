import { db } from "@/lib/db";
import { savingsGoals } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getSavingsGoals(userId: string) {
  try {
    const goals = await db
      .select({
        id: savingsGoals.id,
        userId: savingsGoals.userId,
        accountId: savingsGoals.accountId,
        name: savingsGoals.name,
        targetAmount: savingsGoals.targetAmount,
        currentAmount: savingsGoals.currentAmount,
        targetDate: savingsGoals.targetDate,
        createdAt: savingsGoals.createdAt,
      })
      .from(savingsGoals)
      .where(eq(savingsGoals.userId, userId))
      .orderBy(desc(savingsGoals.createdAt));

    return goals;
  } catch (error) {
    console.error("[savingsGoals] Error fetching savings goals:", error);
    throw new Error("Failed to fetch savings goals");
  }
}

export async function getSavingsGoalById(id: number, userId: string) {
  try {
    const goal = await db
      .select({
        id: savingsGoals.id,
        userId: savingsGoals.userId,
        accountId: savingsGoals.accountId,
        name: savingsGoals.name,
        targetAmount: savingsGoals.targetAmount,
        currentAmount: savingsGoals.currentAmount,
        targetDate: savingsGoals.targetDate,
        createdAt: savingsGoals.createdAt,
      })
      .from(savingsGoals)
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)))
      .limit(1);

    return goal[0] || null;
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
    const newGoal = await db
      .insert(savingsGoals)
      .values({
        userId,
        accountId,
        name,
        targetAmount,
        currentAmount: 0,
        targetDate,
      })
      .returning();

    return newGoal[0];
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
    const updatedGoal = await db
      .update(savingsGoals)
      .set(updates)
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)))
      .returning();

    return updatedGoal[0] || null;
  } catch (error) {
    console.error("[savingsGoals] Error updating savings goal:", error);
    throw new Error("Failed to update savings goal");
  }
}

export async function deleteSavingsGoal(id: number, userId: string) {
  try {
    const deletedGoal = await db
      .delete(savingsGoals)
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)))
      .returning();

    return deletedGoal[0] || null;
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
    const updatedGoal = await db
      .update(savingsGoals)
      .set({ currentAmount })
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)))
      .returning();

    return updatedGoal[0] || null;
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
