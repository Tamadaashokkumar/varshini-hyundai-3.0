// // src/lib/api/wishlist.ts
// import apiClient from "@/services/apiClient";

// // Backend Response Types based on your documentation
// export interface ToggleWishlistResponse {
//   success: boolean;
//   message: string;
//   action: "added" | "removed";
//   wishlist: any;
// }

// export interface CheckWishlistResponse {
//   inWishlist: boolean;
// }

// export interface GetWishlistResponse {
//   success: boolean;
//   products: {
//     product: any;
//     addedAt: string;
//   }[];
//   count: number;
// }

// export const wishlistAPI = {
//   // 1. Toggle (Add/Remove)
//   toggleWishlist: async (
//     productId: string,
//   ): Promise<ToggleWishlistResponse> => {
//     const { data } = await apiClient.post("/wishlist/toggle", { productId });
//     return data;
//   },

//   // 2. Check Status
//   checkWishlist: async (productId: string): Promise<CheckWishlistResponse> => {
//     const { data } = await apiClient.get(`/wishlist/check/${productId}`);
//     return data;
//   },

//   // 3. Get All Items
//   getWishlist: async (): Promise<GetWishlistResponse> => {
//     const { data } = await apiClient.get("/wishlist");
//     return data;
//   },

//   // 4. Clear All
//   clearWishlist: async (): Promise<{ success: boolean; message: string }> => {
//     const { data } = await apiClient.delete("/wishlist/clear");
//     return data;
//   },
// };

import apiClient from "@/services/apiClient";

// 1. Product Structure (Based on your JSON)
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

// 2. Wishlist Item Structure (Exported for use in components)
export interface WishlistItem {
  _id: string; // Wishlist Entry ID (Ex: "695f4b09...")
  product: WishlistProduct; // Embedded Product Details
  addedAt: string;
}

// Backend Response Types
export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
  action: "added" | "removed";
  wishlist: any;
}

export interface CheckWishlistResponse {
  inWishlist: boolean;
}

export interface GetWishlistResponse {
  success: boolean;
  products: WishlistItem[]; // Strongly typed array
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

  // 2. Check Status
  checkWishlist: async (productId: string): Promise<CheckWishlistResponse> => {
    const { data } = await apiClient.get(`/wishlist/check/${productId}`);
    return data;
  },

  // 3. Get All Items
  getWishlist: async (): Promise<GetWishlistResponse> => {
    const { data } = await apiClient.get("/wishlist");
    return data;
  },

  // 4. Clear All
  clearWishlist: async (): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete("/wishlist/clear");
    return data;
  },
};
