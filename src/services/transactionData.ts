/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "@/components/transactions/types";
import { BunqInternalTransactionResponse } from "@/types/bunq/transactions";
// Removed mock data import - using real Bunq data

// Convert Bunq transactions to our Transaction format
export const convertBunqTransactions = (
  bunqTransactions: unknown[]
): Transaction[] => {
  return bunqTransactions.map((tx: any, index) => {
    // Safely extract ID - handle both string and number types
    const extractId = (id: any): number => {
      if (typeof id === "string") {
        const numericId = id.replace(/\D/g, "");
        return numericId ? parseInt(numericId, 10) : index;
      }
      if (typeof id === "number") {
        return id;
      }
      return index;
    };

    const extractAmount = (amount: any): number => {
      if (typeof amount === "string") {
        return parseFloat(amount) || 0;
      }
      if (typeof amount === "number") {
        return amount;
      }
      if (typeof amount === "object" && amount?.value) {
        return parseFloat(amount.value) || 0;
      }
      return 0;
    };

    const amount = extractAmount(tx.amount);

    return {
      id: extractId(tx.id),
      description:
        tx.description ||
        tx.counterparty_alias?.display_name ||
        "Unknown Transaction",
      amount,
      category: tx.category || "Other",
      type: amount >= 0 ? "income" : "expense",
      date: tx.created || tx.date || new Date().toISOString(),
      account:
        tx.account_balance?.account?.description ||
        tx.account ||
        "Unknown Account",
      status: tx.status || "completed",
    };
  });
};

// Get transaction data from Bunq API
export const getTransactionData = (
  bunqTransactions?: unknown[]
): Transaction[] => {
  if (bunqTransactions && bunqTransactions.length > 0) {
    return convertBunqTransactions(bunqTransactions);
  }

  // Return empty array if no Bunq data available
  return [];
};

// Filter transactions based on various criteria
export const filterTransactions = (
  transactions: Transaction[],
  filters: {
    searchTerm: string;
    selectedType: string;
    selectedCategory: string;
    selectedAmountRange: string;
    selectedDateRange: string;
    selectedStatus: string;
    startDate: string;
    endDate: string;
    currentPeriod: number;
  }
): Transaction[] => {
  return transactions.filter((transaction) => {
    const {
      searchTerm,
      selectedType,
      selectedCategory,
      selectedAmountRange,
      selectedDateRange,
      selectedStatus,
      startDate,
      endDate,
      currentPeriod,
    } = filters;

    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || transaction.type === selectedType;
    const matchesCategory =
      selectedCategory === "all" || transaction.category === selectedCategory;

    // Date range filtering
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    const matchesDateRange = (() => {
      // If custom date range is selected, use start/end dates
      if (selectedDateRange === "custom") {
        if (!startDate || !endDate) return true;
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date
        return transactionDate >= start && transactionDate <= end;
      }

      // If no date range selected, show all
      if (selectedDateRange === "all") return true;

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Calculate period based on frequency and currentPeriod offset
      const getPeriodRange = (frequency: string, offset: number) => {
        const baseDate = new Date(today);

        switch (frequency) {
          case "weekly":
            // Go back by offset weeks from current week
            const weekStart = new Date(baseDate);
            weekStart.setDate(
              baseDate.getDate() - baseDate.getDay() - offset * 7
            );
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);
            return { start: weekStart, end: weekEnd };

          case "monthly":
            // Go back by offset months from current month
            const monthStart = new Date(
              baseDate.getFullYear(),
              baseDate.getMonth() - offset,
              1
            );
            const monthEnd = new Date(
              baseDate.getFullYear(),
              baseDate.getMonth() - offset + 1,
              0
            );
            monthEnd.setHours(23, 59, 59, 999);
            return { start: monthStart, end: monthEnd };

          case "yearly":
            // Go back by offset years from current year
            const yearStart = new Date(baseDate.getFullYear() - offset, 0, 1);
            const yearEnd = new Date(baseDate.getFullYear() - offset, 11, 31);
            yearEnd.setHours(23, 59, 59, 999);
            return { start: yearStart, end: yearEnd };

          default:
            return { start: new Date(0), end: new Date() };
        }
      };

      const periodRange = getPeriodRange(selectedDateRange, currentPeriod);
      return (
        transactionDate >= periodRange.start &&
        transactionDate <= periodRange.end
      );
    })();

    // Amount range filtering
    const matchesAmountRange = (() => {
      if (selectedAmountRange === "all") return true;

      const amount = Math.abs(transaction.amount);
      switch (selectedAmountRange) {
        case "0-50":
          return amount >= 0 && amount <= 50;
        case "50-200":
          return amount > 50 && amount <= 200;
        case "200-500":
          return amount > 200 && amount <= 500;
        case "500-1000":
          return amount > 500 && amount <= 1000;
        case "1000+":
          return amount > 1000;
        default:
          return true;
      }
    })();

    // Status filtering
    const matchesStatus =
      selectedStatus === "all" || transaction.status === selectedStatus;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesDateRange &&
      matchesAmountRange &&
      matchesStatus
    );
  });
};

// Sort transactions by date (most recent first) for natural grouping
export const sortTransactionsByDate = (
  transactions: Transaction[]
): Transaction[] => {
  return [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get date group info for visual grouping
export const getDateGroupInfo = (
  transaction: Transaction,
  index: number,
  sortedTransactions: Transaction[]
) => {
  if (index === 0) return { isNewDateGroup: true, showDateIndicator: true };

  const currentDate = new Date(transaction.date).toDateString();
  const previousDate = new Date(
    sortedTransactions[index - 1].date
  ).toDateString();

  return {
    isNewDateGroup: currentDate !== previousDate,
    showDateIndicator: currentDate !== previousDate,
  };
};

// Convert Bunq internal transactions to our Transaction format
export const convertBunqInternalTransactions = (
  bunqInternalTransactions: BunqInternalTransactionResponse[]
): Transaction[] => {
  return bunqInternalTransactions.map((tx, index) => {
    const extractId = (id: any): number => {
      if (typeof id === "string") {
        const numericId = id.replace(/\D/g, "");
        return numericId ? parseInt(numericId, 10) : index;
      }
      if (typeof id === "number") {
        return id;
      }
      return index;
    };

    const extractAmount = (amount: any): number => {
      if (typeof amount === "string") {
        return parseFloat(amount) || 0;
      }
      if (typeof amount === "number") {
        return amount;
      }
      if (typeof amount === "object" && amount?.value) {
        return parseFloat(amount.value) || 0;
      }
      return 0;
    };

    const amount = extractAmount(tx.amount);

    return {
      id: extractId(tx.id),
      description: tx.description || "Internal Transfer",
      amount,
      category: "Internal Transfer",
      type: amount >= 0 ? "income" : "expense",
      date: tx.created || new Date().toISOString(),
      account: tx.source_account_name || "Internal Account",
      status: tx.status || "completed",
      // Internal transaction specific fields
      isInternal: true,
      sourceAccountId: tx.source_account_id,
      destinationAccountId: tx.destination_account_id,
      transferType: tx.transfer_type || "INTERNAL_TRANSFER",
    };
  });
};

// Get internal transaction data from Bunq API
export const getInternalTransactionData = (
  bunqInternalTransactions?: BunqInternalTransactionResponse[]
): Transaction[] => {
  if (!bunqInternalTransactions || bunqInternalTransactions.length === 0) {
    return [];
  }

  return convertBunqInternalTransactions(bunqInternalTransactions);
};

// Get combined transaction data (regular + internal)
export const getCombinedTransactionData = (
  bunqTransactions?: unknown[],
  bunqInternalTransactions?: BunqInternalTransactionResponse[]
): Transaction[] => {
  const regularTransactions = getTransactionData(bunqTransactions);
  const internalTransactions = getInternalTransactionData(
    bunqInternalTransactions
  );

  // Combine and sort by date (newest first)
  const combined = [...regularTransactions, ...internalTransactions];
  return combined.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
