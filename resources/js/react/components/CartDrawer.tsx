import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Minus, Plus, X, ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleMoveToWishlist = (item: typeof items[0]) => {
    if (!isInWishlist(item.product.id)) {
      addToWishlist(item.product);
      removeFromCart(item.product.id, item.variantId);
      toast.success(`${item.product.name} moved to wishlist!`);
    } else {
      toast.info(`${item.product.name} is already in wishlist`);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-[var(--border-light)] bg-[var(--bg-page)]">
        {/* Header */}
        <SheetHeader className="px-6 py-6 border-b border-[var(--border-light)] bg-white">
          <SheetTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-[var(--text-heading)]">
            <ShoppingBag className="w-6 h-6 text-[var(--green-primary)]" />
            Your Cart ({getCartCount()})
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your shopping cart items
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-soft mb-8">
              <ShoppingBag className="w-10 h-10 text-[var(--border-light)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-heading)] mb-2">Cart is empty</h3>
            <p className="text-[var(--text-muted)] mb-10 max-w-[240px]">Start adding some natural sweetness to your lifestyle.</p>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="btn-primary px-8 py-3"
            >
              <Link to="/collections/all">Browse Collection</Link>
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
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
                      className="flex gap-5 p-5 mb-4 bg-white rounded-[24px] border border-[var(--border-light)] shadow-sm hover:shadow-md transition-all group"
                    >
                      <Link
                        to={`/products/${item.product.slug || item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="w-20 h-20 bg-[var(--bg-page)] rounded-2xl flex-shrink-0 flex items-center justify-center p-3"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="max-w-full max-h-full transition-transform group-hover:scale-110"
                        />
                      </Link>
                      
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            to={`/products/${item.product.slug || item.product.id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-bold text-[var(--text-heading)] hover:text-[var(--green-primary)] transition-colors line-clamp-1 text-sm uppercase tracking-tight"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.variantId)}
                            className="p-1 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {item.weight && (
                          <span className="text-[10px] font-black text-[var(--green-primary)] uppercase tracking-widest mb-3">
                            {item.weight} Pack
                          </span>
                        )}

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-[var(--bg-page)] rounded-full px-1 py-1 border border-[var(--border-light)]">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--green-primary)] transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--green-primary)] transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <span className="text-base font-black text-[var(--text-heading)]">
                            ₹{(unitPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <SheetFooter className="p-8 mt-auto bg-white border-t border-[var(--border-light)]">
              <div className="w-full space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Subtotal</span>
                  <span className="text-3xl font-black text-[var(--text-heading)] tracking-tighter">
                    ₹{getCartTotal().toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-[var(--green-pale)] rounded-2xl border border-[var(--green-mint)]/30">
                    <Truck className="w-4 h-4 text-[var(--green-primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--green-primary)]">Free Delivery</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="w-full">
                    <button className="btn-primary w-full py-4 text-base">
                      Checkout Now
                    </button>
                  </Link>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--green-primary)] transition-colors"
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

const Truck = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);

export default CartDrawer;
