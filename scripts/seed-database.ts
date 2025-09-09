#!/usr/bin/env tsx

/**
 * Comprehensive Database Seed Script
 *
 * This script creates a complete test dataset for the Claru application including:
 * - Test user with realistic settings
 * - Budget categories with various spending patterns
 * - Savings goals with progress tracking
 * - Manual transactions with proper categorization
 * - Transaction categories for auto-categorization
 * - Account mappings for Bunq integration
 *
 * Usage: npx tsx scripts/seed-database.ts
 */

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import {
  users,
  userAccounts,
  budgetCategories,
  transactions,
  savingsGoals,
  transactionCategories,
  accountMappings,
  transactionCategorizations,
  budgetAchievements,
  budgetInsights,
} from "../src/lib/db/schema";
import { DatabaseEncryptionService } from "../src/lib/encryption/service";
import bcrypt from "bcryptjs";

// Test user ID - consistent across all data
const TEST_USER_ID = "test-user-12345";
const TEST_ACCOUNT_ID = "bunq-account-67890";

// Helper function to generate dates
const getDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// Helper function to generate random boolean
const randomBool = () => Math.random() > 0.5;

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  // Create database connection
  const client = createClient({
    url: "file:sqlite.db",
  });
  const db = drizzle(client, {
    schema: {
      users,
      userAccounts,
      budgetCategories,
      transactions,
      savingsGoals,
      transactionCategories,
      accountMappings,
      transactionCategorizations,
      budgetAchievements,
      budgetInsights,
    },
  });

  try {
    // Clear existing test data
    console.log("🧹 Clearing existing test data...");
    await db
      .delete(transactionCategorizations)
      .where(sql`user_id = ${TEST_USER_ID}`);
    await db.delete(transactions).where(sql`user_id = ${TEST_USER_ID}`);
    await db.delete(savingsGoals).where(sql`user_id = ${TEST_USER_ID}`);
    await db.delete(budgetCategories).where(sql`user_id = ${TEST_USER_ID}`);
    await db.delete(accountMappings).where(sql`user_id = ${TEST_USER_ID}`);
    await db.delete(userAccounts).where(sql`user_id = ${TEST_USER_ID}`);
    await db.delete(users).where(sql`id = ${TEST_USER_ID}`);

    // Clear transaction categories (they might already exist)
    await db.delete(transactionCategories);

    // 1. Create test user
    console.log("👤 Creating test user...");
    const hashedPassword = await bcrypt.hash("testpassword123", 10);

    const userData = {
      id: TEST_USER_ID,
      email: "test@moneves.com",
      name: "Test User",
      password: hashedPassword,
      emailVerified: new Date().toISOString(),
      subscriptionTier: "premium",
      subscriptionStatus: "active",
      subscriptionStartDate: getDate(30),
      currency: "EUR",
      locale: "en-US",
      timezone: "Europe/Amsterdam",
      dateFormat: "dd/MM/yyyy",
      numberFormat: "EU",
      emailNotifications: true,
      budgetAlerts: true,
      goalReminders: true,
      weeklyReports: true,
      dataSharing: false,
      analyticsOptIn: true,
      bunqApiKey: null,
      bunqApiUrl: "https://api.bunq.com",
      bunqTransactionLimit: 100,
      setupCompleted: true,
    };

    const encryptedUserData = DatabaseEncryptionService.encryptForSave(
      "users",
      userData
    );
    await db.insert(users).values(encryptedUserData);

    // 2. Create user accounts
    console.log("🏦 Creating user accounts...");
    const userAccountsData = [
      {
        userId: TEST_USER_ID,
        name: "Main Checking Account",
        type: "checking",
        balance: 2500.75,
        currency: "EUR",
        iban: "NL91ABNA0417164300",
      },
      {
        userId: TEST_USER_ID,
        name: "Savings Account",
        type: "savings",
        balance: 15000.0,
        currency: "EUR",
        iban: "NL91ABNA0417164301",
      },
      {
        userId: TEST_USER_ID,
        name: "Credit Card",
        type: "credit",
        balance: -1250.3,
        currency: "EUR",
        iban: "NL91ABNA0417164302",
      },
    ];

    const encryptedUserAccountsData = userAccountsData.map((account) =>
      DatabaseEncryptionService.encryptForSave("userAccounts", account)
    );

    const userAccountIds = await db
      .insert(userAccounts)
      .values(encryptedUserAccountsData)
      .returning({ id: userAccounts.id });

    // 3. Create account mappings for Bunq integration
    console.log("🔗 Creating account mappings...");
    const accountMappingData = {
      userId: TEST_USER_ID,
      bunqAccountId: TEST_ACCOUNT_ID,
      bunqAccountName: "Main Account",
      bunqAccountType: "checking",
      bunqAccountIban: "NL91ABNA0417164300",
      userAccountId: userAccountIds[0].id,
      isActive: true,
    };

    const encryptedAccountMappingData =
      DatabaseEncryptionService.encryptForSave(
        "accountMappings",
        accountMappingData
      );
    const accountMappingResult = await db
      .insert(accountMappings)
      .values(encryptedAccountMappingData)
      .returning({ id: accountMappings.id });
    const accountMappingId = accountMappingResult[0].id;

    // 4. Create transaction categories
    console.log("📂 Creating transaction categories...");
    const transactionCategoriesData = [
      // Income categories
      {
        id: "salary",
        name: "Salary",
        icon: "Briefcase",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "freelance",
        name: "Freelance",
        icon: "Laptop",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "investment",
        name: "Investment",
        icon: "TrendingUp",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "bonus",
        name: "Bonus",
        icon: "Gift",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        isDefault: true,
        isActive: true,
      },

      // Expense categories
      {
        id: "housing",
        name: "Housing",
        icon: "Home",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "groceries",
        name: "Groceries",
        icon: "ShoppingCart",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "transport",
        name: "Transport",
        icon: "Car",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "entertainment",
        name: "Entertainment",
        icon: "Film",
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "healthcare",
        name: "Healthcare",
        icon: "Heart",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "utilities",
        name: "Utilities",
        icon: "Zap",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "shopping",
        name: "Shopping",
        icon: "ShoppingBag",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "dining",
        name: "Dining Out",
        icon: "Utensils",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "education",
        name: "Education",
        icon: "BookOpen",
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "travel",
        name: "Travel",
        icon: "Plane",
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        isDefault: true,
        isActive: true,
      },
      {
        id: "subscriptions",
        name: "Subscriptions",
        icon: "CreditCard",
        color: "text-gray-500",
        bgColor: "bg-gray-500/10",
        isDefault: true,
        isActive: true,
      },
    ];

    const encryptedTransactionCategoriesData = transactionCategoriesData.map(
      (category) =>
        DatabaseEncryptionService.encryptForSave(
          "transactionCategories",
          category
        )
    );

    await db
      .insert(transactionCategories)
      .values(encryptedTransactionCategoriesData);

    // 5. Create budget categories
    console.log("💰 Creating budget categories...");
    const budgetCategoriesData = [
      {
        userId: TEST_USER_ID,
        name: "Housing & Rent",
        icon: "Home",
        color: "text-red-500",
        monthlyLimit: 1200.0,
        spent: 1150.0,
        remaining: 50.0,
        status: "near_limit",
        isTracked: true,
        priority: 5,
        budgetType: "monthly",
        alertThreshold: 0.8,
        rolloverEnabled: false,
        savingsGoal: 0,
        spendingPattern: "consistent",
        lastResetDate: getDate(1),
        averageSpending: 1150.0,
        spendingVariance: 50.0,
      },
      {
        userId: TEST_USER_ID,
        name: "Groceries",
        icon: "ShoppingCart",
        color: "text-orange-500",
        monthlyLimit: 400.0,
        spent: 320.5,
        remaining: 79.5,
        status: "on_track",
        isTracked: true,
        priority: 4,
        budgetType: "monthly",
        alertThreshold: 0.8,
        rolloverEnabled: true,
        savingsGoal: 50.0,
        spendingPattern: "consistent",
        lastResetDate: getDate(1),
        averageSpending: 320.5,
        spendingVariance: 25.0,
      },
      {
        userId: TEST_USER_ID,
        name: "Transportation",
        icon: "Car",
        color: "text-blue-500",
        monthlyLimit: 300.0,
        spent: 280.75,
        remaining: 19.25,
        status: "near_limit",
        isTracked: true,
        priority: 4,
        budgetType: "monthly",
        alertThreshold: 0.8,
        rolloverEnabled: false,
        savingsGoal: 0,
        spendingPattern: "consistent",
        lastResetDate: getDate(1),
        averageSpending: 280.75,
        spendingVariance: 30.0,
      },
      {
        userId: TEST_USER_ID,
        name: "Entertainment",
        icon: "Film",
        color: "text-pink-500",
        monthlyLimit: 200.0,
        spent: 150.25,
        remaining: 49.75,
        status: "on_track",
        isTracked: true,
        priority: 2,
        budgetType: "monthly",
        alertThreshold: 0.8,
        rolloverEnabled: true,
        savingsGoal: 0,
        spendingPattern: "sporadic",
        lastResetDate: getDate(1),
        averageSpending: 150.25,
        spendingVariance: 75.0,
      },
      {
        userId: TEST_USER_ID,
        name: "Healthcare",
        icon: "Heart",
        color: "text-red-500",
        monthlyLimit: 150.0,
        spent: 45.0,
        remaining: 105.0,
        status: "on_track",
        isTracked: true,
        priority: 3,
        budgetType: "monthly",
        alertThreshold: 0.8,
        rolloverEnabled: true,
        savingsGoal: 0,
        spendingPattern: "sporadic",
        lastResetDate: getDate(1),
        averageSpending: 45.0,
        spendingVariance: 20.0,
      },
      {
        userId: TEST_USER_ID,
        name: "Shopping",
        icon: "ShoppingBag",
        color: "text-purple-500",
        monthlyLimit: 300.0,
        spent: 450.0,
        remaining: -150.0,
        status: "over_budget",
        isTracked: true,
        priority: 1,
        budgetType: "monthly",
        alertThreshold: 0.8,
        rolloverEnabled: false,
        savingsGoal: 0,
        spendingPattern: "trending_up",
        lastResetDate: getDate(1),
        averageSpending: 450.0,
        spendingVariance: 100.0,
      },
    ];

    const encryptedBudgetCategoriesData = budgetCategoriesData.map((category) =>
      DatabaseEncryptionService.encryptForSave("budgetCategories", category)
    );

    const budgetCategoryIds = await db
      .insert(budgetCategories)
      .values(encryptedBudgetCategoriesData)
      .returning({ id: budgetCategories.id });

    // 6. Create savings goals
    console.log("🎯 Creating savings goals...");
    const savingsGoalsData = [
      {
        userId: TEST_USER_ID,
        accountId: TEST_ACCOUNT_ID,
        name: "Emergency Fund",
        targetAmount: 10000.0,
        currentAmount: 7500.0,
        targetDate: getDate(-90), // 3 months from now
      },
      {
        userId: TEST_USER_ID,
        accountId: TEST_ACCOUNT_ID,
        name: "Vacation to Japan",
        targetAmount: 5000.0,
        currentAmount: 3200.0,
        targetDate: getDate(-180), // 6 months from now
      },
      {
        userId: TEST_USER_ID,
        accountId: TEST_ACCOUNT_ID,
        name: "New Laptop",
        targetAmount: 2000.0,
        currentAmount: 1800.0,
        targetDate: getDate(-30), // 1 month from now
      },
      {
        userId: TEST_USER_ID,
        accountId: TEST_ACCOUNT_ID,
        name: "Home Down Payment",
        targetAmount: 50000.0,
        currentAmount: 12500.0,
        targetDate: getDate(-365), // 1 year from now
      },
    ];

    const encryptedSavingsGoalsData = savingsGoalsData.map((goal) =>
      DatabaseEncryptionService.encryptForSave("savingsGoals", goal)
    );

    await db.insert(savingsGoals).values(encryptedSavingsGoalsData);

    // 7. Create manual transactions
    console.log("💳 Creating manual transactions...");
    const transactionData = [
      // Income transactions
      {
        amount: 3500.0,
        description: "Monthly Salary",
        type: "income",
        categoryId: budgetCategoryIds[0].id,
        daysAgo: 5,
      },
      {
        amount: 500.0,
        description: "Freelance Project",
        type: "income",
        categoryId: budgetCategoryIds[1].id,
        daysAgo: 12,
      },
      {
        amount: 200.0,
        description: "Investment Dividend",
        type: "income",
        categoryId: budgetCategoryIds[2].id,
        daysAgo: 8,
      },

      // Housing expenses
      {
        amount: -1200.0,
        description: "Monthly Rent",
        type: "expense",
        categoryId: budgetCategoryIds[0].id,
        daysAgo: 3,
      },
      {
        amount: -150.0,
        description: "Electricity Bill",
        type: "expense",
        categoryId: budgetCategoryIds[0].id,
        daysAgo: 7,
      },
      {
        amount: -80.0,
        description: "Internet Bill",
        type: "expense",
        categoryId: budgetCategoryIds[0].id,
        daysAgo: 10,
      },

      // Grocery expenses
      {
        amount: -85.5,
        description: "Weekly Groceries",
        type: "expense",
        categoryId: budgetCategoryIds[1].id,
        daysAgo: 1,
      },
      {
        amount: -92.3,
        description: "Grocery Shopping",
        type: "expense",
        categoryId: budgetCategoryIds[1].id,
        daysAgo: 8,
      },
      {
        amount: -67.2,
        description: "Supermarket Run",
        type: "expense",
        categoryId: budgetCategoryIds[1].id,
        daysAgo: 15,
      },
      {
        amount: -75.5,
        description: "Organic Food Store",
        type: "expense",
        categoryId: budgetCategoryIds[1].id,
        daysAgo: 22,
      },

      // Transportation expenses
      {
        amount: -45.0,
        description: "Gas Station",
        type: "expense",
        categoryId: budgetCategoryIds[2].id,
        daysAgo: 2,
      },
      {
        amount: -25.5,
        description: "Public Transport",
        type: "expense",
        categoryId: budgetCategoryIds[2].id,
        daysAgo: 4,
      },
      {
        amount: -60.0,
        description: "Car Insurance",
        type: "expense",
        categoryId: budgetCategoryIds[2].id,
        daysAgo: 6,
      },
      {
        amount: -35.0,
        description: "Parking Fee",
        type: "expense",
        categoryId: budgetCategoryIds[2].id,
        daysAgo: 9,
      },
      {
        amount: -40.0,
        description: "Uber Ride",
        type: "expense",
        categoryId: budgetCategoryIds[2].id,
        daysAgo: 11,
      },
      {
        amount: -75.25,
        description: "Car Maintenance",
        type: "expense",
        categoryId: budgetCategoryIds[2].id,
        daysAgo: 18,
      },

      // Entertainment expenses
      {
        amount: -25.0,
        description: "Netflix Subscription",
        type: "expense",
        categoryId: budgetCategoryIds[3].id,
        daysAgo: 1,
      },
      {
        amount: -45.0,
        description: "Movie Theater",
        type: "expense",
        categoryId: budgetCategoryIds[3].id,
        daysAgo: 3,
      },
      {
        amount: -15.0,
        description: "Spotify Premium",
        type: "expense",
        categoryId: budgetCategoryIds[3].id,
        daysAgo: 5,
      },
      {
        amount: -80.0,
        description: "Concert Tickets",
        type: "expense",
        categoryId: budgetCategoryIds[3].id,
        daysAgo: 12,
      },
      {
        amount: -35.0,
        description: "Gaming Subscription",
        type: "expense",
        categoryId: budgetCategoryIds[3].id,
        daysAgo: 14,
      },

      // Healthcare expenses
      {
        amount: -25.0,
        description: "Pharmacy",
        type: "expense",
        categoryId: budgetCategoryIds[4].id,
        daysAgo: 6,
      },
      {
        amount: -20.0,
        description: "Doctor Visit",
        type: "expense",
        categoryId: budgetCategoryIds[4].id,
        daysAgo: 13,
      },

      // Shopping expenses (over budget)
      {
        amount: -120.0,
        description: "Clothing Store",
        type: "expense",
        categoryId: budgetCategoryIds[5].id,
        daysAgo: 2,
      },
      {
        amount: -85.0,
        description: "Electronics Store",
        type: "expense",
        categoryId: budgetCategoryIds[5].id,
        daysAgo: 5,
      },
      {
        amount: -95.0,
        description: "Online Shopping",
        type: "expense",
        categoryId: budgetCategoryIds[5].id,
        daysAgo: 8,
      },
      {
        amount: -150.0,
        description: "Furniture Store",
        type: "expense",
        categoryId: budgetCategoryIds[5].id,
        daysAgo: 15,
      },
    ];

    const transactionsData = transactionData.map((tx) => ({
      userId: TEST_USER_ID,
      accountId: userAccountIds[0].id,
      categoryId: tx.categoryId,
      amount: tx.amount,
      description: tx.description,
      type: tx.type,
      date: getDate(tx.daysAgo),
    }));

    const encryptedTransactionsData = transactionsData.map((transaction) =>
      DatabaseEncryptionService.encryptForSave("transactions", transaction)
    );

    await db.insert(transactions).values(encryptedTransactionsData);

    // 8. Create transaction categorizations for Bunq transactions
    console.log("🏷️ Creating transaction categorizations...");
    const bunqTransactionIds = [
      "bunq-tx-001",
      "bunq-tx-002",
      "bunq-tx-003",
      "bunq-tx-004",
      "bunq-tx-005",
      "bunq-tx-006",
      "bunq-tx-007",
      "bunq-tx-008",
      "bunq-tx-009",
      "bunq-tx-010",
    ];

    await db.insert(transactionCategorizations).values(
      bunqTransactionIds.map((bunqTxId, index) => ({
        userId: TEST_USER_ID,
        bunqTransactionId: bunqTxId,
        categoryId: budgetCategoryIds[index % budgetCategoryIds.length].id,
        accountMappingId: accountMappingId, // Reference to the actual account mapping
        isConfirmed: randomBool(),
      }))
    );

    // 9. Create budget achievements
    console.log("🏆 Creating budget achievements...");
    const budgetAchievementsData = [
      {
        userId: TEST_USER_ID,
        budgetCategoryId: budgetCategoryIds[1].id, // Groceries
        title: "Budget Master",
        description: "Stayed under grocery budget for 3 consecutive months",
        achievementType: "budget_streak",
        points: 100,
        unlockedAt: getDate(5),
        data: JSON.stringify({ months: 3, category: "groceries" }),
      },
      {
        userId: TEST_USER_ID,
        budgetCategoryId: budgetCategoryIds[4].id, // Healthcare
        title: "Health Conscious",
        description: "Maintained low healthcare spending for 6 months",
        achievementType: "low_spending",
        points: 75,
        unlockedAt: getDate(10),
        data: JSON.stringify({ months: 6, category: "healthcare" }),
      },
    ];

    const encryptedBudgetAchievementsData = budgetAchievementsData.map(
      (achievement) =>
        DatabaseEncryptionService.encryptForSave(
          "budgetAchievements",
          achievement
        )
    );

    await db.insert(budgetAchievements).values(encryptedBudgetAchievementsData);

    // 10. Create budget insights
    console.log("💡 Creating budget insights...");
    const budgetInsightsData = [
      {
        userId: TEST_USER_ID,
        budgetCategoryId: budgetCategoryIds[5].id, // Shopping
        title: "Overspending Alert",
        description:
          "You've exceeded your shopping budget by 50% this month. Consider reducing non-essential purchases.",
        insightType: "overspending",
        severity: "high",
        data: JSON.stringify({
          spent: 450,
          budget: 300,
          overage: 150,
          percentage: 150,
        }),
      },
      {
        userId: TEST_USER_ID,
        budgetCategoryId: budgetCategoryIds[1].id, // Groceries
        title: "Savings Opportunity",
        description:
          "You're consistently under budget on groceries. Consider increasing your savings goal.",
        insightType: "savings_opportunity",
        severity: "low",
        data: JSON.stringify({
          averageSpending: 320.5,
          budget: 400,
          potentialSavings: 79.5,
        }),
      },
    ];

    const encryptedBudgetInsightsData = budgetInsightsData.map((insight) =>
      DatabaseEncryptionService.encryptForSave("budgetInsights", insight)
    );

    await db.insert(budgetInsights).values(encryptedBudgetInsightsData);

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📊 Summary of created data:");
    console.log(`👤 1 test user (${TEST_USER_ID})`);
    console.log(`🏦 3 user accounts`);
    console.log(`🔗 1 account mapping`);
    console.log(`📂 15 transaction categories`);
    console.log(`💰 6 budget categories`);
    console.log(`🎯 4 savings goals`);
    console.log(`💳 ${transactionData.length} manual transactions`);
    console.log(`🏷️ ${bunqTransactionIds.length} transaction categorizations`);
    console.log(`🏆 2 budget achievements`);
    console.log(`💡 2 budget insights`);

    console.log("\n🔑 Test user credentials:");
    console.log(`Email: test@moneves.com`);
    console.log(`Password: testpassword123`);
    console.log(`User ID: ${TEST_USER_ID}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
