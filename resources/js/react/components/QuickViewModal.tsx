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
  Activity,
  Award,
  ChevronRight,
  Check,
  Heart
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Product, ProductVariant } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BenefitChip = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-1.5 bg-[#F0FAE8]/60 backdrop-blur-sm border border-[#77CB4D]/30 rounded-full px-3 py-1.5 transition-all hover:shadow-md hover:bg-[#F0FAE8]">
    <Icon className="w-3.5 h-3.5 text-[#2E4D31]" />
    <span className="text-[10px] font-black text-[#2E4D31] uppercase tracking-widest">{text}</span>
  </div>
);

const TAG_ICONS: Record<string, any> = {
  '100% Organic': Award,
  'Keto-Friendly': Zap,
  'Zero-Glycemic': Activity,
  'Plant-Based': Leaf,
  'Natural': Leaf,
  'Stevia': Leaf,
  'Premium': Star,
  'New': Zap,
};

export const QuickViewModal = ({ product, open, onOpenChange }: QuickViewModalProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  const isWishlisted = isInWishlist(String(product.id));
  
  const defaultVariant = product.variants?.find(v => v.status === 'active') || product.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(defaultVariant);
  const [activeImage, setActiveImage] = useState(product.image);
  
  const concentrationOptions = product.attributes?.concentrations || [];
  const [selectedConcentration, setSelectedConcentration] = useState(
    concentrationOptions.find((c: any) => c.is_default)?.value || concentrationOptions[0]?.value || '1:10'
  );

  const handleAddToCart = () => {
    const variantId = selectedVariant?.id || product.variants?.[0]?.id;
    addToCart(product, quantity, variantId, { concentration: selectedConcentration });
    setIsAdded(true);
    toast.success(`${product.name} Added!`, {
      style: { background: '#2E4D31', color: '#fff', borderRadius: '40px' }
    });
    
    setTimeout(() => {
      setIsAdded(false);
      onOpenChange(false);
    }, 1500);
  };

  const galleryImages = (product.gallery && product.gallery.length > 0)
    ? product.gallery.map(g => g.url)
    : [product.image].filter(Boolean);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(String(product.id));
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist ❤️');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-none rounded-[32px] shadow-2xl Montserrat">
        <VisuallyHidden.Root>
          <DialogTitle>{product.name} Quick View</DialogTitle>
          <DialogDescription>Quickly view details and add {product.name} to your cart.</DialogDescription>
        </VisuallyHidden.Root>
        <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto no-scrollbar">
          
          {/* Left: Media Area */}
          <div className="w-full md:w-[45%] bg-[#F8F5F0] relative p-8 flex flex-col items-center justify-center min-h-[400px]">
             {/* Main Image */}
             <div className="relative w-full aspect-square flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    src={activeImage} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" 
                  />
                </AnimatePresence>
             </div>

             {/* Thumbnails */}
             {Array.isArray(galleryImages) && galleryImages.length > 1 && (
               <div className="flex gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide px-4 max-w-full">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        "w-16 h-16 flex-shrink-0 rounded-[12px] overflow-hidden border-2 transition-all bg-white",
                        activeImage === img ? "border-[#2E4D31] shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
               </div>
             )}
          </div>

          {/* Right: Content Area */}
          <div className="w-full md:w-[55%] p-10 md:p-12 flex flex-col bg-white">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex text-[#F59E0B]">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Premium Quality</span>
              </div>
              
              <h2 className="text-[28px] md:text-[36px] font-bold text-[#2E4D31] leading-[1.1] mb-4">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[28px] font-black text-[#2E4D31]">
                  ₹{selectedVariant?.price || product.price}
                </span>
              </div>
              

              <div 
                className="text-gray-500 text-[15px] leading-relaxed mb-8 font-medium line-clamp-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description || "Experience the pure, plant-based sweetness of Grevia." }}
              />

              {/* Selection Pills */}
              <div className="space-y-8 mb-10">
                {/* Potency / Concentration Selection */}
                {concentrationOptions.length > 0 && (
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#2E4D31]/40 mb-4">Select Potency</p>
                    <div className="flex flex-wrap gap-3">
                      {concentrationOptions.map((opt: any) => (
                        <button
                          key={opt.id || opt.value}
                          onClick={() => setSelectedConcentration(opt.value)}
                          className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center text-[14px] font-black border-2 transition-all duration-300 transform active:scale-90",
                            selectedConcentration === opt.value
                              ? "bg-[#77CB4D] text-white border-[#77CB4D] shadow-xl shadow-[#77CB4D]/30 scale-110 z-10"
                              : "bg-white text-[#2E4D31] border-[#E5E7EB] hover:border-[#77CB4D] hover:scale-105"
                          )}
                        >
                          {opt.value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pack Weight */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#2E4D31]/40 mb-4">Select Pack Weight</p>
                    <div className="flex flex-wrap gap-4">
                       {Array.isArray(product.variants) && product.variants.map((v) => (
                         <button
                           key={v.id}
                           onClick={() => setSelectedVariant(v)}
                           className={cn(
                             "w-14 h-14 rounded-full flex items-center justify-center text-[13px] font-black border-2 transition-all duration-300 transform active:scale-90",
                             selectedVariant?.id === v.id
                               ? "bg-[#2E4D31] text-white border-[#2E4D31] shadow-xl shadow-[#2E4D31]/30 scale-110 z-10"
                               : "bg-white text-[#2E4D31] border-[#E5E7EB] hover:border-[#2E4D31] hover:scale-105"
                           )}
                         >
                           {v.weight}
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center bg-[#F8F5F0] rounded-full p-1 border border-[#E5E7EB]">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[#2E4D31] hover:bg-white rounded-full transition-all"><Minus className="w-4 h-4" /></button>
                    <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-[#2E4D31] hover:bg-white rounded-full transition-all"><Plus className="w-4 h-4" /></button>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className="flex-1 h-14 bg-[#77CB4D] hover:bg-[#5fb33a] text-white rounded-full font-black text-[12px] uppercase tracking-widest transition-all shadow-lg shadow-[#77CB4D]/25 active:scale-95"
                  >
                    {isAdded ? "Added to Cart" : "Add to Cart"}
                  </button>

                  <button 
                    onClick={toggleWishlist}
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all",
                      isWishlisted ? "bg-white border-red-100 text-red-500 shadow-sm" : "bg-white border-[#E5E7EB] text-gray-300 hover:border-[#2E4D31]"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                  </button>
                </div>
              </div>

              {/* Footer Links */}
              <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between">
                <Link to={`/products/${product.slug || product.id}`} onClick={() => onOpenChange(false)} className="text-[13px] font-bold text-[#2E4D31] flex items-center gap-2 group">
                  View Full Product Story
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
