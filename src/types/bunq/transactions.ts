// Bunq API types for transactions

export interface BunqTransactionResponse {
  id: number;
  amount: string;
  currency: string;
  description: string;
  counterparty_alias?: object | null;
  created: string;
  updated: string;
  status: string;
  sub_type?: string | null;
  type_?: string | null;
  balance_after_mutation?: object | null;
  payment_arrival_expected?: object | null;
  merchant_reference?: string | null;
  geolocation?: object | null;
  alias?: object | null;
  batch_id?: number | null;
  scheduled_id?: number | null;
  bunqto_status?: string | null;
  bunqto_sub_status?: string | null;
  bunqto_expiry?: string | null;
  bunqto_share_url?: string | null;
  bunqto_time_responded?: string | null;
  payment_fee?: object | null;
  payment_suspended_outgoing?: object | null;
  payment_auto_allocate_instance?: object | null;
  request_reference_split_the_bill?: object[] | null;
  address_billing?: object | null;
  address_shipping?: object | null;
  attachment?: object[] | null;
  // Internal transaction specific fields
  is_internal?: boolean;
  source_account_id?: number;
  destination_account_id?: number;
  internal_transfer_id?: number;
}

export interface PaginatedTransactionResponse {
  data: BunqTransactionResponse[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface BunqScheduledPaymentResponse {
  id: number;
  amount: string;
  currency: string;
  description: string;
  status: string;
  schedule_date: string;
  recurring: boolean;
  frequency?: string | null;
  created: string;
}

export interface BunqTransactionFilter {
  account_id?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  min_amount?: number | null;
  max_amount?: number | null;
  status?: "ACCEPTED" | "PENDING" | "REJECTED" | "EXPIRED" | null;
  description_contains?: string | null;
  counterparty_email?: string | null;
  counterparty_iban?: string | null;
  include_internal?: boolean;
  internal_only?: boolean;
}

// Internal transaction specific interface
export interface BunqInternalTransactionResponse {
  id: number;
  amount: string;
  currency: string;
  description: string;
  created: string;
  updated: string;
  status: string;
  source_account_id: number;
  destination_account_id: number;
  internal_transfer_id: number;
  source_account_name?: string;
  destination_account_name?: string;
  transfer_type?: "INTERNAL_TRANSFER" | "INTERNAL_PAYMENT";
}

// Enhanced Bunq types with application-specific data
export interface EnhancedBunqTransaction extends BunqTransactionResponse {
  // Application-specific enhancements
  categoryId?: number;
  categoryName?: string;
  userAccountId?: number;
  userAccountName?: string;
  isCategorized: boolean;
  isConfirmed: boolean;
  mappingId?: number;
}

// Cross-referenced types for backward compatibility
export interface CrossReferencedTransaction {
  id: string;
  amount: number;
  description: string;
  type: "income" | "expense";
  date: string;
  currency: string;
  status: string;
  counterparty: string | null;
  originalDescription: string;
  isImported: boolean;
  provider: string;
  providerTransactionId: string;
  createdAt: string;
  updatedAt: string;
  // Cross-referenced fields
  accountId?: number;
  categoryId?: number;
  matchedAccount?: import("../database").UserAccount;
  suggestedCategory?: string;
}
