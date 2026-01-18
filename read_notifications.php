<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$notification = \Illuminate\Support\Facades\DB::table('notifications')->latest()->first();

if ($notification) {
    echo "ID: " . $notification->id . "\n";
    echo "Type: " . $notification->type . "\n";
    echo "Notifiable Type: " . $notification->notifiable_type . "\n";
    echo "Notifiable ID: " . $notification->notifiable_id . "\n";
    echo "Data: " . $notification->data . "\n";
} else {
    echo "No notifications found.\n";
}
