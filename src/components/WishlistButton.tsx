// src/components/WishlistButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { wishlistAPI } from "@/lib/api/wishlist";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  showText?: boolean;
  initialState?: boolean; // 🔥 NEW: Receive status from parent
}

export default function WishlistButton({
  productId,
  className = "",
  showText = false,
  initialState = false, // 🔥 Default to false
}: WishlistButtonProps) {
  const router = useRouter();
  const { user } = useAuth(); // Check auth

  // Initialize state with prop
  const [isInWishlist, setIsInWishlist] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 CRITICAL: Sync local state when parent (Home/ProductCard) updates the prop
  // This happens when the batch API call finishes in the parent component
  useEffect(() => {
    setIsInWishlist(!!initialState);
  }, [initialState]);

  // ❌ REMOVED: The old useEffect that called 'checkWishlist' individually.
  // This prevents the 429 Too Many Requests error.

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to use wishlist");
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }

    setIsLoading(true);

    // Optimistic UI Update
    const previousState = isInWishlist;
    setIsInWishlist(!previousState);

    try {
      const response = await wishlistAPI.toggleWishlist(productId);

      if (response.success) {
        setIsInWishlist(response.action === "added");
        toast.success(response.message, {
          icon: response.action === "added" ? "❤️" : "💔",
          duration: 2000,
        });
      }
    } catch (error: any) {
      // Revert if error
      setIsInWishlist(previousState);
      const msg = error.response?.data?.message || "Failed to update wishlist";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`group flex items-center gap-2 transition-all active:scale-95 ${className}`}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <div
        className={`p-2 rounded-full transition-colors ${
          isInWishlist
            ? "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400"
            : "bg-white dark:bg-black/40 text-gray-400 hover:text-red-500 dark:text-white dark:hover:text-red-400 hover:bg-gray-50"
        }`}
      >
        <Heart
          className={`h-6 w-6 transition-all duration-300 ${
            isInWishlist ? "fill-current scale-110" : "group-hover:scale-110"
          }`}
        />
      </div>

      {showText && (
        <span
          className={`text-sm font-medium transition-colors ${
            isInWishlist
              ? "text-red-500"
              : "text-gray-600 dark:text-gray-300 group-hover:text-red-500"
          }`}
        >
          {isInWishlist ? "Saved" : "Add to Wishlist"}
        </span>
      )}
    </button>
  );
}
