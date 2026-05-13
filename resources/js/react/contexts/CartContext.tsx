import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product } from "@/types";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { api } from "@/lib/api";

import { CartContext, CartItem, CartContextType } from "./Definitions";


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const GUEST_CART_KEY = 'grevia_cart_guest';
  const USER_CART_KEY  = 'grevia_cart_user';

  // Load cart from localStorage or server
  useEffect(() => {
    const loadCart = async () => {
      if (isInitialized && user) {
        // If we're already initialized and user changes (login), we might need to handle transition
        // But for now, let's focus on the initial load/refresh doubling.
      }

      console.log('[CartContext] Loading cart, user:', user?.email || 'guest');

      if (user) {
        // Logged-in user: fetch from server
        try {
          const response = await api.get('/cart');
          const serverItems = response.items || [];

          // Convert server format to CartItem format
          const cartItems: CartItem[] = serverItems.map((item: any) => ({
            product: {
              ...item,
              id: String(item.id),
              name: item.name,
              price: item.price,
              image: item.image,
              slug: item.slug
            } as Product,
            variantId: item.variant_id,
            weight: item.weight || null,
            packSize: item.weight || item.pack_size || null,
            quantity: Number(item.quantity),
            selectedAttributes: item.selected_attributes,
          }));

          // transition logic: check if there's a guest cart to merge
          const guestCartJson = localStorage.getItem(GUEST_CART_KEY);
          if (guestCartJson) {
            console.log('[CartContext] Found guest cart, merging into user account...');
            const guestItems: CartItem[] = JSON.parse(guestCartJson);
            const mergedCart = mergeCart(cartItems, guestItems);
            
            setItems(mergedCart);
            await syncToServer(mergedCart);
            localStorage.removeItem(GUEST_CART_KEY); // Done merging!
            saveToLocalStorage(mergedCart);
          } else {
            // Regular refresh for logged in user: TRUST THE SERVER
            setItems(cartItems);
            saveToLocalStorage(cartItems);
          }
        } catch (error) {
          console.error('Failed to load cart from server:', error);
          // Fallback to mirrored user cart
          setItems(getLocalCart());
        }
      } else {
        // Guest user: load from guest storage
        const localCart = getLocalCart();
        setItems(localCart);
      }
      setIsInitialized(true);
    };

    loadCart();
  }, [user]);

  // Helper: Get cart from localStorage (handles both user/guest keys)
  const getLocalCart = (): CartItem[] => {
    try {
      const key = user ? USER_CART_KEY : GUEST_CART_KEY;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Helper: Save to localStorage (handles both user/guest keys)
  const saveToLocalStorage = (cart: CartItem[]) => {
    const key = user ? USER_CART_KEY : GUEST_CART_KEY;
    localStorage.setItem(key, JSON.stringify(cart));
  };



  // Helper: Merge two carts (sum quantities if item exists in both)
  const mergeCart = (cart1: CartItem[], cart2: CartItem[]): CartItem[] => {
    const merged = new Map<string, CartItem>();

    [...cart1, ...cart2].forEach(item => {
      const variantKey = item.variantId ? `_${item.variantId}` : '';
      
      // Sort keys to ensure consistent JSON stringification
      const sortedAttrs = item.selectedAttributes 
        ? Object.keys(item.selectedAttributes).sort().reduce((acc: any, key) => {
            acc[key] = item.selectedAttributes![key];
            return acc;
          }, {})
        : {};
      
      const attrKey = Object.keys(sortedAttrs).length > 0 ? `_${JSON.stringify(sortedAttrs)}` : '';
      const key = `${item.product.id}${variantKey}${attrKey}`;

      const existing = merged.get(key);
      if (existing) {
        merged.set(key, {
          ...existing,
          quantity: Number(existing.quantity) + Number(item.quantity)
        });
      } else {
        merged.set(key, { ...item, quantity: Number(item.quantity) });
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
        variant_id: item.variantId,
        quantity: item.quantity,
        selected_attributes: item.selectedAttributes,
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
    setItems(newItems);
    saveToLocalStorage(newItems);

    if (user) {
      await syncToServer(newItems);
    }
  }, [user]);

  const addToCart = useCallback(async (product: Product, quantity: number = 1, variantId?: string | number, selectedAttributes?: Record<string, any>) => {
    const variant = product.variants?.find(v => v.id == variantId);

    const existingItem = items.find(item =>
      String(item.product.id) === String(product.id) && 
      String(item.variantId) === String(variantId) &&
      JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
    );

    let newItems: CartItem[];
    if (existingItem) {
      newItems = items.map(item =>
        (String(item.product.id) === String(product.id) && 
         String(item.variantId) === String(variantId) &&
         JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes))
          ? { ...item, quantity: Number(item.quantity) + Number(quantity) }
          : item
      );
      toast.success(`Updated quantity in cart`);
    } else {
      newItems = [...items, {
        product,
        quantity: Number(quantity),
        variantId,
        selectedAttributes,
        weight: variant?.weight,
        packSize: variant?.pack_size
      }];
      toast.success(`Added to cart`);
    }

    await updateCart(newItems);
  }, [items, updateCart]);

  const removeFromCart = useCallback(async (productId: string, variantId?: string | number) => {
    const newItems = items.filter(item => {
      if (String(item.product.id) !== String(productId)) return true;          // keep other products
      if (variantId === undefined) return false;               // remove ALL variants of this product if no variantId given
      return String(item.variantId) !== String(variantId);                      // keep variants that don't match
    });
    await updateCart(newItems);
  }, [items, updateCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number, variantId?: string | number) => {
    if (quantity <= 0) {
      await removeFromCart(productId, variantId);
      return;
    }

    const newItems = items.map(item => {
      if (String(item.product.id) !== String(productId)) return item;
      if (variantId !== undefined && String(item.variantId) !== String(variantId)) return item;
      return { ...item, quantity: Number(quantity) };
    });
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
    return items.reduce((total, item) => {
      const variant = item.product.variants?.find(v => v.id == item.variantId);
      const price = variant ? Number(variant.discount_price || variant.price) : Number(item.product.price);
      return total + price * item.quantity;
    }, 0);
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
