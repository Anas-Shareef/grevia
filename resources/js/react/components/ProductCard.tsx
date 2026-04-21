import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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
        ? "flex flex-col md:flex-row gap-6 py-6 border-b border-border/50 w-full relative group transition-all duration-500 bg-transparent shadow-none"
        : "group bg-card rounded-squircle-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-lime/30"
      }
    >
      {/* Quick View Modal */}
      <QuickViewModal 
        product={product} 
        open={isQuickShopOpen} 
        onOpenChange={setIsQuickShopOpen} 
      />

      {/* Image Area — aspect-square with hover overlay */}
      <div className={viewMode === 'list'
        ? "w-full md:w-1/3 lg:w-1/4 relative overflow-hidden aspect-square rounded-xl bg-secondary/30 flex-shrink-0"
        : "relative aspect-square overflow-hidden bg-secondary/30"
      }>
        {/* Dynamic Badges from Tags */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
            {product.badge && (
                <div className="bg-lime text-forest font-black uppercase tracking-widest text-[10px] px-3 py-1 shadow-sm rounded-t-xl rounded-bl-xl rounded-br-sm border border-lime-glow">
                    {product.badge}
                </div>
            )}
            {product.tags?.includes('Keto-Friendly') && (
                <div className="bg-blue-500 text-white font-black uppercase tracking-widest text-[8px] px-2 py-0.5 shadow-sm rounded-full w-fit">
                    Keto-Friendly
                </div>
            )}
            {product.tags?.includes('100% Organic') && (
                <div className="bg-emerald-600 text-white font-black uppercase tracking-widest text-[8px] px-2 py-0.5 shadow-sm rounded-full w-fit">
                    100% Organic
                </div>
            )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-foreground/40"
            }`}
          />
        </button>

        {/* Product Image */}
        <Link
          to={`/products/${product.slug || product.id}`}
          className="block w-full h-full relative z-10"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>
        
        {/* Hover Overlay with Quick Shop Reveal */}
        <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6 z-20">
          <button
            onClick={handleQuickShop}
            className="inline-flex items-center justify-center gap-2 bg-white text-forest hover:bg-forest hover:text-white rounded-full shadow-lg font-bold h-11 px-8 text-xs translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            Quick Shop
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={viewMode === 'list'
        ? "w-full md:w-2/3 lg:w-3/4 flex flex-col justify-between py-2"
        : "p-3 md:p-6 flex flex-col flex-1"
      }>
        {/* Rating */}
        {viewMode === 'grid' && (
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 fill-lime text-lime" />
            <span className="text-sm font-bold text-foreground">4.9</span>
            <span className="text-sm text-muted-foreground">(128 reviews)</span>
          </div>
        )}

        {/* Title */}
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 className={viewMode === 'list'
            ? "text-lg md:text-xl font-bold uppercase tracking-wide text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2"
            : "text-lg font-black text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1"
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
            <span className="text-sm text-muted-foreground">({product.reviews_count || 184})</span>
          </div>
        )}

        {/* Description */}
        {viewMode === 'list' ? (
          <p className="text-muted-foreground text-sm mt-3 line-clamp-2 md:line-clamp-3">
            {product.description || "Premium stevia in elegant glass jar"}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description || "Premium stevia in elegant glass jar"}
          </p>
        )}

        {/* Price + View button */}
        {viewMode === 'list' ? (
          <div className="flex justify-between items-end mt-6">
            <div className="flex flex-col">
                {currentVariant?.discount_price && (
                    <span className="text-sm text-muted-foreground line-through">
                        ₹{currentVariant.price}
                    </span>
                )}
                <span className="text-xl md:text-2xl font-bold text-foreground">
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
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
                {currentVariant?.discount_price && (
                    <span className="text-xs text-muted-foreground line-through decoration-destructive/50">
                        ₹{currentVariant.price}
                    </span>
                )}
                <span className="text-2xl font-black text-foreground">
                    ₹{displayPrice}
                </span>
            </div>
            <Link
              to={`/products/${product.slug || product.id}`}
              className="inline-flex items-center justify-center text-sm font-bold border-2 border-forest text-forest hover:bg-forest hover:text-white rounded-full h-10 px-6 transition-all duration-300"
            >
              View
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  );
};
