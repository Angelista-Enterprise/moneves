"use client";

import { TransactionSummaryProps } from "./types";
import { SummaryCard } from "./SummaryCard";
import {
  SkeletonOverviewCard,
  AnimationWrapper,
  StaggeredContainer,
} from "@/components/ui";
import { TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react";
import { useFormatting } from "@/contexts/FormattingContext";

export const TransactionSummary = ({
  transactions,
  filteredTransactions,
  showBalance,
  isLoading = false,
}: TransactionSummaryProps) => {
  const { formatCurrency } = useFormatting();

  // Calculate real metrics from unified transactions
  const metrics = {
    totalIncome: transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: Math.abs(
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
    ),
    netAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    transactionCount: filteredTransactions.length,
    incomeChange: 0,
    expensesChange: 0,
    netChange: 0,
    transactionCountChange: 0,
  };

  return (
    <AnimationWrapper animation="fadeIn" delay={200}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Overview</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <AnimationWrapper
                key={index}
                animation="scaleIn"
                delay={300 + index * 100}
                duration={400}
              >
                <SkeletonOverviewCard />
              </AnimationWrapper>
            ))}
          </div>
        ) : (
          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            staggerDelay={100}
            animation="scaleIn"
          >
            <SummaryCard
              title="Total Income"
              description="All income transactions this month"
              amount={formatCurrency(metrics.totalIncome)}
              change={metrics.incomeChange}
              icon={<TrendingUp className="w-4 h-4 text-green-500" />}
              showBalance={showBalance}
            />
            <SummaryCard
              title="Total Expenses"
              description="All expense transactions this month"
              amount={formatCurrency(metrics.totalExpenses)}
              change={metrics.expensesChange}
              icon={<TrendingDown className="w-4 h-4 text-red-500" />}
              showBalance={showBalance}
            />
            <SummaryCard
              title="Net Amount"
              description="Your net financial position"
              amount={formatCurrency(metrics.netAmount)}
              change={metrics.netChange}
              icon={<Wallet className="w-4 h-4 text-blue-500" />}
              showBalance={showBalance}
            />
            <SummaryCard
              title="Transaction Count"
              description="Total number of transactions"
              amount={metrics.transactionCount.toString()}
              change={metrics.transactionCountChange}
              icon={<CreditCard className="w-4 h-4 text-purple-500" />}
              showBalance={showBalance}
            />
          </StaggeredContainer>
        )}
      </div>
    </AnimationWrapper>
  );
};
