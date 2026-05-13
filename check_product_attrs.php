<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;

$product = Product::with('values.attribute')->find(2);

if (!$product) {
    echo "Product not found\n";
    exit;
}

echo "Product: " . $product->name . "\n";
echo "Attributes:\n";
foreach ($product->values as $value) {
    echo "- " . $value->attribute->name . ": " . $value->value_text . " (Slug: " . $value->slug . ")\n";
}
