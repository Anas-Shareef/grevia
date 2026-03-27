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
        types?: string[];
        forms?: string[];
        ratios?: string[];
        sizes?: string[];
    } | undefined;
    className?: string;
    currentCategory?: string; // Current category from route
};

const FilterContent = ({ filters, setFilter, meta, currentCategory }: FilterSidebarProps) => {
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
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground border-b pb-2">Category</h3>
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

            <Accordion type="multiple" defaultValue={["type", "form", "ratio", "size"]} className="w-full">
                {/* Type Filter */}
                {meta?.types && (
                    <AccordionItem value="type" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-3 px-0 font-bold text-sm uppercase tracking-wider">Type</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {meta.types.map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`type-${type}`}
                                            checked={filters.type === type}
                                            onCheckedChange={() => setFilter("type", filters.type === type ? "" : type)}
                                        />
                                        <label htmlFor={`type-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer">
                                            {type.replace('-', ' ')}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Form Filter */}
                {meta?.forms && (
                    <AccordionItem value="form" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-3 px-0 font-bold text-sm uppercase tracking-wider">Form</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {meta.forms.map((form) => (
                                    <div key={form} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`form-${form}`}
                                            checked={filters.form === form}
                                            onCheckedChange={() => setFilter("form", filters.form === form ? "" : form)}
                                        />
                                        <label htmlFor={`form-${form}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer">
                                            {form}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Ratio Filter */}
                {meta?.ratios && (
                    <AccordionItem value="ratio" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-3 px-0 font-bold text-sm uppercase tracking-wider">Strength / Ratio</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {meta.ratios.map((ratio) => (
                                    <div key={ratio} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`ratio-${ratio}`}
                                            checked={filters.ratio === ratio}
                                            onCheckedChange={() => setFilter("ratio", filters.ratio === ratio ? "" : ratio)}
                                        />
                                        <label htmlFor={`ratio-${ratio}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                            {ratio} Strength
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Size Filter */}
                {meta?.sizes && (
                    <AccordionItem value="size" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-3 px-0 font-bold text-sm uppercase tracking-wider">Size / Weight</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {meta.sizes.map((size) => (
                                    <div key={size} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`size-${size}`}
                                            checked={filters.size === size}
                                            onCheckedChange={() => setFilter("size", filters.size === size ? "" : size)}
                                        />
                                        <label htmlFor={`size-${size}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                            {size}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
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
