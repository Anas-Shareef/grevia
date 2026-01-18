<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('status', true)->whereNull('parent_id')->with('children')->get();
        return response()->json($categories);
    }

    public function show($slug)
    {
        $category = Category::with(['children', 'products'])->where('slug', $slug)->firstOrFail();
        return response()->json($category);
    }
}
