"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";
import { ArrowRight, Sparkles, Tag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Interfaces ---
interface CarouselItem {
  _id: string;
  title: string;
  subtitle: string;
  discount: string;
  description: string;
  buttonText: string;
  link: string;
  image?: string;
  bgClass: string;
  textClass: string;
  buttonClass: string;
  isActive: boolean;
}

interface ApiResponse {
  success: boolean;
  data: CarouselItem[];
}

// 🔥 Mobile Optimized Slide Transition
const slideVariants = {
  enter: {
    x: "100%",
    opacity: 0,
    zIndex: 1,
  },
  center: {
    x: 0,
    opacity: 1,
    zIndex: 2,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    x: "-20%",
    opacity: 0,
    zIndex: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const FestivalCarousel = () => {
  const [slides, setSlides] = useState<CarouselItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const response = await apiClient.get<ApiResponse>("/carousel");

        if (response.data?.success) {
          const activeSlides = response.data.data.filter(
            (slide) => slide.isActive !== false,
          );
          setSlides(
            activeSlides.length > 0 ? activeSlides : response.data.data,
          );
        }
      } catch (error) {
        console.error("Error loading carousel:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarousels();
  }, []);

  // --- Auto Play Logic ---
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [current, slides.length]);

  // --- Staggered Text Animations (Blur Removed for Mobile Speed) ---
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  if (loading)
    return (
      <div className="w-full h-[100dvh] bg-[#050505] flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/10 border-t-pink-500 rounded-full animate-spin absolute" />
          <Sparkles className="text-pink-500 animate-pulse" size={24} />
        </div>
      </div>
    );

  if (slides.length === 0) return null;

  const currentSlide = slides[current];

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden font-sans bg-[#030303]">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full flex items-center bg-[#0a0a0a]"
        >
          {/* ================= BACKGROUND LAYER ================= */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {currentSlide.image && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }} // స్కేల్ కొంచెం తగ్గించాం
                transition={{ duration: 10, ease: "linear" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title || "Festival Banner"}
                  fill
                  sizes="100vw"
                  className="object-cover object-center" // 🔥 opacity తీసేశాం, ఒరిజినల్ క్వాలిటీ వస్తుంది
                  priority={current === 0}
                  quality={75}
                />
              </motion.div>
            )}

            {/* 🔥 PREMIUM OVERLAYS */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 sm:hidden pointer-events-none" />
          </div>

          {/* ================= CONTENT LAYER ================= */}
          <div className="relative z-20 container mx-auto px-6 sm:px-10 lg:px-20 h-full flex flex-col justify-center mt-12 sm:mt-0">
            <div className="max-w-3xl">
              {/* 1. DISCOUNT TAG */}
              {currentSlide.discount && (
                <motion.div
                  custom={0}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-6 inline-block"
                >
                  <div className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-pink-600/90 to-purple-600/90 backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(236,72,153,0.3)]">
                    <Tag size={14} className="text-white" />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                      {currentSlide.discount}
                    </span>
                    <Sparkles
                      size={14}
                      className="text-yellow-300 animate-pulse ml-1"
                    />
                  </div>
                </motion.div>
              )}

              {/* 2. TITLE */}
              <motion.h1
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-5 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              >
                {currentSlide.title}
              </motion.h1>

              {/* 3. SUBTITLE & DESC */}
              <motion.div
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="mb-8 space-y-4"
              >
                {currentSlide.subtitle && (
                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-light text-gray-200 tracking-tight drop-shadow-lg">
                    {currentSlide.subtitle}
                  </h3>
                )}
                {currentSlide.description && (
                  <div className="relative pl-5 border-l-4 border-pink-500 max-w-xl">
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-pink-500/20 to-transparent -z-10 blur-sm" />
                    <p className="text-sm sm:text-lg text-gray-300 font-medium leading-relaxed drop-shadow-md">
                      {currentSlide.description}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* 4. BUTTON */}
              {currentSlide.link && (
                <motion.div
                  custom={3}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link href={currentSlide.link}>
                    <button className="group relative px-8 py-3.5 sm:px-10 sm:py-4 bg-white text-black font-extrabold text-sm sm:text-base uppercase tracking-widest rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,255,255,0.4)] active:scale-95">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {currentSlide.buttonText || "Shop Now"}
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1.5 transition-transform duration-300"
                        />
                      </span>
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* --- Progress Indicators --- */}
      <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-10 lg:left-20 z-30 flex gap-2 sm:gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="group relative py-2 outline-none flex items-center justify-center"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span
              className={`block h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out ${
                current === idx
                  ? "w-10 sm:w-16 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  : "w-2 sm:w-4 bg-white/40 group-hover:bg-white/70"
              }`}
            >
              {current === idx && (
                <motion.span
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="block h-full bg-pink-500 rounded-full"
                />
              )}
            </span>
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
};

export default FestivalCarousel;
