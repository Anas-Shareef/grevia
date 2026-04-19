import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, SlidersHorizontal, ShoppingBag, Leaf, Globe, Grid2X2, List } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductCard } from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";

const SORT_OPTIONS = [
  { label: 'Featured Selection', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Recently Added', value: 'newest' },
];

const FILTER_GROUPS = [
  {
    key: 'tags' as const,
    label: 'Dietary Focus',
    options: [
      { label: 'Zero Calorie', value: 'zero-calorie' },
      { label: 'Keto-Friendly', value: 'keto-friendly' },
      { label: 'Diabetic-Friendly', value: 'diabetic-friendly' },
      { label: 'Vegan', value: 'vegan' },
    ],
  },
  {
    key: 'type' as const,
    label: 'Sweetener Type',
    options: [
      { label: 'Stevia', value: 'stevia' },
      { label: 'Monk Fruit', value: 'monk-fruit' },
      { label: 'Blends', value: 'blends' },
    ],
  },
  {
    key: 'form' as const,
    label: 'Format',
    options: [
      { label: 'Liquid Drops', value: 'liquid-drops' },
      { label: 'Powder', value: 'powder' },
      { label: 'Sachets', value: 'sachets' },
    ],
  },
];

const CollectionsPage = () => {
  const { filters, setFilter, resetFilters } = useProductFilters();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
  const [isSticky, setIsSticky] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Handle Dual Slider Logic Local State before committing to URL
  const [priceRange, setPriceRange] = useState([
      filters.min_price ? parseInt(filters.min_price) : 0, 
      filters.max_price ? parseInt(filters.max_price) : 2000
  ]);

  useEffect(() => {
    setPriceRange([
        filters.min_price ? parseInt(filters.min_price) : 0, 
        filters.max_price ? parseInt(filters.max_price) : 2000
    ]);
  }, [filters.min_price, filters.max_price]);

  const handlePriceCommit = (values: number[]) => {
      setFilter('min_price', values[0].toString());
      setFilter('max_price', values[1].toString());
  };

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
  }, [filters.type, filters.form, filters.tags, filters.min_price, filters.max_price, filters.sort_by]);

  const toggleFilter = (key: any, value: string) => {
    if (key === 'tags') {
        const currentTags = [...filters.tags];
        if (currentTags.includes(value)) {
            setFilter('tags', currentTags.filter(t => t !== value));
        } else {
            setFilter('tags', [...currentTags, value]);
        }
    } else {
        const current = (filters as any)[key] || '';
        setFilter(key, current === value ? '' : value);
    }
  };

  const removeFilter = (key: string, value: string) => {
      toggleFilter(key, value);
  };

  const activeChips = [
      ...filters.tags.map(t => ({ key: 'tags', label: FILTER_GROUPS.find(g=>g.key==='tags')?.options.find(o=>o.value===t)?.label || t, value: t })),
      ...(filters.type ? [{ key: 'type', label: FILTER_GROUPS.find(g=>g.key==='type')?.options.find(o=>o.value===filters.type)?.label || filters.type, value: filters.type }] : []),
      ...(filters.form ? [{ key: 'form', label: FILTER_GROUPS.find(g=>g.key==='form')?.options.find(o=>o.value===filters.form)?.label || filters.form, value: filters.form }] : []),
      ...(filters.min_price || filters.max_price ? [{ key: 'price', label: `₹${priceRange[0]} - ₹${priceRange[1]}`, value: 'price' }] : [])
  ];

  const hasMore = response?.meta && response.meta.current_page < response.meta.last_page;
  const totalCount = response?.meta?.total || 0;

  const loadMore = () => {
    if (hasMore) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-secondary/10">
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Shop Natural Sweeteners
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Zero calories. Zero spike. 100% natural. Filter by your dietary needs and format below.
            </p>
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
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[70] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <span className="eyebrow !text-foreground">Filter & Sort</span>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                {/* Mobile Price Slider */}
                <div>
                   <h4 className="sidebar-header mb-6">Price Range</h4>
                   <Slider
                       min={0} max={2000} step={50}
                       value={priceRange}
                       onValueChange={setPriceRange}
                       onValueCommit={handlePriceCommit}
                       className="mb-6"
                   />
                   <div className="flex justify-between items-center text-sm font-bold opacity-70">
                       <span>₹{priceRange[0]}</span>
                       <span>₹{priceRange[1]}</span>
                   </div>
                </div>

                {FILTER_GROUPS.map(group => (
                  <div key={group.key}>
                    <h4 className="sidebar-header mb-4">{group.label}</h4>
                    <div className="space-y-4">
                      {group.options.map(opt => {
                        const isChecked = group.key === 'tags' 
                            ? filters.tags.includes(opt.value)
                            : (filters as any)[group.key] === opt.value;
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

              <div className="p-6 border-t border-border/50 bg-background flex flex-col gap-3">
                 {activeChips.length > 0 && (
                     <button onClick={resetFilters} className="text-sm font-bold text-destructive text-center mb-2">Clear All</button>
                 )}
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full btn-primary h-14"
                >
                  Apply & Show {totalCount} Results
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-32 pt-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:w-1/4 flex-shrink-0">
            <div className="sticky top-28 space-y-12">
              <div>
                <p className="eyebrow mb-8 text-muted-foreground">Refine By</p>
                
                {/* Desktop Price Slider component */}
                <div className="mb-10 pb-10 border-b border-border/50">
                    <h4 className="sidebar-header mb-8">Price Range</h4>
                    <div className="px-2">
                        <Slider
                            min={0} max={2000} step={50}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            onValueCommit={handlePriceCommit}
                            className="mb-8"
                        />
                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-card border border-border/50 rounded-xl px-4 py-2 shadow-inner">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Min (₹)</span>
                                <div className="font-bold">{priceRange[0]}</div>
                            </div>
                            <div className="flex-1 bg-card border border-border/50 rounded-xl px-4 py-2 shadow-inner">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Max (₹)</span>
                                <div className="font-bold">{priceRange[1]}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {FILTER_GROUPS.map(group => (
                  <div key={group.key} className="mb-10">
                    <h4 className="sidebar-header mb-6">{group.label}</h4>
                    <div className="space-y-4">
                      {group.options.map(opt => {
                        const isChecked = group.key === 'tags' 
                            ? filters.tags.includes(opt.value)
                            : (filters as any)[group.key] === opt.value;
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
            </div>
          </aside>

          {/* Grid Area */}
          <div className="flex-1 lg:w-3/4">
            
            {/* Toolbar - Active Pills & View Toggle */}
            <div className="flex flex-col gap-6 mb-8 mt-2 lg:mt-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border/50">
                    <h2 className="text-xl md:text-2xl font-black">
                        {totalCount} Results
                    </h2>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
                        <div className="flex items-center rounded-xl bg-card border border-border/50 p-1 flex-shrink-0">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary'}`}
                            >
                                <Grid2X2 className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground">Sort:</span>
                            <select
                                value={filters.sort_by}
                                onChange={e => setFilter('sort_by', e.target.value)}
                                className="bg-transparent border-none text-sm font-bold outline-none focus:text-primary transition-colors cursor-pointer"
                            >
                                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Active Pills */}
                {activeChips.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        {activeChips.map((chip, idx) => (
                            <button 
                                key={`${chip.key}-${idx}`}
                                onClick={() => chip.key === 'price' ? (setFilter('min_price', ''), setFilter('max_price', '')) : removeFilter(chip.key, chip.value)}
                                className="inline-flex items-center gap-2 bg-secondary/50 border border-border hover:border-destructive hover:bg-destructive/10 text-xs font-bold px-4 py-2 rounded-full transition-all group"
                            >
                                {chip.label}
                                <X className="w-3 h-3 text-muted-foreground group-hover:text-destructive transition-colors" />
                            </button>
                        ))}
                        <button 
                            onClick={resetFilters}
                            className="text-xs font-bold text-muted-foreground hover:text-destructive underline decoration-dotted underline-offset-4 ml-2"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {products.length === 0 && !isLoading ? (
              <div className="text-center py-32 bg-card rounded-[3rem] border border-border/50 shadow-soft px-4">
                <div className="w-20 h-20 bg-lime/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag className="w-10 h-10 text-primary opacity-50" />
                </div>
                <h3 className="text-2xl font-black mb-4">No exact matches found</h3>
                <p className="text-muted-foreground text-sm mb-10">Try adjusting or clearing some of your filters.</p>
                <button onClick={resetFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="space-y-16">
                <div className={`transition-all duration-300 ${isLoading && currentPage === 1 ? 'opacity-50 pointer-events-none blur-sm' : 'opacity-100'} 
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8' 
                    : 'flex flex-col gap-6'
                  }`}
                >
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                  
                  {/* Loading Skeletons */}
                  {isLoading && currentPage === 1 && products.length === 0 && [...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] rounded-squircle-xl bg-secondary/30 animate-pulse" />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center pt-8 border-t border-border/50">
                    <button 
                      onClick={loadMore}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center gap-3 bg-secondary hover:bg-black hover:text-white rounded-squircle shadow-soft h-14 px-12 font-bold transition-all disabled:opacity-50 group"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          Load More Products
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
