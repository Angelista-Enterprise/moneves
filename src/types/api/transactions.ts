// API types for transactions

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Transaction types
export interface TransactionWithDetails {
  id: number;
  accountId: number | null;
  categoryId: number | null;
  amount: number;
  description: string;
  type: string;
  date: string;
  categoryName: string | null;
  accountName: string | null;
  counterparty?: string;
  counterpartyAccount?: string;
  originalDescription?: string;
  isImported?: boolean;
  needsAccountMapping?: boolean;
  needsSourceAccountMapping?: boolean;
  sourceAccountId?: number;
  sourceAccountName?: string;
}

export interface ExtendedTransactionWithDetails extends TransactionWithDetails {
  currency?: string;
  status?: string;
  provider?: string;
  suggestedCategory?: string;
  matchedAccount?: import("../database").UserAccount;
}

export interface CreateTransactionData {
  accountId: number;
  categoryId?: number | null;
  amount: number;
  description: string;
  type: "income" | "expense";
  date: string;
  includeInSavingsGoal?: boolean;
}

// Transaction categorization types
export interface TransactionCategorization {
  id: number;
  bunqTransactionId: string;
  categoryId?: number;
  isConfirmed: boolean;
  categoryName?: string;
  mappingId?: number;
}

export interface CreateTransactionCategorizationData {
  bunqTransactionId: string;
  categoryId?: number;
  accountMappingId?: number;
  isConfirmed?: boolean;
}

export interface UpdateTransactionCategorizationData {
  categoryId?: number;
  isConfirmed?: boolean;
}

// Auto-categorization types
export interface CategorySuggestion {
  categoryId?: number;
  categoryName?: string;
  confidence: number;
  reason: string;
}

export interface TransactionForCategorization {
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  userId: string;
}

export interface SanitizedTransaction {
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  userId: string;
  normalizedDescription: string;
  keywords: string[];
}

export interface CategorizationResult {
  transactionId: string;
  suggestedCategory?: CategorySuggestion;
  confidence: number;
  processed: boolean;
  error?: string;
}

// Hook return types
export interface HookReturn<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
