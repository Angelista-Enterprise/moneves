import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/utils/providers";
import { FloatingBugButton } from "@/components/bug-report";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moneves - Personal Finance Management",
  description: "Manage your finances with ease using Moneves",
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
      </body>
    </html>
  );
}
