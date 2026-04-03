import { createContext } from "react";
import { User, Product } from "@/types";

/* === Auth Context === */
export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (values: any) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    register: (values: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* === Cart Context === */
export interface CartItem {
  product: Product;
  variantId?: string | number;
  weight?: string;
  packSize?: number;
  quantity: number;
}
export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string | number) => void;
  removeFromCart: (productId: string | number, variantId?: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number, variantId?: string | number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}
export const CartContext = createContext<CartContextType | undefined>(undefined);

/* === Wishlist Context === */
export interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string | number) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => void;
}
export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
