// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "@/hooks/useAuth";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   AlertCircle,
//   ArrowRight,
//   Sparkles,
//   CheckCircle2,
//   Home,
//   Sun,
//   Moon,
//   Fingerprint,
// } from "lucide-react";
// import Image from "next/image";
// import { toast } from "sonner";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import apiClient from "@/services/apiClient";
// import { useStore } from "@/store/useStore";

// // --- Enhanced Animations ---
// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.12, delayChildren: 0.2 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { type: "spring", stiffness: 90, damping: 14 },
//   },
// };

// const blobAnimation = {
//   animate: {
//     scale: [1, 1.15, 1],
//     opacity: [0.15, 0.4, 0.15],
//     rotate: [0, 180, 360],
//   },
//   transition: { duration: 25, repeat: Infinity, ease: "linear" },
// };

// // 🔥 FIX: 1. Main లాజిక్ మొత్తాన్ని LoginContent అనే ఇన్నర్ కంపోనెంట్ లోకి మార్చాము
// function LoginContent() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState<string | null>(null);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [showResend, setShowResend] = useState(false);
//   const [resending, setResending] = useState(false);

//   const { login, loading, user } = useAuth();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { setUser } = useStore();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     const sessionExpired = searchParams.get("session_expired");
//     if (sessionExpired) {
//       toast.error("Your session has expired. Please login again.");
//       router.replace("/login");
//     }
//   }, [searchParams, router]);

//   const syncLocalGarage = async () => {
//     const localGarageData = localStorage.getItem("myGarage");

//     if (localGarageData) {
//       try {
//         const parsedGarage = JSON.parse(localGarageData);
//         await apiClient.post("/users/garage/sync", {
//           localGarage: parsedGarage,
//         });
//         localStorage.removeItem("myGarage");
//         toast.success("Your garage has been synced!");
//       } catch (error) {
//         console.error("Garage Sync Failed:", error);
//       }
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse: any) => {
//     setError(null);
//     try {
//       const googleToken = credentialResponse.credential;

//       const response = await apiClient.post("/auth/google-login", {
//         token: googleToken,
//       });

//       if (response.data.success) {
//         const { user } = response.data.data;
//         setUser(user);
//         await syncLocalGarage();

//         if (user.phone === "0000000000") {
//           toast.warning("⚠️ Action Required: Please update your phone number.");
//           router.push("/profile");
//         } else {
//           toast.success(`Welcome back, ${user.name}!`);
//           const returnUrl = searchParams.get("returnUrl") || "/";
//           router.push(returnUrl);
//         }
//       }
//     } catch (err: any) {
//       console.error("🔴 Google Login Error:", err);
//       const errorMsg = err.response?.data?.message || "Google Login Failed.";
//       setError(errorMsg);
//     }
//   };

//   const handleGoogleError = () => {
//     setError("Google Login Failed. Please try again.");
//   };

//   useEffect(() => {
//     if (user) {
//       const returnUrl = searchParams.get("returnUrl") || "/";
//       router.replace(returnUrl);
//     }
//   }, [user, router, searchParams]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (error) setError(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const result = await login(formData);

//       if (result.success) {
//         await syncLocalGarage();
//         const returnUrl = searchParams.get("returnUrl") || "/";
//         router.push(returnUrl);
//       } else {
//         setError(result.error || "Invalid credentials.");
//         if (result.error?.toLowerCase().includes("verify")) {
//           setShowResend(true);
//         }
//       }
//     } catch (err) {
//       setError("Connection failed. Please check your network.");
//     }
//   };

//   const handleResendLink = async () => {
//     setResending(true);
//     try {
//       const res = await apiClient.post("/auth/resend-verification", {
//         email: formData.email,
//       });
//       if (res.data.success) {
//         toast.success("Verification link sent! Check your inbox.");
//         setShowResend(false);
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || "Failed to send link.");
//     } finally {
//       setResending(false);
//     }
//   };

//   if (!mounted) return null;
//   if (user) return null;

//   return (
//     <GoogleOAuthProvider
//       clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
//     >
//       <div
//         className={`min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden transition-colors duration-1000 font-sans p-4 sm:p-6 ${
//           isDarkMode ? "bg-[#030303] text-white" : "bg-gray-50 text-gray-900"
//         }`}
//       >
//         {/* ================= BACKGROUND AMBIENCE ================= */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div
//             className="absolute inset-0 opacity-[0.02]"
//             style={{
//               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//             }}
//           />

//           {isDarkMode && (
//             <>
//               <motion.div
//                 animate={blobAnimation.animate}
//                 transition={blobAnimation.transition}
//                 className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-blue-600/10 rounded-full blur-[150px]"
//               />
//               <motion.div
//                 animate={blobAnimation.animate}
//                 transition={{ ...blobAnimation.transition, delay: 5 }}
//                 className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-indigo-600/10 rounded-full blur-[150px]"
//               />
//             </>
//           )}
//         </div>

//         {/* ================= MAIN CARD ================= */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//           className={`w-full max-w-[1200px] h-[92vh] sm:h-[85vh] max-h-[900px] flex flex-col lg:flex-row rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border transition-all duration-700 ${
//             isDarkMode
//               ? "bg-[#0a0a0a]/70 backdrop-blur-3xl border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
//               : "bg-white/95 backdrop-blur-2xl border-white/60 shadow-[0_20px_60px_rgba(59,130,246,0.15)]"
//           }`}
//         >
//           {/* ================= LEFT SIDE (IMAGE - Hidden on Mobile) ================= */}
//           <div className="relative hidden lg:flex flex-1 flex-col justify-between p-10 xl:p-12 overflow-hidden group">
//             <div
//               className={`absolute inset-0 transition-colors duration-700 ${
//                 isDarkMode
//                   ? "bg-gradient-to-br from-blue-900/30 via-[#050505] to-[#050505]"
//                   : "bg-gradient-to-br from-blue-100/60 via-white to-white"
//               }`}
//             />

//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] group-hover:bg-blue-500/30 transition-colors duration-1000" />

//             <div className="relative z-10">
//               <div
//                 className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md mb-6 ${
//                   isDarkMode
//                     ? "bg-white/10 border-white/10 text-blue-300"
//                     : "bg-white/80 border-blue-100 text-blue-800 shadow-sm"
//                 }`}
//               >
//                 <Sparkles size={14} /> Genuine Parts
//               </div>
//               <h2
//                 className={`text-4xl xl:text-5xl font-black leading-tight mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
//               >
//                 Drive with <br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">
//                   Confidence.
//                 </span>
//               </h2>
//               <p
//                 className={`text-lg xl:text-xl max-w-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
//               >
//                 Access thousands of genuine Hyundai spare parts with just a few
//                 clicks.
//               </p>
//             </div>

//             <div className="relative z-10 flex-1 flex items-center justify-center my-4">
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 1.2, delay: 0.3, type: "spring" }}
//                 className="w-full h-full flex items-center justify-center"
//               >
//                 <Image
//                   src="/images/cretapng.png"
//                   alt="Hyundai Creta"
//                   width={600}
//                   height={400}
//                   className="object-contain w-full max-h-[350px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-1000 ease-out"
//                   priority
//                 />
//               </motion.div>
//             </div>

//             <div className="relative z-10 flex gap-6">
//               {["Fast Delivery", "Secure Payment", "24/7 Support"].map(
//                 (feat, i) => (
//                   <div
//                     key={i}
//                     className={`flex items-center gap-2 text-sm font-semibold tracking-wide ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
//                   >
//                     <CheckCircle2 size={16} className="text-blue-500" /> {feat}
//                   </div>
//                 ),
//               )}
//             </div>
//           </div>

//           {/* ================= RIGHT SIDE (FORM + NAVBAR INCLUDED) ================= */}
//           <div
//             className={`flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden p-6 sm:p-10 xl:p-14 transition-colors duration-700 ${
//               isDarkMode ? "bg-transparent" : "bg-white/50"
//             }`}
//           >
//             {/* --- IN-CARD NAVBAR HEADER --- */}
//             <div className="flex items-center justify-between w-full mb-8 shrink-0">
//               <Link href="/" className="flex items-center group">
//                 <Image
//                   src="/images/varshini.png"
//                   alt="Varshini Hyundai Logo"
//                   width={48}
//                   height={48}
//                   className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain group-hover:scale-105 transition-transform duration-300 shrink-0 shadow-lg shadow-blue-500/30 bg-white"
//                 />
//               </Link>
//               <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
//                 <button
//                   onClick={() => setIsDarkMode(!isDarkMode)}
//                   className={`flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full transition-all duration-300 border ${
//                     isDarkMode
//                       ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(250,204,21,0.2)]"
//                       : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm"
//                   }`}
//                 >
//                   {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
//                 </button>
//                 <Link href="/">
//                   <button
//                     className={`flex items-center justify-center gap-2 px-4 sm:px-5 h-10 sm:h-11 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 border ${
//                       isDarkMode
//                         ? "bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-lg text-white"
//                         : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm text-gray-900"
//                     }`}
//                   >
//                     <Home size={16} />{" "}
//                     <span className="hidden sm:inline">Home</span>
//                   </button>
//                 </Link>
//               </div>
//             </div>

//             {/* --- FORM SECTION --- */}
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="show"
//               className="max-w-md w-full mx-auto my-auto flex flex-col"
//             >
//               {/* Header */}
//               <motion.div variants={itemVariants} className="text-center mb-8">
//                 <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-[0_10px_25px_rgba(37,99,235,0.4)] mb-6">
//                   <Fingerprint size={28} strokeWidth={1.5} />
//                 </div>
//                 <h1
//                   className={`text-3xl sm:text-4xl font-extrabold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
//                 >
//                   Welcome Back
//                 </h1>
//                 <p
//                   className={`text-sm sm:text-base ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
//                 >
//                   Enter your credentials to access your account.
//                 </p>
//               </motion.div>

//               {/* Error Message & Beautiful Resend Box */}
//               <AnimatePresence>
//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, height: 0 }}
//                     animate={{ opacity: 1, y: 0, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="mb-6 overflow-hidden"
//                   >
//                     <div
//                       className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
//                         showResend
//                           ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
//                           : "bg-red-500/10 border-red-500/20 text-red-500"
//                       }`}
//                     >
//                       <div className="flex items-start gap-3">
//                         <AlertCircle className="shrink-0 mt-0.5" size={20} />
//                         <div className="flex-1">
//                           <p className="text-sm font-medium leading-relaxed">
//                             {error}
//                           </p>

//                           {/* Animated Resend Button */}
//                           {showResend && (
//                             <button
//                               type="button"
//                               onClick={handleResendLink}
//                               disabled={resending}
//                               className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
//                             >
//                               {resending ? (
//                                 <>
//                                   <svg
//                                     className="animate-spin h-4 w-4 text-white"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <circle
//                                       className="opacity-25"
//                                       cx="12"
//                                       cy="12"
//                                       r="10"
//                                       stroke="currentColor"
//                                       strokeWidth="4"
//                                     ></circle>
//                                     <path
//                                       className="opacity-75"
//                                       fill="currentColor"
//                                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                     ></path>
//                                   </svg>
//                                   Sending Link...
//                                 </>
//                               ) : (
//                                 <>
//                                   <Mail size={16} />
//                                   Resend Verification Link
//                                 </>
//                               )}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* Form */}
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Email Field */}
//                 <motion.div variants={itemVariants}>
//                   <label
//                     className={`block text-xs font-bold uppercase tracking-widest mb-2.5 ml-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
//                   >
//                     Email Address
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                       <Mail
//                         className={`h-5 w-5 transition-colors duration-300 ${isDarkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-blue-500"}`}
//                       />
//                     </div>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       placeholder="name@example.com"
//                       className={`block w-full pl-12 pr-4 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl border outline-none transition-all duration-300 font-medium backdrop-blur-sm ${
//                         isDarkMode
//                           ? "bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-white/20 focus:bg-blue-900/10 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
//                           : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] shadow-sm"
//                       }`}
//                     />
//                   </div>
//                 </motion.div>

//                 {/* Password Field */}
//                 <motion.div variants={itemVariants}>
//                   <div className="flex justify-between items-center mb-2.5 ml-1 mr-1">
//                     <label
//                       className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
//                     >
//                       Password
//                     </label>
//                     <Link
//                       href="/forgot-password"
//                       className="text-xs sm:text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors"
//                     >
//                       Forgot password?
//                     </Link>
//                   </div>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                       <Lock
//                         className={`h-5 w-5 transition-colors duration-300 ${isDarkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-blue-500"}`}
//                       />
//                     </div>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       required
//                       placeholder="••••••••"
//                       className={`block w-full pl-12 pr-12 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl border outline-none transition-all duration-300 font-medium backdrop-blur-sm ${
//                         isDarkMode
//                           ? "bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-white/20 focus:bg-blue-900/10 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
//                           : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] shadow-sm"
//                       }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-500 transition-colors z-10"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </motion.div>

//                 {/* Submit Button */}
//                 <motion.div variants={itemVariants} className="pt-3">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 sm:py-4 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] transition-all duration-300 transform active:scale-[0.98] text-base sm:text-lg disabled:opacity-80 disabled:cursor-wait"
//                   >
//                     <span className="relative z-10 flex items-center justify-center gap-3">
//                       {loading ? (
//                         <>
//                           <svg
//                             className="animate-spin h-5 w-5 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           <span>Authenticating...</span>
//                         </>
//                       ) : (
//                         <>
//                           Sign In{" "}
//                           <ArrowRight
//                             size={20}
//                             className="group-hover:translate-x-1 transition-transform"
//                           />
//                         </>
//                       )}
//                     </span>
//                     <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
//                   </button>
//                 </motion.div>
//               </form>

//               {/* Divider */}
//               <motion.div variants={itemVariants} className="relative my-8">
//                 <div className="absolute inset-0 flex items-center">
//                   <div
//                     className={`w-full border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
//                   />
//                 </div>
//                 <div className="relative flex justify-center text-[10px] sm:text-xs uppercase tracking-widest font-bold">
//                   <span
//                     className={`px-4 sm:px-6 py-1 rounded-full ${isDarkMode ? "bg-[#0a0a0a] text-gray-500 border border-white/10" : "bg-white text-gray-400 border border-gray-200"}`}
//                   >
//                     Or continue with
//                   </span>
//                 </div>
//               </motion.div>

//               {/* Google Button */}
//               <motion.div
//                 variants={itemVariants}
//                 className="flex justify-center"
//               >
//                 <div className="w-full h-12 sm:h-14 flex items-center justify-center rounded-2xl overflow-hidden [&>div]:w-full [&>div>div]:!h-12 sm:[&>div>div]:!h-14 [&>div>div]:!w-full [&>div>div]:!rounded-2xl">
//                   <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={handleGoogleError}
//                     theme={isDarkMode ? "filled_black" : "outline"}
//                     shape="rectangular"
//                     size="large"
//                     text="continue_with"
//                     width="100%"
//                   />
//                 </div>
//               </motion.div>

//               {/* Footer Links (Form bottom) */}
//               <motion.div
//                 variants={itemVariants}
//                 className="mt-8 text-center pb-2"
//               >
//                 <p
//                   className={`text-sm sm:text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
//                 >
//                   Don&apos;t have an account?{" "}
//                   <Link
//                     href="/register"
//                     className="font-bold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
//                   >
//                     Create account
//                   </Link>
//                 </p>
//               </motion.div>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Global Footer (Absolute) */}
//         <div
//           className={`absolute bottom-2 sm:bottom-6 left-0 w-full text-center text-[10px] sm:text-xs uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity duration-300 pointer-events-auto z-50 ${isDarkMode ? "text-white" : "text-gray-900"}`}
//         >
//           <span className="mx-2 sm:mx-3 cursor-pointer hover:text-blue-500 transition-colors">
//             Privacy Policy
//           </span>
//           •
//           <span className="mx-2 sm:mx-3 cursor-pointer hover:text-blue-500 transition-colors">
//             Terms of Service
//           </span>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

// // 🔥 FIX: 2. అసలైన పేజీకి Suspense యాడ్ చేసాము. ఇది Next.js Build Error ని సాల్వ్ చేస్తుంది.
// export default function LoginPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center bg-[#030303]">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       }
//     >
//       <LoginContent />
//     </Suspense>
//   );
// }

"use client";

import { useState, useEffect, Suspense } from "react";
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
import apiClient from "@/services/apiClient";
import { useStore } from "@/store/useStore";

// --- Enhanced Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 14 },
  },
};

// 🔥 FIX: యానిమేషన్ కి GPU Acceleration యాడ్ చేశాం
const blobAnimation = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.15, 0.4, 0.15],
    rotate: [0, 180, 360],
  },
  transition: { duration: 25, repeat: Infinity, ease: "linear" },
};

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  const { login, loading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔥 FIX 1: Theme Sync - Global Store నుండి థీమ్ తీసుకుంటున్నాం
  const { setUser, theme, toggleTheme } = useStore();
  const isDarkMode = theme === "dark";

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

  const syncLocalGarage = async () => {
    const localGarageData = localStorage.getItem("myGarage");

    if (localGarageData) {
      try {
        const parsedGarage = JSON.parse(localGarageData);
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

      const response = await apiClient.post("/auth/google-login", {
        token: googleToken,
      });

      if (response.data.success) {
        const { user } = response.data.data;
        setUser(user);
        await syncLocalGarage();

        if (user.phone === "0000000000") {
          toast.warning("⚠️ Action Required: Please update your phone number.");
          router.push("/profile");
        } else {
          toast.success(`Welcome back, ${user.name}!`);
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
        await syncLocalGarage();
        const returnUrl = searchParams.get("returnUrl") || "/";
        router.push(returnUrl);
      } else {
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
  if (user) return null;

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <div
        className={`min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden transition-colors duration-1000 font-sans p-4 sm:p-6 ${
          isDarkMode ? "bg-[#030303] text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* ================= BACKGROUND AMBIENCE ================= */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {isDarkMode && (
            <>
              {/* 🔥 FIX 2: Performance కోసం transform-gpu మరియు will-change-transform యాడ్ చేశాం */}
              <motion.div
                animate={blobAnimation.animate}
                transition={blobAnimation.transition}
                className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-blue-600/10 rounded-full blur-[100px] md:blur-[150px] transform-gpu will-change-transform"
              />
              <motion.div
                animate={blobAnimation.animate}
                transition={{ ...blobAnimation.transition, delay: 5 }}
                className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-indigo-600/10 rounded-full blur-[100px] md:blur-[150px] transform-gpu will-change-transform"
              />
            </>
          )}
        </div>

        {/* ================= MAIN CARD ================= */}
        {/* 🔥 FIX 3: backdrop-blur-3xl తీసేసి backdrop-blur-xl పెట్టాం, దీనివల్ల స్క్రోలింగ్ చాలా స్మూత్ గా అవుతుంది */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full max-w-[1200px] h-[92vh] sm:h-[85vh] max-h-[900px] flex flex-col lg:flex-row rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border transition-all duration-700 ${
            isDarkMode
              ? "bg-[#0a0a0a]/70 backdrop-blur-xl border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)]"
              : "bg-white/95 backdrop-blur-lg border-white/60 shadow-[0_20px_60px_rgba(59,130,246,0.15)]"
          }`}
        >
          {/* ================= LEFT SIDE (IMAGE - Hidden on Mobile) ================= */}
          <div className="relative hidden lg:flex flex-1 flex-col justify-between p-10 xl:p-12 overflow-hidden group">
            <div
              className={`absolute inset-0 transition-colors duration-700 ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-900/30 via-[#050505] to-[#050505]"
                  : "bg-gradient-to-br from-blue-100/60 via-white to-white"
              }`}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] group-hover:bg-blue-500/30 transition-colors duration-1000 transform-gpu" />

            <div className="relative z-10">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md mb-6 ${
                  isDarkMode
                    ? "bg-white/10 border-white/10 text-blue-300"
                    : "bg-white/80 border-blue-100 text-blue-800 shadow-sm"
                }`}
              >
                <Sparkles size={14} /> Genuine Parts
              </div>
              <h2
                className={`text-4xl xl:text-5xl font-black leading-tight mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Drive with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">
                  Confidence.
                </span>
              </h2>
              <p
                className={`text-lg xl:text-xl max-w-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Access thousands of genuine Hyundai spare parts with just a few
                clicks.
              </p>
            </div>

            <div className="relative z-10 flex-1 flex items-center justify-center my-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3, type: "spring" }}
                className="w-full h-full flex items-center justify-center"
              >
                <Image
                  src="/images/cretapng.png"
                  alt="Hyundai Creta"
                  width={600}
                  height={400}
                  className="object-contain w-full max-h-[350px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-1000 ease-out"
                  priority
                />
              </motion.div>
            </div>

            <div className="relative z-10 flex gap-6">
              {["Fast Delivery", "Secure Payment", "24/7 Support"].map(
                (feat, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-sm font-semibold tracking-wide ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    <CheckCircle2 size={16} className="text-blue-500" /> {feat}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* ================= RIGHT SIDE (FORM + NAVBAR INCLUDED) ================= */}
          {/* 🔥 FIX 4: Scroll అవుతున్నప్పుడు lag అవ్వకుండా transform-gpu యాడ్ చేసాం */}
          <div
            className={`flex-1 flex flex-col overflow-y-auto transform-gpu [&::-webkit-scrollbar]:hidden p-6 sm:p-10 xl:p-14 transition-colors duration-700 ${
              isDarkMode ? "bg-transparent" : "bg-white/50"
            }`}
          >
            {/* --- IN-CARD NAVBAR HEADER --- */}
            <div className="flex items-center justify-between w-full mb-8 shrink-0">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/images/varshini.png"
                  alt="Varshini Hyundai Logo"
                  width={48}
                  height={48}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain group-hover:scale-105 transition-transform duration-300 shrink-0 shadow-lg shadow-blue-500/30 bg-white"
                />
              </Link>
              <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
                {/* 🔥 FIX: Local state తీసేసి, Global Theme toggle పంపిస్తున్నాం */}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full transition-all duration-300 border ${
                    isDarkMode
                      ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm"
                  }`}
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <Link href="/">
                  <button
                    className={`flex items-center justify-center gap-2 px-4 sm:px-5 h-10 sm:h-11 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 border ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-lg text-white"
                        : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm text-gray-900"
                    }`}
                  >
                    <Home size={16} />{" "}
                    <span className="hidden sm:inline">Home</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* --- FORM SECTION --- */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="max-w-md w-full mx-auto my-auto flex flex-col"
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-[0_10px_25px_rgba(37,99,235,0.4)] mb-6">
                  <Fingerprint size={28} strokeWidth={1.5} />
                </div>
                <h1
                  className={`text-3xl sm:text-4xl font-extrabold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Welcome Back
                </h1>
                <p
                  className={`text-sm sm:text-base ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Enter your credentials to access your account.
                </p>
              </motion.div>

              {/* Error Message & Beautiful Resend Box */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div
                      className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                        showResend
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                          : "bg-red-500/10 border-red-500/20 text-red-500"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-relaxed">
                            {error}
                          </p>

                          {/* Animated Resend Button */}
                          {showResend && (
                            <button
                              type="button"
                              onClick={handleResendLink}
                              disabled={resending}
                              className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                            >
                              {resending ? (
                                <>
                                  <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Sending Link...
                                </>
                              ) : (
                                <>
                                  <Mail size={16} />
                                  Resend Verification Link
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label
                    className={`block text-xs font-bold uppercase tracking-widest mb-2.5 ml-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Mail
                        className={`h-5 w-5 transition-colors duration-300 ${isDarkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-blue-500"}`}
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@example.com"
                      className={`block w-full pl-12 pr-4 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl border outline-none transition-all duration-300 font-medium backdrop-blur-sm ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-white/20 focus:bg-blue-900/10 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] shadow-sm"
                      }`}
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center mb-2.5 ml-1 mr-1">
                    <label
                      className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs sm:text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Lock
                        className={`h-5 w-5 transition-colors duration-300 ${isDarkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-blue-500"}`}
                      />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className={`block w-full pl-12 pr-12 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl border outline-none transition-all duration-300 font-medium backdrop-blur-sm ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-white/20 focus:bg-blue-900/10 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] shadow-sm"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-500 transition-colors z-10"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 sm:py-4 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] transition-all duration-300 transform active:scale-[0.98] text-base sm:text-lg disabled:opacity-80 disabled:cursor-wait"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          Sign In{" "}
                          <ArrowRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </span>
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
                <div className="relative flex justify-center text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                  <span
                    className={`px-4 sm:px-6 py-1 rounded-full ${isDarkMode ? "bg-[#0a0a0a] text-gray-500 border border-white/10" : "bg-white text-gray-400 border border-gray-200"}`}
                  >
                    Or continue with
                  </span>
                </div>
              </motion.div>

              {/* Google Button */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center"
              >
                <div className="w-full h-12 sm:h-14 flex items-center justify-center rounded-2xl overflow-hidden [&>div]:w-full [&>div>div]:!h-12 sm:[&>div>div]:!h-14 [&>div>div]:!w-full [&>div>div]:!rounded-2xl">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme={isDarkMode ? "filled_black" : "outline"}
                    shape="rectangular"
                    size="large"
                    text="continue_with"
                    width="100%"
                  />
                </div>
              </motion.div>

              {/* Footer Links (Form bottom) */}
              <motion.div
                variants={itemVariants}
                className="mt-8 text-center pb-2"
              >
                <p
                  className={`text-sm sm:text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Global Footer (Absolute) */}
        <div
          className={`absolute bottom-2 sm:bottom-6 left-0 w-full text-center text-[10px] sm:text-xs uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity duration-300 pointer-events-auto z-50 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          <span className="mx-2 sm:mx-3 cursor-pointer hover:text-blue-500 transition-colors">
            Privacy Policy
          </span>
          •
          <span className="mx-2 sm:mx-3 cursor-pointer hover:text-blue-500 transition-colors">
            Terms of Service
          </span>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#030303]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
