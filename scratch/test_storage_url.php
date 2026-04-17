<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

echo "Default disk: " . config('filesystems.default') . "\n";
echo "Public disk root: " . config('filesystems.disks.public.root') . "\n";
echo "Local disk root: " . config('filesystems.disks.local.root') . "\n";

$testPath = 'products/gallery/test.jpg';

echo "\nStorage::url('$testPath'): " . Storage::url($testPath) . "\n";
echo "Storage::disk('public')->url('$testPath'): " . Storage::disk('public')->url($testPath) . "\n";
echo "Storage::disk('local')->url('$testPath'): " . Storage::disk('local')->url($testPath) . "\n";
