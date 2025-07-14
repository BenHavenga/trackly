import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MobileTabsContent,
  MobileTabsList,
  MobileTabsTrigger,
} from "@/components/ui/mobile-tabs";
import { Users, Upload, FileText, Settings } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "finance" | "approver" | "employee";
  status: "active" | "inactive";
  expenses: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  status: "active" | "inactive";
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@saolrx.com",
    role: "admin",
    status: "active",
    expenses: 0,
  },
  {
    id: 2,
    name: "Finance User",
    email: "finance@saolrx.com",
    role: "finance",
    status: "active",
    expenses: 0,
  },
  {
    id: 3,
    name: "Approver User",
    email: "approver@saolrx.com",
    role: "approver",
    status: "active",
    expenses: 12,
  },
  {
    id: 4,
    name: "Employee User",
    email: "employee@saolrx.com",
    role: "employee",
    status: "active",
    expenses: 8,
  },
  {
    id: 5,
    name: "John Smith",
    email: "john.smith@saolrx.com",
    role: "employee",
    status: "active",
    expenses: 15,
  },
  {
    id: 6,
    name: "Jane Doe",
    email: "jane.doe@saolrx.com",
    role: "approver",
    status: "inactive",
    expenses: 3,
  },
];

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Travel",
    description: "Business travel expenses",
    status: "active",
  },
  {
    id: 2,
    name: "Meals",
    description: "Business meals and entertainment",
    status: "active",
  },
  {
    id: 3,
    name: "Office Supplies",
    description: "Office equipment and supplies",
    status: "active",
  },
  {
    id: 4,
    name: "Software",
    description: "Software licenses and subscriptions",
    status: "active",
  },
  {
    id: 5,
    name: "Training",
    description: "Professional development and training",
    status: "inactive",
  },
];

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const updateUserRole = (userId: number, newRole: User["role"]) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const toggleCategoryStatus = (categoryId: number) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              status: category.status === "active" ? "inactive" : "active",
            }
          : category
      )
    );
  };

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "finance":
        return "default";
      case "approver":
        return "secondary";
      case "employee":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4 md:space-y-8 max-w-full">
      {/* Mobile-optimized header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage users, categories, and system settings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {users.filter((u) => u.status === "inactive").length} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Categories
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter((c) => c.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {categories.filter((c) => c.status === "inactive").length}{" "}
              inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((acc, user) => acc + user.expenses, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section - improved tab alignment and spacing */}
      <MobileTabs defaultValue="users" className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <MobileTabsList className="flex flex-wrap gap-2 w-full md:w-auto">
            <MobileTabsTrigger value="users" className="flex-1 md:flex-none">
              User Management
            </MobileTabsTrigger>
            <MobileTabsTrigger
              value="categories"
              className="flex-1 md:flex-none"
            >
              Categories
            </MobileTabsTrigger>
            <MobileTabsTrigger
              value="bulk-upload"
              className="flex-1 md:flex-none"
            >
              Bulk Upload
            </MobileTabsTrigger>
          </MobileTabsList>
        </div>

        {/* User Management Tab */}
        <MobileTabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage user accounts and roles. Click on roles to change them.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[200px]">
                        Email
                      </TableHead>
                      <TableHead className="min-w-[100px]">Role</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[80px]">Expenses</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground md:hidden">
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value: User["role"]) =>
                              updateUserRole(user.id, value)
                            }
                          >
                            <SelectTrigger className="w-full sm:w-32 h-8">
                              <SelectValue>
                                <Badge
                                  variant={getRoleBadgeVariant(user.role)}
                                  className="text-xs"
                                >
                                  {user.role}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="approver">Approver</SelectItem>
                              <SelectItem value="employee">Employee</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.expenses}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>

        {/* Categories Tab */}
        <MobileTabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>
                Manage expense categories used across the organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add Category Form - improved responsive layout */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Input placeholder="Category name" className="flex-1" />
                  <Input placeholder="Description" className="flex-1" />
                  <Button className="w-full sm:w-auto min-h-[48px] text-base font-medium">
                    Add Category
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Name</TableHead>
                        <TableHead className="hidden md:table-cell min-w-[200px]">
                          Description
                        </TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{category.name}</span>
                              <span className="text-xs text-muted-foreground md:hidden">
                                {category.description}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {category.description}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                category.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {category.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCategoryStatus(category.id)}
                              className="w-full sm:w-auto min-h-[32px] text-xs"
                            >
                              {category.status === "active"
                                ? "Deactivate"
                                : "Activate"}
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

        {/* Bulk Upload Tab */}
        <MobileTabsContent value="bulk-upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk User Upload</CardTitle>
              <CardDescription>
                Upload multiple users via CSV file. Download the template first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 md:p-8 text-center">
                <Upload className="h-8 w-8 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  Upload CSV File
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto min-h-[48px] text-base font-medium"
                  >
                    Download Template
                  </Button>
                  <Button className="w-full sm:w-auto min-h-[48px] text-base font-medium">
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm md:text-base">
                  CSV Format Requirements:
                </h4>
                <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                  <li>
                    • Columns: Name, Email, Role
                    (admin/finance/approver/employee)
                  </li>
                  <li>• First row should contain headers</li>
                  <li>• Maximum 1000 users per upload</li>
                  <li>• Email addresses must be unique</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>
      </MobileTabs>
    </div>
  );
}
