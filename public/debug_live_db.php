<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain');

$secret = 'grevia_storage_2026';
if (empty($_GET['key']) || $_GET['key'] !== $secret) {
    die("Access Denied.");
}

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== SERVER DATABASE DIAGNOSTICS ===\n\n";

$p = App\Models\Product::find(1);
if ($p) {
    echo "Product ID 1 found:\n";
    echo "  Name: " . $p->name . "\n";
    echo "  Slug: " . $p->slug . "\n";
    echo "  Image column: " . $p->image . "\n";
    echo "  Image URL: " . $p->image_url . "\n";
    
    // Check if the file exists at the storage path
    if ($p->image) {
        $storagePath = storage_path('app/public/' . $p->image);
        echo "  Absolute Storage Path: $storagePath\n";
        echo "  File exists in storage: " . (file_exists($storagePath) ? "Yes" : "No") . "\n";
        
        $publicPath = public_path('storage/' . $p->image);
        echo "  Absolute Public Path: $publicPath\n";
        echo "  File exists in public: " . (file_exists($publicPath) ? "Yes" : "No") . "\n";
    }
    
    // Check variant images
    echo "\nVariants found:\n";
    foreach ($p->variants as $v) {
        echo "  Variant: " . $v->title . " (Weight: " . $v->weight . ")\n";
        echo "    Image path: " . $v->image_path . "\n";
        if ($v->image_path) {
            $vPath = storage_path('app/public/' . $v->image_path);
            echo "    File exists in storage: " . (file_exists($vPath) ? "Yes" : "No") . "\n";
        }
    }
} else {
    echo "Product ID 1 NOT found in database.\n";
}

echo "\n--- FILESYSTEM CONFIG ---\n";
echo "Default Disk: " . config('filesystems.default') . "\n";
echo "Public Disk Root: " . config('filesystems.disks.public.root') . "\n";
echo "Public Disk URL: " . config('filesystems.disks.public.url') . "\n";
echo "App URL: " . config('app.url') . "\n";
