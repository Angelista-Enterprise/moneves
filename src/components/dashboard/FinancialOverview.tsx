"use client";

import { FinancialOverviewItem } from "@/types/dashboard";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  SkeletonOverviewCard,
  AnimationWrapper,
  StaggeredContainer,
} from "@/components/ui";
import { useFormatting } from "@/contexts/FormattingContext";

interface FinancialOverviewProps {
  items: FinancialOverviewItem[];
  showBalance: boolean;
  isLoading?: boolean;
}

export const FinancialOverview = ({
  items,
  showBalance,
  isLoading = false,
}: FinancialOverviewProps) => {
  const { formatCurrency, formatPercentage } = useFormatting();

  return (
    <AnimationWrapper animation="fadeIn" delay={100}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Overview</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <AnimationWrapper
                key={index}
                animation="scaleIn"
                delay={200 + index * 100}
                duration={400}
              >
                <SkeletonOverviewCard />
              </AnimationWrapper>
            ))}
          </div>
        ) : (
          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6"
            staggerDelay={100}
            animation="scaleIn"
          >
            {items.map((item) => {
              const Icon = item.icon;
              const ChangeIcon =
                item.changeType === "increase" ? ArrowUpRight : ArrowDownRight;

              return (
                <div
                  key={item.id}
                  className="group relative p-4 rounded-xl overflow-hidden transition-all duration-500 border border-gray-800 bg-gray-900/50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:-translate-y-1 hover:scale-[1.02] will-change-transform"
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
                  </div>
                  <div className="relative flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-gradient-to-br transition-all duration-500">
                        <Icon size={24} className={item.color} />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm transition-all duration-300 ${
                          item.changeType === "increase"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <ChangeIcon size={16} />
                        <span>{item.change}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
                        {item.title}
                      </h3>
                      <p className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-white/90">
                        {showBalance
                          ? item.title === "Savings Rate"
                            ? formatPercentage(item.amount)
                            : formatCurrency(item.amount)
                          : "••••••"}
                      </p>
                      <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Gradient border effect */}
                  <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              );
            })}
          </StaggeredContainer>
        )}
      </div>
    </AnimationWrapper>
  );
};
