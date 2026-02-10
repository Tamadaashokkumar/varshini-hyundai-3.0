"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  ShoppingCart,
  Star,
  ArrowRight,
  Package,
  Car,
  CheckCircle2,
  AlertCircle,
  Settings,
  Loader2,
  Disc, // For Style 3
  Zap, // For Style 3
} from "lucide-react";
import apiClient from "@/services/apiClient";

// --- Types & Constants (Same as before) ---
interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  finalPrice?: number;
  images: { url: string }[];
  category: string;
  stock: number;
  stockStatus?: string;
  averageRating?: number;
  totalReviews?: number;
  compatibleModels?: { modelName: string; yearFrom: number; yearTo?: number }[];
  flashSale?: { isActive: boolean; startTime: string; endTime: string };
}
interface GarageCar {
  model: string;
  year: number;
}
const CATEGORIES = [
  "Engine",
  "Brake",
  "Electrical",
  "Body",
  "Suspension",
  "Accessories",
];
const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];
const checkCompatibility = (product: Product, userCar: GarageCar | null) => {
  if (
    !userCar ||
    !product.compatibleModels ||
    product.compatibleModels.length === 0
  )
    return null;
  return product.compatibleModels.some((item) => {
    const modelMatch = item.modelName
      .toLowerCase()
      .includes(userCar.model.toLowerCase());
    const endYear = item.yearTo || new Date().getFullYear();
    return (
      modelMatch && userCar.year >= item.yearFrom && userCar.year <= endYear
    );
  });
};

// ==========================================
// 🔥 LOADERS SHOWCASE COMPONENTS
// ==========================================

// STYLE 1: The Cinematic Speedometer (High Tech)
const LoaderStyle1 = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] text-white overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b] pointer-events-none"></div>
    <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
      <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[60px] animate-pulse"></div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-dashed border-gray-700/50 rounded-full opacity-50"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-8 border border-gray-800 rounded-full border-t-cyan-500/30 border-r-transparent border-b-cyan-500/30 border-l-transparent"
      />
      <svg className="absolute inset-0 w-full h-full rotate-[-90deg] p-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        <circle
          cx="50%"
          cy="50%"
          r="42%"
          fill="transparent"
          stroke="#1e293b"
          strokeWidth="2"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="42%"
          fill="transparent"
          stroke="#06b6d4"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="660"
          initial={{ strokeDashoffset: 660 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.5,
          }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            filter: [
              "drop-shadow(0 0 0px rgba(6,182,212,0))",
              "drop-shadow(0 0 20px rgba(6,182,212,0.5))",
              "drop-shadow(0 0 0px rgba(6,182,212,0))",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-[#0f111a] p-5 rounded-full border border-gray-800 shadow-2xl"
        >
          <Car size={48} className="text-cyan-400" strokeWidth={1.5} />
        </motion.div>
      </div>
    </div>
    <div className="mt-8 text-center z-10 space-y-3">
      <h2 className="text-xl font-black tracking-[0.3em] text-white uppercase">
        Hyundai<span className="text-cyan-500">Spares</span>
      </h2>
      <div className="flex items-center gap-2 justify-center text-xs font-mono text-gray-500 uppercase tracking-widest">
        <Loader2 size={12} className="animate-spin text-cyan-500" />
        <span>Loading System...</span>
      </div>
    </div>
  </div>
);

// STYLE 2: The Minimalist Pulse (Clean & Corporate)
const LoaderStyle2 = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-white">
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="mb-8 relative"
    >
      <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
      <Car
        size={64}
        className="text-blue-600 dark:text-blue-500 relative z-10"
      />
    </motion.div>
    <div className="w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-full h-full bg-blue-600"
      />
    </div>
    <p className="mt-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
      Please Wait
    </p>
  </div>
);

// STYLE 3: The Spinning Wheel (Automotive & Raw)
const LoaderStyle3 = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-900 text-white">
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="text-gray-400"
      >
        <Disc size={100} strokeWidth={1} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Zap size={32} fill="currentColor" />
      </motion.div>
    </div>
    <h2 className="mt-6 text-2xl font-black italic text-white uppercase tracking-tighter">
      FAST<span className="text-yellow-500">LANE</span>
    </h2>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 🛠️ DEV TOOLS STATE (Delete after selection) ---
  const [selectedLoader, setSelectedLoader] = useState<1 | 2 | 3>(1);

  // ... (Existing State variables)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("newest");
  const [userGarage, setUserGarage] = useState<GarageCar | null>(null);
  const [garageForm, setGarageForm] = useState({
    model: "Creta",
    year: "2020",
  });
  const [showGarageOnly, setShowGarageOnly] = useState(false);

  useEffect(() => {
    const savedGarage = localStorage.getItem("myGarage");
    if (savedGarage) setUserGarage(JSON.parse(savedGarage));
  }, []);

  const saveToGarage = () => {
    if (!garageForm.model || !garageForm.year) return;
    const car = { model: garageForm.model, year: parseInt(garageForm.year) };
    localStorage.setItem("myGarage", JSON.stringify(car));
    setUserGarage(car);
  };
  const clearGarage = () => {
    localStorage.removeItem("myGarage");
    setUserGarage(null);
  };

  const fetchProducts = useCallback(async () => {
    // Keep loading true to show the loader for preview purposes
    // In real app, you'd set this based on API
    setLoading(true);
    try {
      // API Logic here...
      const params = new URLSearchParams();
      // ... params logic
      const response = await apiClient.get(`/products?${params.toString()}`);
      if (response.data.success)
        setProducts(response.data.data.products || response.data.data);
    } catch (error) {
      console.error("Error");
    } finally {
      // Commenting out setLoading(false) so you can see the loader constantly.
      // Use the toggle button in top right to hide it.
      // setLoading(false);
    }
  }, [
    search,
    selectedCategory,
    priceRange,
    sortBy,
    userGarage,
    showGarageOnly,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Logic to toggle loading OFF for preview
  const toggleLoading = () => setLoading(!loading);

  const filteredProducts = products.filter((product) => {
    if (showGarageOnly && userGarage)
      return checkCompatibility(product, userGarage);
    return true;
  });

  return (
    <div className="pt-28 pb-10 px-4 md:px-8 lg:p-24 min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#050505] dark:to-[#1a1a2e] text-gray-900 dark:text-white transition-colors duration-300 font-sans relative">
      {/* ======================================================= */}
      {/* 🛠️ DEV TOOLS PANEL (DELETE THIS AFTER SELECTING)       */}
      {/* ======================================================= */}
      <div className="fixed top-24 right-4 z-[9999] bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-2xl border border-red-500">
        <p className="text-xs font-bold text-red-500 mb-2 uppercase">
          Developer Tools
        </p>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setSelectedLoader(1)}
            className={`px-3 py-1 text-xs rounded ${selectedLoader === 1 ? "bg-cyan-600 text-white" : "bg-gray-200 text-black"}`}
          >
            Style 1
          </button>
          <button
            onClick={() => setSelectedLoader(2)}
            className={`px-3 py-1 text-xs rounded ${selectedLoader === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
          >
            Style 2
          </button>
          <button
            onClick={() => setSelectedLoader(3)}
            className={`px-3 py-1 text-xs rounded ${selectedLoader === 3 ? "bg-yellow-600 text-white" : "bg-gray-200 text-black"}`}
          >
            Style 3
          </button>
        </div>
        <button
          onClick={toggleLoading}
          className="w-full py-1 bg-green-600 text-white text-xs rounded font-bold"
        >
          {loading ? "Hide Loader" : "Show Loader"}
        </button>
      </div>
      {/* ======================================================= */}

      {/* ================= LOADER RENDERING LOGIC ================= */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100]"
          >
            {/* RENDER SELECTED LOADER */}
            {selectedLoader === 1 && <LoaderStyle1 />}
            {selectedLoader === 2 && <LoaderStyle2 />}
            {selectedLoader === 3 && <LoaderStyle3 />}
          </motion.div>
        )}
      </AnimatePresence>
      {/* ================= END LOADER ================= */}

      {/* ... (REST OF YOUR PAGE CONTENT - HEADER, FILTERS, GRID) ... */}
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/20 rounded-full blur-[100px] md:blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-500/20 rounded-full blur-[100px] md:blur-[150px]"></div>
      </div>

      {/* HEADER */}
      <div className="relative z-20 fixed top-0 left-0 right-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                Explore Spares
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mt-1 font-medium">
                Genuine parts for your Hyundai machine.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 md:py-3 border border-white/20 dark:border-white/10 rounded-xl leading-5 bg-white/40 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white/60 dark:focus:bg-white/10 focus:border-cyan-500/50 sm:text-sm transition-all shadow-inner"
                  placeholder="Search by part name..."
                />
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 md:py-3 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-sm font-medium shadow-sm hover:bg-white/50 dark:hover:bg-white/20 transition-all"
              >
                <Filter size={18} />{" "}
                <span className="sm:hidden md:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-8 py-4 md:py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR (Shortened for brevity as requested, logic remains) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-32 h-fit p-6 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl">
            {/* Garage Widget */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Car size={18} className="text-cyan-600 dark:text-cyan-400" />{" "}
                My Garage
              </h3>
              {userGarage ? (
                <div className="bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-4">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {userGarage.model}
                  </p>
                  <button
                    onClick={clearGarage}
                    className="text-red-500 text-xs mt-2"
                  >
                    Change Car
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Model"
                    className="w-full p-2 rounded text-sm bg-white/50 dark:bg-black/40"
                    value={garageForm.model}
                    onChange={(e) =>
                      setGarageForm({ ...garageForm, model: e.target.value })
                    }
                  />
                  <button
                    onClick={saveToGarage}
                    className="w-full py-2 bg-cyan-600 text-white rounded text-sm"
                  >
                    Set Garage
                  </button>
                </div>
              )}
            </div>
            {/* Categories */}
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Categories
              </h3>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left p-2 rounded text-sm ${selectedCategory === cat ? "text-cyan-600 font-bold" : "text-gray-500"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            {/* Filters Bar & Grid Logic (Same as before) */}
            {products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    userGarage={userGarage}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Keeping ProductCard same as before for brevity, just ensure it's in the file.
function ProductCard({
  product,
  userGarage,
}: {
  product: Product;
  userGarage: GarageCar | null;
}) {
  const displayPrice =
    product.finalPrice || product.discountPrice || product.price;
  const fitmentStatus = userGarage
    ? checkCompatibility(product, userGarage)
    : null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <Link href={`/products/${product._id}`} className="block h-full">
        <div className="h-full bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-[1.5rem] overflow-hidden p-4 relative">
          <div className="relative aspect-square w-full mb-4">
            {product.images?.[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-contain"
              />
            ) : (
              <Package className="text-gray-500" />
            )}
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm">₹{displayPrice}</p>
          {userGarage && fitmentStatus !== null && (
            <div
              className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold ${fitmentStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {fitmentStatus ? "FITS" : "NO FIT"}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
