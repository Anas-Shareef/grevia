import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Product } from "@/types";

const ProductsSection = () => {
  const { addToCart } = useCart();

  const products = [
    {
      id: 1,
      title: "Grevia Stevia Jar",
      price: 499,
      description: "Premium stevia in elegant glass jar",
      rating: 4.9,
      reviews: 128,
      badge: "Best Seller",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
    },
    {
      id: 2,
      title: "Grevia Stevia Powder",
      price: 349,
      description: "Organic stevia in eco-friendly pouch",
      rating: 4.8,
      reviews: 96,
      badge: "New",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
    },
    {
      id: 3,
      title: "Grevia Monkfruit Drops",
      price: 299,
      description: "Liquid sweetener for beverages",
      rating: 4.7,
      reviews: 74,
      badge: null,
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
    },
  ];

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart({
      id: String(product.id),
      name: product.title,
      price: product.price,
      image: product.image,
    } as Product, 1);
    toast.success(`${product.title} added to cart!`);
  };

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
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-squircle-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-lime/30"
            >
              {/* Image Area */}
              <div className="relative aspect-square overflow-hidden bg-secondary/30">
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10 bg-lime text-foreground eyebrow !tracking-widest !text-[10px] px-3 py-1.5 shadow-sm">
                    {product.badge}
                  </div>
                )}

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Hover Overlay with Add to Cart */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="inline-flex items-center justify-center gap-2 bg-lime text-foreground hover:bg-lime-glow rounded-squircle shadow-glow hover:shadow-lg hover:-translate-y-0.5 font-extrabold h-14 px-8 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-lime text-lime" />
                    <span className="text-sm font-bold text-foreground">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>

                {/* Price & View Details */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-foreground">
                      ₹{product.price}
                    </span>
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="inline-flex items-center justify-center text-sm font-bold border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-squircle h-9 px-4 transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.article>
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
