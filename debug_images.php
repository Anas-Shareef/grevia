<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;
use App\Models\ProductImage;

echo "Checking Product Images...\n";

$products = Product::with(['mainImage', 'gallery'])->limit(5)->get();

foreach ($products as $product) {
    echo "Product: {$product->id} - {$product->name}\n";
    echo "  Column 'image': " . ($product->image ? $product->image : 'NULL') . "\n";
    
    // Check Main Image Relation
    $main = $product->mainImage;
    echo "  Relation 'mainImage': " . ($main ? "Found (URL: {$main->url})" : 'NULL') . "\n";
    
    // Check Gallery Relation
    echo "  Relation 'gallery': " . $product->gallery->count() . " images\n";
    foreach ($product->gallery as $img) {
        echo "    - ID: {$img->id}, Path: {$img->image_path}, URL: {$img->url}, Main: {$img->is_main}\n";
    }

    // Check Accessor Result
    echo "  Accessor 'image_url': " . ($product->image_url ? $product->image_url : 'NULL') . "\n";
    echo "---------------------------------------------------\n";
}

echo "Done.\n";
