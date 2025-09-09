"use client";

import { CategoryData } from "./types";
import { AnimationWrapper } from "@/components/ui";
import { Search, Filter, Palette } from "lucide-react";

interface ReportsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: CategoryData[];
}

export const ReportsFilters = ({
  searchTerm,
  setSearchTerm,
  selectedPeriod,
  setSelectedPeriod,
  selectedCategory,
  setSelectedCategory,
  categories,
}: ReportsFiltersProps) => {
  return (
    <AnimationWrapper animation="fadeIn" delay={300}>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-300" />
            <input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm">
              <Filter size={16} />
              More Filters
            </button>
            <button className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm">
              <Palette size={16} />
              Customize
            </button>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};
