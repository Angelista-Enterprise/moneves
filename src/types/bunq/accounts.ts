// Bunq API types for accounts

export interface BunqAccountResponse {
  id: number;
  description: string;
  balance: string;
  currency: string;
  status: string;
  type: string;
}

export interface BunqAccountDetailsResponse extends BunqAccountResponse {
  iban?: string | null;
  bic?: string | null;
  daily_limit?: string | null;
  daily_spent?: string | null;
  avatar?: object | null;
  created?: string | null;
  updated?: string | null;
}

// Enhanced Bunq types with application-specific data
export interface EnhancedBunqAccount extends BunqAccountResponse {
  // Application-specific enhancements
  userAccountId?: number;
  userAccountName?: string;
  isMapped: boolean;
  mappingId?: number;
}

export interface CrossReferencedAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  iban?: string | null;
  userId: string;
  createdAt?: string | null;
  // Cross-referenced fields
  bunqAccountId?: number;
  matchedBunqAccount?: BunqAccountResponse;
}