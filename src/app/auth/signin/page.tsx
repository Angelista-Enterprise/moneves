"use client";

import React, { useEffect, useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { DollarSign, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// Function to check if user needs setup (first time login)
async function checkIfUserNeedsSetup(): Promise<boolean> {
  try {
    const response = await fetch("/api/user-settings");
    if (!response.ok) {
      // If settings don't exist, user needs setup
      return true;
    }

    const settings = await response.json();

    // Check if user has completed setup
    return settings.setupCompleted === false;
  } catch (error) {
    console.error("Error checking user setup status:", error);
    // If there's an error, assume user needs setup
    return true;
  }
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTestInfo, setShowTestInfo] = useState(false);
  const [testUser, setTestUser] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const performSignIn = async (
    emailParam: string,
    passwordParam: string
  ): Promise<void> => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: emailParam,
        password: passwordParam,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        const session = await getSession();
        if (session) {
          const needsSetup = await checkIfUserNeedsSetup();
          if (needsSetup) {
            router.push("/setup?welcome=true");
          } else {
            router.push(callbackUrl);
          }
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSignIn(email, password);
  };

  // Check if test user exists; if not, call seed script API endpoint
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/test-user");
        if (res.ok) {
          const data = await res.json();
          if (!data.exists) {
            await fetch("/api/seed", { method: "POST" });
            const res2 = await fetch("/api/auth/test-user");
            if (res2.ok) {
              const data2 = await res2.json();
              if (data2.exists)
                setTestUser({ email: data2.email, password: data2.password });
            }
          } else {
            setTestUser({ email: data.email, password: data.password });
          }
        }
      } catch {
        // ignore
      }
    })();
  }, []);

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
            <h1 className="text-3xl font-bold">Moneves</h1>
          </div>
          <p className="text-gray-400">
            Welcome back to your financial dashboard
          </p>
        </div>

        {/* Main Auth Card */}
        <Card className="group relative p-8 rounded-2xl overflow-hidden transition-all duration-300 border border-gray-800 bg-gray-900/50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 will-change-transform">
          {/* AI-Generated Background Pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10" />
            <div
              className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.1)_60deg,transparent_120deg,rgba(147,51,234,0.1)_180deg,transparent_240deg,rgba(6,182,212,0.1)_300deg,transparent_360deg)] animate-spin"
              style={{ animationDuration: "20s" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.15)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.15)_0%,transparent_50%)]" />
          </div>

          <div className="relative">
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>

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

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Test user reveal */}
            {testUser && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowTestInfo(!showTestInfo)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 transition-colors"
                >
                  {showTestInfo
                    ? "Hide demo credentials"
                    : "Show demo credentials"}
                </button>
                {showTestInfo && (
                  <div className="mt-3 p-3 rounded-lg border border-gray-700 bg-gray-800/40 text-left">
                    <p className="text-xs text-gray-400 mb-2">
                      Use the demo account to explore the app:
                    </p>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email</span>
                        <span className="font-mono">{testUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Password</span>
                        <span className="font-mono">{testUser.password}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button
                        type="button"
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5"
                        onClick={() => {
                          setEmail(testUser.email);
                          setPassword(testUser.password);
                          void performSignIn(testUser.email, testUser.password);
                        }}
                      >
                        Autofill and Sign In
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Gradient border effect */}
          <div className="absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>

        {/* Additional Info Card with AI Background */}
        <Card className="mt-6 group relative p-6 rounded-xl overflow-hidden transition-all duration-300 border border-gray-800 bg-gray-900/30 hover:shadow-[0_4px_20px_rgba(255,255,255,0.03)] hover:-translate-y-0.5 will-change-transform">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-green-500/10" />
            <div
              className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,rgba(16,185,129,0.1)_60deg,transparent_120deg,rgba(20,184,166,0.1)_180deg,transparent_240deg,rgba(34,197,94,0.1)_300deg,transparent_360deg)] animate-spin"
              style={{ animationDuration: "25s" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(16,185,129,0.15)_0%,transparent_50%)]" />
          </div>
          <div className="relative text-center">
            <h3 className="text-lg font-medium mb-2">Secure & Private</h3>
            <p className="text-sm text-gray-400">
              Your financial data is encrypted and protected with bank-level
              security
            </p>
          </div>
          <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
