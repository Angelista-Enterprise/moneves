export interface BudgetItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  spent: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  progress: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export interface FinancialOverviewItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
}

export interface DashboardData {
  budgetItems: BudgetItem[];
  transactions: Transaction[];
  financialOverview: FinancialOverviewItem[];
}
