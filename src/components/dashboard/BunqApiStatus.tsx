import React, { useEffect, useState } from "react";
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBunqApiTest } from "@/lib/bunq-api-test";
import { useNotifications } from "@/lib/notification-manager";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useSession } from "next-auth/react";

const BunqApiStatus: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [lastTest, setLastTest] = useState<Date | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { testConnection, getStatus, resetApiErrors } = useBunqApiTest();
  const { getBunqApiStatus } = useNotifications();
  const { settings } = useUserSettings(userId || "");

  const apiStatus = getBunqApiStatus();
  const bunqStatus = getStatus();

  const handleTestConnection = React.useCallback(async () => {
    if (!settings?.bunqApiUrl) return;

    setIsTesting(true);
    try {
      const result = await testConnection(
        settings.bunqApiUrl,
        settings.bunqApiKey
      );
      setLastTest(new Date());

      if (result.success) {
        // Reset any previous API errors on successful connection
        resetApiErrors(settings.bunqApiUrl);
      }
    } catch (error) {
      console.error("[BunqApiStatus] Test failed:", error);
    } finally {
      setIsTesting(false);
    }
  }, [
    settings?.bunqApiUrl,
    settings?.bunqApiKey,
    testConnection,
    resetApiErrors,
  ]);

  useEffect(() => {
    // Test connection when component mounts if we have API settings
    if (settings?.bunqApiUrl && settings?.bunqApiKey && !lastTest) {
      handleTestConnection();
    }
  }, [settings, handleTestConnection, lastTest]);

  const getStatusIcon = () => {
    if (apiStatus.hasErrors) {
      return <WifiOff className="w-5 h-5 text-red-400" />;
    }

    if (bunqStatus.isConnected) {
      return <Wifi className="w-5 h-5 text-green-400" />;
    }

    return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  };

  const getStatusColor = () => {
    if (apiStatus.hasErrors) {
      return "text-red-400";
    }

    if (bunqStatus.isConnected) {
      return "text-green-400";
    }

    return "text-yellow-400";
  };

  const getStatusText = () => {
    if (apiStatus.hasErrors) {
      return "Connection Failed";
    }

    if (bunqStatus.isConnected) {
      return "Connected";
    }

    if (bunqStatus.status === "timeout") {
      return "Timeout";
    }

    if (bunqStatus.status === "invalid_key") {
      return "Invalid API Key";
    }

    return "Not Connected";
  };

  const getConnectionQuality = () => {
    if (!bunqStatus.isConnected) return null;

    const responseTime = bunqStatus.responseTime;
    if (responseTime < 500)
      return { label: "Excellent", color: "text-green-400" };
    if (responseTime < 1000) return { label: "Good", color: "text-blue-400" };
    if (responseTime < 2000) return { label: "Fair", color: "text-yellow-400" };
    return { label: "Poor", color: "text-red-400" };
  };

  const formatLastTest = () => {
    if (!lastTest && !bunqStatus.lastTested) return "Never tested";

    const testTime = lastTest || bunqStatus.lastTested;
    const now = new Date();
    const diff = now.getTime() - testTime.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!settings?.bunqApiUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-gray-500" />
            Bunq API Status
          </CardTitle>
          <CardDescription>
            Connect your Bunq account to sync transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-gray-400 mb-4">No Bunq API configured</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/settings")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Configure API
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Bunq API Status
          <Badge variant="outline" className={`ml-auto ${getStatusColor()}`}>
            {getStatusText()}
          </Badge>
        </CardTitle>
        <CardDescription>{settings.bunqApiUrl}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Last Test:</span>
              <p className="text-white">{formatLastTest()}</p>
            </div>

            {bunqStatus.isConnected && (
              <div>
                <span className="text-gray-400">Response Time:</span>
                <p className="text-white">{bunqStatus.responseTime}ms</p>
              </div>
            )}
          </div>

          {/* Connection Quality */}
          {bunqStatus.isConnected && (
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  Connection Quality
                </span>
              </div>
              {(() => {
                const quality = getConnectionQuality();
                return quality ? (
                  <Badge variant="outline" className={quality.color}>
                    {quality.label}
                  </Badge>
                ) : null;
              })()}
            </div>
          )}

          {/* Error Information */}
          {apiStatus.hasErrors && (
            <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-300">
                  API Errors Detected
                </span>
              </div>
              <p className="text-xs text-red-400">
                {apiStatus.errorCount} error(s) detected.
                {apiStatus.lastError && (
                  <span className="block mt-1">
                    Last error: {apiStatus.lastError.toLocaleString()}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/settings")}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BunqApiStatus;
