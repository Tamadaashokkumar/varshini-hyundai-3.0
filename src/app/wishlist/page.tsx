// src/app/wishlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  HeartOff,
  ArrowRight,
  PackageX,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { wishlistAPI, WishlistItem } from "@/lib/api/wishlist";
import apiClient from "@/services/apiClient";
import { useStore } from "@/store/useStore";

// --- ANIMATION VARIANTS (Professional Stagger Effect) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Items one by one
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { setCart, toggleCartDrawer } = useStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      if (response.success) {
        setWishlistItems(response.products);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (img: any) => {
    if (!img) return "/placeholder.png"; // Add a fallback placeholder path
    if (typeof img === "string") return img;
    return img.url || "";
  };

  const handleRemove = async (productId: string) => {
    const previousItems = [...wishlistItems];
    setWishlistItems((items) =>
      items.filter((item) => item.product._id !== productId),
    );
    toast.success("Item removed");

    try {
      await wishlistAPI.toggleWishlist(productId);
    } catch (error) {
      setWishlistItems(previousItems);
      toast.error("Could not remove item");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear your wishlist?")) return;
    try {
      setLoading(true);
      const response = await wishlistAPI.clearWishlist();
      if (response.success) {
        setWishlistItems([]);
        toast.success("Wishlist cleared");
      }
    } catch (error) {
      toast.error("Failed to clear");
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    if (item.product.stock <= 0) return;
    setActionLoading(item.product._id);
    try {
      const response = await apiClient.post("/cart/add", {
        productId: item.product._id,
        quantity: 1,
      });

      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success("Added to Cart");
        handleRemove(item.product._id);
        toggleCartDrawer();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error adding to cart");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              My Wishlist
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {wishlistItems.length} items saved for later
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} /> Clear All
              </button>
              <Link
                href="/"
                className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 dark:bg-white dark:text-black rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-gray-200 dark:shadow-none"
              >
                Continue Shopping <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </motion.div>

        {/* --- CONTENT GRID --- */}
        {wishlistItems.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {wishlistItems.map(({ product }) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock < 5;
                const price = product.price || 0;
                const currentPrice = product.finalPrice || price;
                const discount = Math.round(
                  ((price - currentPrice) / price) * 100,
                );

                return (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    layout
                    className="group relative bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-2xl dark:hover:border-blue-500/30 transition-all duration-300"
                  >
                    {/* Delete Button (Visible on Hover/Mobile) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(product._id);
                      }}
                      className="absolute top-3 right-3 z-20 p-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all opacity-100 lg:opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>

                    {/* Image Section */}
                    <Link
                      href={`/products/${product._id}`}
                      className="block relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-white/5"
                    >
                      <Image
                        src={getImageUrl(product.images?.[0])}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? "grayscale opacity-60" : ""}`}
                        unoptimized
                      />

                      {/* Tags/Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {discount > 0 && (
                          <span className="px-2.5 py-1 text-[10px] font-bold text-white bg-red-500 rounded-lg shadow-sm">
                            -{discount}% OFF
                          </span>
                        )}
                        {isLowStock && !isOutOfStock && (
                          <span className="px-2.5 py-1 text-[10px] font-bold text-orange-700 bg-orange-100 border border-orange-200 rounded-lg shadow-sm flex items-center gap-1">
                            <AlertCircle size={10} /> Low Stock
                          </span>
                        )}
                      </div>

                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                          <span className="px-4 py-2 bg-black/70 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 flex items-center gap-2">
                            <PackageX size={14} /> Out of Stock
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Info Section */}
                    <div className="p-5 flex flex-col gap-3">
                      <div>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                          {product.category || "Spare Part"}
                        </p>
                        <Link href={`/products/${product._id}`}>
                          <h3
                            className="font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title={product.name}
                          >
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{currentPrice.toLocaleString()}
                        </span>
                        {discount > 0 && (
                          <span className="text-sm text-gray-400 line-through decoration-gray-400/60">
                            ₹{price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() =>
                          handleMoveToCart({ product } as WishlistItem)
                        }
                        disabled={isOutOfStock || actionLoading === product._id}
                        className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                        ${
                          isOutOfStock
                            ? "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                        }`}
                      >
                        {actionLoading === product._id ? (
                          <LoaderIcon />
                        ) : isOutOfStock ? (
                          "Unavailable"
                        ) : (
                          <>
                            <ShoppingBag size={18} /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 📦 Professional Empty State
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <HeartOff
            className="w-12 h-12 text-blue-500 dark:text-blue-400"
            strokeWidth={1.5}
          />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Your Wishlist is Empty
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center mb-8 leading-relaxed">
        Explore our collection of genuine Hyundai spares and save your favorites
        for later.
      </p>
      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold shadow-xl flex items-center gap-2"
        >
          Start Exploring <ArrowRight size={18} />
        </motion.button>
      </Link>
    </motion.div>
  );
}

// 💀 Modern Skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-gray-200 dark:bg-white/5 rounded-xl mb-3 animate-pulse" />
        <div className="h-5 w-32 bg-gray-200 dark:bg-white/5 rounded-lg mb-12 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-white/5 rounded-3xl p-4 border border-gray-100 dark:border-white/5 h-[400px]"
            >
              <div className="w-full h-48 bg-gray-200 dark:bg-white/5 rounded-2xl animate-pulse mb-5" />
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-white/5 rounded mb-3 animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-white/5 rounded mb-4 animate-pulse" />
              <div className="h-8 w-1/2 bg-gray-200 dark:bg-white/5 rounded mb-6 animate-pulse" />
              <div className="h-12 w-full bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LoaderIcon = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
