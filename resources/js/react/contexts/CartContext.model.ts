import { createContext } from "react";
import { Product } from "@/data/products";

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
