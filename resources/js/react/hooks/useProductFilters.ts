import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export type FilterState = {
    search: string;
    category: string;
    min_price: string;
    max_price: string;
    tags: string[];
    rating: string;
    sort_by: string;
    page: string;
    in_stock: string;
};

export const useProductFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo((): FilterState => {
        return {
            search: searchParams.get("search") || "",
            category: searchParams.get("category") || "",
            min_price: searchParams.get("min_price") || "",
            max_price: searchParams.get("max_price") || "",
            tags: searchParams.getAll("tags") || [],
            rating: searchParams.get("rating") || "",
            sort_by: searchParams.get("sort_by") || "newest",
            page: searchParams.get("page") || "1",
            in_stock: searchParams.get("in_stock") || "",
        };
    }, [searchParams]);

    const setFilter = useCallback((key: keyof FilterState, value: any) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            if (key === "tags") {
                // Handle tags array specifically if passed as array
                newParams.delete("tags");
                if (Array.isArray(value)) {
                    value.forEach(tag => newParams.append("tags", tag));
                }
            } else if (value === null || value === undefined || value === "") {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }

            // Reset page on filter change (except pagination itself)
            if (key !== "page") {
                newParams.set("page", "1");
            }

            return newParams;
        });
    }, [setSearchParams]);

    const resetFilters = useCallback(() => {
        setSearchParams(new URLSearchParams());
    }, [setSearchParams]);

    return { filters, setFilter, resetFilters };
};
