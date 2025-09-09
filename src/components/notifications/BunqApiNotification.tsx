import React from "react";
import { AlertTriangle, WifiOff, Key, X } from "lucide-react";

interface BunqApiNotificationProps {
  error: Error | string | null;
  hasDbTransactions: boolean;
  onDismiss?: () => void;
}

export const BunqApiNotification: React.FC<BunqApiNotificationProps> = ({
  error,
  hasDbTransactions,
  onDismiss,
}) => {
  if (!error) return null;

  const errorMessage = typeof error === "string" ? error : error.message;

  // Determine error type and appropriate message
  const getErrorInfo = () => {
    if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      return {
        message: "Bunq API key issue. Check your API settings.",
        icon: <Key className="h-4 w-4" />,
        type: "auth",
      };
    }

    if (
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("NetworkError")
    ) {
      return {
        message: "Unable to connect to Bunq API. Check your connection.",
        icon: <WifiOff className="h-4 w-4" />,
        type: "network",
      };
    }

    if (errorMessage.includes("timeout")) {
      return {
        message: "Bunq API request timed out. Retrying...",
        icon: <AlertTriangle className="h-4 w-4" />,
        type: "timeout",
      };
    }

    // Default error
    return {
      message: "Bunq API error. Check your settings.",
      icon: <AlertTriangle className="h-4 w-4" />,
      type: "unknown",
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
      <div className="text-yellow-400 flex-shrink-0">{errorInfo.icon}</div>

      <div className="flex-1 min-w-0">
        <p className="text-yellow-400 text-sm font-medium">
          {errorInfo.message}
        </p>
        {hasDbTransactions && (
          <p className="text-green-400 text-xs mt-1">
            ✓ Your local transactions are still available
          </p>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-yellow-400 hover:text-yellow-300 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
