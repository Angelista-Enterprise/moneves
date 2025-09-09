"use client";

import { BarChart3, Clock, Eye, EyeOff, Download } from "lucide-react";
import { AnimationWrapper } from "@/components/ui";

interface ReportsHeaderProps {
  currentTime: Date;
  showBalance: boolean;
  setShowBalance: (show: boolean) => void;
}

export const ReportsHeader = ({
  currentTime,
  showBalance,
  setShowBalance,
}: ReportsHeaderProps) => {
  return (
    <AnimationWrapper animation="fadeIn" delay={100}>
      <div className="bg-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-brand to-brand rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Reports & Analysis</h1>
                <p className="text-sm text-muted-foreground">
                  Comprehensive financial overview, category analysis, and
                  trends
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock size={16} />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm"
              >
                {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                {showBalance ? "Hide" : "Show"} Balance
              </button>
              <button className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm">
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};
