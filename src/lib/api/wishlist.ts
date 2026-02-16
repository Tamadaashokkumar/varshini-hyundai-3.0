// src/lib/api/wishlist.ts

import apiClient from "@/services/apiClient";

// 1. Product Structure
export interface WishlistProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  finalPrice: number;
  images: {
    url: string;
    publicId: string;
    _id: string;
  }[];
}

// 2. Wishlist Item Structure
export interface WishlistItem {
  _id: string; // Wishlist Entry ID
  product: WishlistProduct; // Embedded Product Details
  addedAt: string;
}

// --- BACKEND RESPONSE TYPES ---

export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
  action: "added" | "removed";
  wishlist: any;
}

export interface CheckWishlistResponse {
  inWishlist: boolean;
}

// 🔥 NEW: Batch Response Type
export interface CheckBatchStatusResponse {
  success: boolean;
  statusMap: Record<string, boolean>; // Ex: { "prodId1": true, "prodId2": false }
}

export interface GetWishlistResponse {
  success: boolean;
  products: WishlistItem[];
  count: number;
}

export const wishlistAPI = {
  // 1. Toggle (Add/Remove)
  toggleWishlist: async (
    productId: string,
  ): Promise<ToggleWishlistResponse> => {
    const { data } = await apiClient.post("/wishlist/toggle", { productId });
    return data;
  },

  // 2. Check Status (Single - Legacy)
  checkWishlist: async (productId: string): Promise<CheckWishlistResponse> => {
    const { data } = await apiClient.get(`/wishlist/check/${productId}`);
    return data;
  },

  // 🔥 3. NEW: Check Status (Batch - Performance Optimized)
  // Accepts array of IDs and returns status for all at once
  checkBatchStatus: async (
    productIds: string[],
  ): Promise<CheckBatchStatusResponse> => {
    try {
      const { data } = await apiClient.post("/wishlist/check-status-batch", {
        productIds,
      });
      return data;
    } catch (error) {
      console.error("Batch wishlist check failed", error);
      // Return safe fallback to prevent page crash
      return { success: false, statusMap: {} };
    }
  },

  // 4. Get All Items
  getWishlist: async (): Promise<GetWishlistResponse> => {
    const { data } = await apiClient.get("/wishlist");
    return data;
  },

  // 5. Clear All
  clearWishlist: async (): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete("/wishlist/clear");
    return data;
  },
};
