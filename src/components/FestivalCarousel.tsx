"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// 1. Interface Update
interface CarouselItem {
  _id: string;
  title: string;
  subtitle: string;
  discount: string;
  description: string;
  buttonText: string;
  link: string;
  image?: string; // 🔥 New Field: Image URL (Optional)
  bgClass: string; // Fallback Gradient if no image
  textClass: string;
  buttonClass: string;
  isActive: boolean;
}

interface ApiResponse {
  success: boolean;
  data: CarouselItem[];
}

const FestivalCarousel = () => {
  const [slides, setSlides] = useState<CarouselItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

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

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [current, slides.length, isPaused]);

  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  if (loading)
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-gray-100 dark:bg-gray-900 rounded-[2rem] animate-pulse flex items-center justify-center">
        <span className="text-gray-400 font-bold tracking-widest">
          LOADING OFFERS...
        </span>
      </div>
    );

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2rem] shadow-2xl transition-all duration-300 border border-gray-100 dark:border-white/10 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 w-full h-full flex items-center ${
            // ఇమేజ్ లేకపోతే గ్రేడియంట్ వాడుతుంది, ఉంటే నలుపు రంగు (backup)
            !slides[current].image ? slides[current].bgClass : "bg-gray-900"
          }`}
        >
          {/* 🔥 1. BACKGROUND IMAGE LOGIC */}
          {slides[current].image && (
            <>
              {/* Actual Image */}
              <motion.img
                src={slides[current].image}
                alt={slides[current].title}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6 }} // Ken Burns Effect (Slow Zoom)
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />

              {/* Dark Gradient Overlay (టెక్స్ట్ కనిపించడానికి చాలా ముఖ్యం) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />
            </>
          )}

          {/* 🔥 2. FALLBACK DESIGN (ఇమేజ్ లేనప్పుడు) */}
          {!slides[current].image && (
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />
          )}

          {/* 🔥 3. CONTENT CONTENT */}
          <div className="container mx-auto px-6 md:px-16 relative z-10 flex flex-col justify-center h-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-xl md:max-w-2xl"
            >
              {/* Discount Chip */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-lg">
                <Tag size={16} className="text-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-white shadow-black drop-shadow-md">
                  {slides[current].discount}
                </span>
              </div>

              {/* Title (Text Shadow యాడ్ చేసాను ఇమేజ్ మీద క్లియర్ గా ఉండడానికి) */}
              <h2
                className={`text-4xl md:text-6xl font-black mb-3 leading-none tracking-tight drop-shadow-xl text-white`}
              >
                {slides[current].title}
              </h2>

              {/* Subtitle */}
              <h3 className="text-xl md:text-2xl font-semibold mb-5 text-gray-200 drop-shadow-md">
                {slides[current].subtitle}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base mb-8 max-w-lg font-medium text-gray-300 leading-relaxed drop-shadow-sm">
                {slides[current].description}
              </p>

              {/* CTA Button */}
              <Link href={slides[current].link}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 transition-all ${slides[current].buttonClass}`}
                >
                  {slides[current].buttonText}
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation & Dots remain same... */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={28} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${index === current ? "w-10 bg-white" : "w-2 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FestivalCarousel;
