// All mock data constants have been commented out as the application now uses real data from:
// - Bunq API for accounts and transactions
// - Database for budget categories and transaction categories
// - Calculated values for financial metrics

// Account Constants - COMMENTED OUT: Using real Bunq account data
// export const ACCOUNTS = { ... } as const;

// Category Constants - COMMENTED OUT: Using real database categories
// export const CATEGORIES = { ... } as const;

// Budget Constants - COMMENTED OUT: Using real database budget categories
// export const BUDGET_CATEGORIES = [ ... ] as const;

// Transaction Constants - Still used for type definitions
export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export const TRANSACTION_STATUS = {
  COMPLETED: "completed",
  PENDING: "pending",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

// Sample Transactions - COMMENTED OUT: Using real Bunq transaction data
// export const SAMPLE_TRANSACTIONS = [ ... ] as const;

// Financial Overview Constants - COMMENTED OUT: Using calculated values from real data
// export const FINANCIAL_METRICS = { ... } as const;
