import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BunqTransactionResponse,
  BunqTransactionFilter,
  PaginatedTransactionResponse,
  BunqInternalTransactionResponse,
} from "@/types/bunq/transactions";
import { BunqPaginationMeta } from "@/types/bunq";

const BUNQ_API_BASE_URL = "http://localhost:8000";

// Query keys
export const bunqTransactionQueryKeys = {
  transactions: (accountId?: number, page?: number, perPage?: number) =>
    ["bunq", "transactions", { accountId, page, perPage }] as const,
  allTransactions: (accountId?: number) =>
    ["bunq", "transactions", "all", { accountId }] as const,
  filteredTransactions: (filter: BunqTransactionFilter) =>
    ["bunq", "transactions", "filtered", filter] as const,
  transaction: (transactionId: number, accountId?: number) =>
    ["bunq", "transactions", transactionId, { accountId }] as const,
  internalTransactions: (accountId?: number, page?: number, perPage?: number) =>
    ["bunq", "internal-transactions", { accountId, page, perPage }] as const,
  allInternalTransactions: (accountId?: number) =>
    ["bunq", "internal-transactions", "all", { accountId }] as const,
  combinedTransactions: (accountId?: number, includeInternal?: boolean) =>
    ["bunq", "combined-transactions", { accountId, includeInternal }] as const,
};

// API functions
const fetchTransactions = async (
  apiToken: string,
  accountId?: number,
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedTransactionResponse> => {
  const params = new URLSearchParams();
  if (accountId) params.append("account_id", accountId.toString());
  params.append("page", page.toString());
  params.append("per_page", perPage.toString());

  const response = await fetch(`${BUNQ_API_BASE_URL}/transactions?${params}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }

  return response.json();
};

const fetchAllTransactions = async (
  apiToken: string,
  accountId?: number
): Promise<BunqTransactionResponse[]> => {
  const params = new URLSearchParams();
  if (accountId) params.append("account_id", accountId.toString());

  const response = await fetch(
    `${BUNQ_API_BASE_URL}/transactions/all?${params}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch all transactions: ${response.statusText}`);
  }

  return response.json();
};

const fetchFilteredTransactions = async (
  apiToken: string,
  filter: BunqTransactionFilter
): Promise<BunqTransactionResponse[]> => {
  const response = await fetch(`${BUNQ_API_BASE_URL}/transactions/filter`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filter),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch filtered transactions: ${response.statusText}`
    );
  }

  return response.json();
};

const fetchTransaction = async (
  apiToken: string,
  transactionId: number,
  accountId?: number
): Promise<BunqTransactionResponse> => {
  const params = new URLSearchParams();
  if (accountId) params.append("account_id", accountId.toString());

  const response = await fetch(
    `${BUNQ_API_BASE_URL}/transactions/${transactionId}?${params}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch transaction: ${response.statusText}`);
  }

  return response.json();
};

// Internal transaction API functions
const fetchInternalTransactions = async (
  apiToken: string,
  accountId?: number,
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedTransactionResponse> => {
  const params = new URLSearchParams();
  if (accountId) params.append("account_id", accountId.toString());
  params.append("page", page.toString());
  params.append("per_page", perPage.toString());
  params.append("include_internal", "true");

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

// Combined transactions (regular + internal)
const fetchCombinedTransactions = async (
  apiToken: string,
  accountId?: number,
  includeInternal: boolean = true
): Promise<BunqTransactionResponse[]> => {
  const params = new URLSearchParams();
  if (accountId) params.append("account_id", accountId.toString());
  if (includeInternal) params.append("include_internal", "true");

  const response = await fetch(
    `${BUNQ_API_BASE_URL}/transactions/combined?${params}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch combined transactions: ${response.statusText}`
    );
  }

  return response.json();
};

interface UseBunqTransactionsOptions {
  accountId?: number;
  page?: number;
  perPage?: number;
  filter?: BunqTransactionFilter;
  includeInternal?: boolean;
  internalOnly?: boolean;
}

interface UseBunqTransactionsReturn {
  transactions: BunqTransactionResponse[];
  internalTransactions: BunqInternalTransactionResponse[];
  allTransactions: BunqTransactionResponse[];
  pagination: BunqPaginationMeta | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  fetchAllTransactions: () => Promise<BunqTransactionResponse[]>;
  fetchAllInternalTransactions: () => Promise<
    BunqInternalTransactionResponse[]
  >;
  fetchCombinedTransactions: () => Promise<BunqTransactionResponse[]>;
  fetchFilteredTransactions: (
    filter: BunqTransactionFilter
  ) => Promise<BunqTransactionResponse[]>;
  fetchTransaction: (
    transactionId: number
  ) => Promise<BunqTransactionResponse | null>;
}

export const useBunqTransactions = (
  apiToken?: string,
  options: UseBunqTransactionsOptions = {}
): UseBunqTransactionsReturn => {
  const queryClient = useQueryClient();
  const {
    accountId,
    page = 1,
    perPage = 10,
    includeInternal = true,
    internalOnly = false,
  } = options;

  // Regular transactions query
  const {
    data: paginatedData,
    isLoading: loadingRegular,
    error: errorRegular,
    refetch: refetchRegular,
  } = useQuery({
    queryKey: bunqTransactionQueryKeys.transactions(accountId, page, perPage),
    queryFn: () => fetchTransactions(apiToken!, accountId, page, perPage),
    enabled: !!apiToken && !internalOnly,
    staleTime: 1000 * 60 * 2, // 2 minutes for transactions
    retry: 1,
  });

  // Internal transactions query
  const {
    // data: internalPaginatedData,
    isLoading: loadingInternal,
    error: errorInternal,
    refetch: refetchInternal,
  } = useQuery({
    queryKey: bunqTransactionQueryKeys.internalTransactions(
      accountId,
      page,
      perPage
    ),
    queryFn: () =>
      fetchInternalTransactions(apiToken!, accountId, page, perPage),
    enabled: !!apiToken && (includeInternal || internalOnly),
    staleTime: 1000 * 60 * 2, // 2 minutes for internal transactions
    retry: 1,
  });

  // Combined transactions query
  const {
    data: combinedData,
    isLoading: loadingCombined,
    error: errorCombined,
    refetch: refetchCombined,
  } = useQuery({
    queryKey: bunqTransactionQueryKeys.combinedTransactions(
      accountId,
      includeInternal
    ),
    queryFn: () =>
      fetchCombinedTransactions(apiToken!, accountId, includeInternal),
    enabled: !!apiToken && includeInternal && !internalOnly,
    staleTime: 1000 * 60 * 2, // 2 minutes for combined transactions
    retry: 1,
  });

  const transactions = paginatedData?.data || [];
  // const internalTransactions = internalPaginatedData?.data || [];
  const allTransactions = combinedData || [];
  const pagination = paginatedData?.pagination || null;

  const loading = internalOnly
    ? loadingInternal
    : loadingRegular || loadingInternal || loadingCombined;
  const error = internalOnly
    ? errorInternal
    : errorRegular || errorInternal || errorCombined;

  const refetch = () => {
    if (internalOnly) {
      refetchInternal();
    } else {
      refetchRegular();
      refetchInternal();
      refetchCombined();
    }
  };

  const fetchAllTransactionsHandler = async (): Promise<
    BunqTransactionResponse[]
  > => {
    if (!apiToken) {
      console.error("[useBunqTransactions]: API token is required");
      return [];
    }

    try {
      return await queryClient.fetchQuery({
        queryKey: bunqTransactionQueryKeys.allTransactions(accountId),
        queryFn: () => fetchAllTransactions(apiToken, accountId),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch all transactions";
      console.error(
        "[useBunqTransactions]: Error fetching all transactions:",
        errorMessage
      );
      return [];
    }
  };

  const fetchFilteredTransactionsHandler = async (
    filter: BunqTransactionFilter
  ): Promise<BunqTransactionResponse[]> => {
    if (!apiToken) {
      console.error("[useBunqTransactions]: API token is required");
      return [];
    }

    try {
      return await queryClient.fetchQuery({
        queryKey: bunqTransactionQueryKeys.filteredTransactions(filter),
        queryFn: () => fetchFilteredTransactions(apiToken, filter),
        staleTime: 1000 * 60 * 3, // 3 minutes for filtered results
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch filtered transactions";
      console.error(
        "[useBunqTransactions]: Error fetching filtered transactions:",
        errorMessage
      );
      return [];
    }
  };

  const fetchTransactionHandler = async (
    transactionId: number
  ): Promise<BunqTransactionResponse | null> => {
    if (!apiToken) {
      console.error("[useBunqTransactions]: API token is required");
      return null;
    }

    try {
      return await queryClient.fetchQuery({
        queryKey: bunqTransactionQueryKeys.transaction(
          transactionId,
          accountId
        ),
        queryFn: () => fetchTransaction(apiToken, transactionId, accountId),
        staleTime: 1000 * 60 * 10, // 10 minutes for individual transactions
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch transaction";
      console.error(
        "[useBunqTransactions]: Error fetching transaction:",
        errorMessage
      );
      return null;
    }
  };

  const fetchAllInternalTransactionsHandler = async (): Promise<
    BunqInternalTransactionResponse[]
  > => {
    if (!apiToken) {
      console.error("[useBunqTransactions]: API token is required");
      return [];
    }

    try {
      return await queryClient.fetchQuery({
        queryKey: bunqTransactionQueryKeys.allInternalTransactions(accountId),
        queryFn: () => fetchAllInternalTransactions(apiToken, accountId),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch all internal transactions";
      console.error(
        "[useBunqTransactions]: Error fetching all internal transactions:",
        errorMessage
      );
      return [];
    }
  };

  const fetchCombinedTransactionsHandler = async (): Promise<
    BunqTransactionResponse[]
  > => {
    if (!apiToken) {
      console.error("[useBunqTransactions]: API token is required");
      return [];
    }

    try {
      return await queryClient.fetchQuery({
        queryKey: bunqTransactionQueryKeys.combinedTransactions(
          accountId,
          includeInternal
        ),
        queryFn: () =>
          fetchCombinedTransactions(apiToken, accountId, includeInternal),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch combined transactions";
      console.error(
        "[useBunqTransactions]: Error fetching combined transactions:",
        errorMessage
      );
      return [];
    }
  };

  return {
    transactions,
    internalTransactions: [],
    allTransactions,
    pagination,
    loading,
    error,
    refetch,
    fetchAllTransactions: fetchAllTransactionsHandler,
    fetchAllInternalTransactions: fetchAllInternalTransactionsHandler,
    fetchCombinedTransactions: fetchCombinedTransactionsHandler,
    fetchFilteredTransactions: fetchFilteredTransactionsHandler,
    fetchTransaction: fetchTransactionHandler,
  };
};
