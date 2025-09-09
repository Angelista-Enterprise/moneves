import { useMemo } from "react";
import { useBunqTransactions } from "./useBunqTransactions";
import { useBunqApiKey } from "./useUserSettings";
import { useTransactions } from "./useTransactions";
import { getTransactionData } from "@/services/transactionData";
import { Transaction } from "@/components/transactions/types";

interface UseUnifiedTransactionsOptions {
  userId?: string;
  accountId?: number;
  perPage?: number;
}

interface UseUnifiedTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  bunqError: string | null;
  dbError: string | null;
  hasBunqTransactions: boolean;
  hasDbTransactions: boolean;
  bunqCount: number;
  dbCount: number;
  refetch: () => void;
}

export function useUnifiedTransactions({
  userId,
  accountId,
  perPage = 100,
}: UseUnifiedTransactionsOptions = {}): UseUnifiedTransactionsReturn {
  const { apiKey: bunqApiKey } = useBunqApiKey(userId || "");

  // Fetch Bunq transactions
  const {
    transactions: bunqTransactions,
    loading: bunqLoading,
    error: bunqError,
    refetch: refetchBunq,
  } = useBunqTransactions(bunqApiKey || undefined, {
    accountId,
    perPage,
    includeInternal: false, // Only regular Bunq transactions
  });

  // Fetch database transactions
  const {
    data: dbTransactions,
    isLoading: dbLoading,
    error: dbError,
    refetch: refetchDb,
  } = useTransactions(userId || "test-user-123");

  // Convert and combine transactions
  const {
    transactions,
    hasBunqTransactions,
    hasDbTransactions,
    bunqCount,
    dbCount,
  } = useMemo(() => {
    // Convert Bunq transactions
    const bunqTransactionData = bunqTransactions
      ? getTransactionData(bunqTransactions)
      : [];

    // Convert database transactions (mark as regular transactions, not internal)
    const dbTransactionData = (dbTransactions || []).map((tx: unknown) => {
      const transaction = tx as {
        id: number;
        amount: number;
        description: string;
        type: string;
        date: string;
        categoryId?: number;
        goalId?: number;
        categoryName?: string;
        accountName?: string;
      };
      return {
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type as "income" | "expense",
        date: transaction.date, // Keep as string to match Transaction interface
        categoryId: transaction.categoryId,
        goalId: transaction.goalId,
        category: transaction.categoryName || "Uncategorized",
        account: transaction.accountName || "Unknown Account",
        status: "completed",
        isInternal: false, // All transactions are regular transactions
      } as Transaction;
    });

    // Combine all transactions
    const allTransactions = [...bunqTransactionData, ...dbTransactionData];

    return {
      transactions: allTransactions,
      hasBunqTransactions: bunqTransactionData.length > 0,
      hasDbTransactions: dbTransactionData.length > 0,
      bunqCount: bunqTransactionData.length,
      dbCount: dbTransactionData.length,
    };
  }, [bunqTransactions, dbTransactions]);

  // Combined loading state
  const loading = bunqLoading || dbLoading;

  // Only show error if both Bunq and database fail
  const error = bunqError && dbError ? "Failed to load transactions" : null;

  // Combined refetch function
  const refetch = () => {
    refetchBunq();
    refetchDb();
  };

  return {
    transactions,
    loading,
    error,
    bunqError: bunqError?.message || null,
    dbError: dbError?.message || null,
    hasBunqTransactions,
    hasDbTransactions,
    bunqCount,
    dbCount,
    refetch,
  };
}
