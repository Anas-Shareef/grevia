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
        types?: { label: string; count: number }[];
        forms?: { label: string; count: number }[];
        ratios?: { label: string; count: number }[];
        sizes?: { label: string; count: number }[];
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

            <Accordion type="multiple" defaultValue={["type", "concentration", "size"]} className="w-full border-none">
                {/* Product Type Filter */}
                {meta?.types && (
                    <AccordionItem value="type" className="border-b border-white/5 mb-2">
                        <AccordionTrigger className="hover:no-underline py-4 px-0 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-[#77cb4d] transition-colors">Product Type</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pb-4">
                                {meta.types.map((t) => (
                                    <div key={t.label} className="flex items-center justify-between group cursor-pointer" onClick={() => setFilter("type", filters.type === t.label ? "" : t.label)}>
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${filters.type === t.label ? "bg-[#2E4D31] border-[#2E4D31]" : "bg-transparent border-white/20 group-hover:border-white/40"}`}>
                                                {filters.type === t.label && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <span className={`text-sm font-bold transition-colors capitalize ${filters.type === t.label ? "text-white" : "text-white/50 group-hover:text-white"}`}>
                                                {t.label.replace('-', ' ')}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-white/20 group-hover:text-[#77cb4d]/50 transition-colors">{t.count}</span>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Concentration Filter */}
                {meta?.ratios && (
                    <AccordionItem value="concentration" className="border-b border-white/5 mb-2">
                        <AccordionTrigger className="hover:no-underline py-4 px-0 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-[#77cb4d] transition-colors">Concentration</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pb-4">
                                {meta.ratios.map((r) => {
                                    const isSelected = filters.concentration === r.label;
                                    return (
                                        <div key={r.label} className="flex items-center justify-between group cursor-pointer" onClick={() => setFilter("concentration", isSelected ? "" : r.label)}>
                                            <div className="flex items-center space-x-3">
                                                <Checkbox checked={isSelected} className="border-white/20 data-[state=checked]:bg-[#2E4D31] data-[state=checked]:border-[#2E4D31]" />
                                                <span className={`text-sm font-bold transition-colors ${isSelected ? "text-white" : "text-white/50 group-hover:text-white"}`}>
                                                    {r.label}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-white/20 group-hover:text-[#77cb4d]/50 transition-colors">{r.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Use-Case Filter */}
                <AccordionItem value="use-case" className="border-b border-white/5 mb-2">
                    <AccordionTrigger className="hover:no-underline py-4 px-0 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-[#77cb4d] transition-colors">Best For</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pb-4">
                            {[
                                { label: 'Baking', value: 'UseCase_Baking' },
                                { label: 'Beverages', value: 'UseCase_Beverages' },
                                { label: 'Table-top', value: 'UseCase_Tabletop' },
                            ].map((u) => {
                                const isSelected = filters.tags?.includes(u.value);
                                return (
                                    <div key={u.value} className="flex items-center justify-between group cursor-pointer" onClick={() => {
                                        const currentTags = filters.tags || [];
                                        const newTags = isSelected 
                                            ? currentTags.filter(t => t !== u.value)
                                            : [...currentTags, u.value];
                                        setFilter("tags", newTags);
                                    }}>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox checked={isSelected} className="border-white/20 data-[state=checked]:bg-[#2E4D31] data-[state=checked]:border-[#2E4D31]" />
                                            <span className={`text-sm font-bold transition-colors ${isSelected ? "text-white" : "text-white/50 group-hover:text-white"}`}>
                                                {u.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Pack Size Filter */}
                {meta?.sizes && (
                    <AccordionItem value="size" className="border-b border-white/5">
                        <AccordionTrigger className="hover:no-underline py-4 px-0 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-[#77cb4d] transition-colors">Pack Size</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pb-4">
                                {meta.sizes.map((s) => {
                                    const isSelected = filters.size === s.label;
                                    return (
                                        <div key={s.label} className="flex items-center justify-between group cursor-pointer" onClick={() => setFilter("size", isSelected ? "" : s.label)}>
                                            <div className="flex items-center space-x-3">
                                                <Checkbox checked={isSelected} className="border-white/20 data-[state=checked]:bg-[#2E4D31] data-[state=checked]:border-[#2E4D31]" />
                                                <span className={`text-sm font-bold transition-colors ${isSelected ? "text-white" : "text-white/50 group-hover:text-white"}`}>
                                                    {s.label}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-white/20 group-hover:text-[#77cb4d]/50 transition-colors">{s.count}</span>
                                        </div>
                                    );
                                })}
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
            <div className={`hidden lg:block w-72 flex-shrink-0 ${props.className}`}>
                <div className="sticky top-28 bg-[#121212] border border-white/5 rounded-[32px] p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-lime rounded-full" />
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Filters</h2>
                        </div>
                        <button onClick={props.resetFilters} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-lime transition-colors">
                            Clear
                        </button>
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
