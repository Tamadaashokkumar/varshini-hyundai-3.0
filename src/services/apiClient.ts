import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// ==================== TYPES ====================
// Axios Request Config కి _retry ప్రాపర్టీని యాడ్ చేస్తున్నాం
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedRequest {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

// ==================== CONFIGURATION ====================
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ==================== STATE VARIABLES ====================
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

/**
 * క్యూలో ఉన్న రిక్వెస్ట్‌లను ప్రాసెస్ చేసే ఫంక్షన్
 */
const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
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
  // 🔥 CRITICAL: ఇది ఉంటేనే Cookies (Access & Refresh) సర్వర్‌కి వెళ్తాయి
  withCredentials: true,
});

// ==================== REQUEST INTERCEPTOR ====================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // రిక్వెస్ట్ కాన్ఫిగ్ లేకపోతే లేదా ఎర్రర్ రెస్పాన్స్ లేకపోతే రిజెక్ట్ చేయి
    if (!originalRequest || !error.response) {
      console.log("❌ [Interceptor]: No Response or Config found", error);
      return Promise.reject(error);
    }
    console.log(
      `📡 [Interceptor]: Status ${error.response.status} from ${originalRequest.url}`,
    );
    if (error.response.status === 401 && !originalRequest._retry) {
      // 1. లూప్ నిరోధించడం (Loop Prevention)
      // check-session లేదా refresh-token కాల్స్ ఫెయిల్ అయితే మళ్ళీ ట్రై చేయకూడదు
      if (
        originalRequest.url?.includes("/auth/check-session") ||
        originalRequest.url?.includes("/auth/refresh-token")
      ) {
        console.log(
          "⚠️ [Interceptor]: Session check failed (401). Skipping refresh to avoid loop.",
        );
        // console.warn("[Interceptor]: Auth check failed, skipping retry.");
        return Promise.reject(error);
      }

      // 2. Queue Logic: ఇప్పటికే Refresh జరుగుతుంటే, ఈ రిక్వెస్ట్‌ని క్యూలో పెట్టాలి
      if (isRefreshing) {
        console.log(
          "⏳ [Interceptor]: Refresh already in progress, queuing this request...",
        );
        // console.log("[Interceptor]: Refresh in progress, queuing request...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // రిఫ్రెష్ అయ్యాక ఒరిజినల్ రిక్వెస్ట్ మళ్ళీ పంపుతున్నాం
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      console.log(
        "🔄 [Interceptor]: Access Token Expired. Attempting Refresh...",
      );
      // 3. Start Refresh Process
      originalRequest._retry = true;
      isRefreshing = true;
      // console.log("[Interceptor]: Token expired, starting refresh process...");

      try {
        // నేరుగా axios వాడి రిఫ్రెష్ చేయడం (apiClient వాడితే మళ్ళీ ఇక్కడికే వస్తుంది)
        await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );
        console.log("✅ [Interceptor]: Token Refreshed Successfully!");
        // console.log("[Interceptor]: Refresh successful. Retrying queued requests.");

        // Success! క్యూని క్లియర్ చేసి అందరినీ ముందుకు పంపు
        processQueue(null);

        // ఫెయిల్ అయిన ఒరిజినల్ రిక్వెస్ట్ ని మళ్ళీ పంపు
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error(
          "🔥 [Interceptor]: Refresh Token API Failed!",
          refreshError.response?.status,
        );
        // console.error("[Interceptor]: Refresh failed. Logging out user.");

        // క్యూలో ఉన్నవన్నీ రిజెక్ట్ చేయి
        processQueue(refreshError);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
