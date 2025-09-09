"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CircleProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number;
  className?: string;
}

export const CircleProgress = ({
  size = 60,
  strokeWidth = 6,
  progress,
  className,
}: CircleProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const getColor = (percentage: number) => {
    if (percentage < 70) return "stroke-emerald-500";
    if (percentage < 90) return "stroke-amber-500";
    return "stroke-red-500";
  };

  return (
    <div
      className={cn("relative", className)}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="fill-transparent stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn(
            "fill-transparent transition-all duration-300",
            getColor(progress)
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
