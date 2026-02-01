import { useState, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load initial notifications
    const loadNotifications = () => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'Client Activated',
          message: 'John Doe completed onboarding successfully',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: '2',
          type: 'warning',
          title: 'High Drop-off Rate',
          message: 'Step 3 has 68% failure rate',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: '3',
          type: 'info',
          title: 'New Feature Available',
          message: 'Dashboard metrics now collapsible',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: '4',
          type: 'error',
          title: 'Email Delivery Failed',
          message: 'Failed to send welcome email to client@example.com',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: true,
        },
      ];
      setNotifications(mockNotifications);
    };

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="w-4 h-4 text-green-500" />;
      case 'error': return <X className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-white/20 hover:text-white relative">
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full p-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-[#1a1b23] border-white/5 text-white"
      >
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-white/60 hover:text-white h-auto p-0"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-white/40">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-4 border-b border-white/5 last:border-b-0 cursor-pointer hover:bg-white/5 ${!notification.read ? 'bg-white/5' : ''
                  }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3 w-full">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      <span className="text-xs text-white/40">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 truncate">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
