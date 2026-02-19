// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronRight, Package, Loader2, Zap } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// // ============================================================================
// // 1. TYPESCRIPT INTERFACES
// // ============================================================================

// interface FlashSale {
//   isActive: boolean;
//   salePrice: number;
//   startTime: string | null;
//   endTime: string | null;
// }

// interface ProductImage {
//   url: string;
//   publicId: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   discountPrice?: number;
//   finalPrice?: number;
//   stock: number;
//   stockStatus: string;
//   images: ProductImage[];
//   flashSale?: FlashSale;
//   category: string;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   data: Product[];
// }

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
// // 2. CONFIGURATION (Massively Expanded for Professional Coverage - ~30+ dots)
// // ============================================================================

// const HOTSPOTS: Hotspot[] = [
//   // --- FRONT VIEW (Top Left) ---
//   {
//     id: "hs-headlight-r",
//     label: "Headlight (R)",
//     categorySlug: "Electrical",
//     x: 23,
//     y: 27,
//   },
//   {
//     id: "hs-headlight-l",
//     label: "Headlight (L)",
//     categorySlug: "Electrical",
//     x: 9,
//     y: 27,
//   },
//   {
//     id: "hs-grille",
//     label: "Front Grille / Kidney",
//     categorySlug: "Body",
//     x: 16,
//     y: 28,
//   },
//   {
//     id: "hs-logo-f",
//     label: "Front Emblem",
//     categorySlug: "Accessories",
//     x: 16,
//     y: 22,
//   },
//   {
//     id: "hs-fog-r",
//     label: "Fog Light (R)",
//     categorySlug: "Electrical",
//     x: 23,
//     y: 34,
//   },
//   {
//     id: "hs-fog-l",
//     label: "Fog Light (L)",
//     categorySlug: "Electrical",
//     x: 9,
//     y: 34,
//   },
//   {
//     id: "hs-f-bumper",
//     label: "Front Bumper Assembly",
//     categorySlug: "Body",
//     x: 16,
//     y: 38,
//   },
//   {
//     id: "hs-radiator",
//     label: "Radiator & Cooling",
//     categorySlug: "Engine",
//     x: 16,
//     y: 31,
//   },

//   // --- TOP VIEW (Top Right) ---
//   {
//     id: "hs-bonnet",
//     label: "Bonnet / Hood",
//     categorySlug: "Body",
//     x: 45,
//     y: 25,
//   },
//   {
//     id: "hs-wipers",
//     label: "Wiper Blades & Motor",
//     categorySlug: "Electrical",
//     x: 53,
//     y: 20,
//   },
//   { id: "hs-roof", label: "Roof Panel", categorySlug: "Body", x: 65, y: 25 },
//   {
//     id: "hs-sunroof",
//     label: "Sunroof Glass",
//     categorySlug: "Body",
//     x: 62,
//     y: 25,
//   },
//   {
//     id: "hs-interior-f",
//     label: "Front Seats / Dash",
//     categorySlug: "Interior",
//     x: 58,
//     y: 25,
//   },
//   {
//     id: "hs-interior-r",
//     label: "Rear Seats",
//     categorySlug: "Interior",
//     x: 72,
//     y: 25,
//   },
//   {
//     id: "hs-boot-top",
//     label: "Boot Lid (Top)",
//     categorySlug: "Body",
//     x: 85,
//     y: 25,
//   },

//   // --- REAR VIEW (Bottom Left) ---
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
//     id: "hs-boot-back",
//     label: "Tailgate / Trunk",
//     categorySlug: "Body",
//     x: 16,
//     y: 65,
//   },
//   {
//     id: "hs-logo-r",
//     label: "Rear Emblem",
//     categorySlug: "Accessories",
//     x: 16,
//     y: 62,
//   },
//   {
//     id: "hs-r-bumper",
//     label: "Rear Bumper",
//     categorySlug: "Body",
//     x: 16,
//     y: 78,
//   },
//   {
//     id: "hs-exhaust",
//     label: "Exhaust Tips / Muffler",
//     categorySlug: "Engine",
//     x: 24,
//     y: 78,
//   },
//   {
//     id: "hs-license",
//     label: "License Plate Lights",
//     categorySlug: "Electrical",
//     x: 16,
//     y: 72,
//   },

//   // --- SIDE VIEW (Bottom Right) ---
//   {
//     id: "hs-engine-side",
//     label: "Engine Bay",
//     categorySlug: "Engine",
//     x: 42,
//     y: 70,
//   },
//   {
//     id: "hs-f-wheel",
//     label: "Front Wheel & Tyres",
//     categorySlug: "Suspension",
//     x: 48,
//     y: 80,
//   },
//   {
//     id: "hs-f-brake",
//     label: "Front Brake Calipers",
//     categorySlug: "Suspension",
//     x: 48,
//     y: 77,
//   },
//   {
//     id: "hs-r-wheel",
//     label: "Rear Wheel & Tyres",
//     categorySlug: "Suspension",
//     x: 82,
//     y: 80,
//   },
//   {
//     id: "hs-r-brake",
//     label: "Rear Brake Calipers",
//     categorySlug: "Suspension",
//     x: 82,
//     y: 77,
//   },
//   {
//     id: "hs-f-door",
//     label: "Front Door Shell",
//     categorySlug: "Body",
//     x: 58,
//     y: 68,
//   },
//   {
//     id: "hs-r-door",
//     label: "Rear Door Shell",
//     categorySlug: "Body",
//     x: 70,
//     y: 68,
//   },
//   {
//     id: "hs-mirror-side",
//     label: "Side Mirror Assembly",
//     categorySlug: "Accessories",
//     x: 56,
//     y: 65,
//   },
//   {
//     id: "hs-windshield-side",
//     label: "Windshield Glass",
//     categorySlug: "Body",
//     x: 52,
//     y: 62,
//   },
//   {
//     id: "hs-handle-f",
//     label: "Door Handle (Front)",
//     categorySlug: "Body",
//     x: 60,
//     y: 66,
//   },
//   {
//     id: "hs-fuel",
//     label: "Fuel Filler Cap",
//     categorySlug: "Body",
//     x: 78,
//     y: 66,
//   },
//   {
//     id: "hs-skirt",
//     label: "Side Skirt / Rocker",
//     categorySlug: "Body",
//     x: 65,
//     y: 82,
//   },
// ];

// // ============================================================================
// // 3. MAIN COMPONENT
// // ============================================================================

// export default function VisualPartsFinder() {
//   const [hotspotData, setHotspotData] = useState<Map<string, HotspotData>>(
//     new Map(),
//   );
//   const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (!isImageLoaded) {
//         setIsImageLoaded(true);
//       }
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [isImageLoaded]);

//   const isFlashSaleActive = (sale: FlashSale | undefined) => {
//     if (!sale || !sale.isActive || !sale.startTime || !sale.endTime)
//       return false;
//     const now = new Date();
//     return now >= new Date(sale.startTime) && now <= new Date(sale.endTime);
//   };

//   useEffect(() => {
//     const fetchCategoryData = async (categorySlug: string) => {
//       setHotspotData((prev) => {
//         const newMap = new Map(prev);
//         if (!newMap.has(categorySlug)) {
//           newMap.set(categorySlug, {
//             categorySlug,
//             productCount: 0,
//             lowestPrice: null,
//             topProductImage: null,
//             inStock: false,
//             hasFlashSale: false,
//             loading: true,
//             error: null,
//           });
//         }
//         return newMap;
//       });

//       try {
//         const apiUrl =
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//         const response = await fetch(
//           `${apiUrl}/products/category/${categorySlug}`,
//         );

//         if (!response.ok) throw new Error("Network error");

//         const json: ApiResponse = await response.json();
//         const products =
//           json.success && Array.isArray(json.data) ? json.data : [];

//         let lowestPrice: number | null = null;
//         let hasStock = false;
//         let hasActiveFlashSale = false;
//         let topImage: string | null = null;

//         if (products.length > 0) {
//           const productWithImage = products.find(
//             (p) => p.images && p.images.length > 0,
//           );
//           if (productWithImage) {
//             topImage = productWithImage.images[0].url;
//           }

//           products.forEach((p) => {
//             if (p.stock > 0) hasStock = true;
//             let effectivePrice = p.price;
//             const flashActive = isFlashSaleActive(p.flashSale);

//             if (flashActive && p.flashSale?.salePrice) {
//               effectivePrice = p.flashSale.salePrice;
//               hasActiveFlashSale = true;
//             } else if (p.finalPrice) {
//               effectivePrice = p.finalPrice;
//             } else if (p.discountPrice && p.discountPrice < p.price) {
//               effectivePrice = p.discountPrice;
//             }

//             if (lowestPrice === null || effectivePrice < lowestPrice) {
//               lowestPrice = effectivePrice;
//             }
//           });
//         }

//         setHotspotData((prev) => {
//           const newMap = new Map(prev);
//           newMap.set(categorySlug, {
//             categorySlug,
//             productCount: products.length,
//             lowestPrice,
//             topProductImage: topImage,
//             inStock: hasStock,
//             hasFlashSale: hasActiveFlashSale,
//             loading: false,
//             error: null,
//           });
//           return newMap;
//         });
//       } catch (error) {
//         console.error(`Error loading ${categorySlug}`, error);
//         setHotspotData((prev) => {
//           const newMap = new Map(prev);
//           newMap.set(categorySlug, {
//             categorySlug,
//             productCount: 0,
//             lowestPrice: null,
//             topProductImage: null,
//             inStock: false,
//             hasFlashSale: false,
//             loading: false,
//             error: "Failed to load",
//           });
//           return newMap;
//         });
//       }
//     };

//     const categories = [...new Set(HOTSPOTS.map((h) => h.categorySlug))];
//     categories.forEach((cat) => fetchCategoryData(cat));
//   }, []);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   return (
//     <section className="vpf-section" ref={containerRef}>
//       <div className="vpf-grid-bg" />
//       <div className="vpf-glow-orb top-left" />
//       <div className="vpf-glow-orb bottom-right" />

//       <div className="vpf-container">
//         <div className="vpf-header">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="vpf-badge"
//           >
//             INTERACTIVE SCHEMATIC
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
//             Hover over components on the blueprint to check pricing and
//             availability.
//           </motion.p>
//         </div>

//         <motion.div
//           className="vpf-blueprint-card"
//           initial={{ opacity: 0, scale: 0.98 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="tech-line top" />
//           <div className="tech-line bottom" />
//           <div className="tech-corner tl" />
//           <div className="tech-corner br" />

//           <div className="vpf-canvas">
//             {!isImageLoaded && (
//               <div className="vpf-loader">
//                 <Loader2 className="animate-spin text-accent" size={32} />
//                 <span>Loading Schematics...</span>
//               </div>
//             )}

//             <div
//               className={`vpf-image-wrapper ${isImageLoaded ? "loaded" : ""}`}
//             >
//               <img
//                 src="/images/carWire.png"
//                 alt="Car Blueprint"
//                 className="vpf-car-img"
//                 onLoad={() => setIsImageLoaded(true)}
//                 onError={(e) => {
//                   e.currentTarget.src =
//                     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Blueprint_car.svg/1280px-Blueprint_car.svg.png";
//                   e.currentTarget.onerror = () => setIsImageLoaded(true);
//                 }}
//               />

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
//                       {/* NEW ANIMATION: The dot itself pulses, no outer ring */}
//                       <button className={`vpf-dot ${isActive ? "active" : ""}`}>
//                         <div className="vpf-core" />
//                       </button>

//                       <AnimatePresence>
//                         {isActive && (
//                           <motion.div
//                             className="vpf-tooltip"
//                             initial={{
//                               opacity: 0,
//                               y: 10,
//                               scale: 0.9,
//                               x: "-50%",
//                             }}
//                             animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
//                             exit={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
//                             transition={{ duration: 0.2, ease: "easeOut" }}
//                           >
//                             <div className="vpf-tooltip-header">
//                               <span className="vpf-tooltip-title">
//                                 {hotspot.label}
//                               </span>
//                               {data?.hasFlashSale && (
//                                 <span className="vpf-flash-badge">
//                                   <Zap size={10} fill="currentColor" /> SALE
//                                 </span>
//                               )}
//                             </div>

//                             {data?.loading ? (
//                               <div className="vpf-tooltip-loading">
//                                 <Loader2 className="animate-spin" size={16} />{" "}
//                                 Checking...
//                               </div>
//                             ) : data?.error ? (
//                               <div className="text-error text-xs py-2">
//                                 Unavailable
//                               </div>
//                             ) : (
//                               <div className="vpf-tooltip-body">
//                                 {data?.topProductImage && (
//                                   <div className="vpf-tooltip-img-box">
//                                     <Image
//                                       src={data.topProductImage}
//                                       alt={hotspot.label}
//                                       width={60}
//                                       height={60}
//                                       className="object-contain"
//                                     />
//                                   </div>
//                                 )}
//                                 <div className="vpf-tooltip-info">
//                                   <div className="vpf-price-block">
//                                     <span className="label">Starting from</span>
//                                     <span className="price">
//                                       {data?.lowestPrice
//                                         ? formatPrice(data.lowestPrice)
//                                         : "N/A"}
//                                     </span>
//                                   </div>
//                                   <div
//                                     className={`vpf-stock-status ${
//                                       data?.inStock ? "ok" : "out"
//                                     }`}
//                                   >
//                                     <Package size={12} />
//                                     {data?.inStock
//                                       ? "In Stock"
//                                       : "Out of Stock"}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}

//                             <Link
//                               href={`/products/category/${hotspot.categorySlug.toLowerCase()}`}
//                               className="vpf-tooltip-btn"
//                             >
//                               View Products <ChevronRight size={14} />
//                             </Link>
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
//         /* =========================================
//            THEMING SYSTEM (Light/Dark Support)
//            ========================================= */
//         .vpf-section {
//           /* LIGHT MODE DEFAULTS */
//           --c-bg: #f8fafc;
//           --c-card: rgba(255, 255, 255, 0.9);
//           --c-accent: #0ea5e9; /* Sky 500 */
//           --c-text: #0f172a;
//           --c-text-muted: #64748b;
//           --c-border: rgba(0, 0, 0, 0.1);
//           --c-tooltip-bg: rgba(255, 255, 255, 0.98);
//           --c-tooltip-text: #0f172a;
//           --c-grid-line: rgba(0, 0, 0, 0.05);

//           /* DOT COLORS - Light Mode (High Contrast) */
//           --dot-color: #0284c7; /* Stronger Blue */
//           --dot-glow: rgba(2, 132, 199, 0.3);

//           /* IMAGE - Light Mode (Black Lines) */
//           --img-filter: none;
//           --img-mix-blend: multiply;

//           --c-success: #16a34a;
//           --c-error: #dc2626;

//           position: relative;
//           background-color: var(--c-bg);
//           padding: 5rem 1rem;
//           min-height: 800px;
//           color: var(--c-text);
//           font-family: "Inter", sans-serif;
//           transition: all 0.3s ease;
//         }

//         /* DARK MODE OVERRIDES */
//         :global(.dark) .vpf-section {
//           --c-bg: #030712;
//           --c-card: rgba(17, 24, 39, 0.7);
//           --c-accent: #06b6d4; /* Cyan */
//           --c-text: #f3f4f6;
//           --c-text-muted: #9ca3af;
//           --c-border: rgba(255, 255, 255, 0.1);
//           --c-tooltip-bg: rgba(15, 23, 42, 0.95);
//           --c-tooltip-text: #f3f4f6;
//           --c-grid-line: rgba(255, 255, 255, 0.03);

//           /* DOT COLORS - Dark Mode (Glowing Cyan) */
//           --dot-color: #06b6d4;
//           --dot-glow: rgba(6, 182, 212, 0.5);

//           /* IMAGE - Dark Mode (White/Glowing Lines) */
//           --img-filter: invert(1) drop-shadow(0 0 5px rgba(6, 182, 212, 0.5));
//           --img-mix-blend: screen;

//           --c-success: #4ade80;
//           --c-error: #f87171;
//         }

//         /* --- LAYOUT --- */
//         .vpf-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           position: relative;
//           z-index: 10;
//         }
//         .vpf-header {
//           text-align: center;
//           margin-bottom: 3rem;
//         }
//         .vpf-title {
//           font-size: 2.5rem;
//           font-weight: 800;
//           margin-bottom: 1rem;
//         }
//         .text-highlight {
//           background: linear-gradient(to right, var(--c-accent), #3b82f6);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }
//         .vpf-subtitle {
//           color: var(--c-text-muted);
//           max-width: 600px;
//           margin: 0 auto;
//         }
//         .vpf-badge {
//           display: inline-block;
//           padding: 0.25rem 0.75rem;
//           background: rgba(14, 165, 233, 0.1);
//           border: 1px solid var(--c-accent);
//           color: var(--c-accent);
//           font-size: 0.7rem;
//           border-radius: 99px;
//           margin-bottom: 1rem;
//           font-weight: 600;
//         }

//         /* --- CARD & GRID --- */
//         .vpf-blueprint-card {
//           background: var(--c-card);
//           border: 1px solid var(--c-border);
//           border-radius: 24px;
//           padding: 2rem;
//           position: relative;
//           backdrop-filter: blur(10px);
//           box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
//           width: 100%;
//           max-width: 1100px;
//           margin: 0 auto;
//         }

//         .vpf-grid-bg {
//           position: absolute;
//           inset: 0;
//           background-image:
//             linear-gradient(var(--c-grid-line) 1px, transparent 1px),
//             linear-gradient(90deg, var(--c-grid-line) 1px, transparent 1px);
//           background-size: 40px 40px;
//           mask-image: radial-gradient(
//             circle at center,
//             black 40%,
//             transparent 100%
//           );
//           pointer-events: none;
//         }

//         /* --- IMAGE --- */
//         .vpf-canvas {
//           position: relative;
//           width: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .vpf-image-wrapper {
//           position: relative;
//           width: 100%;
//           display: inline-block;
//           opacity: 0;
//           transition: opacity 0.5s ease;
//         }
//         .vpf-image-wrapper.loaded {
//           opacity: 1;
//         }

//         .vpf-car-img {
//           width: 100%;
//           height: auto;
//           display: block;
//           object-fit: contain;
//           filter: var(--img-filter);
//           mix-blend-mode: var(--img-mix-blend);
//           transition: filter 0.3s ease;
//         }

//         /* --- NEW HOTSPOT ANIMATION (Breathing Glow) --- */
//         .vpf-hotspot-container {
//           position: absolute;
//           transform: translate(-50%, -50%);
//           z-index: 20;
//           width: 24px;
//           height: 24px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .vpf-dot {
//           position: relative;
//           width: 100%;
//           height: 100%;
//           background: transparent;
//           border: none;
//           cursor: pointer;
//           padding: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         /* The central visible dot */
//         .vpf-core {
//           width: 10px;
//           height: 10px;
//           background-color: var(--dot-color);
//           border-radius: 50%;
//           position: relative;
//           z-index: 2;
//           /* A subtle hard shadow for definition */
//           box-shadow: 0 0 2px var(--c-bg);
//           transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//         }

//         /* The breathing glow effect using pseudo-element */
//         .vpf-core::after {
//           content: "";
//           position: absolute;
//           inset: -4px; /* Extends beyond the core */
//           background-color: var(--dot-color);
//           border-radius: 50%;
//           opacity: 0.4;
//           z-index: -1;
//           animation: breathing-glow 3s ease-in-out infinite;
//         }

//         @keyframes breathing-glow {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 0.3;
//           }
//           50% {
//             transform: scale(1.6);
//             opacity: 0.1;
//           }
//         }

//         /* HOVER STATE: Stop breathing, become larger and springy */
//         .vpf-hotspot-container:hover .vpf-core {
//           transform: scale(1.4); /* Make the core bigger */
//           box-shadow: 0 0 15px var(--dot-glow); /* Add intense glow */
//         }

//         /* Hide the breathing animation on hover so it doesn't conflict */
//         .vpf-hotspot-container:hover .vpf-core::after {
//           opacity: 0;
//           animation: none;
//         }

//         /* --- TOOLTIP STYLES --- */
//         .vpf-tooltip {
//           position: absolute;
//           bottom: 35px;
//           left: 50%;
//           width: 240px;
//           background: var(--c-tooltip-bg);
//           color: var(--c-tooltip-text);
//           backdrop-filter: blur(12px);
//           border: 1px solid var(--c-border);
//           border-radius: 12px;
//           padding: 12px;
//           box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2);
//           z-index: 100;
//           pointer-events: auto;
//         }
//         .vpf-tooltip-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 8px;
//           padding-bottom: 8px;
//           border-bottom: 1px solid var(--c-border);
//         }
//         .vpf-tooltip-title {
//           font-weight: 700;
//           font-size: 0.9rem;
//         }
//         .vpf-tooltip-body {
//           display: flex;
//           gap: 10px;
//           margin-bottom: 10px;
//         }
//         .vpf-tooltip-img-box {
//           width: 50px;
//           height: 50px;
//           background: rgba(128, 128, 128, 0.1);
//           border-radius: 6px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: hidden;
//           flex-shrink: 0;
//         }
//         .vpf-price-block .label {
//           display: block;
//           font-size: 0.65rem;
//           color: var(--c-text-muted);
//           text-transform: uppercase;
//         }
//         .vpf-price-block .price {
//           font-size: 1.1rem;
//           font-weight: 800;
//           color: var(--c-accent);
//         }
//         .vpf-stock-status {
//           font-size: 0.7rem;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           margin-top: 4px;
//         }
//         .vpf-stock-status.ok {
//           color: var(--c-success);
//         }
//         .vpf-stock-status.out {
//           color: var(--c-error);
//         }
//         .vpf-flash-badge {
//           display: flex;
//           align-items: center;
//           gap: 2px;
//           font-size: 0.65rem;
//           background: var(--c-error);
//           color: white;
//           padding: 1px 6px;
//           border-radius: 4px;
//           font-weight: bold;
//         }

//         .vpf-tooltip-btn {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 100%;
//           padding: 8px;
//           background: linear-gradient(to right, var(--c-accent), #2563eb);
//           color: white;
//           border-radius: 6px;
//           font-size: 0.8rem;
//           font-weight: 600;
//           text-decoration: none;
//           transition: opacity 0.2s;
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
//         .vpf-tooltip-loading {
//           font-size: 0.8rem;
//           color: var(--c-text-muted);
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 1rem;
//         }

//         .vpf-loader {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 1rem;
//           color: var(--c-accent);
//           position: absolute;
//           z-index: 10;
//         }
//         .text-accent {
//           color: var(--c-accent);
//         }
//         .text-error {
//           color: var(--c-error);
//         }

//         /* TECH DECORATIONS */
//         .tech-line {
//           position: absolute;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 80%;
//           height: 1px;
//           background: linear-gradient(
//             90deg,
//             transparent,
//             var(--c-border),
//             transparent
//           );
//         }
//         .tech-line.top {
//           top: 0;
//         }
//         .tech-line.bottom {
//           bottom: 0;
//         }
//         .tech-corner {
//           position: absolute;
//           width: 20px;
//           height: 20px;
//           border-color: var(--c-accent);
//           border-style: solid;
//           opacity: 0.5;
//         }
//         .tl {
//           top: -1px;
//           left: -1px;
//           border-width: 2px 0 0 2px;
//         }
//         .br {
//           bottom: -1px;
//           right: -1px;
//           border-width: 0 2px 2px 0;
//         }

//         @media (max-width: 768px) {
//           .vpf-section {
//             padding: 3rem 1rem;
//             min-height: auto;
//           }
//           .vpf-title {
//             font-size: 1.8rem;
//           }
//           .vpf-blueprint-card {
//             padding: 1rem;
//           }
//           .vpf-tooltip {
//             width: 200px;
//             bottom: 40px;
//           }
//           .vpf-tooltip-body {
//             flex-direction: column;
//             gap: 5px;
//           }
//           .vpf-tooltip-img-box {
//             display: none;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Package, Loader2, Zap, ScanLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Router for navigation

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
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Mock Data Fetch ---
  useEffect(() => {
    const categories = [...new Set(HOTSPOTS.map((h) => h.categorySlug))];

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

      setTimeout(
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
    });
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // 🔥 Navigate on Click
  const handleDotClick = (categorySlug: string) => {
    router.push(`/products?category=${categorySlug}`);
  };

  return (
    <section className="vpf-section" ref={containerRef}>
      {/* Background Ambience */}
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
              <div className="vpf-loader">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
                <span className="mt-4 font-mono text-xs uppercase tracking-widest text-indigo-400">
                  Loading Schematic...
                </span>
              </div>
            )}

            <div
              className={`vpf-image-wrapper ${isImageLoaded ? "loaded" : ""}`}
            >
              {/* Main Blueprint Image */}
              <img
                src="/images/carWire.png"
                alt="Car Blueprint"
                className="vpf-car-img"
                onLoad={() => setIsImageLoaded(true)}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Blueprint_car.svg/1280px-Blueprint_car.svg.png";
                }}
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
                      {/* 🔥 Clickable Dot */}
                      <button
                        className={`vpf-dot ${isActive ? "active" : ""}`}
                        onClick={() => handleDotClick(hotspot.categorySlug)}
                      >
                        <div className="vpf-ring" />
                        <div className="vpf-core" />
                      </button>

                      {/* Tooltip */}
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

                            {/* 🔥 UPDATE: Make Footer Clickable */}
                            <div
                              className="vpf-tooltip-footer cursor-pointer hover:bg-indigo-50 dark:hover:bg-white/5 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent closing tooltip
                                handleDotClick(hotspot.categorySlug); // Navigate to products
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
        .vpf-section {
          --c-bg: #f8fafc;
          --c-card: rgba(255, 255, 255, 0.8);
          --c-accent: #6366f1; /* Indigo */
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

        /* DARK MODE */
        :global(.dark) .vpf-section {
          --c-bg: #0f0014;
          --c-card: rgba(20, 10, 30, 0.6);
          --c-accent: #d946ef; /* Fuchsia */
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

        /* CARD */
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

        /* DOTS */
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
          transition: 0.3s;
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

        /* TOOLTIP */
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
            padding: 1.5rem 0.5rem; /* పైన, కింద గ్యాప్ తగ్గించాను */
            min-height: auto; /* అనవసరమైన ఖాళీ స్థలాన్ని తీసేస్తుంది */
          }
          .vpf-header {
            margin-bottom: 1.5rem; /* టెక్స్ట్ కి మరియు ఇమేజ్ కి మధ్య గ్యాప్ తగ్గించాను */
          }
          .vpf-title {
            font-size: 1.8rem;
          }
          .vpf-subtitle {
            font-size: 0.9rem;
          }
          .vpf-blueprint-card {
            padding: 0.5rem; /* కార్డ్ లోపల గ్యాప్ తగ్గించాను */
            border-radius: 20px; /* మొబైల్ కి తగ్గట్టుగా మూలలు మార్చాను */
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
