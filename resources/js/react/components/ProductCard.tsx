import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ShoppingBag, Star, Heart, ArrowRight } from "lucide-react";
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
  
  const defaultVariant = product.variants?.find(v => v.status === 'active') || product.variants?.[0];
  const [selectedWeight, setSelectedWeight] = useState(defaultVariant?.weight || "");

  const currentVariant = product.variants?.find(
    v => v.weight === selectedWeight
  ) || defaultVariant;

  const displayPrice = currentVariant ? (currentVariant.discount_price || currentVariant.price) : product.price;
  const isWishlisted = isInWishlist(String(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, currentVariant?.id);
    toast.success(`${product.name} Added!`, {
      duration: 2000,
      icon: <ShoppingBag className="w-4 h-4 text-[var(--green-primary)]" />,
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) removeFromWishlist(String(product.id));
    else addToWishlist(product);
  };

  const isMonkFruit = product.name.toLowerCase().includes("monk");
  const bgClass = isMonkFruit ? "bg-[#FDF7ED]" : "bg-[#F0F4EF]";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[var(--bg-card)] rounded-[32px] border border-[var(--border-light)] p-6 transition-all duration-500 hover:shadow-[var(--shadow-card)] hover:-translate-y-2 group relative overflow-hidden"
    >
      {/* Image Area */}
      <div className={`aspect-square rounded-[20px] mb-6 flex items-center justify-center p-8 transition-colors duration-500 relative ${bgClass}`}>
        {product.badge && (
          <div className="absolute top-4 left-4 px-4 py-1.5 bg-[var(--green-accent)] text-[var(--green-primary)] text-[10px] font-black uppercase tracking-widest rounded-full z-10 shadow-sm">
            {product.badge}
          </div>
        )}
        
        <button 
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[var(--text-muted)]'}`} />
        </button>
        
        <Link to={`/products/${product.slug || product.id}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
          />
        </Link>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-4 bottom-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[var(--green-primary)] text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl hover:bg-[var(--green-hover)]"
          >
            <Plus className="w-3 h-3" /> Quick Add
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--green-primary)] opacity-60">
            {isMonkFruit ? "Monk Fruit" : "Pure Stevia"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-[var(--text-heading)]">4.9</span>
          </div>
        </div>
        
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 className="text-lg font-[900] uppercase tracking-tighter text-[var(--text-heading)] mb-2 group-hover:text-[var(--green-primary)] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[var(--text-muted)] text-[11px] font-medium leading-relaxed mb-6 line-clamp-2">
          {product.description || "Experience the pure taste of nature with our premium organic sweetener."}
        </p>

        {/* Size Pills */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex gap-2 mb-6">
            {Array.from(new Set(product.variants.map(v => v.weight))).map(weight => (
              <button
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${selectedWeight === weight ? 'bg-[var(--green-primary)] text-white border-[var(--green-primary)]' : 'bg-white text-[var(--text-muted)] border-[var(--border-light)] hover:border-[var(--green-primary)]'}`}
              >
                {weight}
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-0.5">Price</span>
            <span className="text-xl font-[900] text-[var(--green-primary)] tracking-tighter">₹{displayPrice}</span>
          </div>
          
          <Link 
            to={`/products/${product.slug || product.id}`}
            className="w-10 h-10 rounded-xl bg-[var(--green-pale)] flex items-center justify-center text-[var(--green-primary)] transition-all hover:bg-[var(--green-primary)] hover:text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
