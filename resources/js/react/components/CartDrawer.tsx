import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Minus, Plus, X, ShoppingBag, Heart, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleMoveToWishlist = (item: typeof items[0]) => {
    if (!isInWishlist(String(item.product.id))) {
      addToWishlist(item.product);
      removeFromCart(item.product.id, item.variantId);
      toast.success(`${item.product.name} moved to wishlist!`);
    } else {
      toast.info(`${item.product.name} is already in wishlist`);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-[var(--border-light)] bg-[var(--bg-page)] font-['Montserrat']">
        {/* Header */}
        <SheetHeader className="px-8 py-8 border-b border-[var(--border-light)] bg-white relative">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-[900] tracking-tighter text-[var(--green-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--green-pale)] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[var(--green-primary)]" />
              </div>
              Your Bag
            </SheetTitle>
            <div className="px-4 py-1.5 bg-[var(--green-primary)] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              {getCartCount()} Items
            </div>
          </div>
          <SheetDescription className="sr-only">
            Your shopping cart items
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center shadow-xl mb-8 border border-[var(--border-light)]">
              <ShoppingBag className="w-12 h-12 text-[var(--border-light)]" />
            </div>
            <h3 className="text-3xl font-[900] tracking-tighter text-[var(--text-heading)] mb-4">Bag is empty</h3>
            <p className="text-[var(--text-muted)] text-sm font-medium mb-10 max-w-[260px] leading-relaxed">
              Start adding some natural sweetness to your healthy lifestyle today.
            </p>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="btn-primary"
            >
              <Link to="/collections/all">Explore Collection</Link>
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <AnimatePresence mode="popLayout">
                {items.map((item) => {
                  const itemKey = `${item.product.id}_${item.variantId ?? 'no-variant'}`;
                  const variant = item.product.variants?.find((v: any) => v.id == item.variantId);
                  const unitPrice = variant
                    ? Number(variant.discount_price || variant.price)
                    : Number(item.product.price || 0);

                  return (
                    <motion.div
                      key={itemKey}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-5 p-5 mb-6 bg-white rounded-[24px] border border-[var(--border-light)] shadow-sm hover:shadow-md transition-all group"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to={`/products/${item.product.slug || item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="w-24 h-24 bg-[var(--bg-page)] rounded-2xl flex-shrink-0 flex items-center justify-center p-4 border border-[var(--border-light)]/50"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-contain transition-transform group-hover:scale-110"
                        />
                      </Link>
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--green-primary)] opacity-60 mb-1">
                              {item.product.name.toLowerCase().includes('monk') ? 'Monk Fruit' : 'Pure Stevia'}
                            </span>
                            <Link
                              to={`/products/${item.product.slug || item.product.id}`}
                              onClick={() => setIsCartOpen(false)}
                              className="text-sm font-black uppercase tracking-tighter text-[var(--text-heading)] hover:text-[var(--green-primary)] transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.variantId)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 bg-[var(--bg-page)] rounded-xl px-1.5 py-1.5 border border-[var(--border-light)]">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)}
                              className="w-8 h-8 rounded-lg bg-white border border-[var(--border-light)] flex items-center justify-center text-[var(--text-heading)] hover:bg-[var(--green-primary)] hover:text-white transition-all shadow-sm"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                              className="w-8 h-8 rounded-lg bg-white border border-[var(--border-light)] flex items-center justify-center text-[var(--text-heading)] hover:bg-[var(--green-primary)] hover:text-white transition-all shadow-sm"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-0.5">Total</div>
                            <div className="text-lg font-[900] text-[var(--green-primary)] tracking-tighter">
                              ₹{(unitPrice * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <SheetFooter className="p-8 mt-auto bg-white border-t border-[var(--border-light)] shadow-2xl relative z-10">
              <div className="w-full space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                    <span>Summary</span>
                    <span className="text-[var(--green-primary)]">Free Shipping Included</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-[var(--text-heading)]">Subtotal Amount</span>
                    <span className="text-4xl font-[900] text-[var(--green-primary)] tracking-tighter">
                      ₹{getCartTotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="w-full">
                    <button className="btn-primary w-full py-5 text-base flex items-center justify-center gap-3 group">
                      Secure Checkout
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] hover:text-[var(--green-primary)] transition-colors text-center w-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
