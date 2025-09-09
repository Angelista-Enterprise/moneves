import React, { useState } from "react";
import { useUnifiedTransactions } from "@/hooks";
import { TransactionCard } from "./TransactionCard";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionSummary } from "./TransactionSummary";
import { AnimationWrapper } from "@/components/ui";

interface TransactionListWithInternalProps {
  userId?: string;
  accountId?: number;
  showBalance?: boolean;
}

export const TransactionListWithInternal: React.FC<
  TransactionListWithInternalProps
> = ({ userId, accountId, showBalance = true }) => {
  // Unified transactions (Bunq + Database)
  const { transactions, loading, error } = useUnifiedTransactions({
    userId,
    accountId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || transaction.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <AnimationWrapper animation="fadeIn">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      </AnimationWrapper>
    );
  }

  if (error) {
    return (
      <AnimationWrapper animation="fadeIn">
        <div className="text-center py-8">
          <div className="text-red-400 mb-4">⚠️</div>
          <p className="text-red-400">Error loading transactions: {error}</p>
        </div>
      </AnimationWrapper>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <TransactionSummary
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        showBalance={showBalance}
      />

      {/* Transaction Filters */}
      <TransactionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCategory="all"
        setSelectedCategory={() => {}}
        selectedAmountRange="all"
        setSelectedAmountRange={() => {}}
        selectedDateRange="all"
        setSelectedDateRange={() => {}}
        selectedStatus="all"
        setSelectedStatus={() => {}}
        startDate=""
        setStartDate={() => {}}
        endDate=""
        setEndDate={() => {}}
        categories={{}}
        currentPeriod={0}
        setCurrentPeriod={() => {}}
      />

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <AnimationWrapper animation="fadeIn">
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">📝</div>
              <p className="text-gray-400">No transactions found</p>
            </div>
          </AnimationWrapper>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <AnimationWrapper
              key={transaction.id}
              animation="fadeIn"
              delay={index * 50}
            >
              <TransactionCard
                transaction={transaction}
                onViewDetails={() => {
                  // Handle view details
                }}
                showBalance={showBalance}
              />
            </AnimationWrapper>
          ))
        )}
      </div>

      {/* Transaction Count */}
      <div className="text-center text-sm text-gray-400">
        {filteredTransactions.length} of {transactions.length} transactions
      </div>
    </div>
  );
};
