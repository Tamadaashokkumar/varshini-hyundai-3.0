// // import { useState, useCallback, useRef } from "react";
// // import { useStore } from "@/store/useStore";
// // import apiClient, { setAccessToken } from "@/services/apiClient";
// // import socketService from "@/services/socketService";
// // import toast from "react-hot-toast";

// // interface LoginCredentials {
// //   email: string;
// //   password: string;
// // }

// // interface RegisterData {
// //   name: string;
// //   email: string;
// //   password: string;
// //   phone: string;
// // }

// // export const useAuth = () => {
// //   const { user, setUser, logout: logoutStore } = useStore();
// //   const [loading, setLoading] = useState(false); // 🔥 Default false ఉండాలి
// //   const [authChecked, setAuthChecked] = useState(false);

// //   // Ref helps to prevent double execution in React Strict Mode
// //   const isChecking = useRef(false);

// //   // ==================== CHECK AUTH STATUS ====================
// //   // ఇది AuthProvider నుండి మాత్రమే కాల్ అవ్వాలి
// //   const checkAuthStatus = useCallback(async () => {
// //     if (isChecking.current) return;

// //     isChecking.current = true;
// //     // గమనిక: ఇక్కడ setLoading(true) పెట్టకండి, ఎందుకంటే ఇది బ్యాక్‌గ్రౌండ్ లో జరగాలి.
// //     // లాగిన్ పేజీలో బటన్ తిరగకూడదు.

// //     try {
// //       // 🔥 No Headers here. Let interceptor handle 401.
// //       const response = await apiClient.get("/auth/profile");

// //       if (response.data.success) {
// //         const userData = response.data.data.user;
// //         setUser(userData);
// //         socketService.connect();
// //       }
// //     } catch (error: any) {
// //       setUser(null);
// //     } finally {
// //       setAuthChecked(true);
// //       isChecking.current = false;
// //     }
// //   }, [setUser]);

// //   // ❌❌❌ DELETE THIS SECTION ❌❌❌
// //   // useEffect(() => { ... })  <-- ఈ useEffect వల్లే మీకు లూప్ వస్తుంది. దీన్ని తీసేయండి.
// //   // ❌❌❌ DELETE THIS SECTION ❌❌❌

// //   // ==================== LOGIN ====================
// //   const login = async (credentials: LoginCredentials) => {
// //     setLoading(true);
// //     try {
// //       const response = await apiClient.post("/auth/login", credentials);

// //       if (response.data.success) {
// //         const { user: userData, accessToken } = response.data.data;

// //         setAccessToken(accessToken);
// //         setUser(userData);
// //         socketService.connect();

// //         toast.success(`Welcome back, ${userData.name}!`);
// //         return { success: true, user: userData };
// //       }
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.data?.message ||
// //         error.response?.data?.error ||
// //         "Login failed. Please try again.";
// //       toast.error(errorMessage);
// //       return { success: false, error: errorMessage };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ==================== REGISTER ====================
// //   const register = async (data: RegisterData) => {
// //     setLoading(true);
// //     try {
// //       const response = await apiClient.post("/auth/register", data);

// //       if (response.data.success) {
// //         const { user: userData, accessToken } = response.data.data;

// //         setAccessToken(accessToken);
// //         setUser(userData);
// //         socketService.connect();

// //         toast.success(
// //           `Welcome, ${userData.name}! Your account has been created.`,
// //         );
// //         return { success: true, user: userData };
// //       }
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.data?.message ||
// //         error.response?.data?.error ||
// //         "Registration failed.";
// //       toast.error(errorMessage);
// //       return { success: false, error: errorMessage };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ==================== LOGOUT ====================
// //   const logout = async () => {
// //     setLoading(true);
// //     try {
// //       await apiClient.post("/auth/logout");
// //     } catch (error) {
// //       console.error("Logout failed", error);
// //     } finally {
// //       setAccessToken(null);
// //       logoutStore();
// //       socketService.disconnect();

// //       toast.success("You have been logged out");
// //       setLoading(false);

// //       if (typeof window !== "undefined") {
// //         window.location.href = "/login";
// //       }
// //     }
// //   };

// //   // ==================== UPDATE PROFILE ====================
// //   const updateProfile = async (data: Partial<RegisterData>) => {
// //     setLoading(true);
// //     try {
// //       const response = await apiClient.put("/auth/profile", data);
// //       if (response.data.success) {
// //         const updatedUser = response.data.data.user;
// //         setUser(updatedUser);
// //         toast.success("Profile updated successfully");
// //         return { success: true, user: updatedUser };
// //       }
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.data?.error || "Failed to update profile";
// //       toast.error(errorMessage);
// //       return { success: false, error: errorMessage };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ==================== CHANGE PASSWORD ====================
// //   const changePassword = async (oldPassword: string, newPassword: string) => {
// //     setLoading(true);
// //     try {
// //       const response = await apiClient.put("/auth/change-password", {
// //         currentPassword: oldPassword,
// //         newPassword,
// //       });

// //       if (response.data.success) {
// //         toast.success("Password changed. Please login again.");
// //         setTimeout(() => logout(), 2000);
// //         return { success: true };
// //       }
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.data?.error || "Failed to change password";
// //       toast.error(errorMessage);
// //       return { success: false, error: errorMessage };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return {
// //     user,
// //     loading,
// //     isAuthenticated: !!user,
// //     authChecked,
// //     login,
// //     register,
// //     logout,
// //     updateProfile,
// //     changePassword,
// //     checkAuthStatus,
// //   };
// // };

// import { useState, useCallback, useRef } from "react";
// import { useStore } from "@/store/useStore";
// import apiClient, { setAccessToken } from "@/services/apiClient";
// import socketService from "@/services/socketService";
// import toast from "react-hot-toast";

// // Typescript వాడితేనే ఇవి ఉంచండి, లేకపోతే తీసేయండి

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
//   const [loading, setLoading] = useState(false);
//   const [authChecked, setAuthChecked] = useState(false);

//   // Ref to prevent double execution in Strict Mode
//   const isChecking = useRef(false);

//   // ==================== CHECK AUTH STATUS ====================
//   // This is called by AuthProvider on initial load
//   const checkAuthStatus = useCallback(async () => {
//     // Prevent duplicate calls
//     if (isChecking.current) return;
//     isChecking.current = true;

//     try {
//       // 🔥 NEW: Call the dedicated session check endpoint
//       // This is faster because it handles token refresh + user data in ONE go.
//       const response = await apiClient.get("/auth/check-session");

//       if (response.data.success && response.data.isAuthenticated) {
//         const { user: userData, accessToken } = response.data.data;

//         // 1. Set new Access Token in Memory
//         setAccessToken(accessToken);

//         // 2. Set User Data in Store
//         setUser(userData);

//         // 3. Connect Socket immediately
//         if (userData?._id) {
//           socketService.connect();
//         }
//       } else {
//         // Session expired or invalid -> Guest Mode
//         setUser(null);
//         setAccessToken(null);
//       }
//     } catch (error) {
//       // Network error or Server error -> Guest Mode
//       console.log("Session check failed (Guest Mode):", error.message);
//       setUser(null);
//       setAccessToken(null);
//     } finally {
//       setAuthChecked(true);
//       isChecking.current = false;
//     }
//   }, [setUser]);

//   // ==================== LOGIN ====================
//   const login = async (credentials) => {
//     setLoading(true);
//     try {
//       const response = await apiClient.post("/auth/login", credentials);

//       if (response.data.success) {
//         const { user: userData, accessToken } = response.data.data;

//         setAccessToken(accessToken);
//         setUser(userData);
//         socketService.connect();

//         toast.success(`Welcome back, ${userData.name}!`);
//         return { success: true, user: userData };
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         "Login failed. Please try again.";
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== REGISTER ====================
//   const register = async (data) => {
//     setLoading(true);
//     try {
//       const response = await apiClient.post("/auth/register", data);

//       if (response.data.success) {
//         const { user: userData, accessToken } = response.data.data;

//         setAccessToken(accessToken);
//         setUser(userData);
//         socketService.connect();

//         toast.success(`Welcome, ${userData.name}!`);
//         return { success: true, user: userData };
//       }
//     } catch (error) {
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
//       await apiClient.post("/auth/logout");
//     } catch (error) {
//       console.error("Logout failed", error);
//     } finally {
//       setAccessToken(null);
//       logoutStore();
//       socketService.disconnect();

//       toast.success("You have been logged out");
//       setLoading(false);

//       if (typeof window !== "undefined") {
//         window.location.href = "/login";
//       }
//     }
//   };

//   // ==================== UPDATE PROFILE ====================
//   const updateProfile = async (data) => {
//     setLoading(true);
//     try {
//       const response = await apiClient.put("/auth/profile", data);
//       if (response.data.success) {
//         const updatedUser = response.data.data.user;
//         setUser(updatedUser);
//         toast.success("Profile updated successfully");
//         return { success: true, user: updatedUser };
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.error || "Failed to update profile";
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== CHANGE PASSWORD ====================
//   const changePassword = async (oldPassword, newPassword) => {
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
//     } catch (error) {
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
// మీ store ఫైల్ పాత్ కరెక్ట్ గా ఉందో లేదో చూసుకోండి
import { useStore } from "@/store/useStore";
import apiClient, { setAccessToken } from "@/services/apiClient";
import socketService from "@/services/socketService";
import toast from "react-hot-toast";

// ==================== INTERFACES (TYPES) ====================

// ✅ FIX: Store కి 'id' కావాలి, MongoDB కి '_id' కావాలి. రెండూ ఇక్కడ పెట్టాం.
export interface User {
  _id: string;
  id?: string; // Store compatibility కోసం Optional గా పెట్టాం (లేదా any వాడొచ్చు)
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  isActive?: boolean;
  garage?: any[];
  [key: string]: any; // Extra properties ఏవైనా ఉంటే ఎర్రర్ రాకుండా
}

// 2. Login Data Type
export interface LoginCredentials {
  email: string;
  password: string;
}

// 3. Register Data Type
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

// 4. API Response Structure
interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
  };
  message?: string;
  error?: string;
}

// ==================== HOOK START ====================

export const useAuth = () => {
  const { user, setUser, logout: logoutStore } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Ref to prevent double execution in Strict Mode
  const isChecking = useRef<boolean>(false);

  // ==================== CHECK AUTH STATUS ====================
  const checkAuthStatus = useCallback(async () => {
    if (isChecking.current) return;
    isChecking.current = true;

    try {
      const response = await apiClient.get<AuthResponse>("/auth/check-session");

      if (response.data.success && response.data.data) {
        const { user: userData, accessToken } = response.data.data;

        setAccessToken(accessToken);

        // ✅ FIX: TypeScript ఎర్రర్ రాకుండా 'as any' వాడుతున్నాం
        // ఎందుకంటే Backend '_id' ఇస్తుంది, Store 'id' అడుగుతుంది.
        setUser(userData as any);

        if (userData?._id) {
          socketService.connect();
        }
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch (error: any) {
      console.log("Session check failed (Guest Mode):", error.message);
      setUser(null);
      setAccessToken(null);
    } finally {
      setAuthChecked(true);
      isChecking.current = false;
    }
  }, [setUser]);

  // ==================== LOGIN ====================
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials,
      );

      if (response.data.success) {
        const { user: userData, accessToken } = response.data.data;

        setAccessToken(accessToken);

        // ✅ FIX: Type Casting
        setUser(userData as any);

        socketService.connect();

        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, error: "Login failed" };
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
      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        data,
      );

      if (response.data.success) {
        const { user: userData, accessToken } = response.data.data;

        setAccessToken(accessToken);

        // ✅ FIX: Type Casting
        setUser(userData as any);

        socketService.connect();

        toast.success(`Welcome, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, error: "Registration failed" };
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
      const response = await apiClient.put<AuthResponse>("/auth/profile", data);
      if (response.data.success) {
        const updatedUser = response.data.data.user;

        // ✅ FIX: Type Casting
        setUser(updatedUser as any);

        toast.success("Profile updated successfully");
        return { success: true, user: updatedUser };
      }
      return { success: false, error: "Update failed" };
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
      return { success: false, error: "Change password failed" };
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
