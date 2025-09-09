import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "circle";
  animate?: boolean;
}

export const Skeleton = ({
  className,
  variant = "default",
  animate = true,
}: SkeletonProps) => {
  const baseClasses = "bg-gray-800/50 rounded";
  const animateClasses = animate ? "animate-pulse" : "";

  const variantClasses = {
    default: "h-4 w-full",
    card: "h-32 w-full rounded-xl",
    text: "h-4 w-3/4",
    circle: "h-8 w-8 rounded-full",
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animateClasses,
        className
      )}
    />
  );
};

// Skeleton components for specific use cases
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "p-4 rounded-xl border border-gray-800 bg-gray-900/50",
      className
    )}
  >
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="circle" className="h-8 w-8" />
      <Skeleton className="h-6 w-16" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  </div>
);

export const SkeletonTransactionCard = ({
  className,
}: {
  className?: string;
}) => (
  <div
    className={cn(
      "p-4 rounded-xl border border-gray-800 bg-gray-900/50",
      className
    )}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" className="h-12 w-12" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
  </div>
);

export const SkeletonOverviewCard = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "p-4 rounded-xl border border-gray-800 bg-gray-900/50",
      className
    )}
  >
    <div className="flex items-center justify-between mb-3">
      <Skeleton variant="circle" className="h-8 w-8" />
      <Skeleton className="h-4 w-12" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);
