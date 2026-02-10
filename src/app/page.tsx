// // src/app/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { ProductCard } from "@/components/ProductCard";
// import { Product, useStore } from "@/store/useStore";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import { Search, Filter, ChevronRight, Sparkles, Loader2 } from "lucide-react";
// import ProductCarousel from "@/components/ProductCarousel";
// import FestivalCarousel from "@/components/FestivalCarousel";
// import ReviewsCarousel from "@/components/ReviewsCarousel";
// import PhoneBanner from "@/components/PhoneBanner";
// import HeroGarageWidget from "@/components/HeroGarageWidget";

// export default function Home() {
//   // ✅ 1. GLOBAL LOADING STATE (దీనిని యాడ్ చేసాను)
//   const [isGlobalLoading, setIsGlobalLoading] = useState(true);

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const { setCart, toggleCartDrawer } = useStore();

//   const categories = [
//     "all",
//     "Engine",
//     "Brake",
//     "Electrical",
//     "Body",
//     "Accessories",
//     "Suspension",
//     "Transmission",
//   ];

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedCategory]);

//   const fetchProducts = async () => {
//     // కేవలం కేటగిరీ మారినప్పుడు మాత్రమే గ్రిడ్ లోడింగ్ చూపించాలి
//     if (!isGlobalLoading) setLoading(true);

//     try {
//       const params: any = { limit: 12, page: 1 };
//       if (selectedCategory !== "all") {
//         params.category = selectedCategory;
//       }

//       // ✅ 2. API CALL (మిగతా API లు ఉంటే ఇక్కడ Promise.all వాడవచ్చు)
//       const response = await apiClient.get("/products", { params });

//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error: any) {
//       console.error("Error fetching products:", error);
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//       // ✅ 3. STOP GLOBAL LOADER (డేటా రాగానే లోడర్ ఆపేస్తాం)
//       setIsGlobalLoading(false);
//     }
//   };

//   const handleAddToCart = async (product: Product) => {
//     try {
//       const response = await apiClient.post("/cart/add", {
//         productId: product._id,
//         quantity: 1,
//       });
//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success(`${product.name} added to cart!`);
//         toggleCartDrawer();
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to add to cart");
//     }
//   };

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.partNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   // ✅ 4. FULL SCREEN BLOCKER (ఇది యాడ్ చేసాను)
//   if (isGlobalLoading) {
//     return <FullScreenLoader />;
//   }

//   // ✅ 5. ACTUAL CONTENT
//   return (
//     <>
//       {/* 🔥 CSS Styles for Hero Animation Only */}
//       <style jsx global>{`
//         @keyframes gradientMove {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }

//         .hero-gradient-animate {
//           background: linear-gradient(
//             45deg,
//             #ff9a9e,
//             #fad0c4,
//             #ffecd2,
//             #fcb69f,
//             #ff9a9e,
//             #fecfef,
//             #feada6,
//             #ffdde1,
//             #ee9ca7,
//             #fda085,
//             #f6d365,
//             #ff9a9e,
//             #fbc2eb,
//             #fa709a,
//             #fee140,
//             #fa709a,
//             #ff0844,
//             #d4fc79,
//             #96e6a1,
//             #84fab0,
//             #8fd3f4,
//             #43e97b,
//             #38f9d7,
//             #00c6fb,
//             #005bea,
//             #a6c0fe,
//             #f68084,
//             #a18cd1,
//             #fbc2eb,
//             #8fd3f4,
//             #84fab0,
//             #12c2e9,
//             #c471ed,
//             #a1c4fd,
//             #c2e9fb,
//             #fccb90,
//             #d57eeb,
//             #96e6a1,
//             #fecfef,
//             #667eea,
//             #764ba2,
//             #e0c3fc,
//             #8ec5fc,
//             #e0c3fc,
//             #cfd9df,
//             #e2ebf0,
//             #a8edea,
//             #fed6e3
//           );
//           background-size: 1000% 1000%;
//           animation: gradientMove 110s linear infinite;
//         }

//         .dark .hero-gradient-animate {
//           background: linear-gradient(
//             45deg,
//             #000000,
//             #0f2027,
//             #203a43,
//             #2c5364,
//             #243b55,
//             #141e30,
//             #0f0c29,
//             #302b63,
//             #24243e,
//             #232526,
//             #414345,
//             #1e130c,
//             #485563,
//             #29323c,
//             #3a1c71,
//             #d76d77,
//             #ffaf7b,
//             #434343,
//             #000000,
//             #0f9b0f,
//             #203a43,
//             #2c5364,
//             #cc2b5e,
//             #753a88,
//             #000428,
//             #004e92,
//             #240b36,
//             #c31432,
//             #1a2a6c,
//             #b21f1f,
//             #fdbb2d,
//             #021b79,
//             #0575e6,
//             #134e5e,
//             #71b280,
//             #000000,
//             #434343,
//             #0f2027,
//             #203a43,
//             #2c5364
//           );
//           background-size: 1000% 1000%;
//           animation: gradientMove 150s linear infinite;
//         }
//       `}</style>

//       {/* Main Layout - Solid Background for body content */}
//       <div className="min-h-screen pt-20 bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white transition-colors duration-300">
//         <PhoneBanner />

//         <section className="relative overflow-hidden min-h-[85vh] flex items-center hero-gradient-animate rounded-b-[3rem] shadow-xl mb-12">
//           {/* Glass Overlay for Hero Text Readability */}
//           <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-[2px] z-0" />

//           <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
//             {/* Left Side: Text */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-center md:text-left"
//             >
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/50 dark:border-white/20 shadow-lg"
//               >
//                 <Sparkles
//                   className="text-blue-600 dark:text-blue-300"
//                   size={20}
//                 />
//                 <span className="text-sm font-bold text-gray-800 dark:text-white tracking-wide">
//                   Premium Genuine Parts
//                 </span>
//               </motion.div>

//               <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
//                 <span className="block text-gray-900 dark:text-white drop-shadow-md mb-2">
//                   Hyundai Spares
//                 </span>
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 animate-pulse">
//                   Engineered for Excellence
//                 </span>
//               </h1>

//               <p className="text-lg text-gray-800 dark:text-gray-200 mb-8 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed drop-shadow-sm">
//                 Discover premium genuine spare parts for your Hyundai vehicle.
//                 Quality assured. Performance guaranteed.
//               </p>

//               <button
//                 className="px-9 py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-bold shadow-2xl flex items-center gap-2 hover:gap-3 transition-all mx-auto md:mx-0 border border-white/20 hover:scale-105 active:scale-95"
//                 onClick={() => {
//                   document.getElementById("products")?.scrollIntoView({
//                     behavior: "smooth",
//                   });
//                 }}
//               >
//                 Explore Products
//                 <ChevronRight size={20} />
//               </button>
//             </motion.div>

//             {/* Right Side: Car Image */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 1, delay: 0.5 }}
//               className="relative z-10 flex justify-center"
//             >
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/40 dark:bg-blue-500/20 rounded-full blur-[80px] -z-10" />

//               <motion.div
//                 animate={{ y: [0, -15, 0] }}
//                 transition={{
//                   duration: 6,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//                 className="relative w-full max-w-[450px] md:max-w-full h-[280px] md:h-[450px]"
//               >
//                 <Image
//                   src="/images/hyundai-hero.png"
//                   alt="Hyundai Premium Car"
//                   fill
//                   className="object-contain drop-shadow-2xl"
//                   priority
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 />
//               </motion.div>
//             </motion.div>
//           </div>
//         </section>

//         {/* Hero Garage Widget */}
//         <div className="relative z-30 max-w-4xl mx-auto px-4 mt-10 mb-16">
//           <div className="bg-white dark:bg-[#111] rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden p-1">
//             <HeroGarageWidget />
//           </div>
//         </div>

//         {/* Regular Sections */}
//         <div className="space-y-16 pb-16">
//           <FestivalCarousel />
//           <ProductCarousel />

//           {/* Products Section */}
//           <section id="products" className="px-4 md:px-8 relative z-10">
//             <div className="max-w-7xl mx-auto">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
//                   Our Premium Collection
//                 </h2>
//                 <div className="h-1 w-24 bg-blue-600 dark:bg-purple-500 mx-auto rounded-full mb-4"></div>
//                 <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
//                   Browse through our extensive range of genuine Hyundai spare
//                   parts.
//                 </p>
//               </div>

//               {/* Filters */}
//               <div className="flex flex-col md:flex-row gap-6 mb-12">
//                 <div className="relative w-full md:w-96">
//                   <Search
//                     className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
//                     size={20}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search parts..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#0A101F] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm transition-all"
//                   />
//                 </div>

//                 <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
//                   <div className="p-3.5 bg-white dark:bg-[#0A101F] rounded-2xl border border-gray-200 dark:border-white/10 text-blue-600 dark:text-blue-400 flex-shrink-0 shadow-sm">
//                     <Filter size={20} />
//                   </div>
//                   <div className="flex gap-3 p-1">
//                     {categories.map((category) => (
//                       <button
//                         key={category}
//                         onClick={() => setSelectedCategory(category)}
//                         className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border shadow-sm ${
//                           selectedCategory === category
//                             ? "bg-gray-900 dark:bg-blue-600 text-white border-transparent shadow-lg"
//                             : "bg-white dark:bg-[#0A101F] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
//                         }`}
//                       >
//                         {category === "all" ? "All Parts" : category}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Products Grid */}
//               {loading ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                   <div className="w-14 h-14 border-[5px] border-blue-600 border-t-transparent rounded-full mb-6 shadow-lg animate-spin" />
//                   <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
//                     Fetching premium parts...
//                   </p>
//                 </div>
//               ) : filteredProducts.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0A101F] border border-gray-200 dark:border-white/10 rounded-[2rem] text-center px-4">
//                   <div className="text-7xl mb-6 opacity-80">🔍</div>
//                   <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
//                     No products found
//                   </h3>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                   {filteredProducts.map((product, index) => (
//                     <ProductCard
//                       key={product._id}
//                       product={product}
//                       onAddToCart={handleAddToCart as any}
//                       index={index}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </section>

//           <ReviewsCarousel />
//         </div>
//       </div>
//     </>
//   );
// }

// //✨ FULL SCREEN LOADER COMPONENT (Covers Navbar & Footer)
// // function FullScreenLoader() {
// //   return (
// //     <div className="fixed inset-0 z-[9999] bg-[#050B14] flex flex-col items-center justify-center">
// //       {/* Logo Animation */}
// //       <div className="relative mb-6">
// //         <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
// //         <h2 className="relative text-3xl md:text-5xl font-orbitron font-black tracking-widest text-white animate-pulse">
// //           VARSHINI <span className="text-cyan-500">HYUNDAI</span>
// //         </h2>
// //       </div>

// //       {/* Spinner */}
// //       <Loader2 size={48} className="animate-spin text-cyan-500" />

// //       <p className="mt-6 text-gray-400 text-sm font-medium tracking-wide animate-bounce">
// //         INITIALIZING SYSTEM...
// //       </p>
// //     </div>
// //   );
// // }

// function FullScreenLoader() {
//   return (
//     <div className="fixed inset-0 z-[9999] bg-[#050B14] flex flex-col items-center justify-center overflow-hidden">
//       {/* 🌌 Background Glow (ప్రీమియం ఫీల్ కోసం) */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse"></div>

//       {/* ⚡ The Requested Lightning Loader */}
//       <div className="relative mb-12 scale-110">
//         {/* Loader Glow Effect */}
//         <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full scale-150"></div>

//         <div className="loader"></div>

//         {/* Custom CSS for the Loader */}
//         <style jsx>{`
//           .loader {
//             width: 65px;
//             height: 117px;
//             position: relative;
//             filter: drop-shadow(0 0 10px #06b6d4); /* Cyan Glow */
//           }
//           .loader:before,
//           .loader:after {
//             content: "";
//             position: absolute;
//             inset: 0;
//             background: #06b6d4; /* Changed to Cyan to match your theme */
//             box-shadow: 0 0 0 50px;
//             clip-path: polygon(
//               100% 0,
//               23% 46%,
//               46% 44%,
//               15% 69%,
//               38% 67%,
//               0 100%,
//               76% 57%,
//               53% 58%,
//               88% 33%,
//               60% 37%
//             );
//           }
//           .loader:after {
//             animation: l8 1s infinite;
//             transform: perspective(300px) translateZ(0px);
//           }
//           @keyframes l8 {
//             to {
//               transform: perspective(300px) translateZ(180px);
//               opacity: 0;
//             }
//           }
//         `}</style>
//       </div>

//       {/* 🏷️ Logo Section (Original Styling Preserved Exactly) */}
//       <div className="relative mb-6">
//         <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>

//         <h2 className="relative text-3xl md:text-5xl font-orbitron font-black tracking-widest text-white animate-pulse">
//           VARSHINI <span className="text-cyan-500">HYUNDAI</span>
//         </h2>
//       </div>

//       {/* 📝 Subtitle Section */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         className="flex flex-col items-center"
//       >
//         <p className="text-gray-500 text-[10px] font-mono tracking-[0.5em] uppercase">
//           Initializing Digital Core...
//         </p>

//         {/* Subtle Loading Bar */}
//         <div className="w-32 h-[1px] bg-white/10 mt-6 overflow-hidden relative">
//           <motion.div
//             animate={{ left: ["-100%", "100%"] }}
//             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
//             className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
//           />
//         </div>
//       </motion.div>

//       {/* Bottom Data Bits */}
//       <div className="absolute bottom-10 font-mono text-[8px] text-cyan-900/40 flex gap-10 tracking-widest uppercase">
//         <span>Auth: Secure</span>
//         <span>Link: Active</span>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useMemo, useRef } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useTransform,
// } from "framer-motion";
// import Image from "next/image";
// import { ProductCard } from "@/components/ProductCard";
// import { useStore } from "@/store/useStore";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import {
//   Search,
//   ChevronRight,
//   Car,
//   Settings,
//   ArrowRight,
//   ShieldCheck,
//   RotateCcw,
//   Truck,
//   Timer,
//   SearchCode,
//   Barcode,
//   Sparkles,
//   PlayCircle,
//   Wrench,
//   Layers,
//   Zap,
//   Disc,
//   Battery,
//   Droplet,
// } from "lucide-react";
// import ProductCarousel from "@/components/ProductCarousel";
// import FestivalCarousel from "@/components/FestivalCarousel";
// import ReviewsCarousel from "@/components/ReviewsCarousel";
// import Link from "next/link";

// // --- INTERFACES ---
// interface FlashSale {
//   isActive: boolean;
//   salePrice: number;
//   startTime: string;
//   endTime: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   partNumber: string;
//   description: string;
//   category: string;
//   subcategory?: string;
//   price: number;
//   stock: number;
//   stockStatus: string;
//   images: { url: string; publicId: string; _id: string }[];
//   flashSale?: FlashSale;
//   averageRating?: number;
//   discountPrice?: number;
//   finalPrice?: number;
// }

// // --- CONSTANTS ---
// const COMPATIBLE_MODELS = [
//   "CRETA",
//   "VERNA",
//   "i20",
//   "VENUE",
//   "TUCSON",
//   "ALCAZAR",
//   "AURA",
//   "SANTRO",
//   "ELANTRA",
//   "EXTER",
//   "IONIQ 5",
// ];

// const VISUAL_CATEGORIES = [
//   { name: "Engine Parts", icon: <Settings size={24} />, color: "bg-blue-500" },
//   { name: "Brake System", icon: <Disc size={24} />, color: "bg-red-500" },
//   { name: "Suspension", icon: <Layers size={24} />, color: "bg-green-500" },
//   { name: "Electricals", icon: <Battery size={24} />, color: "bg-yellow-500" },
//   { name: "Body Parts", icon: <Car size={24} />, color: "bg-purple-500" },
//   { name: "Fluids/Oils", icon: <Droplet size={24} />, color: "bg-cyan-500" },
// ];

// export default function Home() {
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [productsLoading, setProductsLoading] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [timeLeft, setTimeLeft] = useState({
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   // Search State
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchType, setSearchType] = useState<"keyword" | "vin" | "partNo">(
//     "keyword",
//   );

//   const { setCart, toggleCartDrawer } = useStore();
//   const heroRef = useRef(null);

//   // Parallax Effect
//   const { scrollYProgress } = useScroll({
//     target: heroRef,
//     offset: ["start start", "end start"],
//   });
//   const yText = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);

//   // 🔥 1. INITIAL LOAD
//   useEffect(() => {
//     const timer = setTimeout(() => setIsInitialLoad(false), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   // 🔥 2. FETCH PRODUCTS
//   useEffect(() => {
//     if (!isInitialLoad) {
//       fetchProducts();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isInitialLoad]);

//   const fetchProducts = async () => {
//     setProductsLoading(true);
//     try {
//       const response = await apiClient.get("/products", {
//         params: { limit: 20 },
//       });
//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setProductsLoading(false);
//     }
//   };

//   // 🔥 3. REAL COUNTDOWN TIMER LOGIC
//   useEffect(() => {
//     // Find the first active flash sale end time
//     const activeSale = products.find((p) => p.flashSale?.isActive);
//     if (!activeSale?.flashSale?.endTime) return;

//     const endTime = new Date(activeSale.flashSale.endTime).getTime();

//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = endTime - now;

//       if (distance < 0) {
//         clearInterval(interval);
//         setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
//       } else {
//         const hours = Math.floor(
//           (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
//         ); // Only hours left in day logic for simplicity, or total hours
//         const totalHours = Math.floor(distance / (1000 * 60 * 60)); // Total hours
//         const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((distance % (1000 * 60)) / 1000);
//         setTimeLeft({ hours: totalHours, minutes, seconds });
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [products]);

//   // 🚀 4. SEARCH FILTER
//   const filteredProducts = useMemo(() => {
//     if (!searchQuery) return products;
//     const normalize = (str: string) =>
//       str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
//     const normalizedQuery = normalize(searchQuery);

//     return products.filter((p) => {
//       if (searchType === "partNo") {
//         return normalize(p.partNumber).includes(normalizedQuery);
//       }
//       if (searchType === "keyword") {
//         return (
//           p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           normalize(p.partNumber).includes(normalizedQuery)
//         );
//       }
//       return true;
//     });
//   }, [products, searchQuery, searchType]);

//   const handleAddToCart = async (product: Product) => {
//     try {
//       const response = await apiClient.post("/cart/add", {
//         productId: product._id,
//         quantity: 1,
//       });
//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success(`${product.name} added to cart!`);
//         toggleCartDrawer();
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to add");
//     }
//   };

//   if (isInitialLoad) return <FullScreenLoader />;

//   return (
//     <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500/30">
//       <main>
//         {/* =========================================
//             🚀 1. HERO SECTION (FULL SCREEN)
//            ========================================= */}
//         <section
//           ref={heroRef}
//           className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black"
//         >
//           {/* 🎥 Video Background */}
//           <div className="absolute inset-0 z-0">
//             <div className="absolute inset-0 bg-black/40 z-10" />{" "}
//             {/* Overlay */}
//             <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-black/60 z-10" />
//             <video
//               autoPlay
//               loop
//               muted
//               playsInline
//               poster="/images/hero-poster.jpg"
//               className="w-full h-full object-cover scale-105"
//             >
//               <source src="/videos/hero-bg.mp4" type="video/mp4" />
//             </video>
//           </div>

//           <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-center">
//             {/* Text Content */}
//             <motion.div
//               style={{ y: yText }}
//               className="text-center max-w-4xl mx-auto space-y-6"
//             >
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl"
//               >
//                 <Sparkles size={14} className="text-cyan-400 animate-pulse" />
//                 <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
//                   Authorized Hyundai Mobis Distributor
//                 </span>
//               </motion.div>

//               <motion.h1
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1, duration: 0.8 }}
//                 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none text-white drop-shadow-lg"
//               >
//                 GENUINE PARTS <br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">
//                   REAL PERFORMANCE
//                 </span>
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed"
//               >
//                 Upgrade your drive with authentic components. Quality assured,
//                 precision engineered for your Hyundai.
//               </motion.p>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
//               >
//                 <button
//                   onClick={() =>
//                     document
//                       .getElementById("search-section")
//                       ?.scrollIntoView({ behavior: "smooth" })
//                   }
//                   className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2"
//                 >
//                   Find Parts Now <ArrowRight size={18} />
//                 </button>
//                 <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all flex items-center gap-2 justify-center">
//                   <PlayCircle size={18} /> Watch Video
//                 </button>
//               </motion.div>
//             </motion.div>
//           </div>

//           {/* 🔥 FLOATING GARAGE WIDGET (Perfectly Centered Bottom) */}
//           <div className="absolute bottom-12 lg:bottom-16 left-0 right-0 z-30 px-4 flex justify-center w-full">
//             <CompactGarageWidget />
//           </div>
//         </section>

//         {/* =========================================
//             🚀 2. MARQUEE (Animated Models)
//            ========================================= */}
//         <div className="bg-[#030712] border-y border-white/5 py-8 overflow-hidden relative">
//           <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#030712] to-transparent z-10" />
//           <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#030712] to-transparent z-10" />

//           <div className="flex overflow-hidden group">
//             <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
//               {[
//                 ...COMPATIBLE_MODELS,
//                 ...COMPATIBLE_MODELS,
//                 ...COMPATIBLE_MODELS,
//               ].map((model, i) => (
//                 <div key={i} className="flex items-center gap-4 group/item">
//                   <span className="text-3xl lg:text-4xl font-black text-white/20 uppercase group-hover/item:text-cyan-500 transition-colors cursor-default">
//                     {model}
//                   </span>
//                   <div className="w-2 h-2 rounded-full bg-white/10" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* =========================================
//             🚀 3. VISUAL CATEGORIES (New Section)
//            ========================================= */}
//         <section className="py-16 container mx-auto px-4">
//           <div className="text-center mb-10">
//             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//               Shop by Category
//             </h2>
//             <div className="w-16 h-1 bg-cyan-500 mx-auto rounded-full mt-2" />
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {VISUAL_CATEGORIES.map((cat, i) => (
//               <motion.div
//                 key={i}
//                 whileHover={{ y: -5 }}
//                 className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0F1623] border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer transition-all"
//               >
//                 <div
//                   className={`w-12 h-12 rounded-full ${cat.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center mb-3 text-${cat.color.split("-")[1]}-500`}
//                 >
//                   <div className="text-current">{cat.icon}</div>
//                 </div>
//                 <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
//                   {cat.name}
//                 </span>
//               </motion.div>
//             ))}
//           </div>
//         </section>

//         {/* =========================================
//             🚀 4. FLASH SALE (Real Timer)
//            ========================================= */}
//         {products.some((p) => p.flashSale?.isActive) && (
//           <section className="container mx-auto px-4 mb-16">
//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-indigo-500/30"
//             >
//               {/* Animated BG Elements */}
//               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse" />

//               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
//                 <div className="text-center md:text-left text-white">
//                   <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
//                     <Timer size={14} className="animate-spin-slow" /> Offers
//                     Ending Soon
//                   </div>
//                   <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight">
//                     Flash Sale is Live
//                   </h2>
//                   <p className="text-indigo-100 text-lg max-w-lg">
//                     Discounts up to 40% OFF on genuine spare parts. Don't miss
//                     out.
//                   </p>
//                 </div>

//                 {/* Real Countdown Timer */}
//                 <div className="flex gap-4">
//                   {[
//                     { label: "Hours", val: timeLeft.hours },
//                     { label: "Minutes", val: timeLeft.minutes },
//                     { label: "Seconds", val: timeLeft.seconds },
//                   ].map((item, i) => (
//                     <div key={i} className="flex flex-col items-center">
//                       <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/95 backdrop-blur text-indigo-700 rounded-3xl flex items-center justify-center text-3xl lg:text-4xl font-black shadow-xl">
//                         {String(item.val).padStart(2, "0")}
//                       </div>
//                       <span className="text-white/80 text-xs mt-3 font-bold uppercase tracking-widest">
//                         {item.label}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </section>
//         )}

//         {/* =========================================
//             🚀 5. FESTIVAL CAROUSEL (Relocated)
//            ========================================= */}
//         <div className="container mx-auto px-4 mb-20">
//           <FestivalCarousel />
//         </div>

//         {/* =========================================
//             🚀 6. STICKY ADVANCED SEARCH
//            ========================================= */}
//         <section id="search-section" className="py-12 container mx-auto px-4">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
//               Instant Part Finder
//             </h2>
//           </div>

//           <div className="sticky top-24 z-40 max-w-4xl mx-auto">
//             <motion.div
//               layout
//               className="bg-white/80 dark:bg-[#0F1623]/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl shadow-cyan-900/10 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-2"
//             >
//               <div className="flex bg-slate-100 dark:bg-black/20 p-1.5 rounded-xl shrink-0 overflow-x-auto">
//                 {[
//                   {
//                     id: "keyword",
//                     label: "Keyword",
//                     icon: <Search size={16} />,
//                   },
//                   {
//                     id: "partNo",
//                     label: "Part No.",
//                     icon: <Barcode size={16} />,
//                   },
//                   { id: "vin", label: "VIN", icon: <SearchCode size={16} /> },
//                 ].map((tab) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setSearchType(tab.id as any)}
//                     className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
//                       searchType === tab.id
//                         ? "bg-white dark:bg-slate-700 shadow-sm text-cyan-600 dark:text-cyan-400"
//                         : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
//                     }`}
//                   >
//                     {tab.icon} {tab.label}
//                   </button>
//                 ))}
//               </div>

//               <div className="relative flex-1 group">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
//                   {searchType === "partNo" ? <Barcode /> : <Search />}
//                 </div>
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder={
//                     searchType === "partNo"
//                       ? "Ex: 58101-M0000"
//                       : searchType === "vin"
//                         ? "Enter 17-digit Chassis Number"
//                         : "Search for 'Sunshade', 'Brake Pads'..."
//                   }
//                   className="w-full h-full pl-12 pr-4 py-3 bg-transparent border-none outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium text-lg"
//                 />
//                 {searchQuery && (
//                   <button
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-red-500 transition-colors"
//                   >
//                     <div className="w-4 h-4 flex items-center justify-center font-bold">
//                       ✕
//                     </div>
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         </section>

//         {/* =========================================
//             🚀 7. PRODUCT GRID
//            ========================================= */}
//         <section className="container mx-auto px-4 pb-24">
//           <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
//             <div>
//               <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
//                 {searchQuery ? "Search Results" : "Featured Collection"}
//               </h3>
//               <div className="h-1 w-20 bg-cyan-500 rounded-full mt-2" />
//             </div>
//           </div>

//           <motion.div
//             layout
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//           >
//             <AnimatePresence mode="popLayout">
//               {productsLoading ? (
//                 [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
//               ) : filteredProducts.length > 0 ? (
//                 filteredProducts.map((product, index) => (
//                   <motion.div
//                     key={product._id}
//                     layout
//                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
//                     transition={{ duration: 0.3, delay: index * 0.05 }}
//                   >
//                     <ProductCard
//                       product={product as any}
//                       onAddToCart={handleAddToCart}
//                       index={index}
//                     />
//                   </motion.div>
//                 ))
//               ) : (
//                 <div className="col-span-full py-24 text-center bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
//                   <div className="w-24 h-24 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
//                     <Search size={40} />
//                   </div>
//                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
//                     No parts found
//                   </h3>
//                   <button
//                     onClick={() => setSearchQuery("")}
//                     className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-700 transition-colors"
//                   >
//                     Clear Search
//                   </button>
//                 </div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </section>

//         <div className="mb-24 space-y-20">
//           <ReviewsCarousel />
//         </div>
//       </main>

//       {/* Floating WhatsApp */}
//       <Link
//         href="https://wa.me/919876543210"
//         target="_blank"
//         className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebd59] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
//       >
//         <Image
//           src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//           alt="WA"
//           width={24}
//           height={24}
//         />
//       </Link>

//       {/* CSS for Marquee - Add this in global CSS or here */}
//       <style jsx global>{`
//         @keyframes marquee {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
//         .animate-marquee {
//           animation: marquee 30s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

// // 🛠️ COMPACT GARAGE WIDGET (Improved Alignment)
// function CompactGarageWidget() {
//   return (
//     <div className="w-full max-w-5xl mx-4">
//       <motion.div
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
//         className="
//           flex flex-col lg:flex-row items-center gap-4 p-4 lg:p-3
//           bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-xl
//           border border-white/40 dark:border-white/10
//           rounded-3xl lg:rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.2)]
//           dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)]
//         "
//       >
//         <div className="flex items-center gap-4 px-4 w-full lg:w-auto border-b lg:border-none border-gray-200 dark:border-white/10 pb-4 lg:pb-0">
//           <div className="p-3 bg-gradient-to-tr from-cyan-500 to-blue-600 text-white rounded-full shadow-lg shadow-cyan-500/30">
//             <Car size={24} />
//           </div>
//           <div className="flex-1">
//             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
//               My Garage
//             </p>
//             <p className="text-lg font-black text-gray-900 dark:text-white leading-none whitespace-nowrap">
//               Select Car
//             </p>
//           </div>
//         </div>

//         <div className="hidden lg:block w-[1px] h-12 bg-gray-300 dark:bg-white/10 mx-2"></div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
//           <GlassSelect
//             icon={<Car size={16} />}
//             placeholder="Model (e.g. Creta)"
//           />
//           <GlassSelect
//             icon={<Timer size={16} />}
//             placeholder="Year (e.g. 2024)"
//           />
//           <GlassSelect icon={<Settings size={16} />} placeholder="Variant" />
//         </div>

//         <button className="w-full lg:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl lg:rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95 text-sm whitespace-nowrap flex items-center justify-center gap-2">
//           <Wrench size={16} />
//           Filter Parts
//         </button>
//       </motion.div>
//     </div>
//   );
// }

// function GlassSelect({
//   icon,
//   placeholder,
// }: {
//   icon: any;
//   placeholder: string;
// }) {
//   return (
//     <div className="relative group w-full">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-cyan-500 transition-colors">
//         {icon}
//       </div>
//       <select className="w-full pl-11 pr-8 py-3.5 bg-gray-100/50 dark:bg-black/20 border-none rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors">
//         <option value="" disabled selected>
//           {placeholder}
//         </option>
//         {COMPATIBLE_MODELS.map((m) => (
//           <option key={m}>{m}</option>
//         ))}
//       </select>
//       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
//         <ChevronRight size={14} className="rotate-90" />
//       </div>
//     </div>
//   );
// }

// // 💀 SKELETON
// function ProductSkeleton() {
//   return (
//     <div className="bg-white dark:bg-[#0F1623] rounded-[2rem] p-5 border border-slate-100 dark:border-white/5 h-[420px] flex flex-col gap-5 relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
//       <div className="w-full h-52 bg-slate-100 dark:bg-white/5 rounded-2xl" />
//       <div className="space-y-3">
//         <div className="w-3/4 h-5 bg-slate-100 dark:bg-white/5 rounded-md" />
//         <div className="w-1/2 h-4 bg-slate-100 dark:bg-white/5 rounded-md" />
//       </div>
//       <div className="mt-auto flex justify-between items-center">
//         <div className="w-24 h-8 bg-slate-100 dark:bg-white/5 rounded-md" />
//         <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5" />
//       </div>
//     </div>
//   );
// }

// // ⚡ SYSTEM LOADER
// function FullScreenLoader() {
//   return (
//     <div className="fixed inset-0 z-[9999] bg-[#030712] flex flex-col items-center justify-center overflow-hidden font-sans">
//       <div className="relative flex flex-col items-center">
//         <div className="relative w-24 h-24 mb-8">
//           <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
//           <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <Sparkles className="text-cyan-500 animate-pulse" size={24} />
//           </div>
//         </div>
//         <h2 className="text-4xl font-black tracking-[0.3em] text-white">
//           VARSHINI
//         </h2>
//         <p className="text-cyan-500 text-xs font-bold tracking-[0.5em] mt-3 uppercase animate-pulse">
//           Initializing System
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/store/useStore";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import VisualPartsFinder from "@/components/VisualPartsFinder";
import {
  Search,
  ChevronRight,
  Car,
  Settings,
  Timer,
  Sparkles,
  ArrowRight,
  Wrench,
  Layers,
  Battery,
  Disc,
  Droplet,
  Fuel,
  ArrowDown,
} from "lucide-react";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { WhyChooseUs } from "@/components/whyChooseUs";
import Link from "next/link";
import GarageSection from "@/components/GarageSection";
// Imports Section లో ఇది యాడ్ చేయండి
import { useRouter } from "next/navigation"; // For redirection
import { addToGarage } from "@/services/userService"; // To save car to DB
import FestivalCarousel from "@/components/FestivalCarousel";

// --- INTERFACES ---
interface FlashSale {
  isActive: boolean;
  salePrice: number;
  startTime: string;
  endTime: string;
}

interface Product {
  _id: string;
  name: string;
  partNumber: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  stock: number;
  stockStatus: string;
  images: { url: string; publicId: string; _id: string }[];
  flashSale?: FlashSale;
  averageRating?: number;
  discountPrice?: number;
  finalPrice?: number;
}

// --- CONSTANTS ---
const COMPATIBLE_MODELS = [
  "CRETA",
  "VERNA",
  "i20",
  "VENUE",
  "TUCSON",
  "ALCAZAR",
  "AURA",
  "SANTRO",
  "ELANTRA",
  "EXTER",
  "IONIQ 5",
];

const VISUAL_CATEGORIES = [
  {
    name: "Engine",
    icon: <Settings size={24} />,
    color: "from-blue-400 to-indigo-600",
    desc: "Pistons & Belts",
  },
  {
    name: "Brakes",
    icon: <Disc size={24} />,
    color: "from-rose-400 to-red-600",
    desc: "Pads & Discs",
  },
  {
    name: "Suspension",
    icon: <Layers size={24} />,
    color: "from-emerald-400 to-teal-600",
    desc: "Shocks & Struts",
  },
  {
    name: "Electrical",
    icon: <Battery size={24} />,
    color: "from-amber-400 to-orange-600",
    desc: "Lights & Batteries",
  },
  {
    name: "Body",
    icon: <Car size={24} />,
    color: "from-violet-400 to-purple-600",
    desc: "Bumpers & Mirrors",
  },
  {
    name: "Fluids",
    icon: <Droplet size={24} />,
    color: "from-cyan-400 to-blue-500",
    desc: "Oils & Coolants",
  },
];

export default function Home() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"keyword" | "vin" | "partNo">(
    "keyword",
  );

  const heroRef = useRef(null);
  const router = useRouter(); // ✅ Navigation కోసం
  const { setCart, toggleCartDrawer, setSelectedVehicle } = useStore();

  // Parallax Text Effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 🔥 INITIAL LOAD
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    if (!isInitialLoad) fetchProducts();
  }, [isInitialLoad]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await apiClient.get("/products", {
        params: { limit: 20 },
      });
      if (response.data.success) setProducts(response.data.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  // 🔥 VIN Search Function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    // 1. VIN Search Logic
    if (searchType === "vin") {
      if (searchQuery.length !== 17) {
        toast.error("VIN must be exactly 17 characters");
        return;
      }

      const toastId = toast.loading("Decoding VIN...");
      try {
        // బ్యాకెండ్ API కాల్ (గతంలో మనం రాసిన రూట్)
        const { data } = await apiClient.post("users/garage/decode-vin", {
          vin: searchQuery,
        });

        if (data.success) {
          const vehicle = data.data;

          // 1. Store లో వెహికల్ ని సెట్ చేయండి
          setSelectedVehicle(vehicle);

          // 2. ఆప్షనల్: యూజర్ లాగిన్ అయి ఉంటే Database లోకి యాడ్ చేయండి
          // await addToGarage(vehicle);

          toast.success(`Found: ${vehicle.brand} ${vehicle.model}`, {
            id: toastId,
          });

          // 3. Products పేజీకి రీడైరెక్ట్ చేయండి (ఆ వెహికల్ ఫిల్టర్ తో)
          router.push("/products");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "VIN not found", {
          id: toastId,
        });
      }
    }
    // 2. Part Number / Keyword Search Logic (Existing)
    else {
      // ఇక్కడ మీరు కావాలంటే Products Page కి సెర్చ్ క్వెరీతో పంపవచ్చు
      // router.push(`/products?search=${searchQuery}`);

      // లేదా ప్రస్తుత పేజీలోనే స్క్రోల్ చేయొచ్చు (మీ పాత లాజిక్ ప్రకారం)
      document
        .getElementById("products-grid")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 🚀 FILTER LOGIC
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const normalize = (str: string) =>
      str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const normalizedQuery = normalize(searchQuery);

    return products.filter((p) => {
      if (searchType === "partNo")
        return normalize(p.partNumber).includes(normalizedQuery);
      if (searchType === "keyword")
        return (
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          normalize(p.partNumber).includes(normalizedQuery)
        );
      return true;
    });
  }, [products, searchQuery, searchType]);

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await apiClient.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success(`${product.name} added to cart!`);
        toggleCartDrawer();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add");
    }
  };

  if (isInitialLoad) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-[#030014] dark:via-[#0f0f2a] dark:to-[#050510] text-slate-900 dark:text-white font-sans transition-colors duration-500 overflow-x-hidden">
      {/* 🌌 GLOBAL BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10">
        {/* =========================================
            🎥 1. HERO SECTION
           ========================================= */}
        <section
          ref={heroRef}
          className="relative w-full h-screen flex flex-col items-center justify-end pb-20 overflow-hidden"
        >
          {/* Video Layer */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/video.mp4" type="video/mp4" />
            </video>
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-black/20 z-10" />
          </div>

          {/* Text Content */}
          <motion.div
            style={{ y: yText, opacity: opacityText }}
            className="relative z-20 text-center px-4 w-full max-w-4xl mx-auto mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md mb-6 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Authorized Hyundai Mobis Distributor
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none drop-shadow-2xl"
            >
              GENUINE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 animate-gradient-x">
                PERFORMANCE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-base md:text-xl text-blue-100 max-w-xl mx-auto font-medium leading-relaxed drop-shadow-md"
            >
              Precision engineered components. Safety assured.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-10 flex justify-center"
            >
              <div
                onClick={() =>
                  document
                    .getElementById("garage-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="cursor-pointer flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors hover:scale-110 duration-300"
              >
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Scroll to Find Parts
                </span>
                <ArrowDown size={24} className="animate-bounce text-cyan-400" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* =========================================
            ✨ 2. BRAND MARQUEE
           ========================================= */}
        <div className="py-12 bg-white/90 dark:bg-blue-950/20 backdrop-blur-xl border-y border-gray-200 dark:border-white/10 relative overflow-hidden shadow-sm">
          <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
            {[
              ...COMPATIBLE_MODELS,
              ...COMPATIBLE_MODELS,
              ...COMPATIBLE_MODELS,
            ].map((model, i) => (
              <span
                key={i}
                className="text-4xl md:text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 hover:scale-110 transition-transform duration-300 cursor-default select-none"
              >
                {model}
              </span>
            ))}
          </div>
        </div>

        {/* 👇👇👇 ఇక్కడ FESTIVAL CAROUSEL ని యాడ్ చేయండి 👇👇👇 */}
        <section className="container mx-auto px-4 mt-12 mb-8">
          <FestivalCarousel />
        </section>
        {/* 👆👆👆 ముగింపు 👆👆👆 */}

        {/* =========================================
            🚗 3. MY GARAGE DASHBOARD (Colorful Card)
           ========================================= */}
        <GarageSection />

        {/* =========================================
            📦 4. CATEGORIES (Vibrant Cards)
           ========================================= */}
        <section className="container mx-auto px-4 mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Shop by Category
            </h2>
            <Link
              href="#"
              className="text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {VISUAL_CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-[1px] rounded-[1.5rem] bg-gradient-to-b from-white/60 to-white/20 dark:from-white/10 dark:to-transparent shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300"
              >
                <div className="h-full bg-white dark:bg-[#12121a] rounded-[1.4rem] p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                  {/* Hover Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    {cat.icon}
                  </div>

                  <div className="relative z-10">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-1 font-medium">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <VisualPartsFinder />

        {/* =========================================
            🔎 5. ADVANCED SEARCH (Updated Colors)
           ========================================= */}
        <section id="search-section" className="container mx-auto px-4 py-16">
          <div className="sticky top-24 z-40 mb-16 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-[#1a1a24]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 p-3 rounded-[1.5rem] shadow-2xl shadow-blue-500/10 dark:shadow-black/50 flex flex-col md:flex-row gap-3 transition-colors">
              <div className="flex p-1.5 bg-gray-100 dark:bg-black/40 rounded-xl">
                {[
                  { id: "keyword", label: "Keyword" },
                  { id: "partNo", label: "Part No" },
                  { id: "vin", label: "VIN" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSearchType(t.id as any)}
                    className={`px-6 py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      searchType === t.id
                        ? "bg-white dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 text-slate-900 dark:text-white shadow-md"
                        : "text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 group">
                <button
                  onClick={handleSearch}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 hover:text-blue-600 transition-colors z-10"
                >
                  <Search size={20} />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    // VIN అయితే ఆటోమేటిక్ గా Capital Letters లోకి మార్చండి
                    const val =
                      searchType === "vin"
                        ? e.target.value.toUpperCase()
                        : e.target.value;
                    setSearchQuery(val);
                  }}
                  // 🔥 Enter నొక్కితే సెర్చ్ అవ్వాలి
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={
                    searchType === "vin"
                      ? "Enter 17-digit VIN (e.g. MALC181...)"
                      : "Search for parts (e.g. Brake Pads)..."
                  }
                  maxLength={searchType === "vin" ? 17 : 50} // VIN Limit
                  className="w-full h-full bg-transparent border-none text-slate-900 dark:text-white pl-14 pr-10 outline-none placeholder:text-gray-400 font-semibold text-sm rounded-xl focus:bg-white/50 dark:focus:bg-white/5 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {productsLoading ? (
                [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard
                      product={product as any}
                      onAddToCart={handleAddToCart}
                      index={index}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-40 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] bg-white/40 dark:bg-white/5">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    No matches found
                  </h3>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-6 text-blue-600 dark:text-cyan-400 font-bold uppercase text-xs hover:underline tracking-widest"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        <div className="mb-0 space-y-0">
          <WhyChooseUs />
          <ReviewsCarousel />
        </div>
      </main>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-move 3s ease infinite;
        }
        @keyframes gradient-move {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}

// 🛠️ ADAPTIVE DASHBOARD SELECT (Updated Colors)
function DashboardSelect({
  label,
  icon,
  placeholder,
  options,
}: {
  label: string;
  icon: any;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="w-full group">
      <label className="block text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-blue-600 dark:group-focus-within:text-cyan-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors pointer-events-none">
          {icon}
        </div>
        <select className="w-full pl-11 pr-10 py-4 bg-gray-50 dark:bg-[#16161f] border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:bg-white dark:focus:bg-[#16161f] outline-none appearance-none cursor-pointer transition-all shadow-sm">
          <option value="" disabled selected>
            {placeholder}
          </option>
          {options.map((o) => (
            <option
              key={o}
              className="bg-white dark:bg-[#16161f] text-slate-900 dark:text-gray-300"
            >
              {o}
            </option>
          ))}
        </select>
        <ChevronRight
          size={14}
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rotate-90"
        />
      </div>
    </div>
  );
}

// 💀 SKELETON LOADER
function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0f0f16] rounded-[1.5rem] p-5 border border-gray-200 dark:border-white/5 h-[400px] flex flex-col gap-4 relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <div className="w-full h-48 bg-gray-100 dark:bg-white/5 rounded-2xl" />
      <div className="flex-1 space-y-3 pt-2">
        <div className="w-3/4 h-4 bg-gray-100 dark:bg-white/5 rounded-full" />
        <div className="w-1/2 h-3 bg-gray-100 dark:bg-white/5 rounded-full" />
      </div>
      <div className="w-full h-12 bg-gray-100 dark:bg-white/5 rounded-xl" />
    </div>
  );
}

// ⚡ LOADER
function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#02040a] flex flex-col items-center justify-center transition-colors">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-gray-200 dark:border-cyan-900/30 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-blue-500 dark:border-t-cyan-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles
            className="text-blue-500 dark:text-cyan-500 animate-pulse"
            size={24}
          />
        </div>
      </div>
      <h2 className="text-3xl font-black tracking-[0.5em] text-slate-900 dark:text-white">
        VARSHINI
      </h2>
    </div>
  );
}
