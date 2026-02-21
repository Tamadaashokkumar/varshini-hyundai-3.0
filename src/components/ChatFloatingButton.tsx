// "use client";

// import { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   Sun,
//   Moon,
//   MessageCircle,
//   MessageSquareText,
//   Headset,
// } from "lucide-react";
// import { usePathname } from "next/navigation";
// import ChatComponentPopup from "./ChatForPopup";

// // 🔥 Updated Imports
// import { useAuth } from "@/hooks/useAuth";

// export default function ChatFloatingButton() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const pathname = usePathname();

//   // 🔥 Use global auth state
//   const { user, isAuthenticated } = useAuth();

//   // WhatsApp Config
//   const WHATSAPP_NUMBER = "918096936290";
//   const WHATSAPP_MESSAGE = encodeURIComponent(
//     "Hi Varshini Hyundai, I need assistance with spare parts.",
//   );

//   // Admin ID (Ensure this matches your DB)
//   const ADMIN_ID =
//     process.env.NEXT_PUBLIC_ADMIN_ID || "694673ed8eac361b130a1b5d";

//   useEffect(() => {
//     setMounted(true);
//     const savedTheme = localStorage.getItem("chat_theme");
//     if (savedTheme === "dark") setIsDarkMode(true);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
//   };

//   // Handlers
//   const handleWhatsAppClick = () => {
//     setIsMenuOpen(false);
//     window.open(
//       `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
//       "_blank",
//     );
//   };

//   const handleLiveChatClick = () => {
//     setIsMenuOpen(false);
//     setIsChatOpen(true);
//   };

//   // 🔥 Conditional Rendering
//   if (!mounted || !isAuthenticated || !user) return null;
//   if (pathname === "/chat") return null;

//   // 🔥 Chat Modal Content (Centered & Beautiful)
//   const chatModalContent = (
//     <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 md:p-4">
//       {/* Backdrop with Blur */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={() => setIsChatOpen(false)}
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//       />

//       {/* Centered Modal Container */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.9, y: 20 }}
//         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//         className="relative w-full h-full md:w-[900px] md:h-[85vh] md:max-h-[700px] z-[100000] overflow-hidden md:rounded-[2rem] shadow-2xl flex flex-col bg-transparent pointer-events-auto"
//       >
//         {/* Render the Chat Component */}
//         <ChatComponentPopup
//           currentUserId={user._id || user.id} // Fallback support
//           otherUserId={ADMIN_ID}
//           otherUserModel="Admin"
//           onClose={() => setIsChatOpen(false)} // Pass close handler
//           isDarkModeParent={isDarkMode} // Sync theme
//           toggleThemeParent={toggleTheme} // Allow toggling theme
//         />
//       </motion.div>
//     </div>
//   );

//   return (
//     <>
//       {isChatOpen && createPortal(chatModalContent, document.body)}

//       <div className="fixed bottom-20 right-6 z-[9990] flex flex-col items-end gap-5">
//         {/* 🔥 Sub Buttons (Menu Options) */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <div className="flex flex-col gap-4 items-end mb-2 pr-1">
//               {/* 1. Live Chat Button */}
//               <motion.div
//                 initial={{ opacity: 0, x: 20, scale: 0.8 }}
//                 animate={{ opacity: 1, x: 0, scale: 1 }}
//                 exit={{ opacity: 0, x: 20, scale: 0.8 }}
//                 transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
//                 className="flex items-center gap-3 group cursor-pointer"
//                 onClick={handleLiveChatClick}
//               >
//                 <span className="bg-white dark:bg-gray-800 dark:text-white text-gray-800 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/10 text-sm font-bold border border-gray-100 dark:border-gray-700 tracking-wide">
//                   Live Assistance
//                 </span>
//                 <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 hover:scale-110 transition-transform border-2 border-white dark:border-gray-800">
//                   <Headset className="w-6 h-6" />
//                 </div>
//               </motion.div>

//               {/* 2. WhatsApp Button */}
//               <motion.div
//                 initial={{ opacity: 0, x: 20, scale: 0.8 }}
//                 animate={{ opacity: 1, x: 0, scale: 1 }}
//                 exit={{ opacity: 0, x: 20, scale: 0.8 }}
//                 transition={{ delay: 0.05, type: "spring", stiffness: 300 }}
//                 className="flex items-center gap-3 group cursor-pointer"
//                 onClick={handleWhatsAppClick}
//               >
//                 <span className="bg-white dark:bg-gray-800 dark:text-white text-gray-800 px-4 py-2 rounded-xl shadow-lg shadow-green-500/10 text-sm font-bold border border-gray-100 dark:border-gray-700 tracking-wide">
//                   WhatsApp
//                 </span>
//                 <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xl shadow-green-500/30 hover:scale-110 transition-transform border-2 border-white dark:border-gray-800">
//                   <MessageCircle className="w-6 h-6" />
//                 </div>
//               </motion.div>
//             </div>
//           )}
//         </AnimatePresence>

//         {/* 🔥 Main Toggle Button */}
//         <div
//           className="relative group"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           {/* Animated Ripple Effect */}
//           {!isMenuOpen && (
//             <>
//               <motion.div
//                 animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
//                 className="absolute inset-0 rounded-full bg-blue-500/30 z-0"
//               />
//               <motion.div
//                 animate={{ scale: [1, 1.3, 1.6], opacity: [0.6, 0.3, 0] }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "easeOut",
//                   delay: 0.5,
//                 }}
//                 className="absolute inset-0 rounded-full bg-cyan-400/30 z-0"
//               />
//             </>
//           )}

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className={`relative flex items-center justify-center w-[70px] h-[70px] rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 z-[9995] border-2 border-white/30 ${
//               isMenuOpen
//                 ? "bg-gray-900 text-white rotate-0"
//                 : "bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white"
//             }`}
//           >
//             <motion.div
//               key={isMenuOpen ? "close" : "open"}
//               initial={{ rotate: -90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               transition={{ duration: 0.3 }}
//             >
//               {isMenuOpen ? (
//                 <X className="w-7 h-7" />
//               ) : (
//                 <motion.div
//                   animate={{ rotate: [0, -10, 10, -10, 0] }}
//                   transition={{
//                     duration: 2,
//                     repeat: Infinity,
//                     repeatDelay: 3,
//                     ease: "easeInOut",
//                   }}
//                 >
//                   <MessageSquareText className="w-8 h-8 fill-white/10" />
//                 </motion.div>
//               )}
//             </motion.div>
//           </motion.button>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, MessageSquareText, Headset } from "lucide-react";
import { usePathname } from "next/navigation";
import ChatComponentPopup from "./ChatForPopup";

// 🔥 Updated Imports
import { useAuth } from "@/hooks/useAuth";

export default function ChatFloatingButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // డ్రాగ్ చేస్తున్నాడా లేదా అని తెలుసుకోవడానికి

  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null); // డ్రాగ్ బౌండరీస్ (Constraints) కోసం

  // 🔥 Use global auth state
  const { user, isAuthenticated } = useAuth();

  // WhatsApp Config
  const WHATSAPP_NUMBER = "918096936290";
  const WHATSAPP_MESSAGE = encodeURIComponent(
    "Hi Varshini Hyundai, I need assistance with spare parts.",
  );

  // Admin ID (Ensure this matches your DB)
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
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
      "_blank",
    );
  };

  const handleLiveChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsChatOpen(true);
  };

  const toggleMenu = () => {
    // డ్రాగ్ చేస్తున్నప్పుడు క్లిక్ అవ్వకుండా (అంటే డ్రాగ్ ఆపగానే మెనూ ఓపెన్ అవ్వకుండా)
    if (!isDragging) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  // 🔥 Conditional Rendering
  if (!mounted || !isAuthenticated || !user) return null;
  if (pathname === "/chat") return null;

  // 🔥 Chat Modal Content
  const chatModalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 md:p-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsChatOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full h-full md:w-[900px] md:h-[85vh] md:max-h-[700px] z-[100000] overflow-hidden md:rounded-[2rem] shadow-2xl flex flex-col bg-transparent pointer-events-auto"
      >
        <ChatComponentPopup
          currentUserId={user._id || user.id || ""}
          otherUserId={ADMIN_ID}
          otherUserModel="Admin"
          onClose={() => setIsChatOpen(false)}
          isDarkModeParent={isDarkMode}
          toggleThemeParent={toggleTheme}
        />
      </motion.div>
    </div>
  );

  return (
    <>
      {isChatOpen && createPortal(chatModalContent, document.body)}

      {/* మొత్తం స్క్రీన్‌ను డ్రాగ్ బౌండరీగా సెట్ చేయడానికి ఈ కంటైనర్ వాడుతున్నాం.
        pointer-events-none ఇవ్వడం వల్ల కింద ఉన్న వేరే బటన్స్ క్లిక్ అవుతాయి.
      */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[9990] p-4 sm:p-6"
      >
        {/* 🔥 NEW: Draggable Motion Div */}
        <motion.div
          drag
          dragConstraints={containerRef} // స్క్రీన్ దాటి బయటకు వెళ్ళకుండా
          dragElastic={0.1} // రబ్బర్ బ్యాండ్ లాంటి ఎఫెక్ట్ (బాగుంటుంది)
          dragMomentum={false} // వదిలేయగానే అక్కడే ఆగిపోతుంది
          onDragStart={() => {
            setIsDragging(true);
            setIsMenuOpen(false); // డ్రాగ్ చేసేటప్పుడు మెనూ క్లోజ్ అవ్వడం మంచిది
          }}
          onDragEnd={() => {
            // చిన్న డిలే ఇస్తే డ్రాగ్ ఆపగానే క్లిక్ ఈవెంట్ ఫైర్ అవ్వకుండా ఉంటుంది
            setTimeout(() => setIsDragging(false), 150);
          }}
          // డిఫాల్ట్ పొజిషన్ (బాటమ్ రైట్)
          initial={{ x: 0, y: 0 }}
          style={{
            position: "absolute",
            bottom: "40px", // ఇక్కడ నుండి డ్రాగ్ స్టార్ట్ అవుతుంది
            right: "24px",
          }}
          className="flex flex-col items-end gap-5 pointer-events-auto"
        >
          {/* 🔥 Sub Buttons (Menu Options) */}
          <AnimatePresence>
            {isMenuOpen && (
              <div className="flex flex-col gap-4 items-end mb-2 pr-1">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="flex items-center gap-3 group cursor-pointer"
                  onClick={handleLiveChatClick}
                >
                  <span className="bg-white dark:bg-gray-800 dark:text-white text-gray-800 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/10 text-sm font-bold border border-gray-100 dark:border-gray-700 tracking-wide">
                    Live Assistance
                  </span>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 hover:scale-110 transition-transform border-2 border-white dark:border-gray-800">
                    <Headset className="w-6 h-6" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 300 }}
                  className="flex items-center gap-3 group cursor-pointer"
                  onClick={handleWhatsAppClick}
                >
                  <span className="bg-white dark:bg-gray-800 dark:text-white text-gray-800 px-4 py-2 rounded-xl shadow-lg shadow-green-500/10 text-sm font-bold border border-gray-100 dark:border-gray-700 tracking-wide">
                    WhatsApp
                  </span>
                  <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xl shadow-green-500/30 hover:scale-110 transition-transform border-2 border-white dark:border-gray-800">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 🔥 Main Toggle Button */}
          <div
            className="relative group cursor-grab active:cursor-grabbing" // కర్సర్ మారుతుంది (చేతి గుర్తు)
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Animated Ripple Effect */}
            {!isMenuOpen && !isDragging && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
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
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close chat menu" : "Open chat menu"}
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
        </motion.div>
      </div>
    </>
  );
}
