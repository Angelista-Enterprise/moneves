"use client";

import React, { useState } from "react";
import { Bug } from "lucide-react";
import { BugReportModal } from "./BugReportModal";

interface FloatingBugButtonProps {
  className?: string;
}

export function FloatingBugButton({ className = "" }: FloatingBugButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          fixed bottom-6 right-6 z-40
          w-14 h-14 bg-gradient-to-r from-red-500 to-pink-600
          hover:from-red-600 hover:to-pink-700
          text-white rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 hover:scale-110
          flex items-center justify-center
          group
          ${className}
        `}
        title="Report a bug"
      >
        <Bug className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
      </button>

      <BugReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
