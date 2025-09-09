import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BunqAccountResponse, BunqAccountDetailsResponse } from "@/types/bunq";

const BUNQ_API_BASE_URL = "http://localhost:8000";

// Query keys
export const bunqQueryKeys = {
  accounts: ["bunq", "accounts"] as const,
  accountDetails: (accountId: number) =>
    ["bunq", "accounts", accountId, "details"] as const,
};

// API functions
const fetchAccounts = async (
  apiToken: string
): Promise<BunqAccountResponse[]> => {
  const response = await fetch(`${BUNQ_API_BASE_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch accounts: ${response.statusText}`);
  }

  return response.json();
};

const fetchAccountDetails = async (
  apiToken: string,
  accountId: number
): Promise<BunqAccountDetailsResponse> => {
  const response = await fetch(
    `${BUNQ_API_BASE_URL}/accounts/${accountId}/details`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch account details: ${response.statusText}`);
  }

  return response.json();
};

interface UseBunqAccountsReturn {
  accounts: BunqAccountResponse[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  getAccountDetails: (
    accountId: number
  ) => Promise<BunqAccountDetailsResponse | null>;
}

export const useBunqAccounts = (apiToken?: string): UseBunqAccountsReturn => {
  const queryClient = useQueryClient();

  const {
    data: accounts = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: bunqQueryKeys.accounts,
    queryFn: () => fetchAccounts(apiToken!),
    enabled: !!apiToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const getAccountDetails = async (
    accountId: number
  ): Promise<BunqAccountDetailsResponse | null> => {
    if (!apiToken) {
      console.error("[useBunqAccounts]: API token is required");
      return null;
    }

    try {
      // Check if we already have the data in cache
      const cachedData = queryClient.getQueryData<BunqAccountDetailsResponse>(
        bunqQueryKeys.accountDetails(accountId)
      );

      if (cachedData) {
        return cachedData;
      }

      // Fetch and cache the data
      const data = await queryClient.fetchQuery({
        queryKey: bunqQueryKeys.accountDetails(accountId),
        queryFn: () => fetchAccountDetails(apiToken, accountId),
        staleTime: 1000 * 60 * 10, // 10 minutes for account details
      });

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch account details";
      console.error(
        "[useBunqAccounts]: Error fetching account details:",
        errorMessage
      );
      return null;
    }
  };

  return {
    accounts,
    loading,
    error,
    refetch,
    getAccountDetails,
  };
};
