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

                    {/* Page Header Hero */}
                    <motion.div
                        key={pageTitle}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-[40px] overflow-hidden bg-[#121212] mb-12 min-h-[340px] flex items-center border border-white/5"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
                        <img 
                            src="https://grevia.in/storage/collections_hero.jpg" 
                            alt={pageTitle}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <div className="relative z-20 px-8 py-12 md:px-20 md:py-24 max-w-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-[1px] w-8 bg-lime" />
                                <span className="text-[11px] font-black text-lime uppercase tracking-[0.3em]">Pure Organic Sweeteners</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] capitalize tracking-tighter">
                                {pageTitle}
                            </h1>
                            <p className="text-white/60 text-lg mb-10 leading-relaxed font-medium">
                                {pageDescription}
                            </p>
                            <Button size="xl" variant="lime" className="font-black px-10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(163,230,53,0.3)] shadow-lime/20" onClick={() => {
                                const el = document.getElementById('products-grid');
                                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}>
                                Discover All
                            </Button>
                        </div>
                    </motion.div>

                    {/* Sub-category Pills */}
                    {subCats.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-12">
                            {subCats.map(sc => (
                                <Button
                                    key={sc.slug}
                                    asChild
                                    variant={filters.category === sc.slug ? "lime" : "outline"}
                                    className="rounded-full font-bold"
                                >
                                    <Link to={`/collections/${category}/${sc.slug}`}>{sc.name}</Link>
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Top Level Category Cards - Only show on main collections page */}
                    {!category && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {[
                                { name: "Stevia Powder", slug: "stevia-powder", desc: "Pure sweetness in convenient powder form.", img: "https://grevia.in/storage/category_powder.jpg" },
                                { name: "Stevia Drops", slug: "stevia-drops", desc: "Easy-to-use liquid drops for beverages.", img: "https://grevia.in/storage/category_drops.jpg" },
                                { name: "Monk Fruit", slug: "monk-fruit", desc: "Natural monk fruit for premium baking.", img: "https://grevia.in/storage/category_monk.jpg" },
                            ].map((cat, idx) => (
                                <motion.div
                                    key={cat.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                    className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-secondary/30 border border-border/50"
                                >
                                    <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                        <h3 className="text-2xl font-black text-white mb-2">{cat.name}</h3>
                                        <p className="text-white/70 text-sm mb-6 line-clamp-2">{cat.desc}</p>
                                        <Button asChild variant="lime" className="w-full font-bold">
                                            <Link to={`/collections/${cat.slug}`}>Shop Now</Link>
                                        </Button>
                                    </div>
                                </motion.div>
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
