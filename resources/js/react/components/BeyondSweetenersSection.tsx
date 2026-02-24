import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
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

const BeyondSweetenersSection = () => {
  // Only show featured products from the "other-products" category
  const { data: response } = useProducts({ category: 'other-products', featured: '1' });

  const allProducts = Array.isArray(response) ? response : response?.data || [];

  // Hide section completely when no products
  if (!allProducts || allProducts.length === 0) return null;

  return (
    <section
      id="beyond-sweeteners"
      className="py-24 md:py-32 bg-gradient-to-b from-[#F0F7F0] to-white relative overflow-hidden"
      aria-labelledby="beyond-sweeteners-heading"
    >
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-lime/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-block text-sm font-extrabold text-lime uppercase tracking-[0.2em] mb-4 bg-lime/10 px-4 py-1.5 rounded-full">
            Explore More
          </span>
          <h2
            id="beyond-sweeteners-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6"
          >
            Beyond
            <br />
            <span className="text-primary italic">Sweeteners</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Crafted with the same care, purity, and health-first philosophy — from bakery to traditional foods.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {allProducts.map((product) => {
            // product.image is already a full processed URL from useProducts transformProduct
            const imageUrl = product.image || product.mainImage?.url || '';

            // Price logic
            const cheapestVariant = product.variants && product.variants.length > 0
              ? [...product.variants]
                .filter((v: any) => v.status === 'active')
                .sort((a: any, b: any) =>
                  Number(a.discount_price || a.price) - Number(b.discount_price || b.price)
                )[0]
              : null;

            const displayPrice = cheapestVariant
              ? cheapestVariant.discount_price || cheapestVariant.price
              : product.price;

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group bg-card rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-border/40 hover:border-primary/30 hover:-translate-y-1"
              >
                <Link to={`/product/${product.slug || product.id}`}>
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary/30 text-5xl font-black">{product.name[0]}</span>
                      </div>
                    )}
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-lime text-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-primary">
                        ₹{typeof displayPrice === 'number'
                          ? displayPrice.toFixed(0)
                          : Number(displayPrice || 0).toFixed(0)}
                      </span>
                      {cheapestVariant && (
                        <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-full">
                          {cheapestVariant.weight}
                        </span>
                      )}
                    </div>

                    <div className="inline-flex items-center text-primary font-bold text-sm group/btn border border-primary/30 px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                      Explore Product
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* All Products CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link to="/products/other-products">
            <Button variant="default" size="lg" className="px-10 py-6 text-base font-bold rounded-full shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300">
              All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BeyondSweetenersSection;
