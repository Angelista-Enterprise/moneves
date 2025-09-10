/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
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

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 2025";

  const sections = [
    { id: "introduction", title: "Introduction", icon: Shield },
    { id: "data-collection", title: "Data Collection", icon: Database },
    { id: "data-usage", title: "How We Use Your Data", icon: Eye },
    { id: "data-sharing", title: "Data Sharing", icon: Users },
    { id: "data-security", title: "Data Security", icon: Lock },
    { id: "your-rights", title: "Your Rights", icon: CheckCircle },
    { id: "cookies", title: "Cookies & Tracking", icon: Globe },
    { id: "third-party", title: "Third-Party Services", icon: AlertTriangle },
    { id: "data-retention", title: "Data Retention", icon: FileText },
    { id: "updates", title: "Policy Updates", icon: FileText },
    { id: "contact", title: "Contact Us", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/support">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Support
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-brand-gradient" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdated} • Effective immediately
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {section.title}
                    </a>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Introduction */}
            <Card id="introduction">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Welcome to Claru ("we," "our," or "us"). This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you use our financial management application
                  and related services (collectively, the "Service").
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  We are committed to protecting your privacy and ensuring the
                  security of your personal and financial information. This
                  policy applies to all users of our Service and describes our
                  practices regarding the collection, use, and disclosure of
                  information.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Important:</strong> By using our Service, you agree
                    to the collection and use of information in accordance with
                    this Privacy Policy. If you do not agree with our policies
                    and practices, please do not use our Service.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card id="data-collection">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Collection
                </CardTitle>
                <CardDescription>
                  We collect information you provide directly to us and
                  information we obtain automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Information You Provide Directly
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Account Information
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Name, email address, password (encrypted), profile
                          picture, and subscription details
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Financial Data
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Bank account information, transaction history, budget
                          categories, savings goals, and financial preferences
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          API Keys
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Bunq API keys for bank account integration (encrypted
                          and stored securely)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Preferences
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Currency, locale, timezone, date format, notification
                          preferences, and privacy settings
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Information We Collect Automatically
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Usage Data
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          How you interact with our Service, features used, and
                          performance metrics
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Device Information
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Device type, operating system, browser type, and IP
                          address
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Analytics Data
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          App performance, error reports, and user behavior
                          patterns (with your consent)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card id="data-usage">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  How We Use Your Data
                </CardTitle>
                <CardDescription>
                  We use your information to provide, maintain, and improve our
                  Service.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Core Services
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Process and manage your financial transactions</li>
                      <li>
                        • Provide budget tracking and savings goal management
                      </li>
                      <li>• Generate financial reports and insights</li>
                      <li>• Sync with your bank accounts via Bunq API</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Account Management
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Create and maintain your user account</li>
                      <li>• Authenticate your identity and secure access</li>
                      <li>• Manage your subscription and billing</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Personalization
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Customize your experience and preferences</li>
                      <li>• Provide smart recommendations</li>
                      <li>• Send relevant notifications and alerts</li>
                      <li>• Adapt the interface to your needs</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Improvement
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Analyze usage patterns to improve features</li>
                      <li>• Fix bugs and enhance performance</li>
                      <li>• Develop new features and services</li>
                      <li>• Ensure security and prevent fraud</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card id="data-sharing">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Data Sharing
                </CardTitle>
                <CardDescription>
                  We do not sell your personal information. We only share data
                  as described below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>
                      We do not sell, trade, or rent your personal information
                      to third parties.
                    </strong>
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Third-Party Service Providers
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      We may share information with trusted service providers
                      who assist us in operating our Service:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <li>
                        • <strong>Bunq API:</strong> To sync your bank account
                        data (with your explicit consent)
                      </li>
                      <li>
                        • <strong>Google AI:</strong> For transaction
                        categorization (anonymized data only)
                      </li>
                      <li>
                        • <strong>Vercel:</strong> For hosting and
                        infrastructure services
                      </li>
                      <li>
                        • <strong>Database Providers:</strong> For secure data
                        storage and backup
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Legal Requirements
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We may disclose your information if required by law or to
                      protect our rights, property, or safety, or that of our
                      users or the public.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Business Transfers
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      In the event of a merger, acquisition, or sale of assets,
                      your information may be transferred as part of that
                      transaction.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card id="data-security">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Data Security
                </CardTitle>
                <CardDescription>
                  We implement industry-standard security measures to protect
                  your information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Encryption
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • <strong>AES-256-GCM encryption</strong> for all
                        sensitive data
                      </li>
                      <li>
                        • <strong>End-to-end encryption</strong> for financial
                        data
                      </li>
                      <li>
                        • <strong>Secure key management</strong> with
                        environment variables
                      </li>
                      <li>
                        • <strong>Encrypted database fields</strong> for
                        personal information
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Access Control
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • <strong>Multi-factor authentication</strong> support
                      </li>
                      <li>
                        • <strong>Role-based access</strong> to sensitive data
                      </li>
                      <li>
                        • <strong>Regular security audits</strong> and updates
                      </li>
                      <li>
                        • <strong>Secure API endpoints</strong> with
                        authentication
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Infrastructure
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • <strong>Secure cloud hosting</strong> on Vercel
                      </li>
                      <li>
                        • <strong>HTTPS encryption</strong> for all
                        communications
                      </li>
                      <li>
                        • <strong>Regular backups</strong> with encryption
                      </li>
                      <li>
                        • <strong>Monitoring and logging</strong> for security
                        events
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Compliance
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • <strong>GDPR compliance</strong> for EU users
                      </li>
                      <li>
                        • <strong>Data minimization</strong> principles
                      </li>
                      <li>
                        • <strong>Regular security training</strong> for our
                        team
                      </li>
                      <li>
                        • <strong>Incident response</strong> procedures
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Important:</strong> While we implement strong
                    security measures, no method of transmission over the
                    internet or electronic storage is 100% secure. We cannot
                    guarantee absolute security but are committed to protecting
                    your data.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card id="your-rights">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Your Rights
                </CardTitle>
                <CardDescription>
                  You have certain rights regarding your personal information
                  under applicable laws.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Access & Portability
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Request a copy of your personal data</li>
                        <li>
                          • Export your financial data in standard formats
                        </li>
                        <li>• Access your account information at any time</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Correction & Updates
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Update your personal information</li>
                        <li>• Correct inaccurate data</li>
                        <li>• Modify your preferences and settings</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Deletion & Restriction
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Delete your account and associated data</li>
                        <li>• Restrict processing of your data</li>
                        <li>• Object to certain data processing activities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Consent & Control
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Withdraw consent for data processing</li>
                        <li>• Opt-out of marketing communications</li>
                        <li>• Control analytics and tracking preferences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>How to Exercise Your Rights:</strong> You can
                    exercise these rights by contacting us at privacy@claru.app
                    or through your account settings. We will respond to your
                    request within 30 days.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card id="cookies">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Cookies & Tracking
                </CardTitle>
                <CardDescription>
                  We use cookies and similar technologies to enhance your
                  experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Essential Cookies
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      These cookies are necessary for the Service to function
                      properly:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <li>• Authentication and session management</li>
                      <li>• Security and fraud prevention</li>
                      <li>• User preferences and settings</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Analytics Cookies
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      These cookies help us understand how you use our Service
                      (with your consent):
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <li>• Usage statistics and performance metrics</li>
                      <li>• Feature usage and user behavior patterns</li>
                      <li>• Error reporting and debugging information</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Managing Cookies
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You can control cookie preferences through your browser
                      settings or our privacy settings in your account. Note
                      that disabling certain cookies may affect the
                      functionality of our Service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card id="third-party">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Third-Party Services
                </CardTitle>
                <CardDescription>
                  We integrate with third-party services to provide enhanced
                  functionality.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Bunq Banking API
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      We integrate with Bunq to sync your bank account data:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <li>
                        • <strong>Data shared:</strong> Account balances,
                        transaction history, account details
                      </li>
                      <li>
                        • <strong>Purpose:</strong> Automatic transaction import
                        and account synchronization
                      </li>
                      <li>
                        • <strong>Your control:</strong> You can disconnect at
                        any time in settings
                      </li>
                      <li>
                        • <strong>Security:</strong> API keys are encrypted and
                        stored securely
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Google AI Services
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      We use Google AI for transaction categorization:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <li>
                        • <strong>Data shared:</strong> Transaction descriptions
                        (anonymized)
                      </li>
                      <li>
                        • <strong>Purpose:</strong> Automatic transaction
                        categorization and smart recommendations
                      </li>
                      <li>
                        • <strong>Privacy:</strong> No personal identifiers are
                        shared
                      </li>
                      <li>
                        • <strong>Your control:</strong> You can disable
                        auto-categorization in settings
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Hosting & Infrastructure
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      We use Vercel and other cloud services for hosting:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <li>
                        • <strong>Data stored:</strong> All your data is stored
                        on secure cloud infrastructure
                      </li>
                      <li>
                        • <strong>Purpose:</strong> Reliable hosting, backup,
                        and performance optimization
                      </li>
                      <li>
                        • <strong>Security:</strong> All data is encrypted in
                        transit and at rest
                      </li>
                      <li>
                        • <strong>Compliance:</strong> Infrastructure providers
                        are SOC 2 compliant
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card id="data-retention">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Data Retention
                </CardTitle>
                <CardDescription>
                  We retain your data only as long as necessary for the purposes
                  outlined in this policy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Account Data
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We retain your account information and financial data for
                      as long as your account is active or as needed to provide
                      you with our Service. You can delete your account at any
                      time, and we will delete your data within 30 days.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Financial Data
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Transaction history and financial records are retained for
                      the duration of your account to provide historical
                      analysis and reporting. You can export your data before
                      account deletion.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Analytics Data
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Usage analytics and performance data are typically
                      retained for up to 2 years to help us improve our Service,
                      unless you opt out of analytics.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Legal Requirements
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We may retain certain information for longer periods if
                      required by law, regulation, or to resolve disputes and
                      enforce our agreements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policy Updates */}
            <Card id="updates">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Policy Updates
                </CardTitle>
                <CardDescription>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      How We Notify You
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • We will notify you of material changes via email or
                        in-app notification
                      </li>
                      <li>
                        • The updated policy will be posted on this page with a
                        new "Last Updated" date
                      </li>
                      <li>
                        • We will provide at least 30 days' notice before
                        material changes take effect
                      </li>
                      <li>
                        • Continued use of our Service after changes constitutes
                        acceptance of the new policy
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Your Options
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • Review the updated policy before continuing to use our
                        Service
                      </li>
                      <li>
                        • Contact us if you have questions about the changes
                      </li>
                      <li>
                        • Delete your account if you do not agree with the
                        updated policy
                      </li>
                      <li>• Export your data before making any decisions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card id="contact">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Contact Us
                </CardTitle>
                <CardDescription>
                  If you have any questions about this Privacy Policy, please
                  contact us.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Email
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      privacy@claru.app
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Data Protection Officer
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      dpo@claru.app
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Response Time:</strong> We aim to respond to all
                    privacy-related inquiries within 48 hours. For data subject
                    requests (access, deletion, etc.), we will respond within 30
                    days as required by applicable law.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
              >
                Terms of Use
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link
                href="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
              >
                Privacy Policy
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © 2024 Claru. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
