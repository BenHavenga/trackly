import {
  Home,
  Receipt,
  Plus,
  Settings,
  Users,
  DollarSign,
  CheckSquare,
  HelpCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const { user } = useAuth();

  const getNavItems = () => {
    const addItem = {
      to: "/expenses/upload",
      icon: Plus,
      label: "Add",
      isQuickAdd: true,
    };

    let leftItems: Array<{
      to: string;
      icon: any;
      label: string;
      isQuickAdd?: boolean;
    }> = [{ to: "/dashboard", icon: Home, label: "Home" }];

    let rightItems: Array<{
      to: string;
      icon: any;
      label: string;
      isQuickAdd?: boolean;
    }> = [{ to: "/settings", icon: Settings, label: "Settings" }];

    // Add role-specific items
    if (user?.role === "admin") {
      leftItems.push({ to: "/expenses", icon: Receipt, label: "Expenses" });
      rightItems.unshift({ to: "/admin", icon: Users, label: "Admin" });
    } else if (user?.role === "finance") {
      leftItems.push({ to: "/expenses", icon: Receipt, label: "Expenses" });
      rightItems.unshift({
        to: "/finance",
        icon: DollarSign,
        label: "Finance",
      });
    } else if (user?.role === "approver") {
      leftItems.push({ to: "/expenses", icon: Receipt, label: "Expenses" });
      rightItems.unshift({
        to: "/approvals",
        icon: CheckSquare,
        label: "Approvals",
      });
    } else {
      // Default for employees
      leftItems.push({ to: "/expenses", icon: Receipt, label: "Expenses" });
      // Add Help after Add for symmetry (5 items), only for employees
      rightItems.unshift({ to: "/help", icon: HelpCircle, label: "Help" });
    }

    return [...leftItems, addItem, ...rightItems];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-xl transition-all duration-200",
                "text-xs font-medium text-muted-foreground",
                "hover:text-foreground hover:bg-accent",
                "active:scale-95",
                isActive ? "text-primary bg-primary/10" : "",
                item.isQuickAdd
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : ""
              )
            }
          >
            <item.icon
              className={cn("w-5 h-5 mb-1", item.isQuickAdd ? "w-6 h-6" : "")}
            />
            <span
              className={cn(
                "text-xs leading-tight",
                item.isQuickAdd ? "text-primary-foreground" : ""
              )}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
