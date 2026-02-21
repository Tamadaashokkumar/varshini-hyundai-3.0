// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronRight, Package, Loader2, Zap, ScanLine } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Image from "next/image"; // 🔥 ADDED: Next.js Image for Performance

// // ============================================================================
// // 1. TYPES
// // ============================================================================

// interface HotspotData {
//   categorySlug: string;
//   productCount: number;
//   lowestPrice: number | null;
//   topProductImage: string | null;
//   inStock: boolean;
//   hasFlashSale: boolean;
//   loading: boolean;
//   error: string | null;
// }

// interface Hotspot {
//   id: string;
//   label: string;
//   categorySlug: string;
//   x: number;
//   y: number;
// }

// // ============================================================================
// // 2. CONFIGURATION (Updated: 21 Accurate Points)
// // ============================================================================

// const HOTSPOTS: Hotspot[] = [
//   // --- FRONT VIEW (Top Left Area) ---
//   {
//     id: "hs-headlight-l",
//     label: "Headlight (L)",
//     categorySlug: "Electrical",
//     x: 9,
//     y: 27,
//   },
//   {
//     id: "hs-headlight-r",
//     label: "Headlight (R)",
//     categorySlug: "Electrical",
//     x: 23,
//     y: 27,
//   },
//   {
//     id: "hs-grille",
//     label: "Front Grille",
//     categorySlug: "Body",
//     x: 16,
//     y: 28,
//   },
//   {
//     id: "hs-f-bumper",
//     label: "Front Bumper",
//     categorySlug: "Body",
//     x: 16,
//     y: 38,
//   },
//   {
//     id: "hs-fog-lamp",
//     label: "Fog Lamps",
//     categorySlug: "Electrical",
//     x: 9,
//     y: 34,
//   },
//   {
//     id: "hs-logo-f",
//     label: "Front Emblem",
//     categorySlug: "Accessories",
//     x: 16,
//     y: 22,
//   },

//   // --- TOP VIEW (Top Right Area) ---
//   {
//     id: "hs-bonnet",
//     label: "Bonnet / Hood",
//     categorySlug: "Body",
//     x: 45,
//     y: 25,
//   },
//   {
//     id: "hs-wipers",
//     label: "Wiper Blades",
//     categorySlug: "Electrical",
//     x: 53,
//     y: 20,
//   },
//   {
//     id: "hs-windshield",
//     label: "Front Windshield",
//     categorySlug: "Body",
//     x: 55,
//     y: 25,
//   },
//   {
//     id: "hs-sunroof",
//     label: "Sunroof / Roof",
//     categorySlug: "Body",
//     x: 65,
//     y: 25,
//   },
//   {
//     id: "hs-boot-top",
//     label: "Boot Lid (Top)",
//     categorySlug: "Body",
//     x: 85,
//     y: 25,
//   },

//   // --- REAR VIEW (Bottom Left Area) ---
//   {
//     id: "hs-tail-l",
//     label: "Tail Lamp (L)",
//     categorySlug: "Electrical",
//     x: 6,
//     y: 69,
//   },
//   {
//     id: "hs-tail-r",
//     label: "Tail Lamp (R)",
//     categorySlug: "Electrical",
//     x: 26,
//     y: 69,
//   },
//   {
//     id: "hs-r-bumper",
//     label: "Rear Bumper",
//     categorySlug: "Body",
//     x: 16,
//     y: 78,
//   },
//   {
//     id: "hs-boot-back",
//     label: "Tailgate / Trunk",
//     categorySlug: "Body",
//     x: 16,
//     y: 65,
//   },
//   {
//     id: "hs-exhaust",
//     label: "Exhaust Tip",
//     categorySlug: "Engine",
//     x: 24,
//     y: 78,
//   },

//   // --- SIDE VIEW (Bottom Right Area) ---
//   {
//     id: "hs-f-wheel",
//     label: "Front Wheel",
//     categorySlug: "Suspension",
//     x: 48,
//     y: 80,
//   },
//   {
//     id: "hs-r-wheel",
//     label: "Rear Wheel",
//     categorySlug: "Suspension",
//     x: 82,
//     y: 80,
//   },
//   {
//     id: "hs-side-mirror",
//     label: "Side Mirror",
//     categorySlug: "Accessories",
//     x: 56,
//     y: 65,
//   },
//   {
//     id: "hs-door-handle",
//     label: "Door Handles",
//     categorySlug: "Body",
//     x: 62,
//     y: 66,
//   },
//   { id: "hs-f-door", label: "Door Panel", categorySlug: "Body", x: 58, y: 70 },
// ];

// // ============================================================================
// // 3. COMPONENT
// // ============================================================================

// export default function VisualPartsFinder() {
//   const router = useRouter();
//   const [hotspotData, setHotspotData] = useState<Map<string, HotspotData>>(
//     new Map(),
//   );
//   const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
//   const [isImageLoaded, setIsImageLoaded] = useState(false);

//   // 🔥 ADDED: State for managing image source safely
//   const [imgSrc, setImgSrc] = useState("/images/carWire.png");

//   const containerRef = useRef<HTMLDivElement>(null);

//   // --- Mock Data Fetch ---
//   useEffect(() => {
//     const categories = [...new Set(HOTSPOTS.map((h) => h.categorySlug))];

//     categories.forEach((cat) => {
//       setHotspotData((prev) =>
//         new Map(prev).set(cat, {
//           categorySlug: cat,
//           productCount: 0,
//           lowestPrice: null,
//           topProductImage: null,
//           inStock: false,
//           hasFlashSale: false,
//           loading: true,
//           error: null,
//         }),
//       );

//       setTimeout(
//         () => {
//           setHotspotData((prev) => {
//             const newData = new Map(prev);
//             const isSale = Math.random() > 0.8;
//             newData.set(cat, {
//               categorySlug: cat,
//               productCount: Math.floor(Math.random() * 40) + 5,
//               lowestPrice: Math.floor(Math.random() * 8000) + 400,
//               topProductImage: null,
//               inStock: Math.random() > 0.1,
//               hasFlashSale: isSale,
//               loading: false,
//               error: null,
//             });
//             return newData;
//           });
//         },
//         1000 + Math.random() * 1500,
//       );
//     });
//   }, []);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const handleDotClick = (categorySlug: string) => {
//     router.push(`/products?category=${categorySlug}`);
//   };

//   return (
//     <section className="vpf-section" ref={containerRef}>
//       <div className="vpf-grid-bg" />
//       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/50 dark:to-[#0f0014] pointer-events-none" />

//       <div className="vpf-container">
//         {/* Header */}
//         <div className="vpf-header">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="vpf-badge"
//           >
//             <ScanLine size={12} className="mr-1" /> INTERACTIVE BLUEPRINT
//           </motion.div>

//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="vpf-title"
//           >
//             Visual Parts <span className="text-highlight">Finder</span>
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="vpf-subtitle"
//           >
//             Explore 20+ key components. <b>Click any dot</b> to browse genuine
//             parts instantly.
//           </motion.p>
//         </div>

//         {/* Blueprint Card */}
//         <motion.div
//           className="vpf-blueprint-card"
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
//         >
//           {/* Tech Corners */}
//           <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-lg" />
//           <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-lg" />
//           <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-lg" />
//           <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500/50 rounded-br-lg" />

//           {/* Scanner Animation Line */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-[100px] w-full z-10 pointer-events-none"
//             animate={{ top: ["-10%", "110%"] }}
//             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
//           />

//           <div className="vpf-canvas">
//             {!isImageLoaded && (
//               // 🔥 ఇక్కడ absolute, inset-0 మరియు flex సెట్టింగ్స్ యాడ్ చేశాను
//               <div className="absolute inset-0 flex flex-col items-center justify-center z-50 min-h-[400px] md:min-h-[600px]">
//                 <div className="p-6 bg-white/80 dark:bg-[#0f0014]/80 backdrop-blur-md rounded-2xl shadow-xl flex flex-col items-center border border-indigo-100 dark:border-indigo-500/20">
//                   <Loader2
//                     className="animate-spin text-indigo-500"
//                     size={44}
//                     strokeWidth={2.5}
//                   />
//                   <span className="mt-4 font-mono text-xs uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-bold">
//                     Loading Schematic...
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div
//               className={`vpf-image-wrapper ${isImageLoaded ? "loaded" : ""}`}
//             >
//               {/* 🔥 UPDATED: Next.js Image Component */}
//               <Image
//                 src={imgSrc}
//                 alt="Car Blueprint"
//                 width={918}
//                 height={630}
//                 className="vpf-car-img"
//                 onLoad={() => setIsImageLoaded(true)}
//                 onError={() => {
//                   // ఇమేజ్ దొరకకపోతే వికీపీడియా ఫాల్‌బ్యాక్ వాడుతున్నాం. (unoptimized ద్వారా ఎర్రర్స్ రావు)
//                   setImgSrc(
//                     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Blueprint_car.svg/1280px-Blueprint_car.svg.png",
//                   );
//                 }}
//                 unoptimized={imgSrc.startsWith("http")} // వికీపీడియా లింక్ కోసం నెక్స్ట్.కాన్ఫిగ్ ఎర్రర్ రాకుండా
//                 priority={false} // ఇది కింద ఉంటుంది కాబట్టి లేజీ లోడ్ అవ్వడం మంచిది
//               />

//               {/* Hotspots Layer */}
//               {isImageLoaded &&
//                 HOTSPOTS.map((hotspot) => {
//                   const data = hotspotData.get(hotspot.categorySlug);
//                   const isActive = activeHotspot === hotspot.id;

//                   return (
//                     <div
//                       key={hotspot.id}
//                       className="vpf-hotspot-container"
//                       style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
//                       onMouseEnter={() => setActiveHotspot(hotspot.id)}
//                       onMouseLeave={() => setActiveHotspot(null)}
//                     >
//                       <button
//                         className={`vpf-dot ${isActive ? "active" : ""}`}
//                         onClick={() => handleDotClick(hotspot.categorySlug)}
//                         aria-label={`View ${hotspot.label}`}
//                       >
//                         <div className="vpf-ring" />
//                         <div className="vpf-core" />
//                       </button>

//                       <AnimatePresence>
//                         {isActive && (
//                           <motion.div
//                             className="vpf-tooltip"
//                             initial={{
//                               opacity: 0,
//                               y: 10,
//                               scale: 0.95,
//                               x: "-50%",
//                             }}
//                             animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
//                             exit={{ opacity: 0, y: 5, scale: 0.95, x: "-50%" }}
//                             transition={{ duration: 0.2 }}
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <div className="vpf-tooltip-header">
//                               <span className="vpf-tooltip-title">
//                                 {hotspot.label}
//                               </span>
//                               {data?.hasFlashSale && (
//                                 <span className="vpf-flash-badge">
//                                   <Zap size={10} className="fill-white" /> SALE
//                                 </span>
//                               )}
//                             </div>

//                             {data?.loading ? (
//                               <div className="vpf-tooltip-loading">
//                                 <Loader2
//                                   className="animate-spin text-indigo-500"
//                                   size={14}
//                                 />
//                                 <span>Checking...</span>
//                               </div>
//                             ) : (
//                               <div className="vpf-tooltip-body">
//                                 <div className="flex flex-col">
//                                   <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
//                                     Starting From
//                                   </span>
//                                   <span className="text-xl font-black text-indigo-400">
//                                     {data?.lowestPrice
//                                       ? formatPrice(data.lowestPrice)
//                                       : "N/A"}
//                                   </span>
//                                   <div
//                                     className={`vpf-stock-pill ${data?.inStock ? "ok" : "out"}`}
//                                   >
//                                     <div
//                                       className={`w-1.5 h-1.5 rounded-full ${data?.inStock ? "bg-green-400" : "bg-red-400"}`}
//                                     />
//                                     {data?.inStock
//                                       ? "In Stock"
//                                       : "Out of Stock"}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}

//                             <div
//                               className="vpf-tooltip-footer cursor-pointer hover:bg-indigo-50 dark:hover:bg-white/5 transition-colors"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDotClick(hotspot.categorySlug);
//                               }}
//                             >
//                               <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 flex items-center justify-center w-full py-2">
//                                 Tap to View{" "}
//                                 <ChevronRight size={12} className="ml-1" />
//                               </span>
//                             </div>

//                             <div className="vpf-tooltip-arrow" />
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       <style jsx>{`
//         /* Styles remain completely unchanged */
//         .vpf-section {
//           --c-bg: #f8fafc;
//           --c-card: rgba(255, 255, 255, 0.8);
//           --c-accent: #6366f1;
//           --c-text: #0f172a;
//           --c-border: rgba(99, 102, 241, 0.1);
//           --c-tooltip-bg: rgba(255, 255, 255, 0.95);
//           --dot-core: #6366f1;
//           --dot-ring: rgba(99, 102, 241, 0.4);
//           --img-filter: grayscale(100%) contrast(1.1) opacity(0.8);
//           --img-blend: multiply;
//           position: relative;
//           padding: 6rem 1rem;
//           min-height: 900px;
//           color: var(--c-text);
//           font-family: "Inter", sans-serif;
//           overflow: hidden;
//         }

//         :global(.dark) .vpf-section {
//           --c-bg: #0f0014;
//           --c-card: rgba(20, 10, 30, 0.6);
//           --c-accent: #d946ef;
//           --c-text: #f3f4f6;
//           --c-border: rgba(217, 70, 239, 0.2);
//           --c-tooltip-bg: rgba(15, 5, 20, 0.95);
//           --dot-core: #d946ef;
//           --dot-ring: rgba(217, 70, 239, 0.4);
//           --img-filter: invert(1) hue-rotate(180deg) brightness(1.2)
//             drop-shadow(0 0 5px rgba(217, 70, 239, 0.3));
//           --img-blend: screen;
//         }

//         .vpf-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           position: relative;
//           z-index: 10;
//         }
//         .vpf-header {
//           text-align: center;
//           margin-bottom: 4rem;
//         }
//         .vpf-title {
//           font-size: 3rem;
//           font-weight: 900;
//           margin-bottom: 1rem;
//           letter-spacing: -0.02em;
//         }
//         .text-highlight {
//           background: linear-gradient(135deg, var(--c-accent), #8b5cf6);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }
//         .vpf-subtitle {
//           color: #94a3b8;
//           max-width: 500px;
//           margin: 0 auto;
//           font-size: 1.1rem;
//         }
//         .vpf-badge {
//           display: inline-flex;
//           align-items: center;
//           padding: 0.4rem 1rem;
//           background: rgba(99, 102, 241, 0.1);
//           border: 1px solid var(--c-border);
//           color: var(--c-accent);
//           font-size: 0.75rem;
//           border-radius: 99px;
//           margin-bottom: 1.5rem;
//           font-weight: 700;
//           letter-spacing: 0.1em;
//         }

//         .vpf-blueprint-card {
//           background: var(--c-card);
//           border: 1px solid var(--c-border);
//           border-radius: 30px;
//           padding: 3rem;
//           position: relative;
//           backdrop-filter: blur(20px);
//           box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.3);
//           overflow: hidden;
//         }
//         .vpf-grid-bg {
//           position: absolute;
//           inset: 0;
//           background-image: radial-gradient(
//             var(--c-border) 1px,
//             transparent 1px
//           );
//           background-size: 30px 30px;
//           opacity: 0.3;
//         }
//         .vpf-canvas {
//           position: relative;
//           width: 100%;
//           display: flex;
//           justify-content: center;
//         }
//         .vpf-image-wrapper {
//           position: relative;
//           width: 100%;
//           max-width: 1000px;
//           transition: opacity 0.5s;
//           opacity: 0;
//         }
//         .vpf-image-wrapper.loaded {
//           opacity: 1;
//         }
//         .vpf-car-img {
//           width: 100%;
//           height: auto;
//           display: block;
//           filter: var(--img-filter);
//           mix-blend-mode: var(--img-blend);
//           opacity: 0.9;
//         }

//         .vpf-hotspot-container {
//           position: absolute;
//           transform: translate(-50%, -50%);
//           z-index: 20;
//         }
//         .vpf-dot {
//           position: relative;
//           width: 24px;
//           height: 24px;
//           background: transparent;
//           border: none;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .vpf-core {
//           width: 10px;
//           height: 10px;
//           background: var(--dot-core);
//           border-radius: 50%;
//           z-index: 2;
//           box-shadow: 0 0 10px var(--dot-core);
//           transition: 0.3s;
//         }
//         .vpf-ring {
//           position: absolute;
//           width: 100%;
//           height: 100%;
//           border: 1px solid var(--dot-core);
//           border-radius: 50%;
//           opacity: 0;
//           transform: scale(0.5);
//           animation: ripple 2s infinite;
//         }

//         .vpf-hotspot-container:hover .vpf-core {
//           transform: scale(1.5);
//           background: #fff;
//         }
//         .vpf-hotspot-container:hover .vpf-ring {
//           animation: none;
//           border-color: #fff;
//           opacity: 1;
//           transform: scale(1.2);
//         }
//         @keyframes ripple {
//           0% {
//             transform: scale(0.5);
//             opacity: 1;
//           }
//           100% {
//             transform: scale(2);
//             opacity: 0;
//           }
//         }

//         .vpf-tooltip {
//           position: absolute;
//           bottom: 35px;
//           left: 50%;
//           width: 200px;
//           background: var(--c-tooltip-bg);
//           color: var(--c-text);
//           border: 1px solid var(--c-border);
//           backdrop-filter: blur(16px);
//           border-radius: 16px;
//           padding: 12px;
//           box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
//           z-index: 100;
//           cursor: pointer;
//         }
//         .vpf-tooltip-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-bottom: 1px solid var(--c-border);
//           padding-bottom: 8px;
//           margin-bottom: 8px;
//         }
//         .vpf-tooltip-title {
//           font-weight: 800;
//           font-size: 0.8rem;
//           text-transform: uppercase;
//         }
//         .vpf-flash-badge {
//           background: #ef4444;
//           color: white;
//           font-size: 0.6rem;
//           padding: 2px 6px;
//           border-radius: 4px;
//           display: flex;
//           align-items: center;
//           gap: 3px;
//           font-weight: bold;
//         }
//         .vpf-tooltip-footer {
//           margin-top: 8px;
//           border-top: 1px solid var(--c-border);
//           padding-top: 6px;
//           display: flex;
//           justify-content: center;
//         }
//         .vpf-tooltip-arrow {
//           position: absolute;
//           bottom: -6px;
//           left: 50%;
//           transform: translateX(-50%) rotate(45deg);
//           width: 12px;
//           height: 12px;
//           background: var(--c-tooltip-bg);
//           border-right: 1px solid var(--c-border);
//           border-bottom: 1px solid var(--c-border);
//         }

//         .vpf-stock-pill {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 0.7rem;
//           font-weight: 600;
//           margin-top: 4px;
//           color: #94a3b8;
//         }
//         .vpf-stock-pill.ok {
//           color: #4ade80;
//         }
//         .vpf-stock-pill.out {
//           color: #f87171;
//         }

//         @media (max-width: 768px) {
//           .vpf-section {
//             padding: 1.5rem 0.5rem;
//             min-height: auto;
//           }
//           .vpf-header {
//             margin-bottom: 1.5rem;
//           }
//           .vpf-title {
//             font-size: 1.8rem;
//           }
//           .vpf-subtitle {
//             font-size: 0.9rem;
//           }
//           .vpf-blueprint-card {
//             padding: 0.5rem;
//             border-radius: 20px;
//           }
//           .vpf-tooltip {
//             width: 170px;
//             padding: 10px;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

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
// 2. CONFIGURATION (Updated: 21 Accurate Points)
// ============================================================================

const HOTSPOTS: Hotspot[] = [
  // --- FRONT VIEW (Top Left Area) ---
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

  // --- TOP VIEW (Top Right Area) ---
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

  // --- REAR VIEW (Bottom Left Area) ---
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

  // --- SIDE VIEW (Bottom Right Area) ---
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

  // --- Mock Data Fetch ---
  useEffect(() => {
    const categories = [...new Set(HOTSPOTS.map((h) => h.categorySlug))];
    const timers: NodeJS.Timeout[] = []; // 🔥 FIX: Store timers to clean them up

    categories.forEach((cat) => {
      setHotspotData((prev) =>
        new Map(prev).set(cat, {
          categorySlug: cat,
          productCount: 0,
          lowestPrice: null,
          topProductImage: null,
          inStock: false,
          hasFlashSale: false,
          loading: true,
          error: null,
        }),
      );

      const timer = setTimeout(
        () => {
          setHotspotData((prev) => {
            const newData = new Map(prev);
            const isSale = Math.random() > 0.8;
            newData.set(cat, {
              categorySlug: cat,
              productCount: Math.floor(Math.random() * 40) + 5,
              lowestPrice: Math.floor(Math.random() * 8000) + 400,
              topProductImage: null,
              inStock: Math.random() > 0.1,
              hasFlashSale: isSale,
              loading: false,
              error: null,
            });
            return newData;
          });
        },
        1000 + Math.random() * 1500,
      );

      timers.push(timer);
    });

    // 🔥 FIX: Cleanup function to prevent memory leaks
    return () => {
      timers.forEach(clearTimeout);
    };
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
      <div className="vpf-grid-bg" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/50 dark:to-[#0f0014] pointer-events-none" />

      <div className="vpf-container">
        {/* Header */}
        <div className="vpf-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="vpf-badge"
          >
            <ScanLine size={12} className="mr-1" /> INTERACTIVE BLUEPRINT
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="vpf-title"
          >
            Visual Parts <span className="text-highlight">Finder</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
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
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          {/* Tech Corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500/50 rounded-br-lg" />

          {/* Scanner Animation Line */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-[100px] w-full z-10 pointer-events-none"
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
                quality={90} // 🔥 FIX: Ensure high quality for blueprints
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
                    >
                      <button
                        className={`vpf-dot ${isActive ? "active" : ""}`}
                        onClick={() => handleDotClick(hotspot.categorySlug)}
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
                              scale: 0.95,
                              x: "-50%",
                            }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                            exit={{ opacity: 0, y: 5, scale: 0.95, x: "-50%" }}
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

                            {data?.loading ? (
                              <div className="vpf-tooltip-loading">
                                <Loader2
                                  className="animate-spin text-indigo-500"
                                  size={14}
                                />
                                <span>Checking...</span>
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
        /* Styles remain completely unchanged */
        .vpf-section {
          --c-bg: #f8fafc;
          --c-card: rgba(255, 255, 255, 0.8);
          --c-accent: #6366f1;
          --c-text: #0f172a;
          --c-border: rgba(99, 102, 241, 0.1);
          --c-tooltip-bg: rgba(255, 255, 255, 0.95);
          --dot-core: #6366f1;
          --dot-ring: rgba(99, 102, 241, 0.4);
          --img-filter: grayscale(100%) contrast(1.1) opacity(0.8);
          --img-blend: multiply;
          position: relative;
          padding: 6rem 1rem;
          min-height: 900px;
          color: var(--c-text);
          font-family: "Inter", sans-serif;
          overflow: hidden;
        }

        :global(.dark) .vpf-section {
          --c-bg: #0f0014;
          --c-card: rgba(20, 10, 30, 0.6);
          --c-accent: #d946ef;
          --c-text: #f3f4f6;
          --c-border: rgba(217, 70, 239, 0.2);
          --c-tooltip-bg: rgba(15, 5, 20, 0.95);
          --dot-core: #d946ef;
          --dot-ring: rgba(217, 70, 239, 0.4);
          --img-filter: invert(1) hue-rotate(180deg) brightness(1.2)
            drop-shadow(0 0 5px rgba(217, 70, 239, 0.3));
          --img-blend: screen;
        }

        .vpf-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }
        .vpf-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .vpf-title {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
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
          font-size: 1.1rem;
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
          margin-bottom: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .vpf-blueprint-card {
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 30px;
          padding: 3rem;
          position: relative;
          backdrop-filter: blur(20px);
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        .vpf-grid-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            var(--c-border) 1px,
            transparent 1px
          );
          background-size: 30px 30px;
          opacity: 0.3;
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
          mix-blend-mode: var(--img-blend);
          opacity: 0.9;
        }

        .vpf-hotspot-container {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 20;
        }
        .vpf-dot {
          position: relative;
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vpf-core {
          width: 10px;
          height: 10px;
          background: var(--dot-core);
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 0 10px var(--dot-core);
          transition: 0.3s;
        }
        .vpf-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid var(--dot-core);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.5);
          animation: ripple 2s infinite;
        }

        .vpf-hotspot-container:hover .vpf-core {
          transform: scale(1.5);
          background: #fff;
        }
        .vpf-hotspot-container:hover .vpf-ring {
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
          bottom: 35px;
          left: 50%;
          width: 200px;
          background: var(--c-tooltip-bg);
          color: var(--c-text);
          border: 1px solid var(--c-border);
          backdrop-filter: blur(16px);
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
          z-index: 100;
          cursor: pointer;
        }
        .vpf-tooltip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--c-border);
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        .vpf-tooltip-title {
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
        }
        .vpf-flash-badge {
          background: #ef4444;
          color: white;
          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 3px;
          font-weight: bold;
        }
        .vpf-tooltip-footer {
          margin-top: 8px;
          border-top: 1px solid var(--c-border);
          padding-top: 6px;
          display: flex;
          justify-content: center;
        }
        .vpf-tooltip-arrow {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background: var(--c-tooltip-bg);
          border-right: 1px solid var(--c-border);
          border-bottom: 1px solid var(--c-border);
        }

        .vpf-stock-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          margin-top: 4px;
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
            padding: 1.5rem 0.5rem;
            min-height: auto;
          }
          .vpf-header {
            margin-bottom: 1.5rem;
          }
          .vpf-title {
            font-size: 1.8rem;
          }
          .vpf-subtitle {
            font-size: 0.9rem;
          }
          .vpf-blueprint-card {
            padding: 0.5rem;
            border-radius: 20px;
          }
          .vpf-tooltip {
            width: 170px;
            padding: 10px;
          }
        }
      `}</style>
    </section>
  );
}
