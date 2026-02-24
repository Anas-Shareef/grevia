import { useQuery } from "@tanstack/react-query";
import { api, STORAGE_URL } from "@/lib/api";
import { Product } from "@/data/products";

// Helper to handle various image path formats
const getImageUrl = (path: string | null | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // If path starts with /storage (internal relative path from Laravel)
    if (path.startsWith('/storage')) {
        // Strip /storage suffix from base URL if present to avoid duplication
        const baseUrl = STORAGE_URL.endsWith('/storage') ? STORAGE_URL.slice(0, -8) : STORAGE_URL;
        return `${baseUrl}${path}`;
    }

    // If path is just a filename (legacy)
    const baseUrl = STORAGE_URL.endsWith('/') ? STORAGE_URL.slice(0, -1) : STORAGE_URL;
    return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
};

// Helper to transform backend product to frontend product
const transformProduct = (data: any): Product => {
    return {
        id: data.slug || data.id,
        dbId: data.id,
        name: data.name,
        description: data.description,
        longDescription: data.long_description || data.description,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        rating: Number(data.rating),
        reviews: data.reviews_count || 0,
        image: getImageUrl(data.image) || (Array.isArray(data.gallery) && data.gallery.length > 0 ? getImageUrl(data.gallery[0].url || data.gallery[0].image_path) : ''),
        images: Array.isArray(data.images) ? data.images.map(getImageUrl) : [],
        category: data.category?.slug || 'sweeteners',
        subcategory: data.subcategory,
        badge: data.badge,
        inStock: Boolean(data.in_stock),
        gallery: Array.isArray(data.gallery) ? data.gallery.map((img: any) => ({
            id: img.id,
            url: getImageUrl(img.url || img.image_path),
            is_main: Boolean(img.is_main),
            sort_order: Number(img.sort_order)
        })) : [],
        mainImage: data.mainImage
            ? { url: getImageUrl(data.mainImage.url || data.mainImage.image_path) }
            : (Array.isArray(data.gallery) && data.gallery.length > 0 ? { url: getImageUrl(data.gallery[0].url || data.gallery[0].image_path) } : undefined),
        variants: Array.isArray(data.variants) ? data.variants.map((v: any) => ({
            ...v,
            price: Number(v.price),
            discount_price: v.discount_price ? Number(v.discount_price) : undefined,
            image_url: v.image_path ? getImageUrl(v.image_path) : undefined,
            images: Array.isArray(v.images) ? v.images.map((img: any) => ({
                id: img.id,
                url: getImageUrl(img.image_path),
                is_main: Boolean(img.is_main),
                sort_order: Number(img.sort_order)
            })) : []
        })) : [],
    };
};

import { FilterState } from "./useProductFilters";

export const useProducts = (filters?: Partial<FilterState>) => {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach(v => queryParams.append(`${key}[]`, v));
                    } else if (value !== null && value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });
            }

            const response = await api.get(`/products?${queryParams.toString()}`);

            // Handle new paginated response structure
            if (response.data && Array.isArray(response.data)) {
                return {
                    data: response.data.map(transformProduct),
                    meta: response.meta,
                    filters: response.filters
                };
            }

            // Fallback for simple array response (if any legacy support needed)
            if (Array.isArray(response)) {
                return response.map(transformProduct);
            }

            return { data: [], meta: {}, filters: {} };
        },
    });
};

export const useProduct = (slug: string) => {
    return useQuery({
        queryKey: ["product", slug],
        queryFn: async () => {
            const data = await api.get(`/products/${slug}`);
            return transformProduct(data);
        },
        enabled: !!slug,
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const data = await api.get("/categories");
            return data;
        }
    });
}
