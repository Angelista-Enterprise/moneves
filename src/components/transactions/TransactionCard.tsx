"use client";

import { TransactionCardProps } from "./types";
import { useFormatting } from "@/contexts/FormattingContext";

export const TransactionCard = ({
  transaction,
  showBalance,
  onViewDetails,
  dateGroupInfo,
}: TransactionCardProps) => {
  const { formatCurrency, formatDate } = useFormatting();

  // Calculate date-based visual properties (simplified - no animations)
  const getDateBasedStyles = (dateString: string) => {
    const transactionDate = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Recent (0-2 days): Warm colors, high opacity, strong elevation
    if (daysDiff <= 2) {
      return {
        opacity: 1,
        elevation: "shadow-[0_8px_32px_rgba(255,165,0,0.15)]",
        glowColor: "from-orange-500/20 to-red-500/20",
        borderGlow: "border-orange-500/30",
        textWeight: "font-bold",
      };
    }
    // Recent-ish (3-7 days): Medium warm colors, good opacity, medium elevation
    else if (daysDiff <= 7) {
      return {
        opacity: 0.95,
        elevation: "shadow-[0_6px_24px_rgba(255,165,0,0.1)]",
        glowColor: "from-yellow-500/15 to-orange-500/15",
        borderGlow: "border-yellow-500/20",
        textWeight: "font-semibold",
      };
    }
    // Medium (1-2 weeks): Neutral colors, medium opacity, subtle elevation
    else if (daysDiff <= 14) {
      return {
        opacity: 0.9,
        elevation: "shadow-[0_4px_16px_rgba(255,255,255,0.05)]",
        glowColor: "from-gray-500/10 to-gray-600/10",
        borderGlow: "border-gray-500/15",
        textWeight: "font-medium",
      };
    }
    // Older (2+ weeks): Cool colors, lower opacity, minimal elevation
    else {
      return {
        opacity: 0.8,
        elevation: "shadow-[0_2px_8px_rgba(100,150,255,0.05)]",
        glowColor: "from-blue-500/10 to-purple-500/10",
        borderGlow: "border-blue-500/10",
        textWeight: "font-normal",
      };
    }
  };

  const dateStyles = getDateBasedStyles(transaction.date);

  return (
    <div
      className={`relative flex-1 ${
        dateGroupInfo?.isNewDateGroup ? "mt-6" : ""
      }`}
    >
      {/* Subtle date indicator for new date groups */}
      {dateGroupInfo?.showDateIndicator && (
        <div className="mb-2 flex items-center">
          <div className="text-xs text-white font-medium px-2 py-1 bg-gray-800/30 rounded-md">
            {new Date(transaction.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-700/50 to-transparent ml-2"></div>
        </div>
      )}

      <div
        className={`group relative p-4 rounded-xl flex-1 overflow-hidden border ${dateStyles.borderGlow} bg-gray-900/50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)] hover:-translate-y-2 hover:scale-[1.02] hover:opacity-100 cursor-pointer ${dateStyles.elevation} transition-all duration-500 will-change-transform`}
        style={{ opacity: dateStyles.opacity }}
        onClick={() => onViewDetails(transaction)}
      >
        {/* Background gradient overlay with date-based colors */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${dateStyles.glowColor} rounded-xl`}
          />
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
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={`${dateStyles.textWeight} text-white transition-colors duration-300 group-hover:text-white/90`}
                >
                  {transaction.description}
                </h3>
                {transaction.isInternal && (
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md">
                    🔄 Internal
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
                {transaction.category}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                  {formatDate(transaction.date)}
                </p>
                <div className="w-1 h-1 bg-gray-600 rounded-full transition-colors duration-300 group-hover:bg-gray-500"></div>
                <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-semibold text-lg transition-all duration-300 group-hover:scale-105 ${
                transaction.type === "income"
                  ? "text-green-500"
                  : "text-red-500"
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
            <p className="text-xs text-gray-400 mt-1 transition-colors duration-300 group-hover:text-gray-300">
              View Details →
            </p>
          </div>
        </div>

        {/* Gradient border effect */}
        <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Timeline indicator */}
        <div className="absolute top-2 right-2">
          <div
            className={`w-2 h-2 rounded-full ${
              dateStyles.glowColor.includes("orange")
                ? "bg-orange-500"
                : dateStyles.glowColor.includes("yellow")
                ? "bg-yellow-500"
                : dateStyles.glowColor.includes("blue")
                ? "bg-blue-500"
                : "bg-gray-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
