import {
  LayoutDashboard,
  Receipt,
  Upload,
  Settings,
  Users,
  CheckCircle,
  CreditCard,
  FileDown,
  Shield,
  Home,
  DollarSign,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { CUSTOMER_NAME, CUSTOMER_LOGO_LETTER, APP_NAME } from "@/branding";

const baseItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const expenseItems = [
  { title: "My Expenses", url: "/expenses", icon: Receipt },
  { title: "Upload Expense", url: "/expenses/upload", icon: Upload },
];

const financeItems = [{ title: "Finance", url: "/finance", icon: DollarSign }];

const adminItems = [{ title: "Admin", url: "/admin", icon: Shield }];

const settingsItems = [{ title: "Settings", url: "/settings", icon: Settings }];

const homeExpenseItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "My Expenses", url: "/expenses", icon: Receipt },
  { title: "Upload Expense", url: "/expenses/upload", icon: Upload },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path + "/");
  const getNavCls = (path: string) =>
    (isActive(path)
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
      : "hover:bg-sidebar-accent/50") +
    " text-sm md:text-base px-2 py-1.5 rounded-lg transition-colors duration-150";

  if (!user) return null;

  const FinanceIcon = financeItems[0].icon;

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="animate-slide-in px-3 pt-8 pb-4 flex flex-col h-full">
        {/* Brand at top */}
        <div
          className="mb-8 flex items-center justify-center"
          style={{ minHeight: "48px" }}
        >
          {!collapsed ? (
            <span className="font-bold text-xl tracking-tight text-primary truncate max-w-[180px]">
              {CUSTOMER_NAME || APP_NAME}
            </span>
          ) : (
            <span className="font-bold text-xl tracking-tight text-primary">
              {CUSTOMER_LOGO_LETTER || "T"}
            </span>
          )}
        </div>
        {/* Home & Expenses Section (unified, no label) */}
        <div className="mb-8">
          <SidebarGroupContent>
            <SidebarMenu>
              {homeExpenseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={
                        getNavCls(item.url) +
                        " flex flex-row items-center mb-1.5"
                      }
                      style={{ minHeight: "40px", maxWidth: "100%" }}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && (
                        <span className="ml-3 block truncate max-w-[160px]">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {(user.role === "approver" || user.role === "admin") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/approvals"
                      className={
                        getNavCls("/approvals") +
                        " flex flex-row items-center mb-1.5"
                      }
                      style={{ minHeight: "40px", maxWidth: "100%" }}
                    >
                      <CheckCircle className="h-5 w-5" />
                      {!collapsed && (
                        <span className="ml-3 block truncate max-w-[160px]">
                          Approvals
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </div>

        {/* Finance Section (no label) */}
        {user.role === "finance" && (
          <div className="mb-8">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={financeItems[0].title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={financeItems[0].url}
                      className={
                        getNavCls(financeItems[0].url) +
                        " flex flex-row items-center mb-1.5"
                      }
                      style={{ minHeight: "40px", maxWidth: "100%" }}
                    >
                      <FinanceIcon className="h-5 w-5" />
                      {!collapsed && (
                        <span className="ml-3 block truncate max-w-[160px]">
                          {financeItems[0].title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </div>
        )}

        {/* Divider before bottom sections */}
        <div className="flex-1" />

        {/* Divider above Settings */}
        <hr className="my-2 border-t border-primary" />
        {/* Admin Section (if admin, above settings, no label) */}
        {user.role === "admin" && (
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={
                        getNavCls(item.url) +
                        " flex flex-row items-center mb-1.5"
                      }
                      style={{ minHeight: "40px", maxWidth: "100%" }}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && (
                        <span className="ml-3 block truncate max-w-[160px]">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        )}

        {/* Settings always last, under divider, no label */}
        <div className="mb-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={
                        getNavCls(item.url) +
                        " flex flex-row items-center mb-1.5"
                      }
                      style={{ minHeight: "40px", maxWidth: "100%" }}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && (
                        <span className="ml-3 block truncate max-w-[160px]">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Sign Out button, styled exactly like Settings but destructive */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={logout}
                    className={
                      "flex flex-row items-center mb-1.5 px-2 py-1.5 rounded-lg text-destructive hover:bg-red font-medium transition-colors min-h-[40px] w-full" +
                      (collapsed ? " justify-center" : "")
                    }
                    style={{ maxWidth: "100%" }}
                  >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && (
                      <span className="ml-3 block truncate max-w-[160px]">
                        Sign Out
                      </span>
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
