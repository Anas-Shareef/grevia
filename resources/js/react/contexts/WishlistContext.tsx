import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

import { WishlistContext, WishlistContextType } from "./Definitions";

const WISHLIST_STORAGE_KEY = "grevia-wishlist";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Pull wishlist from server if user logs in
  useEffect(() => {
    let isMounted = true;
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await api.get('/wishlist');
          if (isMounted) {
            // Merge with local if needed, but typically standard flow is to just adopt server list
            // However, PRD says push local to server if guest logs in.
            // Let's do a quick sync sweep
            const serverIds = res.map((p: any) => p.id);
            const pendingAdds = items.filter(localItem => !serverIds.includes(localItem.id));
            
            for (const p of pendingAdds) {
                try {
                    await api.post('/wishlist', { product_id: p.id });
                } catch(e) {}
            }

            // Refetch after merging
            const finalRes = await api.get('/wishlist');
            if (isMounted) {
              setItems(finalRes);
            }
          }
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        }
      }
    };

    fetchWishlist();
    
    return () => {
        isMounted = false;
    };
  }, [user]); // user changed

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = useCallback(async (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });

    if (user) {
        try {
            await api.post('/wishlist', { product_id: product.id });
        } catch (error) {
            console.error("Failed to sync wishlist addition", error);
        }
    }
  }, [user]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId || String(item.id) !== productId));

    if (user) {
        try {
            await api.delete(`/wishlist/${productId}`);
        } catch (error) {
            console.error("Failed to sync wishlist removal", error);
        }
    }
  }, [user]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => String(item.id) === String(productId)),
    [items]
  );

  const getWishlistCount = useCallback(() => items.length, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
