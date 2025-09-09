"use client";

import { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./button";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  showBalance?: boolean;
  onToggleBalance?: () => void;
  rightActions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  icon,
  showBalance = false,
  onToggleBalance,
  rightActions,
  className = "",
}: PageHeaderProps) => {
  return (
    <div className={`bg-black/95 backdrop-blur-sm ${className}`}>
      <div className="max-w-7xl mx-auto py-6 md:px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {onToggleBalance && (
              <Button onClick={onToggleBalance} size="sm">
                {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                {showBalance ? "Hide" : "Show"} Balance
              </Button>
            )}

            {rightActions}
          </div>
        </div>
      </div>
    </div>
  );
};
