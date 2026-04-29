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
        try {
            \Log::info("ProductController Index: Start", ['url' => $request->fullUrl(), 'method' => $request->method()]);
            $query = Product::with(['category', 'gallery', 'mainImage'])
                ->where('in_stock', true);

            // ── 1. Search ──────────────────────────────────────────────────
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhereJsonContains('tags', strtolower($search))
                      ->orWhere('subcategory', 'like', "%{$search}%");
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
                    $categoryIds = $cat->getAllDescendantIds();
                    $query->whereIn('category_id', $categoryIds);
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

            // ── 10. Dynamic EAV Attribute Filters ──────────────────────────
            $dynamicAttributes = ['format', 'concentration', 'pack_size', 'trust_badges'];
            foreach ($dynamicAttributes as $attrName) {
                if ($request->filled($attrName)) {
                    $values = is_array($request->get($attrName)) ? $request->get($attrName) : explode(',', $request->get($attrName));
                    $query->whereHas('attributeValues', function ($q) use ($values) {
                        $q->whereIn('slug', $values);
                    });
                }
            }

            // ── 12. Sorting ────────────────────────────────────────────────
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

            $products = $query->paginate($request->get('per_page', 12));

            // ── 14. Build EAV-based Dynamic Facets ──────────────────────────
            $baseFacetQuery = Product::where('in_stock', true);
            if ($request->filled('search')) {
                $search = $request->search;
                $baseFacetQuery->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }
            if ($cat) {
                $baseFacetQuery->whereIn('category_id', $cat->getAllDescendantIds());
            }

            $hasEav = \Illuminate\Support\Facades\Schema::hasTable('attribute_values')
                   && \Illuminate\Support\Facades\Schema::hasTable('product_attribute_value');

            // ── FORMAT filter counts from EAV ───────────────────────────────
            if ($hasEav) {
                $formatAttr = \App\Models\Attribute::where('name', 'format')->first();
                $forms = [];
                if ($formatAttr) {
                    $basePids = (clone $baseFacetQuery)->pluck('id');
                    $forms = \App\Models\AttributeValue::where('attribute_id', $formatAttr->id)
                        ->orderBy('sort_order')
                        ->get()
                        ->map(function ($av) use ($basePids) {
                            $count = \DB::table('product_attribute_value')
                                ->where('value_id', $av->id)
                                ->whereIn('product_id', $basePids)
                                ->count();
                            return [
                                'slug'     => $av->slug,
                                'label'    => $av->value_text,
                                'count'    => $count,
                                'disabled' => $count === 0,
                            ];
                        })->values()->toArray();
                }
            } else {
                // Legacy fallback
                $formValues = ['powder', 'drops', 'tablets', 'liquid', 'jar'];
                $formCounts = (clone $baseFacetQuery)->whereNotNull('format')->groupBy('format')
                    ->selectRaw('format as lbl, count(*) as cnt')->pluck('cnt', 'lbl');
                $forms = collect($formValues)->map(fn($f) => [
                    'slug' => $f, 'label' => ucfirst($f),
                    'count' => (int)($formCounts[$f] ?? 0), 'disabled' => ($formCounts[$f] ?? 0) === 0,
                ])->values()->toArray();
            }

            // ── CONCENTRATION filter counts from EAV ────────────────────────
            if ($hasEav) {
                $concAttr = \App\Models\Attribute::where('name', 'concentration')->first();
                $ratios = [];
                if ($concAttr) {
                    $basePids = (clone $baseFacetQuery)->pluck('id');
                    $ratios = \App\Models\AttributeValue::where('attribute_id', $concAttr->id)
                        ->orderBy('sort_order')
                        ->get()
                        ->map(function ($av) use ($basePids) {
                            $count = \DB::table('product_attribute_value')
                                ->where('value_id', $av->id)
                                ->whereIn('product_id', $basePids)
                                ->count();
                            return [
                                'slug'     => $av->slug,
                                'label'    => $av->value_text,
                                'count'    => $count,
                                'disabled' => $count === 0,
                            ];
                        })->values()->toArray();
                }
            } else {
                $ratioDefinitions = ['1:10'=>'1:10 (High Potency)','1:50'=>'1:50 (Medium)','1:100'=>'1:100 (Mild)','1:200'=>'1:200 (Extra Mild)'];
                $ratioCounts = (clone $baseFacetQuery)->whereNotNull('concentration')->groupBy('concentration')
                    ->selectRaw('concentration as lbl, count(*) as cnt')->pluck('cnt', 'lbl');
                $ratios = collect($ratioDefinitions)->map(fn($display, $value) => [
                    'slug' => str_replace(':', '-', $value), 'label' => $display,
                    'count' => (int)($ratioCounts[$value] ?? 0), 'disabled' => ($ratioCounts[$value] ?? 0) === 0,
                ])->values()->toArray();
            }

            // ── PACK SIZE from Variants (Variant Indexer per PRD §3.5) ───────
            $basePids = (clone $baseFacetQuery)->pluck('id');
            if (\Illuminate\Support\Facades\Schema::hasTable('product_variants')) {
                $packSizeRows = \DB::table('product_variants')
                    ->whereIn('product_id', $basePids)
                    ->select('title', \DB::raw('COUNT(DISTINCT product_id) as total'), \DB::raw('SUM(CASE WHEN stock_quantity > 0 THEN 1 ELSE 0 END) as in_stock_count'))
                    ->groupBy('title')
                    ->orderBy('title')
                    ->get();
                $sizes = $packSizeRows->map(fn($row) => [
                    'label'    => $row->title,
                    'count'    => (int) $row->in_stock_count,
                    'disabled' => $row->in_stock_count == 0,
                ])->values()->toArray();
            } else {
                $sizes = [];
            }

            // ── Category tree ────────────────────────────────────────────────
            $categoryTree = Category::where('show_in_filter', true)
                ->whereNull('parent_id')
                ->with(['children' => function ($q) {
                    $q->where('show_in_filter', true)
                      ->select('id', 'name', 'slug', 'parent_id', 'icon', 'hero_banner', 'description', 'card_image_url')
                      ->orderBy('order');
                }])
                ->orderBy('order')
                ->select('id', 'name', 'slug', 'icon', 'hero_banner', 'description', 'card_image_url')
                ->get()
                ->map(function($cat) {
                    $categoryIds = $cat->getAllDescendantIds();
                    $cat->products_count = \App\Models\Product::whereIn('category_id', $categoryIds)->where('in_stock', true)->count();
                    $cat->children = $cat->children->map(function($child) {
                        $childIds = $child->getAllDescendantIds();
                        $child->products_count = \App\Models\Product::whereIn('category_id', $childIds)->where('in_stock', true)->count();
                        return $child;
                    });
                    $cat->icon_url = $cat->icon ? asset('storage/' . $cat->icon) : null;
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
                    'price' => ['min' => (float)$minPrice, 'max' => (float)$maxPrice],
                    'categories' => $categoryTree,
                    'forms'  => $forms,
                    'ratios' => $ratios,
                    'sizes'  => $sizes,
                    'filter_meta' => [
                        'format'        => $forms,
                        'concentration' => $ratios,
                        'pack_size'     => $sizes,
                    ],
                ],
            ]);
        } catch (\Throwable $e) {
            \Log::error("ProductController Index CRASH: " . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json([
                'status' => 'error',
                'error' => 'Internal Server Error', 
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function show($slug)
    {
        $relationships = ['category', 'gallery', 'mainImage', 'reviews.user', 'reviews.images', 'productContent'];
        $hasEav = \Illuminate\Support\Facades\Schema::hasTable('attribute_values')
               && \Illuminate\Support\Facades\Schema::hasTable('product_attribute_value');
        if ($hasEav) {
            $relationships[] = 'attributeValues.attribute';
        }
        if (\Illuminate\Support\Facades\Schema::hasTable('variant_images')) {
            $relationships[] = 'variants.variantImages';
        } else {
            $relationships[] = 'variants';
        }

        $product = Product::with($relationships)
            ->where('slug', $slug)
            ->firstOrFail();

        // Attach related products
        if (!empty($product->related_product_ids) && is_array($product->related_product_ids)) {
            $product->related_products = Product::with(['gallery', 'mainImage', 'variants'])
                ->whereIn('id', $product->related_product_ids)->where('in_stock', true)->limit(8)->get();
        } else {
            $product->related_products = Product::with(['gallery', 'mainImage', 'variants'])
                ->where('category_id', $product->category_id)->where('id', '!=', $product->id)
                ->where('in_stock', true)->limit(8)->get();
        }

        // ── Build structured attributes block per PRD §7.1 ───────────────
        $structuredAttributes = [
            'format'        => null,
            'concentrations' => [],
            'trust_badges'  => [],
        ];

        if ($hasEav && $product->relationLoaded('attributeValues')) {
            foreach ($product->attributeValues as $av) {
                $attrName = $av->attribute?->name;
                switch ($attrName) {
                    case 'format':
                        $structuredAttributes['format'] = [
                            'label' => $av->attribute->label ?? 'Format',
                            'value' => $av->value_text,
                            'slug'  => $av->slug,
                        ];
                        break;
                    case 'concentration':
                        $meta = $av->meta ?? [];
                        $structuredAttributes['concentrations'][] = [
                            'id'                => $av->id,
                            'value'             => $av->value_text,
                            'label'             => $av->value_text,
                            'slug'              => $av->slug,
                            'substitution_text' => $meta['substitution_text'] ?? null,
                            'is_default'        => (bool)($meta['is_default'] ?? false)
                                                || (bool)($av->pivot->is_default_concentration ?? false),
                        ];
                        break;
                    case 'trust_badges':
                        $structuredAttributes['trust_badges'][] = [
                            'id'    => $av->id,
                            'label' => $av->value_text,
                            'slug'  => $av->slug,
                            'icon'  => $av->icon_url ? '/storage/' . $av->icon_url : null,
                        ];
                        break;
                }
            }
            // Sort concentrations by sort_order
            usort($structuredAttributes['concentrations'], fn($a, $b) => 0);
        }

        // Enhance variants with is_available flag
        $variants = $product->variants->map(fn($v) => array_merge($v->toArray(), [
            'is_available' => ($v->stock_quantity ?? 0) > 0,
        ]))->toArray();

        $responseData = array_merge($product->toArray(), [
            'attributes' => $structuredAttributes,
            'variants'   => $variants,
            'content'    => [
                'attr_product_story' => $product->productContent?->attr_product_story,
                'attr_usage_prep'    => $product->productContent?->attr_usage_prep,
            ],
        ]);

        return response()->json($responseData);
    }

    public function getSubstitutionTip(Request $request)
    {
        $ratio = $request->query('ratio', '1:10');
        $parts = explode(':', $ratio);
        $multiplier = count($parts) > 1 ? (int)$parts[1] : 10;
        
        return response()->json([
            'success' => true,
            'ratio' => $ratio,
            'multiplier' => $multiplier,
            'tip' => "1g replaces {$multiplier}g of sugar"
        ]);
    }
}
