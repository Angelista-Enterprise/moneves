// API types for accounts

// Account mapping types
export interface AccountMapping {
  id: number;
  bunqAccountId: string;
  bunqAccountName: string;
  bunqAccountType: string;
  bunqAccountIban?: string;
  userAccountId?: number;
  isActive: boolean;
  userAccountName?: string;
}

export interface CreateAccountMappingData {
  bunqAccountId: string;
  bunqAccountName: string;
  bunqAccountType: string;
  bunqAccountIban?: string;
  userAccountId?: number;
}

export interface UpdateAccountMappingData {
  userAccountId?: number;
  isActive?: boolean;
}