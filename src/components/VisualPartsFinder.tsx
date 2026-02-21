"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, Zap, ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ============================================================================
// 1. TYPES
// ============================================================================

interface HotspotData {
  categorySlug: string;
  productCount: number;
  lowestPrice: number | null;
  topProductImage: string | null;
  inStock: boolean;
  hasFlashSale: boolean;
  loading: boolean;
  error: string | null;
}

interface Hotspot {
  id: string;
  label: string;
  categorySlug: string;
  x: number;
  y: number;
}

// ============================================================================
// 2. CONFIGURATION
// ============================================================================

const HOTSPOTS: Hotspot[] = [
  {
    id: "hs-headlight-l",
    label: "Headlight (L)",
    categorySlug: "Electrical",
    x: 9,
    y: 27,
  },
  {
    id: "hs-headlight-r",
    label: "Headlight (R)",
    categorySlug: "Electrical",
    x: 23,
    y: 27,
  },
  {
    id: "hs-grille",
    label: "Front Grille",
    categorySlug: "Body",
    x: 16,
    y: 28,
  },
  {
    id: "hs-f-bumper",
    label: "Front Bumper",
    categorySlug: "Body",
    x: 16,
    y: 38,
  },
  {
    id: "hs-fog-lamp",
    label: "Fog Lamps",
    categorySlug: "Electrical",
    x: 9,
    y: 34,
  },
  {
    id: "hs-logo-f",
    label: "Front Emblem",
    categorySlug: "Accessories",
    x: 16,
    y: 22,
  },
  {
    id: "hs-bonnet",
    label: "Bonnet / Hood",
    categorySlug: "Body",
    x: 45,
    y: 25,
  },
  {
    id: "hs-wipers",
    label: "Wiper Blades",
    categorySlug: "Electrical",
    x: 53,
    y: 20,
  },
  {
    id: "hs-windshield",
    label: "Front Windshield",
    categorySlug: "Body",
    x: 55,
    y: 25,
  },
  {
    id: "hs-sunroof",
    label: "Sunroof / Roof",
    categorySlug: "Body",
    x: 65,
    y: 25,
  },
  {
    id: "hs-boot-top",
    label: "Boot Lid (Top)",
    categorySlug: "Body",
    x: 85,
    y: 25,
  },
  {
    id: "hs-tail-l",
    label: "Tail Lamp (L)",
    categorySlug: "Electrical",
    x: 6,
    y: 69,
  },
  {
    id: "hs-tail-r",
    label: "Tail Lamp (R)",
    categorySlug: "Electrical",
    x: 26,
    y: 69,
  },
  {
    id: "hs-r-bumper",
    label: "Rear Bumper",
    categorySlug: "Body",
    x: 16,
    y: 78,
  },
  {
    id: "hs-boot-back",
    label: "Tailgate / Trunk",
    categorySlug: "Body",
    x: 16,
    y: 65,
  },
  {
    id: "hs-exhaust",
    label: "Exhaust Tip",
    categorySlug: "Engine",
    x: 24,
    y: 78,
  },
  {
    id: "hs-f-wheel",
    label: "Front Wheel",
    categorySlug: "Suspension",
    x: 48,
    y: 80,
  },
  {
    id: "hs-r-wheel",
    label: "Rear Wheel",
    categorySlug: "Suspension",
    x: 82,
    y: 80,
  },
  {
    id: "hs-side-mirror",
    label: "Side Mirror",
    categorySlug: "Accessories",
    x: 56,
    y: 65,
  },
  {
    id: "hs-door-handle",
    label: "Door Handles",
    categorySlug: "Body",
    x: 62,
    y: 66,
  },
  { id: "hs-f-door", label: "Door Panel", categorySlug: "Body", x: 58, y: 70 },
];

// ============================================================================
// 3. COMPONENT
// ============================================================================

export default function VisualPartsFinder() {
  const router = useRouter();
  const [hotspotData, setHotspotData] = useState<Map<string, HotspotData>>(
    new Map(),
  );
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [imgSrc, setImgSrc] = useState("/images/carWire.png");
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Optimized Data Fetch ---
  useEffect(() => {
    // 🔥 FIX 1: 21 టైమర్స్ లేకుండా ఒకేసారి (Batch update) డేటాను జనరేట్ చేస్తున్నాం
    const loadData = () => {
      const categories = [...new Set(HOTSPOTS.map((h) => h.categorySlug))];
      const newMap = new Map<string, HotspotData>();

      categories.forEach((cat) => {
        const isSale = Math.random() > 0.8;
        newMap.set(cat, {
          categorySlug: cat,
          productCount: Math.floor(Math.random() * 40) + 5,
          lowestPrice: Math.floor(Math.random() * 8000) + 400,
          topProductImage: null,
          inStock: Math.random() > 0.1,
          hasFlashSale: isSale,
          loading: false, // డైరెక్ట్ గా డేటా ఇచ్చేస్తున్నాం
          error: null,
        });
      });

      setHotspotData(newMap);
    };

    // జస్ట్ 1 సెకండ్ డిలే తర్వాత మొత్తం డేటా ఒకేసారి వస్తుంది (మెమరీ లీక్ ఉండదు)
    const timer = setTimeout(loadData, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDotClick = (categorySlug: string) => {
    router.push(`/products?category=${categorySlug}`);
  };

  return (
    <section className="vpf-section" ref={containerRef}>
      {/* 🔥 FIX 2: CSS Background Grid ని లైట్ చేశాం (యానిమేషన్ జెర్క్ లేకుండా) */}
      <div className="vpf-grid-bg" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/50 dark:to-[#0f0014] pointer-events-none transform-gpu" />

      <div className="vpf-container">
        {/* Header */}
        <div className="vpf-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} // 🔥 FIX 3: స్క్రోల్ చేసిన ప్రతీసారి కాకుండా ఒక్కసారే యానిమేట్ అవ్వాలి
            className="vpf-badge"
          >
            <ScanLine size={12} className="mr-1" /> INTERACTIVE BLUEPRINT
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="vpf-title"
          >
            Visual Parts <span className="text-highlight">Finder</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="vpf-subtitle"
          >
            Explore 20+ key components. <b>Click any dot</b> to browse genuine
            parts instantly.
          </motion.p>
        </div>

        {/* Blueprint Card */}
        <motion.div
          className="vpf-blueprint-card"
          initial={{ opacity: 0, y: 30 }} // scale బదులు y (మొబైల్ కి బెటర్)
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Tech Corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500/50 rounded-br-lg" />

          {/* Scanner Animation Line - మొబైల్ లో ఆఫ్ చేయడం మంచిది, కానీ ఉంచాను, transform-gpu యాడ్ చేశాను */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-[100px] w-full z-10 pointer-events-none transform-gpu hidden md:block" // 🔥 Mobile lo hide chesam
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <div className="vpf-canvas">
            {!isImageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-50 min-h-[400px] md:min-h-[600px]">
                <div className="p-6 bg-white/80 dark:bg-[#0f0014]/80 backdrop-blur-md rounded-2xl shadow-xl flex flex-col items-center border border-indigo-100 dark:border-indigo-500/20">
                  <Loader2
                    className="animate-spin text-indigo-500"
                    size={44}
                    strokeWidth={2.5}
                  />
                  <span className="mt-4 font-mono text-xs uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-bold">
                    Loading Schematic...
                  </span>
                </div>
              </div>
            )}

            <div
              className={`vpf-image-wrapper ${isImageLoaded ? "loaded" : ""}`}
            >
              <Image
                src={imgSrc}
                alt="Car Blueprint"
                width={918}
                height={630}
                className="vpf-car-img"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  setImgSrc(
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Blueprint_car.svg/1280px-Blueprint_car.svg.png",
                  );
                }}
                quality={90}
                unoptimized={imgSrc.startsWith("http")}
                priority={false}
              />

              {/* Hotspots Layer */}
              {isImageLoaded &&
                HOTSPOTS.map((hotspot) => {
                  const data = hotspotData.get(hotspot.categorySlug);
                  const isActive = activeHotspot === hotspot.id;

                  return (
                    <div
                      key={hotspot.id}
                      className="vpf-hotspot-container"
                      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                      onMouseEnter={() => setActiveHotspot(hotspot.id)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      onClick={() => {
                        // 🔥 మొబైల్ లో క్లిక్ చేసినప్పుడు కూడా ఓపెన్ అవ్వడానికి
                        if (activeHotspot === hotspot.id) {
                          setActiveHotspot(null);
                        } else {
                          setActiveHotspot(hotspot.id);
                        }
                      }}
                    >
                      <button
                        className={`vpf-dot ${isActive ? "active" : ""}`}
                        aria-label={`View ${hotspot.label}`}
                      >
                        <div className="vpf-ring" />
                        <div className="vpf-core" />
                      </button>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            className="vpf-tooltip"
                            initial={{
                              opacity: 0,
                              y: 10,
                              x: "-50%",
                            }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 5, x: "-50%" }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="vpf-tooltip-header">
                              <span className="vpf-tooltip-title">
                                {hotspot.label}
                              </span>
                              {data?.hasFlashSale && (
                                <span className="vpf-flash-badge">
                                  <Zap size={10} className="fill-white" /> SALE
                                </span>
                              )}
                            </div>

                            {!data ? (
                              <div className="vpf-tooltip-loading">
                                <Loader2
                                  className="animate-spin text-indigo-500"
                                  size={14}
                                />
                                <span>Loading...</span>
                              </div>
                            ) : (
                              <div className="vpf-tooltip-body">
                                <div className="flex flex-col">
                                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                                    Starting From
                                  </span>
                                  <span className="text-xl font-black text-indigo-400">
                                    {data?.lowestPrice
                                      ? formatPrice(data.lowestPrice)
                                      : "N/A"}
                                  </span>
                                  <div
                                    className={`vpf-stock-pill ${data?.inStock ? "ok" : "out"}`}
                                  >
                                    <div
                                      className={`w-1.5 h-1.5 rounded-full ${data?.inStock ? "bg-green-400" : "bg-red-400"}`}
                                    />
                                    {data?.inStock
                                      ? "In Stock"
                                      : "Out of Stock"}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div
                              className="vpf-tooltip-footer cursor-pointer hover:bg-indigo-50 dark:hover:bg-white/5 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDotClick(hotspot.categorySlug);
                              }}
                            >
                              <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 flex items-center justify-center w-full py-2">
                                Tap to View{" "}
                                <ChevronRight size={12} className="ml-1" />
                              </span>
                            </div>

                            <div className="vpf-tooltip-arrow" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        /* 🔥 CSS Optimization: Removed heavy filters and mix-blend-mode for mobile */
        .vpf-section {
          --c-bg: #f8fafc;
          --c-card: rgba(255, 255, 255, 0.9);
          --c-accent: #6366f1;
          --c-text: #0f172a;
          --c-border: rgba(99, 102, 241, 0.2);
          --c-tooltip-bg: rgba(255, 255, 255, 0.98);
          --dot-core: #6366f1;
          --img-filter: grayscale(100%) contrast(1.1); /* Removed opacity to fix render bug */
          position: relative;
          padding: 6rem 1rem;
          min-height: auto; /* Changed from fixed 900px */
          color: var(--c-text);
          font-family: "Inter", sans-serif;
          overflow: hidden;
        }

        :global(.dark) .vpf-section {
          --c-bg: #0f0014;
          --c-card: rgba(20, 10, 30, 0.8);
          --c-accent: #d946ef;
          --c-text: #f3f4f6;
          --c-border: rgba(217, 70, 239, 0.3);
          --c-tooltip-bg: rgba(15, 5, 20, 0.98);
          --dot-core: #d946ef;
          /* 🔥 Removed Drop Shadow & Hue Rotate to save mobile CPU */
          --img-filter: invert(1) brightness(1.2);
        }

        .vpf-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }
        .vpf-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .vpf-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        @media (min-width: 768px) {
          .vpf-title {
            font-size: 3rem;
          }
        }
        .text-highlight {
          background: linear-gradient(135deg, var(--c-accent), #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .vpf-subtitle {
          color: #94a3b8;
          max-width: 500px;
          margin: 0 auto;
          font-size: 1rem;
        }
        .vpf-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid var(--c-border);
          color: var(--c-accent);
          font-size: 0.75rem;
          border-radius: 99px;
          margin-bottom: 1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .vpf-blueprint-card {
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          /* 🔥 Reduced blur for mobile performance */
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .vpf-blueprint-card {
            padding: 3rem;
            border-radius: 30px;
            backdrop-filter: blur(20px);
          }
        }

        .vpf-grid-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            var(--c-border) 1px,
            transparent 1px
          );
          background-size: 20px 20px; /* Made grid smaller */
          opacity: 0.5;
        }

        .vpf-canvas {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .vpf-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 1000px;
          transition: opacity 0.5s;
          opacity: 0;
        }
        .vpf-image-wrapper.loaded {
          opacity: 1;
        }
        .vpf-car-img {
          width: 100%;
          height: auto;
          display: block;
          filter: var(--img-filter);
          /* 🔥 Removed mix-blend-mode for performance */
        }

        .vpf-hotspot-container {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 20;
        }
        .vpf-dot {
          position: relative;
          width: 32px; /* Made clickable area larger for touch */
          height: 32px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .vpf-core {
          width: 8px;
          height: 8px;
          background: var(--dot-core);
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 0 8px var(--dot-core);
          transition: 0.2s;
        }
        .vpf-ring {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 1px solid var(--dot-core);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.5);
          animation: ripple 2.5s infinite;
        }

        .vpf-hotspot-container:hover .vpf-core,
        .vpf-dot.active .vpf-core {
          transform: scale(1.5);
          background: #fff;
        }
        .vpf-hotspot-container:hover .vpf-ring,
        .vpf-dot.active .vpf-ring {
          animation: none;
          border-color: #fff;
          opacity: 1;
          transform: scale(1.2);
        }
        @keyframes ripple {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .vpf-tooltip {
          position: absolute;
          bottom: 40px;
          left: 50%;
          width: 180px;
          background: var(--c-tooltip-bg);
          color: var(--c-text);
          border: 1px solid var(--c-border);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 10px;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4);
          z-index: 100;
          cursor: pointer;
        }
        .vpf-tooltip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--c-border);
          padding-bottom: 6px;
          margin-bottom: 6px;
        }
        .vpf-tooltip-title {
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        .vpf-flash-badge {
          background: #ef4444;
          color: white;
          font-size: 0.55rem;
          padding: 2px 5px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: bold;
        }
        .vpf-tooltip-footer {
          margin-top: 6px;
          border-top: 1px solid var(--c-border);
          padding-top: 4px;
          display: flex;
          justify-content: center;
        }
        .vpf-tooltip-arrow {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background: var(--c-tooltip-bg);
          border-right: 1px solid var(--c-border);
          border-bottom: 1px solid var(--c-border);
        }

        .vpf-stock-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.65rem;
          font-weight: 600;
          margin-top: 2px;
          color: #94a3b8;
        }
        .vpf-stock-pill.ok {
          color: #4ade80;
        }
        .vpf-stock-pill.out {
          color: #f87171;
        }

        @media (max-width: 768px) {
          .vpf-section {
            padding: 2rem 0.5rem;
          }
          /* మొబైల్ లో Tooltip మరీ పక్కకు పోకుండా */
          .vpf-tooltip {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
