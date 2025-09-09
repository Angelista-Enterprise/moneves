import { transactionCategories, TransactionCategory } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import {
  selectEncrypted,
  insertEncrypted,
  selectOneEncrypted,
  updateEncrypted,
} from "@/lib/db/encrypted-db";

// Default categories data
const DEFAULT_CATEGORIES = [
  {
    id: "income",
    name: "Income",
    icon: "TrendingUp",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    isDefault: true,
  },
  {
    id: "housing",
    name: "Housing",
    icon: "Home",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    isDefault: true,
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: "Car",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    isDefault: true,
  },
  {
    id: "food",
    name: "Food & Dining",
    icon: "Utensils",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    isDefault: true,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "Gamepad2",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    isDefault: true,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "Heart",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    isDefault: true,
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "ShoppingBag",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    isDefault: true,
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: "Zap",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    isDefault: true,
  },
  {
    id: "travel",
    name: "Travel",
    icon: "Plane",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    isDefault: true,
  },
  {
    id: "education",
    name: "Education",
    icon: "GraduationCap",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    isDefault: true,
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: "Dumbbell",
    color: "text-lime-500",
    bgColor: "bg-lime-500/10",
    isDefault: true,
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    icon: "Smartphone",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    isDefault: true,
  },
];

/**
 * Initialize default categories in the database
 */
export async function initializeDefaultCategories(): Promise<void> {
  try {
    // Check if categories already exist
    const existingCategories = await selectEncrypted(
      transactionCategories,
      "transactionCategories"
    );

    if (existingCategories.length === 0) {
      // Insert default categories
      for (const category of DEFAULT_CATEGORIES) {
        await insertEncrypted(
          transactionCategories,
          "transactionCategories",
          category
        );
      }
      console.log("[CATEGORIES] Default categories initialized");
    }
  } catch (error) {
    console.error("[CATEGORIES] Error initializing default categories:", error);
    throw error;
  }
}

/**
 * Get all active transaction categories
 */
export async function getTransactionCategories(): Promise<
  TransactionCategory[]
> {
  try {
    const categories = (await selectEncrypted(
      transactionCategories,
      "transactionCategories",
      {
        where: eq(transactionCategories.isActive, true),
        orderBy: asc(transactionCategories.name),
      }
    )) as TransactionCategory[];

    return categories;
  } catch (error) {
    console.error("[CATEGORIES] Error fetching categories:", error);
    throw error;
  }
}

/**
 * Get a specific category by ID
 */
export async function getTransactionCategoryById(
  id: string
): Promise<TransactionCategory | null> {
  try {
    const category = await selectOneEncrypted(
      transactionCategories,
      "transactionCategories",
      eq(transactionCategories.id, id)
    );

    return category as TransactionCategory | null;
  } catch (error) {
    console.error("[CATEGORIES] Error fetching category by ID:", error);
    throw error;
  }
}

/**
 * Create a new transaction category
 */
export async function createTransactionCategory(category: {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}): Promise<TransactionCategory> {
  try {
    const newCategory = (await insertEncrypted(
      transactionCategories,
      "transactionCategories",
      {
        ...category,
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    )) as TransactionCategory;

    return newCategory;
  } catch (error) {
    console.error("[CATEGORIES] Error creating category:", error);
    throw error;
  }
}

/**
 * Update a transaction category
 */
export async function updateTransactionCategory(
  id: string,
  updates: Partial<Omit<TransactionCategory, "id" | "createdAt">>
): Promise<TransactionCategory | null> {
  try {
    await updateEncrypted(
      transactionCategories,
      "transactionCategories",
      updates,
      eq(transactionCategories.id, id)
    );

    // Return the updated category
    return (await selectOneEncrypted(
      transactionCategories,
      "transactionCategories",
      eq(transactionCategories.id, id)
    )) as TransactionCategory | null;
  } catch (error) {
    console.error("[CATEGORIES] Error updating category:", error);
    throw error;
  }
}

/**
 * Delete a transaction category (soft delete by setting isActive to false)
 */
export async function deleteTransactionCategory(id: string): Promise<boolean> {
  try {
    const result = await updateEncrypted(
      transactionCategories,
      "transactionCategories",
      { isActive: false },
      eq(transactionCategories.id, id)
    );

    return result.changes > 0;
  } catch (error) {
    console.error("[CATEGORIES] Error deleting category:", error);
    throw error;
  }
}
