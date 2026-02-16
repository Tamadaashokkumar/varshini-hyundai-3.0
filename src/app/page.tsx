// "use client";

// import { useEffect, useState, useMemo, useRef } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useTransform,
// } from "framer-motion";
// import { ProductCard } from "@/components/ProductCard";
// import { useStore } from "@/store/useStore";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import VisualPartsFinder from "@/components/VisualPartsFinder";
// import {
//   Search,
//   ChevronRight,
//   Car,
//   Settings,
//   Timer,
//   Sparkles,
//   ArrowRight,
//   Wrench,
//   Layers,
//   Battery,
//   Disc,
//   Droplet,
//   Fuel,
//   ArrowDown,
// } from "lucide-react";
// import ReviewsCarousel from "@/components/ReviewsCarousel";
// import { WhyChooseUs } from "@/components/whyChooseUs";
// import Link from "next/link";
// import GarageSection from "@/components/GarageSection";
// // Imports Section లో ఇది యాడ్ చేయండి
// import { useRouter } from "next/navigation"; // For redirection
// import { addToGarage } from "@/services/userService"; // To save car to DB
// import FestivalCarousel from "@/components/FestivalCarousel";
// import { wishlistAPI } from "@/lib/api/wishlist"; // Wishlist API

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
//   {
//     name: "Engine",
//     icon: <Settings size={24} />,
//     color: "from-blue-400 to-indigo-600",
//     desc: "Pistons & Belts",
//   },
//   {
//     name: "Brakes",
//     icon: <Disc size={24} />,
//     color: "from-rose-400 to-red-600",
//     desc: "Pads & Discs",
//   },
//   {
//     name: "Suspension",
//     icon: <Layers size={24} />,
//     color: "from-emerald-400 to-teal-600",
//     desc: "Shocks & Struts",
//   },
//   {
//     name: "Electrical",
//     icon: <Battery size={24} />,
//     color: "from-amber-400 to-orange-600",
//     desc: "Lights & Batteries",
//   },
//   {
//     name: "Body",
//     icon: <Car size={24} />,
//     color: "from-violet-400 to-purple-600",
//     desc: "Bumpers & Mirrors",
//   },
//   {
//     name: "Fluids",
//     icon: <Droplet size={24} />,
//     color: "from-cyan-400 to-blue-500",
//     desc: "Oils & Coolants",
//   },
// ];

// export default function Home() {
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [productsLoading, setProductsLoading] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchType, setSearchType] = useState<"keyword" | "vin" | "partNo">(
//     "keyword",
//   );
//   // 🔥 NEW STATE: Wishlist Status Map
//   const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>(
//     {},
//   );

//   const heroRef = useRef(null);
//   const router = useRouter(); // ✅ Navigation కోసం
//   const { setCart, toggleCartDrawer, setSelectedVehicle } = useStore();

//   // Parallax Text Effect
//   const { scrollYProgress } = useScroll({
//     target: heroRef,
//     offset: ["start start", "end start"],
//   });
//   const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
//   const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

//   // 🔥 INITIAL LOAD
//   useEffect(() => {
//     const timer = setTimeout(() => setIsInitialLoad(false), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   // 🔥 FETCH PRODUCTS
//   useEffect(() => {
//     if (!isInitialLoad) fetchProducts();
//   }, [isInitialLoad]);

//   const fetchProducts = async () => {
//     setProductsLoading(true);
//     try {
//       // 1. Products ని Fetch చేయడం
//       const response = await apiClient.get("/products", {
//         params: { limit: 20 },
//       });

//       if (response.data.success) {
//         const fetchedProducts = response.data.data;
//         setProducts(fetchedProducts);

//         // 2. 🔥 NEW: Batch Wishlist Check (Only if products exist)
//         // ప్రొడక్ట్స్ ఉంటేనే విష్‌లిస్ట్ చెక్ చేయాలి
//         if (fetchedProducts.length > 0) {
//           // అన్ని ప్రొడక్ట్ IDs ని ఒక Array లోకి తీసుకుంటున్నాం
//           const productIds = fetchedProducts.map((p: any) => p._id);

//           // బ్యాచ్ API కాల్ చేస్తున్నాం (Single Call instead of 20 calls)
//           const statusRes = await wishlistAPI.checkBatchStatus(productIds);

//           if (statusRes.success) {
//             // వచ్చిన స్టేటస్ ని State లో సేవ్ చేస్తున్నాం
//             setWishlistStatus(statusRes.statusMap);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setProductsLoading(false);
//     }
//   };
//   // 🔥 VIN Search Function
//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;

//     // 1. VIN Search Logic
//     if (searchType === "vin") {
//       if (searchQuery.length !== 17) {
//         toast.error("VIN must be exactly 17 characters");
//         return;
//       }

//       const toastId = toast.loading("Decoding VIN...");
//       try {
//         // బ్యాకెండ్ API కాల్ (గతంలో మనం రాసిన రూట్)
//         const { data } = await apiClient.post("users/garage/decode-vin", {
//           vin: searchQuery,
//         });

//         if (data.success) {
//           const vehicle = data.data;

//           // 1. Store లో వెహికల్ ని సెట్ చేయండి
//           setSelectedVehicle(vehicle);

//           // 2. ఆప్షనల్: యూజర్ లాగిన్ అయి ఉంటే Database లోకి యాడ్ చేయండి
//           // await addToGarage(vehicle);

//           toast.success(`Found: ${vehicle.brand} ${vehicle.model}`, {
//             id: toastId,
//           });

//           // 3. Products పేజీకి రీడైరెక్ట్ చేయండి (ఆ వెహికల్ ఫిల్టర్ తో)
//           router.push("/products");
//         }
//       } catch (error: any) {
//         toast.error(error.response?.data?.message || "VIN not found", {
//           id: toastId,
//         });
//       }
//     }
//     // 2. Part Number / Keyword Search Logic (Existing)
//     else {
//       // ఇక్కడ మీరు కావాలంటే Products Page కి సెర్చ్ క్వెరీతో పంపవచ్చు
//       // router.push(`/products?search=${searchQuery}`);

//       // లేదా ప్రస్తుత పేజీలోనే స్క్రోల్ చేయొచ్చు (మీ పాత లాజిక్ ప్రకారం)
//       document
//         .getElementById("products-grid")
//         ?.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   // 🚀 FILTER LOGIC
//   const filteredProducts = useMemo(() => {
//     if (!searchQuery) return products;
//     const normalize = (str: string) =>
//       str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
//     const normalizedQuery = normalize(searchQuery);

//     return products.filter((p) => {
//       if (searchType === "partNo")
//         return normalize(p.partNumber).includes(normalizedQuery);
//       if (searchType === "keyword")
//         return (
//           p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           normalize(p.partNumber).includes(normalizedQuery)
//         );
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
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-[#030014] dark:via-[#0f0f2a] dark:to-[#050510] text-slate-900 dark:text-white font-sans transition-colors duration-500 overflow-x-hidden">
//       {/* 🌌 GLOBAL BACKGROUND AMBIENCE */}
//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px]" />
//       </div>

//       <main className="relative z-10">
//         {/* =========================================
//             🎥 1. HERO SECTION
//            ========================================= */}
//         <section
//           ref={heroRef}
//           className="relative w-full h-screen flex flex-col items-center justify-end pb-20 overflow-hidden"
//         >
//           {/* Video Layer */}
//           <div className="absolute inset-0 z-0">
//             <video
//               autoPlay
//               loop
//               muted
//               playsInline
//               className="w-full h-full object-cover"
//             >
//               <source src="/videos/video.mp4" type="video/mp4" />
//             </video>
//             {/* Gradient Overlay for Text Readability */}
//             <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-black/20 z-10" />
//           </div>

//           {/* Text Content */}
//           <motion.div
//             style={{ y: yText, opacity: opacityText }}
//             className="relative z-20 text-center px-4 w-full max-w-4xl mx-auto mb-12"
//           >
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md mb-6 shadow-lg shadow-cyan-500/20"
//             >
//               <Sparkles size={14} className="text-cyan-400 animate-pulse" />
//               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
//                 Authorized Hyundai Mobis Distributor
//               </span>
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none drop-shadow-2xl"
//             >
//               GENUINE <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 animate-gradient-x">
//                 PERFORMANCE
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="mt-6 text-base md:text-xl text-blue-100 max-w-xl mx-auto font-medium leading-relaxed drop-shadow-md"
//             >
//               Precision engineered components. Safety assured.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1, duration: 1 }}
//               className="mt-10 flex justify-center"
//             >
//               <div
//                 onClick={() =>
//                   document
//                     .getElementById("garage-section")
//                     ?.scrollIntoView({ behavior: "smooth" })
//                 }
//                 className="cursor-pointer flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors hover:scale-110 duration-300"
//               >
//                 <span className="text-[10px] uppercase tracking-widest font-bold">
//                   Scroll to Find Parts
//                 </span>
//                 <ArrowDown size={24} className="animate-bounce text-cyan-400" />
//               </div>
//             </motion.div>
//           </motion.div>
//         </section>

//         {/* =========================================
//             ✨ 2. BRAND MARQUEE
//            ========================================= */}
//         <div className="py-12 bg-white/90 dark:bg-blue-950/20 backdrop-blur-xl border-y border-gray-200 dark:border-white/10 relative overflow-hidden shadow-sm">
//           <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
//             {[
//               ...COMPATIBLE_MODELS,
//               ...COMPATIBLE_MODELS,
//               ...COMPATIBLE_MODELS,
//             ].map((model, i) => (
//               <span
//                 key={i}
//                 className="text-4xl md:text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 hover:scale-110 transition-transform duration-300 cursor-default select-none"
//               >
//                 {model}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* 👇👇👇 ఇక్కడ FESTIVAL CAROUSEL ని యాడ్ చేయండి 👇👇👇 */}
//         <section className="container mx-auto px-4 mt-12 mb-8">
//           <FestivalCarousel />
//         </section>
//         {/* 👆👆👆 ముగింపు 👆👆👆 */}

//         {/* =========================================
//             🚗 3. MY GARAGE DASHBOARD (Colorful Card)
//            ========================================= */}
//         <GarageSection />

//         {/* =========================================
//             📦 4. CATEGORIES (Vibrant Cards)
//            ========================================= */}
//         <section className="container mx-auto px-4 mb-24">
//           <div className="flex items-center justify-between mb-10">
//             <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
//               Shop by Category
//             </h2>
//             <Link
//               href="#"
//               className="text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
//             >
//               View All <ChevronRight size={14} />
//             </Link>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//             {VISUAL_CATEGORIES.map((cat, i) => (
//               <motion.div
//                 key={i}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 className="group relative p-[1px] rounded-[1.5rem] bg-gradient-to-b from-white/60 to-white/20 dark:from-white/10 dark:to-transparent shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300"
//               >
//                 <div className="h-full bg-white dark:bg-[#12121a] rounded-[1.4rem] p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden">
//                   {/* Hover Gradient Background */}
//                   <div
//                     className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
//                   />

//                   <div
//                     className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
//                   >
//                     {cat.icon}
//                   </div>

//                   <div className="relative z-10">
//                     <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
//                       {cat.name}
//                     </h4>
//                     <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-1 font-medium">
//                       {cat.desc}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </section>

//         <VisualPartsFinder />

//         {/* =========================================
//             🔎 5. ADVANCED SEARCH (Updated Colors)
//            ========================================= */}
//         <section id="search-section" className="container mx-auto px-4 py-16">
//           <div className="sticky top-24 z-40 mb-16 max-w-4xl mx-auto">
//             <div className="bg-white/80 dark:bg-[#1a1a24]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 p-3 rounded-[1.5rem] shadow-2xl shadow-blue-500/10 dark:shadow-black/50 flex flex-col md:flex-row gap-3 transition-colors">
//               <div className="flex p-1.5 bg-gray-100 dark:bg-black/40 rounded-xl">
//                 {[
//                   { id: "keyword", label: "Keyword" },
//                   { id: "partNo", label: "Part No" },
//                   { id: "vin", label: "VIN" },
//                 ].map((t) => (
//                   <button
//                     key={t.id}
//                     onClick={() => setSearchType(t.id as any)}
//                     className={`px-6 py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
//                       searchType === t.id
//                         ? "bg-white dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 text-slate-900 dark:text-white shadow-md"
//                         : "text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
//                     }`}
//                   >
//                     {t.label}
//                   </button>
//                 ))}
//               </div>
//               <div className="relative flex-1 group">
//                 <button
//                   onClick={handleSearch}
//                   className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 hover:text-blue-600 transition-colors z-10"
//                 >
//                   <Search size={20} />
//                 </button>
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => {
//                     // VIN అయితే ఆటోమేటిక్ గా Capital Letters లోకి మార్చండి
//                     const val =
//                       searchType === "vin"
//                         ? e.target.value.toUpperCase()
//                         : e.target.value;
//                     setSearchQuery(val);
//                   }}
//                   // 🔥 Enter నొక్కితే సెర్చ్ అవ్వాలి
//                   onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//                   placeholder={
//                     searchType === "vin"
//                       ? "Enter 17-digit VIN (e.g. MALC181...)"
//                       : "Search for parts (e.g. Brake Pads)..."
//                   }
//                   maxLength={searchType === "vin" ? 17 : 50} // VIN Limit
//                   className="w-full h-full bg-transparent border-none text-slate-900 dark:text-white pl-14 pr-10 outline-none placeholder:text-gray-400 font-semibold text-sm rounded-xl focus:bg-white/50 dark:focus:bg-white/5 transition-colors"
//                 />
//                 {searchQuery && (
//                   <button
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           <motion.div
//             layout
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
//           >
//             <AnimatePresence mode="popLayout">
//               {productsLoading ? (
//                 [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
//               ) : filteredProducts.length > 0 ? (
//                 filteredProducts.map((product, index) => (
//                   <motion.div
//                     key={product._id}
//                     layout
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     transition={{ duration: 0.3, delay: index * 0.05 }}
//                   >
//                     <ProductCard
//                       product={product as any}
//                       onAddToCart={handleAddToCart}
//                       index={index}
//                       // 🔥 NEW PROP: Pass the pre-fetched status
//                       initialWishlistState={
//                         wishlistStatus[product._id] || false
//                       }
//                     />
//                   </motion.div>
//                 ))
//               ) : (
//                 <div className="col-span-full py-40 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] bg-white/40 dark:bg-white/5">
//                   <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
//                     <Search size={40} />
//                   </div>
//                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
//                     No matches found
//                   </h3>
//                   <button
//                     onClick={() => setSearchQuery("")}
//                     className="mt-6 text-blue-600 dark:text-cyan-400 font-bold uppercase text-xs hover:underline tracking-widest"
//                   >
//                     Clear Filters
//                   </button>
//                 </div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </section>

//         <div className="mb-0 space-y-0">
//           <WhyChooseUs />
//           <ReviewsCarousel />
//         </div>
//       </main>

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
//           animation: marquee 20s linear infinite;
//         }
//         .animate-gradient-x {
//           background-size: 200% 200%;
//           animation: gradient-move 3s ease infinite;
//         }
//         @keyframes gradient-move {
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
//       `}</style>
//     </div>
//   );
// }

// // 🛠️ ADAPTIVE DASHBOARD SELECT (Updated Colors)
// function DashboardSelect({
//   label,
//   icon,
//   placeholder,
//   options,
// }: {
//   label: string;
//   icon: any;
//   placeholder: string;
//   options: string[];
// }) {
//   return (
//     <div className="w-full group">
//       <label className="block text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-blue-600 dark:group-focus-within:text-cyan-400 transition-colors">
//         {label}
//       </label>
//       <div className="relative">
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors pointer-events-none">
//           {icon}
//         </div>
//         <select className="w-full pl-11 pr-10 py-4 bg-gray-50 dark:bg-[#16161f] border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:bg-white dark:focus:bg-[#16161f] outline-none appearance-none cursor-pointer transition-all shadow-sm">
//           <option value="" disabled selected>
//             {placeholder}
//           </option>
//           {options.map((o) => (
//             <option
//               key={o}
//               className="bg-white dark:bg-[#16161f] text-slate-900 dark:text-gray-300"
//             >
//               {o}
//             </option>
//           ))}
//         </select>
//         <ChevronRight
//           size={14}
//           className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rotate-90"
//         />
//       </div>
//     </div>
//   );
// }

// // 💀 SKELETON LOADER
// function ProductSkeleton() {
//   return (
//     <div className="bg-white dark:bg-[#0f0f16] rounded-[1.5rem] p-5 border border-gray-200 dark:border-white/5 h-[400px] flex flex-col gap-4 relative overflow-hidden shadow-sm">
//       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
//       <div className="w-full h-48 bg-gray-100 dark:bg-white/5 rounded-2xl" />
//       <div className="flex-1 space-y-3 pt-2">
//         <div className="w-3/4 h-4 bg-gray-100 dark:bg-white/5 rounded-full" />
//         <div className="w-1/2 h-3 bg-gray-100 dark:bg-white/5 rounded-full" />
//       </div>
//       <div className="w-full h-12 bg-gray-100 dark:bg-white/5 rounded-xl" />
//     </div>
//   );
// }

// // ⚡ LOADER
// function FullScreenLoader() {
//   return (
//     <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#02040a] flex flex-col items-center justify-center transition-colors">
//       <div className="relative w-24 h-24 mb-6">
//         <div className="absolute inset-0 border-4 border-gray-200 dark:border-cyan-900/30 rounded-full" />
//         <div className="absolute inset-0 border-4 border-t-blue-500 dark:border-t-cyan-500 rounded-full animate-spin" />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <Sparkles
//             className="text-blue-500 dark:text-cyan-500 animate-pulse"
//             size={24}
//           />
//         </div>
//       </div>
//       <h2 className="text-3xl font-black tracking-[0.5em] text-slate-900 dark:text-white">
//         VARSHINI
//       </h2>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo, useRef, forwardRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic"; // 🔥 IMPORT THIS FOR PERFORMANCE
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/store/useStore";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import {
  Search,
  ChevronRight,
  Car,
  Settings,
  Timer,
  Sparkles,
  ArrowRight,
  Layers,
  Battery,
  Disc,
  Droplet,
  ArrowDown,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { wishlistAPI } from "@/lib/api/wishlist";

// 🔥 DYNAMIC IMPORTS (Lazy Loading to boost Lighthouse Score)
const VisualPartsFinder = dynamic(
  () => import("@/components/VisualPartsFinder"),
  {
    loading: () => (
      <div className="h-96 w-full bg-gray-100 dark:bg-white/5 rounded-[2rem] animate-pulse my-12" />
    ),
    ssr: false, // Disable SSR for heavy interactive components
  },
);

const ReviewsCarousel = dynamic(() => import("@/components/ReviewsCarousel"), {
  loading: () => (
    <div className="h-64 w-full bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse my-8" />
  ),
});

const GarageSection = dynamic(() => import("@/components/GarageSection"), {
  loading: () => (
    <div className="h-72 w-full bg-gray-100 dark:bg-white/5 rounded-[2rem] animate-pulse my-10" />
  ),
});

const FestivalCarousel = dynamic(
  () => import("@/components/FestivalCarousel"),
  {
    loading: () => (
      <div className="h-48 w-full bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse my-6" />
    ),
  },
);

// Handling Named Export for WhyChooseUs
const WhyChooseUs = dynamic(() =>
  import("@/components/whyChooseUs").then((mod) => mod.WhyChooseUs),
);

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
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>(
    {},
  );

  const heroRef = useRef(null);
  const router = useRouter();
  const { setCart, toggleCartDrawer, setSelectedVehicle } = useStore();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // INITIAL LOAD SIMULATION
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // FETCH PRODUCTS & BATCH WISHLIST
  useEffect(() => {
    if (!isInitialLoad) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialLoad]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await apiClient.get("/products", {
        params: { limit: 20 },
      });

      if (response.data.success) {
        const fetchedProducts = response.data.data;
        setProducts(fetchedProducts);

        // 🔥 Batch Wishlist Check
        if (fetchedProducts.length > 0) {
          const productIds = fetchedProducts.map((p: any) => p._id);
          const statusRes = await wishlistAPI.checkBatchStatus(productIds);

          if (statusRes.success) {
            setWishlistStatus(statusRes.statusMap);
          }
        }
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    if (searchType === "vin") {
      if (searchQuery.length !== 17) {
        toast.error("VIN must be exactly 17 characters");
        return;
      }

      const toastId = toast.loading("Decoding VIN...");
      try {
        const { data } = await apiClient.post("users/garage/decode-vin", {
          vin: searchQuery,
        });

        if (data.success) {
          const vehicle = data.data;
          setSelectedVehicle(vehicle);
          toast.success(`Found: ${vehicle.brand} ${vehicle.model}`, {
            id: toastId,
          });
          router.push("/products");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "VIN not found", {
          id: toastId,
        });
      }
    } else {
      document
        .getElementById("products-grid")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

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
        {/* ================= HERO SECTION ================= */}
        <section
          ref={heroRef}
          className="relative w-full h-[100dvh] flex flex-col items-center justify-end pb-20 overflow-hidden"
        >
          {/* Video Layer */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              // 🔥 OPTIONAL: Add a poster image here for even better LCP
              // poster="/images/hero-poster.jpg"
              className="w-full h-full object-cover object-center scale-100 md:scale-110 transition-transform duration-1000"
            >
              <source src="/videos/video.mp4" type="video/mp4" />
            </video>
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

        {/* ================= BRAND MARQUEE ================= */}
        {/* =========================================
            ✨ 2. BRAND MARQUEE (MOBILE OPTIMIZED)
           ========================================= */}
        <div className="py-6 md:py-10 bg-white/80 dark:bg-[#050510]/50 backdrop-blur-md border-y border-gray-100 dark:border-white/5 relative overflow-hidden">
          {/* 🔥 Fade Effect Overlays (Adjusted for Mobile) */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white dark:from-[#030014] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white dark:from-[#030014] to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="flex animate-marquee whitespace-nowrap items-center group hover:[animation-play-state:paused]">
            {[
              ...COMPATIBLE_MODELS,
              ...COMPATIBLE_MODELS,
              ...COMPATIBLE_MODELS,
              ...COMPATIBLE_MODELS,
            ].map((model, i) => (
              <div
                key={i}
                className="flex items-center gap-6 md:gap-12 mx-3 md:mx-6"
              >
                {/* Text Design (Mobile: text-3xl, Desktop: text-7xl) */}
                <span
                  className="text-3xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-300 to-slate-500 dark:from-white dark:to-white/20 hover:to-blue-500 dark:hover:to-cyan-400 transition-all duration-300 cursor-default select-none drop-shadow-sm"
                  style={{
                    WebkitTextStroke: "1px rgba(100,100,100,0.1)", // Subtle outline
                  }}
                >
                  {model}
                </span>

                {/* Separator Icon (Responsive Size) */}
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-blue-500/30 dark:text-cyan-500/30 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* ================= DYNAMIC SECTIONS ================= */}
        <section className="container mx-auto px-4 mt-12 mb-8">
          <FestivalCarousel />
        </section>

        <GarageSection />

        {/* ================= CATEGORIES ================= */}
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

        {/* ================= SEARCH & PRODUCTS ================= */}
        <section
          id="search-section"
          className="container mx-auto px-4 py-8 md:py-16"
        >
          {/* --- Sticky Search Header --- */}
          <div className="sticky top-20 z-40 mb-12 max-w-5xl mx-auto">
            <div className="relative group">
              {/* Glow Effect behind the search bar */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>

              <div className="relative bg-white/80 dark:bg-[#0f111a]/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-2 md:p-2.5 rounded-[1.8rem] shadow-2xl shadow-blue-900/5 dark:shadow-black/50 flex flex-col md:flex-row gap-2 transition-all">
                {/* --- Filter Tabs (Pill Style) --- */}
                <div className="flex p-1 bg-gray-100/80 dark:bg-white/5 rounded-2xl w-full md:w-auto shrink-0 overflow-x-auto no-scrollbar">
                  {[
                    { id: "keyword", label: "Keyword" },
                    { id: "partNo", label: "Part No" },
                    { id: "vin", label: "VIN" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSearchType(t.id as any)}
                      className={`relative flex-1 md:flex-none px-6 py-3 md:py-2.5 rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        searchType === t.id
                          ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20"
                          : "text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* --- Search Input Area --- */}
                <div className="relative flex-1 group/input bg-gray-50 dark:bg-black/20 md:bg-transparent md:dark:bg-transparent rounded-2xl md:rounded-none transition-colors">
                  <button
                    onClick={handleSearch}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-600 dark:group-focus-within/input:text-blue-400 hover:scale-110 transition-all duration-300 z-10"
                  >
                    <Search size={22} strokeWidth={2.5} />
                  </button>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        searchType === "vin"
                          ? e.target.value.toUpperCase()
                          : e.target.value,
                      )
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder={
                      searchType === "vin"
                        ? "Enter 17-digit VIN Number..."
                        : "Search for parts, categories..."
                    }
                    maxLength={searchType === "vin" ? 17 : 50}
                    className="w-full h-12 md:h-full bg-transparent border-2 border-transparent focus:border-blue-100 dark:focus:border-blue-500/20 text-slate-900 dark:text-white pl-12 pr-10 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium text-sm rounded-2xl md:rounded-xl focus:bg-white dark:focus:bg-white/5 transition-all duration-300"
                  />

                  {/* Clear Button */}
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors"
                      >
                        <X size={16} strokeWidth={3} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* --- Results Grid --- */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {productsLoading ? (
                [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      type: "spring",
                      bounce: 0.3,
                    }}
                  >
                    <ProductCard
                      product={product as any}
                      onAddToCart={handleAddToCart}
                      index={index}
                      initialWishlistState={
                        wishlistStatus[product._id] || false
                      }
                    />
                  </motion.div>
                ))
              ) : (
                // --- Empty State UI ---
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 lg:py-32 flex flex-col items-center justify-center text-center"
                >
                  <div className="relative w-32 h-32 mb-6">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
                    <div className="relative w-full h-full bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-white/5 dark:to-white/5 rounded-full flex items-center justify-center border border-blue-100 dark:border-white/10 shadow-inner">
                      <Search
                        size={48}
                        className="text-blue-300 dark:text-gray-600"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400 mb-2">
                    No matches found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                    We couldn't find any parts matching "{searchQuery}". Try
                    adjusting your keywords or filters.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-6 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-white hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md"
                  >
                    Clear Search
                  </button>
                </motion.div>
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

// 🔥 FIX: ADDED forwardRef TO SKELETON
const ProductSkeleton = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="bg-white dark:bg-[#0f0f16] rounded-[1.5rem] p-5 border border-gray-200 dark:border-white/5 h-[400px] flex flex-col gap-4 relative overflow-hidden shadow-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <div className="w-full h-48 bg-gray-100 dark:bg-white/5 rounded-2xl" />
      <div className="flex-1 space-y-3 pt-2">
        <div className="w-3/4 h-4 bg-gray-100 dark:bg-white/5 rounded-full" />
        <div className="w-1/2 h-3 bg-gray-100 dark:bg-white/5 rounded-full" />
      </div>
      <div className="w-full h-12 bg-gray-100 dark:bg-white/5 rounded-xl" />
    </div>
  );
});
ProductSkeleton.displayName = "ProductSkeleton";

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
