import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Heart, Check, Truck, RotateCcw, Info, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import ReviewsSection from "@/components/ReviewsSection";

// ─── Design Tokens ───
const T = {
  bgPage:    '#0d1f0e',
  bgCard:    '#1a2e1b',
  textPrimary:'#f0f4ee',
  textSec:    '#9db89e',
  textMuted:  '#5a7a5b',
  textGreen:  '#97c459',
  accentGreen:'#2d7a3a',
  accentDark: '#173404',
  amber:      '#ba7517',
  borderCard: 'rgba(45,122,58,0.25)',
  borderActive:'#2d7a3a',
  pillInactiveBg:    '#132113',
  pillInactiveBorder:'rgba(45,122,58,0.3)',
  pillActiveBg:      '#1f4a22',
  pillActiveBorder:  '#2d7a3a',
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
  const catName = typeof product.category === 'object'
    ? product.category.name
    : product.category || 'Natural Sweeteners';
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Natural Sweeteners', href: '/collections/all' },
    { label: isMonk ? 'Monk Fruit' : 'Stevia', href: `/collections/all?type=${product.type || 'stevia'}` },
    { label: catName, href: `/collections/all?type=${product.type || 'stevia'}&form=${product.form || 'powder'}` },
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
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight" style={{ color: T.textPrimary }}>
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-sm leading-relaxed" style={{ color: T.textSec }}>
              {product.sweetness_description || (product.ratio ? `${product.ratio} means 1g replaces ${product.ratio === '1:50' ? '50g' : '10g'} of sugar.` : 'Natural, zero-calorie sweetener.')}{' '}
              Ideal for {product.use_case || 'tea, coffee, and smoothies'}.
            </p>

            {/* Star rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="w-4 h-4" style={{ color: T.amber, fill: s <= Math.round(product.rating) ? T.amber : 'transparent' }} />
                ))}
              </div>
              <span className="text-sm font-semibold" style={{ color: T.textPrimary }}>
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs" style={{ color: T.textMuted }}>
                ({product.reviews_count || product.reviews} reviews)
              </span>
            </div>

            {/* ─── § 3.3 Strength Ratio Selector ─── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-semibold" style={{ color: T.textPrimary }}>
                  Strength ratio — how concentrated is it?
                </p>
                <Info className="w-3.5 h-3.5" style={{ color: T.textMuted }} />
              </div>

              <div className="flex gap-3 mb-3">
                {['1:10', '1:50'].map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setSelectedRatio(ratio)}
                    className="flex-1 py-3 px-4 rounded-xl text-center transition-all"
                    style={{
                      background: selectedRatio === ratio ? T.pillActiveBg : T.pillInactiveBg,
                      border: `1px solid ${selectedRatio === ratio ? T.pillActiveBorder : T.pillInactiveBorder}`,
                    }}
                  >
                    <p className="text-sm font-bold" style={{ color: selectedRatio === ratio ? T.textGreen : T.textSec }}>
                      {ratio}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: T.textMuted }}>
                      {ratio === '1:10' ? 'mild · everyday' : 'strong · baking'}
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
                  className="flex gap-3 p-3 rounded-xl"
                  style={{ background: '#1e2d0e', border: '1px solid #3b6d11' }}
                >
                  <span className="text-lg flex-shrink-0">💡</span>
                  <p className="text-xs leading-relaxed" style={{ color: T.textSec }}>
                    {ratioGuide.detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ─── § 3.4 Size Selector ─── */}
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: T.textPrimary }}>Size</p>
              <div className="flex gap-3">
                {[
                  { size: '50g', price: price50 },
                  { size: '100g', price: price100, savings: savings > 0 ? `save ${savings}%` : undefined },
                ].map(({ size, price, savings: sv }) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="flex-1 py-3 px-4 rounded-xl text-center transition-all"
                    style={{
                      background: selectedSize === size ? T.pillActiveBg : T.pillInactiveBg,
                      border: `1px solid ${selectedSize === size ? T.pillActiveBorder : T.pillInactiveBorder}`,
                    }}
                  >
                    <p className="text-sm font-bold" style={{ color: selectedSize === size ? T.textGreen : T.textSec }}>
                      {size} · ₹{price}
                    </p>
                    {sv && (
                      <p className="text-[10px] mt-0.5" style={{ color: T.amber }}>{sv}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── § 3.5 Price + Add to Cart ─── */}
            <div>
              {/* Price row */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-extrabold" style={{ color: T.textPrimary }}>₹{displayPrice}</span>
                <span className="text-xs" style={{ color: T.textMuted }}>
                  {selectedSize} · ₹{(displayPrice / parseFloat(selectedSize)).toFixed(2)}/g
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(45,122,58,0.15)', color: T.textGreen, border: `1px solid ${T.borderCard}` }}
                >
                  Free shipping
                </span>
              </div>

              {/* Quantity + Add to Cart row */}
              <div className="flex gap-3 mb-4">
                {/* Quantity stepper */}
                <div className="flex items-center rounded-xl overflow-hidden" style={{ border: `1px solid ${T.borderCard}` }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-3 text-sm transition-colors"
                    style={{ color: T.textSec }}
                  >−</button>
                  <span className="px-4 text-sm font-semibold" style={{ color: T.textPrimary }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-3 text-sm transition-colors"
                    style={{ color: T.textSec }}
                  >+</button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: T.accentGreen, height: 44 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>

                {/* Wishlist */}
                <button
                  onClick={toggleWishlist}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                  style={{ border: `1px solid ${wishlisted ? '#ef4444' : T.borderCard}` }}
                >
                  <Heart className="w-4 h-4" style={{ color: wishlisted ? '#ef4444' : T.textSec, fill: wishlisted ? '#ef4444' : 'none' }} />
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
