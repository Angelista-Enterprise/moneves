"use client";

import { TransactionDetailProps } from "./types";
import { Button } from "@/components/ui/button";
import {
  X,
  Tag,
  Wallet,
  Calendar,
  CreditCard,
  ArrowLeftRight,
} from "lucide-react";
import { useFormatting } from "@/contexts/FormattingContext";

export const TransactionDetailCard = ({
  transaction,
  isOpen,
  onClose,
  showBalance,
}: TransactionDetailProps) => {
  const { formatCurrency, formatDate } = useFormatting();

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Detail Card */}
      <div className="relative w-96 h-full bg-gray-900 border-l border-gray-800 shadow-2xl transform transition-transform duration-300 ease-out">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Transaction Details</h2>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Header */}
          <div className="text-center">
            <div className="relative mx-auto mb-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  transaction.type === "income"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {transaction.type === "income" ? (
                  <svg
                    width="32"
                    height="32"
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
                    width="32"
                    height="32"
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-2xl font-bold">{transaction.description}</h3>
              {transaction.isInternal && (
                <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                  🔄 Internal Transfer
                </span>
              )}
            </div>
            <p
              className={`text-3xl font-bold ${
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
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <Tag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Category</p>
                <p className="font-medium">{transaction.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <Wallet className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Account</p>
                <p className="font-medium">{transaction.account}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-medium">{formatDate(transaction.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="font-medium capitalize">{transaction.status}</p>
              </div>
            </div>

            {/* Internal Transaction Details */}
            {transaction.isInternal && (
              <>
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                    Internal Transfer Details
                  </h4>
                </div>

                {transaction.sourceAccountId && (
                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm text-blue-400">From Account</p>
                      <p className="font-medium">
                        Account #{transaction.sourceAccountId}
                      </p>
                    </div>
                  </div>
                )}

                {transaction.destinationAccountId && (
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm text-green-400">To Account</p>
                      <p className="font-medium">
                        Account #{transaction.destinationAccountId}
                      </p>
                    </div>
                  </div>
                )}

                {transaction.transferType && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <ArrowLeftRight className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Transfer Type</p>
                      <p className="font-medium capitalize">
                        {transaction.transferType
                          .replace("_", " ")
                          .toLowerCase()}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <Button className="w-full" size="sm">
              Edit Transaction
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              Duplicate
            </Button>
            <Button variant="destructive" className="w-full" size="sm">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
