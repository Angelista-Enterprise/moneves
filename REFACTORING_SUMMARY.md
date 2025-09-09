# Data Architecture Refactoring Summary

## Overview
This refactoring separates Bunq data from application-specific data, ensuring that only user settings, categorizations, and mappings are stored in the database while Bunq data is fetched fresh and enhanced on-the-fly.

## Key Changes

### 1. Database Schema Changes

#### New Tables Added:
- **`account_mappings`**: Maps Bunq accounts to user accounts for categorization
- **`transaction_categorizations`**: Maps Bunq transactions to budget categories

#### Modified Tables:
- **`transactions`**: Now only stores manual transactions (removed Bunq-specific fields)
- **`user_accounts`**: Now only stores user-created accounts for manual tracking

#### Removed Fields:
- All Bunq-specific fields from the `transactions` table
- CSV import fields that were Bunq-specific

### 2. New Services

#### `DataEnhancementService`
- **`enhanceBunqAccounts()`**: Enhances Bunq accounts with user mappings
- **`enhanceBunqTransactions()`**: Enhances Bunq transactions with categorizations
- **`createAccountMapping()`**: Creates mappings between Bunq and user accounts
- **`createTransactionCategorization()`**: Creates transaction categorizations

### 3. Updated API Routes

#### Bunq API Routes (Enhanced):
- **`/api/bunq/accounts`**: Now returns enhanced Bunq accounts with user mappings
- **`/api/bunq/transactions`**: Now returns enhanced Bunq transactions with categorizations

#### New Management API Routes:
- **`/api/account-mappings`**: CRUD operations for account mappings
- **`/api/transaction-categorizations`**: CRUD operations for transaction categorizations

### 4. Updated Hooks

#### New Hooks:
- **`useAccountMappings()`**: Manages account mappings
- **`useTransactionCategorizations()`**: Manages transaction categorizations

#### Modified Hooks:
- **`useAccounts()`**: Now only fetches user-created accounts
- **`useBunqAccountsEnhanced()`**: Fetches enhanced Bunq accounts

## Data Flow

### Before (Old Architecture):
```
Bunq API → Store in DB → Cross-reference → Return to UI
```

### After (New Architecture):
```
Bunq API → Enhance with DB data → Return to UI
```

## Benefits

1. **No Data Duplication**: Bunq data is never stored in the database
2. **Always Fresh Data**: Bunq data is fetched fresh on every request
3. **Clean Separation**: Application data and external data are clearly separated
4. **Better Performance**: No need to sync or maintain Bunq data locally
5. **Easier Maintenance**: Changes to Bunq data structure don't affect the database

## Migration Notes

### Database Migration:
- New tables are created automatically
- Existing data is preserved
- Old Bunq data in the `transactions` table is no longer used

### API Changes:
- Bunq API responses now include enhancement data
- New endpoints for managing mappings and categorizations
- Existing endpoints maintain backward compatibility where possible

### Component Updates Needed:
- Components using Bunq data should be updated to use the new enhanced data structure
- Account mapping UI components need to be created
- Transaction categorization UI components need to be created

## Next Steps

1. **Update Components**: Modify components to work with the new data structure
2. **Create Mapping UI**: Build UI for managing account mappings
3. **Create Categorization UI**: Build UI for managing transaction categorizations
4. **Update Dashboard**: Ensure dashboard works with enhanced data
5. **Testing**: Comprehensive testing of the new architecture

## Files Modified

### Database:
- `src/lib/db/schema.ts` - Updated schema with new tables
- `drizzle/0009_striped_thunderbird.sql` - New migration

### Services:
- `src/lib/data-enhancement-service.ts` - New service for data enhancement

### API Routes:
- `src/app/api/bunq/accounts/route.ts` - Updated to use enhancement service
- `src/app/api/bunq/transactions/route.ts` - Updated to use enhancement service
- `src/app/api/account-mappings/route.ts` - New API route
- `src/app/api/transaction-categorizations/route.ts` - New API route

### Hooks:
- `src/hooks/use-accounts.ts` - Updated to separate local and Bunq accounts
- `src/hooks/use-account-mappings.ts` - New hook for account mappings
- `src/hooks/use-transaction-categorizations.ts` - New hook for categorizations

### Constants:
- `src/lib/constants.ts` - Added new query keys

## Backward Compatibility

- Existing manual transactions are preserved
- User accounts are preserved
- Budget categories are preserved
- API responses maintain the same structure for manual data
- Bunq data now includes additional enhancement fields
