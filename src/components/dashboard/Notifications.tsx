import { useState, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Load initial notifications
    const loadNotifications = () => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'Client Activated',
          message: 'John Doe completed onboarding successfully and has been promoted to verified partner status in the US-EAST quadrant.',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: '2',
          type: 'warning',
          title: 'High Drop-off Rate',
          message: 'Step 3 "Asset Integration" has a 68% failure rate over the last 24 mission hours. Action required.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: '3',
          type: 'info',
          title: 'New Feature Available',
          message: 'Dashboard metrics now support collapsible neural expansion for better data density management.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: '4',
          type: 'error',
          title: 'Email Delivery Failed',
          message: 'Failed to send welcome email relay to client@vortex.io. Terminal error code: 0x882.',
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
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground relative">
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full p-0 border-none shadow-glow">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-card border-border text-foreground p-0 overflow-hidden shadow-2xl"
      >
        <div className="p-4 border-b border-border/10 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/90">Signal Stream</h3>
              <p className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-tighter mt-0.5">Nexus Event Feed</p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-[9px] font-black uppercase tracking-widest text-accent hover:text-accent hover:bg-accent/5 h-6 px-2"
              >
                Clear Stream
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground/30">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">No Active Signals</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const isExpanded = expandedId === notification.id;
              return (
                <div
                  key={notification.id}
                  onClick={() => {
                    markAsRead(notification.id);
                    setExpandedId(isExpanded ? null : notification.id);
                  }}
                  className={`p-4 border-b border-border/10 last:border-b-0 cursor-pointer transition-all relative group ${!notification.read ? 'bg-accent/[0.03]' : 'bg-transparent'
                    } ${isExpanded ? 'bg-muted/30' : ''}`}
                >
                  <div className="flex gap-3 w-full">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-[11px] tracking-tight ${!notification.read ? 'font-black text-foreground' : 'font-bold text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground/30 whitespace-nowrap ml-2">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed transition-all ${!notification.read ? 'text-foreground/70' : 'text-muted-foreground/30'} ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {notification.message}
                      </p>
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-border animate-in fade-in slide-in-from-top-1 duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-accent">Detailed Briefing</span>
                            <span className="text-[9px] font-bold text-muted-foreground/20 italic">Status: Relayed</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interaction Overlay */}
                  < div className="absolute right-2 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications(prev => prev.filter(n => n.id !== notification.id));
                      }}
                      className="h-7 w-7 rounded-lg hover:bg-red-500/20 hover:text-red-500 text-muted-foreground/30"
                      title="Dismiss Signal"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-accent shadow-glow rounded-r-full" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent >
    </DropdownMenu >
  );
};

export default Notifications;
