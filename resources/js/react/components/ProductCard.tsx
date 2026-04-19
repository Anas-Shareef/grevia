import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
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

  const [isAdding, setIsAdding] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product, 1, currentVariant?.id);
    setIsAdding(false);
    toast.success(`${product.name} added to cart!`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) removeFromWishlist(String(product.id));
    else addToWishlist(product);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-squircle-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-lime/30"
    >
      {/* Image Area — aspect-square with hover overlay */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30 group">
        {/* Dynamic Badge */}
        {product.originalPrice && product.originalPrice > displayPrice ? (
            <div className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground eyebrow !tracking-widest !text-[10px] px-3 py-1.5 shadow-sm rounded-squircle font-bold">
                -{Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100)}%
            </div>
        ) : product.badge ? (
            <div className="absolute top-4 left-4 z-10 bg-lime text-foreground eyebrow !tracking-widest !text-[10px] px-3 py-1.5 shadow-sm rounded-squircle">
                {product.badge}
            </div>
        ) : null}

        {/* Quick Actions Overlay (Heart & Eye) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button
            onClick={toggleWishlist}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all"
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
            <button
            onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all"
            aria-label="Quick view"
            >
            <Eye className="w-4 h-4 text-foreground/70" />
            </button>
        </div>

        {/* Product Image with Secondary image transition */}
        <Link
          to={`/products/${product.slug || product.id}`}
          className="block w-full h-full relative"
        >
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-700 ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
          />
          {product.images && product.images.length > 1 && (
            <img
                src={product.images[1]}
                alt={`${product.name} alternate`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}
        </Link>
      </div>

      {/* Content Area */}
      <div className="p-3 md:p-6">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 fill-lime text-lime" />
          <span className="text-sm font-bold text-foreground">4.9</span>
          <span className="text-sm text-muted-foreground">(128 reviews)</span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 className="text-lg font-black text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description ||
            "Premium stevia in elegant glass jar"}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto mb-4">
          <span className="text-xl md:text-2xl font-black text-foreground">
            ₹{displayPrice}
          </span>
          {product.originalPrice && product.originalPrice > displayPrice && (
            <span className="text-sm font-bold text-muted-foreground line-through">
                ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Full-width Add to Cart button */}
        <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full btn-primary !h-12 !py-0 flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
            {isAdding ? (
                <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Adding...
                </>
            ) : (
                <>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                </>
            )}
        </button>
      </div>
      <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </motion.article>
  );
};
