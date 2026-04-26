import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";

const ProductsSection = () => {
  const { data: response, isLoading } = useProducts({
    featured: '1',
    sort_by: 'newest',
    per_page: '6'
  });

  const products = response?.data || [];

  if (isLoading) {
    return (
      <section id="products" className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Only show section if there are featured products
  if (products.length === 0) return null;

  return (
    <section
      id="products"
      className="py-24 md:py-32 relative overflow-hidden"
      aria-labelledby="products-heading"
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="eyebrow mb-4 !text-lime">
            Our Collection
          </span>
          <h2
            id="products-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6"
          >
            Premium
            <br />
            <span className="text-primary">Sweeteners</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover our range of pure, natural sweeteners crafted for the
            health-conscious.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Products CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/collections/all"
            className="inline-flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-squircle shadow-button hover:shadow-lg hover:-translate-y-0.5 h-14 px-8 transition-all duration-300"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;

