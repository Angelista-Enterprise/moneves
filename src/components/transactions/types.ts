// Transaction type for the transactions page
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  account: string;
  status: string;
  // Internal transaction specific fields
  isInternal?: boolean;
  sourceAccountId?: number;
  destinationAccountId?: number;
  transferType?: "INTERNAL_TRANSFER" | "INTERNAL_PAYMENT";
}

// Props for transaction components
export interface TransactionCardProps {
  transaction: Transaction;
  showBalance: boolean;
  onViewDetails: (transaction: Transaction) => void;
  dateGroupInfo?: {
    isNewDateGroup: boolean;
    showDateIndicator: boolean;
  };
}

export interface TransactionDetailProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  showBalance: boolean;
}

export interface SummaryCardProps {
  title: string;
  description: string;
  amount: string;
  change: number;
  icon: React.ReactNode;
  showBalance: boolean;
}

export interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedAmountRange: string;
  setSelectedAmountRange: (range: string) => void;
  selectedDateRange: string;
  setSelectedDateRange: (range: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  currentPeriod: number;
  setCurrentPeriod: (period: number) => void;
  categories: Record<string, { id: string; name: string }>;
}

export interface TransactionSummaryProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  bunqTransactions?: import("@/types/bunq/transactions").BunqTransactionResponse[];
  showBalance: boolean;
  isLoading?: boolean;
}
