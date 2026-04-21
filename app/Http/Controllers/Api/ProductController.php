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
            
            // Find the category by slug
            $cat = \App\Models\Category::where('slug', $categorySlug)->first();
            
            if ($cat) {
                if ($cat->is_smart && !empty($cat->rules)) {
                    // Smart Category Engine Mapping
                    $query->where(function($q) use ($cat) {
                        foreach ($cat->rules as $rule) {
                            $field = $rule['field'] ?? null;
                            $operator = $rule['operator'] ?? null;
                            $value = $rule['value'] ?? null;

                            if (!$field || !$operator || $value === null) continue;

                            switch ($operator) {
                                case 'contains':
                                    if ($field === 'tags') {
                                        $q->whereJsonContains('tags', $value);
                                    } else {
                                        $q->where($field, 'like', "%{$value}%");
                                    }
                                    break;
                                case 'not_contains':
                                case 'exclude':
                                    if ($field === 'tags') {
                                        $q->whereJsonDoesntContain('tags', $value);
                                    } else {
                                        $q->where($field, 'not like', "%{$value}%");
                                    }
                                    break;
                                case 'equals':
                                    $q->where($field, $value);
                                    break;
                                case '>=':
                                    $q->where($field, '>=', $value);
                                    break;
                                case '<=':
                                    $q->where($field, '<=', $value);
                                    break;
                            }
                        }
                    });
                } else {
                    // Standard Category Hierarchy lookup
                    $childIds = \App\Models\Category::where('parent_id', $cat->id)->pluck('id')->toArray();
                    $allIds = array_merge([$cat->id], $childIds);
                    $query->whereIn('category_id', $allIds);
                }
            } else {
                // Fallback: mostly for 'search' strings if the frontend still sends weird text
                $query->whereHas('category', function($q) use ($categorySlug) {
                    $q->where('slug', 'like', "%{$categorySlug}%");
                });
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
        if ($request->filled('tags')) {
             $tags = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
             foreach ($tags as $tag) {
                 $query->whereJsonContains('tags', $tag);
             }
        }

        // 6. Regional Visibility
        $userRegion = $request->header('X-User-Region', 'Region_IN');
        $query->where(function($q) use ($userRegion) {
            $q->whereJsonContains('tags', $userRegion)
              ->orWhereJsonLength('tags', 0); // Items with no region tags are visible to all
        });

        // 7. Specialized Sweetener Filters (Using New Dedicated Columns)
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('form')) {
            $query->where('form', $request->form);
        }

        if ($request->filled('ratio')) {
            $query->where('ratio', $request->ratio);
        }

        if ($request->filled('size')) {
            $query->where('size_label', 'like', "%{$request->size}%");
        }

        // 8. Sorting
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
                'categories' => \App\Models\Category::where('show_in_filter', true)
                    ->whereNull('parent_id')
                    ->with(['children' => function($q) {
                        $q->where('show_in_filter', true)->select('id', 'name', 'slug', 'parent_id')->orderBy('order');
                    }])
                    ->orderBy('order')
                    ->select('id', 'name', 'slug')
                    ->get(),
                'types' => [
                    ['label' => 'stevia', 'count' => Product::where('type', 'stevia')->count()],
                    ['label' => 'monk-fruit', 'count' => Product::where('type', 'monk-fruit')->count()],
                ],
                'forms' => [
                    ['label' => 'powder', 'count' => Product::where('form', 'powder')->count()],
                    ['label' => 'drops', 'count' => Product::where('form', 'drops')->count()],
                ],
                'ratios' => [
                    ['label' => '1:10', 'count' => Product::where('ratio', '1:10')->count()],
                    ['label' => '1:50', 'count' => Product::where('ratio', '1:50')->count()],
                ],
                'sizes' => [
                    ['label' => '50g', 'count' => Product::where('size_label', 'like', '%50g%')->count()],
                    ['label' => '100g', 'count' => Product::where('size_label', 'like', '%100g%')->count()],
                ],
            ]
        ]);
    }

    public function show($slug)
    {
        $relationships = ['category', 'gallery', 'mainImage', 'reviews.user', 'reviews.images'];

        // Use new dedicated variant_images table if it exists, otherwise just load variants
        if (\Illuminate\Support\Facades\Schema::hasTable('variant_images')) {
            $relationships[] = 'variants.variantImages';
        } else {
            $relationships[] = 'variants';
        }

        $product = Product::with($relationships)
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($product);
    }
}
