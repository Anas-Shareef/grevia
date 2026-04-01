import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";

const BeyondSweetenersSection = () => {
  const { data: response } = useProducts({ category: 'other-products', featured: '1' });
  const allProducts = Array.isArray(response) ? response : response?.data || [];

  if (!allProducts || allProducts.length === 0) return null;

  return (
    <section id="beyond-sweeteners" className="products-section bg-[var(--bg-white)] border-t border-[var(--border-light)]">
      <div className="container">
        {/* Step 9: Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Explore More</span>
          <h2 className="section-title">Beyond <br /> Sweeteners</h2>
          <p className="section-subtitle">
            Crafted with the same care, purity, and health-first philosophy — from bakery to traditional foods. Explore our extended range.
          </p>
        </div>

        {/* Step 10: Products Grid */}
        <div className="products-grid">
          {allProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <Link to="/collections">
            <button className="btn-secondary px-12 py-4">
              Browse More Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BeyondSweetenersSection;
