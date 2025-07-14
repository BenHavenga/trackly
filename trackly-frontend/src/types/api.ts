
// Core TypeScript interfaces for Trackly API
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'employee' | 'approver' | 'finance' | 'admin';
}

export interface LineItem {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Expense {
  id: number;
  owner_id: number;
  approver_id: number | null;
  vendor: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  gl_code: string | null;
  description: string;
  image_filename: string;
  status: ExpenseStatus;
  created_at: string;
  line_items: LineItem[];
}

export interface PendingReportGroup {
  owner_id: number;
  user_name: string;
  user_email: string;
  items_count: number;
  total_amount: number;
  submitted_at: string;
  expenses: Expense[];
}

export interface Notification {
  id: number;
  message: string;
  created_at: string;
  read: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
