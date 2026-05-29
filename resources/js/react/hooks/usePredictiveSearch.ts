import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { transformProduct } from "@/hooks/useProducts";
import { Product } from "@/data/products";

export function usePredictiveSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Debounce the API call by 250ms
    const timer = setTimeout(async () => {
      try {
        const response = await api.get(`/products?search=${encodeURIComponent(query)}`);
        
        if (response && response.data && Array.isArray(response.data)) {
          // Transform products and limit to maximum 6 results
          const transformed = response.data.map(transformProduct).slice(0, 6);
          setResults(transformed);
        } else if (Array.isArray(response)) {
          const transformed = response.map(transformProduct).slice(0, 6);
          setResults(transformed);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Predictive search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, isLoading };
}
