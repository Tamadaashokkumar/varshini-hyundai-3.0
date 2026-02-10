"use client";

import {
  MessageCircle,
  MessageSquareText,
  ArrowRight,
  Headset,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function SupportActionCards() {
  const router = useRouter();
  const pathname = usePathname();

  const whatsappNumber = "918096936290";
  const preFilledMessage =
    "Hello Hyundai Spares Team, I would like to enquire about spare parts. Please assist me with the details.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      preFilledMessage,
    )}`;
    window.open(url, "_blank");
  };

  // Hide on specific routes

  return (
    // ✨ Section Container: Rich Gradient Background
    <section className="relative w-full py-20 overflow-hidden bg-gray-50 dark:bg-[#050505] transition-colors duration-500">
      {/* 🌌 Background Ambience (Glow Orbs) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-200/50 dark:border-blue-500/20 backdrop-blur-sm">
            <Headset size={14} /> 24/7 Support
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
            We are here to help
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Can't find what you're looking for? Connect with our experts
            directly.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* ================= CARD 1: LIVE CHAT (Blue Theme) ================= */}
          <div
            onClick={() => router.push("/chat")}
            className="group relative cursor-pointer rounded-[2rem] p-1"
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />

            {/* Card Content */}
            <div className="relative h-full bg-white/80 dark:bg-[#121212]/90 backdrop-blur-2xl rounded-[1.9rem] p-8 border border-white/60 dark:border-white/10 shadow-xl shadow-blue-900/5 dark:shadow-none hover:translate-y-[-4px] transition-all duration-300 overflow-hidden">
              {/* Background Decor Icon */}
              <MessageSquareText className="absolute -bottom-10 -right-10 w-48 h-48 text-blue-500/5 dark:text-blue-500/10 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                {/* Icon Box */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <MessageSquareText className="h-8 w-8" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    Live Chat Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                    Start a conversation with our support team to verify part
                    compatibility and check real-time stock availability.
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-cyan-400 group-hover:gap-3 transition-all">
                    Start Chatting <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CARD 2: WHATSAPP (Green Theme) ================= */}
          <div
            onClick={handleWhatsAppClick}
            className="group relative cursor-pointer rounded-[2rem] p-1"
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />

            {/* Card Content */}
            <div className="relative h-full bg-white/80 dark:bg-[#121212]/90 backdrop-blur-2xl rounded-[1.9rem] p-8 border border-white/60 dark:border-white/10 shadow-xl shadow-green-900/5 dark:shadow-none hover:translate-y-[-4px] transition-all duration-300 overflow-hidden">
              {/* Background Decor Icon */}
              <MessageCircle className="absolute -bottom-10 -right-10 w-48 h-48 text-green-500/5 dark:text-emerald-500/10 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                {/* Icon Box */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <MessageCircle className="h-8 w-8" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-emerald-400 transition-colors">
                    Chat on WhatsApp
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                    Prefer mobile? Send us photos of your part directly on
                    WhatsApp for instant identification and pricing.
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-emerald-400 group-hover:gap-3 transition-all">
                    Open WhatsApp <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
