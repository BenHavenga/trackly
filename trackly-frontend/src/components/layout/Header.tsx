import {
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Notification } from "@/types/api";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: apiClient.getNotifications,
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 md:h-16 items-center px-3 md:px-4">
        {/* Left: Sidebar Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Sidebar Toggle - hidden on mobile */}
          <div className="hidden md:block">
            <SidebarTrigger />
          </div>
        </div>
        {/* Right: All header icons at far right */}
        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          {/* Theme Toggle - smaller on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 md:h-9 md:w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {/* Notifications - smaller on mobile */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 md:h-9 md:w-9"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-4 w-4 md:h-5 md:w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 z-50 bg-card" align="end">
              <div className="border-b px-4 py-3">
                <h4 className="font-semibold">Notifications</h4>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {unreadCount} unread notification
                    {unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications
                    .slice(0, 10)
                    .map((notification: Notification) => (
                      <div
                        key={notification.id}
                        className={`border-b px-4 py-3 text-sm hover:bg-accent ${
                          !notification.read ? "bg-accent/50" : ""
                        }`}
                      >
                        <p>{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(
                            notification.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="border-t p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => apiClient.markAllNotificationsRead()}
                  >
                    Mark all as read
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          {/* User Menu - smaller on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 md:h-9 md:w-9 rounded-full"
              >
                <Avatar className="h-7 w-7 md:h-8 md:w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user ? getUserInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 z-50 bg-card"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
