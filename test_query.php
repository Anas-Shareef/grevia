<?php
// Test the exact query logic from ProductController
$categorySlug = 'sweeteners';

echo "Testing category: $categorySlug\n\n";

// Find category
$cat = \App\Models\Category::where('slug', $categorySlug)->first();
echo "Found category: " . ($cat ? "ID {$cat->id}, Name: {$cat->name}" : "NOT FOUND") . "\n";

if ($cat) {
    // Get IDs (parent + children)
    $ids = \App\Models\Category::where('id', $cat->id)
        ->orWhere('parent_id', $cat->id)
        ->pluck('id');
    
    echo "Category IDs to search: " . json_encode($ids) . "\n";
    
    // Query products
    $products = \App\Models\Product::with(['category'])
        ->where('in_stock', true)
        ->whereIn('category_id', $ids)
        ->get();
    
    echo "Products found: " . $products->count() . "\n";
    foreach ($products as $p) {
        echo "  - {$p->name} (category_id: {$p->category_id})\n";
    }
}
