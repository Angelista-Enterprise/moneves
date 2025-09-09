// Database types for budgets and categories

export type BudgetCategory = {
  id: number;
  userId: string;
  name: string;
  icon: string | null;
  color: string | null;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  status: string;
  isTracked: number;
  isGoalLess: number;
  createdAt: string | null;
};

export type NewBudgetCategory = Omit<BudgetCategory, "id" | "createdAt">;