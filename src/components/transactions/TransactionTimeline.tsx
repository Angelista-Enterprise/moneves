"use client";

import { useMemo, useState } from "react";
import { useFormatting } from "@/contexts/FormattingContext";
import { Transaction } from "./types";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";

interface TransactionTimelineProps {
  transactions: Transaction[];
  showBalance: boolean;
  onViewDetails: (tx: Transaction) => void;
}

function groupByDay(transactions: Transaction[]) {
  const map = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const dayKey = new Date(tx.date).toDateString();
    if (!map.has(dayKey)) map.set(dayKey, []);
    map.get(dayKey)!.push(tx);
  }
  return Array.from(map.entries()).map(([day, items]) => ({ day, items }));
}

export const TransactionTimeline = ({
  transactions,
  showBalance,
  onViewDetails,
}: TransactionTimelineProps) => {
  const { formatCurrency, formatDate } = useFormatting();

  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all"
  );

  const computeQuantile = (values: number[], q: number): number => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };

  const { grouped, largeAmountThreshold, recurringDescriptions } =
    useMemo(() => {
      const byDay = groupByDay(transactions);
      const amountsAbs = transactions.map((t) => Math.abs(t.amount));
      const threshold = computeQuantile(amountsAbs, 0.9);
      const descCounts = new Map<string, number>();
      for (const t of transactions) {
        descCounts.set(t.description, (descCounts.get(t.description) || 0) + 1);
      }
      const recurring = new Set(
        Array.from(descCounts.entries())
          .filter(([, c]) => c >= 2)
          .map(([d]) => d)
      );
      return {
        grouped: byDay,
        largeAmountThreshold: threshold,
        recurringDescriptions: recurring,
      };
    }, [transactions]);

  return (
    <div className="relative">
      {/* Vertical center line for large screens */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700/40 to-transparent" />

      <div className="space-y-12">
        {grouped.map(({ day, items }, groupIndex) => (
          <section key={day} className="relative">
            {/* Day header */}
            <div className="sticky top-0 z-10 -mx-4 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 bg-gray-900/60 text-gray-200 text-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.65)]" />
                  {day}
                </div>
                <div className="hidden md:flex items-center gap-3 text-xs">
                  {(() => {
                    const income = items
                      .filter((t) => t.type === "income")
                      .reduce((s, t) => s + Math.abs(t.amount), 0);
                    const expense = items
                      .filter((t) => t.type === "expense")
                      .reduce((s, t) => s + Math.abs(t.amount), 0);
                    const net = income - expense;
                    return (
                      <>
                        <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                          +{formatCurrency(income)}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          -{formatCurrency(expense)}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-200 border border-gray-700/60">
                          Net {net >= 0 ? "+" : "-"}
                          {formatCurrency(Math.abs(net))}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
              {groupIndex === 0 && (
                <div className="mt-2 flex gap-2">
                  <Button
                    variant={typeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={typeFilter === "income" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter("income")}
                  >
                    Income
                  </Button>
                  <Button
                    variant={typeFilter === "expense" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter("expense")}
                  >
                    Expenses
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {items
                .filter((t) =>
                  typeFilter === "all" ? true : t.type === typeFilter
                )
                .map((tx, i) => {
                  const isLeft = (groupIndex + i) % 2 === 0;
                  return (
                    <div
                      key={tx.id}
                      className={isLeft ? "lg:pr-10" : "lg:pl-10"}
                    >
                      <div className="relative">
                        {/* Connector dot + line to center */}
                        <div
                          className={
                            "hidden lg:block absolute top-6 w-3 h-3 rounded-full bg-gray-700 ring-4 ring-black" +
                            (isLeft ? " -right-1.5" : " -left-1.5")
                          }
                        />
                        <div
                          className={
                            "hidden lg:block absolute top-7 h-px w-10 bg-gradient-to-" +
                            (isLeft
                              ? "r from-gray-700/70 to-transparent right-0"
                              : "l from-gray-700/70 to-transparent left-0")
                          }
                        />

                        {/* Card */}
                        <button
                          type="button"
                          onClick={() => onViewDetails(tx)}
                          className="group w-full text-left"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-20%" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative p-4 rounded-xl border border-gray-800 bg-gray-900/60 hover:bg-gray-900/80 transition-colors duration-300"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-white font-medium mb-1">
                                  {tx.description}
                                </h4>
                                <p className="text-sm text-gray-400 mb-1">
                                  {tx.category}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(tx.date)}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {recurringDescriptions.has(
                                    tx.description
                                  ) && (
                                    <span className="px-2 py-0.5 text-[11px] rounded bg-blue-500/15 text-blue-300 border border-blue-500/25">
                                      Recurring
                                    </span>
                                  )}
                                  {Math.abs(tx.amount) >=
                                    largeAmountThreshold && (
                                    <span className="px-2 py-0.5 text-[11px] rounded bg-amber-500/15 text-amber-300 border border-amber-500/25">
                                      Large
                                    </span>
                                  )}
                                  {tx.category === "Uncategorized" && (
                                    <span className="px-2 py-0.5 text-[11px] rounded bg-red-500/10 text-red-300 border border-red-500/20">
                                      Needs category
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div
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
                              </div>
                            </div>

                            {/* Glow accent */}
                            <div
                              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                boxShadow:
                                  "0 0 40px rgba(255,255,255,0.06) inset",
                              }}
                            />
                          </motion.div>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TransactionTimeline;
