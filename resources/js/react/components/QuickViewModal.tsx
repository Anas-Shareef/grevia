import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Star, 
  Leaf, 
  Zap, 
  Droplets, 
  Sprout,
  ArrowRight,
  Check
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Product, ProductVariant } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HealthBadge = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center gap-1.5 bg-[#729855]/10 px-3 py-1.5 rounded-full">
    <Icon className="w-3 h-3 text-[#729855]" />
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E4D31]">{label}</span>
  </div>
);

export const QuickViewModal = ({ product, open, onOpenChange }: QuickViewModalProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  const defaultVariant = product.variants?.find(v => v.status === 'active') || product.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(defaultVariant);
  const [activeImage, setActiveImage] = useState(product.image_url || product.image);

  // Sync active image with variant if variant has specific image
  useEffect(() => {
    if (selectedVariant?.image_url) {
      setActiveImage(selectedVariant.image_url);
    }
  }, [selectedVariant]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addToCart(product, quantity, selectedVariant.id);
    setIsAdded(true);
    toast.success(`Added ${quantity} × ${product.name} (${selectedVariant.weight}) to cart!`);
    
    // Reset added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
      onOpenChange(false);
    }, 1500);
  };

  const images = product.gallery?.length 
    ? product.gallery.sort((a, b) => a.sort_order - b.sort_order).map(g => g.url)
    : [product.image_url || product.image];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#F9F9EB] border-none rounded-[32px] sm:rounded-[40px] shadow-2xl">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
          
          {/* Left Column: Media Gallery */}
          <div className="w-full md:w-[45%] bg-[#F3F4ED] relative p-6 md:p-8 flex flex-col items-center justify-center min-h-[350px] md:min-h-full">
            {/* Background Wash Effect */}
            <div className="absolute inset-0 bg-[#729855]/5 opacity-50 z-0" />
            
            <div className="relative z-10 flex flex-row md:flex-row gap-4 w-full h-full items-center">
              {/* Vertical Thumbnails (Desktop-only on left) */}
              {images.length > 1 && (
                <div className="hidden md:flex flex-col gap-3 z-20">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        "w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white",
                        activeImage === img ? "border-[#2E4D31]" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Main Image Display */}
              <div className="flex-1 relative flex items-center justify-center p-4">
                <motion.div 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full aspect-square relative rounded-[40px] overflow-hidden shadow-soft group"
                >
                  <img 
                    src={activeImage} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                  />
                </motion.div>
              </div>
            </div>

            {/* Mobile Thumbnails (Horizontal) */}
            <div className="flex md:hidden gap-2 mt-4 z-20 overflow-x-auto pb-2 no-scrollbar px-4">
               {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        "w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white",
                        activeImage === img ? "border-[#2E4D31]" : "border-transparent opacity-60"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover rounded-[10px]" />
                    </button>
                  ))}
            </div>
          </div>

          {/* Right Column: Product Story */}
          <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col bg-white overflow-y-auto no-scrollbar">
            <div className="mb-6">
               <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#0E0E0E] text-[#0E0E0E]" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-[#0E0E0E]/60 uppercase tracking-widest">(128 Reviews)</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#2E4D31] font-display mb-2 leading-tight">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-3 mb-6">
                <p className="text-2xl font-black text-[#2E4D31]">
                  ₹{selectedVariant?.discount_price || selectedVariant?.price || product.price}
                </p>
                {selectedVariant?.discount_price && (
                  <>
                    <p className="text-sm text-[#2E4D31]/40 line-through">₹{selectedVariant.price}</p>
                    <div className="bg-[#729855]/10 px-2 py-0.5 rounded text-[10px] font-black text-[#729855] uppercase">
                      Save {Math.round(((selectedVariant.price - selectedVariant.discount_price) / selectedVariant.price) * 100)}%
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <HealthBadge icon={Droplets} label="Zero Glycemic" />
                <HealthBadge icon={Zap} label="Keto Friendly" />
                <HealthBadge icon={Leaf} label="100% Natural" />
              </div>

              <p className="text-[#2E4D31]/70 text-sm leading-relaxed mb-8 font-medium">
                {product.description || "Experience the pure, plant-based sweetness of Grevia. Crafted for those who refuse to compromise on taste or health."}
              </p>

              {/* Selection Section */}
              <div className="space-y-6 mb-10">
                {/* Variant Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2E4D31]/40">Select Size</p>
                      <p className="text-[10px] font-bold text-[#729855]">{selectedVariant?.stock_quantity ? `${selectedVariant.stock_quantity} available` : 'In Stock'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {product.variants.map((v) => (
                         <button
                           key={v.id}
                           onClick={() => setSelectedVariant(v)}
                           disabled={v.status === 'inactive' || v.stock_quantity === 0}
                           className={cn(
                             "px-6 py-2.5 rounded-[15px] text-xs font-bold transition-all border-2",
                             selectedVariant?.id === v.id
                               ? "bg-[#2E4D31] text-white border-[#2E4D31] shadow-lg shadow-[#2E4D31]/10"
                               : "bg-white text-[#2E4D31] border-forest/10 hover:border-[#2E4D31]/30",
                             (v.status === 'inactive' || v.stock_quantity === 0) && "opacity-40 pointer-events-none line-through"
                           )}
                         >
                           {v.weight}
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {/* Buy Box */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <div className="flex items-center gap-1 bg-[#F3F4ED] border border-[#E4ECE6] rounded-[20px] p-1 h-14 w-full sm:w-auto">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-[#2E4D31] hover:bg-white rounded-2xl transition-colors active:scale-90"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input 
                      type="number"
                      value={quantity}
                      readOnly
                      className="w-12 text-center bg-transparent font-black text-[#2E4D31] text-sm focus:outline-none"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-[#2E4D31] hover:bg-white rounded-2xl transition-colors active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdded || !selectedVariant}
                    className={cn(
                      "flex-1 h-14 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 w-full",
                      isAdded 
                        ? "bg-[#729855] text-white" 
                        : "bg-[#2E4D31] text-white hover:bg-[#1a2d1d] hover:scale-[1.02] active:scale-95 shadow-button"
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-auto pt-8 border-t border-forest/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-[#729855]" />
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#2E4D31]">Pure Plant-Based Goodness</p>
                </div>
                <Link 
                  to={`/products/${product.slug || product.id}`} 
                  className="group flex items-center gap-1.5 text-xs font-bold text-[#2E4D31] hover:text-[#729855] transition-colors"
                >
                  Full Details
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Close Button */}
        <DialogClose className="absolute right-6 top-6 z-[60] w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2E4D31] shadow-lg hover:bg-white hover:rotate-90 transition-all duration-500 border border-forest/10">
          <X className="w-5 h-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
