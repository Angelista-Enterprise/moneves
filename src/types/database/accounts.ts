// Database types for accounts

export type UserAccount = {
  id: number;
  userId: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  iban: string | null;
  createdAt: string | null;
};

export type NewUserAccount = Omit<UserAccount, "id" | "createdAt">;

export type AccountMapping = {
  id: number;
  userId: string;
  bunqAccountId: string;
  userAccountId: number | null;
  bunqAccountName: string;
  bunqAccountType: string;
  bunqAccountIban: string | null;
  isActive: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NewAccountMapping = Omit<
  AccountMapping,
  "id" | "createdAt" | "updatedAt"
>;