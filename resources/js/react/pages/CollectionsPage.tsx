import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

// ─── Design tokens matching master prompt Section 6 ───
const T = {
  bgPage:    '#0d1f0e',
  bgCard:    '#1a2e1b',
  bgHover:   '#1f3620',
  imageStevia:'#eaf3de',
  imageMonk:  '#faeeda',
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

const CATEGORY_CARDS = [
  {
    emoji: '🌿',
    name: 'Stevia Powder',
    desc: 'Zero-calorie, plant-based powder — perfect for everyday use.',
    type: 'stevia',
    form: 'powder',
    count: 4,
    bg: T.imageStevia,
    color: '#173404',
  },
  {
    emoji: '💧',
    name: 'Stevia Drops',
    desc: 'Liquid stevia — add a drop to any beverage instantly.',
    type: 'stevia',
    form: 'drops',
    count: 2,
    bg: '#d4f0e8',
    color: '#0d3022',
  },
  {
    emoji: '🍈',
    name: 'Monk Fruit',
    desc: 'Premium monk fruit sweetener with a clean, smooth taste.',
    type: 'monk-fruit',
    form: 'powder',
    count: 2,
    bg: T.imageMonk,
    color: '#3a1f00',
  },
];

const SORT_OPTIONS = [
  { label: 'Featured',            value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest',             value: 'newest' },
];

const FILTER_GROUPS = [
  {
    key: 'type' as const,
    label: 'Type',
    options: [
      { label: 'Stevia',      value: 'stevia',     count: 6 },
      { label: 'Monk Fruit',  value: 'monk-fruit', count: 2 },
    ],
  },
  {
    key: 'form' as const,
    label: 'Form',
    options: [
      { label: 'Powder',        value: 'powder', count: 6 },
      { label: 'Drops/liquid',  value: 'drops',  count: 2 },
    ],
  },
  {
    key: 'ratio' as const,
    label: 'Strength ratio',
    options: [
      { label: '1:10 mild',   value: '1-10', count: 6 },
      { label: '1:50 strong', value: '1-50', count: 2 },
    ],
  },
  {
    key: 'size' as const,
    label: 'Size',
    options: [
      { label: '50g',  value: '50g',  count: 4 },
      { label: '100g', value: '100g', count: 4 },
    ],
  },
];

type FilterKey = 'type' | 'form' | 'ratio' | 'size';

const CollectionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const toggleWishlist = (product: Product) => {
    if (isInWishlist(String(product.id))) removeFromWishlist(String(product.id));
    else addToWishlist(product);
  };
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [isSticky, setIsSticky] = useState(false);

  // Read active filters from URL
  const activeFilters = useMemo(() => ({
    type:  searchParams.get('type')  || '',
    form:  searchParams.get('form')  || '',
    ratio: searchParams.get('ratio') || '',
    size:  searchParams.get('size')  || '',
    sort_by: searchParams.get('sort_by') || 'featured',
  }), [searchParams]);

  const setFilter = (key: FilterKey | 'sort_by', value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!value) next.delete(key); else next.set(key, value);
      return next;
    });
  };

  const toggleFilter = (key: FilterKey, value: string) => {
    const current = searchParams.get(key) || '';
    setFilter(key, current === value ? '' : value);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeChips = FILTER_GROUPS.flatMap(g =>
    g.options.filter(o => {
      const v = activeFilters[g.key as FilterKey];
      return v === o.value;
    }).map(o => ({ key: g.key as FilterKey, label: o.label, value: o.value }))
  );

  // Build query for the API
  const apiFilters = {
    type: activeFilters.type,
    form: activeFilters.form,
    ratio: activeFilters.ratio.replace('-', ':') || '', // convert "1-10" → "1:10"
    size: activeFilters.size,
    sort_by: activeFilters.sort_by,
  };

  const { data: response, isLoading } = useProducts(apiFilters);
  const products: Product[] = Array.isArray(response) ? response : (response as any)?.data || [];

  // Sticky scroll behavior
  useEffect(() => {
    const handler = () => setIsSticky(window.scrollY > 320);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const getProductPrice = (p: Product) => {
    const sel = selectedSizes[p.id];
    if (!sel || sel === p.size_label) return p.price;
    // Estimate alternate price: if current is 50g, 100g is ~1.67x
    return p.size_label === '50g' ? Math.round(p.price * 1.67) : Math.round(p.price * 0.6);
  };

  return (
    <div style={{ background: T.bgPage, minHeight: '100vh', fontFamily: "Inter, system-ui, sans-serif" }}>
      <Header />

      {/* ─────────────────────────────────
          § 2.1  Hero Banner
         ───────────────────────────────── */}
      <section
        className="pt-24 pb-16 px-4"
        style={{ background: `linear-gradient(135deg, ${T.bgPage} 0%, ${T.accentDark} 100%)` }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left copy */}
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.textGreen }}>
                Natural Sweeteners
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight" style={{ color: T.textPrimary }}>
                Sweetness Without<br />Sacrifice
              </h1>
              <p className="text-base mb-8 leading-relaxed" style={{ color: T.textSec }}>
                Zero-calorie, plant-based alternatives to sugar. Choose your perfect sweetener.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  to="/collections/all?type=stevia"
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                  style={{ background: T.accentGreen }}
                >
                  Shop Stevia
                </Link>
                <Link
                  to="/collections/all?type=monk-fruit"
                  className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{ border: `1px solid ${T.borderActive}`, color: T.textGreen }}
                >
                  Shop Monk Fruit
                </Link>
              </div>
            </div>
            {/* Right stat badges */}
            <div className="flex gap-4">
              {[
                { label: '0 Calories', sub: 'Per serving' },
                { label: '100% Natural', sub: 'Plant-based' },
              ].map(b => (
                <div key={b.label}
                  className="rounded-2xl px-6 py-5 text-center"
                  style={{ background: 'rgba(45,122,58,0.18)', border: `1px solid ${T.borderCard}` }}
                >
                  <p className="text-xl font-extrabold" style={{ color: T.textPrimary }}>{b.label}</p>
                  <p className="text-xs mt-1" style={{ color: T.textMuted }}>{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────
          § 2.2  Category Shortcut Cards
         ───────────────────────────────── */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORY_CARDS.map(card => (
              <Link
                key={card.name}
                to={`/collections/all?type=${card.type}&form=${card.form}`}
                className="relative rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 hover:scale-[1.01] group"
                style={{
                  background: T.bgCard,
                  border: `1px solid ${T.borderCard}`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.accentGreen; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.borderCard; }}
              >
                {/* Count badge */}
                <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: T.pillInactiveBg, color: T.textGreen }}>
                  {card.count} products
                </span>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: card.bg }}>
                  {card.emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: T.textPrimary }}>{card.name}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: T.textMuted }}>{card.desc}</p>
                  <p className="text-xs font-semibold mt-2" style={{ color: T.textGreen }}>Shop now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────
          § 2.3  Sticky Filter Bar + Active Chips
         ───────────────────────────────── */}
      <div
        className="transition-all duration-300 z-30 py-3 px-4"
        style={{
          position: isSticky ? 'sticky' : 'relative',
          top: isSticky ? 80 : 'auto',
          background: isSticky ? 'rgba(13,31,14,0.96)' : 'transparent',
          backdropFilter: isSticky ? 'blur(12px)' : 'none',
          borderBottom: isSticky ? `1px solid ${T.borderCard}` : 'none',
        }}
      >
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Active filter chips */}
            {activeChips.map(chip => (
              <button
                key={chip.key + chip.value}
                onClick={() => toggleFilter(chip.key, chip.value)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{ background: T.pillActiveBg, border: `1px solid ${T.pillActiveBorder}`, color: T.textGreen }}
              >
                {chip.label} <X className="w-3 h-3" />
              </button>
            ))}
            {activeChips.length > 0 && (
              <button onClick={clearAllFilters} className="text-xs underline" style={{ color: T.textMuted }}>
                Clear all
              </button>
            )}
            {activeChips.length === 0 && (
              <span className="text-sm" style={{ color: T.textMuted }}>
                {isLoading ? '...' : `${products.length} products`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={activeFilters.sort_by}
                onChange={e => setFilter('sort_by', e.target.value)}
                className="appearance-none px-4 py-2 rounded-xl text-xs font-medium pr-8 cursor-pointer"
                style={{
                  background: T.bgCard,
                  border: `1px solid ${T.borderCard}`,
                  color: T.textPrimary,
                  outline: 'none',
                }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: T.textMuted }} />
            </div>

            {/* Mobile Filters button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
              style={{ background: T.bgCard, border: `1px solid ${T.borderCard}`, color: T.textPrimary }}
            >
              <SlidersHorizontal className="w-3 h-3" /> Filters {activeChips.length > 0 && `(${activeChips.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────
          § 2.3 Main Body: Sidebar + Grid
         ───────────────────────────────── */}
      <div className="container mx-auto px-4 py-8 flex gap-8">

        {/* Filter Sidebar — desktop */}
        <aside className="hidden md:block flex-shrink-0" style={{ width: 180 }}>
          <div className="sticky top-28">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: T.textPrimary }}>Filters</p>
              {activeChips.length > 0 && (
                <button onClick={clearAllFilters} className="text-xs" style={{ color: T.textMuted }}>Clear all</button>
              )}
            </div>
            {FILTER_GROUPS.map(group => (
              <div key={group.key} className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: T.textMuted }}>{group.label}</p>
                <div className="space-y-2">
                  {group.options.map(opt => {
                    const isChecked = activeFilters[group.key as FilterKey] === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => toggleFilter(group.key as FilterKey, opt.value)}
                      >
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            background: isChecked ? T.accentGreen : T.pillInactiveBg,
                            border: `1px solid ${isChecked ? T.accentGreen : T.pillInactiveBorder}`,
                          }}
                        >
                          {isChecked && <svg className="w-2.5 h-2.5" viewBox="0 0 10 9"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                        </div>
                        <span className="text-xs flex-1" style={{ color: isChecked ? T.textGreen : T.textSec }}>
                          {opt.label}
                        </span>
                        <span className="text-[10px]" style={{ color: T.textMuted }}>({opt.count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 min-w-0">
          <p className="text-sm mb-4" style={{ color: T.textMuted }}>
            {isLoading ? 'Loading...' : `${products.length} products`}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl animate-pulse" style={{ background: T.bgCard, height: 320 }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🌿</p>
              <p className="text-lg font-semibold mb-2" style={{ color: T.textPrimary }}>No products found</p>
              <p className="text-sm mb-6" style={{ color: T.textMuted }}>Try adjusting your filters</p>
              <button onClick={clearAllFilters} className="px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: T.accentGreen }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
            >
              {products.map(product => (
                <ProductGridCard
                  key={product.id}
                  product={product}
                  selectedSize={selectedSizes[product.id] || product.size_label || '50g'}
                  onSizeChange={(size) => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                  addToCart={addToCart}
                  toggle={(p) => toggleWishlist(p)}
                  isWishlisted={isInWishlist(String(product.id))}
                />
              ))}
            </motion.div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────
          Mobile Filter Bottom Sheet
         ───────────────────────────────── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6 overflow-y-auto max-h-[80vh]"
              style={{ background: T.bgCard, border: `1px solid ${T.borderCard}` }}
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-base font-bold" style={{ color: T.textPrimary }}>Filters</p>
                <button onClick={() => setShowMobileFilters(false)}><X className="w-5 h-5" style={{ color: T.textMuted }} /></button>
              </div>
              {FILTER_GROUPS.map(group => (
                <div key={group.key} className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T.textMuted }}>{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map(opt => {
                      const isChecked = activeFilters[group.key as FilterKey] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleFilter(group.key as FilterKey, opt.value)}
                          className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: isChecked ? T.pillActiveBg : T.pillInactiveBg,
                            border: `1px solid ${isChecked ? T.pillActiveBorder : T.pillInactiveBorder}`,
                            color: isChecked ? T.textGreen : T.textSec,
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-4 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: T.accentGreen }}
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

// ─── Individual Product Card Component ───
interface ProductGridCardProps {
  product: Product;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  addToCart: (product: Product) => void;
  toggle: (product: Product) => void;
  isWishlisted: boolean;
}

const ProductGridCard = ({ product, selectedSize, onSizeChange, addToCart, toggle, isWishlisted }: ProductGridCardProps) => {
  const isMonk = product.type === 'monk-fruit';
  const imageBg = isMonk ? '#faeeda' : '#eaf3de';
  const sizes = ['50g', '100g'];
  const altPrice = Math.round(product.price * (selectedSize === '50g' ? 1 : 0.6));
  const displayPrice = selectedSize === product.size_label ? product.price : altPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { duration: 2000 });
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="block rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.01]"
        style={{
          background: '#1a2e1b',
          border: '0.5px solid rgba(45,122,58,0.25)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(45,122,58,0.6)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(45,122,58,0.25)'; }}
      >
        {/* Image area */}
        <div className="relative h-44 flex items-center justify-center" style={{ background: imageBg }}>
          <span className="text-5xl">{isMonk ? '🍈' : product.form === 'drops' ? '💧' : '🌿'}</span>
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.7)', color: '#173404' }}>
            {product.form === 'drops' ? 'STEVIA DROPS' : isMonk ? 'MONK FRUIT' : 'STEVIA POWDER'}
          </span>
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggle(product); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.7)' }}
          >
            <Heart className="w-4 h-4" style={{ color: isWishlisted ? '#ef4444' : '#173404', fill: isWishlisted ? '#ef4444' : 'none' }} />
          </button>
        </div>

        {/* Card body */}
        <div className="p-4">
          <p className="text-sm font-semibold mb-0.5 truncate" style={{ color: '#f0f4ee' }}>{product.name}</p>
          <p className="text-xs mb-3 leading-relaxed" style={{ color: '#9db89e' }}>
            {product.sweetness_description || '1g replaces 10g of sugar'}
          </p>

          {/* Size pills */}
          <div className="flex gap-2 mb-3">
            {sizes.map(size => (
              <button
                key={size}
                onClick={(e) => { e.preventDefault(); onSizeChange(size); }}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: selectedSize === size ? '#1f4a22' : '#132113',
                  border: `1px solid ${selectedSize === size ? '#2d7a3a' : 'rgba(45,122,58,0.3)'}`,
                  color: selectedSize === size ? '#97c459' : '#9db89e',
                }}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Price + add */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold" style={{ color: '#f0f4ee' }}>₹{displayPrice}</p>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
              style={{ border: '1px solid #2d7a3a', color: '#97c459' }}
            >
              <ShoppingCart className="w-3 h-3" /> Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CollectionsPage;
