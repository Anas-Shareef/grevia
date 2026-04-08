import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, SlidersHorizontal, ShoppingBag, Leaf, Globe } from "lucide-react";
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
    bg: 'bg-secondary/30',
  },
  {
    emoji: '💧',
    name: 'Stevia Drops',
    desc: 'Liquid stevia — add a drop to any beverage instantly.',
    type: 'stevia',
    form: 'drops',
    bg: 'bg-secondary/20',
  },
  {
    emoji: '🍈',
    name: 'Monk Fruit',
    desc: 'Premium monk fruit sweetener with a smooth taste.',
    type: 'monk-fruit',
    form: 'powder',
    bg: 'bg-secondary/30',
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
    <div className="bg-background min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Ambient Blobs */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-lime/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="eyebrow-badge mb-8 inline-flex"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Our Premium Range
            </motion.div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Sweetness <br />
              Without Sacrifice.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
              Discover nature's finest sweeteners, meticulously extracted for pure health and uncompromising taste.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-10 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-primary shadow-soft border border-border/50">
                  <Leaf className="w-5 h-5"/>
                </div>
                <span className="eyebrow !text-foreground">100% Plant-Based</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-primary shadow-soft border border-border/50">
                  <Globe className="w-5 h-5"/>
                </div>
                <span className="eyebrow !text-foreground">Global Purity Standards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORY_CARDS.map(card => (
              <Link
                key={card.name}
                to={`/collections/all?type=${card.type}&form=${card.form}`}
                className="bg-card rounded-squircle-xl p-10 border border-border/50 group hover:shadow-card hover:-translate-y-2 transition-all duration-500 shadow-soft"
              >
                <div className={`w-20 h-20 rounded-squircle flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform ${card.bg}`}>
                  {card.emoji}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{card.name}</h3>
                <p className="text-muted-foreground text-sm font-medium mb-6 leading-relaxed">{card.desc}</p>
                <span className="eyebrow !text-primary !tracking-[0.2em] group-hover:!tracking-[0.3em] transition-all">
                  Explore Category →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-32">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-12">
              <div>
                <p className="eyebrow mb-8">Refine By</p>
                {FILTER_GROUPS.map(group => (
                  <div key={group.key} className="mb-10">
                    <h4 className="sidebar-header">{group.label}</h4>
                    <div className="space-y-4">
                      {group.options.map(opt => {
                        const isChecked = activeFilters[group.key as FilterKey] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => toggleFilter(group.key as FilterKey, opt.value)}
                            className="flex items-center gap-4 w-full group text-left"
                          >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-primary border-primary shadow-glow' : 'border-border group-hover:border-primary'}`}>
                              {isChecked && <X className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isChecked ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
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
                  className="w-full py-4 bg-secondary/50 rounded-squircle eyebrow !text-foreground font-bold hover:bg-destructive/10 hover:!text-destructive transition-all active:scale-95"
                >
                  Clear Active Filters
                </button>
              )}
            </div>
          </aside>

          {/* Grid Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 py-6 border-b border-border/50">
              <p className="eyebrow">
                Showing {products.length} Premium Essentials
              </p>
              <div className="flex gap-4 items-center">
                <span className="eyebrow opacity-40">Sort By</span>
                <select
                  value={activeFilters.sort_by}
                  onChange={e => setFilter('sort_by', e.target.value)}
                  className="bg-transparent border-none eyebrow !text-foreground outline-none focus:!text-primary transition-colors cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-squircle-xl bg-card animate-pulse border border-border/50 shadow-soft" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-card rounded-squircle-2xl border border-border/50 shadow-soft">
                <div className="w-24 h-24 bg-lime/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag className="w-10 h-10 text-primary opacity-20" />
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-4">No matching products</h3>
                <p className="text-muted-foreground text-sm mb-10 max-w-sm mx-auto leading-relaxed">We couldn't find exactly what you're looking for. Try adjusting your filters or browsing all products.</p>
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
