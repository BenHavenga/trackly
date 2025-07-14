import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { User, LoginRequest, RegisterRequest } from "@/types/api";
import { toast } from "@/hooks/use-toast";
import { APP_NAME, CUSTOMER_NAME, CUSTOMER_EMAIL_DOMAIN } from "@/branding";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // Check for stored token on mount
  useEffect(() => {
    const token = apiClient.getStoredToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Mock user data when authenticated
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          id: 1,
          email: userData.email,
          name: userData.name,
          role: userData.role as "admin" | "finance" | "approver" | "employee",
        };
      }
      return {
        id: 1,
        email: `admin@${CUSTOMER_EMAIL_DOMAIN}`,
        name: "Admin User",
        role: "admin" as const,
      };
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // Dummy users with different roles
      const dummyUsers = {
        [`admin@${CUSTOMER_EMAIL_DOMAIN}`]: {
          role: "admin",
          name: "Admin User",
          password: "admin",
        },
        [`finance@${CUSTOMER_EMAIL_DOMAIN}`]: {
          role: "finance",
          name: "Finance User",
          password: "finance",
        },
        [`approver@${CUSTOMER_EMAIL_DOMAIN}`]: {
          role: "approver",
          name: "Approver User",
          password: "approver",
        },
        [`employee@${CUSTOMER_EMAIL_DOMAIN}`]: {
          role: "employee",
          name: "Employee User",
          password: "employee",
        },
      };

      const user = dummyUsers[credentials.email as keyof typeof dummyUsers];
      if (user && credentials.password === user.password) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: credentials.email,
            role: user.role,
            name: user.name,
          })
        );
        return { access_token: "dummy-token", token_type: "bearer" };
      }
      throw new Error(
        `Invalid credentials. Try admin@${CUSTOMER_EMAIL_DOMAIN}/admin, finance@${CUSTOMER_EMAIL_DOMAIN}/finance, approver@${CUSTOMER_EMAIL_DOMAIN}/approver, or employee@${CUSTOMER_EMAIL_DOMAIN}/employee`
      );
    },
    onSuccess: (tokens) => {
      apiClient.setToken(tokens.access_token);
      setIsAuthenticated(true);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: "Invalid password. Use 'admin'",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: apiClient.register,
    onSuccess: (tokens) => {
      apiClient.setToken(tokens.access_token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: `Welcome to ${CUSTOMER_NAME || APP_NAME}!`,
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description:
          error.response?.data?.message || "Unable to create account",
        variant: "destructive",
      });
    },
  });

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterRequest) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = () => {
    apiClient.clearToken();
    setIsAuthenticated(false);
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        login,
        register,
        logout,
        isLoading:
          isLoading || loginMutation.isPending || registerMutation.isPending,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
