"use client";

import ChatComponent from "@/components/ChatComponent";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // useState import చేయండి

export default function ChatPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // హైడ్రేషన్ ఎర్రర్స్ రాకుండా మౌంట్ చెక్
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // ఇంకా లోడ్ అవుతుంటే లేదా క్లయింట్ సైడ్ మౌంట్ కాకపోతే
  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  // అడ్మిన్ ఐడి (మీరు హార్డ్ కోడ్ చేసినది లేదా env నుండి)
  const adminId =
    process.env.NEXT_PUBLIC_ADMIN_ID || "694673ed8eac361b130a1b5d";

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-100 box-border">
      <ChatComponent
        // 🔥 FIX: user.id బదులు user._id వాడండి (Backup గా user.id)
        currentUserId={user._id || user.id}
        otherUserId={adminId}
        otherUserModel="Admin"
      />
    </div>
  );
}
