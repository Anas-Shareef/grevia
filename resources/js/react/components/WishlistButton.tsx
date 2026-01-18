import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/data/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

const WishlistButton = ({ product, size = "md", className = "", showLabel = false }: WishlistButtonProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  if (showLabel) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-squircle border transition-all duration-300",
          isWishlisted
            ? "bg-red-500/10 border-red-500/30 text-red-500"
            : "bg-secondary border-border hover:border-red-500/30 hover:bg-red-500/10 text-muted-foreground hover:text-red-500",
          className
        )}
      >
        <motion.div
          key={isWishlisted ? "filled" : "empty"}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Heart
            className={cn(iconSizes[size], isWishlisted && "fill-current")}
          />
        </motion.div>
        <span className="text-sm font-semibold">
          {isWishlisted ? "Saved" : "Save"}
        </span>
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-300",
        sizeClasses[size],
        isWishlisted
          ? "bg-red-500/10 text-red-500"
          : "bg-secondary/80 text-muted-foreground hover:text-red-500 hover:bg-red-500/10",
        className
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.div
        key={isWishlisted ? "filled" : "empty"}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Heart className={cn(iconSizes[size], isWishlisted && "fill-current")} />
      </motion.div>
    </motion.button>
  );
};

export default WishlistButton;
