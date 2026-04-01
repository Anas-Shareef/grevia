import { createContext } from "react";
import { Product } from "@/data/products";

export interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string | number) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
