import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import WishlistButton from "@/components/WishlistButton";
import { useProductFilters } from "@/hooks/useProductFilters";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SortDropdown } from "@/components/SortDropdown";
import { AvailabilityFilter } from "@/components/AvailabilityFilter";
import { ProductCard } from "@/components/ProductCard";
import { X } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    },
};

const CollectionsPage = () => {
    const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
    const { addToCart } = useCart();
    const { filters, setFilter, resetFilters } = useProductFilters();
    const { data: categories } = useCategories();

    // Sync route param with filters
    useEffect(() => {
        if (subcategory) {
            setFilter("category", subcategory);
        } else if (category) {
            setFilter("category", category);
        } else if (filters.category === "" && !category && !subcategory) {
            // Default to all or something?
            // For now leave as is
        }
    }, [category, subcategory, setFilter, filters.category]);

    const { data: response, isLoading } = useProducts(filters);

    // Handle both array response (old) and paginated response (new) to be safe during transition
    const products = Array.isArray(response) ? response : response?.data || [];
    const meta = !Array.isArray(response) ? response?.filters : undefined;

    // Find current category data
    const findCategory = (slug?: string) => {
        if (!slug) return null;
        // Search in top level
        let cat = categories?.find(c => c.slug === slug);
        if (cat) return cat;
        // Search in children
        for (const top of (categories || [])) {
            const child = top.children?.find(c => c.slug === slug);
            if (child) return child;
        }
        return null;
    };

    const currentCatData = findCategory(subcategory || category || filters.category);
    const pageTitle = currentCatData?.name || "Our Collection";
    const pageDescription = currentCatData?.description || "Experience the pure taste of nature with our premium organic sweeteners. Zero calories, zero guilt, endless flavor.";

    // Sub-category pills (e.g. 1:10, 1:50)
    const subCats = currentCatData?.children || [];

    // ACTIVE FILTERS LOGIC
    const activeFilters = useMemo(() => {
        const list = [];
        if (filters.type) list.push({ key: 'type', label: filters.type, value: filters.type });
        if (filters.form) list.push({ key: 'form', label: filters.form, value: filters.form });
        if (filters.ratio) list.push({ key: 'ratio', label: filters.ratio, value: filters.ratio });
        if (filters.size) list.push({ key: 'size', label: filters.size, value: filters.size });
        if (filters.category && filters.category !== category) {
            const cat = findCategory(filters.category);
            if (cat) list.push({ key: 'category', label: cat.name, value: filters.category });
        }
        return list;
    }, [filters, category, categories]);

    const handleRemoveFilter = (key: string) => {
        setFilter(key as any, "");
    };

    const handleAddToCart = (product: Product) => {
        let variantId = undefined;
        if (product.variants && product.variants.length > 0) {
            const cheapest = [...product.variants]
                .filter(v => v.status === 'active')
                .sort((a, b) => Number(a.discount_price || a.price) - Number(b.discount_price || b.price))[0];
            variantId = cheapest?.id;
        }

        addToCart(product, 1, variantId);
        toast.success(`${product.name} added to cart!`, {
            duration: 2000,
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-24 pb-16 flex justify-center items-center">
                    <div className="animate-pulse">Loading products...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Breadcrumbs */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/30">
                            <Link to="/" className="hover:text-lime transition-colors">Home</Link>
                            <span>/</span>
                            <Link to="/collections" className="hover:text-lime transition-colors">Collections</Link>
                            {category && (
                                <>
                                    <span>/</span>
                                    <Link to={`/collections/${category}`} className="hover:text-lime transition-colors">
                                        {category.replace('-', ' ')}
                                    </Link>
                                </>
                            )}
                            {subcategory && (
                                <>
                                    <span>/</span>
                                    <span className="text-white border-b border-lime/50">{subcategory.replace('-', ' ')}</span>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Page Header Hero - High Conversion */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-[48px] overflow-hidden bg-[#0d1f0e] mb-12 min-h-[440px] flex items-center border border-[#2d7a3a33] group"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2d7a3a] opacity-10 blur-[120px] -mr-32 -mt-32 transition-all duration-1000 group-hover:opacity-20" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime/5 blur-[80px]" />
                        
                        <div className="relative z-20 px-8 py-12 md:px-20 flex flex-col md:flex-row items-center justify-between w-full gap-12">
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="px-3 py-1 rounded-full bg-lime/10 border border-lime/20 text-[10px] font-black text-lime uppercase tracking-[0.2em]">
                                        Natural Sweeteners
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter text-white">
                                    Sweetness <br />
                                    <span className="text-[#97c459]">Without Sacrifice.</span>
                                </h1>
                                <p className="text-white/50 text-xl mb-10 leading-relaxed max-w-lg">
                                    Zero-calorie, plant-based alternatives to sugar. Crafted for health, designed for taste.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button size="xl" variant="lime" className="font-black px-12 h-16 rounded-2xl shadow-2xl shadow-lime/20" onClick={() => {
                                        const el = document.getElementById('products-grid');
                                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}>
                                        SHOP ALL PRODUCTS
                                    </Button>
                                    <Button size="xl" variant="outline" className="font-black px-10 h-16 rounded-2xl border-white/10 hover:bg-white/5">
                                        OUR STORY
                                    </Button>
                                </div>
                            </div>

                            {/* Stats Badges */}
                            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-[32px] flex flex-col items-center justify-center text-center min-w-[160px] group/stat hover:border-lime/40 transition-all">
                                    <span className="text-4xl font-black text-white mb-1 group-hover/stat:scale-110 transition-transform">0</span>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Calories</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-[32px] flex flex-col items-center justify-center text-center min-w-[160px] group/stat hover:border-lime/40 transition-all">
                                    <span className="text-4xl font-black text-[#97c459] mb-1 group-hover/stat:scale-110 transition-transform">100%</span>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Natural</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Category Shortcut Cards */}
                    {!category && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                            {[
                                { 
                                    name: "Stevia Powder", 
                                    icon: "🌿", 
                                    slug: "stevia-powder", 
                                    desc: "Perfect for tea, coffee & baking.", 
                                    count: "6 Products" 
                                },
                                { 
                                    name: "Stevia Drops", 
                                    icon: "💧", 
                                    slug: "stevia-drops", 
                                    desc: "Convenient liquid drops on the go.", 
                                    count: "2 Products" 
                                },
                                { 
                                    name: "Monk Fruit", 
                                    icon: "🍈", 
                                    slug: "monk-fruit", 
                                    desc: "Premium ancient calorie-free sweetness.", 
                                    count: "2 Products" 
                                },
                            ].map((cat, idx) => (
                                <Link 
                                    key={cat.name}
                                    to={`/collections/${cat.slug}`}
                                    className="group relative bg-[#1a2e1b] border border-[#2d7a3a22] hover:border-[#2d7a3a99] p-8 rounded-[32px] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 text-[10px] font-black text-[#2d7a3a] uppercase tracking-widest">
                                        {cat.count}
                                    </div>
                                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500 inline-block">
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 flex items-center gap-2">
                                        {cat.name}
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-lime text-base translate-x-2 group-hover:translate-x-0">→</span>
                                    </h3>
                                    <p className="text-white/40 text-sm leading-relaxed mb-6 italic">
                                        {cat.desc}
                                    </p>
                                    <span className="text-[10px] font-black text-lime uppercase tracking-[0.2em] group-hover:underline">Explore Category</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div id="products-grid" className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Sidebar - Hidden on mobile */}
                        <div className="hidden lg:block">
                            <FilterSidebar
                                filters={filters}
                                setFilter={setFilter}
                                resetFilters={resetFilters}
                                meta={(response as any)?.filters}
                                currentCategory={undefined}
                            />
                        </div>

                        <div className="flex-1 px-4 lg:px-0">
                            {/* Active Filter Tags */}
                            {activeFilters.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {activeFilters.map((f) => (
                                        <button
                                            key={`${f.key}-${f.value}`}
                                            onClick={() => handleRemoveFilter(f.key)}
                                            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-lime/30 px-3 py-1.5 rounded-full text-[11px] font-bold text-white/70 hover:text-white transition-all group"
                                        >
                                            <span className="capitalize">{f.label.replace('-', ' ')}</span>
                                            <X className="w-3 h-3 text-white/30 group-hover:text-lime transition-colors" />
                                        </button>
                                    ))}
                                    <button
                                        onClick={resetFilters}
                                        className="text-[11px] font-bold text-lime hover:underline px-2 py-1.5"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            )}

                            {/* Products Grid */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
                            >
                                {products.map((product: Product) => (
                                    <motion.div key={product.id} variants={itemVariants}>
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {products.length === 0 && (
                                <div className="text-center py-16 bg-gray-50 rounded-xl">
                                    <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
                                    <Button variant="link" onClick={resetFilters}>Clear all filters</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CollectionsPage;
