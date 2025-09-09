"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  direction?: "left" | "right";
}

export function PageTransition({
  children,
  direction = "right",
}: PageTransitionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        isAnimating
          ? direction === "right"
            ? "translate-x-0 opacity-100"
            : "translate-x-0 opacity-100"
          : "translate-x-0 opacity-100",
        !isVisible && "translate-x-full opacity-0"
      )}
    >
      {children}
    </div>
  );
}

interface NavigationButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  direction?: "left" | "right";
}

export function NavigationButton({
  href,
  children,
  icon,
  className,
}: NavigationButtonProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    setIsNavigating(true);

    // Add a small delay for the animation
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isNavigating}
      className={cn(
        "group relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1",
        isNavigating && "opacity-50 scale-95",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <div className="text-left">
          <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {children}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

      {/* Navigation arrow */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}

interface BentoNavigationProps {
  currentPage: string;
}

export function BentoNavigation({ currentPage }: BentoNavigationProps) {
  const navigationItems = [
    {
      href: "/",
      title: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
          />
        </svg>
      ),
      description: "Overview of your finances",
    },
    {
      href: "/transactions",
      title: "Transactions",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      description: "View and manage transactions",
    },
    {
      href: "/reports",
      title: "Reports",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      description: "Financial overview, category analysis & trends",
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-gray-200 dark:border-slate-700 rounded-2xl p-2 shadow-xl">
        <div className="flex gap-2">
          {navigationItems.map((item) => (
            <NavigationButton
              key={item.href}
              href={item.href}
              icon={item.icon}
              className={cn(
                "min-w-[120px]",
                currentPage === item.href &&
                  "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
              )}
            >
              {item.title}
            </NavigationButton>
          ))}
        </div>
      </div>
    </div>
  );
}
