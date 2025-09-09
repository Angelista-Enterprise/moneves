"use client";

import { BentoItem } from "./types";
import { AnimationWrapper, StaggeredContainer } from "@/components/ui";

interface BentoGridProps {
  items: BentoItem[];
  isLoading?: boolean;
  showBalance?: boolean;
}

export const BentoGrid = ({
  items,
  isLoading = false,
  showBalance = true,
}: BentoGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <AnimationWrapper
            key={index}
            animation="scaleIn"
            delay={200 + index * 100}
            duration={400}
          >
            <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-800/50 rounded-lg animate-pulse" />
                <div className="w-16 h-6 bg-gray-800/50 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-8 w-1/2 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-800/50 rounded animate-pulse" />
              </div>
            </div>
          </AnimationWrapper>
        ))}
      </div>
    );
  }

  return (
    <StaggeredContainer
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      staggerDelay={100}
      animation="scaleIn"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={`group relative p-4 rounded-xl overflow-hidden transition-all duration-500 border border-gray-800 bg-gray-900/50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)] hover:-translate-y-2 hover:scale-[1.02] will-change-transform ${
            item.colSpan === 2 ? "md:col-span-2" : ""
          }`}
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-gradient-to-br transition-all duration-500 group-hover:scale-110">
                {item.icon}
              </div>
              {item.change !== undefined && (
                <div
                  className={`flex items-center gap-1 text-sm transition-all duration-300 group-hover:scale-105 ${
                    item.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <span>
                    {showBalance ? (
                      <>
                        {item.change >= 0 ? "+" : ""}
                        {item.change}%
                      </>
                    ) : (
                      "••••••"
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
                {item.title}
              </h3>
              <p className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-white/90">
                {item.amount || "—"}
              </p>
              {item.meta && (
                <p className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                  {item.meta}
                </p>
              )}
              <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                {item.description}
              </p>
            </div>

            {/* Progress bar for items with value and maxValue */}
            {item.value !== undefined && item.maxValue !== undefined && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 group-hover:from-blue-400 group-hover:to-purple-400"
                  style={{
                    width: `${Math.min(
                      (item.value / item.maxValue) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 text-xs bg-gray-800/50 text-gray-300 rounded-md transition-colors duration-300 group-hover:bg-gray-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                {item.status}
              </span>
              {item.cta && (
                <span className="text-xs text-blue-400 transition-colors duration-300 group-hover:text-blue-300">
                  {item.cta} →
                </span>
              )}
            </div>
          </div>

          {/* Gradient border effect */}
          <div
            className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 ${
              item.hasPersistentHover
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-500`}
          />
        </div>
      ))}
    </StaggeredContainer>
  );
};
