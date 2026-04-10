import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface WishlistPageProps {
  isDashboard?: boolean;
}

const WishlistPage = ({ isDashboard = false }: WishlistPageProps) => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: typeof items[0]) => {
    addToCart(product);
    removeFromWishlist(product.id);
    toast.success(`${product.name} moved to cart!`);
  };

  const handleRemove = (product: typeof items[0]) => {
    removeFromWishlist(product.id);
    toast.success(`${product.name} removed from wishlist`);
  };

  return (
    <div className={isDashboard ? "" : "min-h-screen bg-background"}>
      {!isDashboard && <Header />}
      <main className={isDashboard ? "" : "pt-24 pb-16"}>
        <div className={isDashboard ? "" : "container mx-auto px-4 md:px-6"}>
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 ${isDashboard ? "md:hidden" : ""}`}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </motion.div>

          {/* Page Header */}
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </motion.div>
          )}

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-card rounded-3xl border border-dashed border-border max-w-2xl mx-auto shadow-sm"
            >
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-red-500 fill-red-500" />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto leading-relaxed">
                Looks like you haven't added anything yet.
                Explore our premium organic sweeteners and save your favorites!
              </p>
              <Button asChild size="lg" variant="default" className="rounded-full px-8">
                <Link to="/products/sweeteners">Browse Products</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {items.map((product) => (
                <motion.article
                  key={product.id}
                  variants={itemVariants}
                  className="flex flex-col bg-card rounded-[32px] border border-border/50 shadow-soft hover:shadow-card transition-all duration-500 overflow-hidden w-full group"
                >
                  {/* Image Area */}
                  <figure className="relative bg-[#f8f6f0] p-8 flex items-center justify-center aspect-square overflow-hidden">
                    {product.badge && (
                      <div className="absolute top-4 left-4 z-10 bg-lime text-foreground font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {product.badge}
                      </div>
                    )}
                    <Link
                      to={`/product/${product.id}`}
                      className="block w-full h-full"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>
                  </figure>

                  {/* Content Area */}
                  <div className="p-6 bg-white flex-1 flex flex-col">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-xl font-bold text-foreground mb-2 mt-1 tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-2xl font-black text-foreground mb-6">
                      ₹{product.price}
                    </p>

                    {/* Actions Area */}
                    <div className="flex items-center gap-3 mt-auto">
                      <Button
                        variant="lime"
                        className="flex-1 h-12 rounded-full font-bold shadow-button hover:bg-lime-glow hover:-translate-y-0.5 transition-all duration-300 text-sm"
                        onClick={() => handleMoveToCart(product)}
                      >
                        <ShoppingCart className="w-5 h-5 mr-1" />
                        Move to Cart
                      </Button>
                      <button
                        onClick={() => handleRemove(product)}
                        className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group/trash"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default WishlistPage;
