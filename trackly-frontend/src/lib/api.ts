
import axios, { AxiosInstance } from 'axios';
import { AuthTokens, User, LoginRequest, RegisterRequest } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for global error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('trackly_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('trackly_token');
  }

  getStoredToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('trackly_token');
    }
    return this.token;
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthTokens> {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthTokens> {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  // Expenses endpoints
  async getMyExpenses() {
    const response = await this.client.get('/expenses/me');
    return response.data;
  }

  async getPendingReports() {
    const response = await this.client.get('/workflow/pending-reports');
    return response.data;
  }

  // Categories endpoints
  async getCategories() {
    const response = await this.client.get('/categories/');
    return response.data;
  }

  // Notifications endpoints
  async getNotifications() {
    const response = await this.client.get('/notifications/');
    return response.data;
  }

  async markNotificationRead(id: number) {
    const response = await this.client.post(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsRead() {
    const response = await this.client.post('/notifications/mark-all-read');
    return response.data;
  }
}

export const apiClient = new ApiClient();
