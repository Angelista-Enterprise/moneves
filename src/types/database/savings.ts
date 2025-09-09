// Database types for savings goals

export type SavingsGoal = {
  id: number;
  userId: string;
  accountId: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  createdAt: string | null;
};

export type NewSavingsGoal = Omit<SavingsGoal, "id" | "createdAt">;