"use client";

import { Transaction } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import {
  SkeletonTransactionCard,
  AnimationWrapper,
  StaggeredContainer,
} from "@/components/ui";
import { useRouter } from "next/navigation";
import { useFormatting } from "@/contexts/FormattingContext";

interface RecentTransactionsProps {
  transactions: Transaction[];
  maxItems?: number;
  showBalance: boolean;
  isLoading?: boolean;
}

// Transaction Card Component
interface TransactionCardProps {
  transaction: Transaction;
  showBalance: boolean;
}

const TransactionCard = ({
  transaction,
  showBalance,
}: TransactionCardProps) => {
  const { formatCurrency, formatDate } = useFormatting();

  return (
    <div className="group relative p-4 rounded-xl overflow-hidden transition-all duration-500 border border-gray-800 bg-gray-900/50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)] hover:-translate-y-2 hover:scale-[1.02] will-change-transform">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Type Icon */}
          <div className="relative">
            <div
              className={`p-3 rounded-lg transition-all duration-500 group-hover:scale-110 ${
                transaction.type === "income"
                  ? "bg-green-500/10 text-green-500 group-hover:bg-green-500/20"
                  : "bg-red-500/10 text-red-500 group-hover:bg-red-500/20"
              }`}
            >
              {transaction.type === "income" ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7L17 17M17 17H7M17 17V7" />
                </svg>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-white mb-1 transition-colors duration-300 group-hover:text-white/90">
              {transaction.description}
            </h3>
            <p className="text-sm text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
              {transaction.category}
            </p>
            <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`font-semibold text-lg transition-all duration-300 group-hover:scale-105 ${
              transaction.type === "income" ? "text-green-500" : "text-red-500"
            }`}
          >
            {showBalance ? (
              <>
                {transaction.type === "income" ? "+" : ""}
                {formatCurrency(Math.abs(transaction.amount))}
              </>
            ) : (
              "••••••"
            )}
          </p>
        </div>
      </div>

      {/* Gradient border effect */}
      <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export const RecentTransactions = ({
  transactions,
  maxItems = 5,
  showBalance,
  isLoading = false,
}: RecentTransactionsProps) => {
  const router = useRouter();
  const displayTransactions = transactions.slice(0, maxItems);

  const handleViewAll = () => {
    router.push("/transactions?view=all");
  };

  return (
    <AnimationWrapper animation="fadeIn" delay={300}>
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          {!isLoading && (
            <AnimationWrapper animation="slideIn" delay={400}>
              <Button
                onClick={handleViewAll}
                variant="outline"
                size="sm"
                className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
              >
                View All
              </Button>
            </AnimationWrapper>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <AnimationWrapper
                key={index}
                animation="scaleIn"
                delay={500 + index * 100}
                duration={400}
              >
                <SkeletonTransactionCard />
              </AnimationWrapper>
            ))}
          </div>
        ) : (
          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            staggerDelay={100}
            animation="scaleIn"
          >
            {displayTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                showBalance={showBalance}
              />
            ))}
          </StaggeredContainer>
        )}
      </div>
    </AnimationWrapper>
  );
};
