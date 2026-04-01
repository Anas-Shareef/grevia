import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Heart, Check, Truck, RotateCcw, Info, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import ReviewsSection from "@/components/ReviewsSection";

// ─── Design Tokens ───
// ─── Design Tokens (Natural Premium Theme) ───
const T = {
  bgPage:    'var(--bg-page)',   /* #f4f7f1 (Creamy Mint) */
  bgCard:    '#ffffff',
  textPrimary: 'var(--text-primary)', /* #064e3b (Deep Forest) */
  textSec:    'var(--text-muted)',   /* #4b6358 */
  textMuted:  '#9ca3af',
  textGreen:  'var(--accent-bright)', /* #22c55e */
  accentGreen: 'var(--accent-bright)',
  accentDark:  'var(--primary)',      /* #064e3b */
  amber:      '#d97706',
  borderCard:  'rgba(6, 78, 59, 0.05)',
  borderActive: 'var(--primary)',
  pillInactiveBg:    'var(--bg-card)',
  pillInactiveBorder: 'var(--border)',
  pillActiveBg:      'var(--bg-mint)',
  pillActiveBorder:  'var(--primary)',
};

// Ratio explainer messages (Section 5.3)
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

// Size variant price mapping (50g → 100g price estimate)
function getPriceForSize(basePrice: number, baseSize: string, targetSize: string): number {
  if (baseSize === targetSize) return basePrice;
  if (baseSize === '50g' && targetSize === '100g') return Math.round(basePrice * 1.67);
  if (baseSize === '100g' && targetSize === '50g') return Math.round(basePrice * 0.6);
  return basePrice;
}

// Compute savings percentage between smaller and larger size
function savingsPercent(price50: number, price100: number): number {
  const expectedDouble = price50 * 2;
  if (price100 >= expectedDouble) return 0;
  return Math.round(((expectedDouble - price100) / expectedDouble) * 100);
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

  // Initialize from product data
  useEffect(() => {
    if (product) {
      if (product.ratio) setSelectedRatio(product.ratio);
      if (product.size_label) setSelectedSize(product.size_label);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div style={{ background: T.bgPage, minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-8 w-48 rounded-xl" style={{ background: T.bgCard }} />
            <div className="grid grid-cols-2 gap-8">
              <div className="h-96 rounded-2xl" style={{ background: T.bgCard }} />
              <div className="space-y-4">
                <div className="h-6 rounded-xl w-3/4" style={{ background: T.bgCard }} />
                <div className="h-4 rounded-xl w-full" style={{ background: T.bgCard }} />
                <div className="h-4 rounded-xl w-2/3" style={{ background: T.bgCard }} />
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
      <div style={{ background: T.bgPage, minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-5xl mb-4">🌿</p>
          <p className="text-xl font-bold mb-2" style={{ color: T.textPrimary }}>Product not found</p>
          <Link to="/collections/all" className="text-sm underline" style={{ color: T.textGreen }}>Browse all products →</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isMonk = product.type === 'monk-fruit';
  const imageBg = isMonk ? '#faeeda' : '#eaf3de';
  const ratioGuide = RATIO_GUIDES[selectedRatio] || RATIO_GUIDES['1:10'];
  const displayPrice = getPriceForSize(product.price, product.size_label || '50g', selectedSize);
  const price100 = getPriceForSize(product.price, product.size_label || '50g', '100g');
  const price50 = getPriceForSize(product.price, product.size_label || '50g', '50g');
  const savings = savingsPercent(price50, price100);
  const wishlisted = isInWishlist(String(product.id));

  // Build gallery thumbnails
  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery.map(g => g.url)
    : product.image
    ? [product.image, product.image, product.image]
    : ['', '', ''];
  const mainImageUrl = galleryImages[selectedThumb] || product.mainImage?.url || product.image;

  // Build breadcrumbs
  const categoryData = product.category;
  const catName = typeof categoryData === 'object' && categoryData !== null
    ? categoryData.name
    : typeof categoryData === 'string'
    ? categoryData.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Natural Sweeteners';
    
  const catSlug = typeof categoryData === 'object' && categoryData !== null
    ? categoryData.slug
    : typeof categoryData === 'string'
    ? categoryData
    : 'natural-sweeteners';

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Natural Sweeteners', href: '/collections/all' },
    { label: isMonk ? 'Monk Fruit' : 'Stevia', href: `/collections/all?type=${product.type || 'stevia'}` },
    { label: catName, href: `/collections/${catSlug}` },
    { label: product.name, href: '#' },
  ];

  // "You may also like" — smart logic per Section 5.4
  const relatedProducts = (() => {
    if (product.related_products) {
      const slugs = product.related_products.split(',').map(s => s.trim()).filter(Boolean);
      return slugs.map(slug => allProducts.find(p => p.slug === slug)).filter(Boolean).slice(0, 3) as Product[];
    }
    return allProducts
      .filter(p => p.id !== product.id && (p.type === product.type || p.form !== product.form))
      .slice(0, 3);
  })();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    toast.success(`${product.name} (${selectedSize}) added to cart!`, { duration: 2000 });
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

  // Spec grid data (Section 3.6 — Details tab)
  const specs = [
    { label: 'Type', value: isMonk ? 'Monk Fruit' : 'Stevia' },
    { label: 'Ratio', value: product.ratio || 'N/A' },
    { label: 'Net weight', value: selectedSize },
    { label: 'Calories', value: '0 kcal' },
    { label: 'Ingredients', value: isMonk ? 'Monk Fruit Extract, Maltodextrin' : 'Stevia Leaf Extract, Inulin Fiber' },
    { label: 'Best before', value: '18 months from mfg.' },
  ];

  const tabs = [
    { key: 'details',   label: 'Details' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'how',       label: 'How to use' },
    { key: 'reviews',   label: 'Reviews' },
  ] as const;

  return (
    <div style={{ background: T.bgPage, minHeight: '100vh', fontFamily: "Inter, system-ui, sans-serif" }}>
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-16">

        {/* ─── § 3.1 Breadcrumb ─── */}
        <nav className="flex items-center gap-1 mb-8 flex-wrap" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: T.textMuted }} />}
              {crumb.href === '#' ? (
                <span className="text-xs" style={{ color: T.textPrimary }}>{crumb.label}</span>
              ) : (
                <Link to={crumb.href} className="text-xs transition-colors hover:underline" style={{ color: T.textMuted }}>
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* ─── § 3.2 Main 2-Column Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

          {/* LEFT — Image Area */}
          <div>
            {/* Main image container */}
            <div
              className="relative rounded-2xl overflow-hidden flex items-center justify-center mb-3"
              style={{ background: imageBg, height: 400 }}
            >
              {/* Zero calories badge */}
              <span
                className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'white', color: T.accentDark }}
              >
                Zero calories
              </span>

              {mainImageUrl && mainImageUrl.startsWith('http') ? (
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <span className="text-8xl">{isMonk ? '🍈' : product.form === 'drops' ? '💧' : '🌿'}</span>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2">
              {galleryImages.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedThumb(idx)}
                  className="w-20 h-20 rounded-xl flex items-center justify-center transition-all overflow-hidden"
                  style={{
                    background: imageBg,
                    border: `2px solid ${selectedThumb === idx ? T.borderActive : T.borderCard}`,
                  }}
                >
                  {img && img.startsWith('http') ? (
                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-2xl">{isMonk ? '🍈' : product.form === 'drops' ? '💧' : '🌿'}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="space-y-5">
            {/* Brand + category label */}
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: T.textGreen }}>
              GREVIA · {isMonk ? 'MONK FRUIT POWDER' : product.form === 'drops' ? 'STEVIA DROPS' : 'STEVIA POWDER'}
            </p>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black leading-[1] uppercase tracking-tighter" style={{ color: T.textPrimary }}>
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-lg leading-relaxed font-medium" style={{ color: T.textSec }}>
              {product.sweetness_description || (product.ratio ? `${product.ratio} means 1g replaces ${product.ratio === '1:50' ? '50g' : '10g'} of sugar.` : 'Natural, zero-calorie sweetener.')}{' '}
              Ideal for {product.use_case || 'tea, coffee, and smoothies'}.
            </p>

            {/* Star rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="w-5 h-5" style={{ color: T.amber, fill: s <= Math.round(product.rating) ? T.amber : 'transparent' }} />
                ))}
              </div>
              <span className="text-lg font-black" style={{ color: T.textPrimary }}>
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm font-medium" style={{ color: T.textSec }}>
                ({product.reviews_count || product.reviews} reviews)
              </span>
            </div>

            {/* ─── § 3.3 Strength Ratio Selector ─── */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: T.textPrimary }}>
                  Strength Ratio
                </p>
                <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                  <Info className="w-2.5 h-2.5" style={{ color: T.textPrimary }} />
                </div>
              </div>

              <div className="flex gap-4 mb-5">
                {['1:10', '1:50'].map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setSelectedRatio(ratio)}
                    className="flex-1 py-4 px-6 rounded-2xl text-center transition-all duration-300"
                    style={{
                      background: selectedRatio === ratio ? 'var(--primary)' : 'var(--bg-card)',
                      border: `1px solid ${selectedRatio === ratio ? 'var(--primary)' : 'var(--border)'}`,
                      boxShadow: selectedRatio === ratio ? 'var(--shadow-button)' : 'none',
                    }}
                  >
                    <p className="text-base font-black uppercase tracking-widest" style={{ color: selectedRatio === ratio ? 'white' : 'var(--text-primary)' }}>
                      {ratio}
                    </p>
                    <p className="text-[10px] mt-1 font-bold uppercase tracking-tighter opacity-60" style={{ color: selectedRatio === ratio ? 'white' : 'var(--text-muted)' }}>
                      {ratio === '1:10' ? 'Everyday' : 'Extra Strong'}
                    </p>
                  </button>
                ))}
              </div>

              {/* Persistent Ratio Explainer Box — updates dynamically (Section 5.3) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRatio}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 p-5 rounded-3xl"
                  style={{ background: 'var(--bg-mint)', border: '1px solid rgba(6, 78, 59, 0.05)' }}
                >
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                    <span className="text-lg">💡</span>
                  </div>
                  <p className="text-xs leading-relaxed font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {ratioGuide.detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ─── § 3.4 Size Selector ─── */}
            <div className="pt-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: T.textPrimary }}>Size</p>
              <div className="flex gap-4">
                {[
                  { size: '50g', price: price50 },
                  { size: '100g', price: price100, savings: savings > 0 ? `Save ${savings}%` : undefined },
                ].map(({ size, price, savings: sv }) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="flex-1 py-4 px-6 rounded-2xl text-center transition-all duration-300"
                    style={{
                      background: selectedSize === size ? 'var(--primary)' : 'var(--bg-card)',
                      border: `1px solid ${selectedSize === size ? 'var(--primary)' : 'var(--border)'}`,
                      boxShadow: selectedSize === size ? 'var(--shadow-button)' : 'none',
                    }}
                  >
                    <p className="text-base font-black uppercase tracking-widest" style={{ color: selectedSize === size ? 'white' : 'var(--text-primary)' }}>
                      {size} · ₹{price}
                    </p>
                    {sv && (
                      <p className="text-[10px] mt-1 font-black uppercase tracking-tighter" style={{ color: selectedSize === size ? 'white' : 'var(--accent-bright)' }}>{sv}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── § 3.5 Price + Add to Cart ─── */}
            <div className="pt-6">
              {/* Price row */}
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-black tracking-tighter" style={{ color: T.textPrimary }}>₹{displayPrice}</span>
                <span className="text-xs font-bold opacity-60" style={{ color: T.textPrimary }}>
                  {selectedSize} · ₹{(displayPrice / parseFloat(selectedSize)).toFixed(2)}/g
                </span>
                <span
                  className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest"
                  style={{ background: 'var(--bg-mint)', color: 'var(--accent-bright)', border: `1px solid rgba(34, 197, 94, 0.1)` }}
                >
                  Free shipping
                </span>
              </div>

              {/* Quantity + Add to Cart row */}
              <div className="flex gap-4">
              {/* Quantity stepper */}
              <div className="flex items-center rounded-2xl overflow-hidden bg-white shadow-soft" style={{ border: `1px solid var(--border)` }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-4 text-sm font-black transition-colors hover:bg-secondary"
                  style={{ color: T.textPrimary }}
                >−</button>
                <span className="px-4 text-base font-black" style={{ color: T.textPrimary }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-4 text-sm font-black transition-colors hover:bg-secondary"
                  style={{ color: T.textPrimary }}
                >+</button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 py-8 rounded-2xl text-base font-black uppercase tracking-widest text-white transition-all shadow-button hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'var(--primary)' }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              {/* Wishlist */}
              <button
                onClick={toggleWishlist}
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all bg-white shadow-soft border border-border"
                style={{ borderColor: wishlisted ? '#ef4444' : 'var(--border)' }}
              >
                <Heart className="w-6 h-6 transition-all duration-300" style={{ color: wishlisted ? '#ef4444' : 'var(--text-primary)', fill: wishlisted ? '#ef4444' : 'none' }} />
              </button>
            </div>

              {/* Trust badges */}
              <div className="flex gap-4 flex-wrap">
                {[
                  { icon: <Check className="w-3.5 h-3.5" />, text: 'In stock' },
                  { icon: <Truck className="w-3.5 h-3.5" />, text: 'Ships in 2 days' },
                  { icon: <RotateCcw className="w-3.5 h-3.5" />, text: '30-day returns' },
                ].map(badge => (
                  <div key={badge.text} className="flex items-center gap-1.5">
                    <span style={{ color: T.textGreen }}>{badge.icon}</span>
                    <span className="text-xs" style={{ color: T.textMuted }}>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── § 3.6 Tabs Section ─── */}
        <div className="mb-16">
          {/* Tab bar */}
          <div className="flex border-b mb-6" style={{ borderColor: T.borderCard }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-5 py-3 text-sm font-semibold transition-all"
                style={{
                  color: activeTab === tab.key ? T.textGreen : T.textMuted,
                  borderBottom: `2px solid ${activeTab === tab.key ? T.textGreen : 'transparent'}`,
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Details Tab — 2×3 Spec Grid */}
              {activeTab === 'details' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {specs.map(spec => (
                    <div
                      key={spec.label}
                      className="rounded-xl p-4"
                      style={{ background: T.bgCard, border: `1px solid ${T.borderCard}` }}
                    >
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: T.textMuted }}>
                        {spec.label}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: T.textPrimary }}>{spec.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Nutrition Tab */}
              {activeTab === 'nutrition' && (
                <div className="max-w-sm rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.borderCard}` }}>
                  <div className="p-4" style={{ background: T.bgCard }}>
                    <p className="text-sm font-bold mb-1" style={{ color: T.textPrimary }}>Nutrition Facts</p>
                    <p className="text-xs" style={{ color: T.textMuted }}>Per 1g serving</p>
                  </div>
                  {[
                    { label: 'Calories', value: '0 kcal' },
                    { label: 'Total Fat', value: '0g' },
                    { label: 'Carbohydrates', value: '0.5g' },
                    { label: 'Sugars', value: '0g' },
                    { label: 'Protein', value: '0g' },
                    { label: 'Sodium', value: '0mg' },
                  ].map((row, i) => (
                    <div
                      key={row.label}
                      className="flex justify-between px-4 py-2.5"
                      style={{
                        background: i % 2 === 0 ? T.bgPage : T.bgCard,
                        borderTop: `1px solid ${T.borderCard}`,
                      }}
                    >
                      <span className="text-sm" style={{ color: T.textSec }}>{row.label}</span>
                      <span className="text-sm font-semibold" style={{ color: T.textPrimary }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* How to Use Tab */}
              {activeTab === 'how' && (
                <div className="space-y-4 max-w-xl">
                  {(selectedRatio === '1:50' ? [
                    'Use just a pinch (approx. 0.02g) in place of 1 tsp of sugar.',
                    'Mix with a small amount of water before adding to recipes.',
                    'Start with 1/50th of your normal sugar quantity and adjust to taste.',
                    'Ideal for large batch baking — cookies, cakes, and bread doughs.',
                  ] : [
                    'Add 1/10th your normal sugar quantity to drinks or recipes.',
                    'For tea or coffee: Use 0.1g per cup instead of 1g of sugar.',
                    'For smoothies: Start with 0.2g and adjust to your preference.',
                    'Sprinkle directly on fruit, yogurt, or cereals.',
                  ]).map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: T.accentGreen, color: 'white' }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed pt-0.5" style={{ color: T.textSec }}>{step}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  {/* Star breakdown */}
                  <div className="flex items-center gap-6 mb-8 p-5 rounded-2xl" style={{ background: T.bgCard, border: `1px solid ${T.borderCard}` }}>
                    <div className="text-center flex-shrink-0">
                      <p className="text-4xl font-extrabold" style={{ color: T.textPrimary }}>{product.rating.toFixed(1)}</p>
                      <div className="flex gap-0.5 justify-center my-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className="w-4 h-4" style={{ color: T.amber, fill: s <= Math.round(product.rating) ? T.amber : 'transparent' }} />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: T.textMuted }}>{product.reviews_count || product.reviews} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5,4,3,2,1].map(star => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs w-4" style={{ color: T.textMuted }}>{star}</span>
                          <Star className="w-3 h-3 flex-shrink-0" style={{ color: T.amber, fill: T.amber }} />
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: T.pillInactiveBg }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '7%' : '3%',
                                background: T.accentGreen,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ReviewsSection productId={String(product.id)} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── § 3.7 You May Also Like ─── */}
        {relatedProducts.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-5" style={{ color: T.textPrimary }}>You may also like</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map(rel => {
                const relIsMonk = rel.type === 'monk-fruit';
                const relImageBg = relIsMonk ? '#faeeda' : '#eaf3de';
                return (
                  <Link
                    key={rel.id}
                    to={`/products/${rel.slug || rel.id}`}
                    className="flex flex-col rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
                    style={{ background: T.bgCard, border: `0.5px solid ${T.borderCard}` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.borderActive; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.borderCard; }}
                  >
                    <div className="h-36 flex items-center justify-center" style={{ background: relImageBg }}>
                      {rel.image && rel.image.startsWith('http') ? (
                        <img src={rel.image} alt={rel.name} className="h-full w-full object-contain p-4" />
                      ) : (
                        <span className="text-4xl">{relIsMonk ? '🍈' : rel.form === 'drops' ? '💧' : '🌿'}</span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold truncate mb-0.5" style={{ color: T.textPrimary }}>{rel.name}</p>
                      <p className="text-xs" style={{ color: T.textMuted }}>{rel.sweetness_description || `₹${rel.price}`}</p>
                      <p className="text-sm font-bold mt-1" style={{ color: T.textGreen }}>₹{rel.price}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
