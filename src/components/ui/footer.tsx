"use client";

import Link from "next/link";
import { Shield, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              href="/terms"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Terms of Use
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2024 Claru. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
