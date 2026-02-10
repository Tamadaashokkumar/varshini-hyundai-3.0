// import { create } from "zustand";

// // 1. Image Interface (Updated to match API)
// export interface ProductImage {
//   _id: string; // API sends _id
//   url: string;
//   publicId: string;
// }

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   role: "customer" | "admin";
//   addresses?: Address[];
// }

// export interface Address {
//   _id: string;
//   addressType: string;
//   street: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// }

// // 2. Product Interface (Updated to match API & Fix Errors)
// export interface Product {
//   _id: string;
//   name: string;
//   partNumber?: string;
//   description?: string;
//   category: string;
//   // API sends objects, but if you just need names, handled in component
//   compatibleModels?: any[];

//   price: number;
//   discountPrice?: number;
//   finalPrice?: number; // Added: Needed for Price Logic

//   stock: number;
//   stockStatus?: string; // Added: API sends "In Stock"

//   // Optional helper to keep TS happy if you use 'status' manually anywhere
//   status?: "In Stock" | "Low Stock" | "Out of Stock" | string;

//   images: ProductImage[]; // Updated: Now includes _id

//   specifications?: Record<string, any>;
//   warrantyPeriod?: string;
//   tags?: string[];
//   isFeatured?: boolean;
// }

// export interface CartItem {
//   _id: string;
//   product: Product;
//   quantity: number;
//   price: number;
//   subtotal: number;
// }

// export interface Cart {
//   _id: string;
//   items: CartItem[];
//   totalItems: number;
//   subtotal: number;
//   tax: number;
//   taxPercentage: number;
//   shippingCharges: number;
//   totalAmount: number;
// }

// interface AppState {
//   // User state
//   user: User | null;
//   isAuthenticated: boolean;
//   setUser: (user: User | null) => void;
//   logout: () => void;

//   // Cart state
//   cart: Cart | null;
//   setCart: (cart: Cart | null) => void;
//   cartItemCount: number;
//   updateCartItemCount: () => void;

//   // UI state
//   theme: "dark" | "light";
//   toggleTheme: () => void;
//   isCartDrawerOpen: boolean;
//   toggleCartDrawer: () => void;
//   isMobileMenuOpen: boolean;
//   toggleMobileMenu: () => void;

//   // Loading states
//   isLoading: boolean;
//   setLoading: (loading: boolean) => void;
// }

// interface Vehicle {
//   _id?: string;
//   model: string;
//   year: string; // or number
//   fuelType?: string;
//   variant?: string;
// }

// interface GarageState {
//   selectedVehicle: Vehicle | null; // ప్రస్తుతం ఆక్టివ్ గా ఉన్న కారు
//   savedVehicles: Vehicle[];        // మొత్తం సేవ్ చేసిన కార్ల లిస్ట్

//   // Actions
//   setSelectedVehicle: (vehicle: Vehicle | null) => void;
//   setSavedVehicles: (vehicles: Vehicle[]) => void;
//   addVehicleLocal: (vehicle: Vehicle) => void; // For Guest Users
//   removeVehicleLocal: (model: string) => void;
// }

// export const useStore = create<AppState>((set, get) => ({
//   // User state
//   user: null,
//   isAuthenticated: false,
//   setUser: (user) => set({ user, isAuthenticated: !!user }),
//   logout: () =>
//     set({ user: null, isAuthenticated: false, cart: null, cartItemCount: 0 }),

//   // Cart state
//   cart: null,
//   setCart: (cart) => {
//     set({ cart });
//     get().updateCartItemCount();
//   },
//   cartItemCount: 0,
//   updateCartItemCount: () => {
//     const cart = get().cart;
//     const count =
//       cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
//     set({ cartItemCount: count });
//   },

//   // UI state
//   theme: "dark",
//   toggleTheme: () =>
//     set((state) => ({
//       theme: state.theme === "dark" ? "light" : "dark",
//     })),
//   isCartDrawerOpen: false,
//   toggleCartDrawer: () =>
//     set((state) => ({
//       isCartDrawerOpen: !state.isCartDrawerOpen,
//     })),
//   isMobileMenuOpen: false,
//   toggleMobileMenu: () =>
//     set((state) => ({
//       isMobileMenuOpen: !state.isMobileMenuOpen,
//     })),

//   // Loading states
//   isLoading: false,
//   setLoading: (loading) => set({ isLoading: loading }),
// }));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // ✅ 1. Import Persist

// --- 1. Interfaces ---

export interface ProductImage {
  _id: string;
  url: string;
  publicId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  addresses?: Address[];
}

export interface Address {
  _id: string;
  addressType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Product {
  _id: string;
  name: string;
  partNumber?: string;
  description?: string;
  category: string;
  compatibleModels?: any[];
  price: number;
  discountPrice?: number;
  finalPrice?: number;
  stock: number;
  stockStatus?: string;
  status?: "In Stock" | "Low Stock" | "Out of Stock" | string;
  images: ProductImage[];
  specifications?: Record<string, any>;
  warrantyPeriod?: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  taxPercentage: number;
  shippingCharges: number;
  totalAmount: number;
}

// ✅ Garage Interfaces
export interface Vehicle {
  _id?: string;
  model: string;
  year: string; // Changed to string to match dropdowns usually, or keep number if strict
  fuelType?: string;
  variant?: string;
}

// ✅ Main State Interface (Merged everything)
interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Cart State
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  cartItemCount: number;
  updateCartItemCount: () => void;

  // UI State
  theme: "dark" | "light";
  toggleTheme: () => void;
  isCartDrawerOpen: boolean;
  toggleCartDrawer: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;

  // Loading State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // 🔥 Garage State (Added Here)
  selectedVehicle: Vehicle | null;
  savedVehicles: Vehicle[];
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setSavedVehicles: (vehicles: Vehicle[]) => void;
  addVehicleLocal: (vehicle: Vehicle) => void;
  removeVehicleLocal: (model: string) => void;
}

// --- 2. Store Implementation ---

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ------------------------------------
      // User Logic
      // ------------------------------------
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          cart: null,
          cartItemCount: 0,
          selectedVehicle: null, // Logout అయినప్పుడు కారు కూడా క్లియర్ అవ్వాలి
          savedVehicles: [],
        }),

      // ------------------------------------
      // Cart Logic
      // ------------------------------------
      cart: null,
      setCart: (cart) => {
        set({ cart });
        get().updateCartItemCount();
      },
      cartItemCount: 0,
      updateCartItemCount: () => {
        const cart = get().cart;
        const count =
          cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
        set({ cartItemCount: count });
      },

      // ------------------------------------
      // UI Logic
      // ------------------------------------
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
      isCartDrawerOpen: false,
      toggleCartDrawer: () =>
        set((state) => ({
          isCartDrawerOpen: !state.isCartDrawerOpen,
        })),
      isMobileMenuOpen: false,
      toggleMobileMenu: () =>
        set((state) => ({
          isMobileMenuOpen: !state.isMobileMenuOpen,
        })),

      // ------------------------------------
      // Loading Logic
      // ------------------------------------
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // ------------------------------------
      // 🔥 Garage Logic (Implementation)
      // ------------------------------------
      selectedVehicle: null,
      savedVehicles: [],

      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

      setSavedVehicles: (vehicles) => set({ savedVehicles: vehicles }),

      // For Guest Users: Add to Local State
      addVehicleLocal: (vehicle) => {
        const current = get().savedVehicles;
        // Check Duplicate
        const exists = current.find(
          (v) => v.model === vehicle.model && v.year === vehicle.year,
        );

        if (!exists) {
          set({
            savedVehicles: [...current, vehicle],
            selectedVehicle: vehicle, // కొత్తది యాడ్ చేయగానే సెలెక్ట్ అవుతుంది
          });
        }
      },

      // For Guest Users: Remove from Local State
      removeVehicleLocal: (model) => {
        const current = get().savedVehicles;
        const updated = current.filter((v) => v.model !== model);

        set({
          savedVehicles: updated,
          // డిలీట్ చేసిన కారు ప్రస్తుతం సెలెక్ట్ అయ్యి ఉంటే, డీసెలెక్ట్ చేయాలి
          selectedVehicle:
            get().selectedVehicle?.model === model
              ? null
              : get().selectedVehicle,
        });
      },
    }),
    {
      name: "hyundai-app-storage", // ✅ LocalStorage Key Name
      // ✅ Partialize: మనకు ఏ స్టేట్ సేవ్ అవ్వాలి, ఏది వద్దు అని డిసైడ్ చేయడం
      // ఉదాహరణకు: Drawer open status సేవ్ అవ్వకూడదు.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        cart: state.cart,
        cartItemCount: state.cartItemCount,
        selectedVehicle: state.selectedVehicle, // Garage Persist
        savedVehicles: state.savedVehicles, // Garage Persist
      }),
    },
  ),
);
