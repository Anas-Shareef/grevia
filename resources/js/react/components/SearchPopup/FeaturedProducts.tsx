import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { transformProduct } from "@/hooks/useProducts";
import { Product } from "@/data/products";
import { FEATURED_PRODUCT_SLUGS } from "@/constants/searchConstants";

interface FeaturedProductsProps {
  onProductClick: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get("/products?per_page=50");
        if (response && response.data && Array.isArray(response.data)) {
          const transformed = response.data.map(transformProduct);
          // Filter matching our featured slugs
          const filtered = transformed.filter((p: Product) =>
            FEATURED_PRODUCT_SLUGS.includes(p.slug || "")
          );
          // Maintain the order of slugs as specified in searchConstants
          const ordered = FEATURED_PRODUCT_SLUGS.map(slug => 
            filtered.find(p => p.slug === slug)
          ).filter(Boolean) as Product[];

          setProducts(ordered.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div>
        <h3 className="sp-section-title">Featured Products</h3>
        <div className="sp-products-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="sp-product-card opacity-50 animate-pulse">
              <div className="sp-product-image-wrapper" />
              <div className="h-4 bg-gray-200 rounded mt-2 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mt-1 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div>
      <h3 className="sp-section-title">Featured Products</h3>
      <div className="sp-products-grid">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug || product.id}`}
            className="sp-product-card"
            onClick={onProductClick}
          >
            <div className="sp-product-image-wrapper">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="sp-product-image"
                />
              ) : (
                <div className="w-full h-full bg-[#2D6A4F] flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                  Grevia
                </div>
              )}
            </div>
            <div className="sp-product-name">{product.name}</div>
            <div className="sp-product-price">₹{product.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default FeaturedProducts;
