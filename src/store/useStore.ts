import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- 1. Interfaces ---

export interface ProductImage {
  _id: string;
  url: string;
  publicId: string;
}

export interface User {
  _id: string; // MongoDB uses _id
  id?: string;
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
  status?: string;
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

export interface Vehicle {
  _id?: string;
  model: string;
  year: string;
  fuelType?: string;
  variant?: string;
}

// ✅ Main State Interface
interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean; // 🔥 కొత్తది: లూప్ ఆపడానికి
  setUser: (user: User | null) => void;
  setAuthInitialized: (val: boolean) => void; // 🔥 కొత్తది
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

  // Garage State
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
      isAuthInitialized: false, // మొదట్లో false ఉంటుంది

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAuthInitialized: (val) => set({ isAuthInitialized: val }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isAuthInitialized: false, // లాగౌట్ అయ్యాక మళ్ళీ చెక్ చేయాలి కాబట్టి reset
          cart: null,
          cartItemCount: 0,
          selectedVehicle: null,
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
      // Garage Logic
      // ------------------------------------
      selectedVehicle: null,
      savedVehicles: [],

      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

      setSavedVehicles: (vehicles) => set({ savedVehicles: vehicles }),

      addVehicleLocal: (vehicle) => {
        const current = get().savedVehicles;
        const exists = current.find(
          (v) => v.model === vehicle.model && v.year === vehicle.year,
        );

        if (!exists) {
          set({
            savedVehicles: [...current, vehicle],
            selectedVehicle: vehicle,
          });
        }
      },

      removeVehicleLocal: (model) => {
        const current = get().savedVehicles;
        const updated = current.filter((v) => v.model !== model);

        set({
          savedVehicles: updated,
          selectedVehicle:
            get().selectedVehicle?.model === model
              ? null
              : get().selectedVehicle,
        });
      },
    }),
    {
      name: "hyundai-app-storage",
      // ✅ Partialize: అవసరమైనవి మాత్రమే LocalStorage లో స్టోర్ చేస్తాం
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        cart: state.cart,
        cartItemCount: state.cartItemCount,
        selectedVehicle: state.selectedVehicle,
        savedVehicles: state.savedVehicles,
        // 🔥 గమనిక: isAuthInitialized ఇక్కడ యాడ్ చేయలేదు.
        // ఎందుకంటే ప్రతి రీలోడ్ లో మళ్ళీ ఒకసారి సర్వర్ కి కాల్ వెళ్ళాలి.
      }),
    },
  ),
);
