<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== USERS ===\n";
$users = DB::table('users')->select('id', 'name', 'email')->get();
foreach ($users as $user) {
    echo "User {$user->id}: {$user->name} ({$user->email})\n";
}

echo "\n=== ORDERS ===\n";
$orders = DB::table('orders')->select('id', 'user_id', 'name', 'email')->get();
foreach ($orders as $order) {
    $userId = $order->user_id ?? 'NULL';
    echo "Order {$order->id}: user_id={$userId}, name={$order->name}, email={$order->email}\n";
}
