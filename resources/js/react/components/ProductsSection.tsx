import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import WishlistButton from "@/components/WishlistButton";
import { Product } from "@/data/products";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const ProductsSection = () => {
  const { data: response } = useProducts();
  const { addToCart } = useCart();

  // Handle both array response (old) and paginated response (new)
  const allProducts = Array.isArray(response) ? response : response?.data || [];

  // Get first 6 sweetener products for homepage
  const displayProducts = allProducts.filter(p => p.category?.slug === 'sweeteners').slice(0, 6);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
    });
  };

  return (
    <section
      id="products"
      className="py-24 md:py-32 relative overflow-hidden"
      aria-labelledby="products-heading"
    >
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-block text-sm font-bold text-lime uppercase tracking-widest mb-4">
            Our Collection
          </span>
          <h2
            id="products-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6"
          >
            Featured
            <br />
            <span className="text-primary">Products</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover our range of pure, natural sweeteners and treats crafted for the health-conscious.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayProducts.map((product) => (
            <motion.article
              key={product.id}
              variants={itemVariants}
              className="group bg-card rounded-squircle-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-lime/30"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-secondary/30">
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10 bg-lime text-foreground text-xs font-bold px-3 py-1.5 rounded-squircle">
                    {product.badge}
                  </div>
                )}
                {/* Wishlist Button */}
                <div className="absolute top-4 right-4 z-10">
                  <WishlistButton product={product} size="sm" />
                </div>
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>
                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                  <Button
                    variant="lime"
                    size="lg"
                    className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title & Description */}
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-foreground">
                      ₹{product.price}
                    </span>
                  </div>
                  <Link to={`/product/${product.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/products/sweeteners">
            <Button variant="default" size="lg">
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
