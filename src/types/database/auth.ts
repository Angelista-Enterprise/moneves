// Database types for authentication

export type User = {
  id: string;
  email: string;
  name: string;
  password: string | null;
  avatar: string | null;
  emailVerified: string | null;
  image: string | null;
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  currency: string;
  locale: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  emailNotifications: number;
  budgetAlerts: number;
  goalReminders: number;
  weeklyReports: number;
  dataSharing: number;
  analyticsOptIn: number;
  bunqApiKey: string | null;
  bunqApiUrl: string | null;
  bunqTransactionLimit: number;
  createdAt: string | null;
};

export type NewUser = Omit<User, "id" | "createdAt">;

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};

export type NewAccount = Omit<Account, "id">;

export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: string;
};

export type NewSession = Omit<Session, "id">;

export type VerificationToken = {
  identifier: string;
  token: string;
  expires: string;
};

export type NewVerificationToken = Omit<VerificationToken, "token">;