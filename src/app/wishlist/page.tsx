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
  Package,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { wishlistAPI, WishlistItem } from "@/lib/api/wishlist";
import apiClient from "@/services/apiClient";
import { useStore } from "@/store/useStore";

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
      console.error("Failed to fetch wishlist", error);
      // Don't show toast on 404/Empty, just show empty state
    } finally {
      setLoading(false);
    }
  };

  // Helper for Images
  const getImageUrl = (img: any) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.url || "";
  };

  // 🗑️ Handle Remove Single Item
  const handleRemove = async (productId: string) => {
    const previousItems = [...wishlistItems];
    // Optimistic Update
    setWishlistItems((items) =>
      items.filter((item) => item.product._id !== productId),
    );
    toast.success("Removed from wishlist");

    try {
      await wishlistAPI.toggleWishlist(productId);
    } catch (error) {
      setWishlistItems(previousItems); // Revert
      toast.error("Failed to remove item");
    }
  };

  // 🧹 Handle Clear Entire Wishlist
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear your wishlist?"))
      return;

    try {
      setLoading(true);
      const response = await wishlistAPI.clearWishlist();
      if (response.success) {
        setWishlistItems([]);
        toast.success("Wishlist cleared successfully");
      }
    } catch (error) {
      toast.error("Failed to clear wishlist");
    } finally {
      setLoading(false);
    }
  };

  // 🛒 Move to Cart
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
        toast.success(`${item.product.name} moved to cart!`);
        handleRemove(item.product._id); // Remove from wishlist
        toggleCartDrawer();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add to cart");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hyundai-blue to-blue-500 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex gap-4">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} /> Clear All
              </button>
              <Link
                href="/"
                className="mt-4 md:mt-0 text-sm font-medium text-hyundai-blue hover:underline flex items-center gap-1"
              >
                Continue Shopping <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((item) => {
                const { product } = item;
                const images = product.images || [];
                const firstImage =
                  Array.isArray(images) && images.length > 0 ? images[0] : null;
                const price = product.price || 0;
                const currentPrice = product.finalPrice || price; // API returns 'finalPrice'
                const isDiscounted = currentPrice < price; // Check if price is reduced
                const isOutOfStock = product.stock <= 0;

                return (
                  <motion.div
                    layout
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 flex flex-col"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="absolute top-3 right-3 z-20 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* Image Area */}
                    <Link
                      href={`/products/${product._id}`}
                      className="relative aspect-square bg-gray-100 dark:bg-black/20 overflow-hidden"
                    >
                      {firstImage ? (
                        <Image
                          src={getImageUrl(firstImage)}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Package size={40} />
                        </div>
                      )}

                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle size={12} /> Out of Stock
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="mb-2">
                        <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>

                      <Link href={`/products/${product._id}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-hyundai-blue transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-auto pt-2 flex items-end justify-between mb-4">
                        <div className="flex flex-col">
                          {isDiscounted ? (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{price.toLocaleString()}
                              </span>
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                ₹{currentPrice.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ₹{price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={isOutOfStock || actionLoading === product._id}
                        className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-md
                          ${
                            isOutOfStock
                              ? "bg-gray-100 dark:bg-white/10 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-hyundai-blue to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                          }`}
                      >
                        {actionLoading === product._id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart size={16} />
                            {isOutOfStock ? "No Stock" : "Add to Cart"}
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

// 📦 Empty State Component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
        <HeartOff size={40} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Your wishlist is empty
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        Looks like you haven't saved any items yet.
      </p>
      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-hyundai-blue to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20"
        >
          Start Shopping
        </motion.button>
      </Link>
    </motion.div>
  );
}

// 💀 Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-gray-200 dark:bg-white/5 rounded-lg mb-2 animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-white/5 rounded-lg mb-10 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/5 h-[350px]"
            >
              <div className="w-full h-48 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse mb-4" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/5 rounded mb-2 animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/5 rounded mb-4 animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
