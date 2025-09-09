// API types for savings goals

// Savings goals types
export interface SavingsGoalWithDetails {
  id: number;
  userId: string;
  accountId: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  createdAt: string | null;
  accountName: string;
  progress: number;
  daysRemaining: number | null;
}

export interface CreateSavingsGoalData {
  accountId: number;
  name: string;
  targetAmount: number;
  targetDate?: string;
}