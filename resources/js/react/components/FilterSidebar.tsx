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
        categories: { id: number; slug: string; name: string; children?: { id: number; slug: string; name: string }[] }[];
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

    // Show category filter if there are options
    const showCategoryFilter = true;

    // Get filter options based on dynamic backend data
    const getFilterOptions = () => {
        const cats = meta?.categories || [];

        // 1. On ALL products page
        if (!currentCategory || currentCategory === 'all') {
            return [
                { value: "", label: "All Products" },
                ...cats.map(c => ({ value: c.slug, label: c.name }))
            ];
        }

        // 2. See if the current URL is a parent category or a child category
        let parentCat = cats.find(c => c.slug === currentCategory);

        if (!parentCat) {
            // Check if it's a child category
            parentCat = cats.find(c => c.children?.some(child => child.slug === currentCategory));
        }

        // 3. If we found a matching parent tree, show "All [Parent]" and its children
        if (parentCat) {
            return [
                { value: parentCat.slug, label: `All ${parentCat.name}` },
                ...(parentCat.children || []).map(child => ({ value: child.slug, label: child.name }))
            ];
        }

        // Fallback default
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
