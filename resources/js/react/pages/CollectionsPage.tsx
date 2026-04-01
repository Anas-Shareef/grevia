import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, SlidersHorizontal, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";

const CATEGORY_CARDS = [
  {
    emoji: '🌿',
    name: 'Stevia Powder',
    desc: 'Zero-calorie, plant-based powder — perfect for everyday use.',
    type: 'stevia',
    form: 'powder',
    count: 6,
    bg: 'stevia-bg',
  },
  {
    emoji: '💧',
    name: 'Stevia Drops',
    desc: 'Liquid stevia — add a drop to any beverage instantly.',
    type: 'stevia',
    form: 'drops',
    count: 2,
    bg: 'blue-50', // Fallback
  },
  {
    emoji: '🍈',
    name: 'Monk Fruit',
    desc: 'Premium monk fruit sweetener with a clean, smooth taste.',
    type: 'monk-fruit',
    form: 'powder',
    count: 2,
    bg: 'monk-bg',
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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

  const { data: response, isLoading } = useProducts({
    type: activeFilters.type,
    form: activeFilters.form,
    ratio: activeFilters.ratio.replace('-', ':') || '',
    size: activeFilters.size,
    sort_by: activeFilters.sort_by,
  });
  
  const products: Product[] = Array.isArray(response) ? response : (response as any)?.data || [];

  useEffect(() => {
    const handler = () => setIsSticky(window.scrollY > 300);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="bg-[var(--bg-page)] min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="eyebrow-badge mb-6 inline-flex">
                <span className="dot" />
                Our Collections
              </div>
              <h1 className="mb-6">
                Sweetness Without <br />
                <span className="text-[var(--green-primary)]">Compromise</span>
              </h1>
              <p className="hero-subtitle mb-8 max-w-lg mx-auto lg:mx-0">
                Zero-calorie, plant-based alternatives crafted for pure health and uncompromising taste. Discover your perfect match.
              </p>
            </div>
            
            {/* Stat Badges */}
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              {[
                { label: '0 Calories', sub: 'Zero glycemic impact' },
                { label: '100% Raw', sub: 'Pure plant extract' },
              ].map(b => (
                <div key={b.label} className="benefit-card !p-8 !mb-0 text-center flex flex-col items-center">
                  <p className="text-2xl font-black text-[var(--text-heading)]">{b.label}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-2 text-[var(--text-muted)]">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="pb-16 px-4">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORY_CARDS.map(card => (
              <Link
                key={card.name}
                to={`/collections/all?type=${card.type}&form=${card.form}`}
                className="benefit-card !flex-row group !p-8 !mb-0 items-center gap-6"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${card.bg}`}>
                  {card.emoji}
                </div>
                <div>
                  <h3 className="benefit-title mb-1">{card.name}</h3>
                  <p className="benefit-desc !mb-0">{card.desc}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-3 text-[var(--green-primary)] group-hover:translate-x-1 transition-transform">
                    Shop Now →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div
        className={`z-30 py-4 px-4 transition-all duration-300 ${isSticky ? 'sticky top-16 bg-white/80 backdrop-blur-md border-b border-[var(--border-light)]' : ''}`}
      >
        <div className="container flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {activeChips.map(chip => (
              <button
                key={chip.key + chip.value}
                onClick={() => toggleFilter(chip.key, chip.value)}
                className="size-pill active !px-4 !py-2 flex items-center gap-2"
              >
                {chip.label} <X className="w-3 h-3" />
              </button>
            ))}
            {activeChips.length > 0 && (
              <button onClick={clearAllFilters} className="text-[10px] font-black uppercase tracking-widest underline opacity-40 hover:opacity-100">
                Clear all
              </button>
            )}
            {activeChips.length === 0 && (
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {isLoading ? '...' : `${products.length} Products`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={activeFilters.sort_by}
              onChange={e => setFilter('sort_by', e.target.value)}
              className="px-4 py-2 rounded-full text-xs font-bold border border-[var(--border-light)] bg-white outline-none focus:border-[var(--green-primary)] transition-colors"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-[var(--border-light)] bg-white"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container py-12 flex gap-12">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-40">Refine Selection</p>
            {FILTER_GROUPS.map(group => (
              <div key={group.key} className="mb-10">
                <h4 className="text-xs font-black uppercase tracking-widest mb-6">{group.label}</h4>
                <div className="space-y-4">
                  {group.options.map(opt => {
                    const isChecked = activeFilters[group.key as FilterKey] === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => toggleFilter(group.key as FilterKey, opt.value)}
                      >
                        <div className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${isChecked ? 'bg-[var(--green-primary)] border-[var(--green-primary)]' : 'border-[var(--border-light)] group-hover:border-[var(--green-primary)]'}`}>
                          {isChecked && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-[var(--text-heading)]' : 'text-[var(--text-muted)] group-hover:text-[var(--green-primary)]'}`}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] font-bold ml-auto opacity-30">({opt.count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {isLoading ? (
            <div className="products-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-[20px] bg-white animate-pulse border border-[var(--border-light)]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[40px] border border-[var(--border-light)]">
              <p className="text-4xl mb-4">🍃</p>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-[var(--text-muted)] mb-8">Try adjusting your filters to find your perfect match.</p>
              <button onClick={clearAllFilters} className="btn-primary px-8">Clear All Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-[40px] p-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-[var(--bg-page)] rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {FILTER_GROUPS.map(group => (
                <div key={group.key} className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map(opt => {
                      const isChecked = activeFilters[group.key as FilterKey] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleFilter(group.key as FilterKey, opt.value)}
                          className={`size-pill ${isChecked ? 'active' : ''}`}
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
                className="btn-primary w-full py-4 mt-4"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionsPage;
