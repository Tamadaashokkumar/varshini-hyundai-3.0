"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Home,
  Sun,
  Moon,
  Fingerprint,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import apiClient from "@/services/apiClient"; // setAccessToken తొలగించబడింది
import { useStore } from "@/store/useStore";

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const blobAnimation = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.6, 0.3],
    rotate: [0, 90, 0],
  },
  transition: { duration: 15, repeat: Infinity, ease: "linear" },
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false); // లోడింగ్ కోసం

  const { login, loading, user, checkAuthStatus } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sessionExpired = searchParams.get("session_expired");
    if (sessionExpired) {
      toast.error("Your session has expired. Please login again.");
      router.replace("/login");
    }
  }, [searchParams, router]);

  // --- Helper Function: Sync Local Garage to DB ---
  // ✅ FIX: Token argument removed. Cookies are handled automatically.
  const syncLocalGarage = async () => {
    const localGarageData = localStorage.getItem("myGarage");

    if (localGarageData) {
      try {
        const parsedGarage = JSON.parse(localGarageData);

        // Backend కి కాల్ చేస్తాం (Cookies auto-send via withCredentials)
        await apiClient.post("/users/garage/sync", {
          localGarage: parsedGarage,
        });

        localStorage.removeItem("myGarage");
        toast.success("Your garage has been synced!");
      } catch (error) {
        console.error("Garage Sync Failed:", error);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    try {
      const googleToken = credentialResponse.credential;

      // 🔥 apiClient.post వాడటం వల్ల Cookies ఆటోమేటిక్ గా సెట్ అవుతాయి
      const response = await apiClient.post("/auth/google-login", {
        token: googleToken,
      });

      if (response.data.success) {
        const { user } = response.data.data;

        // 1. User Data ని Store లో సేవ్ చేయండి
        setUser(user);

        // 2. Garage Sync
        await syncLocalGarage();

        // 3. Redirect Logic
        if (user.phone === "0000000000") {
          toast.warning("⚠️ Action Required: Please update your phone number.");
          router.push("/profile");
        } else {
          toast.success(`Welcome back, ${user.name}!`);

          // Return URL ఉంటే అక్కడికి, లేకపోతే Home కి
          const returnUrl = searchParams.get("returnUrl") || "/";
          router.push(returnUrl);
        }
      }
    } catch (err: any) {
      console.error("🔴 Google Login Error:", err);
      const errorMsg = err.response?.data?.message || "Google Login Failed.";
      setError(errorMsg);
    }
  };

  const handleGoogleError = () => {
    setError("Google Login Failed. Please try again.");
  };

  useEffect(() => {
    if (user) {
      const returnUrl = searchParams.get("returnUrl") || "/";
      router.replace(returnUrl);
    }
  }, [user, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login(formData);

      if (result.success) {
        // లాగిన్ సక్సెస్ అయితే గ్యారేజ్ సింక్ చేసి హోమ్ కి వెళ్తాం
        await syncLocalGarage();
        const returnUrl = searchParams.get("returnUrl") || "/";
        router.push(returnUrl);
      } else {
        console.log(result.error);
        // 🔥 ఇక్కడ result.error లో బ్యాకెండ్ పంపిన "Please verify your email..." మెసేజ్ ఉంటుంది
        setError(result.error || "Invalid credentials.");
        if (result.error?.toLowerCase().includes("verify")) {
          setShowResend(true);
        }
      }
    } catch (err) {
      setError("Connection failed. Please check your network.");
    }
  };

  const handleResendLink = async () => {
    setResending(true);
    try {
      const res = await apiClient.post("/auth/resend-verification", {
        email: formData.email,
      });
      if (res.data.success) {
        toast.success("Verification link sent! Check your inbox.");
        setShowResend(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send link.");
    } finally {
      setResending(false);
    }
  };

  if (!mounted) return null;
  // If user is already logged in, the useEffect redirects them,
  // but we can return null here to prevent flash of login content.
  if (user) return null;

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <div
        className={`min-h-screen w-full flex items-center justify-center p-4 lg:p-8 relative overflow-hidden transition-colors duration-700 font-sans ${
          isDarkMode ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* ================= BACKGROUND AMBIENCE ================= */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid Texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Animated Blobs */}
          {isDarkMode && (
            <>
              <motion.div
                animate={blobAnimation.animate}
                transition={blobAnimation.transition}
                className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px]"
              />
              <motion.div
                animate={blobAnimation.animate}
                transition={{ ...blobAnimation.transition, delay: 5 }}
                className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[150px]"
              />
            </>
          )}
        </div>

        {/* ================= NAVBAR ================= */}
        <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <span className="font-bold text-xl">V</span>
            </div>
            <span className="hidden md:block text-lg font-bold tracking-tight">
              VARSHINI <span className="text-blue-500">HYUNDAI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-full transition-all border ${
                isDarkMode
                  ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm"
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/">
              <button
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  isDarkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <Home size={16} />{" "}
                <span className="hidden sm:inline">Home</span>
              </button>
            </Link>
          </div>
        </nav>

        {/* ================= MAIN CARD ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full max-w-[1000px] min-h-[450px] grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-2xl relative z-10 border transition-all duration-500 ${
            isDarkMode
              ? "bg-[#0a0a0a]/60 backdrop-blur-3xl border-white/10 shadow-black/60"
              : "bg-white/80 backdrop-blur-2xl border-white/60 shadow-blue-200/40"
          }`}
        >
          {/* ================= LEFT SIDE (IMAGE) ================= */}
          <div className="relative hidden lg:flex flex-col justify-between p-6 overflow-hidden group">
            {/* Dynamic Background */}
            <div
              className={`absolute inset-0 transition-colors duration-500 ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-900/30 via-[#050505] to-[#050505]"
                  : "bg-gradient-to-br from-blue-100 via-white to-white"
              }`}
            />

            {/* Decorative Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors duration-700" />

            {/* Content */}
            <div className="relative z-10">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md mb-6 ${
                  isDarkMode
                    ? "bg-white/10 border-white/10 text-blue-200"
                    : "bg-white/60 border-blue-100 text-blue-800 shadow-sm"
                }`}
              >
                <Sparkles size={12} /> Genuine Parts
              </div>
              <h2
                className={`text-3xl font-black leading-tight mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Drive with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                  Confidence.
                </span>
              </h2>
              <p
                className={`text-lg max-w-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Access thousands of genuine Hyundai spare parts with just a few
                clicks.
              </p>
            </div>

            {/* Car Image */}
            <div className="relative z-10 mt-auto flex justify-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <Image
                  src="/images/cretapng.png"
                  alt="Hyundai Creta"
                  width={600}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-in-out"
                  priority
                />
              </motion.div>
            </div>

            {/* Features */}
            <div className="relative z-10 flex gap-6 mt-8">
              {["Fast Delivery", "Secure Payment", "24/7 Support"].map(
                (feat, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <CheckCircle2 size={14} className="text-blue-500" /> {feat}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* ================= RIGHT SIDE (FORM) ================= */}
          <div
            className={`flex flex-col justify-center p-6 lg:p-8 transition-colors duration-500 ${
              isDarkMode ? "bg-transparent" : "bg-white/50"
            }`}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="max-w-md w-full mx-auto"
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center mb-10">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-6">
                  <Fingerprint size={28} strokeWidth={1.5} />
                </div>
                <h1
                  className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Welcome Back
                </h1>
                <p
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Please enter your details to sign in.
                </p>
              </motion.div>

              {/* Error Message */}
              {/* Error Message & Resend Button */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="shrink-0" size={18} />
                      <p>{error}</p>
                    </div>

                    {/* 🔥 NEW: Resend Link Button */}
                    {showResend && (
                      <button
                        type="button"
                        onClick={handleResendLink}
                        disabled={resending}
                        className="mt-3 ml-7 text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 underline transition-all flex items-center gap-2"
                      >
                        {resending ? "Sending..." : "Resend Verification Link?"}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail
                        className={`h-5 w-5 transition-colors ${isDarkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-blue-500"}`}
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@example.com"
                      className={`block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border-2 outline-none transition-all duration-300 font-medium ${
                        isDarkMode
                          ? "bg-white/5 border-white/5 text-white placeholder-gray-600 focus:bg-white/10 focus:border-blue-500/50"
                          : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500"
                      }`}
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label
                      className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className={`h-5 w-5 transition-colors ${isDarkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-blue-500"}`}
                      />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className={`block w-full pl-11 pr-12 py-2.5 text-sm rounded-xl border-2 outline-none transition-all duration-300 font-medium ${
                        isDarkMode
                          ? "bg-white/5 border-white/5 text-white placeholder-gray-600 focus:bg-white/10 focus:border-blue-500/50"
                          : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 transform active:scale-[0.98]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Sign In <ArrowRight size={18} />
                        </>
                      )}
                    </span>
                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  </button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`w-full border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
                  />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span
                    className={`px-4 ${isDarkMode ? "bg-[#0d121f] text-gray-500" : "bg-white text-gray-400"}`}
                  >
                    Or continue with
                  </span>
                </div>
              </motion.div>

              {/* Google Button */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center min-h-[45px]"
              >
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme={isDarkMode ? "filled_black" : "outline"}
                    shape="pill"
                    size="large"
                    text="continue_with"
                  />
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div variants={itemVariants} className="mt-8 text-center">
                <p
                  className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                >
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <div
          className={`absolute bottom-4 left-0 w-full text-center text-[10px] uppercase tracking-widest font-medium opacity-50 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          <span className="mx-2 hover:opacity-100 cursor-pointer transition-opacity">
            Privacy Policy
          </span>{" "}
          •
          <span className="mx-2 hover:opacity-100 cursor-pointer transition-opacity">
            Terms of Service
          </span>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
