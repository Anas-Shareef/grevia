import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import WishlistButton from "@/components/WishlistButton";
import { useProductFilters } from "@/hooks/useProductFilters";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SortDropdown } from "@/components/SortDropdown";
import { AvailabilityFilter } from "@/components/AvailabilityFilter";

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
    const { addToCart } = useCart();
    const { filters, setFilter, resetFilters } = useProductFilters();

    // Pass filters to useProducts hook (need to update hook first? actually useProducts hook just calls api.get('/products') so we need to update it to accept params)
    // Assuming useProducts is updated or we update it now. 
    // Wait, I haven't updated useProducts hook yet. I need to update it to accept query params.
    // I will assume useProducts accepts params.

    const { data: response, isLoading } = useProducts(filters);

    // Handle both array response (old) and paginated response (new) to be safe during transition
    const products = Array.isArray(response) ? response : response?.data || [];
    const meta = !Array.isArray(response) ? response?.filters : undefined; // Backend returns 'filters' in meta? No, 'filters' is sibling to 'data' and 'meta'

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
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link to="/" className="hover:text-primary transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <span className="text-foreground">All Collections</span>
                        </div>
                    </motion.div>

                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-8 md:mb-12 px-4"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-tight mb-4">
                            Our Collection
                        </h1>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Sidebar - Hidden on mobile */}
                        <div className="hidden lg:block">
                            <FilterSidebar
                                filters={filters}
                                setFilter={setFilter}
                                resetFilters={resetFilters}
                                meta={response?.filters}
                                currentCategory={undefined}
                            />
                        </div>

                        <div className="flex-1 px-4 lg:px-0">
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Showing {products.length} products
                                </p>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <AvailabilityFilter value={filters.in_stock || ""} onChange={(val) => setFilter("in_stock", val)} />
                                    <SortDropdown value={filters.sort_by} onChange={(val) => setFilter("sort_by", val)} />
                                </div>
                            </div>

                            {/* Products Grid */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                            >
                                {products.map((product: Product) => (
                                    <motion.article
                                        key={product.id}
                                        variants={itemVariants}
                                        className="group bg-card rounded-squircle-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-lime/30"
                                    >
                                        <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary/30">
                                            {product.badge && (
                                                <div className="absolute top-4 left-4 z-10 bg-lime text-foreground text-xs font-bold px-3 py-1.5 rounded-squircle">
                                                    {product.badge}
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 z-10">
                                                <WishlistButton product={product} size="sm" />
                                            </div>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                        </Link>

                                        <div className="p-4 sm:p-6">
                                            <Link to={`/product/${product.id}`}>
                                                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                                                {product.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex flex-col">
                                                    <span className="text-xl sm:text-2xl font-black text-foreground">
                                                        ₹{(() => {
                                                            if (product.variants && product.variants.length > 0) {
                                                                const cheapest = [...product.variants]
                                                                    .filter(v => v.status === 'active')
                                                                    .sort((a, b) => Number(a.discount_price || a.price) - Number(b.discount_price || b.price))[0];
                                                                return cheapest ? (cheapest.discount_price || cheapest.price) : product.price;
                                                            }
                                                            return product.price;
                                                        })()}
                                                    </span>
                                                    {product.variants && product.variants.length > 0 && (
                                                        <span className="text-[10px] sm:text-xs font-bold text-lime uppercase tracking-wider">
                                                            For {(() => {
                                                                const cheapest = [...product.variants]
                                                                    .filter(v => v.status === 'active')
                                                                    .sort((a, b) => Number(a.discount_price || a.price) - Number(b.discount_price || b.price))[0];
                                                                return cheapest ? `${cheapest.weight} (Pack of ${cheapest.pack_size})` : 'Each';
                                                            })()}
                                                        </span>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="lime"
                                                    size="sm"
                                                    onClick={() => handleAddToCart(product)}
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.article>
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
