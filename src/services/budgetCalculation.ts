import { BudgetCategory } from "@/types/database/budgets";
import { Transaction } from "@/components/transactions/types";

// Map Bunq transaction descriptions to budget categories
const getCategoryFromDescription = (description: string): string => {
  const desc = description.toLowerCase();

  if (
    desc.includes("salary") ||
    desc.includes("income") ||
    desc.includes("deposit") ||
    desc.includes("payroll")
  )
    return "income";

  if (
    desc.includes("rent") ||
    desc.includes("housing") ||
    desc.includes("mortgage") ||
    desc.includes("utilities") ||
    desc.includes("electricity") ||
    desc.includes("water") ||
    desc.includes("gas") ||
    desc.includes("internet")
  )
    return "housing";

  if (
    desc.includes("food") ||
    desc.includes("restaurant") ||
    desc.includes("grocery") ||
    desc.includes("coffee") ||
    desc.includes("starbucks") ||
    desc.includes("dining") ||
    desc.includes("pizza") ||
    desc.includes("delivery")
  )
    return "food";

  if (
    desc.includes("gas") ||
    desc.includes("car") ||
    desc.includes("transport") ||
    desc.includes("uber") ||
    desc.includes("lyft") ||
    desc.includes("taxi") ||
    desc.includes("insurance") ||
    desc.includes("parking")
  )
    return "transportation";

  if (
    desc.includes("netflix") ||
    desc.includes("spotify") ||
    desc.includes("subscription") ||
    desc.includes("premium") ||
    desc.includes("monthly")
  )
    return "subscriptions";

  if (
    desc.includes("shopping") ||
    desc.includes("amazon") ||
    desc.includes("target") ||
    desc.includes("walmart") ||
    desc.includes("clothing") ||
    desc.includes("electronics")
  )
    return "shopping";

  if (
    desc.includes("medical") ||
    desc.includes("doctor") ||
    desc.includes("pharmacy") ||
    desc.includes("hospital") ||
    desc.includes("health") ||
    desc.includes("dental")
  )
    return "healthcare";

  if (
    desc.includes("gym") ||
    desc.includes("fitness") ||
    desc.includes("workout") ||
    desc.includes("yoga")
  )
    return "fitness";

  if (
    desc.includes("travel") ||
    desc.includes("flight") ||
    desc.includes("hotel") ||
    desc.includes("vacation") ||
    desc.includes("booking")
  )
    return "travel";

  if (
    desc.includes("entertainment") ||
    desc.includes("movie") ||
    desc.includes("game") ||
    desc.includes("concert") ||
    desc.includes("theater")
  )
    return "entertainment";

  if (
    desc.includes("education") ||
    desc.includes("course") ||
    desc.includes("school") ||
    desc.includes("university") ||
    desc.includes("learning")
  )
    return "education";

  // Default fallback
  return "miscellaneous";
};

// Calculate spent amount for a budget category from Bunq transactions
export const calculateSpentAmount = (
  budgetCategory: BudgetCategory,
  transactions: Transaction[]
): number => {
  const currentMonth = new Date();
  const currentMonthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const currentMonthEnd = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  // Filter transactions for current month and expenses only
  const monthlyExpenses = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const amount = tx.amount;
    return (
      txDate >= currentMonthStart && txDate <= currentMonthEnd && amount < 0 // Only expenses
    );
  });

  // Calculate spent amount for this category
  const spentAmount = monthlyExpenses
    .filter((tx) => {
      const categoryFromDescription = getCategoryFromDescription(
        tx.description
      );
      return categoryFromDescription === budgetCategory.name.toLowerCase();
    })
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return spentAmount;
};

// Update budget category with calculated spent amount
export const updateBudgetCategorySpent = (
  budgetCategory: BudgetCategory,
  transactions: Transaction[]
): BudgetCategory => {
  const spentAmount = calculateSpentAmount(budgetCategory, transactions);
  const remaining = budgetCategory.monthlyLimit - spentAmount;

  // Determine status based on spending
  let status = "on_track";
  if (spentAmount > budgetCategory.monthlyLimit) {
    status = "over_budget";
  } else if (spentAmount > budgetCategory.monthlyLimit * 0.8) {
    status = "near_limit";
  }

  return {
    ...budgetCategory,
    spent: spentAmount,
    remaining,
    status,
  };
};

// Calculate progress percentage for a budget category
export const calculateProgressPercentage = (
  budgetCategory: BudgetCategory
): number => {
  if (budgetCategory.monthlyLimit === 0) return 0;
  return Math.round((budgetCategory.spent / budgetCategory.monthlyLimit) * 100);
};

// Get status color for a budget category
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "over_budget":
      return "text-red-500";
    case "near_limit":
      return "text-yellow-500";
    case "on_track":
    default:
      return "text-green-500";
  }
};

// Get status background color for a budget category
export const getStatusBgColor = (status: string): string => {
  switch (status) {
    case "over_budget":
      return "bg-red-500/10";
    case "near_limit":
      return "bg-yellow-500/10";
    case "on_track":
    default:
      return "bg-green-500/10";
  }
};
