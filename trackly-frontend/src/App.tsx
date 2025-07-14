import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { Dashboard } from "@/pages/Dashboard";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { FinanceDashboard } from "@/pages/finance/FinanceDashboard";
import { ApprovalsDashboard } from "@/pages/approvals/ApprovalsDashboard";
import { Expenses } from "@/pages/Expenses";
import { ExpenseUpload } from "@/pages/ExpenseUpload";
import { Settings } from "@/pages/Settings";
import NotFound from "./pages/NotFound";
import Help from "@/pages/help";
import { AppLayout } from "@/components/layout/AppLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const { theme, setTheme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes with layout */}
                <Route element={<AppLayout title="Dashboard" />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/expenses/upload" element={<ExpenseUpload />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/finance" element={<FinanceDashboard />} />
                  <Route path="/approvals" element={<ApprovalsDashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<Help />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
