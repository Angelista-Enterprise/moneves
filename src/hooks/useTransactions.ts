import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const transactionsQueryKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionsQueryKeys.all, "list"] as const,
  list: (userId: string) => [...transactionsQueryKeys.lists(), userId] as const,
  details: () => [...transactionsQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...transactionsQueryKeys.details(), id] as const,
};

export const useTransactions = (userId: string) => {
  return useQuery({
    queryKey: transactionsQueryKeys.list(userId),
    queryFn: async () => {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      return data.transactions;
    },
    enabled: !!userId,
  });
};

export const useCreateTransaction = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: {
      amount: number;
      description: string;
      type: "income" | "expense";
      date: string;
      categoryId?: number | null;
      accountId?: number | null;
      counterparty?: string | null;
      counterpartyAccount?: string | null;
      savingsGoalId?: number | null;
    }) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create transaction");
      }

      const data = await response.json();
      return data.transaction;
    },
    onSuccess: () => {
      // Invalidate all transaction-related queries

      // 1. Database transactions
      queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.list(userId),
      });

      // 2. All Bunq transaction queries (since new transactions might affect the unified view)
      queryClient.invalidateQueries({
        queryKey: ["bunq", "transactions"],
      });

      // 3. Bunq internal transactions
      queryClient.invalidateQueries({
        queryKey: ["bunq", "internal-transactions"],
      });

      // 4. Bunq combined transactions
      queryClient.invalidateQueries({
        queryKey: ["bunq", "combined-transactions"],
      });

      // 5. Budget categories to refresh spent amounts
      queryClient.invalidateQueries({
        queryKey: ["budget-categories"],
      });

      // 6. Savings goals to refresh current amounts
      queryClient.invalidateQueries({
        queryKey: ["savings-goals"],
      });

      // 7. User settings (in case transaction affects account balances)
      queryClient.invalidateQueries({
        queryKey: ["user-settings"],
      });
    },
  });
};

export const useUpdateTransaction = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<{
        amount: number;
        description: string;
        type: "income" | "expense";
        date: string;
        categoryId: number | null;
        accountId: number | null;
        counterparty: string | null;
        counterpartyAccount: string | null;
        savingsGoalId: number | null;
      }>;
    }) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update transaction");
      }

      const data = await response.json();
      return data.transaction;
    },
    onSuccess: (updatedTransaction) => {
      // Update the specific transaction in cache
      queryClient.setQueryData(
        transactionsQueryKeys.detail(updatedTransaction.id),
        updatedTransaction
      );

      // Invalidate all transaction-related queries

      // 1. Database transactions
      queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.list(userId),
      });

      // 2. All Bunq transaction queries
      queryClient.invalidateQueries({
        queryKey: ["bunq", "transactions"],
      });

      // 3. Bunq internal transactions
      queryClient.invalidateQueries({
        queryKey: ["bunq", "internal-transactions"],
      });

      // 4. Bunq combined transactions
      queryClient.invalidateQueries({
        queryKey: ["bunq", "combined-transactions"],
      });

      // 5. Budget categories and savings goals
      queryClient.invalidateQueries({
        queryKey: ["budget-categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["savings-goals"],
      });

      // 6. User settings
      queryClient.invalidateQueries({
        queryKey: ["user-settings"],
      });
    },
  });
};

export const useDeleteTransaction = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete transaction");
      }
    },
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: transactionsQueryKeys.detail(deletedId),
      });

      // Invalidate all transaction-related queries

      // 1. Database transactions
      queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.list(userId),
      });

      // 2. All Bunq transaction queries
      queryClient.invalidateQueries({
        queryKey: ["bunq", "transactions"],
      });

      // 3. Bunq internal transactions
      queryClient.invalidateQueries({
        queryKey: ["bunq", "internal-transactions"],
      });

      // 4. Bunq combined transactions
      queryClient.invalidateQueries({
        queryKey: ["bunq", "combined-transactions"],
      });

      // 5. Budget categories and savings goals
      queryClient.invalidateQueries({
        queryKey: ["budget-categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["savings-goals"],
      });

      // 6. User settings
      queryClient.invalidateQueries({
        queryKey: ["user-settings"],
      });
    },
  });
};
