import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Info } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const defaultVariant = product.variants?.find((v) => v.status === "active") || product.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState<any>(defaultVariant);

  const displayPrice = selectedVariant
    ? selectedVariant.discount_price || selectedVariant.price
    : product.price;

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Simulate slight network delay for the UX request in PRD
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const variantId = selectedVariant?.id;
    for (let i = 0; i < quantity; i++) {
        addToCart(product, 1, variantId);
    }
    
    setIsAdding(false);
    toast.success(`${product.name} Added!`, { 
        duration: 2000, 
        icon: <ShoppingCart className="w-4 h-4 text-primary" /> 
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-background w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-secondary/20 p-8 flex items-center justify-center relative overlow-hidden">
            <img 
                src={selectedVariant?.image_url || product.image} 
                alt={product.name} 
                className="w-full max-w-sm aspect-square object-contain relative z-10"
            />
            {product.originalPrice && product.originalPrice > displayPrice && (
                <div className="absolute top-6 left-6 z-20 bg-destructive text-destructive-foreground eyebrow !tracking-widest !text-[10px] px-3 py-1.5 shadow-sm rounded-squircle font-bold">
                    -{Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100)}%
                </div>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col h-full overflow-y-auto">
            <div className="mb-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                   {product.category || 'Natural Sweetener'}
               </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 leading-tight">{product.name}</h2>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-lime">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating || 5) ? 'fill-current' : 'text-border'}`} />
                ))}
              </div>
              <span className="text-sm font-bold">{product.rating || '5.0'} / 5.0</span>
              <span className="text-sm text-muted-foreground">({product.reviews || 0} reviews)</span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {product.description || "Experience the pure taste of nature with Grevia's premium sweetener. Zero calories, zero insulin spike, and zero bitter aftertaste."}
            </p>

            {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                    <label className="text-[10px] font-black uppercase tracking-widest mb-3 block opacity-50">Choose Size</label>
                    <div className="flex flex-wrap gap-2">
                        {product.variants.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                                    selectedVariant?.id === v.id 
                                    ? 'border-primary bg-primary/5 text-primary' 
                                    : 'border-border text-muted-foreground hover:border-primary/50'
                                }`}
                            >
                                {v.weight}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mt-auto pt-6 border-t border-border/50">
                <div className="flex items-end gap-3 mb-6">
                    <span className="text-3xl font-black text-foreground">₹{displayPrice}</span>
                    {product.originalPrice && product.originalPrice > displayPrice && (
                        <span className="text-lg text-muted-foreground line-through font-bold mb-1">₹{product.originalPrice}</span>
                    )}
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center bg-card border border-border/50 rounded-xl px-2 shadow-soft">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center hover:text-primary font-bold text-lg transition-colors"
                        >
                            -
                        </button>
                        <span className="w-8 text-center font-bold">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:text-primary font-bold text-lg transition-colors"
                        >
                            +
                        </button>
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="flex-1 btn-primary !h-auto flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                        {isAdding ? (
                            <>
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
