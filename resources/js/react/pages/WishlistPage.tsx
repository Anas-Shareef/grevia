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
                  className="group bg-card rounded-squircle-xl overflow-hidden shadow-soft border border-border/50 hover:border-lime/30 transition-all duration-300"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="block relative aspect-square overflow-hidden bg-secondary/30"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-lime text-foreground text-xs font-bold px-3 py-1 rounded-squircle">
                        {product.badge}
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xl font-black text-foreground mb-4">
                      ₹{product.price}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="lime"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleMoveToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Move to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(product)}
                        className="px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
