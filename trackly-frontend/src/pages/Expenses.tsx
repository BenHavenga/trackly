import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: "draft" | "pending" | "approved" | "rejected" | "paid";
  submittedBy: string;
  receiptUrl?: string;
  rejectionReason?: string;
}

interface ExpenseReport {
  id: number;
  title: string;
  submittedBy: string;
  totalAmount: number;
  expenseCount: number;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  expenses: number[]; // Array of expense IDs
  description?: string;
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
    rejectionReason: "Missing receipt",
  },
  // Additional dummy expenses for demo
  {
    id: 6,
    description: "Hotel accommodation",
    amount: 180.0,
    category: "Travel",
    date: "2024-01-10",
    status: "approved",
    submittedBy: "Employee User",
  },
  {
    id: 7,
    description: "Business dinner",
    amount: 95.75,
    category: "Meals",
    date: "2024-01-09",
    status: "pending",
    submittedBy: "Employee User",
  },
  {
    id: 8,
    description: "Office printer",
    amount: 350.0,
    category: "Office Supplies",
    date: "2024-01-08",
    status: "approved",
    submittedBy: "Employee User",
  },
  {
    id: 9,
    description: "Taxi to airport",
    amount: 30.0,
    category: "Travel",
    date: "2024-01-07",
    status: "pending",
    submittedBy: "Employee User",
  },
  {
    id: 10,
    description: "Team lunch",
    amount: 60.0,
    category: "Meals",
    date: "2024-01-06",
    status: "draft",
    submittedBy: "Employee User",
  },
  {
    id: 11,
    description: "Monitor purchase",
    amount: 220.0,
    category: "Equipment",
    date: "2024-01-05",
    status: "approved",
    submittedBy: "Employee User",
  },
  {
    id: 12,
    description: "Uber to client",
    amount: 18.5,
    category: "Transportation",
    date: "2024-01-04",
    status: "paid",
    submittedBy: "Employee User",
  },
  {
    id: 13,
    description: "Printer ink",
    amount: 45.0,
    category: "Office Supplies",
    date: "2024-01-03",
    status: "rejected",
    submittedBy: "Employee User",
    rejectionReason: "Over budget",
  },
  {
    id: 14,
    description: "Online course",
    amount: 99.0,
    category: "Training",
    date: "2024-01-02",
    status: "approved",
    submittedBy: "Employee User",
  },
  {
    id: 15,
    description: "Coffee with client",
    amount: 12.0,
    category: "Meals",
    date: "2024-01-01",
    status: "paid",
    submittedBy: "Employee User",
  },
  // Expenses for another user
  {
    id: 16,
    description: "Flight to conference",
    amount: 400.0,
    category: "Travel",
    date: "2024-01-15",
    status: "approved",
    submittedBy: "Jane Doe",
  },
  {
    id: 17,
    description: "Dinner with team",
    amount: 80.0,
    category: "Meals",
    date: "2024-01-14",
    status: "pending",
    submittedBy: "Jane Doe",
  },
  {
    id: 18,
    description: "Conference registration",
    amount: 300.0,
    category: "Training",
    date: "2024-01-13",
    status: "draft",
    submittedBy: "Jane Doe",
  },
  {
    id: 19,
    description: "Taxi to hotel",
    amount: 25.0,
    category: "Transportation",
    date: "2024-01-12",
    status: "paid",
    submittedBy: "Jane Doe",
  },
  {
    id: 20,
    description: "Office chair",
    amount: 150.0,
    category: "Equipment",
    date: "2024-01-11",
    status: "approved",
    submittedBy: "Jane Doe",
  },
];

const mockReports: ExpenseReport[] = [
  {
    id: 1,
    title: "Business Trip - January",
    submittedBy: "Employee User",
    totalAmount: 250.0 + 45.3,
    expenseCount: 2,
    status: "pending",
    submittedDate: "2024-01-16",
    expenses: [1, 2],
  },
];

// Helper for badge variant (move above DetailModal for scope)
function getStatusBadgeVariant(
  status: Expense["status"] | ExpenseReport["status"]
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "rejected":
      return "destructive";
    case "paid":
    case "draft":
    default:
      return "outline";
  }
}

// Helper: fallback categories if not imported
const fallbackCategories = [
  "Travel",
  "Meals",
  "Office Supplies",
  "Software",
  "Training",
  "Equipment",
  "Transportation",
];

// DetailModal component for expense or report
function DetailModal({
  open,
  onOpenChange,
  expense,
  report,
  allExpenses,
  onExpenseEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense;
  report?: ExpenseReport;
  allExpenses: Expense[];
  onExpenseEdit?: (updated: Expense) => void;
}) {
  const { user } = useAuth();
  const isOwner = expense && user && expense.submittedBy === user.name;
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState<Partial<Expense>>({});

  useEffect(() => {
    setEditMode(false);
    setEditFields({});
  }, [expense, report, open]);

  const handleEditChange = (field: keyof Expense, value: any) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!expense) return;
    const updated: Expense = {
      ...expense,
      ...editFields,
    };
    onExpenseEdit?.(updated);
    setEditMode(false);
    setEditFields({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            {expense
              ? "Expense Details"
              : report
              ? "Expense Report Details"
              : "Details"}
          </DialogTitle>
        </DialogHeader>
        {expense && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-base">
                Expense #{expense.id}
              </div>
              {isOwner && !editMode && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge>
                {editMode ? (
                  <select
                    className="bg-transparent border rounded px-1 text-xs"
                    value={editFields.category ?? expense.category}
                    onChange={(e) =>
                      handleEditChange("category", e.target.value)
                    }
                  >
                    {fallbackCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                ) : (
                  expense.category
                )}
              </Badge>
              <Badge variant={getStatusBadgeVariant(expense.status)}>
                {expense.status}
              </Badge>
              <span>
                {editMode ? (
                  <input
                    type="date"
                    className="border rounded px-1 text-xs"
                    value={editFields.date ?? expense.date}
                    onChange={(e) => handleEditChange("date", e.target.value)}
                  />
                ) : (
                  expense.date
                )}
              </span>
              <span>
                {editMode ? (
                  <input
                    type="number"
                    className="border rounded px-1 text-xs w-20"
                    value={editFields.amount ?? expense.amount}
                    onChange={(e) =>
                      handleEditChange("amount", parseFloat(e.target.value))
                    }
                  />
                ) : (
                  `$${expense.amount.toFixed(2)}`
                )}
              </span>
            </div>
            <div>
              <span className="font-medium">Description: </span>
              {editMode ? (
                <input
                  type="text"
                  className="border rounded px-1 text-xs w-full"
                  value={editFields.description ?? expense.description}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                />
              ) : (
                expense.description
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Submitted by: {expense.submittedBy}
            </div>
            <div className="text-xs text-muted-foreground">
              Status: {expense.status}
            </div>
            {expense.rejectionReason && (
              <div className="text-sm text-red-500">
                Reason: {expense.rejectionReason}
              </div>
            )}
            {expense.receiptUrl && (
              <div>
                <div className="font-medium text-xs mb-1">Receipt Image</div>
                <img
                  src={expense.receiptUrl}
                  alt="Receipt"
                  className="rounded border max-h-64"
                />
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Expense ID: {expense.id}
            </div>
            {/* Add more fields here if needed */}
            {editMode && (
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setEditFields({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
        {report && (
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-base">{report.title}</div>
              <div className="flex flex-wrap gap-2 text-sm mt-1">
                <Badge variant={getStatusBadgeVariant(report.status)}>
                  {report.status}
                </Badge>
                <span>{report.submittedDate}</span>
                <span>${report.totalAmount.toFixed(2)}</span>
                <span>{report.expenseCount} items</span>
              </div>
              {report.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {report.description}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                Report ID: {report.id}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Submitted by: {report.submittedBy}
              </div>
            </div>
            <Separator />
            <div>
              <div className="font-semibold text-sm mb-2">
                Expenses in this report:
              </div>
              <div className="space-y-3">
                {report.expenses.map((eid) => {
                  const e = allExpenses.find((ex) => ex.id === eid);
                  if (!e) return null;
                  return (
                    <div key={e.id} className="border rounded p-2 bg-muted/50">
                      <div className="flex flex-wrap gap-2 items-center mb-1">
                        <span className="font-medium">{e.description}</span>
                        <Badge>{e.category}</Badge>
                        <Badge variant={getStatusBadgeVariant(e.status)}>
                          {e.status}
                        </Badge>
                        <span>${e.amount.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">
                          {e.date}
                        </span>
                      </div>
                      {e.rejectionReason && (
                        <div className="text-xs text-red-500 mb-1">
                          Reason: {e.rejectionReason}
                        </div>
                      )}
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
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Expenses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [reports, setReports] = useState<ExpenseReport[]>(mockReports);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<number[]>([]);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDesc, setReportDesc] = useState("");

  // Modal state for details
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailExpense, setDetailExpense] = useState<Expense | undefined>(
    undefined
  );
  const [detailReport, setDetailReport] = useState<ExpenseReport | undefined>(
    undefined
  );

  // Handle expense edit in modal
  const handleExpenseEdit = (updated: Expense) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setDetailExpense(updated);
  };

  const isApprover = user?.role === "approver" || user?.role === "admin";

  const draftExpenses = expenses.filter(
    (expense) =>
      expense.status === "draft" &&
      expense.submittedBy === user?.name &&
      (expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 md:space-y-8 max-w-full">
      {/* Header only */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Expenses
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage, filter, and group expenses. Use the tabs below to view and
          manage your submissions and reports.
        </p>
      </div>

      {/* Tabs Section - management only */}
      <MobileTabs defaultValue="expenses" className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <MobileTabsList className="flex flex-wrap gap-2 w-full md:w-auto">
            <MobileTabsTrigger value="expenses" className="flex-1 md:flex-none">
              My Expenses
            </MobileTabsTrigger>
            <MobileTabsTrigger value="reports" className="flex-1 md:flex-none">
              Expense Reports
            </MobileTabsTrigger>
          </MobileTabsList>
        </div>

        {/* My Expenses Tab */}
        <MobileTabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Expenses</CardTitle>
              <CardDescription>
                View and manage all your expenses. Select multiple to group into
                a report.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="space-y-4">
                {/* Filter/Search Row */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center p-4 sm:p-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search expenses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Expenses Button */}
                <div className="flex items-center gap-2">
                  <Button
                    disabled={selectedExpenses.length === 0}
                    onClick={() => setShowReportDialog(true)}
                  >
                    Submit Expenses
                  </Button>
                  {selectedExpenses.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {selectedExpenses.length} selected
                    </span>
                  )}
                </div>

                {/* Table - management only, all statuses */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8">
                          <Checkbox
                            checked={
                              selectedExpenses.length ===
                                expenses.filter(
                                  (expense) =>
                                    expense.submittedBy === user?.name &&
                                    (statusFilter === "all" ||
                                      expense.status === statusFilter) &&
                                    (expense.description
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase()) ||
                                      expense.category
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase()))
                                ).length && selectedExpenses.length > 0
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedExpenses(
                                  expenses
                                    .filter(
                                      (expense) =>
                                        expense.submittedBy === user?.name &&
                                        (statusFilter === "all" ||
                                          expense.status === statusFilter) &&
                                        (expense.description
                                          .toLowerCase()
                                          .includes(
                                            searchQuery.toLowerCase()
                                          ) ||
                                          expense.category
                                            .toLowerCase()
                                            .includes(
                                              searchQuery.toLowerCase()
                                            ))
                                    )
                                    .map((e) => e.id)
                                );
                              } else {
                                setSelectedExpenses([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead className="min-w-[150px]">
                          Description
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          Category
                        </TableHead>
                        <TableHead className="min-w-[80px]">Amount</TableHead>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {draftExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedExpenses.includes(expense.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedExpenses([
                                    ...selectedExpenses,
                                    expense.id,
                                  ]);
                                } else {
                                  setSelectedExpenses(
                                    selectedExpenses.filter(
                                      (id) => id !== expense.id
                                    )
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{expense.description}</span>
                              {expense.rejectionReason && (
                                <span className="text-xs text-red-500 mt-1">
                                  Reason: {expense.rejectionReason}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>${expense.amount.toFixed(2)}</TableCell>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(expense.status)}
                              className="text-xs"
                            >
                              {expense.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => {
                                  setDetailExpense(expense);
                                  setDetailReport(undefined);
                                  setDetailModalOpen(true);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              {expense.receiptUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Report Dialog */}
          <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Expense Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Report Title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                />
                <div>
                  <div className="font-semibold mb-2 text-sm">
                    Selected Expenses
                  </div>
                  <ul className="text-xs space-y-1">
                    {expenses
                      .filter((e) => selectedExpenses.includes(e.id))
                      .map((e) => (
                        <li key={e.id}>
                          {e.description} (${e.amount.toFixed(2)})
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    // Create new report from selected draft expenses
                    const selected = expenses.filter((e) =>
                      selectedExpenses.includes(e.id)
                    );
                    if (!reportTitle.trim() || selected.length === 0) return;
                    setReports([
                      ...reports,
                      {
                        id: reports.length + 1,
                        title: reportTitle,
                        submittedBy: user?.name || "",
                        totalAmount: selected.reduce(
                          (sum, e) => sum + e.amount,
                          0
                        ),
                        expenseCount: selected.length,
                        status: "pending",
                        submittedDate: new Date().toISOString().slice(0, 10),
                        expenses: selected.map((e) => e.id),
                        description: reportDesc,
                      },
                    ]);
                    // Remove submitted expenses from drafts
                    setExpenses((prev) =>
                      prev.map((e) =>
                        selectedExpenses.includes(e.id)
                          ? { ...e, status: "pending" }
                          : e
                      )
                    );
                    setSelectedExpenses([]);
                    setReportTitle("");
                    setReportDesc("");
                    setShowReportDialog(false);
                    toast({ title: "Expense report submitted" });
                  }}
                  disabled={
                    !reportTitle.trim() || selectedExpenses.length === 0
                  }
                >
                  Submit Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </MobileTabsContent>

        {/* Expense Reports Tab */}
        <MobileTabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Reports</CardTitle>
              <CardDescription>
                View and manage your grouped expense reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports
                      .filter((r) => r.submittedBy === user?.name)
                      .map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                          <TableCell>
                            ${report.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>{report.expenseCount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(report.status)}
                              className="text-xs"
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => {
                                setDetailReport(report);
                                setDetailExpense(undefined);
                                setDetailModalOpen(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
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
      </MobileTabs>

      {/* Detail Modal for expense or report */}
      <DetailModal
        open={detailModalOpen}
        onOpenChange={(open) => setDetailModalOpen(open)}
        expense={detailExpense}
        report={detailReport}
        allExpenses={expenses}
        onExpenseEdit={handleExpenseEdit}
      />
    </div>
  );
}
