<?php
/**
 * Diagnostic script for Product ID 2
 */

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$productId = 2;
$product = \App\Models\Product::with(['category', 'gallery', 'variants.variantImages'])->find($productId);

if (!$product) {
    echo "Product ID $productId NOT FOUND!\n";
    exit;
}

echo "=== PRODUCT DIAGNOSTIC (ID: $productId) ===\n";
echo "Name: {$product->name}\n";
echo "Slug: {$product->slug}\n";
echo "Category: " . ($product->category ? $product->category->name : 'N/A') . "\n";
echo "Price: {$product->price}\n";
echo "Soft Deleted: " . ($product->trashed() ? 'YES' : 'NO') . "\n";

echo "\n--- GALLERY PHOTOS ---\n";
echo "Count: " . $product->gallery->count() . "\n";
foreach ($product->gallery as $image) {
    echo "  - Path: {$image->image_path} (Main: " . ($image->is_main ? 'YES' : 'NO') . ", Link: " . $image->url . ")\n";
}

echo "\n--- VARIANTS ---\n";
echo "Count: " . $product->variants->count() . "\n";
foreach ($product->variants as $variant) {
    echo "  - Variant ID: {$variant->id}\n";
    echo "    Weight: {$variant->weight}\n";
    echo "    Price: {$variant->price}\n";
    echo "    SKU: {$variant->sku}\n";
    echo "    Photos: " . $variant->variantImages->count() . "\n";
    foreach ($variant->variantImages as $vImg) {
        echo "      * {$vImg->image_path} (Main: " . ($vImg->is_main ? 'YES' : 'NO') . ")\n";
    }
}

echo "\n--- OTHER FIELDS ---\n";
echo "Ingredients: " . json_encode($product->ingredients) . "\n";
echo "Tags: " . json_encode($product->tags) . "\n";
echo "Related Products: {$product->related_products}\n";

echo "\n--- DATABASE TABLES CHECK ---\n";
$tables = ['products', 'product_images', 'product_variants', 'variant_images'];
foreach ($tables as $table) {
    echo "Table '$table' exists: " . (\Illuminate\Support\Facades\Schema::hasTable($table) ? 'YES' : 'NO') . "\n";
}
