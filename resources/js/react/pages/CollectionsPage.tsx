import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, SlidersHorizontal, Star, Leaf, ShoppingBag, Globe } from "lucide-react";
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
    bg: 'bg-[#F0F4EF]',
  },
  {
    emoji: '💧',
    name: 'Stevia Drops',
    desc: 'Liquid stevia — add a drop to any beverage instantly.',
    type: 'stevia',
    form: 'drops',
    bg: 'bg-[#EFF6FF]',
  },
  {
    emoji: '🍈',
    name: 'Monk Fruit',
    desc: 'Premium monk fruit sweetener with a smooth taste.',
    type: 'monk-fruit',
    form: 'powder',
    bg: 'bg-[#FDF7ED]',
  },
];

const SORT_OPTIONS = [
  { label: 'Featured Selection', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Recently Added', value: 'newest' },
];

const FILTER_GROUPS = [
  {
    key: 'type' as const,
    label: 'Sweetener Type',
    options: [
      { label: 'Pure Stevia', value: 'stevia', count: 6 },
      { label: 'Monk Fruit', value: 'monk-fruit', count: 2 },
    ],
  },
  {
    key: 'form' as const,
    label: 'Format',
    options: [
      { label: 'Fine Powder', value: 'powder', count: 6 },
      { label: 'Concentrated Drops', value: 'drops', count: 2 },
    ],
  },
  {
    key: 'ratio' as const,
    label: 'Sweetness Ratio',
    options: [
      { label: '1:10 Ratio', value: '1-10', count: 6 },
      { label: '1:50 Ratio', value: '1-50', count: 2 },
    ],
  },
];

type FilterKey = 'type' | 'form' | 'ratio' | 'size';

const CollectionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const activeFilters = useMemo(() => ({
    type: searchParams.get('type') || '',
    form: searchParams.get('form') || '',
    ratio: searchParams.get('ratio') || '',
    size: searchParams.get('size') || '',
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
    const handler = () => setIsSticky(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="bg-[var(--bg-page)] min-h-screen font-['Montserrat']">
      <Header />

      {/* Header Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="eyebrow-badge mb-8 inline-flex"
            >
              <span className="dot" />
              Our Premium Range
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-[900] tracking-tighter leading-[0.9] text-[var(--green-primary)] mb-8">
              Sweetness <br />
              <span className="text-outline">Without</span> <br />
              Sacrifice<span className="text-[var(--green-accent)]">.</span>
            </h1>
            <p className="text-[var(--text-muted)] text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
              Discover nature's finest sweeteners, meticulously extracted for pure health and uncompromising taste.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-10 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[var(--green-primary)] border border-[var(--border-light)]"><Leaf className="w-5 h-5"/></div>
                <span className="text-[10px] font-black uppercase tracking-widest">100% Plant-Based</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[var(--green-primary)] border border-[var(--border-light)]"><Globe className="w-5 h-5"/></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Global Purity Standards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="pb-24 px-4">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORY_CARDS.map(card => (
              <Link
                key={card.name}
                to={`/collections/all?type=${card.type}&form=${card.form}`}
                className="bg-white rounded-[32px] p-10 border border-[var(--border-light)] group hover:shadow-[var(--shadow-card)] hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform ${card.bg}`}>
                  {card.emoji}
                </div>
                <h3 className="text-2xl font-[900] uppercase tracking-tighter mb-2">{card.name}</h3>
                <p className="text-[var(--text-muted)] text-sm font-medium mb-6 leading-relaxed">{card.desc}</p>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--green-primary)] group-hover:tracking-[0.3em] transition-all">Explore Category →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container pb-32">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-8">Refine By</p>
                {FILTER_GROUPS.map(group => (
                  <div key={group.key} className="mb-10">
                    <h4 className="text-[11px] font-[900] uppercase tracking-widest mb-6 py-2 border-b border-[var(--border-light)]">{group.label}</h4>
                    <div className="space-y-4">
                      {group.options.map(opt => {
                        const isChecked = activeFilters[group.key as FilterKey] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => toggleFilter(group.key as FilterKey, opt.value)}
                            className="flex items-center gap-4 w-full group text-left"
                          >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-[var(--green-primary)] border-[var(--green-primary)] shadow-lg scale-110' : 'border-[var(--border-light)] group-hover:border-[var(--green-primary)]'}`}>
                              {isChecked && <X className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isChecked ? 'text-[var(--green-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--green-primary)]'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {activeChips.length > 0 && (
                <button 
                  onClick={clearAllFilters}
                  className="w-full py-4 bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                >
                  Clear Active Filters
                </button>
              )}
            </div>
          </aside>

          {/* Grid Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 py-6 border-b border-[var(--border-light)]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                Showing {products.length} Premium Essentials
              </p>
              <div className="flex gap-4 items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Sort By</span>
                <select
                  value={activeFilters.sort_by}
                  onChange={e => setFilter('sort_by', e.target.value)}
                  className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none focus:text-[var(--green-primary)] transition-colors cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-[32px] bg-white animate-pulse border border-[var(--border-light)] shadow-sm" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[48px] border border-[var(--border-light)] shadow-xl">
                <div className="w-24 h-24 bg-[var(--green-pale)] rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag className="w-10 h-10 text-[var(--green-primary)] opacity-20" />
                </div>
                <h3 className="text-3xl font-[900] tracking-tighter mb-4">No matching products</h3>
                <p className="text-[var(--text-muted)] text-sm mb-10 max-w-sm mx-auto leading-relaxed">We couldn't find exactly what you're looking for. Try adjusting your filters or browsing all products.</p>
                <button onClick={clearAllFilters} className="btn-primary">Browse All Essentials</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollectionsPage;
