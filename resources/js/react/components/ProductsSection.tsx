import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";

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
  const { data: response } = useProducts({ category: 'sweeteners', featured: '1' });

  // Handle both array response (old) and paginated response (new)
  const allProducts = Array.isArray(response) ? response : response?.data || [];

  // Get first 6 featured products for homepage
  const displayProducts = allProducts.slice(0, 6);

  return (
    <section
      id="products"
      className="py-24 md:py-32 bg-page relative overflow-hidden"
      aria-labelledby="products-heading"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 bg-secondary px-4 py-2 rounded-full"
          >
            Curated For Wellness
          </motion.span>
          <h2
            id="products-heading"
            className="text-4xl md:text-5xl lg:text-7xl font-black text-primary leading-[1] mb-6 tracking-tighter"
          >
            Natural <span className="text-accent-green">Collection</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto font-medium">
            Explore our range of premium, plant-based sweeteners designed for a balanced and healthy lifestyle.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link to="/collections">
            <Button className="bg-primary hover:bg-primary/95 text-white rounded-2xl px-12 py-8 text-lg font-black uppercase tracking-widest shadow-button transition-transform hover:scale-105 active:scale-95">
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
