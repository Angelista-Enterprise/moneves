/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  ArrowLeft,
  Shield,
  FileText,
  Bug,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BugReportModal } from "@/components/bug-report";
import { useState } from "react";

export default function SupportPage() {
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);
  const helpItems = [
    {
      id: "privacy",
      title: "Privacy Policy",
      description:
        "Learn how we collect, use, and protect your personal and financial data",
      icon: Shield,
      href: "/privacy",
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
      onClick: () => {
        window.location.href = "/privacy";
      },
    },
    {
      id: "terms",
      title: "Terms of Use",
      description: "Read our terms and conditions for using Claru's services",
      icon: FileText,
      href: "/terms",
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
      onClick: () => {
        window.location.href = "/terms";
      },
    },
    {
      id: "bug-report",
      title: "Report a Bug",
      description:
        "Found an issue? Help us improve by reporting bugs and issues",
      icon: Bug,
      href: "#",
      color: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      borderColor: "border-orange-200 dark:border-orange-800",
      onClick: () => {
        setIsBugReportOpen(true);
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Claru
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-8 h-8 text-brand-gradient" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Support & Legal
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Access important information about Claru, our policies, and get help
            when you need it.
          </p>
        </div>

        {/* Help Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${item.color} ${item.borderColor} border-2`}
                onClick={item.onClick}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">
                        {item.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                    {item.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.id === "bug-report"
                        ? "Open Bug Report"
                        : "View Details"}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </CardContent>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            );
          })}
        </div>

        {/* Additional Help Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <HelpCircle className="w-5 h-5" />
                Need More Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                If you can't find what you're looking for, we're here to help.
                Contact our support team for assistance with your account,
                technical issues, or general questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() =>
                    window.open("mailto:support@claru.app", "_blank")
                  }
                >
                  <ExternalLink className="w-4 h-4" />
                  Email Support
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() =>
                    window.open("mailto:privacy@claru.app", "_blank")
                  }
                >
                  <Shield className="w-4 h-4" />
                  Privacy Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/support"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Support & Legal
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © 2024 Claru. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Bug Report Modal */}
      <BugReportModal
        isOpen={isBugReportOpen}
        onClose={() => setIsBugReportOpen(false)}
      />
    </div>
  );
}
