<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;
use App\Models\ProductVariant;

$products = Product::with('variants')->get();
foreach ($products as $p) {
    echo "Product: {$p->name} (ID: {$p->id})\n";
    foreach ($p->variants as $v) {
        echo "  - Variant: {$v->weight}g / Pack Size: {$v->pack_size}g (ID: {$v->id})\n";
    }
}
