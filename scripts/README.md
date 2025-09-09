# Database Seed Scripts

This directory contains scripts for seeding the Claru database with test data.

## Comprehensive Seed Script

The `seed-database.ts` script creates a complete test dataset with **encrypted sensitive data** including:

### Test User
- **Email**: test@moneves.com
- **Password**: testpassword123
- **User ID**: test-user-12345
- **Subscription**: Premium tier with all features enabled

### Data Created
- **3 User Accounts**: Checking, Savings, and Credit Card accounts (names and IBANs encrypted)
- **1 Account Mapping**: Links Bunq account to user account (account names and IBANs encrypted)
- **15 Transaction Categories**: Income and expense categories with icons and colors (names encrypted)
- **6 Budget Categories**: Various spending categories with different statuses (names encrypted)
  - Housing & Rent (near limit)
  - Groceries (on track with savings goal)
  - Transportation (near limit)
  - Entertainment (on track)
  - Healthcare (on track)
  - Shopping (over budget)
- **4 Savings Goals**: Emergency fund, vacation, laptop, home down payment (names encrypted)
- **27 Manual Transactions**: Realistic transaction history with proper categorization (descriptions encrypted)
- **10 Transaction Categorizations**: Bunq transaction mappings
- **2 Budget Achievements**: Gamification achievements (titles and descriptions encrypted)
- **2 Budget Insights**: Smart recommendations and alerts (titles and descriptions encrypted)

### Usage

```bash
# Run the comprehensive seed script
npm run db:seed-comprehensive

# Or run directly with tsx
npx tsx scripts/seed-database.ts
```

### Prerequisites

Make sure the database schema is up to date:

```bash
# Push database schema
npm run db:push

# Or generate and push migrations
npm run db:generate
npm run db:push
```

### Features Tested

This seed data allows you to test all aspects of the application:

- **Authentication**: Login with test user credentials
- **Dashboard**: Financial overview with real data
- **Budget Management**: Categories with various spending patterns
- **Transaction Management**: Categorized transactions with proper relationships
- **Savings Goals**: Multiple goals with different progress levels
- **Reports**: Financial analysis with real data
- **Hide Balance**: Privacy features with realistic financial data
- **Smart Recommendations**: AI-powered insights based on spending patterns
- **Achievements**: Gamification features
- **Bunq Integration**: Account mappings and transaction categorizations
- **Data Encryption**: All sensitive fields are properly encrypted using the DatabaseEncryptionService

### Data Relationships

The seed data creates realistic relationships between:
- Users and their accounts
- Budget categories and transactions
- Savings goals and progress tracking
- Transaction categorizations for Bunq integration
- Achievements and insights based on spending patterns

This provides a comprehensive test environment for development and testing.
