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
import { ProductCard } from "@/components/ProductCard";

// ─── Design tokens (Natural Premium Theme) ───
const T = {
  bgPage:    'var(--bg-page)',   /* #f4f7f1 (Creamy Mint) */
  bgCard:    '#ffffff',
  bgHover:   'rgba(6, 78, 59, 0.05)',
  imageStevia: '#f0f3eb',
  imageMonk:  '#faeeda',
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

const CATEGORY_CARDS = [
  {
    emoji: '🌿',
    name: 'Stevia Powder',
    desc: 'Zero-calorie, plant-based powder — perfect for everyday use.',
    type: 'stevia',
    form: 'powder',
    count: 6,
    bg: '#f0f3eb',
    color: 'var(--primary)',
  },
  {
    emoji: '💧',
    name: 'Stevia Drops',
    desc: 'Liquid stevia — add a drop to any beverage instantly.',
    type: 'stevia',
    form: 'drops',
    count: 2,
    bg: '#eff6ff',
    color: '#1e40af',
  },
  {
    emoji: '🍈',
    name: 'Monk Fruit',
    desc: 'Premium monk fruit sweetener with a clean, smooth taste.',
    type: 'monk-fruit',
    form: 'powder',
    count: 2,
    bg: '#fff7ed',
    color: '#9a3412',
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
        className="pt-32 pb-20 px-4 relative overflow-hidden"
        style={{ background: 'var(--bg-page)' }}
      >
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left copy */}
            <div className="max-w-2xl text-center lg:text-left">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 bg-secondary px-4 py-2 rounded-full"
              >
                Our Collections
              </motion.span>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-black mb-6 leading-[0.95] tracking-tighter" style={{ color: 'var(--primary)' }}>
                Sweetness Without<br />
                <span className="text-accent-bright">Compromise</span>
              </h1>
              <p className="text-xl mb-10 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0" style={{ color: 'var(--text-muted)' }}>
                Zero-calorie, plant-based alternatives crafted for pure health and uncompromising taste.
              </p>
              <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
                <Link
                  to="/collections/all?type=stevia"
                  className="px-8 py-5 rounded-2xl text-base font-black uppercase tracking-widest text-white transition-all shadow-button hover:scale-105 active:scale-95"
                  style={{ background: 'var(--primary)' }}
                >
                  Shop Stevia
                </Link>
                <Link
                  to="/collections/all?type=monk-fruit"
                  className="px-8 py-5 rounded-2xl text-base font-black uppercase tracking-widest transition-all border-2 hover:bg-white/50"
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  Shop Monk Fruit
                </Link>
              </div>
            </div>
            
            {/* Right stat badges */}
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              {[
                { label: '0 Calories', sub: 'Zero glycemic impact' },
                { label: '100% Raw', sub: 'Pure plant extract' },
              ].map(b => (
                <div key={b.label}
                  className="rounded-3xl px-8 py-10 text-center bg-white shadow-soft transition-transform hover:-translate-y-1"
                  style={{ border: '1px solid rgba(6, 78, 59, 0.05)' }}
                >
                  <p className="text-2xl font-black tracking-tighter" style={{ color: 'var(--primary)' }}>{b.label}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest mt-2 opacity-40">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────
          § 2.2  Category Shortcut Cards
         ───────────────────────────────── */}
      <section className="py-12 px-4 bg-page">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORY_CARDS.map(card => (
              <Link
                key={card.name}
                to={`/collections/all?type=${card.type}&form=${card.form}`}
                className="relative rounded-[32px] p-8 flex items-center gap-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-white border border-border group"
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent-bright)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; }}
              >
                {/* Count badge */}
                <span className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-mint text-primary border border-primary/5">
                  {card.count} Items
                </span>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner"
                  style={{ background: card.bg }}>
                  {card.emoji}
                </div>
                <div>
                  <p className="text-lg font-black uppercase tracking-tighter" style={{ color: 'var(--primary)' }}>{card.name}</p>
                  <p className="text-xs mt-1 font-medium leading-relaxed opacity-60">{card.desc}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-4 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--accent-bright)' }}>Shop Collection →</p>
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
        className="transition-all duration-300 z-30 py-4 px-4"
        style={{
          position: isSticky ? 'sticky' : 'relative',
          top: isSticky ? 80 : 'auto',
          background: isSticky ? 'rgba(244, 247, 241, 0.95)' : 'transparent',
          backdropFilter: isSticky ? 'blur(12px)' : 'none',
          borderBottom: isSticky ? '1px solid rgba(6, 78, 59, 0.05)' : 'none',
        }}
      >
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Active filter chips */}
            {activeChips.map(chip => (
              <button
                key={chip.key + chip.value}
                onClick={() => toggleFilter(chip.key, chip.value)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-mint text-primary border border-primary/10 shadow-soft hover:bg-white"
              >
                {chip.label} <X className="w-3 h-3" />
              </button>
            ))}
            {activeChips.length > 0 && (
              <button onClick={clearAllFilters} className="text-[10px] font-black uppercase tracking-widest underline opacity-40 hover:opacity-100" style={{ color: 'var(--primary)' }}>
                Clear all
              </button>
            )}
            {activeChips.length === 0 && (
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">
                {isLoading ? '...' : `${products.length} Products`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={activeFilters.sort_by}
                onChange={e => setFilter('sort_by', e.target.value)}
                className="appearance-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest pr-10 cursor-pointer bg-white border border-border shadow-soft focus:ring-0 outline-none"
                style={{ color: 'var(--primary)' }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-40" />
            </div>

            {/* Mobile Filters button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white border border-border shadow-soft"
              style={{ color: 'var(--primary)' }}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters {activeChips.length > 0 && `(${activeChips.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────
          § 2.3 Main Body: Sidebar + Grid
         ───────────────────────────────── */}
      <div className="container mx-auto px-4 py-8 flex gap-8">

        {/* Filter Sidebar — desktop */}
        <aside className="hidden md:block flex-shrink-0" style={{ width: 220 }}>
          <div className="sticky top-28 pr-6">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Refine By</p>
              {activeChips.length > 0 && (
                <button onClick={clearAllFilters} className="text-[10px] font-black uppercase tracking-tighter hover:underline">Reset</button>
              )}
            </div>
            {FILTER_GROUPS.map(group => (
              <div key={group.key} className="mb-8">
                <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'var(--primary)' }}>{group.label}</p>
                <div className="space-y-3">
                  {group.options.map(opt => {
                    const isChecked = activeFilters[group.key as FilterKey] === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => toggleFilter(group.key as FilterKey, opt.value)}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                          style={{
                            background: isChecked ? 'var(--primary)' : 'white',
                            border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border)'}`,
                            boxShadow: isChecked ? 'var(--shadow-button)' : 'none',
                          }}
                        >
                          {isChecked && <svg className="w-2.5 h-2.5" viewBox="0 0 10 9"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>}
                        </div>
                        <span className="text-xs font-bold transition-colors group-hover:text-accent-bright" style={{ color: isChecked ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] font-black ml-auto opacity-30">({opt.count})</span>
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
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
            >
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
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

export default CollectionsPage;
