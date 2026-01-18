<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CART ITEMS (Server-side) ===\n";
$cartItems = DB::table('cart_items')->get();
echo "Total cart items in database: " . $cartItems->count() . "\n\n";

foreach ($cartItems as $item) {
    $user = DB::table('users')->find($item->user_id);
    $product = DB::table('products')->find($item->product_id);
    
    echo "Cart Item ID: {$item->id}\n";
    echo "User: {$user->email}\n";
    echo "Product: {$product->name}\n";
    echo "Quantity: {$item->quantity}\n";
    echo "Created: {$item->created_at}\n";
    echo "---\n";
}

if ($cartItems->count() === 0) {
    echo "No cart items found in database.\n";
    echo "This means the sync to server hasn't happened yet.\n";
}
