"use client";

import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SkeletonTransactionCard } from "@/components/ui";
import { useFormatting } from "@/contexts/FormattingContext";
import { Transaction } from "./types";

interface RecentTransactionsCarouselProps {
  transactions: Transaction[];
  showBalance: boolean;
  isLoading?: boolean;
  maxItems?: number;
}

export const RecentTransactionsCarousel = ({
  transactions,
  showBalance,
  isLoading = false,
  maxItems = 12,
}: RecentTransactionsCarouselProps) => {
  const { formatCurrency, formatDate } = useFormatting();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const displayTransactions = useMemo(
    () => transactions.slice(0, maxItems),
    [transactions, maxItems]
  );

  const scrollByViewport = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9 * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
          <p className="text-sm text-gray-400 mt-1">
            {transactions.length} total
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
            onClick={() => scrollByViewport(-1)}
            aria-label="Previous"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
            onClick={() => scrollByViewport(1)}
            aria-label="Next"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonTransactionCard key={i} />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory no-scrollbar pr-2 py-1"
            style={{ scrollBehavior: "smooth" }}
          >
            {displayTransactions.map((tx) => (
              <div
                key={tx.id}
                className="min-w-[82%] sm:min-w-[48%] lg:min-w-[31%] snap-start"
              >
                <div className="group relative p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)] hover:ring-1 hover:ring-gray-700/60 hover:border-gray-700 hover:z-10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white mb-1">
                        {tx.description}
                      </h4>
                      <p className="text-sm text-gray-400 mb-1">
                        {tx.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(tx.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={
                          tx.type === "income"
                            ? "text-green-500 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {showBalance ? (
                          <>
                            {tx.type === "income" ? "+" : ""}
                            {formatCurrency(Math.abs(tx.amount))}
                          </>
                        ) : (
                          "••••••"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden flex justify-end gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
              onClick={() => scrollByViewport(-1)}
              aria-label="Previous"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
              onClick={() => scrollByViewport(1)}
              aria-label="Next"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsCarousel;
