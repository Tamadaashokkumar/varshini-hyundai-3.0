// "use client";

// import { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Headset, X, Sun, Moon } from "lucide-react";
// import Cookies from "js-cookie";
// import { usePathname } from "next/navigation"; // 🔥 1. IMPORT PATHNAME
// import ChatComponentPopup from "./ChatComponentPopup";

// export default function ChatFloatingButton() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   // 🔥 2. Theme State Add Cheyali
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // 🔥 3. Pathname Hook
//   const pathname = usePathname();

//   const [authData, setAuthData] = useState({
//     token: null,
//     userId: null,
//     adminId: "694673ed8eac361b130a1b5d",
//   });

//   // 🔥 4. Check Auth on Mount AND on Path Change
//   const checkAuth = () => {
//     const token = Cookies.get("accessToken");
//     let userCookie = Cookies.get("user");

//     let userId = null;
//     if (userCookie) {
//       try {
//         const parsedUser = JSON.parse(userCookie);
//         userId = parsedUser._id || parsedUser.id || userCookie;
//       } catch (e) {
//         userId = userCookie;
//       }
//     }

//     if (token && userId) {
//       setAuthData((prev) => ({
//         ...prev,
//         token: token,
//         userId: userId,
//       }));
//     } else {
//       // లాగౌట్ అయితే డేటా క్లియర్ చేయడానికి
//       setAuthData((prev) => ({ ...prev, token: null, userId: null }));
//     }
//   };

//   useEffect(() => {
//     setMounted(true);

//     // Load Theme
//     const savedTheme = localStorage.getItem("chat_theme");
//     if (savedTheme === "dark") setIsDarkMode(true);

//     // Initial Auth Check
//     checkAuth();

//     // Listen for custom login events (Optional but safer)
//     window.addEventListener("storage", checkAuth);
//     return () => window.removeEventListener("storage", checkAuth);
//   }, []);

//   // 🔥 5. పేజీ మారిన ప్రతిసారీ (Login -> Home) ఇది రన్ అవుతుంది
//   useEffect(() => {
//     checkAuth();
//   }, [pathname]);

//   // Theme Toggle Function
//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
//   };

//   if (!mounted || !authData.token) return null;

//   const chatModalContent = (
//     <div className="fixed inset-0 z-[99999] flex items-end justify-end sm:items-center sm:justify-center pointer-events-none">
//       {/* BACKDROP */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={() => setIsOpen(false)}
//         className="fixed inset-0 pointer-events-auto"
//         style={{
//           backgroundColor: "rgba(0, 0, 0, 0.4)",
//           backdropFilter: "blur(4px)",
//           WebkitBackdropFilter: "blur(4px)",
//         }}
//       />

//       {/* CHAT WINDOW */}
//       <motion.div
//         initial={{ opacity: 0, y: 50, scale: 0.9 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, y: 50, scale: 0.9 }}
//         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//         className="pointer-events-auto fixed bottom-6 right-6 w-[340px] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col z-[100000]"
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 p-4 flex justify-between items-center shrink-0 shadow-lg">
//           <div className="flex items-center gap-3 group relative z-50">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200 drop-shadow-sm"
//             >
//               VARSHINI
//             </motion.div>
//             <div className="h-8 w-[1px] bg-white/20 mx-1" />
//             <div className="flex flex-col justify-center">
//               <span className="text-[10px] sm:text-xs font-bold text-white leading-none tracking-wide mb-0.5">
//                 HYUNDAI
//               </span>
//               <span className="text-[8px] uppercase tracking-[0.25em] text-blue-100 font-medium">
//                 Spares
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Theme Toggle Button */}
//             <button
//               onClick={toggleTheme}
//               className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm"
//             >
//               {isDarkMode ? (
//                 <Sun className="w-5 h-5" />
//               ) : (
//                 <Moon className="w-5 h-5" />
//               )}
//             </button>

//             {/* Close Button */}
//             <button
//               onClick={() => setIsOpen(false)}
//               className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div
//           className={`flex-1 overflow-hidden relative ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
//         >
//           <ChatComponentPopup
//             currentUserId={authData.userId}
//             otherUserId={authData.adminId}
//             otherUserModel="Admin"
//             otherUserName="Support Team"
//             token={authData.token}
//             apiUrl={
//               process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
//             }
//             isDarkMode={isDarkMode}
//             toggleTheme={toggleTheme}
//           />
//         </div>
//       </motion.div>
//     </div>
//   );

//   if (pathname === "/chat") return null;

//   return (
//     <>
//       {isOpen && createPortal(chatModalContent, document.body)}

//       <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-2">
//         {isHovered && !isOpen && (
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 20 }}
//             className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-xl text-sm font-medium border border-gray-100 mr-2 whitespace-nowrap"
//           >
//             Chat with Support 👋
//           </motion.div>
//         )}

//         <div
//           className="relative group"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           {!isOpen && (
//             <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping duration-1000"></span>
//           )}

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsOpen(!isOpen)}
//             className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-md transition-all duration-300 ${
//               isOpen
//                 ? "bg-gray-800 text-white rotate-0 border-gray-600"
//                 : "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white"
//             }`}
//           >
//             <motion.div
//               key={isOpen ? "close" : "open"}
//               initial={{ rotate: -90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               transition={{ duration: 0.2 }}
//             >
//               {isOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Headset className="w-7 h-7" />
//               )}
//             </motion.div>

//             {!isOpen && (
//               <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
//             )}
//           </motion.button>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sun,
  Moon,
  MessageCircle,
  MessageSquareText,
  Headset,
} from "lucide-react";
import { usePathname } from "next/navigation";
import ChatComponentPopup from "./ChatComponentPopup";

// 🔥 New Imports
import { useAuth } from "@/hooks/useAuth";
import { getAccessToken } from "@/services/apiClient";

export default function ChatFloatingButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const pathname = usePathname();

  // 🔥 Use global auth state instead of cookies
  const { user, isAuthenticated } = useAuth();

  // WhatsApp Number
  const WHATSAPP_NUMBER = "918096936290";
  // Admin ID (Replace with env variable if needed)
  const ADMIN_ID =
    process.env.NEXT_PUBLIC_ADMIN_ID || "694673ed8eac361b130a1b5d";

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
  };

  // Handlers
  const handleWhatsAppClick = () => {
    setIsMenuOpen(false);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
  };

  const handleLiveChatClick = () => {
    setIsMenuOpen(false);
    setIsChatOpen(true);
  };

  // 🔥 Conditional Rendering
  // 1. హైడ్రేషన్ ఎర్రర్స్ రాకుండా mounted చెక్
  // 2. లాగిన్ అయితేనే చాట్ బటన్ చూపించాలి (!isAuthenticated)
  // 3. ఫుల్ పేజీ చాట్ (/chat) లో ఉంటే ఈ బటన్ అవసరం లేదు
  if (!mounted || !isAuthenticated || !user) return null;
  if (pathname === "/chat") return null;

  // Get current access token from memory
  const token = getAccessToken();

  // 🔥 Chat Modal Content
  const chatModalContent = (
    <div className="fixed inset-0 z-[99999] flex items-end justify-end sm:items-center sm:justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsChatOpen(false)}
        className="fixed inset-0 pointer-events-auto"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="pointer-events-auto fixed bottom-6 right-6 w-[340px] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col z-[100000]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 p-4 flex justify-between items-center shrink-0 shadow-lg">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200"
            >
              VARSHINI
            </motion.div>
            <div className="h-8 w-[1px] bg-white/20 mx-1" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs font-bold text-white leading-none tracking-wide mb-0.5">
                HYUNDAI
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-blue-100 font-medium">
                Spares
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 overflow-hidden relative ${
            isDarkMode ? "bg-slate-950" : "bg-gray-50"
          }`}
        >
          <ChatComponentPopup
            currentUserId={user._id} // 🔥 Directly from Auth Store
            otherUserId={ADMIN_ID}
            otherUserModel="Admin"
            otherUserName="Support Team"
            token={token} // 🔥 Directly from Memory
            apiUrl={
              process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
            }
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        </div>
      </motion.div>
    </div>
  );

  if (isChatOpen) return createPortal(chatModalContent, document.body);

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-5">
      {/* 🔥 Sub Buttons (Menu Options) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="flex flex-col gap-4 items-end mb-2 pr-1">
            {/* 1. Live Chat Button */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="flex items-center gap-3 group cursor-pointer"
              onClick={handleLiveChatClick}
            >
              <span className="bg-white text-gray-800 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/10 text-sm font-bold border border-gray-100 tracking-wide">
                Live Assistance
              </span>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 hover:scale-110 transition-transform border-2 border-white">
                <Headset className="w-6 h-6" />
              </div>
            </motion.div>

            {/* 2. WhatsApp Button */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 300 }}
              className="flex items-center gap-3 group cursor-pointer"
              onClick={handleWhatsAppClick}
            >
              <span className="bg-white text-gray-800 px-4 py-2 rounded-xl shadow-lg shadow-green-500/10 text-sm font-bold border border-gray-100 tracking-wide">
                Connect via WhatsApp
              </span>
              <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xl shadow-green-500/30 hover:scale-110 transition-transform border-2 border-white">
                <MessageCircle className="w-6 h-6" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔥 Main Toggle Button */}
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Ripple Effect */}
        {!isMenuOpen && (
          <>
            <motion.div
              animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-blue-500/30 z-0"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1.6], opacity: [0.6, 0.3, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
              className="absolute inset-0 rounded-full bg-cyan-400/30 z-0"
            />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`relative flex items-center justify-center w-[70px] h-[70px] rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 z-[9995] border-2 border-white/30 ${
            isMenuOpen
              ? "bg-gray-900 text-white rotate-0"
              : "bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white"
          }`}
        >
          <motion.div
            key={isMenuOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              >
                <MessageSquareText className="w-8 h-8 fill-white/10" />
              </motion.div>
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
