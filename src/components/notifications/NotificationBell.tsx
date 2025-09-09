import React, { useState } from "react";
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { useNotifications, Notification } from "@/lib/notification-manager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
    dismissAll,
  } = useNotifications();

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-400" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "recommendation":
        return <Lightbulb className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return "border-red-500/20 bg-red-900/10";
      case "warning":
        return "border-yellow-500/20 bg-yellow-900/10";
      case "info":
        return "border-blue-500/20 bg-blue-900/10";
      case "success":
        return "border-green-500/20 bg-green-900/10";
      case "recommendation":
        return "border-purple-500/20 bg-purple-900/10";
      default:
        return "border-gray-500/20 bg-gray-900/10";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.action) {
      notification.action.onClick();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDismissAll = () => {
    dismissAll();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-gray-800/50"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs text-gray-400 hover:text-white"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismissAll}
                className="text-xs text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-800/30 ${
                      notification.read ? "opacity-60" : ""
                    } ${getNotificationColor(notification.type)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            {notification.dismissible && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dismiss(notification.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-gray-700/50"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>

                          {notification.action && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action!.onClick();
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 h-6 px-2"
                            >
                              {notification.action.label}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < notifications.length - 1 && (
                    <Separator className="my-2 bg-gray-700/50" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
