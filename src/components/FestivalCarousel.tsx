"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tag, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

// 🔥 Slide Animation Variants (Unchanged Logic)
const slideVariants = {
  enter: {
    x: "100%",
    opacity: 1,
    zIndex: 1,
  },
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    x: "-25%",
    opacity: 0,
    zIndex: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const FestivalCarousel = () => {
  const [slides, setSlides] = useState<CarouselItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- Fetch Data (Unchanged) ---
  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          "http://localhost:5000/api/carousel",
        );
        if (response.data?.success) setSlides(response.data.data);
      } catch (error) {
        console.error("Error loading carousel:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarousels();
  }, []);

  // --- Auto Play Logic (Unchanged) ---
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [current, slides.length]);

  // --- Text Animations ---
  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.4 + i * 0.1, // Slightly faster for snappier feel
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  if (loading)
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );

  if (slides.length === 0) return null;

  const currentSlide = slides[current];

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden font-sans bg-black">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full flex items-center"
        >
          {/* ================= BACKGROUND LAYER ================= */}
          <div className="absolute inset-0 w-full h-full">
            {currentSlide.image && (
              <div className="absolute inset-0 w-full h-full">
                {/* 🔥 UPDATED: Removed opacity & mix-blend. Image is 100% Clear. */}
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center scale-105" // scale-105 prevents white edges
                />
              </div>
            )}

            {/* 🔥 UPDATED OVERLAY: Gradient only on the left for text readability. 
                The right side remains crystal clear to show the product/image. */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

            {/* Optional: Bottom gradient for mobile readability */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-10 md:hidden" />
          </div>

          {/* ================= CONTENT LAYER ================= */}
          <div className="relative z-20 container mx-auto px-6 md:px-16 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              {/* 1. DISCOUNT TAG */}
              <motion.div
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="mb-6 inline-block"
              >
                <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-pink-600/90 backdrop-blur-md border border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                  <Sparkles size={14} className="text-white animate-pulse" />
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white">
                    {currentSlide.discount}
                  </span>
                </div>
              </motion.div>

              {/* 2. TITLE (Big & Bold) */}
              <motion.h1
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1] tracking-tighter mb-4 drop-shadow-2xl"
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
                <h3 className="text-2xl md:text-3xl font-light text-white/90 tracking-tight">
                  {currentSlide.subtitle}
                </h3>
                <p className="text-base md:text-lg text-white/80 font-medium leading-relaxed max-w-xl border-l-4 border-pink-500 pl-4">
                  {currentSlide.description}
                </p>
              </motion.div>

              {/* 4. BUTTON */}
              <motion.div
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <Link href={currentSlide.link}>
                  <button className="group relative px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                    <span className="relative z-10 flex items-center gap-2">
                      {currentSlide.buttonText}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* --- Progress Indicators (Clean & Visible) --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-16 z-30 flex gap-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="group relative py-2" // Larger hit area
          >
            <span
              className={`block h-1 rounded-full transition-all duration-500 shadow-sm ${
                current === idx
                  ? "w-12 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                  : "w-2 bg-white/40 group-hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default FestivalCarousel;
