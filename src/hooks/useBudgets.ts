import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetCategory } from "@/types/database/budgets";

interface CreateBudgetData {
  name: string;
  icon?: string;
  color?: string;
  monthlyLimit: number;
  isTracked?: boolean;
  isGoalLess?: boolean;
}

interface UpdateBudgetData extends CreateBudgetData {
  id: number;
}

export const useBudgets = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: budgets,
    isLoading,
    error,
  } = useQuery<BudgetCategory[]>({
    queryKey: ["budgets", userId],
    queryFn: async () => {
      const response = await fetch("/api/budgets");
      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }
      return response.json();
    },
    enabled: !!userId,
  });

  const createBudgetMutation = useMutation({
    mutationFn: async (data: CreateBudgetData) => {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create budget");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", userId] });
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: async (data: UpdateBudgetData) => {
      const response = await fetch(`/api/budgets/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update budget");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", userId] });
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete budget");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", userId] });
    },
  });

  return {
    budgets: budgets || [],
    isLoading,
    error,
    createBudget: createBudgetMutation.mutateAsync,
    updateBudget: updateBudgetMutation.mutateAsync,
    deleteBudget: deleteBudgetMutation.mutateAsync,
    isCreating: createBudgetMutation.isPending,
    isUpdating: updateBudgetMutation.isPending,
    isDeleting: deleteBudgetMutation.isPending,
  };
};
