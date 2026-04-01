import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import WishlistButton from "@/components/WishlistButton";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();
    
    // Default to the first active variant or the product price
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
            icon: <ShoppingCart className="w-4 h-4 text-lime" />,
        });
    };

    // Extract ratio tooltip text (e.g. "1g replaces 10g sugar")
    const getRatioCaption = () => {
        if (product.name.includes("1:10")) return "1g replaces 10g sugar";
        if (product.name.includes("1:50")) return "1g replaces 50g sugar";
        return "Natural organic sweetener";
    };

    return (
        <div className="group relative flex flex-col bg-white rounded-[32px] p-3 border border-border/40 shadow-soft hover:shadow-card transition-all duration-500 overflow-hidden">
            {/* Image Container - Light Natural Background */}
            <Link 
                to={`/products/${product.slug || product.id}`}
                className="relative aspect-square rounded-[24px] bg-page overflow-hidden flex items-center justify-center p-10 mb-5 border border-transparent group-hover:border-primary/5 transition-colors"
            >
                <div className="absolute top-4 left-4 z-20">
                    {product.badge && (
                        <div className="bg-accent-green text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                            {product.badge}
                        </div>
                    )}
                </div>
                <div className="absolute top-4 right-4 z-20">
                    <WishlistButton product={product} size="sm" />
                </div>
                
                <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 drop-shadow-sm" 
                />
            </Link>

            {/* Content Area */}
            <div className="px-3 pb-3 flex flex-col flex-1">
                {/* Category Label */}
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-60">
                    {typeof product.category === 'string' ? product.category : product.category.name}
                </span>

                {/* Title */}
                <Link to={`/products/${product.slug || product.id}`}>
                    <h3 className="text-xl font-black text-primary mb-1 group-hover:text-accent-green transition-colors leading-tight line-clamp-1 tracking-tighter">
                        {product.name}
                    </h3>
                </Link>

                {/* Ratio Caption */}
                <p className="text-[11px] text-text-muted mb-6 font-medium italic opacity-80">
                    {getRatioCaption()}
                </p>

                {/* Weight/Size Selectors (Horizontal Pills) */}
                {product.variants && product.variants.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {Array.from(new Set(product.variants.map(v => v.weight))).map(weight => (
                            <button
                                key={weight}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedWeight(weight);
                                    const v = product.variants?.find(v => v.weight === weight);
                                    if(v) setSelectedPackSize(v.pack_size);
                                 }}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest transition-all duration-300 ${
                                    selectedWeight === weight 
                                    ? "bg-primary text-white border-primary shadow-soft" 
                                    : "bg-page text-primary border-border hover:border-primary/30"
                                }`}
                            >
                                {weight}
                            </button>
                        ))}
                    </div>
                )}

                {/* Footer: Price & CTA */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-black text-primary tracking-tighter">₹{displayPrice}</span>
                            {currentVariant?.discount_price && (
                                <span className="text-[10px] text-text-muted line-through opacity-50">₹{currentVariant.price}</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Link to={`/products/${product.slug || product.id}`}>
                            <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black tracking-[0.15em] text-primary hover:bg-secondary px-3 rounded-full">
                                Details
                            </Button>
                        </Link>
                        <Button 
                            onClick={handleAddToCart}
                            size="sm"
                            className="bg-primary hover:bg-primary/95 text-white rounded-full px-5 py-5 text-[11px] font-black uppercase tracking-widest shadow-button transition-transform hover:scale-105 active:scale-95 group/btn"
                        >
                            <Plus className="w-3.5 h-3.5 mr-1 group-hover/btn:rotate-90 transition-transform duration-300" />
                            Add
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
