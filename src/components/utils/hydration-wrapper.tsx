import { ReactNode } from "react";

interface HydrationWrapperProps {
  children: ReactNode;
}

export function HydrationWrapper({ children }: HydrationWrapperProps) {
  return <>{children}</>;
}