/**
 * Defines which fields in each table should be encrypted
 * This configuration is used by the encryption service to automatically
 * encrypt/decrypt sensitive data
 */

export const ENCRYPTED_FIELDS = {
  // Users table - sensitive personal information
  users: [
    "name",
    "password",
    "avatar",
    "image",
    "bunqApiKey", // API keys are highly sensitive
  ] as const,

  // Accounts table - OAuth tokens and sensitive account data
  accounts: [
    "refresh_token",
    "access_token",
    "id_token",
    "session_state",
  ] as const,

  // Sessions table - session tokens
  sessions: ["sessionToken"] as const,

  // Verification tokens table - verification tokens
  verificationTokens: ["token"] as const,

  // User accounts table - account names and IBANs
  userAccounts: [
    "name",
    "iban", // IBANs are sensitive financial identifiers
  ] as const,

  // Account mappings table - Bunq account information
  accountMappings: ["bunqAccountName", "bunqAccountIban"] as const,

  // Budget categories table - category names
  budgetCategories: ["name"] as const,

  // Budget insights table - insight titles and descriptions
  budgetInsights: ["title", "description"] as const,

  // Budget achievements table - achievement titles and descriptions
  budgetAchievements: ["title", "description"] as const,

  // Transactions table - transaction descriptions
  transactions: ["description"] as const,

  // Savings goals table - goal names
  savingsGoals: ["name"] as const,

  // Transaction categories table - category names
  transactionCategories: ["name"] as const,
} as const;

/**
 * Get encrypted fields for a specific table
 */
export function getEncryptedFields(
  tableName: keyof typeof ENCRYPTED_FIELDS
): readonly string[] {
  return ENCRYPTED_FIELDS[tableName] || [];
}

/**
 * Check if a field should be encrypted for a given table
 */
export function shouldEncryptField(
  tableName: keyof typeof ENCRYPTED_FIELDS,
  fieldName: string
): boolean {
  const encryptedFields = getEncryptedFields(tableName);
  return encryptedFields.includes(fieldName as never);
}

/**
 * Get all table names that have encrypted fields
 */
export function getTablesWithEncryption(): (keyof typeof ENCRYPTED_FIELDS)[] {
  return Object.keys(ENCRYPTED_FIELDS) as (keyof typeof ENCRYPTED_FIELDS)[];
}
