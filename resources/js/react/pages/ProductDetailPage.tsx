import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ArrowLeft, Minus, Plus, Check, ShieldCheck, Truck, RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import ImageZoom from "@/components/ImageZoom";
import WishlistButton from "@/components/WishlistButton";
import ReviewsSection from "@/components/ReviewsSection";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [selectedPackSize, setSelectedPackSize] = useState<number | null>(null);

  const { data: product, isLoading: isProductLoading } = useProduct(id || "");
  const { data: allProducts } = useProducts();

  // Auto-select default variant
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      // Find cheapest active variant
      const cheapest = [...product.variants]
        .filter(v => v.status === 'active')
        .sort((a, b) => Number(a.discount_price || a.price) - Number(b.discount_price || b.price))[0];

      if (cheapest) {
        setSelectedWeight(cheapest.weight);
        setSelectedPackSize(cheapest.pack_size);

        // Use variant image if it exists, otherwise use product main image
        if (cheapest.image_url) {
          setSelectedImage(cheapest.image_url);
        } else if (product.mainImage?.url) {
          setSelectedImage(product.mainImage.url);
        }
      }
    } else if (product?.mainImage?.url) {
      setSelectedImage(product.mainImage.url);
    }
  }, [product]);

  // Handle image switching when variant changes
  useEffect(() => {
    if (product?.variants && selectedWeight && selectedPackSize) {
      const variant = product.variants.find(
        v => v.weight === selectedWeight && v.pack_size === selectedPackSize
      );

      if (variant) {
        // If this variant has a gallery, show the main photo
        const mainPhoto = variant.gallery?.find(img => img.is_main) || variant.gallery?.[0];
        if (mainPhoto) {
          setSelectedImage(mainPhoto.url);
        } else if (variant.image_url) {
          // Fallback to single image_path
          setSelectedImage(variant.image_url);
        }
      }
    }
  }, [selectedWeight, selectedPackSize, product]);

  const currentVariant = product?.variants?.find(v =>
    v.weight === selectedWeight && v.pack_size === selectedPackSize
  );

  const displayPrice = currentVariant
    ? Number(currentVariant.discount_price || currentVariant.price)
    : product?.price;

  const displayOriginalPrice = currentVariant?.discount_price
    ? Number(currentVariant.price)
    : product?.originalPrice;

  const isInStock = currentVariant
    ? currentVariant.stock_quantity > 0
    : product?.inStock;

  const relatedProducts = product && allProducts
    ? (Array.isArray(allProducts) ? allProducts : allProducts?.data || []).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
    : [];

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, currentVariant?.id);
      toast.success(`${product.name}${currentVariant ? ` (${currentVariant.weight}, Pack of ${currentVariant.pack_size})` : ''} added to cart!`, {
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/30 whitespace-nowrap overflow-x-auto no-scrollbar py-2">
              <Link to="/" className="hover:text-lime transition-colors">Home</Link>
              <span>/</span>
              <Link to="/collections" className="hover:text-lime transition-colors">Collections</Link>
              {product.category && (
                <>
                  <span>/</span>
                  <Link 
                    to={`/collections/${typeof product.category === 'string' ? product.category : product.category.slug}`}
                    className="hover:text-lime transition-colors"
                  >
                    {typeof product.category === 'string' 
                      ? product.category 
                      : product.category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-white border-b border-lime/50 pb-0.5">{product.name}</span>
            </div>
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

              {/* Thumbnail Strip — shows variant gallery or product gallery */}
              {(() => {
                const variantGallery = currentVariant?.gallery && currentVariant.gallery.length > 0
                  ? currentVariant.gallery
                  : null;
                const productGallery = product.gallery && product.gallery.length > 0
                  ? product.gallery
                  : null;
                const thumbs = variantGallery || productGallery;

                if (!thumbs) return null;

                return (
                  <div className="flex gap-3 overflow-x-auto pb-2 mt-4">
                    {thumbs.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(img.url)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.url
                          ? 'border-lime shadow-md opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-90 hover:border-lime/50'
                          }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {img.is_main && (
                          <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-lime/80 text-white py-0.5">Main</span>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })()}

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
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
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

              {/* Variant Selectors */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-8 mb-10">
                  {/* Strength Ratio Selector - DUAL LABEL */}
                  {(() => {
                    const baseName = product.name.split('1:')[0].trim();
                    const siblings = (Array.isArray(allProducts) ? allProducts : allProducts?.data || [])
                      .filter(p => p.name.startsWith(baseName));

                    if (siblings.length < 2) return null;

                    return (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Concentration Strength</h3>
                          <button className="text-[10px] font-black text-[#97c459] uppercase underline tracking-widest flex items-center gap-1 hover:text-white transition-colors">
                            <Info className="w-3 h-3" /> Strength Guide
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {siblings.sort((a,b) => (a.ratio || '') === '1:10' ? -1 : 1).map((sib: Product) => {
                            const isCurrent = sib.id === product.id || sib.slug === product.slug;
                            const isMild = sib.ratio === '1:10';
                            return (
                              <Link
                                key={sib.id}
                                to={`/product/${sib.slug}`}
                                className={`flex flex-col items-start p-5 rounded-[24px] border-2 transition-all duration-500 group relative overflow-hidden ${
                                  isCurrent 
                                  ? "border-[#97c459] bg-[#97c459]/10" 
                                  : "border-white/5 bg-white/[0.02] hover:border-white/20"
                                }`}
                              >
                                {isCurrent && <div className="absolute top-0 right-0 w-12 h-12 bg-[#97c459]/20 blur-xl" />}
                                <span className={`text-lg font-black ${isCurrent ? "text-white" : "text-white/30 group-hover:text-white"}`}>
                                  {sib.ratio || (isMild ? "1:10" : "1:50")}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isCurrent ? "text-[#97c459]" : "text-white/10"}`}>
                                  {isMild ? "Mild - Everyday" : "Intense - Baking"}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Weight Selector - DUAL LABEL */}
                  <div>
                    <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Select Pack Size</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(product.variants && product.variants.length > 0 ? product.variants : [{id: 'base', weight: product.size_label || '50g', price: product.price}])
                        .map(v => {
                          const isSelected = selectedWeight === v.weight || product.size_label === v.weight;
                          return (
                            <button
                              key={v.id}
                              onClick={() => setSelectedWeight(v.weight)}
                              className={`flex flex-col items-start p-5 rounded-[24px] border-2 transition-all duration-500 text-left relative overflow-hidden ${
                                isSelected 
                                ? "border-[#97c459] bg-[#97c459]/10" 
                                : "border-white/5 bg-white/[0.02] hover:border-white/20"
                              }`}
                            >
                              <div className="flex justify-between w-full mb-1">
                                <span className={`text-lg font-black ${isSelected ? "text-white" : "text-white/30"}`}>
                                    {v.weight}
                                </span>
                                {isSelected && <Check className="w-5 h-5 text-[#97c459]" />}
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? "text-[#97c459]" : "text-white/10"}`}>
                                ₹{v.discount_price || v.price} / unit
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* Price Row */}
              <div className="flex items-center justify-between mb-10 pb-10 border-b border-white/5">
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-4">
                        <span className="text-6xl font-black text-white tracking-tighter">
                            ₹{displayPrice}
                        </span>
                        {displayOriginalPrice && displayOriginalPrice > (displayPrice || 0) && (
                            <span className="text-2xl text-white/20 line-through font-bold">
                            ₹{displayOriginalPrice}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="w-2 h-2 rounded-full bg-[#97c459] animate-pulse" />
                        <p className="text-[10px] font-black text-[#97c459] uppercase tracking-[0.2em]">Ships within 24 hours</p>
                    </div>
                </div>

                <div className="flex items-center p-2 bg-white/[0.03] rounded-3xl border border-white/5">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/50 hover:text-white"
                    >
                        <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-14 text-center font-black text-2xl text-white">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/50 hover:text-white"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 mb-12">
                <Button
                  variant="lime"
                  className="flex-[2] h-20 text-xl font-black rounded-3xl shadow-2xl shadow-lime/10 group overflow-hidden relative"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <ShoppingCart className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  {isInStock ? 'ADD TO BASKET' : 'OUT OF STOCK'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-20 text-lg font-black rounded-3xl border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
                  onClick={() => {
                    handleAddToCart();
                    setIsCartOpen(true);
                  }}
                >
                  BUY NOW
                </Button>
              </div>

              {/* Educational Guide Box (Dynamic Content) */}
              <div className="bg-[#0f1a0f] border border-[#2d7a3a33] rounded-[40px] p-10 mb-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#97c459] opacity-[0.03] blur-[100px]" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-[#97c459]/10 border border-[#97c459]/20 flex items-center justify-center text-[#97c459]">
                            <Info className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">Strength Guide</h3>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Educational Reference</p>
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        <div className={`transition-all duration-700 ${product.ratio === '1:10' ? 'opacity-100 translate-x-0' : 'opacity-30 scale-95'}`}>
                            <div className="flex gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-colors ${product.ratio === '1:10' ? 'bg-[#97c459] border-[#97c459] text-black shadow-xl shadow-[#97c459]/20' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                    <span className="font-black text-lg">1:10</span>
                                </div>
                                <div>
                                    <h4 className={`font-black uppercase tracking-widest mb-1 ${product.ratio === '1:10' ? 'text-white' : 'text-white/20'}`}>Mild Intensity</h4>
                                    <p className={`text-sm leading-relaxed italic ${product.ratio === '1:10' ? 'text-white/60' : 'text-white/10'}`}>
                                        Perfect for daily use. 1 gram replaces 10 grams of table sugar. No bitter aftertaste.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`transition-all duration-700 ${product.ratio === '1:50' ? 'opacity-100 translate-x-0' : 'opacity-30 scale-95'}`}>
                            <div className="flex gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-colors ${product.ratio === '1:50' ? 'bg-[#97c459] border-[#97c459] text-black shadow-xl shadow-[#97c459]/20' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                    <span className="font-black text-lg">1:50</span>
                                </div>
                                <div>
                                    <h4 className={`font-black uppercase tracking-widest mb-1 ${product.ratio === '1:50' ? 'text-white' : 'text-white/20'}`}>Professional Intensity</h4>
                                    <p className={`text-sm leading-relaxed italic ${product.ratio === '1:50' ? 'text-white/60' : 'text-white/10'}`}>
                                        Specially designed for baking & large scale use. 1 gram replaces 50 grams of sugar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="space-y-6 mb-16">
                  <div className="flex items-center gap-3">
                      <span className="h-[1px] w-6 bg-white/10" />
                      <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Pure Analytics</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                          { label: "Active Base", value: (product as any).type === 'stevia' ? "Stevia Extract" : "Monk Fruit" },
                          { label: "Physical Form", value: (product as any).form === 'drops' ? "Liquid Essence" : "Fine Powder" },
                          { label: "GI Index", value: "Absolute Zero (0)" },
                          { label: "Net Weight", value: (product as any).size_label || "50 Grams" },
                          { label: "Serving Size", value: "0.1g - 0.5g" },
                          { label: "Ideal For", value: (product as any).use_case || "Beverages" }
                      ].map((spec, i) => (
                          <div key={i} className="flex flex-col p-5 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 group-hover:text-[#97c459] transition-colors">{spec.label}</span>
                              <span className="text-xs font-black text-white/80">{spec.value}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Description Tabs */}
              <Tabs defaultValue="details" className="w-full">
                  <TabsList className="w-full h-12 bg-white/2 border border-white/5 p-1 rounded-2xl mb-8">
                      <TabsTrigger value="details" className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white/10 data-[state=active]:text-lime transition-all">Description</TabsTrigger>
                      <TabsTrigger value="ingredients" className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white/10 data-[state=active]:text-lime transition-all">Ingredients</TabsTrigger>
                      <TabsTrigger value="how-to-use" className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white/10 data-[state=active]:text-lime transition-all">How to Use</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-0">
                      <div className="text-white/60 text-base leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                  </TabsContent>
                  <TabsContent value="ingredients" className="mt-0">
                        <div className="grid grid-cols-2 gap-3">
                            {product.ingredients.map((ing, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/2 border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-lime shadow-[0_0_10px_rgba(163,230,53,0.5)]" />
                                    <span className="text-sm font-bold text-white/70">{ing}</span>
                                </div>
                            ))}
                        </div>
                  </TabsContent>
                  <TabsContent value="how-to-use" className="mt-0">
                      <p className="text-white/60 leading-relaxed italic">
                        {product.name.includes("1:50") 
                          ? "This is a concentrated extract. Start with a tiny pinch (0.1g) as it is 50x sweeter than sugar. Ideal for baking and large batches of desserts."
                          : "Use 1 gram of Grevia for every 10 grams of table sugar. Perfectly dissolves in hot and cold beverages alike."}
                      </p>
                  </TabsContent>
              </Tabs>

              {/* Wishlist Button with Label */}
              <div className="mt-4">
                <WishlistButton product={product} showLabel />
              </div>

              {/* Stock Status */}
              <div className="mt-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isInStock ? 'bg-lime' : 'bg-destructive'}`} />
                <span className="text-sm text-muted-foreground">
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {currentVariant && currentVariant.stock_quantity < 10 && currentVariant.stock_quantity > 0 && (
                  <span className="text-xs font-bold text-orange-500 ml-2">
                    Only {currentVariant.stock_quantity} left!
                  </span>
                )}
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
