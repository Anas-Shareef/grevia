<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

$columns = Schema::getColumnListing('order_items');
echo "Columns in order_items:\n";
print_r($columns);

$lastItem = DB::table('order_items')->latest()->first();
echo "\nLast order item data:\n";
print_r($lastItem);
