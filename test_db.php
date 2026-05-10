<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create('/api/products', 'GET', [
    'search' => '',
    'category' => 'natural-sweeteners',
    'min_price' => '',
    'max_price' => '',
    'rating' => '',
    'sort_by' => 'newest',
    'page' => 1,
    'in_stock' => '',
    'type' => '',
    'format' => '',
    'concentration' => '',
    'size' => '',
    'certification' => '',
    'use_case' => ''
]);

try {
    $controller = new App\Http\Controllers\Api\ProductController();
    $response = $controller->index($request);
    echo "SUCCESS! Status Code: " . $response->getStatusCode() . "\n";
    print_r(json_decode($response->getContent(), true)['meta'] ?? 'No Meta');
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
