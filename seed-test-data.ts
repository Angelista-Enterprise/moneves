#!/usr/bin/env tsx

/**
 * Comprehensive Test Data Seeding Script
 *
 * This script creates a complete test environment with:
 * - Test user with premium subscription
 * - Multiple user accounts (checking, savings, credit)
 * - Budget categories with realistic spending data
 * - Savings goals with progress tracking
 * - Sample transactions (income & expenses)
 * - Account mappings for Bunq integration
 * - Transaction categorizations
 *
 * Usage: npx tsx seed-test-data.ts
 */

import { db } from "./src/lib/db";
import {
  users,
  userAccounts,
  budgetCategories,
  transactions,
  savingsGoals,
  transactionCategories,
  accountMappings,
  transactionCategorizations,
} from "./src/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const TEST_USER_ID = "test-user-123";
const TEST_USER_EMAIL = "test@example.com";
const TEST_USER_PASSWORD = "password123";

async function seedTestData() {
  try {
    console.log("🌱 Starting comprehensive test data seeding...\n");

    // 1. Create test user
    console.log("👤 Creating test user...");
    const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 12);

    await db
      .insert(users)
      .values({
        id: TEST_USER_ID,
        email: TEST_USER_EMAIL,
        name: "Test User",
        password: hashedPassword,
        subscriptionTier: "premium",
        subscriptionStatus: "active",
        currency: "USD",
        locale: "en-US",
        timezone: "America/New_York",
        dateFormat: "MM/dd/yyyy",
        numberFormat: "US",
        emailNotifications: true,
        budgetAlerts: true,
        goalReminders: true,
        weeklyReports: true,
        dataSharing: false,
        analyticsOptIn: true,
        bunqApiKey: "test-bunq-key-123",
        bunqApiUrl: "https://api.bunq.com",
        bunqTransactionLimit: 100,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          password: hashedPassword,
          subscriptionTier: "premium",
          subscriptionStatus: "active",
        },
      });

    // 2. Create user accounts
    console.log("🏦 Creating user accounts...");
    const userAccountsData = [
      {
        userId: TEST_USER_ID,
        name: "Main Checking Account",
        type: "checking",
        balance: 2500.0,
        currency: "USD",
        iban: "US12345678901234567890",
      },
      {
        userId: TEST_USER_ID,
        name: "Savings Account",
        type: "savings",
        balance: 15000.0,
        currency: "USD",
        iban: "US12345678901234567891",
      },
      {
        userId: TEST_USER_ID,
        name: "Credit Card",
        type: "credit",
        balance: -1200.0,
        currency: "USD",
        iban: "US12345678901234567892",
      },
    ];

    const insertedAccounts = [];
    for (const account of userAccountsData) {
      const result = await db.insert(userAccounts).values(account).returning();
      insertedAccounts.push(result[0]);
    }

    // 3. Create budget categories
    console.log("📊 Creating budget categories...");
    const budgetCategoriesData = [
      {
        userId: TEST_USER_ID,
        name: "Groceries",
        icon: "🛒",
        color: "#10B981",
        bgColor: "#D1FAE5",
        monthlyLimit: 600.0,
        spent: 450.0,
        remaining: 150.0,
        isActive: true,
      },
      {
        userId: TEST_USER_ID,
        name: "Transportation",
        icon: "🚗",
        color: "#3B82F6",
        bgColor: "#DBEAFE",
        monthlyLimit: 400.0,
        spent: 320.0,
        remaining: 80.0,
        isActive: true,
      },
      {
        userId: TEST_USER_ID,
        name: "Entertainment",
        icon: "🎬",
        color: "#8B5CF6",
        bgColor: "#EDE9FE",
        monthlyLimit: 200.0,
        spent: 180.0,
        remaining: 20.0,
        isActive: true,
      },
      {
        userId: TEST_USER_ID,
        name: "Dining Out",
        icon: "🍽️",
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        monthlyLimit: 300.0,
        spent: 250.0,
        remaining: 50.0,
        isActive: true,
      },
      {
        userId: TEST_USER_ID,
        name: "Utilities",
        icon: "⚡",
        color: "#EF4444",
        bgColor: "#FEE2E2",
        monthlyLimit: 150.0,
        spent: 120.0,
        remaining: 30.0,
        isActive: true,
      },
      {
        userId: TEST_USER_ID,
        name: "Healthcare",
        icon: "🏥",
        color: "#06B6D4",
        bgColor: "#CFFAFE",
        monthlyLimit: 100.0,
        spent: 75.0,
        remaining: 25.0,
        isActive: true,
      },
    ];

    const insertedCategories = [];
    for (const category of budgetCategoriesData) {
      const result = await db
        .insert(budgetCategories)
        .values(category)
        .returning();
      insertedCategories.push(result[0]);
    }

    // 4. Create savings goals
    console.log("🎯 Creating savings goals...");
    const savingsGoalsData = [
      {
        userId: TEST_USER_ID,
        accountId: "savings-account-1",
        name: "Emergency Fund",
        targetAmount: 10000.0,
        currentAmount: 7500.0,
        targetDate: "2024-12-31",
      },
      {
        userId: TEST_USER_ID,
        accountId: "savings-account-1",
        name: "Vacation Fund",
        targetAmount: 5000.0,
        currentAmount: 3200.0,
        targetDate: "2024-08-15",
      },
      {
        userId: TEST_USER_ID,
        accountId: "savings-account-1",
        name: "New Car Fund",
        targetAmount: 25000.0,
        currentAmount: 8500.0,
        targetDate: "2025-06-01",
      },
    ];

    for (const goal of savingsGoalsData) {
      await db.insert(savingsGoals).values(goal).onConflictDoNothing();
    }

    // 5. Create transaction categories
    console.log("🏷️ Creating transaction categories...");
    const transactionCategoriesData = [
      {
        id: "groceries",
        name: "Groceries",
        icon: "🛒",
        color: "#10B981",
        bgColor: "#D1FAE5",
        isDefault: true,
        isActive: true,
      },
      {
        id: "transportation",
        name: "Transportation",
        icon: "🚗",
        color: "#3B82F6",
        bgColor: "#DBEAFE",
        isDefault: true,
        isActive: true,
      },
      {
        id: "entertainment",
        name: "Entertainment",
        icon: "🎬",
        color: "#8B5CF6",
        bgColor: "#EDE9FE",
        isDefault: true,
        isActive: true,
      },
      {
        id: "dining",
        name: "Dining Out",
        icon: "🍽️",
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        isDefault: true,
        isActive: true,
      },
      {
        id: "utilities",
        name: "Utilities",
        icon: "⚡",
        color: "#EF4444",
        bgColor: "#FEE2E2",
        isDefault: true,
        isActive: true,
      },
      {
        id: "healthcare",
        name: "Healthcare",
        icon: "🏥",
        color: "#06B6D4",
        bgColor: "#CFFAFE",
        isDefault: true,
        isActive: true,
      },
      {
        id: "income",
        name: "Income",
        icon: "💰",
        color: "#059669",
        bgColor: "#D1FAE5",
        isDefault: true,
        isActive: true,
      },
      {
        id: "other",
        name: "Other",
        icon: "📦",
        color: "#6B7280",
        bgColor: "#F3F4F6",
        isDefault: true,
        isActive: true,
      },
    ];

    for (const category of transactionCategoriesData) {
      await db
        .insert(transactionCategories)
        .values(category)
        .onConflictDoNothing();
    }

    // 6. Create sample transactions
    console.log("💳 Creating sample transactions...");
    const transactionsData = [
      // Recent transactions (last 30 days)
      {
        userId: TEST_USER_ID,
        amount: -85.5,
        description: "Whole Foods Market",
        type: "expense",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: insertedCategories[0].id, // Groceries
        accountId: insertedAccounts[0].id, // Main Checking
      },
      {
        userId: TEST_USER_ID,
        amount: -45.0,
        description: "Uber Ride",
        type: "expense",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: insertedCategories[1].id, // Transportation
        accountId: insertedAccounts[0].id,
      },
      {
        userId: TEST_USER_ID,
        amount: -25.99,
        description: "Netflix Subscription",
        type: "expense",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: insertedCategories[2].id, // Entertainment
        accountId: insertedAccounts[0].id,
      },
      {
        userId: TEST_USER_ID,
        amount: -67.8,
        description: "Restaurant Dinner",
        type: "expense",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: insertedCategories[3].id, // Dining Out
        accountId: insertedAccounts[0].id,
      },
      {
        userId: TEST_USER_ID,
        amount: -120.0,
        description: "Electric Bill",
        type: "expense",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: insertedCategories[4].id, // Utilities
        accountId: insertedAccounts[0].id,
      },
      {
        userId: TEST_USER_ID,
        amount: -75.0,
        description: "Doctor Visit",
        type: "expense",
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: insertedCategories[5].id, // Healthcare
        accountId: insertedAccounts[0].id,
      },
      {
        userId: TEST_USER_ID,
        amount: 5000.0,
        description: "Salary Deposit",
        type: "income",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: null,
        accountId: insertedAccounts[0].id,
      },
      {
        userId: TEST_USER_ID,
        amount: -150.0,
        description: "Gas Station",
        type: "expense",
        date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: insertedCategories[1].id, // Transportation
        accountId: insertedAccounts[0].id,
      },
      {
        userId: TEST_USER_ID,
        amount: -200.0,
        description: "Grocery Shopping",
        type: "expense",
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: insertedCategories[0].id, // Groceries
        accountId: insertedAccounts[0].id,
      },
      {
        userId: TEST_USER_ID,
        amount: -89.99,
        description: "Movie Tickets",
        type: "expense",
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: insertedCategories[2].id, // Entertainment
        accountId: insertedAccounts[0].id,
      },
      // Income transactions
      {
        userId: TEST_USER_ID,
        amount: 5000.0,
        description: "Monthly Salary",
        type: "income",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: null,
        accountId: insertedAccounts[0].id,
      },
      {
        userId: TEST_USER_ID,
        amount: 500.0,
        description: "Freelance Work",
        type: "income",
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId: null,
        accountId: insertedAccounts[0].id,
      },
    ];

    for (const transaction of transactionsData) {
      await db.insert(transactions).values(transaction).onConflictDoNothing();
    }

    // 7. Create account mappings
    console.log("🔗 Creating account mappings...");
    const accountMappingsData = [
      {
        userId: TEST_USER_ID,
        bunqAccountId: "bunq-checking-123",
        userAccountId: insertedAccounts[0].id,
        bunqAccountName: "Main Checking Account",
        bunqAccountType: "MonetaryAccountBank",
        bunqAccountDescription: "Primary checking account",
        isActive: true,
      },
      {
        userId: TEST_USER_ID,
        bunqAccountId: "bunq-savings-456",
        userAccountId: insertedAccounts[1].id,
        bunqAccountName: "Savings Account",
        bunqAccountType: "MonetaryAccountSavings",
        bunqAccountDescription: "High-yield savings account",
        isActive: true,
      },
    ];

    for (const mapping of accountMappingsData) {
      await db.insert(accountMappings).values(mapping).onConflictDoNothing();
    }

    // 8. Create transaction categorizations
    console.log("🏷️ Creating transaction categorizations...");
    const transactionCategorizationsData = [
      {
        userId: TEST_USER_ID,
        bunqTransactionId: "bunq-tx-001",
        categoryId: insertedCategories[0].id, // Groceries
        originalDescription: "WHOLE FOODS MARKET #1234",
        categorizedDescription: "Whole Foods Market",
        confidence: 0.95,
        isAutoCategorized: true,
      },
      {
        userId: TEST_USER_ID,
        bunqTransactionId: "bunq-tx-002",
        categoryId: insertedCategories[1].id, // Transportation
        originalDescription: "UBER *TRIP HELP",
        categorizedDescription: "Uber Ride",
        confidence: 0.9,
        isAutoCategorized: true,
      },
      {
        userId: TEST_USER_ID,
        bunqTransactionId: "bunq-tx-003",
        categoryId: insertedCategories[2].id, // Entertainment
        originalDescription: "NETFLIX.COM",
        categorizedDescription: "Netflix Subscription",
        confidence: 0.98,
        isAutoCategorized: true,
      },
    ];

    for (const categorization of transactionCategorizationsData) {
      await db
        .insert(transactionCategorizations)
        .values(categorization)
        .onConflictDoNothing();
    }

    console.log("\n✅ Test data seeding completed successfully!");
    console.log("\n📊 Summary of seeded data:");
    console.log("👤 1 Test user with premium subscription");
    console.log("🏦 3 User accounts (checking, savings, credit)");
    console.log("📊 6 Budget categories with spending data");
    console.log("🎯 3 Savings goals with progress");
    console.log("🏷️ 8 Transaction categories");
    console.log("💳 12 Sample transactions (income & expenses)");
    console.log("🔗 2 Account mappings");
    console.log("🏷️ 3 Transaction categorizations");
    console.log("\n🔑 Test user credentials:");
    console.log(`Email: ${TEST_USER_EMAIL}`);
    console.log(`Password: ${TEST_USER_PASSWORD}`);
    console.log("\n🚀 You can now test the application with realistic data!");
  } catch (error) {
    console.error("❌ Error seeding test data:", error);
    throw error;
  }
}

// Run the seeding function
if (require.main === module) {
  seedTestData()
    .then(() => {
      console.log("🎉 Seeding process completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export { seedTestData };
