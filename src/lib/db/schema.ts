import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password"),
  avatar: text("avatar"),
  emailVerified: text("email_verified"),
  image: text("image"),
  // Subscription fields
  subscriptionTier: text("subscription_tier").notNull().default("free"), // 'free', 'premium', 'pro'
  subscriptionStatus: text("subscription_status").notNull().default("active"), // 'active', 'cancelled', 'expired'
  subscriptionStartDate: text("subscription_start_date"),
  subscriptionEndDate: text("subscription_end_date"),
  // User preferences
  currency: text("currency").notNull().default("USD"),
  locale: text("locale").notNull().default("en-US"),
  timezone: text("timezone").notNull().default("UTC"),
  dateFormat: text("date_format").notNull().default("MM/dd/yyyy"),
  numberFormat: text("number_format").notNull().default("US"),
  // Notification preferences
  emailNotifications: integer("email_notifications", { mode: "boolean" })
    .notNull()
    .default(true),
  budgetAlerts: integer("budget_alerts", { mode: "boolean" })
    .notNull()
    .default(true),
  goalReminders: integer("goal_reminders", { mode: "boolean" })
    .notNull()
    .default(true),
  weeklyReports: integer("weekly_reports", { mode: "boolean" })
    .notNull()
    .default(false),
  // Privacy settings
  dataSharing: integer("data_sharing", { mode: "boolean" })
    .notNull()
    .default(false),
  analyticsOptIn: integer("analytics_opt_in", { mode: "boolean" })
    .notNull()
    .default(true),
  // Bunq API integration
  bunqApiKey: text("bunq_api_key"),
  bunqApiUrl: text("bunq_api_url").default("http://localhost:8000"),
  bunqTransactionLimit: integer("bunq_transaction_limit")
    .notNull()
    .default(100),
  setupCompleted: integer("setup_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: text("expires").notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: text("expires").notNull(),
});

// User-created accounts (manual tracking, not Bunq data)
export const userAccounts = sqliteTable("user_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'checking', 'savings', 'credit', etc.
  balance: real("balance").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  iban: text("iban"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Account mappings - links Bunq accounts to user accounts for categorization
export const accountMappings = sqliteTable("account_mappings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bunqAccountId: text("bunq_account_id").notNull(), // Bunq account ID as string
  userAccountId: integer("user_account_id").references(() => userAccounts.id, {
    onDelete: "cascade",
  }), // Optional mapping to user account
  bunqAccountName: text("bunq_account_name").notNull(), // Store Bunq account name for reference
  bunqAccountType: text("bunq_account_type").notNull(), // Store Bunq account type
  bunqAccountIban: text("bunq_account_iban"), // Store IBAN if available
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const budgetCategories = sqliteTable("budget_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  monthlyLimit: real("monthly_limit").notNull(),
  spent: real("spent").notNull().default(0),
  remaining: real("remaining").notNull(),
  status: text("status").notNull().default("on_track"), // 'on_track', 'near_limit', 'over_budget'
  isTracked: integer("is_tracked", { mode: "boolean" }).notNull().default(true), // Whether this category is being tracked for budget calculations
  isGoalLess: integer("is_goal_less", { mode: "boolean" })
    .notNull()
    .default(false), // Whether this category has no spending goal (insight only)
  autoCategorizeFilters: text("auto_categorize_filters"), // JSON string containing filters for auto-categorization
  // New innovative features
  priority: integer("priority").notNull().default(1), // 1-5 priority level for budget importance
  budgetType: text("budget_type").notNull().default("monthly"), // 'monthly', 'weekly', 'yearly', 'custom'
  alertThreshold: real("alert_threshold").notNull().default(0.8), // Alert when 80% of budget is used
  rolloverEnabled: integer("rollover_enabled", { mode: "boolean" })
    .notNull()
    .default(false), // Allow unused budget to roll over
  rolloverAmount: real("rollover_amount").notNull().default(0), // Amount rolled over from previous period
  savingsGoal: real("savings_goal"), // Optional savings target within this category
  spendingPattern: text("spending_pattern"), // JSON: 'consistent', 'sporadic', 'seasonal', 'trending_up', 'trending_down'
  lastResetDate: text("last_reset_date"), // When the budget was last reset
  averageSpending: real("average_spending").notNull().default(0), // 30-day average spending
  spendingVariance: real("spending_variance").notNull().default(0), // How much spending varies (standard deviation)
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Budget insights and analytics
export const budgetInsights = sqliteTable("budget_insights", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  budgetCategoryId: integer("budget_category_id")
    .notNull()
    .references(() => budgetCategories.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  insightType: text("insight_type").notNull(), // 'spending_trend', 'savings_opportunity', 'overspend_risk', 'goal_progress'
  title: text("title").notNull(),
  description: text("description").notNull(),
  data: text("data"), // JSON data for the insight
  severity: text("severity").notNull().default("info"), // 'info', 'warning', 'critical'
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Budget achievements and milestones
export const budgetAchievements = sqliteTable("budget_achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  budgetCategoryId: integer("budget_category_id")
    .notNull()
    .references(() => budgetCategories.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievementType: text("achievement_type").notNull(), // 'savings_milestone', 'spending_control', 'goal_achieved', 'streak'
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").notNull().default(0), // Gamification points
  unlockedAt: text("unlocked_at").notNull(),
  data: text("data"), // JSON data for the achievement
});

// Manual transactions only (not Bunq data)
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: integer("account_id").references(() => userAccounts.id),
  categoryId: integer("category_id").references(() => budgetCategories.id),
  amount: real("amount").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'income', 'expense'
  date: text("date").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Transaction categorizations - maps Bunq transactions to categories
export const transactionCategorizations = sqliteTable(
  "transaction_categorizations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bunqTransactionId: text("bunq_transaction_id").notNull(), // Bunq transaction ID as string
    categoryId: integer("category_id").references(() => budgetCategories.id, {
      onDelete: "cascade",
    }),
    accountMappingId: integer("account_mapping_id").references(
      () => accountMappings.id,
      { onDelete: "cascade" }
    ),
    isConfirmed: integer("is_confirmed", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  }
);

export const savingsGoals = sqliteTable("savings_goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(), // Store Bunq account ID as string
  name: text("name").notNull(),
  targetAmount: real("target_amount").notNull(),
  currentAmount: real("current_amount").notNull().default(0),
  targetDate: text("target_date"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Transaction categories - predefined categories for transactions
export const transactionCategories = sqliteTable("transaction_categories", {
  id: text("id").primaryKey(), // Use text ID like "income", "housing", etc.
  name: text("name").notNull(),
  icon: text("icon").notNull(), // Lucide icon name
  color: text("color").notNull(), // Tailwind color class
  bgColor: text("bg_color").notNull(), // Tailwind background color class
  isDefault: integer("is_default", { mode: "boolean" })
    .notNull()
    .default(false), // System default categories
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Re-export types for backward compatibility
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;

export type UserAccount = typeof userAccounts.$inferSelect;
export type NewUserAccount = typeof userAccounts.$inferInsert;

export type AccountMapping = typeof accountMappings.$inferSelect;
export type NewAccountMapping = typeof accountMappings.$inferInsert;

export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type NewBudgetCategory = typeof budgetCategories.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type TransactionCategorization =
  typeof transactionCategorizations.$inferSelect;
export type NewTransactionCategorization =
  typeof transactionCategorizations.$inferInsert;

export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type NewSavingsGoal = typeof savingsGoals.$inferInsert;

export type TransactionCategory = typeof transactionCategories.$inferSelect;
export type NewTransactionCategory = typeof transactionCategories.$inferInsert;
