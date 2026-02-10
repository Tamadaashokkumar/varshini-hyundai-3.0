// // src/services/apiClient.ts
// import axios, {
//   AxiosInstance,
//   AxiosError,
//   InternalAxiosRequestConfig,
//   AxiosResponse,
// } from "axios";

// // NOTE: We don't use Cookies.get() for tokens anymore because
// // Refresh Token is HttpOnly (cannot be accessed by JS)
// // Access Token is stored in memory (currentAccessToken variable)

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// // ==================== STATE VARIABLES ====================
// // Store Access Token in memory (Most Secure)
// let currentAccessToken: string | null = null;

// // Prevent multiple simultaneous refresh requests
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value?: any) => void;
//   reject: (reason?: any) => void;
// }> = [];

// // Process queued requests after token refresh
// const processQueue = (error: any = null, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// // ==================== AXIOS INSTANCE ====================
// const apiClient: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // 🔥 CRITICAL: Sends HttpOnly Cookies to Backend
// });

// // ==================== REQUEST INTERCEPTOR ====================
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // Attach Access Token from Memory if available
//     if (currentAccessToken && config.headers) {
//       config.headers.Authorization = `Bearer ${currentAccessToken}`;
//     }

//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   },
// );

// // ==================== RESPONSE INTERCEPTOR ====================
// // ==================== RESPONSE INTERCEPTOR ====================
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     // ========== HANDLE 401 UNAUTHORIZED ==========
//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry
//     ) {
//       // 🔥 FIX: Skip Refresh for Silent Checks
//       // checkAuthStatus నుండి వచ్చే కాల్స్ ని రిఫ్రెష్ చేయొద్దు
//       if (
//         originalRequest.headers &&
//         originalRequest.headers["x-skip-refresh"]
//       ) {
//         return Promise.reject(error);
//       }
//       // 🛑 SCENARIO 1: If the failing request ITSELF was a "refresh-token" call
//       // It means the Refresh Token in the cookie is invalid/expired/missing.
//       if (originalRequest.url?.includes("/auth/refresh-token")) {
//         console.error("❌ [AUTH] Refresh token failed/expired");

//         // Clear Memory
//         setAccessToken(null);

//         // 🔥 FIX: Stop Infinite Loop
//         // మనం ఆల్రెడీ లాగిన్ లేదా రిజిస్టర్ పేజీలో ఉంటే, పేజీని రీలోడ్ చేయొద్దు.
//         if (typeof window !== "undefined") {
//           const path = window.location.pathname;
//           if (path !== "/login" && path !== "/register" && path !== "/signup") {
//             window.location.href = "/login?session_expired=true";
//           }
//         }

//         return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       // ========== QUEUE MANAGEMENT ==========
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//             }
//             return apiClient(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       // ========== START TOKEN REFRESH ==========
//       isRefreshing = true;

//       try {
//         // 🔥 Call Refresh Endpoint
//         const response = await axios.post(
//           `${API_BASE_URL}/auth/refresh-token`,
//           {},
//           { withCredentials: true }, // Must be true to send cookie
//         );

//         const { accessToken } = response.data.data;

//         if (!accessToken) {
//           throw new Error("No access token returned");
//         }

//         // Save new Access Token in Memory
//         setAccessToken(accessToken);

//         // Update Authorization header for the failed request
//         if (originalRequest.headers) {
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         }

//         // Retry all queued requests
//         processQueue(null, accessToken);

//         // Retry original request
//         return apiClient(originalRequest);
//       } catch (refreshError: any) {
//         // 🛑 SCENARIO 2: If the Refresh Process Fails (Network error, or 400/401 from server)

//         processQueue(refreshError, null);
//         setAccessToken(null);

//         // 🔥 FIX: Stop Infinite Loop here as well
//         if (typeof window !== "undefined") {
//           const path = window.location.pathname;
//           if (path !== "/login" && path !== "/register" && path !== "/signup") {
//             window.location.href = "/login?session_expired=true";
//           }
//         }

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// // ==================== HELPER FUNCTIONS ====================

// /**
//  * Set the Access Token in Memory
//  * (Call this after Login/Register)
//  */
// export const setAccessToken = (token: string | null) => {
//   currentAccessToken = token;
// };

// /**
//  * Get current Access Token
//  */
// export const getAccessToken = () => currentAccessToken;

// /**
//  * Check if we have an access token in memory
//  * (Note: Even if false, the HttpOnly cookie might still be valid on server)
//  */
// export const isAuthenticated = () => !!currentAccessToken;

// export default apiClient;

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// NOTE: We don't use Cookies.get() for tokens anymore because
// Refresh Token is HttpOnly (cannot be accessed by JS)
// Access Token is stored in memory (currentAccessToken variable)

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ==================== STATE VARIABLES ====================
// Store Access Token in memory (Most Secure)
let currentAccessToken: string | null = null;

// Prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ==================== AXIOS INSTANCE ====================
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 CRITICAL: Sends HttpOnly Cookies to Backend
});

// ==================== REQUEST INTERCEPTOR ====================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach Access Token from Memory if available
    if (currentAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ==================== RESPONSE INTERCEPTOR ====================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // ========== HANDLE 401 UNAUTHORIZED ==========
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // Custom header to bypass interceptor logic explicitly if needed
      if (originalRequest.headers?.["x-skip-refresh"]) {
        return Promise.reject(error);
      }

      // 🛑 SCENARIO 1: Refresh Token API itself failed
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        setAccessToken(null);
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // ========== QUEUEING ==========
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // ========== START REFRESH ==========
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const accessToken =
          response.data?.accessToken || response.data?.data?.accessToken;

        if (!accessToken) throw new Error("No access token returned");

        setAccessToken(accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // 🛑 SCENARIO 2: Refresh Failed (Session Expired)
        // Clear queue and local token
        processQueue(refreshError, null);
        setAccessToken(null);

        // 🔥 THE PROFESSIONAL LOGIC (Guest Fallback)
        // Instead of redirecting immediately, we remove the token and
        // retry the request as a "Guest User".

        try {
          if (originalRequest.headers) {
            delete originalRequest.headers.Authorization;
          }

          // Retry the request WITHOUT token
          return await apiClient(originalRequest);
        } catch (guestError: any) {
          // 🚨 FINAL DECISION POINT 🚨

          // If the Guest Retry ALSO fails with 401, it means:
          // "This API endpoint strictly requires a token, and you don't have one."
          // THIS is when we redirect.

          if (
            guestError.response?.status === 401 &&
            typeof window !== "undefined"
          ) {
            const currentPath = window.location.pathname;

            // Prevent redirect loops
            const isProtectedRoute =
              currentPath.startsWith("/profile") ||
              currentPath.startsWith("/orders") ||
              currentPath.startsWith("/checkout") ||
              currentPath.startsWith("/wishlist") ||
              currentPath.startsWith("/admin") ||
              currentPath.startsWith("/chat");

            if (isProtectedRoute) {
              // యూజర్ ప్రైవేట్ పేజీలో ఉన్నాడు, కాబట్టి లాగిన్ కి నెట్టేయాలి
              window.location.href = "/login?session_expired=true";
            }
          }

          // If error is 404 (Not Found) or 500 (Server Error), pass it to UI
          // Don't redirect for those.
          return Promise.reject(guestError);
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     // ========== HANDLE 401 UNAUTHORIZED ==========
//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry
//     ) {
//       // 1. Skip if specifically requested
//       if (originalRequest.headers?.["x-skip-refresh"]) {
//         return Promise.reject(error);
//       }

//       // 2. If Refresh Token API itself failed
//       if (originalRequest.url?.includes("/auth/refresh-token")) {
//         setAccessToken(null);
//         // 🔥 NO REDIRECT: Just fail.
//         return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       // 3. Queue Logic
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//             }
//             return apiClient(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       // 4. Start Refresh Process
//       isRefreshing = true;

//       try {
//         const response = await axios.post(
//           `${API_BASE_URL}/auth/refresh-token`,
//           {},
//           { withCredentials: true },
//         );

//         const accessToken =
//           response.data?.accessToken || response.data?.data?.accessToken;

//         if (!accessToken) throw new Error("No access token returned");

//         setAccessToken(accessToken);

//         if (originalRequest.headers) {
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         }

//         processQueue(null, accessToken);
//         return apiClient(originalRequest);
//       } catch (refreshError: any) {
//         // 🛑 Refresh Failed (Session Expired)
//         processQueue(refreshError, null);
//         setAccessToken(null);

//         // 🔥 GUEST FALLBACK: Try without token
//         try {
//           if (originalRequest.headers) {
//             delete originalRequest.headers.Authorization;
//           }
//           return await apiClient(originalRequest);
//         } catch (guestError: any) {
//           // 🔥 FINAL CHANGE: NO REDIRECTS AT ALL.
//           // ఇక్కడ గతంలో window.location.href ఉండేది. దాన్ని తీసేసాను.
//           // ఇప్పుడు కేవలం ఎర్రర్ రిటర్న్ అవుతుంది. మీ పేజీ అలాగే ఉంటుంది.
//           return Promise.reject(guestError);
//         }
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// ==================== HELPER FUNCTIONS ====================

/**
 * Set the Access Token in Memory
 * (Call this after Login/Register)
 */
export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

/**
 * Get current Access Token
 */
export const getAccessToken = () => currentAccessToken;

/**
 * Check if we have an access token in memory
 * (Note: Even if false, the HttpOnly cookie might still be valid on server)
 */
export const isAuthenticated = () => !!currentAccessToken;

export default apiClient;
