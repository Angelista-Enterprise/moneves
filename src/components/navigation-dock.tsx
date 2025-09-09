"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BugReportModal } from "@/components/bug-report";
import {
  BarChart3,
  CreditCard,
  Settings,
  Home,
  Target,
  PiggyBank,
  LogOut,
  HelpCircle,
} from "lucide-react";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: CreditCard,
    path: "/transactions",
  },
  {
    id: "budgets",
    label: "Budgets",
    icon: Target,
    path: "/budgets",
  },
  {
    id: "savings",
    label: "Savings",
    icon: PiggyBank,
    path: "/savings-goals",
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export function NavigationDock() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  const handleSupportClick = () => {
    setIsSupportModalOpen(true);
  };

  return (
    <>
      {/* Desktop Navigation Dock - Left Side */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 xl:block hidden">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl rounded-2xl p-3">
          <div className="flex flex-col gap-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <div
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="group relative"
                >
                  <div
                    className={`w-12 h-12 rounded-xl aspect-square flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                        : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  {isActive && (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  )}
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              );
            })}

            {/* Support Button */}
            <div className="pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
              <div onClick={handleSupportClick} className="group relative">
                <div className="w-12 h-12 rounded-xl aspect-square flex items-center justify-center transition-all duration-300 cursor-pointer bg-blue-100/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 hover:scale-105">
                  <HelpCircle size={22} />
                </div>
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Support & Bug Reports
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
              <div onClick={handleSignOut} className="group relative">
                <div className="w-12 h-12 rounded-xl aspect-square flex items-center justify-center transition-all duration-300 cursor-pointer bg-red-100/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 hover:scale-105">
                  <LogOut size={22} />
                </div>
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Sign Out
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navigation Dock - Bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 xl:hidden block">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl rounded-2xl p-2">
          <div className="flex gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <div
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="group relative"
                >
                  <div
                    className={`w-10 h-10 rounded-xl aspect-square flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                        : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  )}
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              );
            })}

            {/* Support Button for Mobile */}
            <div className="pl-2 border-l border-gray-200/50 dark:border-slate-700/50">
              <div onClick={handleSupportClick} className="group relative">
                <div className="w-10 h-10 rounded-xl aspect-square flex items-center justify-center transition-all duration-300 cursor-pointer bg-blue-100/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 hover:scale-105">
                  <HelpCircle size={18} />
                </div>
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Support
                </div>
              </div>
            </div>

            {/* Sign Out Button for Mobile */}
            <div className="pl-2 border-l border-gray-200/50 dark:border-slate-700/50">
              <div onClick={handleSignOut} className="group relative">
                <div className="w-10 h-10 rounded-xl aspect-square flex items-center justify-center transition-all duration-300 cursor-pointer bg-red-100/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 hover:scale-105">
                  <LogOut size={18} />
                </div>
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Sign Out
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bug Report Modal */}
      <BugReportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}
