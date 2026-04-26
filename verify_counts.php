<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;
use App\Models\Product;

$cat = Category::where('slug', 'natural-sweeteners')->first();
if (!$cat) {
    echo "Category not found\n";
    exit;
}

$req = new \Illuminate\Http\Request(['format' => 'powder']);
$controller = new \App\Http\Controllers\Api\ProductController();
$response = $controller->index($req);
$data = json_decode($response->getContent());

echo "Total products for format=powder: " . $data->meta->total . "\n";
echo "Products found: \n";
foreach ($data->data as $p) {
    echo " - " . $p->name . "\n";
}


