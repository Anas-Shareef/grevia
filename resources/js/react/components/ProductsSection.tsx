import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";

const ProductsSection = () => {
  const { data: response } = useProducts({ category: 'sweeteners', featured: '1' });
  const allProducts = Array.isArray(response) ? response : response?.data || [];
  const displayProducts = allProducts.slice(0, 8); // Showing up to 8 products in the primary grid

  return (
    <section id="products" className="products-section bg-[var(--bg-page)]">
      <div className="container">
        {/* Step 9: Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Curated for Wellness</span>
          <h2 className="section-title">Natural <br /> Collection</h2>
          <p className="section-subtitle">
            Explore our range of premium, plant-based sweeteners designed for a balanced and healthy lifestyle. Experience pure sweetness today.
          </p>
        </div>

        {/* Step 10: Products Grid */}
        <div className="products-grid">
          {displayProducts.map((product, i) => (
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
          <Link to="/collections/all">
            <button className="btn-primary px-12 py-4">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
