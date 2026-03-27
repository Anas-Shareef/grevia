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
        <div className="group relative flex flex-col bg-[#121212] rounded-[32px] p-2 border border-white/5 hover:border-lime/20 transition-all duration-500 shadow-xl overflow-hidden">
            {/* Image Container - Light Background */}
            <Link 
                to={`/product/${product.slug || product.id}`}
                className="relative aspect-[4/4.5] rounded-[24px] bg-[#f2f6f0] overflow-hidden flex items-center justify-center p-8 mb-4 cursor-pointer"
            >
                <div className="absolute top-4 left-4 z-20">
                    {product.badge && (
                        <div className="bg-lime text-[#121212] text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
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
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                />
            </Link>

            {/* Content Area */}
            <div className="px-4 pb-4 flex flex-col flex-1">
                {/* Category Label */}
                <span className="text-[10px] font-black text-lime uppercase tracking-[0.1em] mb-1">
                    {typeof product.category === 'string' ? product.category : product.category.name}
                </span>

                {/* Title */}
                <Link to={`/product/${product.slug || product.id}`}>
                    <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-lime transition-colors leading-tight">
                        {product.name}
                    </h3>
                </Link>

                {/* Ratio Caption */}
                <p className="text-[11px] text-white/50 mb-4 font-medium italic">
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
                                    // Reset pack size to first available for this weight
                                    const v = product.variants?.find(v => v.weight === weight);
                                    if(v) setSelectedPackSize(v.pack_size);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                    selectedWeight === weight 
                                    ? "bg-white/10 border-white/20 text-white" 
                                    : "bg-transparent border-white/5 text-white/30 hover:border-white/20"
                                }`}
                            >
                                {weight}
                            </button>
                        ))}
                    </div>
                )}

                {/* Footer: Price & Add Button */}
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-black text-white">₹{displayPrice}</span>
                            {currentVariant?.discount_price && (
                                <span className="text-[10px] text-white/30 line-through">₹{currentVariant.price}</span>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAddToCart}
                        className="bg-lime/10 hover:bg-lime text-lime hover:text-[#121212] w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group/add border border-lime/20 hover:border-lime active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
