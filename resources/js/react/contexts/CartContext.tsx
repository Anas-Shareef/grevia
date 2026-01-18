import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { api } from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'grevia_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage or server
  useEffect(() => {
    const loadCart = async () => {
      console.log('[CartContext] Loading cart, user:', user?.email || 'guest');

      if (user) {
        // Logged-in user: fetch from server
        try {
          const response = await api.get('/cart');
          const serverItems = response.items || [];

          // Convert server format to CartItem format
          const cartItems: CartItem[] = serverItems.map((item: any) => ({
            product: {
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
            } as Product,
            quantity: item.quantity,
          }));

          // Merge with localStorage cart (if any)
          const localCart = getLocalCart();
          const mergedCart = mergeCart(localCart, cartItems);

          setItems(mergedCart);

          // Sync merged cart back to server
          if (mergedCart.length > 0) {
            await syncToServer(mergedCart);
          }

          // Update localStorage
          saveToLocalStorage(mergedCart);
        } catch (error) {
          console.error('Failed to load cart from server:', error);
          // Fallback to localStorage
          setItems(getLocalCart());
        }
      } else {
        // Guest user: load from localStorage
        setItems(getLocalCart());
      }
      setIsInitialized(true);
    };

    loadCart();
  }, [user]);

  // Clear cart when user logs out - REMOVED as it clears guest cart on init
  // logic is handled by loadCart switching to local storage on logout
  // useEffect(() => {
  //   if (!user && isInitialized) {
  //     console.log('[CartContext] User logged out, clearing cart');
  //     setItems([]);
  //   }
  // }, [user, isInitialized]);

  // Helper: Get cart from localStorage
  const getLocalCart = (): CartItem[] => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Helper: Save to localStorage
  const saveToLocalStorage = (cart: CartItem[]) => {
    console.log('[CartContext] Saving to localStorage:', cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  };

  // Helper: Merge two carts (sum quantities if item exists in both)
  const mergeCart = (cart1: CartItem[], cart2: CartItem[]): CartItem[] => {
    const merged = new Map<string, CartItem>();

    [...cart1, ...cart2].forEach(item => {
      const existing = merged.get(item.product.id);
      if (existing) {
        // Sum quantities
        merged.set(item.product.id, {
          ...existing,
          quantity: existing.quantity + item.quantity
        });
      } else {
        merged.set(item.product.id, item);
      }
    });

    return Array.from(merged.values());
  };

  // Helper: Sync cart to server
  const syncToServer = async (cart: CartItem[]) => {
    if (!user) {
      console.log('[CartContext] Not syncing - no user');
      return;
    }

    try {
      const items = cart.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
      }));

      console.log('[CartContext] Syncing to server:', items);
      const response = await api.post('/cart/sync', { items });
      console.log('[CartContext] Sync successful!', response);
    } catch (error) {
      console.error('[CartContext] Sync failed:', error);
    }
  };

  // Update cart (both state and storage/server)
  const updateCart = useCallback(async (newItems: CartItem[]) => {
    console.log('[CartContext] updateCart called, user:', user?.email, 'items:', newItems.length);
    setItems(newItems);
    saveToLocalStorage(newItems);

    if (user) {
      await syncToServer(newItems);
    }
  }, [user]);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    const existingItem = items.find(item => item.product.id === product.id);

    let newItems: CartItem[];
    if (existingItem) {
      newItems = items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      toast.success(`Updated ${product.name} quantity to ${existingItem.quantity + quantity}`);
    } else {
      newItems = [...items, { product, quantity }];
    }

    await updateCart(newItems);
  }, [items, updateCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    const newItems = items.filter(item => item.product.id !== productId);
    await updateCart(newItems);
  }, [items, updateCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const newItems = items.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    await updateCart(newItems);
  }, [items, updateCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    await updateCart([]);

    if (user) {
      try {
        await api.delete('/cart/clear');
      } catch (error) {
        console.error('Failed to clear cart on server:', error);
      }
    }
  }, [user, updateCart]);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
