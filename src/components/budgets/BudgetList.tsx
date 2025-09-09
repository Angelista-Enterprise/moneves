"use client";

import { useState, useMemo } from "react";
import { StaggeredContainer } from "@/components/ui";
import {
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  Filter,
  Search,
  Plus,
  Settings,
  BarChart3,
  Trophy,
  Lightbulb,
  Calendar,
  DollarSign,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { calculateBudgetAnalytics } from "@/services/budgetAnalytics";
import { Transaction } from "@/components/transactions/types";
import { useFormatting } from "@/contexts/FormattingContext";

interface Budget {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  status: string;
  isTracked: number;
  isGoalLess: number;
  createdAt: string | null;
  // Optional fields for compatibility
  priority?: number;
  budgetType?: string;
  alertThreshold?: number;
  rolloverEnabled?: boolean;
  rolloverAmount?: number;
  savingsGoal?: number;
  spendingPattern?: string;
  averageSpending?: number;
  spendingVariance?: number;
}

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[];
  onEdit: (budget: Budget) => void;
  onCreate: () => void;
  onDelete: (id: number) => Promise<void>;
  showBalance: boolean;
  onToggleBalance: () => void;
}

export const BudgetList = ({
  budgets,
  transactions,
  onEdit,
  onCreate,
  onDelete,
  showBalance,
  onToggleBalance,
}: BudgetListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "priority" | "status" | "type"
  >("all");
  const [sortBy, setSortBy] = useState<
    "name" | "spent" | "remaining" | "priority" | "utilization"
  >("utilization");
  // const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { formatCurrency } = useFormatting();

  const getPriorityColor = (priority: number) => {
    const colors = {
      1: "text-red-400 bg-red-500/10",
      2: "text-orange-400 bg-orange-500/10",
      3: "text-yellow-400 bg-yellow-500/10",
      4: "text-blue-400 bg-blue-500/10",
      5: "text-green-400 bg-green-500/10",
    };
    return colors[priority as keyof typeof colors] || colors[3];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on_track":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "near_limit":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "over_budget":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getGradientClass = (priority?: number) => {
    switch (priority || 3) {
      case 1:
        return "from-red-500 via-pink-500 to-orange-500";
      case 2:
        return "from-orange-500 via-amber-500 to-yellow-500";
      case 3:
        return "from-brand via-purple-500 to-pink-500";
      case 4:
        return "from-sky-500 via-blue-500 to-brand";
      case 5:
        return "from-emerald-500 via-teal-500 to-cyan-500";
      default:
        return "from-gray-600 via-gray-500 to-gray-700";
    }
  };

  const getBudgetTypeIcon = (type: string) => {
    switch (type) {
      case "monthly":
        return <Calendar className="w-4 h-4" />;
      case "weekly":
        return <Calendar className="w-4 h-4" />;
      case "yearly":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const filteredAndSortedBudgets = useMemo(() => {
    let filtered = budgets.filter((budget) =>
      budget.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filters
    switch (filterType) {
      case "priority":
        filtered = filtered.filter((budget) => (budget.priority || 3) >= 4);
        break;
      case "status":
        filtered = filtered.filter((budget) => budget.status !== "on_track");
        break;
      case "type":
        filtered = filtered.filter((budget) => budget.budgetType !== "monthly");
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "spent":
          return b.spent - a.spent;
        case "remaining":
          return b.remaining - a.remaining;
        case "priority":
          return (b.priority || 3) - (a.priority || 3);
        case "utilization":
          return b.spent / b.monthlyLimit - a.spent / a.monthlyLimit;
        default:
          return 0;
      }
    });

    return filtered;
  }, [budgets, searchTerm, filterType, sortBy]);

  const BudgetCard = ({ budget }: { budget: Budget }) => {
    const analytics = calculateBudgetAnalytics(budget, transactions);
    const utilizationRate = budget.spent / budget.monthlyLimit;
    const isOverBudget = utilizationRate > 1;
    const isNearLimit = utilizationRate > (budget.alertThreshold || 0.8);

    return (
      <div className="group relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-1 hover:scale-[1.02] will-change-transform">
        {/* Priority Badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              budget.priority || 3
            )}`}
          >
            P{budget.priority || 3}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl relative overflow-hidden border border-gray-700/60">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(
                  budget.priority
                )}`}
              />
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_40%)]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors truncate">
                {budget.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 overflow-hidden">
                {getBudgetTypeIcon(budget.budgetType || "monthly")}
                <span className="capitalize truncate">
                  {budget.budgetType || "monthly"}
                </span>
                {getStatusIcon(budget.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-medium text-white">
              {showBalance ? `${Math.round(utilizationRate * 100)}%` : "••••••"}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isOverBudget
                  ? "bg-gradient-to-r from-rose-500 to-rose-600"
                  : isNearLimit
                  ? "bg-gradient-to-r from-amber-500 to-amber-600"
                  : "bg-gradient-to-r from-emerald-500 to-brand"
              }`}
              style={{ width: `${Math.min(utilizationRate * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Spent</p>
            <p className="text-lg font-semibold text-white">
              {showBalance ? formatCurrency(budget.spent) : "••••••"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Remaining</p>
            <p
              className={`text-lg font-semibold ${
                budget.remaining < 0 ? "text-red-400" : "text-green-400"
              }`}
            >
              {showBalance ? formatCurrency(budget.remaining) : "••••••"}
            </p>
          </div>
        </div>

        {/* Analytics Insights */}
        {analytics.insights.length > 0 && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Insight</span>
            </div>
            <p className="text-xs text-blue-300">
              {analytics.insights[0].description}
            </p>
          </div>
        )}

        {/* Achievements */}
        {analytics.achievements.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-400">
              {analytics.achievements.length} achievement
              {analytics.achievements.length > 1 ? "s" : ""} unlocked
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(budget)}
            className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(
                  `Are you sure you want to delete "${budget.name}"? This action cannot be undone.`
                )
              ) {
                onDelete(budget.id);
              }
            }}
            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            Delete
          </button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 to-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Budget Categories
          </h2>
          <p className="text-gray-400">
            Manage and track your spending across different categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleBalance}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            {showBalance ? (
              <Eye className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <button onClick={onCreate} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white transition-all duration-200 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New budget
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="flex gap-2">
          {[
            { id: "all", label: "All", icon: Filter },
            { id: "priority", label: "High Priority", icon: Star },
            { id: "status", label: "Alerts", icon: AlertTriangle },
            { id: "type", label: "Custom", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFilterType(id as typeof filterType)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                filterType === id
                  ? "border-purple-500 bg-purple-500/10 text-purple-400"
                  : "border-gray-700 text-gray-300 hover:border-gray-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Sort by:</span>
        <div className="flex gap-2">
          {[
            { id: "utilization", label: "Utilization", icon: BarChart3 },
            { id: "name", label: "Name", icon: Target },
            { id: "spent", label: "Spent", icon: DollarSign },
            { id: "remaining", label: "Remaining", icon: Shield },
            { id: "priority", label: "Priority", icon: Star },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSortBy(id as typeof sortBy)}
              className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 flex items-center gap-1 ${
                sortBy === id
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Grid */}
      {filteredAndSortedBudgets.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            No budgets found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first budget category to get started"}
          </p>
          {!searchTerm && (
            <button
              onClick={onCreate}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create budget
            </button>
          )}
        </div>
      ) : (
        <StaggeredContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={100}
          animation="scaleIn"
        >
          {filteredAndSortedBudgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </StaggeredContainer>
      )}
    </div>
  );
};
