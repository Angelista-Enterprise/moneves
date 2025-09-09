"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetCategory, NewBudgetCategory } from "@/types/database/budgets";

const API_BASE = "/api/budget-categories";

// Query keys for budget categories
export const budgetCategoriesQueryKeys = {
  all: ["budget-categories"] as const,
  lists: () => [...budgetCategoriesQueryKeys.all, "list"] as const,
  list: (userId: string) => [...budgetCategoriesQueryKeys.lists(), userId] as const,
  details: () => [...budgetCategoriesQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...budgetCategoriesQueryKeys.details(), id] as const,
};

// Fetch all budget categories for a user
export const useBudgetCategories = (userId: string) => {
  return useQuery({
    queryKey: budgetCategoriesQueryKeys.list(userId),
    queryFn: async (): Promise<BudgetCategory[]> => {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error("Failed to fetch budget categories");
      }
      const data = await response.json();
      return data.budgetCategories;
    },
    enabled: !!userId,
  });
};

// Fetch a specific budget category
export const useBudgetCategory = (id: number, userId: string) => {
  return useQuery({
    queryKey: budgetCategoriesQueryKeys.detail(id),
    queryFn: async (): Promise<BudgetCategory> => {
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch budget category");
      }
      const data = await response.json();
      return data.budgetCategory;
    },
    enabled: !!id && !!userId,
  });
};

// Create a new budget category
export const useCreateBudgetCategory = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategory: Omit<NewBudgetCategory, "userId">): Promise<BudgetCategory> => {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create budget category");
      }

      const data = await response.json();
      return data.budgetCategory;
    },
    onSuccess: () => {
      // Invalidate and refetch budget categories
      queryClient.invalidateQueries({
        queryKey: budgetCategoriesQueryKeys.list(userId),
      });
    },
  });
};

// Update a budget category
export const useUpdateBudgetCategory = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Omit<BudgetCategory, "id" | "userId" | "createdAt">>;
    }): Promise<BudgetCategory> => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update budget category");
      }

      const data = await response.json();
      return data.budgetCategory;
    },
    onSuccess: (updatedCategory) => {
      // Update the specific budget category in cache
      queryClient.setQueryData(
        budgetCategoriesQueryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({
        queryKey: budgetCategoriesQueryKeys.list(userId),
      });
    },
  });
};

// Delete a budget category
export const useDeleteBudgetCategory = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete budget category");
      }
    },
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: budgetCategoriesQueryKeys.detail(deletedId),
      });
      // Invalidate the list
      queryClient.invalidateQueries({
        queryKey: budgetCategoriesQueryKeys.list(userId),
      });
    },
  });
};
