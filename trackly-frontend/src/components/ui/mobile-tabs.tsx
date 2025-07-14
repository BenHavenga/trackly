import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";

interface MobileTabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface MobileTabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  count?: number;
}

interface MobileTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const MobileTabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  tabs: Array<{ value: string; label: string; count?: number }>;
  registerTab: (value: string, label: string, count?: number) => void;
} | null>(null);

export function MobileTabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: MobileTabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [tabs, setTabs] = useState<
    Array<{ value: string; label: string; count?: number }>
  >([]);

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const registerTab = (value: string, label: string, count?: number) => {
    setTabs((prev) => {
      const existing = prev.find((tab) => tab.value === value);
      if (existing) {
        return prev.map((tab) =>
          tab.value === value ? { value, label, count } : tab
        );
      }
      return [...prev, { value, label, count }];
    });
  };

  return (
    <MobileTabsContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        tabs,
        registerTab,
      }}
    >
      <div className={cn("space-y-6 w-full", className)}>
        {/* Mobile: dropdown */}
        <div className="block md:hidden w-full">
          <Select value={currentValue} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-full">
              {tabs.map((tab) => (
                <SelectItem
                  key={tab.value}
                  value={tab.value}
                  className="w-full"
                >
                  <div className="flex items-center justify-between w-full py-2">
                    <span className="font-medium">{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full font-medium">
                        {tab.count}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Desktop: tab buttons and all content */}
        {children}
      </div>
    </MobileTabsContext.Provider>
  );
}

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return children.toString();
  if (Array.isArray(children))
    return children.map(extractTextFromChildren).join(" ");
  if (React.isValidElement(children)) {
    return extractTextFromChildren(children.props.children);
  }
  return "Tab";
}

export function MobileTabsList({ children, className }: MobileTabsListProps) {
  // Only show on desktop
  return (
    <div className={cn("hidden md:flex flex-wrap gap-2", className)}>
      {children}
    </div>
  );
}
MobileTabsList.displayName = "MobileTabsList";

export function MobileTabsTrigger({
  value,
  children,
  className,
  count,
}: MobileTabsTriggerProps) {
  const context = React.useContext(MobileTabsContext);

  useEffect(() => {
    if (context) {
      const label = extractTextFromChildren(children);
      context.registerTab(value, label, count);
    }
  }, [value, children, count, context]);

  if (!context) return null;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        context.value === value
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-transparent hover:bg-accent hover:text-accent-foreground",
        "flex-1 md:flex-none",
        className
      )}
      onClick={() => context.onValueChange(value)}
    >
      {children}
      {count !== undefined && (
        <span className="ml-2 text-xs bg-background/20 px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
MobileTabsTrigger.displayName = "MobileTabsTrigger";

export function MobileTabsContent({
  value,
  children,
  className,
}: MobileTabsContentProps) {
  const context = React.useContext(MobileTabsContext);
  if (!context) return null;
  // Show only if active
  const isActive = context.value === value;
  return (
    <div className={cn("space-y-4", isActive ? "block" : "hidden", className)}>
      {children}
    </div>
  );
}
MobileTabsContent.displayName = "MobileTabsContent";
