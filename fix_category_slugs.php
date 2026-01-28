<?php
/**
 * Fix Category Slugs to Match Frontend Expectations
 * Run: php fix_category_slugs.php
 */

echo "=== FIXING CATEGORY SLUGS ===\n\n";

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Current categories:\n";
$categories = \App\Models\Category::all(['id', 'name', 'slug']);
foreach ($categories as $cat) {
    echo "  - {$cat->name} (slug: {$cat->slug})\n";
}

echo "\nFixing slugs...\n";

// Fix parent categories
$updated = 0;

// Fix "Premium Sweetners" -> "sweeteners"
$cat = \App\Models\Category::where('slug', 'premium-sweetners')->first();
if ($cat) {
    $cat->slug = 'sweeteners';
    $cat->name = 'Premium Sweeteners'; // Fix typo too
    $cat->save();
    echo "✓ Fixed: Premium Sweeteners (slug: sweeteners)\n";
    $updated++;
}

// Fix "Bakery Items" -> "bakery"
$cat = \App\Models\Category::where('slug', 'bakery-items')->first();
if ($cat) {
    $cat->slug = 'bakery';
    $cat->save();
    echo "✓ Fixed: Bakery Items (slug: bakery)\n";
    $updated++;
}

// Fix "Pickles & Preserves" -> "pickles"
$cat = \App\Models\Category::where('slug', 'pickles-preserves')->first();
if ($cat) {
    $cat->slug = 'pickles';
    $cat->save();
    echo "✓ Fixed: Pickles & Preserves (slug: pickles)\n";
    $updated++;
}

// Fix "Stevia Sweetners" -> "stevia"
$cat = \App\Models\Category::where('slug', 'stevia-sweetners')->first();
if ($cat) {
    $cat->slug = 'stevia';
    $cat->name = 'Stevia Sweeteners'; // Fix typo
    $cat->save();
    echo "✓ Fixed: Stevia Sweeteners (slug: stevia)\n";
    $updated++;
}

// Fix "Monfruit Sweetner" -> "monkfruit"
$cat = \App\Models\Category::where('slug', 'monfruit-sweetner')->first();
if ($cat) {
    $cat->slug = 'monkfruit';
    $cat->name = 'Monkfruit Sweeteners'; // Fix typo
    $cat->save();
    echo "✓ Fixed: Monkfruit Sweeteners (slug: monkfruit)\n";
    $updated++;
}

echo "\nUpdated $updated categories.\n";

echo "\nFinal categories:\n";
$categories = \App\Models\Category::all(['id', 'name', 'slug', 'parent_id']);
foreach ($categories as $cat) {
    echo "  - {$cat->name} (slug: {$cat->slug}, parent_id: {$cat->parent_id})\n";
}

echo "\n=== FIX COMPLETE ===\n";
echo "\nNow test these URLs:\n";
echo "  - https://grevia.in/products/sweeteners\n";
echo "  - https://grevia.in/products/sweeteners?category=stevia\n";
echo "  - https://grevia.in/products/sweeteners?category=monkfruit\n";
echo "  - https://grevia.in/products/other-products\n";
echo "  - https://grevia.in/products/other-products?category=bakery\n";
echo "  - https://grevia.in/products/other-products?category=pickles\n";
