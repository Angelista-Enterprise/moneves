// Database types for transactions

export type Transaction = {
  id: number;
  userId: string;
  accountId: number | null;
  categoryId: number | null;
  amount: number;
  description: string;
  type: string;
  date: string;
  createdAt: string | null;
};

export type NewTransaction = Omit<Transaction, "id" | "createdAt">;

export type TransactionCategorization = {
  id: number;
  userId: string;
  bunqTransactionId: string;
  categoryId: number | null;
  accountMappingId: number | null;
  isConfirmed: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NewTransactionCategorization = Omit<
  TransactionCategorization,
  "id" | "createdAt" | "updatedAt"
>;