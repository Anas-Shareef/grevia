import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
      removeFromCart(item.product.id);
      toast.success(`${item.product.name} moved to wishlist!`);
    } else {
      toast.info(`${item.product.name} is already in wishlist`);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-4 py-4 border-b border-border">
          <SheetTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Cart ({getCartCount()})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some products to get started</p>
            <Button onClick={() => setIsCartOpen(false)} asChild>
              <Link to="/products/sweeteners">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 p-4 border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-semibold text-foreground hover:text-lime transition-colors line-clamp-2 text-sm"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-bold text-lime mt-1">
                        ₹{item.product.price} × {item.quantity} = ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-lime hover:border-lime hover:text-foreground transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-lime hover:border-lime hover:text-foreground transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Move to Wishlist */}
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${isInWishlist(item.product.id)
                              ? "text-red-500"
                              : "text-muted-foreground hover:text-red-500"
                            }`}
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(item.product.id) ? "fill-current" : ""}`} />
                          Save
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <SheetFooter className="border-t border-border p-4 mt-auto bg-background">
              <div className="w-full space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold uppercase text-sm tracking-wide">Subtotal:</span>
                  <span className="text-2xl font-black text-lime">₹{getCartTotal().toLocaleString('en-IN')}</span>
                </div>

                {/* Free Shipping Notice */}
                <p className="text-xs text-center text-muted-foreground">
                  Free shipping on all orders!
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="limeLg"
                    className="w-full rounded-full"
                    onClick={() => setIsCartOpen(false)}
                    asChild
                  >
                    <Link to="/checkout">Checkout</Link>
                  </Button>
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
