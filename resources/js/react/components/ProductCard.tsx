import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const defaultVariant =
    product.variants?.find((v) => v.status === "active") ||
    product.variants?.[0];
  const [selectedWeight, setSelectedWeight] = useState(
    defaultVariant?.weight || ""
  );

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const currentVariant =
    product.variants?.find((v) => v.weight === selectedWeight) ||
    defaultVariant;

  const displayPrice = currentVariant
    ? currentVariant.discount_price || currentVariant.price
    : product.price;
  const isWishlisted = isInWishlist(String(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, currentVariant?.id);
    toast.success(`${product.name} added to cart!`);
  };

  const [isQuickShopOpen, setIsQuickShopOpen] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) removeFromWishlist(String(product.id));
    else addToWishlist(product);
  };

  const handleQuickShop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickShopOpen(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={viewMode === 'list' 
        ? "flex flex-col md:flex-row gap-6 py-6 border-b border-gray-200 w-full relative group transition-all duration-500 bg-transparent shadow-none"
        : "group bg-white rounded-xl overflow-hidden border border-gray-200 md:shadow-sm md:hover:shadow-[0_8px_24px_rgba(46,77,49,0.15)] md:hover:-translate-y-1 transition-all duration-200 active:scale-[0.97]"
      }
    >
      {/* Quick View Modal */}
      <QuickViewModal 
        product={product} 
        open={isQuickShopOpen} 
        onOpenChange={setIsQuickShopOpen} 
      />

      {/* Image Area */}
      <div className={viewMode === 'list'
        ? "w-full md:w-1/3 lg:w-1/4 relative overflow-hidden aspect-[4/3] rounded-xl bg-gray-100 flex-shrink-0"
        : "relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-xl flex-shrink-0"
      }>
        {/* Dynamic Badges from Tags */}
        <div className="absolute top-2 left-2 z-30 flex flex-col gap-1">
            {product.badge && (
                <div className="bg-[#16A34A] text-white font-bold uppercase tracking-widest text-[10px] px-2 py-0.5 rounded-[4px]">
                    {product.badge}
                </div>
            )}
            {product.tags?.includes('Keto-Friendly') && (
                <div className="bg-blue-500 text-white font-bold uppercase tracking-widest text-[8px] px-2 py-0.5 rounded-[4px] w-fit">
                    Keto-Friendly
                </div>
            )}
            {product.tags?.includes('100% Organic') && (
                <div className="bg-[#2E4D31] text-[#D4AF37] font-bold uppercase tracking-widest text-[8px] px-2 py-0.5 rounded-[4px] w-fit">
                    100% Organic
                </div>
            )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 z-30 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }`}
          />
        </button>

        {/* Product Image */}
        <Link
          to={`/products/${product.slug || product.id}`}
          className="block w-full h-full relative z-10"
        >
          {(!loaded && !error && product.image) && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" style={{ backgroundSize: '200% 100%' }} />
          )}
          
          {error || !product.image ? (
            <div className="w-full h-full bg-[#2E4D31] flex items-center justify-center absolute inset-0 z-10">
              <span className="text-[14px] font-black uppercase tracking-widest text-white/90">Grevia</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </Link>
        
        {/* Hover Overlay with Quick Shop Reveal */}
        <div className="absolute inset-0 bg-[#2E4D31]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6 z-20 pointer-events-none">
          <button
            onClick={handleQuickShop}
            className="pointer-events-auto inline-flex items-center justify-center gap-2 bg-white text-[#2E4D31] hover:bg-[#2E4D31] hover:text-white rounded-full shadow-lg font-bold h-11 px-8 text-xs translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            Quick Shop
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={viewMode === 'list'
        ? "w-full md:w-2/3 lg:w-3/4 flex flex-col justify-between py-2"
        : "p-3 md:p-4 flex flex-col flex-1"
      }>
        {/* Rating */}
        {viewMode === 'grid' && (
          <div className="flex items-center gap-1.5 mb-1.5 md:mb-2">
            <Star className="w-[14px] h-[14px] fill-[#D4AF37] text-[#D4AF37]" />
            <span className="text-[12px] md:text-[13px] font-semibold text-[#1F2937]">4.9</span>
            <span className="text-[11px] md:text-[12px] text-[#9CA3AF] hidden md:inline">(128 reviews)</span>
            <span className="text-[11px] md:text-[12px] text-[#9CA3AF] md:hidden">(128)</span>
          </div>
        )}

        {/* Title */}
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 className={viewMode === 'list'
            ? "text-lg md:text-xl font-bold uppercase tracking-wide text-gray-900 mb-1 hover:text-[#2E4D31] transition-colors line-clamp-2"
            : "text-[14px] md:text-[15px] font-bold text-[#1F2937] leading-snug group-hover:text-[#2E4D31] transition-colors line-clamp-2 mt-1.5 md:mt-2"
          }>
            {product.name}
          </h3>
        </Link>
        
        {viewMode === 'list' && (
          <div className="flex items-center gap-2 mb-3 mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews_count || 184} reviews)</span>
          </div>
        )}

        {/* Description */}
        {viewMode === 'list' ? (
          <p className="text-gray-500 text-[13px] mt-3 line-clamp-2 md:line-clamp-3">
            {product.description || "Premium stevia in elegant packaging"}
          </p>
        ) : (
          <p className="text-[12px] md:text-[13px] text-[#6B7280] line-clamp-1 md:line-clamp-2 mt-1 md:mt-1.5">
            {product.description || "Premium stevia in elegant packaging"}
          </p>
        )}

        {/* Price + View button */}
        {viewMode === 'list' ? (
          <div className="flex justify-between items-end mt-6">
            <div className="flex flex-col">
                {currentVariant?.discount_price && (
                    <span className="text-sm text-gray-400 line-through">
                        ₹{currentVariant.price}
                    </span>
                )}
                <span className="text-xl md:text-2xl font-bold text-gray-900">
                    ₹{displayPrice}
                </span>
            </div>
            <button 
              onClick={handleAddToCart}
              className="bg-[#1a1a1a] text-white px-6 md:px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-none"
            >
              ADD TO CART
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-2 md:mt-3 mt-auto">
            <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
                <span className="text-[16px] md:text-[18px] font-bold text-[#1F2937]">
                    ₹{displayPrice}
                </span>
                {currentVariant?.discount_price && (
                    <span className="text-[12px] md:text-[13px] text-[#9CA3AF] line-through">
                        ₹{currentVariant.price}
                    </span>
                )}
            </div>
            <Link
              to={`/products/${product.slug || product.id}`}
              className="w-full sm:w-auto min-h-[40px] flex items-center justify-center text-[13px] font-semibold text-[#2E4D31] border-[1.5px] border-[#2E4D31] bg-white hover:bg-[#2E4D31] hover:text-white rounded-lg h-10 px-4 transition-colors duration-200 active:scale-[0.97]"
            >
              View
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  );
};
