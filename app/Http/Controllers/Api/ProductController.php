<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'gallery', 'mainImage'])
            ->where('in_stock', true);

        // ── 1. Search ──────────────────────────────────────────────────
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // ── 2. Featured ────────────────────────────────────────────────
        if ($request->filled('featured')) {
            $query->where('is_featured', true);
        }

        // ── 3. Strict Category Filter (recursive child lookup) ─────────
        $cat = null;
        if ($request->filled('category')) {
            $categorySlug = $request->category;
            $cat = Category::where('slug', $categorySlug)->first();

            if ($cat) {
                $categoryIds = collect([$cat->id]);
                $getChildren = function ($category) use (&$getChildren, &$categoryIds) {
                    foreach ($category->children as $child) {
                        $categoryIds->push($child->id);
                        $getChildren($child);
                    }
                };
                $cat->loadMissing('children.children'); // eager load 2 levels
                $getChildren($cat);

                $query->whereIn('category_id', $categoryIds->unique()->toArray());
            } else {
                // Fallback: search by tag or subcategory string
                $query->where(function ($q) use ($categorySlug) {
                    $q->where('subcategory', 'like', "%{$categorySlug}%")
                      ->orWhereJsonContains('tags', $categorySlug)
                      ->orWhereJsonContains('tags', 'sweetener-' . $categorySlug);
                });
            }
        }

        // ── 4. Price Filter ────────────────────────────────────────────
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // ── 5. In-Stock Filter ─────────────────────────────────────────
        if ($request->filled('in_stock')) {
            if ($request->in_stock === 'in_stock') {
                $query->where('in_stock', true);
            } elseif ($request->in_stock === 'out_of_stock') {
                $query->where('in_stock', false);
            }
        }

        // ── 6. Rating Filter ───────────────────────────────────────────
        if ($request->filled('rating')) {
            $query->where('rating', '>=', $request->rating);
        }

        // ── 7. Tags Filter (JSON array) ────────────────────────────────
        if ($request->filled('tags')) {
            $tags = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
            foreach ($tags as $tag) {
                $query->whereJsonContains('tags', trim($tag));
            }
        }

        // ── 8. Certification Filter (from normalized tags) ─────────────
        if ($request->filled('certification')) {
            $cert = 'cert-' . strtolower($request->certification);
            $query->whereJsonContains('tags', $cert);
        }

        // ── 9. Use-Case Filter ─────────────────────────────────────────
        if ($request->filled('use_case')) {
            $useTag = 'use-' . strtolower(str_replace(' ', '-', $request->use_case));
            $query->where(function ($q) use ($useTag, $request) {
                $q->where('use_case', 'like', '%' . $request->use_case . '%')
                  ->orWhereJsonContains('tags', $useTag);
            });
        }

        // ── 10. Regional Visibility ────────────────────────────────────
        $userRegion = $request->header('X-User-Region', 'Region_IN');
        $query->where(function ($q) use ($userRegion) {
            $q->whereJsonContains('tags', $userRegion)
              ->orWhereJsonLength('tags', 0);
        });

        // ── 11. Specialized Product Attribute Filters ──────────────────
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

        // ── 12. Sorting ────────────────────────────────────────────────
        // Accept both PRD format (price_asc/price_desc) and internal format (price_low/price_high)
        $sortBy = $request->get('sort_by', 'newest');
        switch ($sortBy) {
            case 'price_asc':
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'featured':
                $query->orderBy('is_featured', 'desc')->orderBy('created_at', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // ── 13. Filter Metadata Aggregation ───────────────────────────
        $minPrice = Product::where('in_stock', true)->min('price') ?? 0;
        $maxPrice = Product::where('in_stock', true)->max('price') ?? 1000;

        $products = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'total'        => $products->total(),
                'per_page'     => $products->perPage(),
            ],
            'current_category' => $cat ? $cat->load('parent') : null,
            'filters' => [
                'price' => [
                    'min' => (float) $minPrice,
                    'max' => (float) $maxPrice,
                ],
                // Category tree for collection page tiles
                'categories' => Category::where('show_in_filter', true)
                    ->whereNull('parent_id')
                    ->with(['children' => function ($q) {
                        $q->where('show_in_filter', true)
                          ->withCount('products')
                          ->select('id', 'name', 'slug', 'parent_id', 'icon', 'hero_banner', 'description')
                          ->orderBy('order');
                    }])
                    ->withCount('products')
                    ->orderBy('order')
                    ->select('id', 'name', 'slug', 'icon', 'hero_banner', 'description')
                    ->get(),
                // Sweetener type facets
                'types' => [
                    ['label' => 'stevia',      'display' => 'Stevia',       'count' => Product::where('in_stock', true)->where('type', 'stevia')->count()],
                    ['label' => 'monk-fruit',  'display' => 'Monk Fruit',   'count' => Product::where('in_stock', true)->where('type', 'monk-fruit')->count()],
                ],
                // Form factor facets
                'forms' => [
                    ['label' => 'powder', 'display' => 'Powder', 'count' => Product::where('in_stock', true)->where('form', 'powder')->count()],
                    ['label' => 'drops',  'display' => 'Drops',  'count' => Product::where('in_stock', true)->where('form', 'drops')->count()],
                ],
                // Concentration ratio facets
                'ratios' => [
                    ['label' => '1:10',  'display' => '1:10 (High Potency)',  'count' => Product::where('in_stock', true)->where('ratio', '1:10')->count()],
                    ['label' => '1:50',  'display' => '1:50 (Medium)',        'count' => Product::where('in_stock', true)->where('ratio', '1:50')->count()],
                    ['label' => '1:100', 'display' => '1:100 (Mild)',         'count' => Product::where('in_stock', true)->where('ratio', '1:100')->count()],
                ],
                // Pack sizes
                'sizes' => [
                    ['label' => '50g',  'count' => Product::where('in_stock', true)->where('size_label', 'like', '%50g%')->count()],
                    ['label' => '100g', 'count' => Product::where('in_stock', true)->where('size_label', 'like', '%100g%')->count()],
                    ['label' => '200g', 'count' => Product::where('in_stock', true)->where('size_label', 'like', '%200g%')->count()],
                    ['label' => '50ml', 'count' => Product::where('in_stock', true)->where('size_label', 'like', '%50ml%')->count()],
                    ['label' => '100ml','count' => Product::where('in_stock', true)->where('size_label', 'like', '%100ml%')->count()],
                ],
                // Certifications (tag-based)
                'certifications' => [
                    ['label' => 'cert-organic', 'display' => '100% Organic',  'count' => Product::where('in_stock', true)->whereJsonContains('tags', 'cert-organic')->count()],
                    ['label' => 'cert-nongmo',  'display' => 'Non-GMO',       'count' => Product::where('in_stock', true)->whereJsonContains('tags', 'cert-nongmo')->count()],
                    ['label' => 'cert-vegan',   'display' => 'Vegan',         'count' => Product::where('in_stock', true)->whereJsonContains('tags', 'cert-vegan')->count()],
                ],
                // Use-case facets
                'use_cases' => [
                    ['label' => 'baking',    'display' => 'Baking',        'count' => Product::where('in_stock', true)->where('use_case', 'like', '%baking%')->count()],
                    ['label' => 'beverages', 'display' => 'Beverages',     'count' => Product::where('in_stock', true)->where('use_case', 'like', '%beverage%')->count()],
                    ['label' => 'table',     'display' => 'Table Use',     'count' => Product::where('in_stock', true)->where('use_case', 'like', '%table%')->count()],
                ],
            ],
        ]);
    }

    public function show($slug)
    {
        $relationships = ['category', 'gallery', 'mainImage', 'reviews.user', 'reviews.images'];

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
