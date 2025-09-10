/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  ArrowLeft,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  CreditCard,
  Globe,
  Lock,
  Scale,
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

export default function TermsOfUsePage() {
  const lastUpdated = "September 2025";

  const sections = [
    { id: "introduction", title: "Introduction", icon: FileText },
    { id: "acceptance", title: "Acceptance of Terms", icon: CheckCircle },
    { id: "description", title: "Service Description", icon: Shield },
    { id: "user-accounts", title: "User Accounts", icon: Users },
    { id: "acceptable-use", title: "Acceptable Use", icon: AlertTriangle },
    { id: "financial-data", title: "Financial Data", icon: CreditCard },
    { id: "privacy", title: "Privacy & Data", icon: Lock },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: Scale,
    },
    { id: "disclaimers", title: "Disclaimers", icon: AlertTriangle },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: Shield,
    },
    { id: "termination", title: "Termination", icon: AlertTriangle },
    { id: "governing-law", title: "Governing Law", icon: Globe },
    { id: "changes", title: "Changes to Terms", icon: FileText },
    { id: "contact", title: "Contact Information", icon: Users },
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
            <FileText className="w-8 h-8 text-brand-gradient" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Terms of Use
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
                  <FileText className="w-5 h-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Welcome to Claru ("we," "our," or "us"). These Terms of Use
                  ("Terms") govern your use of our financial management
                  application and related services (collectively, the "Service")
                  operated by Claru.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  By accessing or using our Service, you agree to be bound by
                  these Terms. If you disagree with any part of these terms,
                  then you may not access the Service.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Important:</strong> Please read these Terms
                    carefully before using our Service. These Terms constitute a
                    legally binding agreement between you and Claru.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Acceptance of Terms */}
            <Card id="acceptance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Acceptance of Terms
                </CardTitle>
                <CardDescription>
                  By using our Service, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Agreement to Terms
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      By creating an account, accessing, or using our Service,
                      you agree to be bound by these Terms and our Privacy
                      Policy, which is incorporated herein by reference.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Capacity to Enter Agreement
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You represent that you are at least 18 years old and have
                      the legal capacity to enter into this agreement. If you
                      are under 18, you may not use our Service.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Updates to Terms
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We reserve the right to modify these Terms at any time. We
                      will notify you of material changes, and your continued
                      use of the Service constitutes acceptance of the updated
                      Terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card id="description">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Service Description
                </CardTitle>
                <CardDescription>
                  Claru is a comprehensive financial management application
                  designed to help you manage your finances.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Core Features
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • <strong>Account Management:</strong> Create and manage
                        multiple financial accounts
                      </li>
                      <li>
                        • <strong>Transaction Tracking:</strong> Record,
                        categorize, and analyze your transactions
                      </li>
                      <li>
                        • <strong>Budget Management:</strong> Set up and track
                        budget categories with spending limits
                      </li>
                      <li>
                        • <strong>Savings Goals:</strong> Create and monitor
                        progress toward financial goals
                      </li>
                      <li>
                        • <strong>Financial Reports:</strong> Generate insights
                        and reports on your financial health
                      </li>
                      <li>
                        • <strong>Bank Integration:</strong> Connect with Bunq
                        for automatic transaction import
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Service Availability
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We strive to provide continuous service availability, but
                      we do not guarantee uninterrupted access. The Service may
                      be temporarily unavailable due to maintenance, updates, or
                      technical issues.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Service Modifications
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We reserve the right to modify, suspend, or discontinue
                      any part of the Service at any time with or without
                      notice. We are not liable for any modification,
                      suspension, or discontinuation of the Service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card id="user-accounts">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Accounts
                </CardTitle>
                <CardDescription>
                  You are responsible for maintaining the security of your
                  account and all activities that occur under your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Account Creation
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • You must provide accurate and complete information
                        when creating your account
                      </li>
                      <li>
                        • You are responsible for maintaining the
                        confidentiality of your account credentials
                      </li>
                      <li>
                        • You must be at least 18 years old to create an account
                      </li>
                      <li>
                        • One account per person; multiple accounts are not
                        permitted
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Account Security
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • You are responsible for all activities that occur
                        under your account
                      </li>
                      <li>
                        • You must notify us immediately of any unauthorized use
                        of your account
                      </li>
                      <li>
                        • We are not liable for any loss or damage arising from
                        unauthorized use
                      </li>
                      <li>
                        • You must use strong passwords and enable two-factor
                        authentication when available
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Account Termination
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You may terminate your account at any time by contacting
                      us or using the account deletion feature in your settings.
                      We may suspend or terminate your account if you violate
                      these Terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card id="acceptable-use">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Acceptable Use
                </CardTitle>
                <CardDescription>
                  You agree to use our Service only for lawful purposes and in
                  accordance with these Terms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Permitted Uses
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Personal financial management and planning</li>
                      <li>• Legitimate business financial tracking</li>
                      <li>
                        • Educational purposes related to financial literacy
                      </li>
                      <li>
                        • Any other use that complies with applicable laws and
                        regulations
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Prohibited Uses
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Any illegal or unauthorized purpose</li>
                      <li>
                        • Attempting to gain unauthorized access to our systems
                        or other users' accounts
                      </li>
                      <li>
                        • Transmitting viruses, malware, or other harmful code
                      </li>
                      <li>
                        • Interfering with or disrupting the Service or servers
                      </li>
                      <li>
                        • Reverse engineering, decompiling, or disassembling our
                        software
                      </li>
                      <li>
                        • Using the Service for money laundering or other
                        financial crimes
                      </li>
                      <li>• Violating any applicable laws or regulations</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>Consequences:</strong> Violation of these
                      acceptable use policies may result in immediate
                      termination of your account and legal action.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Data */}
            <Card id="financial-data">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Financial Data
                </CardTitle>
                <CardDescription>
                  You are responsible for the accuracy and security of your
                  financial information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Data Accuracy
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You are responsible for ensuring that all financial data
                      you enter into our Service is accurate and up-to-date. We
                      are not responsible for any errors or omissions in your
                      data.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Bank Integration
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • Bank integration is provided through third-party APIs
                        (e.g., Bunq)
                      </li>
                      <li>
                        • You are responsible for the security of your API keys
                        and credentials
                      </li>
                      <li>
                        • We are not responsible for the accuracy of data
                        imported from external sources
                      </li>
                      <li>
                        • You can disconnect bank integrations at any time
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Financial Advice Disclaimer
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our Service provides tools for financial management but
                      does not constitute financial, investment, or tax advice.
                      You should consult with qualified professionals for
                      specific financial advice.
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Important:</strong> We are not a financial
                      institution and do not provide banking, investment, or
                      financial advisory services. Our Service is a tool to help
                      you manage your personal finances.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data */}
            <Card id="privacy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Privacy & Data
                </CardTitle>
                <CardDescription>
                  Your privacy is important to us. Please review our Privacy
                  Policy for detailed information about data collection and use.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Data Collection
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We collect and process your personal and financial data as
                      described in our Privacy Policy. By using our Service, you
                      consent to such collection and processing.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Data Security
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • We implement industry-standard security measures to
                        protect your data
                      </li>
                      <li>
                        • All sensitive data is encrypted using AES-256-GCM
                        encryption
                      </li>
                      <li>
                        • We regularly audit our security practices and update
                        our systems
                      </li>
                      <li>
                        • However, no system is 100% secure, and we cannot
                        guarantee absolute security
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Data Rights
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You have certain rights regarding your personal data,
                      including the right to access, correct, delete, and export
                      your data. These rights are detailed in our Privacy
                      Policy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card id="intellectual-property">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Intellectual Property
                </CardTitle>
                <CardDescription>
                  The Service and its original content, features, and
                  functionality are owned by Claru and are protected by
                  intellectual property laws.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Our Intellectual Property
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • The Service, including its design, functionality, and
                        content, is owned by Claru
                      </li>
                      <li>
                        • Our trademarks, logos, and brand names are our
                        intellectual property
                      </li>
                      <li>
                        • You may not use our intellectual property without our
                        written permission
                      </li>
                      <li>
                        • All rights not expressly granted are reserved by Claru
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Your Content
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You retain ownership of your financial data and content.
                      By using our Service, you grant us a limited license to
                      use your data to provide the Service to you.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Third-Party Content
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our Service may include content from third parties. Such
                      content is owned by the respective third parties and is
                      subject to their terms and conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card id="disclaimers">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Disclaimers
                </CardTitle>
                <CardDescription>
                  The Service is provided "as is" without warranties of any
                  kind.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      No Warranties
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We disclaim all warranties, express or implied, including
                      but not limited to warranties of merchantability, fitness
                      for a particular purpose, and non-infringement.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Service Availability
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We do not warrant that the Service will be uninterrupted,
                      error-free, or free from viruses or other harmful
                      components.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Financial Information
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We do not warrant the accuracy, completeness, or
                      timeliness of any financial information provided through
                      the Service.
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>Important:</strong> The Service is not a
                      substitute for professional financial advice. Always
                      consult with qualified professionals for important
                      financial decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card id="limitation-liability">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Limitation of Liability
                </CardTitle>
                <CardDescription>
                  Our liability is limited to the maximum extent permitted by
                  law.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Limitation of Damages
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      In no event shall Claru be liable for any indirect,
                      incidental, special, consequential, or punitive damages,
                      including but not limited to loss of profits, data, or
                      use, arising out of or relating to your use of the
                      Service.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Maximum Liability
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our total liability to you for any claims arising out of
                      or relating to these Terms or the Service shall not exceed
                      the amount you paid us for the Service in the 12 months
                      preceding the claim.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Exceptions
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Some jurisdictions do not allow the limitation of
                      liability, so these limitations may not apply to you. In
                      such cases, our liability will be limited to the fullest
                      extent permitted by law.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card id="termination">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Termination
                </CardTitle>
                <CardDescription>
                  Either party may terminate this agreement at any time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Termination by You
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You may terminate your account at any time by contacting
                      us or using the account deletion feature in your settings.
                      Upon termination, your access to the Service will cease
                      immediately.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Termination by Us
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We may terminate or suspend your account immediately,
                      without prior notice, if you breach these Terms or engage
                      in any prohibited activities.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Effect of Termination
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        • Your right to use the Service will cease immediately
                      </li>
                      <li>
                        • We may delete your account and data after a reasonable
                        period
                      </li>
                      <li>• You may export your data before termination</li>
                      <li>
                        • Provisions that by their nature should survive
                        termination will remain in effect
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card id="governing-law">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Governing Law
                </CardTitle>
                <CardDescription>
                  These Terms are governed by and construed in accordance with
                  applicable laws.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Applicable Law
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      These Terms shall be governed by and construed in
                      accordance with the laws of the jurisdiction in which
                      Claru is incorporated, without regard to conflict of law
                      principles.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Dispute Resolution
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Any disputes arising out of or relating to these Terms or
                      the Service shall be resolved through binding arbitration
                      in accordance with the rules of the relevant arbitration
                      association.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Jurisdiction
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You consent to the exclusive jurisdiction and venue of the
                      courts located in the jurisdiction specified above for any
                      legal action arising out of or relating to these Terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card id="changes">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Changes to Terms
                </CardTitle>
                <CardDescription>
                  We may update these Terms from time to time to reflect changes
                  in our practices or applicable laws.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Notification of Changes
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We will notify you of material changes to these Terms by
                      email or through the Service. The updated Terms will be
                      posted on this page with a new "Last Updated" date.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Acceptance of Changes
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your continued use of the Service after the effective date
                      of the updated Terms constitutes acceptance of the
                      changes. If you do not agree to the updated Terms, you
                      must stop using the Service.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Review of Changes
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We encourage you to review these Terms periodically to
                      stay informed of any changes. The most current version
                      will always be available on this page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card id="contact">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  If you have any questions about these Terms, please contact
                  us.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Email
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      legal@claru.app
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      General Support
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      support@claru.app
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Response Time:</strong> We aim to respond to all
                    inquiries within 48 hours. For legal matters, we will
                    respond within 5 business days.
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
