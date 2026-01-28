<?php
/**
 * Product Filtering Fix Script
 * Run this if diagnostics show issues: php fix_products.php
 */

echo "=== GREVIA PRODUCT FILTERING FIX ===\n\n";

// Load Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Step 1: Checking database state...\n";

$productCount = \App\Models\Product::count();
$categoryCount = \App\Models\Category::count();

echo "Products: $productCount\n";
echo "Categories: $categoryCount\n\n";

if ($categoryCount === 0) {
    echo "Step 2: Creating categories...\n";
    
    // Create parent categories
    $sweeteners = \App\Models\Category::create([
        'name' => 'Premium Sweeteners',
        'slug' => 'sweeteners',
        'parent_id' => null,
    ]);
    echo "✓ Created: Premium Sweeteners\n";
    
    $otherProducts = \App\Models\Category::create([
        'name' => 'Other Products',
        'slug' => 'other-products',
        'parent_id' => null,
    ]);
    echo "✓ Created: Other Products\n";
    
    // Create subcategories
    \App\Models\Category::create([
        'name' => 'Stevia Sweeteners',
        'slug' => 'stevia',
        'parent_id' => $sweeteners->id,
    ]);
    echo "✓ Created: Stevia Sweeteners\n";
    
    \App\Models\Category::create([
        'name' => 'Monkfruit Sweeteners',
        'slug' => 'monkfruit',
        'parent_id' => $sweeteners->id,
    ]);
    echo "✓ Created: Monkfruit Sweeteners\n";
    
    \App\Models\Category::create([
        'name' => 'Bakery Items',
        'slug' => 'bakery',
        'parent_id' => $otherProducts->id,
    ]);
    echo "✓ Created: Bakery Items\n";
    
    \App\Models\Category::create([
        'name' => 'Pickles & Preserves',
        'slug' => 'pickles',
        'parent_id' => $otherProducts->id,
    ]);
    echo "✓ Created: Pickles & Preserves\n\n";
}

if ($productCount === 0) {
    echo "Step 3: Creating sample products...\n";
    
    $sweetenersCategory = \App\Models\Category::where('slug', 'sweeteners')->first();
    $bakeryCategory = \App\Models\Category::where('slug', 'bakery')->first();
    $picklesCategory = \App\Models\Category::where('slug', 'pickles')->first();
    
    if ($sweetenersCategory) {
        \App\Models\Product::create([
            'name' => 'Grevia Stevia Jar',
            'slug' => 'grevia-stevia-jar',
            'description' => 'Premium stevia sweetener in convenient jar',
            'price' => 299.00,
            'category_id' => $sweetenersCategory->id,
            'in_stock' => true,
        ]);
        
        \App\Models\Product::create([
            'name' => 'Grevia Stevia Powder',
            'slug' => 'grevia-stevia-powder',
            'description' => 'Fine stevia powder for baking',
            'price' => 249.00,
            'category_id' => $sweetenersCategory->id,
            'in_stock' => true,
        ]);
        
        \App\Models\Product::create([
            'name' => 'Grevia Monkfruit Drops',
            'slug' => 'grevia-monkfruit-drops',
            'description' => 'Liquid monkfruit sweetener drops',
            'price' => 349.00,
            'category_id' => $sweetenersCategory->id,
            'in_stock' => true,
        ]);
        
        echo "✓ Created 3 sweetener products\n";
    }
    
    if ($bakeryCategory) {
        \App\Models\Product::create([
            'name' => 'Artisan Whole Grain Bread',
            'slug' => 'artisan-whole-grain-bread',
            'description' => 'Freshly baked whole grain bread',
            'price' => 120.00,
            'category_id' => $bakeryCategory->id,
            'in_stock' => true,
        ]);
        
        echo "✓ Created 1 bakery product\n";
    }
    
    if ($picklesCategory) {
        \App\Models\Product::create([
            'name' => 'Traditional Mango Pickle',
            'slug' => 'traditional-mango-pickle',
            'description' => 'Homemade style mango pickle',
            'price' => 180.00,
            'category_id' => $picklesCategory->id,
            'in_stock' => true,
        ]);
        
        echo "✓ Created 1 pickle product\n";
    }
    
    echo "\n";
}

echo "Step 4: Verifying product assignments...\n";

// Make sure all products are in_stock
$updated = \App\Models\Product::where('in_stock', false)->update(['in_stock' => true]);
if ($updated > 0) {
    echo "✓ Updated $updated products to in_stock = true\n";
}

// Verify category assignments
$unassigned = \App\Models\Product::whereNull('category_id')->count();
if ($unassigned > 0) {
    echo "⚠️  Warning: $unassigned products have no category assigned\n";
    
    // Assign to sweeteners by default
    $sweetenersCategory = \App\Models\Category::where('slug', 'sweeteners')->first();
    if ($sweetenersCategory) {
        \App\Models\Product::whereNull('category_id')->update(['category_id' => $sweetenersCategory->id]);
        echo "✓ Assigned unassigned products to 'sweeteners' category\n";
    }
}

echo "\nStep 5: Final verification...\n";

$categories = \App\Models\Category::all();
foreach ($categories as $cat) {
    $count = \App\Models\Product::where('category_id', $cat->id)->count();
    echo "  {$cat->name} ({$cat->slug}): $count products\n";
}

echo "\n=== FIX COMPLETE ===\n";
echo "\nNow test these URLs:\n";
echo "  - " . config('app.url') . "/api/products?category=sweeteners\n";
echo "  - " . config('app.url') . "/api/products?category=other-products\n";
echo "  - " . config('app.url') . "/products/sweeteners\n";
echo "  - " . config('app.url') . "/products/other-products\n";
