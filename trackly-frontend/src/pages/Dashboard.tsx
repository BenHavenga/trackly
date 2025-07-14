import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MobileTabs,
  MobileTabsContent,
  MobileTabsList,
  MobileTabsTrigger,
} from "@/components/ui/mobile-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Plus,
  Upload,
  Camera,
  ArrowRight,
  Calendar,
  BarChart3,
  Activity,
} from "lucide-react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: "draft" | "pending" | "approved" | "rejected" | "paid";
  submittedBy: string;
}

interface ExpenseReport {
  id: number;
  title: string;
  submittedBy: string;
  totalAmount: number;
  expenseCount: number;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

const mockExpenses: Expense[] = [
  {
    id: 1,
    description: "Flight to client meeting",
    amount: 250.0,
    category: "Travel",
    date: "2024-01-15",
    status: "approved",
    submittedBy: "Employee User",
  },
  {
    id: 2,
    description: "Client lunch",
    amount: 45.3,
    category: "Meals",
    date: "2024-01-14",
    status: "pending",
    submittedBy: "Employee User",
  },
  {
    id: 3,
    description: "Laptop accessories",
    amount: 120.0,
    category: "Office Supplies",
    date: "2024-01-13",
    status: "draft",
    submittedBy: "Employee User",
  },
  {
    id: 4,
    description: "Adobe subscription",
    amount: 75.5,
    category: "Software",
    date: "2024-01-12",
    status: "paid",
    submittedBy: "Employee User",
  },
  {
    id: 5,
    description: "Conference ticket",
    amount: 200.0,
    category: "Training",
    date: "2024-01-11",
    status: "rejected",
    submittedBy: "Employee User",
  },
];

const mockPendingReports: ExpenseReport[] = [
  {
    id: 1,
    title: "Business Trip - January",
    submittedBy: "John Smith",
    totalAmount: 425.5,
    expenseCount: 3,
    status: "pending",
    submittedDate: "2024-01-16",
  },
  {
    id: 2,
    title: "Training Workshop",
    submittedBy: "Jane Doe",
    totalAmount: 150.0,
    expenseCount: 2,
    status: "pending",
    submittedDate: "2024-01-15",
  },
];

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isApprover = user?.role === "approver" || user?.role === "admin";
  const isFinance = user?.role === "finance";
  const isAdmin = user?.role === "admin";
  const isEmployee = !isApprover && !isFinance && !isAdmin;

  const myExpenses = mockExpenses.filter(
    (expense) => expense.submittedBy === user?.name
  );
  const draftExpenses = mockExpenses.filter(
    (expense) =>
      expense.status === "draft" && expense.submittedBy === user?.name
  );

  // For Approvals preview
  const mockPendingApprovals = [
    {
      id: 1,
      title: "Business Trip - January",
      amount: 425.5,
      submittedBy: "John Smith",
    },
    {
      id: 2,
      title: "Training Workshop",
      amount: 150.0,
      submittedBy: "Jane Doe",
    },
  ];

  // Expense status summary
  const statusSummary = [
    {
      label: "Pending",
      count: myExpenses.filter((e) => e.status === "pending").length,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Approved",
      count: myExpenses.filter((e) => e.status === "approved").length,
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Rejected",
      count: myExpenses.filter((e) => e.status === "rejected").length,
      color: "bg-red-100 text-red-800",
    },
    {
      label: "Paid",
      count: myExpenses.filter((e) => e.status === "paid").length,
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Drafts",
      count: draftExpenses.length,
      color: "bg-gray-100 text-gray-800",
    },
  ];

  // Quick Links (role-aware)
  const quickLinks = [
    {
      title: "My Expenses",
      description: "View and manage your expenses",
      icon: FileText,
      onClick: () => navigate("/expenses"),
      show: true,
    },
    {
      title: "Upload Expense",
      description: "Start a new expense submission",
      icon: Upload,
      onClick: () => navigate("/expenses/upload"),
      show: true,
    },
    {
      title: "Approvals",
      description: "Review and approve team expenses",
      icon: CheckCircle,
      onClick: () => navigate("/approvals"),
      show: isApprover,
    },
    {
      title: "Finance",
      description: "Process payments and exports",
      icon: DollarSign,
      onClick: () => navigate("/finance"),
      show: isFinance,
    },
    {
      title: "Admin",
      description: "Manage users and system settings",
      icon: Users,
      onClick: () => navigate("/admin"),
      show: isAdmin,
    },
  ];

  const getStatusBadgeVariant = (status: Expense["status"]) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      case "paid":
        return "outline";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  // Role-specific stats and widgets (mock data)
  const employeeWidgets = [
    {
      title: "Submission Streak",
      value: "5 days",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      description: "You've submitted expenses 5 days in a row!",
    },
    {
      title: "Monthly Spend",
      value: "$1,200",
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
      description: "Total submitted this month",
    },
    {
      title: "Tips",
      value: "Don't forget to submit receipts within 7 days!",
      icon: <InfoIcon className="h-5 w-5 text-yellow-500" />,
      description: "Expense policy reminder",
    },
  ];
  const approverWidgets = [
    {
      title: "Pending Approvals",
      value: "3",
      icon: <Clock className="h-5 w-5 text-orange-500" />,
      description: "Reports awaiting your review",
    },
    {
      title: "Avg. Approval Time",
      value: "2.1 days",
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      description: "Faster than last month",
    },
    {
      title: "Team Leaderboard",
      value: "You are #2",
      icon: <Users className="h-5 w-5 text-purple-500" />,
      description: "Based on approval speed",
    },
  ];
  const financeWidgets = [
    {
      title: "Unpaid Total",
      value: "$2,500",
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
      description: "Awaiting payment",
    },
    {
      title: "Export Queue",
      value: "4 reports",
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
      description: "Ready for export",
    },
    {
      title: "Payment Success Rate",
      value: "98%",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      description: "Last 30 days",
    },
  ];
  const adminWidgets = [
    {
      title: "Active Users",
      value: "42",
      icon: <Users className="h-5 w-5 text-orange-500" />,
      description: "Users active this week",
    },
    {
      title: "System Health",
      value: "All systems go",
      icon: <Activity className="h-5 w-5 text-green-500" />,
      description: "No incidents reported",
    },
    {
      title: "Flagged Expenses",
      value: "2",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      description: "Require admin review",
    },
  ];

  const stats = {
    total: myExpenses.reduce((sum, e) => sum + e.amount, 0),
    pending: myExpenses
      .filter((e) => e.status === "pending")
      .reduce((sum, e) => sum + e.amount, 0),
    approved: myExpenses
      .filter((e) => e.status === "approved")
      .reduce((sum, e) => sum + e.amount, 0),
    rejected: myExpenses
      .filter((e) => e.status === "rejected")
      .reduce((sum, e) => sum + e.amount, 0),
  };

  const quickActions = [
    {
      title: "Upload Receipt",
      description: "Take a photo or upload a receipt",
      icon: Camera,
      action: () => navigate("/expenses/upload"),
      color: "bg-blue-500 hover:bg-blue-600",
      iconColor: "text-blue-500",
    },
    {
      title: "Manual Entry",
      description: "Enter expense details manually",
      icon: Receipt,
      action: () => navigate("/expenses/upload"),
      color: "bg-green-500 hover:bg-green-600",
      iconColor: "text-green-500",
    },
    {
      title: "View All Expenses",
      description: "Browse and manage your expenses",
      icon: FileText,
      action: () => navigate("/expenses"),
      color: "bg-purple-500 hover:bg-purple-600",
      iconColor: "text-purple-500",
    },
  ];

  const adminQuickActions = [
    {
      title: "User Management",
      description: "Manage users and roles",
      icon: Users,
      action: () => navigate("/admin"),
      color: "bg-orange-500 hover:bg-orange-600",
      iconColor: "text-orange-500",
    },
    {
      title: "System Overview",
      description: "View system health and stats",
      icon: Activity,
      action: () => navigate("/admin"),
      color: "bg-red-500 hover:bg-red-600",
      iconColor: "text-red-500",
    },
  ];

  const financeQuickActions = [
    {
      title: "Process Payments",
      description: "Handle approved expense payments",
      icon: DollarSign,
      action: () => navigate("/finance"),
      color: "bg-emerald-500 hover:bg-emerald-600",
      iconColor: "text-emerald-500",
    },
    {
      title: "Generate Reports",
      description: "Create expense reports",
      icon: BarChart3,
      action: () => navigate("/finance"),
      color: "bg-indigo-500 hover:bg-indigo-600",
      iconColor: "text-indigo-500",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-8 max-w-full">
      {/* Header with Quick Add Expense button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Welcome back! Here's an overview of your expense tracking activity.
          </p>
        </div>
        <Button
          onClick={() => navigate("/expenses/upload")}
          className="flex items-center gap-2 w-full sm:w-auto min-h-[48px] text-base font-medium bg-primary text-primary-foreground"
        >
          <Plus className="h-5 w-5" />
          Quick Add Expense
        </Button>
      </div>

      {/* Quick Links Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Quick Links</h2>
        <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks
            .filter((l) => l.show)
            .map((link, idx) => (
              <Card
                key={idx}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                onClick={link.onClick}
              >
                <CardContent className="flex items-center gap-4 p-4 md:p-6">
                  <div className="p-3 rounded-lg bg-muted text-primary flex-shrink-0">
                    <link.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {link.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Pending Approvals Preview (for approvers/admins) */}
      {isApprover && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Pending Approvals</h2>
          <Card>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {mockPendingApprovals.length} pending
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/approvals")}
                >
                  Go to Approvals
                </Button>
              </div>
              <div className="divide-y">
                {mockPendingApprovals.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.submittedBy}
                      </span>
                    </div>
                    <span className="font-semibold">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Overview (role-aware) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.total.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {myExpenses.length} expenses
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.pending.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {myExpenses.filter((e) => e.status === "pending").length}{" "}
                pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.approved.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {myExpenses.filter((e) => e.status === "approved").length}{" "}
                approved
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.rejected.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {myExpenses.filter((e) => e.status === "rejected").length}{" "}
                rejected
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Role-specific Widgets */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Insights</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isAdmin &&
            adminWidgets.map((w, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  {w.icon}
                  <CardTitle className="text-sm font-medium">
                    {w.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{w.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {w.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          {isFinance &&
            financeWidgets.map((w, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  {w.icon}
                  <CardTitle className="text-sm font-medium">
                    {w.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{w.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {w.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          {isApprover &&
            approverWidgets.map((w, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  {w.icon}
                  <CardTitle className="text-sm font-medium">
                    {w.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{w.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {w.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          {isEmployee &&
            employeeWidgets.map((w, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  {w.icon}
                  <CardTitle className="text-sm font-medium">
                    {w.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{w.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {w.description}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Recent Expenses Preview (small, card-based) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Expenses</h2>
        <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myExpenses.slice(0, 3).map((expense) => (
            <Card key={expense.id}>
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{expense.description}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <span>{expense.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <Badge
                    variant={getStatusBadgeVariant(expense.status)}
                    className="text-xs"
                  >
                    {expense.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {myExpenses.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Receipt className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="font-medium mb-1">No recent expenses</span>
                <Button
                  onClick={() => navigate("/expenses/upload")}
                  className="mt-2 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Expense
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        {myExpenses.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="outline" onClick={() => navigate("/expenses")}>
              View All Expenses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-3a1 1 0 100-2 1 1 0 000 2zm-1 2a1 1 0 012 0v4a1 1 0 01-2 0v-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
