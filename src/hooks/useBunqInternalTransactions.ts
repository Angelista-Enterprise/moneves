import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BunqInternalTransactionResponse,
  BunqTransactionFilter,
} from "@/types/bunq/transactions";
import { BunqPaginationMeta } from "@/types/bunq";

const BUNQ_API_BASE_URL = "http://localhost:8000";

// Query keys for internal transactions
export const bunqInternalTransactionQueryKeys = {
  internalTransactions: (accountId?: number, page?: number, perPage?: number) =>
    ["bunq", "internal-transactions", { accountId, page, perPage }] as const,
  allInternalTransactions: (accountId?: number) =>
    ["bunq", "internal-transactions", "all", { accountId }] as const,
  filteredInternalTransactions: (filter: BunqTransactionFilter) =>
    ["bunq", "internal-transactions", "filtered", filter] as const,
  internalTransaction: (transactionId: number, accountId?: number) =>
    ["bunq", "internal-transactions", transactionId, { accountId }] as const,
};

// API functions for internal transactions
const fetchInternalTransactions = async (
  apiToken: string,
  accountId?: number,
  page: number = 1,
  perPage: number = 10
): Promise<{
  data: BunqInternalTransactionResponse[];
  pagination: BunqPaginationMeta;
}> => {
  const params = new URLSearchParams();
  if (accountId) params.append("account_id", accountId.toString());
  params.append("page", page.toString());
  params.append("per_page", perPage.toString());

  const response = await fetch(
    `${BUNQ_API_BASE_URL}/internal-transactions?${params}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch internal transactions: ${response.statusText}`
    );
  }

  return response.json();
};

const fetchAllInternalTransactions = async (
  apiToken: string,
  accountId?: number
): Promise<BunqInternalTransactionResponse[]> => {
  const params = new URLSearchParams();
  if (accountId) params.append("account_id", accountId.toString());

  const response = await fetch(
    `${BUNQ_API_BASE_URL}/internal-transactions/all?${params}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch all internal transactions: ${response.statusText}`
    );
  }

  return response.json();
};

const fetchFilteredInternalTransactions = async (
  apiToken: string,
  filter: BunqTransactionFilter
): Promise<BunqInternalTransactionResponse[]> => {
  const response = await fetch(
    `${BUNQ_API_BASE_URL}/internal-transactions/filter`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch filtered internal transactions: ${response.statusText}`
    );
  }

  return response.json();
};

const fetchInternalTransaction = async (
  apiToken: string,
  transactionId: number,
  accountId?: number
): Promise<BunqInternalTransactionResponse> => {
  const params = new URLSearchParams();
  if (accountId) params.append("account_id", accountId.toString());

  const response = await fetch(
    `${BUNQ_API_BASE_URL}/internal-transactions/${transactionId}?${params}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch internal transaction: ${response.statusText}`
    );
  }

  return response.json();
};

interface UseBunqInternalTransactionsOptions {
  accountId?: number;
  page?: number;
  perPage?: number;
  filter?: BunqTransactionFilter;
}

interface UseBunqInternalTransactionsReturn {
  internalTransactions: BunqInternalTransactionResponse[];
  pagination: BunqPaginationMeta | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  fetchAllInternalTransactions: () => Promise<
    BunqInternalTransactionResponse[]
  >;
  fetchFilteredInternalTransactions: (
    filter: BunqTransactionFilter
  ) => Promise<BunqInternalTransactionResponse[]>;
  fetchInternalTransaction: (
    transactionId: number
  ) => Promise<BunqInternalTransactionResponse | null>;
}

export const useBunqInternalTransactions = (
  apiToken?: string,
  options: UseBunqInternalTransactionsOptions = {}
): UseBunqInternalTransactionsReturn => {
  const queryClient = useQueryClient();
  const { accountId, page = 1, perPage = 10 } = options;

  const {
    data: paginatedData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: bunqInternalTransactionQueryKeys.internalTransactions(
      accountId,
      page,
      perPage
    ),
    queryFn: () =>
      fetchInternalTransactions(apiToken!, accountId, page, perPage),
    enabled: !!apiToken,
    staleTime: 1000 * 60 * 2, // 2 minutes for internal transactions
    retry: 1,
  });

  const internalTransactions = paginatedData?.data || [];
  const pagination = paginatedData?.pagination || null;

  const fetchAllInternalTransactionsHandler = async (): Promise<
    BunqInternalTransactionResponse[]
  > => {
    if (!apiToken) {
      console.error("[useBunqInternalTransactions]: API token is required");
      return [];
    }

    try {
      return await queryClient.fetchQuery({
        queryKey:
          bunqInternalTransactionQueryKeys.allInternalTransactions(accountId),
        queryFn: () => fetchAllInternalTransactions(apiToken, accountId),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch all internal transactions";
      console.error(
        "[useBunqInternalTransactions]: Error fetching all internal transactions:",
        errorMessage
      );
      return [];
    }
  };

  const fetchFilteredInternalTransactionsHandler = async (
    filter: BunqTransactionFilter
  ): Promise<BunqInternalTransactionResponse[]> => {
    if (!apiToken) {
      console.error("[useBunqInternalTransactions]: API token is required");
      return [];
    }

    try {
      return await queryClient.fetchQuery({
        queryKey:
          bunqInternalTransactionQueryKeys.filteredInternalTransactions(filter),
        queryFn: () => fetchFilteredInternalTransactions(apiToken, filter),
        staleTime: 1000 * 60 * 3, // 3 minutes for filtered results
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch filtered internal transactions";
      console.error(
        "[useBunqInternalTransactions]: Error fetching filtered internal transactions:",
        errorMessage
      );
      return [];
    }
  };

  const fetchInternalTransactionHandler = async (
    transactionId: number
  ): Promise<BunqInternalTransactionResponse | null> => {
    if (!apiToken) {
      console.error("[useBunqInternalTransactions]: API token is required");
      return null;
    }

    try {
      return await queryClient.fetchQuery({
        queryKey: bunqInternalTransactionQueryKeys.internalTransaction(
          transactionId,
          accountId
        ),
        queryFn: () =>
          fetchInternalTransaction(apiToken, transactionId, accountId),
        staleTime: 1000 * 60 * 10, // 10 minutes for individual transactions
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch internal transaction";
      console.error(
        "[useBunqInternalTransactions]: Error fetching internal transaction:",
        errorMessage
      );
      return null;
    }
  };

  return {
    internalTransactions,
    pagination,
    loading,
    error,
    refetch,
    fetchAllInternalTransactions: fetchAllInternalTransactionsHandler,
    fetchFilteredInternalTransactions: fetchFilteredInternalTransactionsHandler,
    fetchInternalTransaction: fetchInternalTransactionHandler,
  };
};
