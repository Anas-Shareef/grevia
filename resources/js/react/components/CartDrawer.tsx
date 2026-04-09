import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
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
    if (!isInWishlist(String(item.product.id))) {
      addToWishlist(item.product);
      removeFromCart(item.product.id, item.variantId);
      toast.success(`${item.product.name} saved!`);
    } else {
      toast.info(`${item.product.name} is already saved`);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border bg-white shadow-2xl font-['Montserrat'] [&>button]:hidden">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border flex flex-row items-center justify-between bg-white shrink-0">
          <SheetTitle className="text-foreground text-lg font-black uppercase tracking-wide flex items-center gap-2 m-0 border-0 p-0">
            <ShoppingBag className="w-5 h-5" />
            Cart ({getCartCount()})
          </SheetTitle>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            Close <X className="w-4 h-4" />
          </button>
        </div>
        <SheetDescription className="sr-only">Your shopping cart items</SheetDescription>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 overflow-y-auto">
            <div className="w-24 h-24 bg-[#f8f5ec] rounded-[32px] flex items-center justify-center shadow-sm mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/60" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-3">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm font-medium mb-8 max-w-[240px] leading-relaxed">
              Looks like you haven't added anything yet. 
            </p>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-lime text-white rounded-full font-bold h-12 px-8 shadow-md hover:shadow-lg transition-all"
            >
              <Link to="/collections/all">Start Shopping</Link>
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-4 border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to={`/products/${item.product.slug || item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="flex-shrink-0 w-20 h-20 bg-[#f8f5ec] rounded-xl flex items-center justify-center p-2"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        {/* Row 1: Title and X */}
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/products/${item.product.slug || item.product.id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-semibold text-foreground hover:text-lime transition-colors line-clamp-2 text-sm"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.variantId)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Row 2: Price string */}
                        <p className="text-sm font-bold text-lime mt-1">
                          ₹{unitPrice.toLocaleString('en-IN')} × {item.quantity} = ₹{(unitPrice * item.quantity).toLocaleString('en-IN')}
                        </p>

                        {/* Row 3: Actions */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)}
                              className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-lime hover:border-lime hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                              className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-lime hover:border-lime hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => handleMoveToWishlist(item)}
                            className="flex items-center gap-1 text-xs font-semibold transition-colors text-muted-foreground hover:text-red-500"
                          >
                            <Heart className={`w-4 h-4 ${isInWishlist(String(item.product.id)) ? 'fill-red-500 text-red-500' : ''}`} />
                            Save
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 bg-white shrink-0">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold uppercase text-sm tracking-wide">
                    Subtotal:
                  </span>
                  <span className="text-3xl font-black text-lime">
                    ₹{getCartTotal().toLocaleString('en-IN')}
                  </span>
                </div>
                
                <p className="text-xs text-center text-muted-foreground mb-4">
                  Free shipping on all orders!
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm bg-white font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full h-12 px-6 w-full transition-colors duration-300"
                  >
                    Continue Shopping
                  </button>
                  <Link 
                    to="/checkout" 
                    onClick={() => setIsCartOpen(false)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-lime text-white rounded-full font-bold h-12 px-6 w-full hover:bg-lime-glow transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
