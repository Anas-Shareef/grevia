import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FilterState } from "@/hooks/useProductFilters";

type FilterSidebarProps = {
    filters: FilterState;
    setFilter: (key: keyof FilterState, value: any) => void;
    resetFilters: () => void;
    meta: {
        price: { min: number; max: number };
        categories: { id: number; slug: string; name: string }[];
    } | undefined;
    className?: string;
    currentCategory?: string; // Current category from route
};

const FilterContent = ({ filters, setFilter, meta, currentCategory }: Omit<FilterSidebarProps, "resetFilters" | "className">) => {
    const [priceRange, setPriceRange] = useState([0, 1000]);

    useEffect(() => {
        if (meta?.price) {
            setPriceRange([
                filters.min_price ? Number(filters.min_price) : meta.price.min,
                filters.max_price ? Number(filters.max_price) : meta.price.max
            ]);
        }
    }, [filters.min_price, filters.max_price, meta?.price]);

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value);
    };

    const handlePriceCommit = (value: number[]) => {
        setFilter("min_price", value[0]);
        setFilter("max_price", value[1]);
    }

    // Show category filter on collections page, sweeteners page, and other-products page
    const showCategoryFilter = !currentCategory || currentCategory === 'sweeteners' || currentCategory === 'other-products';

    // Get filter options based on context
    const getFilterOptions = () => {
        if (!currentCategory) {
            // On /collections/all - show all main categories
            return [
                { value: "", label: "All Products" },
                { value: "sweeteners", label: "All Sweeteners" },
                { value: "bakery", label: "Bakery Items" },
                { value: "pickles", label: "Pickles & Preserves" },
            ];
        } else if (currentCategory === 'sweeteners') {
            // On /products/sweeteners - show sweetener subcategories
            return [
                { value: "", label: "All Sweeteners" },
                { value: "stevia", label: "Stevia Sweeteners" },
                { value: "monkfruit", label: "Monkfruit Sweeteners" },
            ];
        } else if (currentCategory === 'other-products') {
            // On /products/other-products - show other product categories
            return [
                { value: "", label: "All Other Products" },
                { value: "bakery", label: "Bakery Items" },
                { value: "pickles", label: "Pickles & Preserves" },
            ];
        }
        return [];
    };

    const filterOptions = getFilterOptions();

    return (
        <div className="space-y-6">
            {showCategoryFilter && filterOptions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-semibold mb-2">Category</h3>
                    <select
                        value={filters.category}
                        onChange={(e) => setFilter("category", e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export const FilterSidebar = (props: FilterSidebarProps) => {
    return (
        <>
            {/* Desktop Sidebar */}
            <div className={`hidden lg:block w-64 flex-shrink-0 ${props.className}`}>
                <div className="sticky top-24 bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Filters</h2>
                        <Button variant="ghost" size="sm" onClick={props.resetFilters} className="h-auto p-0 text-muted-foreground hover:text-primary">
                            Reset
                        </Button>
                    </div>
                    <FilterContent {...props} />
                </div>
            </div>

            {/* Mobile Drawer */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="w-4 h-4" /> Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] overflow-y-auto">
                        <SheetHeader className="mb-6 text-left">
                            <SheetTitle>Filters</SheetTitle>
                            <Button variant="ghost" size="sm" onClick={props.resetFilters} className="absolute right-4 top-4">
                                Reset
                            </Button>
                        </SheetHeader>
                        <FilterContent {...props} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};
