// // src/hooks/useAuth.ts
// import { useState, useEffect, useCallback, useRef } from "react";
// import { useStore } from "@/store/useStore";
// // 🔥 1. setAccessToken ని import చేసాను
// import apiClient, { setAccessToken } from "@/services/apiClient";
// import socketService from "@/services/socketService";
// import toast from "react-hot-toast";

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// interface RegisterData {
//   name: string;
//   email: string;
//   password: string;
//   phone: string;
// }

// export const useAuth = () => {
//   const { user, setUser, logout: logoutStore } = useStore();
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);

//   // Ref helps to prevent double execution in React Strict Mode
//   const isChecking = useRef(false);

//   // ==================== CHECK AUTH STATUS ON MOUNT ====================
//   const checkAuthStatus = useCallback(async () => {
//     if (isChecking.current) return;
//     isChecking.current = true;

//     try {
//       // Backend ని అడుగుతాం: "నేను ఎవరు?" (Cookie ఆధారంగా)
//       // ఇక్కడ 401 వస్తే, Interceptor ఆటోమేటిక్‌గా Refresh Token ద్వారా కొత్త Access Token తెస్తుంది.
//       const response = await apiClient.get("/auth/profile");

//       if (response.data.success) {
//         const userData = response.data.data.user;
//         setUser(userData);
//         socketService.connect();
//       }
//     } catch (error: any) {
//       // కుక్కీ లేకపోతే (లేదా Expire అయితే) యూజర్ ని null చేస్తాం
//       setUser(null);
//     } finally {
//       setLoading(false);
//       setAuthChecked(true);
//       isChecking.current = false;
//     }
//   }, [setUser]);

//   useEffect(() => {
//     if (user) {
//       setAuthChecked(true);
//       setLoading(false);
//       return;
//     }

//     if (!isChecking.current) {
//       checkAuthStatus();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==================== LOGIN ====================
//   const login = async (credentials: LoginCredentials) => {
//     setLoading(true);
//     try {
//       const response = await apiClient.post("/auth/login", credentials);

//       if (response.data.success) {
//         // Backend నుండి User Data మరియు Access Token వస్తాయి
//         const { user: userData, accessToken } = response.data.data;

//         // 🔥 2. Access Token ని మెమరీలో సేవ్ చేస్తున్నాం (ముఖ్యమైన స్టెప్)
//         setAccessToken(accessToken);

//         setUser(userData);
//         socketService.connect();

//         toast.success(`Welcome back, ${userData.name}!`);
//         return { success: true, user: userData };
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || // Backend error formatting బట్టి
//         error.response?.data?.error ||
//         "Login failed. Please try again.";
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== REGISTER ====================
//   const register = async (data: RegisterData) => {
//     setLoading(true);
//     try {
//       const response = await apiClient.post("/auth/register", data);

//       if (response.data.success) {
//         const { user: userData, accessToken } = response.data.data;

//         // 🔥 3. Access Token ని మెమరీలో సేవ్ చేస్తున్నాం
//         setAccessToken(accessToken);

//         setUser(userData);
//         socketService.connect();

//         toast.success(
//           `Welcome, ${userData.name}! Your account has been created.`,
//         );
//         return { success: true, user: userData };
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         "Registration failed.";
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== LOGOUT ====================
//   const logout = async () => {
//     setLoading(true);
//     try {
//       // Backend కి కాల్ చేసి HttpOnly Cookie ని క్లియర్ చేస్తాం
//       await apiClient.post("/auth/logout");
//     } catch (error) {
//       // Logout error ని ఇగ్నోర్ చేయచ్చు
//     } finally {
//       // 🔥 4. లోకల్ మెమరీ క్లియర్
//       setAccessToken(null);
//       logoutStore(); // Zustand store క్లియర్
//       socketService.disconnect();

//       toast.success("You have been logged out");
//       setLoading(false);

//       if (typeof window !== "undefined") {
//         window.location.href = "/login";
//       }
//     }
//   };

//   // ==================== UPDATE PROFILE ====================
//   const updateProfile = async (data: Partial<RegisterData>) => {
//     setLoading(true);
//     try {
//       const response = await apiClient.put("/auth/profile", data);
//       if (response.data.success) {
//         const updatedUser = response.data.data.user;
//         setUser(updatedUser);
//         toast.success("Profile updated successfully");
//         return { success: true, user: updatedUser };
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.error || "Failed to update profile";
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== CHANGE PASSWORD ====================
//   const changePassword = async (oldPassword: string, newPassword: string) => {
//     setLoading(true);
//     try {
//       const response = await apiClient.put("/auth/change-password", {
//         currentPassword: oldPassword,
//         newPassword,
//       });

//       if (response.data.success) {
//         toast.success("Password changed. Please login again.");
//         setTimeout(() => logout(), 2000);
//         return { success: true };
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.error || "Failed to change password";
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     authChecked,
//     login,
//     register,
//     logout,
//     updateProfile,
//     changePassword,
//     checkAuthStatus,
//   };
// };

import { useState, useCallback, useRef } from "react";
import { useStore } from "@/store/useStore";
import apiClient, { setAccessToken } from "@/services/apiClient";
import socketService from "@/services/socketService";
import toast from "react-hot-toast";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export const useAuth = () => {
  const { user, setUser, logout: logoutStore } = useStore();
  const [loading, setLoading] = useState(false); // 🔥 Default false ఉండాలి
  const [authChecked, setAuthChecked] = useState(false);

  // Ref helps to prevent double execution in React Strict Mode
  const isChecking = useRef(false);

  // ==================== CHECK AUTH STATUS ====================
  // ఇది AuthProvider నుండి మాత్రమే కాల్ అవ్వాలి
  const checkAuthStatus = useCallback(async () => {
    if (isChecking.current) return;

    isChecking.current = true;
    // గమనిక: ఇక్కడ setLoading(true) పెట్టకండి, ఎందుకంటే ఇది బ్యాక్‌గ్రౌండ్ లో జరగాలి.
    // లాగిన్ పేజీలో బటన్ తిరగకూడదు.

    try {
      // 🔥 No Headers here. Let interceptor handle 401.
      const response = await apiClient.get("/auth/profile");

      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        socketService.connect();
      }
    } catch (error: any) {
      setUser(null);
    } finally {
      setAuthChecked(true);
      isChecking.current = false;
    }
  }, [setUser]);

  // ❌❌❌ DELETE THIS SECTION ❌❌❌
  // useEffect(() => { ... })  <-- ఈ useEffect వల్లే మీకు లూప్ వస్తుంది. దీన్ని తీసేయండి.
  // ❌❌❌ DELETE THIS SECTION ❌❌❌

  // ==================== LOGIN ====================
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login", credentials);

      if (response.data.success) {
        const { user: userData, accessToken } = response.data.data;

        setAccessToken(accessToken);
        setUser(userData);
        socketService.connect();

        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ==================== REGISTER ====================
  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/register", data);

      if (response.data.success) {
        const { user: userData, accessToken } = response.data.data;

        setAccessToken(accessToken);
        setUser(userData);
        socketService.connect();

        toast.success(
          `Welcome, ${userData.name}! Your account has been created.`,
        );
        return { success: true, user: userData };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed.";
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
      console.error("Logout failed", error);
    } finally {
      setAccessToken(null);
      logoutStore();
      socketService.disconnect();

      toast.success("You have been logged out");
      setLoading(false);

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  // ==================== UPDATE PROFILE ====================
  const updateProfile = async (data: Partial<RegisterData>) => {
    setLoading(true);
    try {
      const response = await apiClient.put("/auth/profile", data);
      if (response.data.success) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        toast.success("Profile updated successfully");
        return { success: true, user: updatedUser };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to update profile";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ==================== CHANGE PASSWORD ====================
  const changePassword = async (oldPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      const response = await apiClient.put("/auth/change-password", {
        currentPassword: oldPassword,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed. Please login again.");
        setTimeout(() => logout(), 2000);
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to change password";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    authChecked,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus,
  };
};
