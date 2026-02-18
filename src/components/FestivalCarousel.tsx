"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tag, ArrowRight } from "lucide-react";
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

// 🔥 NEW: Animation Variants (Slide Effect)
const slideVariants = {
  enter: {
    x: "100%", // కుడి వైపు నుండి వస్తుంది
    opacity: 1,
    zIndex: 1, // కొత్త స్లైడ్ పైన ఉంటుంది
  },
  center: {
    x: 0, // మధ్యలోకి వస్తుంది
    opacity: 1,
    zIndex: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // "Premium" Bezier Curve
    },
  },
  exit: {
    x: "-25%", // పాత స్లైడ్ కొంచెం ఎడమ వైపుకి వెళ్తుంది (Parallax)
    opacity: 0,
    zIndex: 0, // పాత స్లైడ్ వెనక్కి వెళ్తుంది
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

  // --- Fetch Data ---
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

  // --- Auto Play Logic ---
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [current, slides.length]);

  // --- Text Animations ---
  const textVariants = {
    hidden: { opacity: 0, x: 50 }, // టెక్స్ట్ కూడా పక్క నుండి వస్తుంది
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.6 + i * 0.1, // స్లైడ్ వచ్చిన తర్వాత టెక్స్ట్ వస్తుంది
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  if (loading)
    return (
      <div className="w-full h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );

  if (slides.length === 0) return null;

  const currentSlide = slides[current];

  return (
    <section className="relative w-full h-[85vh] md:h-screen overflow-hidden font-sans bg-black">
      {/* Slides Container */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={current}
          variants={slideVariants} // 🔥 Applying New Slide Variants
          initial="enter"
          animate="center"
          exit="exit"
          className={`absolute inset-0 w-full h-full flex items-center ${currentSlide.bgClass}`}
        >
          {/* ================= BACKGROUND LAYER ================= */}
          <div className="absolute inset-0 w-full h-full">
            {currentSlide.image && (
              <motion.div className="absolute inset-0 w-full h-full">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover opacity-50 mix-blend-overlay md:opacity-100 md:mix-blend-normal"
                />
              </motion.div>
            )}

            {/* Dark Gradient Overlay (Text Visibility) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
          </div>

          {/* ================= CONTENT LAYER ================= */}
          <div className="relative z-20 container mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
            <div className="max-w-4xl pl-2 md:pl-0 overflow-hidden">
              {" "}
              {/* overflow-hidden added to prevent text flicker */}
              {/* Discount Tag */}
              <motion.div
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="mb-6 inline-block"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                  <Tag size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-white">
                    {currentSlide.discount}
                  </span>
                </div>
              </motion.div>
              {/* Title */}
              <motion.h1
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-[0.95] tracking-tighter mb-6 drop-shadow-2xl"
              >
                {currentSlide.title}
              </motion.h1>
              {/* Subtitle */}
              <motion.div
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="mb-10 space-y-4 max-w-2xl"
              >
                <h3 className="text-2xl md:text-4xl font-light text-white/90">
                  {currentSlide.subtitle}
                </h3>
                <p className="text-base md:text-lg text-white/70 font-medium leading-relaxed">
                  {currentSlide.description}
                </p>
              </motion.div>
              {/* Button */}
              <motion.div
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <Link href={currentSlide.link}>
                  <button className="group relative px-10 py-5 bg-white text-black font-extrabold text-sm uppercase tracking-widest overflow-hidden rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                    <span className="relative z-10 flex items-center gap-3">
                      {currentSlide.buttonText}
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* --- Progress Bars (Bottom Right) --- */}
      <div className="absolute bottom-10 right-10 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              current === idx
                ? "w-12 bg-white"
                : "w-3 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default FestivalCarousel;
