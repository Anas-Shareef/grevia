<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'gallery', 'mainImage'])
            ->where('in_stock', true);

        // 1. Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 2. Featured Filter
        if ($request->filled('featured')) {
            $query->where('is_featured', true);
        }

        // 3. Category Filter
        if ($request->filled('category')) {
            $categorySlug = $request->category;
            
            // Special handling for "other-products" - show bakery and pickles
            if ($categorySlug === 'other-products') {
                $query->whereHas('category', function($q) {
                    $q->whereIn('slug', ['bakery', 'pickles']);
                });
            } 
            // Check if it's a subcategory (stevia, monkfruit)
            elseif (in_array($categorySlug, ['stevia', 'monkfruit'])) {
                 // Try to match by Category Slug OR Subcategory text field (hybrid approach)
                 $query->where(function($q) use ($categorySlug) {
                    $q->whereHas('category', fn($c) => $c->where('slug', $categorySlug))
                      ->orWhere('subcategory', $categorySlug);
                 });
            } 
            else {
                // Robust Category Filtering: Include Children
                // 1. Find the category by slug (Exact match)
                $cat = \App\Models\Category::where('slug', $categorySlug)->first();
                
                // 2. Fallback: Fuzzy match (e.g. 'sweeteners' finds 'premium-sweeteners')
                if (!$cat) {
                    $cat = \App\Models\Category::where('slug', 'like', "%{$categorySlug}%")->first();
                }

                if ($cat) {
                    // Get this category ID and all its children IDs
                    $ids = \App\Models\Category::where('id', $cat->id)
                        ->orWhere('parent_id', $cat->id)
                        ->pluck('id');
                    
                    $query->whereIn('category_id', $ids);
                } else {
                    // Fallback to strict slug match if not found (or id)
                     $query->whereHas('category', function($q) use ($categorySlug) {
                        $q->where('slug', $categorySlug)->orWhere('id', $categorySlug);
                    });
                }
            }
        }

        // 3. Price Filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // 4. Availability Filter (in_stock)
        if ($request->filled('in_stock')) {
            $inStockValue = $request->in_stock;
            if ($inStockValue === 'in_stock') {
                $query->where('in_stock', true);
            } elseif ($inStockValue === 'out_of_stock') {
                $query->where('in_stock', false);
            }
            // If 'all' or empty, don't filter
        }

        // 5. Rating Filter
        if ($request->filled('rating')) {
             $query->where('rating', '>=', $request->rating);
        }

        // 5. Tags (JSON column 'ingredients' or 'tags'?)
        // Assuming 'tags' column exists as JSON, if not we will migrate.
        if ($request->filled('tags')) {
             $tags = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
             foreach ($tags as $tag) {
                 $query->whereJsonContains('tags', $tag);
             }
        }

        // 6. Sorting
        $sortBy = $request->get('sort_by', 'newest');
        switch ($sortBy) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // Filter Metadata (Aggregation)
        // We do this on a separate clone or simple query to get global ranges
        // But optimally we return range of *current* search if requested?
        // Usually global range is better for sliders limits.
        $minPrice = Product::where('in_stock', true)->min('price') ?? 0;
        $maxPrice = Product::where('in_stock', true)->max('price') ?? 1000;
        // Tags list? We might need to distinct all tags if json... heavy op.
        // For now hardcode or separate API.

        $products = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
                'per_page' => $products->perPage(),
            ],
            'filters' => [
                'price' => [
                    'min' => (float)$minPrice,
                    'max' => (float)$maxPrice,
                ],
                'categories' => \App\Models\Category::select('id', 'name', 'slug')->get(),
                // 'tags' => ... // TODO: extract tags
            ]
        ]);
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'gallery', 'mainImage', 'variants.images', 'reviews.user', 'reviews.images'])
            ->where('slug', $slug)
            ->firstOrFail();
            
        return response()->json($product);
    }
}
