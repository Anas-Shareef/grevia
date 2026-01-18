<?php

use App\Models\Order;
use App\Models\User;
use Filament\Notifications\Notification;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Debug Start\n";

// 1. Check Recipients
$admins = User::all();
echo "Found " . $admins->count() . " users.\n";
foreach($admins as $u) {
    echo " - User: {$u->id} ({$u->name})\n";
}

// 2. Count existing notifications
$countBefore = \Illuminate\Support\Facades\DB::table('notifications')->count();
echo "Notifications before: $countBefore\n";

// 3. Simulate Order Creation
echo "Creating Test Order...\n";
try {
    $order = new Order();
    $order->order_number = 'DEBUG-' . time();
    $order->status = 'pending';
    $order->total = 100.00;
    // Add required fields
    $order->user_id = $admins->first()->id ?? 1; // Fallback
    $order->shipping_address = []; // JSON cast
    $order->billing_address = []; // JSON cast
    $order->payment_method = 'cod';
    $order->shipping = 0;
    $order->subtotal = 100.00;
    $order->discount = 0;
    $order->name = 'Test User';
    $order->email = 'test@example.com';
    $order->phone = '1234567890';
    $order->save();
    echo "Order saved: " . $order->id . "\n";
} catch (\Exception $e) {
    echo "Error saving order: " . $e->getMessage() . "\n";
}

// 4. Count after
$countAfter = \Illuminate\Support\Facades\DB::table('notifications')->count();
echo "Notifications after: $countAfter\n";

if ($countAfter > $countBefore) {
    echo "SUCCESS: Notification created.\n";
    // Check the latest notification
    $latest = \Illuminate\Support\Facades\DB::table('notifications')->latest()->first();
    print_r(json_decode($latest->data, true));
} else {
    echo "FAILURE: No notification created.\n";
}
