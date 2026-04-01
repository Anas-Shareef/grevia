import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/data/products";
import WishlistButton from "@/components/WishlistButton";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  // Default variant logic
  const defaultVariant = product.variants?.find(v => v.status === 'active') || product.variants?.[0];
  const [selectedWeight, setSelectedWeight] = useState(defaultVariant?.weight || "");
  const [selectedPackSize, setSelectedPackSize] = useState(defaultVariant?.pack_size || 1);

  const currentVariant = product.variants?.find(
    v => v.weight === selectedWeight && v.pack_size === selectedPackSize
  ) || defaultVariant;

  const displayPrice = currentVariant ? (currentVariant.discount_price || currentVariant.price) : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, currentVariant?.id);
    toast.success(`${product.name} Added!`, {
      duration: 2000,
      icon: <ShoppingCart className="w-4 h-4 text-[var(--green-primary)]" />,
    });
  };

  const isMonkFruit = product.name.toLowerCase().includes("monk");
  const bgClass = isMonkFruit ? "monk-bg" : "stevia-bg";
  const typeClass = isMonkFruit ? "monk" : "";

  return (
    <div className="product-card group reveal-animation" style={{ opacity: 1, transform: 'none' }}>
      {/* Image Area */}
      <div className={`product-img-area ${bgClass}`}>
        {product.badge && (
          <div className={`product-badge ${isMonkFruit ? 'monk' : ''}`}>
            {product.badge}
          </div>
        )}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton product={product} size="sm" />
        </div>
        
        <Link to={`/products/${product.slug || product.id}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name}
            className="transition-transform duration-500 group-hover:scale-110" 
          />
        </Link>
      </div>

      {/* Card Body */}
      <div className="product-body">
        <div className={`product-type ${typeClass}`}>
          {typeof product.category === 'string' ? product.category : product.category.name}
        </div>
        
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 className="product-name line-clamp-1 hover:text-[var(--green-primary)] transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="product-desc line-clamp-2">
          {product.description || "Natural organic sweetener for a healthy lifestyle."}
        </p>

        {/* Size Pills */}
        {product.variants && product.variants.length > 0 && (
          <div className="size-pills">
            {Array.from(new Set(product.variants.map(v => v.weight))).map(weight => (
              <button
                key={weight}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedWeight(weight);
                }}
                className={`size-pill ${selectedWeight === weight ? 'active' : ''}`}
              >
                {weight}
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="product-footer">
          <div className="flex flex-col">
            <span className="product-price">₹{displayPrice}</span>
            <span className="product-price-sub">per pack</span>
          </div>
          
          <button onClick={handleAddToCart} className="btn-add flex items-center gap-1 group/btn">
            <Plus className="w-3 h-3 group-hover/btn:rotate-90 transition-transform" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
