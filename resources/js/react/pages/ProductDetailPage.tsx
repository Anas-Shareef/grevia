import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Heart, Check, Truck, RotateCcw, Info, ChevronRight, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import ReviewsSection from "@/components/ReviewsSection";
import { ProductCard } from "@/components/ProductCard";

// Ratio guides from previous implementation
const RATIO_GUIDES: Record<string, { one_line: string; detail: string }> = {
  '1:10': {
    one_line: '1g replaces 10g of sugar. Mild sweetness, great for everyday drinks.',
    detail:   '1:10 means 1g of Grevia Stevia replaces 10g of sugar. Great for tea, coffee, and smoothies. For baking with large quantities, try 1:50.',
  },
  '1:50': {
    one_line: '1g replaces 50g of sugar. Very concentrated — use just a pinch.',
    detail:   '1:50 means 1g of Grevia replaces 50g of sugar. Ideal for large-batch baking and cooking where you need very little sweetener.',
  },
};

function getPriceForSize(basePrice: number, baseSize: string, targetSize: string): number {
  if (baseSize === targetSize) return basePrice;
  if (baseSize === '50g' && targetSize === '100g') return Math.round(basePrice * 1.67);
  if (baseSize === '100g' && targetSize === '50g') return Math.round(basePrice * 0.6);
  return basePrice;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const { data: product, isLoading } = useProduct(id || "");
  const { data: allProductsResponse } = useProducts();
  const allProducts: Product[] = Array.isArray(allProductsResponse)
    ? allProductsResponse
    : (allProductsResponse as any)?.data || [];

  const [selectedRatio, setSelectedRatio] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('50g');
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'how' | 'reviews'>('details');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      if (product.ratio) setSelectedRatio(product.ratio);
      if (product.size_label) setSelectedSize(product.size_label);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-page)] min-h-screen">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-8 w-48 rounded-[20px] bg-white" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square rounded-[40px] bg-white" />
              <div className="space-y-6">
                <div className="h-12 rounded-[20px] bg-white w-3/4" />
                <div className="h-20 rounded-[20px] bg-white w-full" />
                <div className="h-24 rounded-[20px] bg-white w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[var(--bg-page)] min-h-screen">
        <Header />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-5xl mb-4">🍃</p>
          <h2 className="text-xl font-bold mb-4">Product not found</h2>
          <Link to="/collections/all" className="btn-primary inline-flex">Browse All Collections</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isMonk = product.type === 'monk-fruit';
  const imageBgClass = isMonk ? 'monk-bg' : 'stevia-bg';
  const ratioGuide = RATIO_GUIDES[selectedRatio] || RATIO_GUIDES['1:10'];
  const displayPrice = getPriceForSize(product.price, product.size_label || '50g', selectedSize);
  const wishlisted = isInWishlist(String(product.id));

  // Gallery images logic
  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery.map(g => g.url)
    : [product.image, product.image, product.image].filter(Boolean);
  const mainImageUrl = galleryImages[selectedThumb] || product.image;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product, 1, product.variants?.[0]?.id);
    toast.success(`${product.name} Added!`, { duration: 2000, icon: <ShoppingCart className="w-4 h-4 text-[var(--green-primary)]" /> });
  };

  const toggleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(String(product.id));
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist ❤️');
    }
  };

  const specs = [
    { label: 'Type', value: isMonk ? 'Monk Fruit' : 'Stevia' },
    { label: 'Ratio', value: selectedRatio || 'N/A' },
    { label: 'Size', value: selectedSize },
    { label: 'Calories', value: '0 kcal' },
    { label: 'Sweetness', value: isMonk ? '250x Sugar' : '300x Sugar' },
    { label: 'Shelf Life', value: '18 Months' },
  ];

  return (
    <div className="bg-[var(--bg-page)] min-h-screen">
      <Header />

      <main className="container pt-24 md:pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="text-xs transition-colors text-[var(--text-muted)] hover:text-[var(--green-primary)]">Home</Link>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          <Link to="/collections/all" className="text-xs transition-colors text-[var(--text-muted)] hover:text-[var(--green-primary)]">Collections</Link>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          <span className="text-xs font-bold text-[var(--text-heading)]">{product.name}</span>
        </nav>

        {/* 2-Column Product Detail Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          
          {/* Left: Product Images */}
          <div className="flex flex-col gap-4">
            <div className={`aspect-square rounded-[40px] flex items-center justify-center p-12 relative overflow-hidden ${imageBgClass}`}>
              {product.badge && <div className="product-badge top-6 left-6">{product.badge}</div>}
              <button 
                onClick={toggleWishlist}
                className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft border border-[var(--border-light)] z-10 transition-transform active:scale-90"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-[var(--text-muted)]'}`} />
              </button>
              <motion.img 
                key={mainImageUrl}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={mainImageUrl} 
                alt={product.name} 
                className="max-h-full max-w-full relative z-0"
              />
            </div>
            
            <div className="flex gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedThumb(idx)}
                  className={`w-24 h-24 rounded-2xl border-2 transition-all overflow-hidden flex items-center justify-center p-2 bg-white group ${selectedThumb === idx ? 'border-[var(--green-primary)]' : 'border-transparent hover:border-[var(--border-light)]'}`}
                >
                  <img src={img} alt="" className="max-w-full max-h-full transition-transform group-hover:scale-110" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="eyebrow-badge mb-6 self-start">
              <span className="dot" />
              100% Natural Choice
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-sm font-bold">{product.rating.toFixed(1)} / 5.0</span>
              <span className="text-sm text-[var(--text-muted)]">({product.reviews_count} reviews)</span>
            </div>

            <p className="text-lg text-[var(--text-muted)] font-medium mb-8 leading-relaxed">
              {product.description || "Experience the pure taste of nature with Grevia's premium sweetener. Zero calories, zero insulin spike, and zero bitter aftertaste."}
            </p>

            {/* Ratio Select */}
            <div className="mb-8">
              <label className="text-[10px] font-black uppercase tracking-widest mb-4 block opacity-50">Strength Ratio</label>
              <div className="size-pills">
                {['1:10', '1:50'].map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRatio(r)}
                    className={`size-pill !px-6 !py-3 ${selectedRatio === r ? 'active' : ''}`}
                  >
                    {r} {r === '1:10' ? '(Medium)' : '(Extra)'}
                  </button>
                ))}
              </div>
              <div className="mt-4 p-5 rounded-3xl bg-[var(--green-pale)] border border-[var(--green-mint)]/30 flex gap-4">
                <Info className="w-5 h-5 text-[var(--green-primary)] flex-shrink-0" />
                <p className="text-xs font-bold text-[var(--green-primary)] leading-relaxed">
                  {ratioGuide.detail}
                </p>
              </div>
            </div>

            {/* Size Select */}
            <div className="mb-10">
              <label className="text-[10px] font-black uppercase tracking-widest mb-4 block opacity-50">Choose Size</label>
              <div className="grid grid-cols-2 gap-4">
                {['50g', '100g'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`size-pill !py-4 !block !w-full ${selectedSize === s ? 'active' : ''}`}
                  >
                    {s} Pack
                    {s === '100g' && <span className="block text-[9px] text-[var(--green-primary)] mt-1">Best Value</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer / ATC */}
            <div className="flex items-center gap-6 mt-auto pt-8 border-t border-[var(--border-light)]">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-[var(--text-heading)]">₹{displayPrice}</span>
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Inclusive of taxes</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-[var(--border-light)] shadow-soft">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:text-[var(--green-primary)] transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:text-[var(--green-primary)] transition-colors"><Plus className="w-4 h-4" /></button>
              </div>

              <button onClick={handleAddToCart} className="btn-primary flex-1 !py-4 flex items-center justify-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
            
            <div className="flex gap-6 mt-8">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--green-primary)]" />
                <span className="text-xs font-bold text-[var(--text-muted)]">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[var(--green-primary)]" />
                <span className="text-xs font-bold text-[var(--text-muted)]">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Tabs */}
        <div className="pt-12 border-t border-[var(--border-light)]">
          <div className="flex gap-8 mb-10 overflow-x-auto pb-2">
            {['details', 'nutrition', 'how', 'reviews'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all pb-3 border-b-2 ${activeTab === t ? 'text-[var(--green-primary)] border-[var(--green-primary)]' : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-heading)]'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'details' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {specs.map(s => (
                      <div key={s.label} className="benefit-card !p-6 !mb-0 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">{s.label}</p>
                        <p className="text-sm font-black text-[var(--text-heading)]">{s.value}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'nutrition' && (
                  <div className="max-w-md bg-white rounded-[40px] border border-[var(--border-light)] p-8 shadow-soft">
                    <h3 className="text-xl font-bold mb-6">Nutrition Facts</h3>
                    <div className="space-y-4">
                      {[
                        { l: "Calories", v: "0 kcal" },
                        { l: "Total Carbohydrates", v: "0.5g" },
                        { l: "Dietary Fiber", v: "0.3g" },
                        { l: "Protein", v: "0g" },
                        { l: "Sodium", v: "0mg" }
                      ].map(row => (
                        <div key={row.l} className="flex justify-between items-center py-3 border-b border-[var(--bg-page)]">
                          <span className="font-medium text-[var(--text-muted)]">{row.l}</span>
                          <span className="font-black">{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'how' && (
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <h3 className="text-2xl font-bold">Recommended Usage</h3>
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-[var(--green-mint)] flex items-center justify-center font-black text-[var(--green-primary)] flex-shrink-0">1</div>
                          <p className="text-[var(--text-muted)] font-medium leading-relaxed">Start small. Grevia is much sweeter than sugar, so a pinch is often enough for a cup of tea or coffee.</p>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-[var(--green-mint)] flex items-center justify-center font-black text-[var(--green-primary)] flex-shrink-0">2</div>
                          <p className="text-[var(--text-muted)] font-medium leading-relaxed">For baking, use our 1:50 ratio for large batches and 1:10 for smaller recipes like cookies.</p>
                        </div>
                      </div>
                    </div>
                    <div className="aspect-video rounded-[40px] bg-[var(--bg-page)] flex items-center justify-center border border-[var(--border-light)]">
                      <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Recipe Video Placeholder</span>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewsSection productId={String(product.id)} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24 pt-16 border-t border-[var(--border-light)]">
          <div className="section-header !text-left !mx-0 !max-w-none">
            <span className="section-eyebrow">You may also like</span>
            <h2 className="section-title">Complete Your Wellness Routine</h2>
          </div>
          <div className="products-grid">
            {allProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
