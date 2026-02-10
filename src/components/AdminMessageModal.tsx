"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // ✅ Updated Hook
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

// URL Setup
const SOCKET_URL = (
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
).replace(/\/api\/?$/, "");

let socket: Socket; // Global variable to hold socket instance

export default function AdminMessageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // ✅ 1. Get User from useAuth (Fresh Data)
  const { user } = useAuth();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 2. Initialize Audio once on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
      );
    }
  }, []);

  // 3. Socket Connection & Listeners
  useEffect(() => {
    // Initialize socket if not already done
    if (!socket) {
      socket = io(SOCKET_URL, {
        autoConnect: true,
        path: "/socket.io/",
        transports: ["websocket"],
        withCredentials: true, // ✅ CRITICAL: Sends HttpOnly Cookies
      });
    }

    // ✅ 4. TypeScript Fix: Cast user to 'any' to access '_id' safely
    const currentUser = user as any;
    const userId = currentUser?._id || currentUser?.id;

    if (userId) {
      socket.emit("join_room", `user:${userId}`);
    }

    const handleMessage = (data: { message: string }) => {
      setAdminMessage(data.message);
      setIsOpen(true);
      setIsReplying(false);

      // Play Sound Safely
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          // Autoplay policy might block audio, ignore error
          console.log("Audio play prevented:", err);
        });
      }
    };

    socket.on("force_open_chat", handleMessage);

    // Cleanup listener on unmount
    return () => {
      socket.off("force_open_chat", handleMessage);
    };
  }, [user]);

  // 5. Send Reply Function
  const sendReply = () => {
    if (!replyText.trim()) return;

    // ✅ TypeScript Fix applied here as well
    const currentUser = user as any;
    const userId = currentUser?._id || currentUser?.id;
    const userName = currentUser?.name || "Guest";

    if (socket && userId) {
      socket.emit("client_send_reply", {
        userId,
        userName,
        message: replyText,
      });
      toast.success("Reply sent to support!");
      setIsOpen(false); // Close modal on send
      setReplyText(""); // Reset text
    } else {
      toast.error("Connection error. Please refresh.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#0F172A] w-full max-w-sm rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Icon */}
            <div className="pt-6 pb-4 flex justify-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <MessageCircle size={32} className="text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 text-center relative z-10">
              <h3 className="text-xl font-black text-white mb-2">
                New Message
              </h3>

              {/* Admin Message Display */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-5">
                <p className="text-gray-200 text-sm font-medium leading-relaxed">
                  "{adminMessage}"
                </p>
              </div>

              {/* Reply Logic */}
              {!isReplying ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 text-sm font-semibold transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsReplying(true)}
                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 text-sm font-bold transition-all"
                  >
                    Reply
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <textarea
                    autoFocus // 🔥 UX Improvement: Automatically focuses
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full bg-black/40 text-white p-3 rounded-xl border border-indigo-500/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-sm resize-none h-24 placeholder:text-gray-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsReplying(false)}
                      className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 text-xs font-bold"
                    >
                      Back
                    </button>
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim()} // 🔥 UX: Disable if empty
                      className="flex-1 py-2 bg-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <Send size={14} /> Send
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Close X */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
