import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";

const AuthContext = createContext();

function normalizeUser(user) {
  if (!user) return null;
  return { ...user, id: user.id || user._id };
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    const saved = localStorage.getItem("sms_user");
    return saved ? normalizeUser(JSON.parse(saved)) : null;
  });

  const setUser = (u, token) => {
    const normalized = normalizeUser(u);
    setUserState(normalized);
    if (normalized) localStorage.setItem("sms_user", JSON.stringify(normalized));
    else localStorage.removeItem("sms_user");
    if (token) localStorage.setItem("sms_token", token);
  };

  const refreshProfile = async () => {
    const res = await api.get("/auth/profile");
    setUser(res.data);
    return normalizeUser(res.data);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user, res.data.token);
    toast.success("Login successful");
    return true;
  };

  const signup = async (payload) => {
    await api.post("/auth/register", payload);
    toast.success("Account created successfully");
    return true;
  };

  const forgotPassword = async (email, answer, newPassword) => {
    await api.post("/auth/forgot", { email, answer, newPassword });
    toast.success("Password updated successfully");
    return true;
  };

  const logout = () => {
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_user");
    setUserState(null);
    toast.info("Logged out");
  };

  useEffect(() => {
    if (!localStorage.getItem("sms_token")) return;
    refreshProfile().catch(() => {});
  }, []);

  const can = useMemo(() => ({
    isSuperAdmin: user?.role === "superadmin",
    isAdminOrSuper: ["admin", "superadmin"].includes(user?.role),
    canDelete: user?.role === "superadmin",
    canWrite: ["admin", "superadmin"].includes(user?.role),
    canExport: ["admin", "superadmin"].includes(user?.role),
  }), [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, refreshProfile, login, signup, forgotPassword, logout, ...can }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
