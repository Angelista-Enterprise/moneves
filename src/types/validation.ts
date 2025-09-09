// Validation-related types and interfaces
// These are inferred from Zod schemas

export type BudgetCategoryFormData = {
  name: string;
  icon?: string;
  color?: string;
  monthlyLimit: number;
  isTracked?: boolean;
  isGoalLess?: boolean;
};

export type UpdateBudgetCategoryData = {
  name?: string;
  icon?: string;
  color?: string;
  monthlyLimit?: number;
  isTracked?: boolean;
  isGoalLess?: boolean;
};

export type TransactionFormData = {
  accountId: number;
  categoryId?: number | null;
  amount: number;
  description: string;
  type: "income" | "expense";
  date: string;
  includeInSavingsGoal?: boolean;
};

export type BatchUpdateTransactionData = {
  categoryId?: number | null;
  accountId?: number;
  type?: "income" | "expense";
};

export type AccountFormData = {
  name: string;
  type: "checking" | "savings" | "credit" | "investment" | "cash";
  balance?: number;
  currency?: string;
  iban?: string;
};

export type SavingsGoalFormData = {
  accountId: number;
  name: string;
  targetAmount: number;
  targetDate?: string;
};

export type CsvImportData = {
  hasHeader: boolean;
  delimiter: string;
  encoding: string;
  skipEmptyLines: boolean;
  accountMapping: Record<string, number>;
  categoryMapping: Record<string, number>;
};

// CSV Transaction type for import processing
export interface CSVTransaction {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  counterparty?: string;
  counterpartyAccount?: string;
  originalDescription?: string;
  accountId?: number;
  categoryId?: number;
}
