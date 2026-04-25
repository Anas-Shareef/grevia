import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ChevronDown, ChevronRight, ChevronLeft, SlidersHorizontal, ShoppingBag, Leaf, Globe, LayoutGrid, List, Droplets, Wind, Grape, Sparkles, Package, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductCard } from "@/components/ProductCard";

// Sort options — use normalized values accepted by ProductController
const SORT_OPTIONS = [
  { label: 'Featured Selection', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Recently Added', value: 'newest' },
];

const CollectionsPage = () => {
  const { filters, setFilter, resetFilters } = useProductFilters();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
  const [isSticky, setIsSticky] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSliderLeft = () => sliderRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
  const scrollSliderRight = () => sliderRef.current?.scrollBy({ left: 220, behavior: 'smooth' });

  const { data: response, isLoading } = useProducts({
    ...filters,
    page: String(currentPage),
  });

  const FILTER_GROUPS = useMemo(() => [
    {
      // Category: Top-level parent categories ONLY (no sub-cats in sidebar)
      key: 'category' as const,
      label: 'Category',
      options: (response?.filters?.categories || []).map((cat: any) => ({
        label: cat.name,
        value: cat.slug,
        count: cat.products_count ?? 0,
        disabled: (cat.products_count ?? 0) === 0,
      })),
    },
    {
      // Format: physical form of the product
      key: 'form' as const,
      label: 'Format',
      options: (response?.filters?.forms || []).map((f: any) => ({
        label: f.display || (f.label.charAt(0).toUpperCase() + f.label.slice(1)),
        value: f.label,
        count: f.count,
        disabled: (f.count ?? 0) === 0,
      })),
    },
    {
      // Concentration: sweetener potency ratio
      key: 'ratio' as const,
      label: 'Concentration',
      options: (response?.filters?.ratios || []).map((r: any) => ({
        label: r.display || r.label,
        value: r.label,
        count: r.count,
        disabled: (r.count ?? 0) === 0,
      })),
    },
    {
      // Pack Size: weight / volume of the physical package
      key: 'size' as const,
      label: 'Pack Size',
      options: (response?.filters?.sizes || []).map((s: any) => ({
        label: s.label,
        value: s.label,
        count: s.count,
        disabled: (s.count ?? 0) === 0,
      })),
    },
    // Certifications intentionally removed per PRD
  ], [response]);

  // Sync scroll for sticky bar & Parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.4]);
  const backToTopOpacity = useTransform(scrollY, [0, 400], [0, 1]);

  useEffect(() => {
    const handler = () => setIsSticky(window.scrollY > 500);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

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
  }, [filters.category, filters.form, filters.ratio, filters.sort_by, filters.search, filters.size, filters.certification, filters.use_case]);

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

  const currentCategory = response?.current_category;

  return (
    <div className="bg-background min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className={`pt-48 pb-20 relative overflow-hidden ${currentCategory?.hero_banner_url ? 'bg-forest/5 shadow-inner' : 'bg-[#F9F9F7]'}`}>
        {/* Dynamic Background Image if Hero Banner exists */}
        {currentCategory?.hero_banner_url && (
          <div 
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${currentCategory.hero_banner_url})`,
              backgroundBlendMode: 'overlay'
            }}
          />
        )}
        
        {/* Subtle Organic Texture/Pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-l-[100px] blur-3xl opacity-50 z-10" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-lime/5 rounded-r-[100px] blur-3xl opacity-50 z-10" />
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Dynamic Breadcrumbs for Category Hierarchy */}
            {currentCategory && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-primary/50"
              >
                <Link to="/collections/all" className="hover:text-primary transition-colors">All Products</Link>
                {currentCategory.parent && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <Link to={`/collections?category=${currentCategory.parent.slug}`} className="hover:text-primary transition-colors">{currentCategory.parent.name}</Link>
                  </>
                )}
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary">{currentCategory.name}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="eyebrow flex items-center justify-center gap-2 mb-6 text-primary"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-bold tracking-widest uppercase text-xs">
                {currentCategory?.name || "Nature's Finest Essentials"}
              </span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-display font-black leading-[0.9] tracking-tight mb-8 text-foreground uppercase">
              {currentCategory ? (
                <>
                  {currentCategory.name.split(' ')[0]}<br />
                  <span className="italic font-light text-primary">{currentCategory.name.split(' ').slice(1).join(' ') || 'Sweetness'}</span>
                </>
              ) : (
                <>
                  Pure Sweetness,<br />
                  <span className="italic font-light text-primary">Zero Guilt.</span>
                </>
              )}
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-16">
              {currentCategory?.description || "Experience uncompromising taste without the calories. Meticulously extracted, plant-based sweetness for your daily ritual."}
            </p>

            {/* ── Category Discovery Slider — Grevia Cream Card Design ── */}
            <div className="relative mt-2">
              {/* Left Arrow */}
              <button
                onClick={scrollSliderLeft}
                aria-label="Scroll categories left"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#2E4D31] text-white flex items-center justify-center shadow-md hover:bg-[#1e3422] active:scale-95 transition-all duration-200 md:-left-5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Slider Track */}
              <div
                ref={sliderRef}
                className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar py-2 px-1"
              >
                {/* Shop All card */}
                <button
                  onClick={() => resetFilters()}
                  className={`flex-shrink-0 flex flex-col items-center gap-[10px] px-4 pt-4 pb-3 rounded-[12px] min-w-[78px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    !filters.category
                      ? 'bg-[#2E4D31] shadow-md'
                      : 'bg-[#F9F9EB] hover:bg-[#f0f0df]'
                  }`}
                >
                  <Sparkles className={`w-7 h-7 ${!filters.category ? 'text-white' : 'text-[#2E4D31]'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest font-outfit text-center leading-tight ${
                    !filters.category ? 'text-white' : 'text-[#2E4D31]'
                  }`}>
                    All
                  </span>
                </button>

                {/* Parent category cards — NO sub-categories here */}
                {(response?.filters?.categories || []).map((cat: any) => (
                  <button
                    key={cat.slug}
                    onClick={() => setFilter('category', cat.slug)}
                    className={`flex-shrink-0 flex flex-col items-center gap-[10px] px-4 pt-4 pb-3 rounded-[12px] min-w-[78px] max-w-[96px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      filters.category === cat.slug
                        ? 'bg-[#2E4D31] shadow-md'
                        : 'bg-[#F9F9EB] hover:bg-[#f0f0df]'
                    }`}
                  >
                    {cat.icon_url ? (
                      <img
                        src={cat.icon_url}
                        alt={cat.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className={`w-7 h-7 object-contain ${
                          filters.category === cat.slug ? 'brightness-0 invert' : ''
                        }`}
                      />
                    ) : (
                      <Leaf className={`w-7 h-7 ${filters.category === cat.slug ? 'text-white' : 'text-[#2E4D31]'}`} />
                    )}
                    <span className={`text-[10px] font-black uppercase tracking-widest font-outfit text-center leading-tight ${
                      filters.category === cat.slug ? 'text-white' : 'text-[#2E4D31]'
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={scrollSliderRight}
                aria-label="Scroll categories right"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#2E4D31] text-white flex items-center justify-center shadow-md hover:bg-[#1e3422] active:scale-95 transition-all duration-200 md:-right-5"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
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
                    <div className="space-y-3">
                      {group.options.map((opt: any) => {
                        const isChecked = (filters as any)[group.key] === opt.value;
                        const isDisabled = opt.disabled;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => !isDisabled && toggleFilter(group.key, opt.value)}
                            disabled={isDisabled}
                            className={`flex items-center gap-4 w-full group text-left py-1.5 transition-opacity ${
                              isDisabled ? 'opacity-35 cursor-not-allowed' : ''
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              isChecked
                                ? 'bg-[#2E4D31] border-[#2E4D31]'
                                : isDisabled
                                  ? 'border-border/40'
                                  : 'border-border'
                            }`}>
                              {isChecked && <X className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`text-sm font-black uppercase tracking-widest transition-colors flex-1 ${
                              isChecked ? 'text-[#2E4D31]' : isDisabled ? 'text-muted-foreground/40' : 'text-muted-foreground'
                            }`}>
                              {opt.label}
                            </span>
                            {opt.count !== undefined && (
                              <span className={`text-[10px] font-bold tabular-nums ${
                                isChecked ? 'text-[#2E4D31]/60' : 'text-muted-foreground/40'
                              }`}>{opt.count}</span>
                            )}
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
                    <div className="space-y-3">
                      {group.options.map((opt: any) => {
                        const isChecked = (filters as any)[group.key] === opt.value;
                        const isDisabled = opt.disabled;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => !isDisabled && toggleFilter(group.key, opt.value)}
                            disabled={isDisabled}
                            className={`flex items-center gap-4 w-full group text-left transition-opacity ${
                              isDisabled ? 'opacity-35 cursor-not-allowed' : ''
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                              isChecked
                                ? 'bg-[#2E4D31] border-[#2E4D31] shadow-sm'
                                : isDisabled
                                  ? 'border-border/40'
                                  : 'border-border group-hover:border-[#2E4D31]'
                            }`}>
                              {isChecked && <X className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-xs font-black uppercase tracking-widest transition-colors flex-1 ${
                              isChecked ? 'text-[#2E4D31]' : isDisabled ? 'text-muted-foreground/40' : 'text-muted-foreground group-hover:text-[#2E4D31]'
                            }`}>
                              {opt.label}
                            </span>
                            {opt.count !== undefined && (
                              <span className={`text-[10px] font-bold tabular-nums ${
                                isChecked ? 'text-[#2E4D31]/60' : 'text-muted-foreground/50'
                              }`}>{opt.count}</span>
                            )}
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
                  {products.map((product, i) => (
                    <div key={product.id} className="contents">

                      <ProductCard product={product} viewMode={viewMode as any} />
                    </div>
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
      {/* Back to Top */}
      <motion.button 
        style={{ opacity: backToTopOpacity }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-14 h-14 rounded-full bg-forest text-cream shadow-button hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-center border-2 border-background pointer-events-auto"
      >
        <Leaf className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default CollectionsPage;
