import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MobileTabs,
  MobileTabsList,
  MobileTabsTrigger,
  MobileTabsContent,
} from "@/components/ui/mobile-tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Search,
  Filter,
  Eye,
  AlertCircle,
  DollarSign,
  FileText,
  Calendar,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: number;
  employee: string;
  employeeEmail: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  receiptUrl?: string;
  submittedDate: string;
  priority: "low" | "medium" | "high";
  notes?: string;
}

interface ExpenseReport {
  id: number;
  title: string;
  submittedBy: string;
  submittedByEmail: string;
  totalAmount: number;
  expenseCount: number;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  priority: "low" | "medium" | "high";
  notes?: string;
}

const mockExpenses: Expense[] = [
  {
    id: 1,
    employee: "John Smith",
    employeeEmail: "john.smith@saolrx.com",
    amount: 250.0,
    category: "Travel",
    description: "Flight to client meeting in San Francisco",
    date: "2024-01-15",
    status: "pending",
    submittedDate: "2024-01-16",
    priority: "high",
    notes: "Urgent client meeting - need quick approval",
  },
  {
    id: 2,
    employee: "Jane Doe",
    employeeEmail: "jane.doe@saolrx.com",
    amount: 45.3,
    category: "Meals",
    description: "Client lunch at downtown restaurant",
    date: "2024-01-14",
    status: "pending",
    submittedDate: "2024-01-15",
    priority: "medium",
  },
  {
    id: 3,
    employee: "Employee User",
    employeeEmail: "employee@saolrx.com",
    amount: 120.0,
    category: "Office Supplies",
    description: "Laptop accessories and docking station",
    date: "2024-01-13",
    status: "pending",
    submittedDate: "2024-01-14",
    priority: "low",
  },
  {
    id: 4,
    employee: "John Smith",
    employeeEmail: "john.smith@saolrx.com",
    amount: 75.5,
    category: "Software",
    description: "Adobe Creative Suite subscription",
    date: "2024-01-12",
    status: "approved",
    submittedDate: "2024-01-13",
    priority: "medium",
  },
  {
    id: 5,
    employee: "Jane Doe",
    employeeEmail: "jane.doe@saolrx.com",
    amount: 200.0,
    category: "Training",
    description: "Conference ticket for TechCrunch Disrupt",
    date: "2024-01-11",
    status: "rejected",
    submittedDate: "2024-01-12",
    priority: "high",
    notes: "Budget exceeded for this quarter",
  },
  {
    id: 6,
    employee: "New Employee",
    employeeEmail: "new.employee@saolrx.com",
    amount: 85.0,
    category: "Travel",
    description: "Uber rides for client meetings",
    date: "2024-01-10",
    status: "pending",
    submittedDate: "2024-01-11",
    priority: "medium",
  },
  {
    id: 7,
    employee: "Senior Developer",
    employeeEmail: "senior.dev@saolrx.com",
    amount: 150.0,
    category: "Office Supplies",
    description: "Ergonomic chair for home office",
    date: "2024-01-09",
    status: "pending",
    submittedDate: "2024-01-10",
    priority: "low",
  },
];

const mockExpenseReports: ExpenseReport[] = [
  {
    id: 1,
    title: "Business Trip - January 2024",
    submittedBy: "John Smith",
    submittedByEmail: "john.smith@saolrx.com",
    totalAmount: 425.5,
    expenseCount: 3,
    status: "pending",
    submittedDate: "2024-01-16",
    priority: "high",
    notes: "Multi-day business trip with multiple expenses",
  },
  {
    id: 2,
    title: "Training Workshop Expenses",
    submittedBy: "Jane Doe",
    submittedByEmail: "jane.doe@saolrx.com",
    totalAmount: 150.0,
    expenseCount: 2,
    status: "pending",
    submittedDate: "2024-01-15",
    priority: "medium",
  },
  {
    id: 3,
    title: "Office Equipment Purchase",
    submittedBy: "Employee User",
    submittedByEmail: "employee@saolrx.com",
    totalAmount: 320.0,
    expenseCount: 1,
    status: "approved",
    submittedDate: "2024-01-14",
    priority: "low",
  },
];

export function ApprovalsDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [expenseReports, setExpenseReports] =
    useState<ExpenseReport[]>(mockExpenseReports);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    employee: "all",
    priority: "all",
    status: "all",
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [reportToReject, setReportToReject] = useState<number | null>(null);
  const { toast } = useToast();

  const pendingReports = expenseReports.filter((r) => r.status === "pending");

  // Filter reports based on current filters
  const filteredReports = expenseReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.submittedBy.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory =
      filters.category === "all" || report.priority === filters.category;
    const matchesEmployee =
      filters.employee === "all" || report.submittedBy === filters.employee;
    const matchesPriority =
      filters.priority === "all" || report.priority === filters.priority;
    const matchesStatus =
      filters.status === "all" || report.status === filters.status;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesEmployee &&
      matchesPriority &&
      matchesStatus
    );
  });

  const approveReports = (reportIds: number[]) => {
    setExpenseReports(
      expenseReports.map((report) =>
        reportIds.includes(report.id)
          ? { ...report, status: "approved" as const }
          : report
      )
    );
    setSelectedReports([]);
    toast({
      title: "Reports approved",
      description: `Approved ${reportIds.length} expense report(s).`,
    });
  };

  const rejectReport = (reportId: number, reason: string) => {
    setExpenseReports(
      expenseReports.map((report) =>
        report.id === reportId
          ? { ...report, status: "rejected" as const, notes: reason }
          : report
      )
    );
    toast({
      title: "Report rejected",
      description: `Rejected expense report with reason: ${reason}`,
    });
  };

  const handleSelectReport = (reportId: number, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, reportId]);
    } else {
      setSelectedReports(selectedReports.filter((id) => id !== reportId));
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Get unique categories and employees for filters
  const categories = [
    "all",
    ...Array.from(new Set(expenseReports.map((r) => r.priority))),
  ];
  const employees = [
    "all",
    ...Array.from(new Set(expenseReports.map((r) => r.submittedBy))),
  ];

  return (
    <div className="space-y-4 md:space-y-8 max-w-full">
      {/* Mobile-optimized header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Approvals Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Review and approve expense submissions from your team.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports.length}</div>
            <p className="text-xs text-muted-foreground">
              $
              {pendingReports
                .reduce((sum, r) => sum + r.totalAmount, 0)
                .toFixed(2)}{" "}
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 days</div>
            <p className="text-xs text-muted-foreground">
              From submission to decision
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section - improved tab alignment and spacing */}
      <MobileTabs defaultValue="reports" className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <MobileTabsList className="flex flex-wrap gap-2 w-full md:w-auto">
            <MobileTabsTrigger value="reports" className="flex-1 md:flex-none">
              Expense Reports ({pendingReports.length})
            </MobileTabsTrigger>
            <MobileTabsTrigger value="history" className="flex-1 md:flex-none">
              Approval History
            </MobileTabsTrigger>
          </MobileTabsList>
        </div>

        <MobileTabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Expense Reports</CardTitle>
              <CardDescription>
                Review expense reports submitted by team members. Select
                multiple for bulk approval.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm md:text-base">Filters</h4>
                </div>

                <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search reports..."
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                          }))
                        }
                        className="pl-9 h-9 md:h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium">
                      Category
                    </label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="h-9 md:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium">
                      Employee
                    </label>
                    <Select
                      value={filters.employee}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, employee: value }))
                      }
                    >
                      <SelectTrigger className="h-9 md:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee} value={employee}>
                            {employee === "all" ? "All Employees" : employee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium">
                      Priority
                    </label>
                    <Select
                      value={filters.priority}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger className="h-9 md:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium">
                      Status
                    </label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="h-9 md:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredReports.length} of {expenseReports.length}{" "}
                    reports
                  </div>
                  {selectedReports.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => approveReports(selectedReports)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve Selected ({selectedReports.length})
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reports Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedReports.length === pendingReports.length
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedReports(
                                pendingReports.map((r) => r.id)
                              );
                            } else {
                              setSelectedReports([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="min-w-[150px]">
                        Report Title
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        Submitted By
                      </TableHead>
                      <TableHead className="min-w-[80px]">Amount</TableHead>
                      <TableHead className="min-w-[80px]">Items</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[80px]">Priority</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedReports.includes(report.id)}
                            onCheckedChange={(checked) =>
                              handleSelectReport(report.id, checked as boolean)
                            }
                            disabled={report.status !== "pending"}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {report.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{report.submittedBy}</span>
                            <span className="text-xs text-muted-foreground">
                              {report.submittedByEmail}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>${report.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{report.expenseCount}</TableCell>
                        <TableCell>{report.submittedDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getPriorityBadgeVariant(report.priority)}
                            className="text-xs"
                          >
                            {report.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(report.status)}
                            className="text-xs"
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                /* View report details */
                              }}
                              className="w-full sm:w-auto min-h-[32px] text-xs"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {report.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => approveReports([report.id])}
                                  className="w-full sm:w-auto min-h-[32px] text-xs"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setReportToReject(report.id);
                                    setShowRejectionDialog(true);
                                  }}
                                  className="w-full sm:w-auto min-h-[32px] text-xs"
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredReports.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No reports found
                  </h3>
                  <p className="text-muted-foreground">
                    {filters.search ||
                    filters.category !== "all" ||
                    filters.employee !== "all"
                      ? "Try adjusting your filters to see more results."
                      : "No reports are currently pending approval."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </MobileTabsContent>

        <MobileTabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
              <CardDescription>
                View your recent approval decisions and track response times.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Employee</TableHead>
                      <TableHead className="min-w-[150px]">
                        Description
                      </TableHead>
                      <TableHead className="min-w-[80px]">Amount</TableHead>
                      <TableHead className="min-w-[100px]">Submitted</TableHead>
                      <TableHead className="min-w-[100px]">Decided</TableHead>
                      <TableHead className="min-w-[80px]">Decision</TableHead>
                      <TableHead className="min-w-[100px]">
                        Response Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseReports
                      .filter((r) => r.status !== "pending")
                      .map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            {report.submittedBy}
                          </TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>
                            ${report.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(report.status)}
                              className="text-xs"
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>1 day</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>
      </MobileTabs>

      {/* Rejection Dialog */}
      {showRejectionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reject Report</CardTitle>
              <CardDescription>
                Please provide a reason for rejecting this report.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectionDialog(false);
                    setRejectionReason("");
                    setReportToReject(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (reportToReject && rejectionReason.trim()) {
                      rejectReport(reportToReject, rejectionReason.trim());
                    }
                  }}
                  disabled={!rejectionReason.trim()}
                >
                  Reject Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
