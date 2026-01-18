<?php
$slug = 'sweeteners';
echo "Searching for slug: $slug\n";
$cat = \App\Models\Category::where('slug', $slug)->first();

if ($cat) {
    echo "Found Category ID: " . $cat->id . "\n";
    $ids = \App\Models\Category::where('id', $cat->id)
        ->orWhere('parent_id', $cat->id)
        ->pluck('id');
    
    echo "Category IDs found: " . json_encode($ids) . "\n";
    
    $count = \App\Models\Product::whereIn('category_id', $ids)->count();
    echo "Product Count: " . $count . "\n";
} else {
    echo "Category not found!\n";
}
