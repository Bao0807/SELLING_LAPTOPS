import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { API_BASE_URL, getAuthHeaders } from "../utils/api";

export type User = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: "customer" | "admin";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (fullName: string, phone: string) => Promise<{ success: boolean; message: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const applySession = (nextToken: string, nextUser: User) => {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const fetchProfile = useCallback(async (tokenVal: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${tokenVal}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
      } else {
        clearSession();
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchProfile(token);
    else setLoading(false);
  }, [token, fetchProfile]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.data?.token && data.data?.user) {
        applySession(data.data.token, data.data.user);
        return { success: true, message: data.message || "Đăng nhập thành công" };
      }
      return { success: false, message: data.message || "Email hoặc mật khẩu không đúng" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Không thể kết nối máy chủ. Vui lòng thử lại." };
    }
  };

  const register = async (fullName: string, email: string, phone: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, phone, password }),
      });
      const data = await res.json();
      if (data.success && data.data?.token && data.data?.user) {
        applySession(data.data.token, data.data.user);
        return { success: true, message: data.message || "Đăng ký thành công" };
      }
      return { success: false, message: data.message || "Đăng ký thất bại" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Không thể kết nối máy chủ. Vui lòng thử lại." };
    }
  };

  const logout = () => clearSession();

  const updateProfile = async (fullName: string, phone: string) => {
    if (!token) return { success: false, message: "Bạn chưa đăng nhập" };
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ full_name: fullName, phone }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        return { success: true, message: data.message || "Cập nhật thành công" };
      }
      return { success: false, message: data.message || "Cập nhật thất bại" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Không thể cập nhật hồ sơ" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
