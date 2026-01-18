import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState } from "react";
import ImageZoom from "@/components/ImageZoom";
import WishlistButton from "@/components/WishlistButton";
import ReviewsSection from "@/components/ReviewsSection";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: product, isLoading: isProductLoading } = useProduct(id || "");
  const { data: allProducts } = useProducts();

  const relatedProducts = product && allProducts
    ? (Array.isArray(allProducts) ? allProducts : allProducts?.data || []).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
    : [];

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`, {
        duration: 2000,
      });
    }
  };

  if (isProductLoading) {
    return <div className="min-h-screen bg-background pt-24 text-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-black mb-4">Product not found</h1>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to={`/products/${product.category}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
          </motion.div>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            {/* Image Gallery with Zoom */}
            {/* Image Gallery with Zoom */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="mb-4">
                <ImageZoom
                  src={selectedImage || product.mainImage?.url || product.image || 'https://placehold.co/600x600/e3f2e1/2d5016?text=No+Image'}
                  alt={product.name}
                  badge={product.badge}
                />
              </div>

              {/* Thumbnail Strip */}
              {(product.gallery && product.gallery.length > 0) ? (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.gallery.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${(selectedImage === img.url || (!selectedImage && img.is_main))
                        ? "border-lime shadow-md opacity-100"
                        : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              {/* Wishlist Button - Positioned on image */}
              <div className="absolute top-4 right-4 z-10">
                <WishlistButton product={product} size="lg" />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Rating */}
              {product.reviews > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating)
                          ? "fill-lime text-lime"
                          : "text-muted-foreground/30"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {product.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
                {product.name}
              </h1>

              {/* Description */}
              <div
                className="text-lg text-muted-foreground mb-6 leading-relaxed prose prose-lime dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.longDescription }}
              />

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3">
                  Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 text-sm bg-secondary/50 text-foreground px-3 py-1.5 rounded-squircle"
                    >
                      <Check className="w-3 h-3 text-lime" />
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-foreground">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Inclusive of all taxes</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-bold text-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-squircle bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-squircle bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="limeLg"
                  size="xl"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="flex-1"
                  onClick={() => {
                    handleAddToCart();
                    setIsCartOpen(true);
                  }}
                >
                  Buy Now
                </Button>
              </div>

              {/* Wishlist Button with Label */}
              <div className="mt-4">
                <WishlistButton product={product} showLabel />
              </div>

              {/* Stock Status */}
              <div className="mt-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-lime' : 'bg-destructive'}`} />
                <span className="text-sm text-muted-foreground">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          {product.dbId && <ReviewsSection productId={product.dbId} />}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-black text-foreground mb-8">You May Also Like</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                    className="group bg-card rounded-squircle-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-lime/30 relative"
                  >
                    <div className="absolute top-3 right-3 z-10">
                      <WishlistButton product={relatedProduct} size="sm" />
                    </div>
                    <div className="aspect-square overflow-hidden bg-secondary/30">
                      <img
                        src={relatedProduct.image || 'https://placehold.co/400x400/e3f2e1/2d5016?text=No+Image'}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-black text-foreground mt-1">
                        ₹{relatedProduct.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
