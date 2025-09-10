"use client";

import { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";

interface PageHeaderProps {
  title: string;
  description: string;
  showBalance?: boolean;
  onToggleBalance?: () => void;
  rightActions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
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
            <div className="h-10 w-10 relative">
              <Image
                src="/brand/claru-icon.svg"
                alt="Claru"
                width={40}
                height={40}
                className="w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {onToggleBalance && (
              <Button onClick={onToggleBalance} size="sm" variant="ghost-blue">
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
