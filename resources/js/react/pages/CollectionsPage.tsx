import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, SlidersHorizontal, ShoppingBag, Leaf, Globe, LayoutGrid, List } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useProductFilters } from "@/hooks/useProductFilters";
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
  const { filters, setFilter, resetFilters } = useProductFilters();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
  const [isSticky, setIsSticky] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync scroll for sticky bar
  useEffect(() => {
    const handler = () => setIsSticky(window.scrollY > 500);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const { data: response, isLoading } = useProducts({
    ...filters,
    page: String(currentPage),
  });

  const products: Product[] = useMemo(() => {
    const newItems = response?.data || [];
    if (currentPage === 1) return newItems;
    // For pagination, merge unique items
    const combined = [...accumulatedProducts];
    newItems.forEach((item: Product) => {
      if (!combined.find(p => p.id === item.id)) combined.push(item);
    });
    return combined;
  }, [response, currentPage, accumulatedProducts]);

  useEffect(() => {
    if (response?.data && currentPage > 1) {
      setAccumulatedProducts(prev => {
        const combined = [...prev];
        response.data.forEach((item: Product) => {
          if (!combined.find(p => p.id === item.id)) combined.push(item);
        });
        return combined;
      });
    } else if (response?.data && currentPage === 1) {
      setAccumulatedProducts(response.data);
    }
  }, [response, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setAccumulatedProducts([]);
  }, [filters.type, filters.form, filters.ratio, filters.sort_by]);

  const toggleFilter = (key: any, value: string) => {
    const current = (filters as any)[key] || '';
    setFilter(key, current === value ? '' : value);
  };

  const activeChips = FILTER_GROUPS.flatMap(g =>
    g.options.filter(o => {
      const v = (filters as any)[g.key];
      return v === o.value;
    }).map(o => ({ key: g.key, label: o.label, value: o.value }))
  );

  const hasMore = response?.meta && response.meta.current_page < response.meta.last_page;

  const loadMore = () => {
    if (hasMore) setCurrentPage(prev => prev + 1);
  };

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
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
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

      {/* Mobile Sticky Filter/Sort Bar */}
      <div className={`lg:hidden sticky top-[72px] z-40 w-full transition-all duration-300 ${isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-background/80 backdrop-blur-xl border-y border-border/50 px-4 py-3">
          <div className="container mx-auto flex gap-3">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="flex-1 flex items-center justify-center gap-3 bg-card border border-border/50 py-3.5 rounded-squircle eyebrow !text-foreground shadow-soft active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Filter {activeChips.length > 0 && `(${activeChips.length})`}
            </button>
            <div className="flex-1 relative">
              <select
                value={filters.sort_by}
                onChange={e => setFilter('sort_by', e.target.value)}
                className="w-full h-full bg-card border border-border/50 py-3.5 px-6 rounded-squircle eyebrow !text-foreground outline-none appearance-none shadow-soft text-center cursor-pointer hover:border-primary/30 transition-colors"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[70] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl lg:hidden"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <span className="eyebrow !text-foreground">Filters</span>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                {FILTER_GROUPS.map(group => (
                  <div key={group.key}>
                    <h4 className="sidebar-header">{group.label}</h4>
                    <div className="space-y-4">
                      {group.options.map(opt => {
                        const isChecked = (filters as any)[group.key] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => toggleFilter(group.key, opt.value)}
                            className="flex items-center gap-5 w-full group text-left py-2"
                          >
                            <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-primary border-primary shadow-glow' : 'border-border'}`}>
                              {isChecked && <X className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`text-sm font-black uppercase tracking-widest transition-colors ${isChecked ? 'text-primary' : 'text-muted-foreground'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full btn-primary h-14"
                >
                  Apply Filters {activeChips.length > 0 && `(${activeChips.length})`}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-32">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-12">
              <div>
                <p className="eyebrow mb-8">Refine By</p>
                {FILTER_GROUPS.map(group => (
                  <div key={group.key} className="mb-10">
                    <h4 className="sidebar-header">{group.label}</h4>
                    <div className="space-y-4">
                      {group.options.map(opt => {
                        const isChecked = (filters as any)[group.key] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => toggleFilter(group.key, opt.value)}
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
                  onClick={resetFilters}
                  className="w-full py-4 bg-secondary/50 rounded-squircle eyebrow !text-foreground font-bold hover:bg-destructive/10 hover:!text-destructive transition-all active:scale-95"
                >
                  Clear Active Filters
                </button>
              )}
            </div>
          </aside>

          {/* Grid Area */}
          <div className="flex-1">
            {/* Toolbar - Header & Desktop Sort */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 py-6 border-b border-border/50">
              <p className="eyebrow text-center md:text-left">
                Showing {products.length} Premium Essentials
              </p>
              <div className="hidden lg:flex gap-4 items-center">
                <div className="flex bg-secondary/50 rounded-lg p-1 mr-4">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <span className="eyebrow opacity-40">Sort By</span>
                <div className="relative">
                  <select
                    value={filters.sort_by}
                    onChange={e => setFilter('sort_by', e.target.value)}
                    className="bg-transparent border-none eyebrow !text-foreground outline-none focus:!text-primary transition-colors cursor-pointer pr-8 appearance-none"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {isLoading && currentPage === 1 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-squircle-xl bg-card animate-pulse border border-border/50 shadow-soft" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-card rounded-squircle-2xl border border-border/50 shadow-soft px-4">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-lime/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-primary opacity-20" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">No matching products</h3>
                <p className="text-muted-foreground text-sm mb-10 max-w-sm mx-auto leading-relaxed">We couldn't find exactly what you're looking for. Try adjusting your filters or browsing all products.</p>
                <button onClick={resetFilters} className="btn-primary">Browse All Essentials</button>
              </div>
            ) : (
              <div className="space-y-16">
                <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10" : "flex flex-col gap-0"}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode as any} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center pt-8">
                    <button 
                      onClick={loadMore}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground hover:bg-forest-light rounded-squircle shadow-button hover:shadow-lg hover:-translate-y-1 h-14 px-10 text-sm md:text-base font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none group"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          Explore More Products
                          <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                )}
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
