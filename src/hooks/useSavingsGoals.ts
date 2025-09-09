import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SavingsGoal } from "@/lib/db/schema";

export const savingsGoalsQueryKeys = {
  all: ["savings-goals"] as const,
  byUser: (userId: string) => ["savings-goals", userId] as const,
  byId: (id: number) => ["savings-goals", id] as const,
};

export const useSavingsGoals = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: goals,
    isLoading,
    error,
  } = useQuery<SavingsGoal[]>({
    queryKey: savingsGoalsQueryKeys.byUser(userId),
    queryFn: async () => {
      const response = await fetch("/api/savings-goals");
      if (!response.ok) {
        throw new Error("Failed to fetch savings goals");
      }
      return response.json();
    },
    enabled: !!userId,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: {
      accountId: string;
      name: string;
      targetAmount: number;
      targetDate?: string;
    }) => {
      const response = await fetch("/api/savings-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create savings goal");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savingsGoalsQueryKeys.all });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: {
        name?: string;
        targetAmount?: number;
        currentAmount?: number;
        targetDate?: string;
      };
    }) => {
      const response = await fetch(`/api/savings-goals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update savings goal");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savingsGoalsQueryKeys.all });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/savings-goals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete savings goal");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savingsGoalsQueryKeys.all });
    },
  });

  const updateCurrentAmountMutation = useMutation({
    mutationFn: async ({
      id,
      currentAmount,
    }: {
      id: number;
      currentAmount: number;
    }) => {
      const response = await fetch(`/api/savings-goals/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update savings goal amount"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savingsGoalsQueryKeys.all });
    },
  });

  return {
    goals: goals || [],
    isLoading,
    error,
    createGoal: createGoalMutation.mutateAsync,
    updateGoal: updateGoalMutation.mutateAsync,
    deleteGoal: deleteGoalMutation.mutateAsync,
    updateCurrentAmount: updateCurrentAmountMutation.mutateAsync,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
    isUpdatingAmount: updateCurrentAmountMutation.isPending,
  };
};
