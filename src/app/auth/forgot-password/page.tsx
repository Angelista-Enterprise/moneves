"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Mail,
  ArrowLeft,
  ArrowRight,
  Check,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, always succeed
      setSuccess(true);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white relative flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Claru</h1>
            </div>
          </div>

          <Card className="group relative p-8 rounded-2xl overflow-hidden transition-all duration-300 border border-gray-800 bg-gray-900/50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 will-change-transform">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10" />
              <div
                className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,rgba(34,197,94,0.1)_60deg,transparent_120deg,rgba(16,185,129,0.1)_180deg,transparent_240deg,rgba(20,184,166,0.1)_300deg,transparent_360deg)] animate-spin"
                style={{ animationDuration: "15s" }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.15)_0%,transparent_70%)]" />
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Check Your Email</h2>
              <p className="text-gray-400 mb-6">
                We&apos;ve sent a password reset link to{" "}
                <span className="text-white font-medium">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="w-full bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
                >
                  Send Another Email
                </Button>
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    className="w-full text-blue-400 hover:text-blue-300"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>

            <div className="absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Claru</h1>
          </div>
          <p className="text-gray-400">Reset your password</p>
        </div>

        {/* Main Auth Card */}
        <Card className="group relative p-8 rounded-2xl overflow-hidden transition-all duration-300 border border-gray-800 bg-gray-900/50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 will-change-transform">
          {/* AI-Generated Background Pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-cyan-500/10" />
            <div
              className="absolute inset-0 bg-[conic-gradient(from_135deg_at_50%_50%,transparent_0deg,rgba(99,102,241,0.1)_60deg,transparent_120deg,rgba(59,130,246,0.1)_180deg,transparent_240deg,rgba(6,182,212,0.1)_300deg,transparent_360deg)] animate-spin"
              style={{ animationDuration: "20s" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.15)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.15)_0%,transparent_50%)]" />
          </div>

          <div className="relative">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Forgot Password?
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-300"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending reset link...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Send Reset Link
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/signin"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Gradient border effect */}
          <div className="absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        {/* Security Info Card with AI Background */}
        <Card className="mt-6 group relative p-6 rounded-xl overflow-hidden transition-all duration-300 border border-gray-800 bg-gray-900/30 hover:shadow-[0_4px_20px_rgba(255,255,255,0.03)] hover:-translate-y-0.5 will-change-transform">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-pink-500/10" />
            <div
              className="absolute inset-0 bg-[conic-gradient(from_315deg_at_50%_50%,transparent_0deg,rgba(239,68,68,0.1)_60deg,transparent_120deg,rgba(244,63,94,0.1)_180deg,transparent_240deg,rgba(236,72,153,0.1)_300deg,transparent_360deg)] animate-spin"
              style={{ animationDuration: "18s" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(239,68,68,0.15)_0%,transparent_50%)]" />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Secure Reset Process</h3>
              <p className="text-xs text-gray-400">
                Your password reset link will expire in 1 hour for security
              </p>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </div>
    </div>
  );
}
