"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { queryClient } from "@/lib/query-client";
import { SessionProvider } from "next-auth/react";
import { FormattingProvider } from "@/contexts/FormattingContext";
import { HelpHoverProvider } from "@/contexts/HelpHoverContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <FormattingProvider>
          <HelpHoverProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
              storageKey="moneves-theme"
            >
              {children}
            </ThemeProvider>
          </HelpHoverProvider>
        </FormattingProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
