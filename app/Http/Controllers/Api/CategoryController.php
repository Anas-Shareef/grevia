<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Return the full 2-level category tree for navigation and collection tiles.
     * Each category includes its children, product count, image URLs and descriptions.
     */
    public function index()
    {
        $categories = Category::where('status', true)
            ->whereNull('parent_id')
            ->with(['children' => function ($q) {
                $q->where('status', true)
                  ->withCount('products')
                  ->orderBy('order');
            }])
            ->withCount('products')
            ->orderBy('order')
            ->get();

        return response()->json($categories);
    }

    /**
     * Return a single category with its children and featured products.
     */
    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->where('status', true)
            ->with([
                'children' => function ($q) {
                    $q->where('status', true)->withCount('products')->orderBy('order');
                },
                'parent',
            ])
            ->withCount('products')
            ->firstOrFail();

        return response()->json($category);
    }
}
