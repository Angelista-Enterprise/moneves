import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/utils/providers";
import { FloatingBugButton } from "@/components/bug-report";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Claru — Clarity for every transaction",
  description: "Claru brings your budgets, transactions, and goals together in one clear view.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-background">{children}</main>
          <FloatingBugButton />
        </Providers>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </body>
    </html>
  );
}
