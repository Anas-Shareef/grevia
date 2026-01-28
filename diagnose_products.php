<?php
/**
 * Comprehensive Product Filtering Diagnostic Script
 * Upload this to your server and run: php diagnose_products.php
 */

echo "=== GREVIA PRODUCT FILTERING DIAGNOSTICS ===\n\n";

// Load Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "1. DATABASE CHECK\n";
echo str_repeat("-", 50) . "\n";

// Check products
$productCount = \App\Models\Product::count();
echo "Total Products: $productCount\n";

if ($productCount > 0) {
    $inStockCount = \App\Models\Product::where('in_stock', true)->count();
    echo "In Stock Products: $inStockCount\n";
    
    echo "\nSample Products:\n";
    $products = \App\Models\Product::with('category')->limit(5)->get();
    foreach ($products as $p) {
        echo "  - {$p->name} (ID: {$p->id}, Category: {$p->category->name}, Slug: {$p->category->slug}, In Stock: " . ($p->in_stock ? 'Yes' : 'No') . ")\n";
    }
} else {
    echo "⚠️  WARNING: No products found in database!\n";
}

echo "\n2. CATEGORY CHECK\n";
echo str_repeat("-", 50) . "\n";

$categories = \App\Models\Category::all(['id', 'name', 'slug', 'parent_id']);
echo "Total Categories: " . $categories->count() . "\n\n";

if ($categories->count() > 0) {
    echo "Categories:\n";
    foreach ($categories as $cat) {
        $productCount = \App\Models\Product::where('category_id', $cat->id)->count();
        echo "  - {$cat->name} (slug: {$cat->slug}, ID: {$cat->id}, parent_id: {$cat->parent_id}, products: {$productCount})\n";
    }
} else {
    echo "⚠️  WARNING: No categories found in database!\n";
}

echo "\n3. FILTERING LOGIC TEST\n";
echo str_repeat("-", 50) . "\n";

// Test sweeteners filter
echo "\nTest 1: category=sweeteners\n";
$cat = \App\Models\Category::where('slug', 'sweeteners')->first();
if ($cat) {
    $ids = \App\Models\Category::where('id', $cat->id)
        ->orWhere('parent_id', $cat->id)
        ->pluck('id');
    echo "  Category found: {$cat->name} (ID: {$cat->id})\n";
    echo "  IDs to search: " . json_encode($ids->toArray()) . "\n";
    
    $products = \App\Models\Product::where('in_stock', true)
        ->whereIn('category_id', $ids)
        ->get();
    echo "  Products found: " . $products->count() . "\n";
    foreach ($products as $p) {
        echo "    - {$p->name}\n";
    }
} else {
    echo "  ❌ Category 'sweeteners' not found!\n";
}

// Test stevia filter
echo "\nTest 2: category=stevia\n";
$cat = \App\Models\Category::where('slug', 'stevia')->first();
if ($cat) {
    echo "  Category found: {$cat->name} (ID: {$cat->id})\n";
    $products = \App\Models\Product::where('in_stock', true)
        ->where('category_id', $cat->id)
        ->get();
    echo "  Products found: " . $products->count() . "\n";
} else {
    echo "  ❌ Category 'stevia' not found!\n";
}

// Test other-products filter
echo "\nTest 3: category=other-products\n";
$products = \App\Models\Product::where('in_stock', true)
    ->whereHas('category', function($q) {
        $q->whereIn('slug', ['bakery', 'pickles']);
    })
    ->get();
echo "  Products found: " . $products->count() . "\n";

// Test bakery filter
echo "\nTest 4: category=bakery\n";
$cat = \App\Models\Category::where('slug', 'bakery')->first();
if ($cat) {
    echo "  Category found: {$cat->name} (ID: {$cat->id})\n";
    $products = \App\Models\Product::where('in_stock', true)
        ->where('category_id', $cat->id)
        ->get();
    echo "  Products found: " . $products->count() . "\n";
} else {
    echo "  ❌ Category 'bakery' not found!\n";
}

echo "\n4. API ENDPOINT TEST\n";
echo str_repeat("-", 50) . "\n";
echo "Test these URLs in your browser:\n";
echo "  - " . config('app.url') . "/api/products\n";
echo "  - " . config('app.url') . "/api/products?category=sweeteners\n";
echo "  - " . config('app.url') . "/api/categories\n";

echo "\n5. ENVIRONMENT CHECK\n";
echo str_repeat("-", 50) . "\n";
echo "APP_URL: " . config('app.url') . "\n";
echo "APP_ENV: " . config('app.env') . "\n";
echo "APP_DEBUG: " . (config('app.debug') ? 'true' : 'false') . "\n";

echo "\n6. BUILD CHECK\n";
echo str_repeat("-", 50) . "\n";
$buildPath = public_path('build/assets');
if (is_dir($buildPath)) {
    $files = glob($buildPath . '/main-*.js');
    if (!empty($files)) {
        echo "✓ Frontend build found: " . basename($files[0]) . "\n";
        echo "  Size: " . round(filesize($files[0]) / 1024) . " KB\n";
        echo "  Modified: " . date('Y-m-d H:i:s', filemtime($files[0])) . "\n";
    } else {
        echo "❌ No main JS file found in build!\n";
    }
} else {
    echo "❌ Build directory not found!\n";
}

echo "\n=== DIAGNOSTICS COMPLETE ===\n";
echo "\nIf you see warnings above, run the fix script: php fix_products.php\n";
