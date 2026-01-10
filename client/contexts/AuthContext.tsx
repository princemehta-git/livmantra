import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
  dob?: string | null;
  gender?: string | null;
  profileImage?: string | null;
  state?: string | null;
  nationality?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  admin: { id: string; name: string; email: string; isAdmin: boolean } | null;
  userToken: string | null;
  adminToken: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  adminLogout: () => void;
  updateUser: (user: User) => void;
  impersonateUser: (userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "livmantra_user";
const ADMIN_STORAGE_KEY = "livmantra_admin";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    admin: null,
    userToken: null,
    adminToken: null,
    loading: true,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      const adminData = localStorage.getItem(ADMIN_STORAGE_KEY);

      if (userData) {
        const parsed = JSON.parse(userData);
        setState((prev) => ({
          ...prev,
          user: parsed.user,
          userToken: parsed.token,
        }));
      }

      if (adminData) {
        const parsed = JSON.parse(adminData);
        setState((prev) => ({
          ...prev,
          admin: parsed.admin,
          adminToken: parsed.token,
        }));
      }
    } catch (error) {
      console.error("Error loading auth from localStorage:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    const authData = { token: data.token, user: data.user };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData));
    setState((prev) => ({
      ...prev,
      user: data.user,
      userToken: data.token,
    }));
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Signup failed");
    }

    const data = await response.json();
    const authData = { token: data.token, user: data.user };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData));
    setState((prev) => ({
      ...prev,
      user: data.user,
      userToken: data.token,
    }));
  };

  const googleLogin = async (idToken: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const response = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Google login failed");
    }

    const data = await response.json();
    const authData = { token: data.token, user: data.user };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData));
    setState((prev) => ({
      ...prev,
      user: data.user,
      userToken: data.token,
    }));
  };

  const adminLogin = async (email: string, password: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Admin login failed");
    }

    const data = await response.json();
    const adminData = { token: data.token, admin: data.admin };

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
    setState((prev) => ({
      ...prev,
      admin: data.admin,
      adminToken: data.token,
    }));
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setState((prev) => ({
      ...prev,
      user: null,
      userToken: null,
    }));
    router.push("/login");
  };

  const adminLogout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setState((prev) => ({
      ...prev,
      admin: null,
      adminToken: null,
    }));
    router.push("/admin");
  };

  const updateUser = (user: User) => {
    setState((prev) => {
      const updated = { ...prev, user };
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        const parsed = JSON.parse(userData);
        parsed.user = user;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(parsed));
      }
      return updated;
    });
  };

  const impersonateUser = async (userId: string) => {
    if (!state.adminToken) {
      throw new Error("Admin authentication required");
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const response = await fetch(`${API_BASE}/admin/impersonate/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.adminToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Impersonation failed");
    }

    const data = await response.json();
    const authData = { token: data.token, user: data.user };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData));
    setState((prev) => ({
      ...prev,
      user: data.user,
      userToken: data.token,
    }));
  };

  const refreshUser = async () => {
    if (!state.userToken) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${state.userToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      updateUser(data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        googleLogin,
        adminLogin,
        logout,
        adminLogout,
        updateUser,
        impersonateUser,
        refreshUser,
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

