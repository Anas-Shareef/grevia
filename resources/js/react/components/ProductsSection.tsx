import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";

const ProductsSection = () => {
  const { data: response } = useProducts({ category: 'sweeteners', featured: '1' });
  const allProducts = Array.isArray(response) ? response : response?.data || [];
  const displayProducts = allProducts.slice(0, 8);

  return (
    <section id="products" className="py-24 md:py-32 bg-[var(--bg-page)] relative overflow-hidden">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-reveal">
          <span className="text-[var(--green-primary)] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Curated Collections</span>
          <h2 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-[1.1] mb-6">
            Premium <br /> Collections
          </h2>
          <p className="text-[var(--text-muted)] text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Discover our range of meticulously crafted natural sweeteners for a healthier, sweeter lifestyle.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {displayProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-20">
          <Link to="/collections/all">
            <button className="btn-secondary px-12 py-5 text-[11px]">
              View All Products
            </button>
          </Link>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--green-accent)]/5 blur-[120px] -z-10 rounded-full" />
    </section>
  );
};

export default ProductsSection;
