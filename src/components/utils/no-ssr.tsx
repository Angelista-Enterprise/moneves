import { ReactNode } from "react";

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  if (typeof window === "undefined") {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}