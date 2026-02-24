import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ArrowLeft } from "lucide-react";
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

const ProductsPage = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const { addToCart } = useCart();
  const { filters, setFilter, resetFilters } = useProductFilters();

  // Initialize filters with query params or route params
  // If route has category, we should enforce it? 
  // Ideally useProductFilters should sync with URL, but /products/:category route param might conflict with ?category query param if we aren't careful.
  // We will prioritize route param for the base category.

  // Actually, we should probably merge route category into filters if not present?
  // Or just pass it explicitly to useProducts alongside filters?
  // Let's pass it by overriding filters.category with route param if present.

  // If we're on a category route, filter by that category
  // Special handling for sweeteners and other-products pages:
  // - If filter is set (even to empty string), use it but map empty to the parent category
  // - If no filter is set, use the route category
  const effectiveFilters = {
    ...filters,
    category: (() => {
      if (filters.category !== undefined && filters.category !== null) {
        // Filter was explicitly set
        if (filters.category === "" && category === "sweeteners") {
          // "All Sweeteners" selected - show all sweeteners
          return "sweeteners";
        } else if (filters.category === "" && category === "other-products") {
          // "All Other Products" selected - show bakery and pickles
          return "other-products";
        }
        // Use the selected filter value
        return filters.category;
      }
      // No filter set, use route category
      return category || "";
    })()
  };

  const { data: response, isLoading: isProductsLoading } = useProducts(effectiveFilters);
  const { data: allCategories, isLoading: isCategoriesLoading } = useCategories();

  if (isProductsLoading || isCategoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 min-h-[50vh] flex items-center justify-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  const products = Array.isArray(response) ? response : response?.data || [];

  // Find category data for header info
  const findCategory = (id: string) => allCategories?.find((c: any) => c.slug === id || c.id === id);
  let categoryData = findCategory(subcategory || category || "");
  let pageTitle = categoryData?.name || (category ? category.charAt(0).toUpperCase() + category.slice(1) : "Products");
  let pageDescription = categoryData?.description || "";

  // Handle specific overrides
  if (category === "sweeteners" && subcategory) {
    pageTitle = subcategory === "stevia" ? "Stevia Sweeteners" : "Monkfruit Sweeteners";
  } else if (category === "other-products") {
    pageTitle = "Other Products";
    pageDescription = "Explore our range of bakery items and pickles & preserves.";
  }

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
              {subcategory ? (
                <>
                  <Link to="/products/sweeteners" className="hover:text-primary transition-colors">
                    Sweeteners
                  </Link>
                  <span>/</span>
                  <span className="text-foreground">{pageTitle}</span>
                </>
              ) : (
                <span className="text-foreground">{pageTitle}</span>
              )}
            </div>
          </motion.div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-8 md:mb-12 px-4"
          >
            <span className="inline-block text-xs sm:text-sm font-bold text-lime uppercase tracking-widest mb-3 md:mb-4">
              Our Collection
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-3 md:mb-4">
              {pageTitle}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              {pageDescription}
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                setFilter={setFilter}
                resetFilters={resetFilters}
                meta={!Array.isArray(response) ? response?.filters : undefined}
                currentCategory={category}
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
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
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
                      />
                    </Link>

                    <div className="p-6">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-foreground">
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
                            <span className="text-xs font-bold text-lime uppercase tracking-wider">
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
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No products found in this category.</p>
                  <Button variant="link" onClick={resetFilters}>Clear filters</Button>
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

export default ProductsPage;
