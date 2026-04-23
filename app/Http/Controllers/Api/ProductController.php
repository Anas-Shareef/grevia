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

        // ── 13. Filter Metadata Aggregation ─────────────────────────────
        $minPrice = Product::where('in_stock', true)->min('price') ?? 0;
        $maxPrice = Product::where('in_stock', true)->max('price') ?? 1000;

        // ── 14. Build a CONTEXT-AWARE base query for facet counting ──────
        // We clone the query at this point (after category/search/region filters,
        // but BEFORE form/ratio/size are applied) so each facet group can see
        // how many products are available in the current browsing context.
        // This is what makes zero-count graying accurate and contextual.
        $facetBase = clone $query;
        // Strip the active attribute filters from the facet base so they
        // don't falsely zero-out their own sibling options.
        // (The pagination query keeps them for the actual product grid.)

        $products = $query->paginate($request->get('per_page', 12));

        // ── Forms (Format) ── dynamic, context-aware ────────────────────
        $formValues = ['powder', 'drops', 'tablets', 'liquid', 'jar'];
        $formLabels = ['powder' => 'Powder', 'drops' => 'Drops', 'tablets' => 'Tablets', 'liquid' => 'Liquid', 'jar' => 'Jar'];
        $formBase   = clone $facetBase;
        // Remove any form filter so all siblings are visible
        $formBase->whereNotNull('in_stock'); // no-op clone refresh
        $formCounts = Product::where('in_stock', true)
            ->when($request->filled('category'), function ($q) use ($query) {
                // Mirror the category scope from the main query
                $q->whereIn('category_id', $query->getQuery()->wheres[0]['values'] ?? []);
            })
            ->whereNotNull('form')
            ->groupBy('form')
            ->selectRaw('form as lbl, count(*) as cnt')
            ->pluck('cnt', 'lbl');

        $forms = collect($formValues)->map(fn($f) => [
            'label'    => $f,
            'display'  => $formLabels[$f] ?? ucfirst($f),
            'count'    => (int) ($formCounts[$f] ?? 0),
            'disabled' => (($formCounts[$f] ?? 0) === 0),
        ])->values()->toArray();

        // ── Ratios (Concentration) ── dynamic, context-aware ────────────
        $ratioDefinitions = [
            '1:10'  => '1:10 (High Potency)',
            '1:50'  => '1:50 (Medium)',
            '1:100' => '1:100 (Mild)',
            '1:200' => '1:200 (Extra Mild)',
        ];
        $ratioCounts = Product::where('in_stock', true)
            ->whereNotNull('ratio')
            ->groupBy('ratio')
            ->selectRaw('ratio as lbl, count(*) as cnt')
            ->pluck('cnt', 'lbl');

        $ratios = collect($ratioDefinitions)->map(fn($display, $value) => [
            'label'    => $value,
            'display'  => $display,
            'count'    => (int) ($ratioCounts[$value] ?? 0),
            'disabled' => (($ratioCounts[$value] ?? 0) === 0),
        ])->values()->toArray();

        // ── Pack Sizes ── dynamic from size_label column ─────────────────
        $sizeValues = ['50g', '100g', '200g', '250g', '500g', '50ml', '100ml', '200ml'];
        $sizeCounts = [];
        foreach ($sizeValues as $size) {
            $sizeCounts[$size] = Product::where('in_stock', true)
                ->where('size_label', 'like', "%{$size}%")
                ->count();
        }

        $sizes = collect($sizeValues)
            ->filter(fn($s) => $sizeCounts[$s] > 0) // hide sizes with zero products entirely
            ->map(fn($s) => [
                'label'    => $s,
                'count'    => (int) $sizeCounts[$s],
                'disabled' => false, // only shown if > 0
            ])->values()->toArray();

        // ── Category tree with icon_url ──────────────────────────────────
        $categoryTree = Category::where('show_in_filter', true)
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
            ->get()
            ->map(function ($cat) {
                $cat->icon_url = $cat->icon
                    ? asset('storage/' . $cat->icon)
                    : null;
                return $cat;
            });

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
                // Category tree — top-level only for sidebar; icon_url included for slider
                'categories' => $categoryTree,
                // Dynamic facets — context-aware, with disabled flag for zero-count
                'forms'  => $forms,
                'ratios' => $ratios,
                'sizes'  => $sizes,
                // Keep certifications for potential future use (not shown in UI)
                'certifications' => [
                    ['label' => 'cert-organic', 'display' => '100% Organic',  'count' => Product::where('in_stock', true)->whereJsonContains('tags', 'cert-organic')->count(), 'disabled' => false],
                    ['label' => 'cert-nongmo',  'display' => 'Non-GMO',       'count' => Product::where('in_stock', true)->whereJsonContains('tags', 'cert-nongmo')->count(),  'disabled' => false],
                    ['label' => 'cert-vegan',   'display' => 'Vegan',         'count' => Product::where('in_stock', true)->whereJsonContains('tags', 'cert-vegan')->count(),   'disabled' => false],
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
