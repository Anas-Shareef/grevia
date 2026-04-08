import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, currentVariant?.id);
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
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 bg-lime text-foreground text-xs font-bold px-3 py-1.5 rounded-squircle">
            {product.badge}
          </div>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
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
          className="block w-full h-full"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </Link>

        {/* Hover Overlay with Add to Cart */}
        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center gap-2 bg-lime text-foreground hover:bg-lime-glow rounded-squircle shadow-glow hover:shadow-lg hover:-translate-y-0.5 font-extrabold h-14 px-8 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-lime text-lime" />
            <span className="text-sm font-bold text-foreground">4.9</span>
          </div>
          <span className="text-sm text-muted-foreground">(128 reviews)</span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description ||
            "Experience the pure taste of nature with our premium organic sweetener."}
        </p>

        {/* Size Pills (if variants) */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex gap-2 mb-4">
            {Array.from(new Set(product.variants.map((v) => v.weight))).map(
              (weight) => (
                <button
                  key={weight}
                  onClick={() => setSelectedWeight(weight)}
                  className={`px-3 py-1 rounded-squircle text-xs font-bold transition-all border ${
                    selectedWeight === weight
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary"
                  }`}
                >
                  {weight}
                </button>
              )
            )}
          </div>
        )}

        {/* Price + View Details */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-foreground">
              ₹{displayPrice}
            </span>
          </div>
          <Link
            to={`/products/${product.slug || product.id}`}
            className="inline-flex items-center justify-center text-sm font-bold border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-squircle h-9 px-4 transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
};
