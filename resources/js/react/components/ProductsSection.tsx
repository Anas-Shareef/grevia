import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState } from "react";

const ProductsSection = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<number[]>([]);

  const products = [
    {
      id: 1,
      title: "Pure Stevia Jar",
      price: 499,
      description: "Premium stevia in elegant glass jar",
      rating: 4.9,
      reviews: 128,
      badge: "Best Seller",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
    },
    {
      id: 2,
      title: "Stevia Powder Pack",
      price: 349,
      description: "Organic stevia in eco-friendly pouch",
      rating: 4.8,
      reviews: 96,
      badge: "New",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
    },
    {
      id: 3,
      title: "Monkfruit Drops",
      price: 299,
      description: "Liquid sweetener for beverages",
      rating: 4.7,
      reviews: 74,
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
    }
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.title} added to cart!`);
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    toast.success(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <section id="products" className="py-24 md:py-40 relative bg-white overflow-hidden" aria-labelledby="products-heading">
      
      {/* Structural Airiness */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#fdfcf6]/50 -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-24"
        >
          <span className="inline-block text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-4">Our Collection</span>
          <h2 id="products-heading" className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight mb-8">
            Premium<br />
            <span className="text-primary font-bold">Sweeteners</span>
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed font-medium">
            Discover our range of pure, natural sweeteners crafted for the health-conscious.
          </p>
        </motion.div>

        {/* Product Grid - 3 Columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {products.map((product, index) => (
            <motion.article 
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group flex flex-col bg-white rounded-[48px] shadow-[0_8px_30px_rgba(46,125,50,0.04)] hover:shadow-[0_20px_50px_rgba(46,125,50,0.12)] hover:-translate-y-2 transition-all duration-700 border border-primary/5 overflow-hidden"
            >
              {/* Product Image Section */}
              <div className="relative aspect-square overflow-hidden bg-[#F5F2EA]">
                {/* Reference Pill Badge */}
                {product.badge && (
                  <div className="absolute top-6 left-6 z-10 bg-primary/10 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-primary/10">
                    {product.badge}
                  </div>
                )}

                {/* Wishlist Heart Button */}
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-6 right-6 z-10 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-foreground/40"}`} />
                </button>

                {/* Product Image with high-fidelity scaling */}
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 scale-110" 
                />
                
                {/* Hover Add to Cart Overlay */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-14 h-14 bg-white text-primary rounded-full shadow-2xl flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-primary hover:text-white"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 md:p-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-foreground">{product.rating}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground/30">({product.reviews} reviews)</span>
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm md:text-base font-medium text-foreground/50 mb-8 flex-1 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                  <span className="text-2xl md:text-3xl font-black text-foreground">₹{product.price}</span>
                  <Link 
                    to={`/products/${product.id}`}
                    className="inline-flex items-center justify-center h-12 px-6 border-2 border-primary/10 text-primary text-xs font-bold rounded-full hover:border-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center mt-20">
          <Link 
            to="/collections/all"
            className="inline-flex items-center justify-center h-14 px-10 bg-primary/5 text-primary text-sm font-black rounded-full hover:bg-primary hover:text-white transition-all duration-300"
          >
            Explore Full Collection
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ProductsSection;
