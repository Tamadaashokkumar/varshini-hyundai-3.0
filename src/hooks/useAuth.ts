import { useState, useCallback, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import apiClient from "@/services/apiClient";
import socketService from "@/services/socketService";
import toast from "react-hot-toast";

// ==================== INTERFACES ====================
export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  isActive?: boolean;
  garage?: any[];
  [key: string]: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
  };
  message?: string;
  isAuthenticated?: boolean; // ఇది ఆప్షనల్ గా మార్చాను
}

// ==================== HOOK START ====================
export const useAuth = () => {
  const {
    user,
    setUser,
    isAuthInitialized,
    setAuthInitialized,
    logout: logoutStore,
  } = useStore();

  // ఒకవేళ ఆల్రెడీ గ్లోబల్ గా చెక్ అయిపోతే లోడింగ్ అబద్ధం కావాలి
  const [loading, setLoading] = useState<boolean>(!isAuthInitialized);

  const isChecking = useRef<boolean>(false);

  // 🔥 NEW FUNCTION: Socket ని Token తో కనెక్ట్ చేయడానికి హెల్పర్ ఫంక్షన్
  const connectSocketWithToken = useCallback(async () => {
    try {
      // 1. Backend నుండి Token తెచ్చుకోవడం (Vercel Rewrite ద్వారా)
      const response = await apiClient.get("/auth/get-socket-token");

      if (response.data?.token) {
        console.log("[useAuth]: 🔌 Connecting socket with token...");

        socketService.connect(response.data.token);
        // 3. కనెక్షన్ స్టార్ట్ చేయడం
        socketService.connect();
      }
    } catch (error) {
      console.error("⚠️ [useAuth]: Failed to connect socket with token", error);
    }
  }, []);

  // ==================== CHECK AUTH STATUS ====================
  const checkAuthStatus = useCallback(async () => {
    if (isAuthInitialized || isChecking.current) {
      return;
    }

    console.log("[useAuth]: Checking session...");
    isChecking.current = true;
    setLoading(true);

    try {
      console.log("🔎 [useAuth]: Fetching check-session...");
      const response = await apiClient.get<AuthResponse>("/auth/check-session");

      // 🔥 FIX: isAuthenticated లేకపోయినా, success ఉండి యూజర్ డేటా ఉంటే లాగిన్ అయినట్లే!
      if (response.data.success && response.data.data?.user) {
        console.log(
          "[useAuth]: Session restored for:",
          response.data.data.user.email,
        );
        setUser(response.data.data.user as any);

        if (response.data.data.user?._id) {
          // socketService.connect();
          await connectSocketWithToken();
        }
      } else {
        console.log("[useAuth]: No valid session found.");
        setUser(null);
      }
    } catch (error: any) {
      console.error(
        "🚨 [useAuth]: Session Check Catch Block triggered!",
        error.response?.status,
      );
      console.error("[useAuth]: Auth check failed.");
      setUser(null);
    } finally {
      setAuthInitialized(true);
      setLoading(false);
      isChecking.current = false;
    }
  }, [setUser, isAuthInitialized, setAuthInitialized]);

  // పేజీ రీలోడ్ లేకుండా లేటెస్ట్ డేటాను సర్వర్ నుంచి తెచ్చి స్టోర్‌లో పెడుతుంది.
  const refreshUser = async () => {
    try {
      const response = await apiClient.get<AuthResponse>("/auth/check-session");
      if (response.data.success && response.data.data?.user) {
        console.log("Refreshing user data...");
        setUser(response.data.data.user as any); // Store Update
        return true;
      }
    } catch (error) {
      console.error("Failed to refresh user data", error);
    }
    return false;
  };

  useEffect(() => {
    if (!isAuthInitialized) {
      checkAuthStatus();
    }
  }, [isAuthInitialized, checkAuthStatus]);

  // ==================== LOGIN ====================
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials,
      );

      if (response.data.success && response.data.data?.user) {
        const userData = response.data.data.user;
        setUser(userData as any);
        setAuthInitialized(true);
        //socketService.connect();
        await connectSocketWithToken();
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, error: "Invalid response from server" };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ==================== REGISTER ====================
  const register = async (data: any) => {
    setLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        data,
      );

      if (response.data.success && response.data.data?.user) {
        const userData = response.data.data.user;
        setUser(userData as any);
        setAuthInitialized(true);
        //socketService.connect();
        await connectSocketWithToken();
        toast.success(`Welcome, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, error: "Registration failed" };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOGOUT ====================
  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      logoutStore();
      socketService.disconnect();
      toast.success("Logged out successfully");
      setLoading(false);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  // ==================== UPDATE PROFILE ====================
  const updateProfile = async (data: any) => {
    setLoading(true);
    try {
      const response = await apiClient.put<AuthResponse>("/auth/profile", data);
      if (response.data.success && response.data.data?.user) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser as any);
        toast.success("Profile updated!");
        return { success: true, user: updatedUser };
      }
      return { success: false, error: "Update failed" };
    } catch (error: any) {
      toast.error("Failed to update profile");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    authChecked: isAuthInitialized,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    refreshUser,
  };
};
