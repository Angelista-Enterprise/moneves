export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  amount?: string;
  meta?: string;
  value?: number;
  maxValue?: number;
  change?: number;
  tags: string[];
  status: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
  cta?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  color: string;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  percentage: number;
  isActive: boolean;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface ReportsPageProps {
  showBalance: boolean;
  setShowBalance: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  categories: CategoryData[];
  filteredCategories: CategoryData[];
  monthlyTrends: MonthlyTrend[];
  isLoading: boolean;
  hasError: boolean;
  budgetCategoriesError?: Error;
  transactionsError?: Error;
}
