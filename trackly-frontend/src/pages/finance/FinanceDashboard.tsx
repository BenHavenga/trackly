import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
import {
  DollarSign,
  Download,
  CheckCircle,
  Clock,
  Users,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: "draft" | "pending" | "approved" | "rejected" | "paid";
  submittedBy: string;
  receiptUrl?: string;
  paymentDate?: string;
}

interface ExpenseReport {
  id: number;
  title: string;
  submittedBy: string;
  totalAmount: number;
  expenseCount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  submittedDate: string;
  expenses: number[]; // Array of expense IDs
  description?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  totalExpenses: number;
  unpaidExpenses: number;
}

const mockExpenses: Expense[] = [
  {
    id: 1,
    description: "Flight to client meeting",
    amount: 250.0,
    category: "Travel",
    date: "2024-01-15",
    status: "approved",
    submittedBy: "John Smith",
    receiptUrl: undefined,
  },
  {
    id: 2,
    description: "Client lunch",
    amount: 45.3,
    category: "Meals",
    date: "2024-01-14",
    status: "approved",
    submittedBy: "Jane Doe",
    receiptUrl: undefined,
  },
  {
    id: 3,
    description: "Laptop accessories",
    amount: 120.0,
    category: "Office Supplies",
    date: "2024-01-13",
    status: "paid",
    submittedBy: "Employee User",
    receiptUrl: undefined,
    paymentDate: "2024-01-16",
  },
  {
    id: 4,
    description: "Adobe subscription",
    amount: 75.5,
    category: "Software",
    date: "2024-01-12",
    status: "approved",
    submittedBy: "John Smith",
    receiptUrl: undefined,
  },
  {
    id: 5,
    description: "Conference ticket",
    amount: 200.0,
    category: "Training",
    date: "2024-01-11",
    status: "approved",
    submittedBy: "Jane Doe",
    receiptUrl: undefined,
  },
  {
    id: 6,
    description: "Uber rides",
    amount: 85.0,
    category: "Travel",
    date: "2024-01-10",
    status: "paid",
    submittedBy: "John Smith",
    receiptUrl: undefined,
    paymentDate: "2024-01-15",
  },
  {
    id: 7,
    description: "Coffee with client",
    amount: 32.5,
    category: "Meals",
    date: "2024-01-09",
    status: "paid",
    submittedBy: "Jane Doe",
    receiptUrl: undefined,
    paymentDate: "2024-01-14",
  },
  {
    id: 8,
    description: "Monitor stand",
    amount: 150.0,
    category: "Office Supplies",
    date: "2024-01-08",
    status: "paid",
    submittedBy: "Employee User",
    receiptUrl: undefined,
    paymentDate: "2024-01-13",
  },
  {
    id: 9,
    description: "Cloud storage subscription",
    amount: 95.0,
    category: "Software",
    date: "2024-01-07",
    status: "paid",
    submittedBy: "John Smith",
    receiptUrl: undefined,
    paymentDate: "2024-01-12",
  },
  {
    id: 10,
    description: "Online course",
    amount: 180.0,
    category: "Training",
    date: "2024-01-06",
    status: "paid",
    submittedBy: "Jane Doe",
    receiptUrl: undefined,
    paymentDate: "2024-01-11",
  },
];

const mockReports: ExpenseReport[] = [
  {
    id: 1,
    title: "Business Trip - January",
    submittedBy: "John Smith",
    totalAmount: 295.3,
    expenseCount: 2,
    status: "approved",
    submittedDate: "2024-01-16",
    expenses: [1, 2],
    description: "Trip to client and related meals.",
  },
  {
    id: 2,
    title: "Office Supplies",
    submittedBy: "Employee User",
    totalAmount: 120.0,
    expenseCount: 1,
    status: "paid",
    submittedDate: "2024-01-13",
    expenses: [3],
    description: "Laptop accessories purchase.",
  },
];

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@trackly.com",
    totalExpenses: 325.5,
    unpaidExpenses: 325.5,
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@trackly.com",
    totalExpenses: 245.3,
    unpaidExpenses: 245.3,
  },
  {
    id: 3,
    name: "Employee User",
    email: "employee@trackly.com",
    totalExpenses: 120.0,
    unpaidExpenses: 0,
  },
  {
    id: 4,
    name: "Approver User",
    email: "approver@trackly.com",
    totalExpenses: 0,
    unpaidExpenses: 0,
  },
];

export function FinanceDashboard() {
  const [reports, setReports] = useState<ExpenseReport[]>(mockReports);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailReport, setDetailReport] = useState<ExpenseReport | null>(null);
  const { toast } = useToast();

  const approvedReports = reports.filter((r) => r.status === "approved");
  const paidReports = reports.filter((r) => r.status === "paid");
  const totalUnpaid = approvedReports.reduce(
    (sum, r) => sum + r.totalAmount,
    0
  );
  const totalPaid = paidReports.reduce((sum, r) => sum + r.totalAmount, 0);

  const markAsPaid = (reportIds: number[]) => {
    setReports((prev) =>
      prev.map((r) =>
        reportIds.includes(r.id) ? { ...r, status: "paid" as const } : r
      )
    );
    setSelectedReports([]);
    toast({
      title: "Payment processed",
      description: `Marked ${reportIds.length} report(s) as paid.`,
    });
  };

  const exportReports = (format: "pdf" | "xlsx") => {
    toast({
      title: "Export started",
      description: `Generating ${format.toUpperCase()} export for ${
        selectedReports.length || "all"
      } reports.`,
    });
  };

  // Helper to get all expenses for a report
  const getReportExpenses = (report: ExpenseReport) =>
    report.expenses
      .map((eid) => expenses.find((e) => e.id === eid))
      .filter(Boolean) as Expense[];

  // Get unique categories and employees for filters
  const categories = [
    "all",
    ...Array.from(new Set(expenses.map((e) => e.category))),
  ];
  const employees = [
    "all",
    ...Array.from(new Set(expenses.map((e) => e.submittedBy))),
  ];

  return (
    <div className="space-y-4 md:space-y-8 max-w-full">
      {/* Mobile-optimized header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Finance Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Process payments and manage expense exports.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unpaid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalUnpaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {approvedReports.length} approved reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {paidReports.length} paid reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Processing Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">
              From approval to payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              With expense activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section - report-centric */}
      <MobileTabs defaultValue="unpaid" className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <MobileTabsList className="flex flex-wrap gap-2 w-full md:w-auto">
            <MobileTabsTrigger value="unpaid" className="flex-1 md:flex-none">
              Unpaid Reports
            </MobileTabsTrigger>
            <MobileTabsTrigger value="paid" className="flex-1 md:flex-none">
              Paid Reports
            </MobileTabsTrigger>
            <MobileTabsTrigger value="exports" className="flex-1 md:flex-none">
              Exports
            </MobileTabsTrigger>
          </MobileTabsList>
        </div>

        {/* Unpaid Reports Tab */}
        <MobileTabsContent value="unpaid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Reports</CardTitle>
              <CardDescription>
                Mark approved reports as paid. Select multiple for bulk
                processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="space-y-4">
                {selectedReports.length > 0 && (
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <span className="text-sm font-medium">
                      {selectedReports.length} report(s) selected
                    </span>
                    <Button
                      onClick={() => markAsPaid(selectedReports)}
                      className="ml-auto"
                    >
                      Mark as Paid
                    </Button>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedReports.length === approvedReports.length
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedReports(
                                  approvedReports.map((r) => r.id)
                                );
                              } else {
                                setSelectedReports([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead className="min-w-[150px]">Title</TableHead>
                        <TableHead className="min-w-[120px]">
                          Submitted By
                        </TableHead>
                        <TableHead className="min-w-[80px]">Amount</TableHead>
                        <TableHead className="min-w-[80px]">Items</TableHead>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedReports.includes(report.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedReports([
                                    ...selectedReports,
                                    report.id,
                                  ]);
                                } else {
                                  setSelectedReports(
                                    selectedReports.filter(
                                      (id) => id !== report.id
                                    )
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {report.title}
                          </TableCell>
                          <TableCell>{report.submittedBy}</TableCell>
                          <TableCell>
                            ${report.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>{report.expenseCount}</TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{report.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDetailReport(report);
                                setShowDetail(true);
                              }}
                              className="w-full sm:w-auto min-h-[32px] text-xs"
                            >
                              Preview
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>

        {/* Paid Reports Tab */}
        <MobileTabsContent value="paid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paid Reports</CardTitle>
              <CardDescription>
                View and filter all paid reports for reporting and analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Title</TableHead>
                      <TableHead className="min-w-[120px]">
                        Submitted By
                      </TableHead>
                      <TableHead className="min-w-[80px]">Amount</TableHead>
                      <TableHead className="min-w-[80px]">Items</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.title}
                        </TableCell>
                        <TableCell>{report.submittedBy}</TableCell>
                        <TableCell>${report.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{report.expenseCount}</TableCell>
                        <TableCell>{report.submittedDate}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{report.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDetailReport(report);
                              setShowDetail(true);
                            }}
                            className="w-full sm:w-auto min-h-[32px] text-xs"
                          >
                            Preview
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>

        {/* Exports Tab */}
        <MobileTabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>
                Export paid reports for accounting and reporting. You have{" "}
                {paidReports.length} paid report
                {paidReports.length !== 1 ? "s" : ""} available.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Compact table of paid reports */}
              <div className="overflow-x-auto border rounded-md bg-muted/50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Title</TableHead>
                      <TableHead className="min-w-[80px]">Amount</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidReports.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground"
                        >
                          No paid reports to export.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paidReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            {report.title}
                          </TableCell>
                          <TableCell>
                            ${report.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Export buttons row */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
                <Button
                  className="flex-1 sm:flex-none"
                  onClick={() => exportReports("pdf")}
                >
                  Export PDF
                </Button>
                <Button
                  className="flex-1 sm:flex-none"
                  onClick={() => exportReports("xlsx")}
                >
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>
      </MobileTabs>

      {/* Detail Modal for report preview */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Expense Report Details</DialogTitle>
          </DialogHeader>
          {detailReport && (
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-base">
                  {detailReport.title}
                </div>
                <div className="flex flex-wrap gap-2 text-sm mt-1">
                  <Badge variant="secondary">{detailReport.status}</Badge>
                  <span>{detailReport.submittedDate}</span>
                  <span>${detailReport.totalAmount.toFixed(2)}</span>
                  <span>{detailReport.expenseCount} items</span>
                </div>
                {detailReport.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {detailReport.description}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  Report ID: {detailReport.id}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Submitted by: {detailReport.submittedBy}
                </div>
              </div>
              <Separator />
              <div>
                <div className="font-semibold text-sm mb-2">
                  Expenses in this report:
                </div>
                <div className="space-y-3">
                  {getReportExpenses(detailReport).map((e) => (
                    <div key={e.id} className="border rounded p-2 bg-muted/50">
                      <div className="flex flex-wrap gap-2 items-center mb-1">
                        <span className="font-medium">{e.description}</span>
                        <Badge>{e.category}</Badge>
                        <Badge variant="secondary">{e.status}</Badge>
                        <span>${e.amount.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">
                          {e.date}
                        </span>
                      </div>
                      {e.receiptUrl && (
                        <div className="mt-1">
                          <div className="font-medium text-xs mb-1">
                            Receipt Image
                          </div>
                          <img
                            src={e.receiptUrl}
                            alt="Receipt"
                            className="rounded border max-h-40"
                          />
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Expense ID: {e.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
