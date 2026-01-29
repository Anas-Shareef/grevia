<?php
/**
 * Check Product Images Storage
 * Run: php check_product_images.php
 */

echo "=== CHECKING PRODUCT IMAGES STORAGE ===\n\n";

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Step 1: Check storage link\n";
$publicStorage = public_path('storage');
if (is_link($publicStorage)) {
    echo "✓ Storage link exists\n";
    echo "  Target: " . readlink($publicStorage) . "\n";
} else {
    echo "❌ Storage link does NOT exist\n";
    echo "  Run: php artisan storage:link\n";
}

echo "\nStep 2: Check products directory\n";
$productsDir = storage_path('app/public/products');
if (is_dir($productsDir)) {
    echo "✓ Products directory exists: {$productsDir}\n";
    $files = glob($productsDir . '/*');
    echo "  Files count: " . count($files) . "\n";
    
    if (count($files) > 0) {
        echo "\n  Sample files:\n";
        foreach (array_slice($files, 0, 5) as $file) {
            echo "  - " . basename($file) . " (" . round(filesize($file) / 1024, 2) . " KB)\n";
        }
    }
} else {
    echo "❌ Products directory does NOT exist: {$productsDir}\n";
    echo "  Creating directory...\n";
    mkdir($productsDir, 0755, true);
    echo "  ✓ Directory created\n";
}

echo "\nStep 3: Check product images in database\n";
$products = \App\Models\Product::with('gallery')->limit(5)->get();

foreach ($products as $product) {
    echo "\nProduct: {$product->name}\n";
    
    if ($product->gallery->count() > 0) {
        foreach ($product->gallery as $image) {
            echo "  Image: {$image->image_path}\n";
            
            // Check if file exists
            $fullPath = storage_path('app/public/' . $image->image_path);
            if (file_exists($fullPath)) {
                echo "    ✓ File exists (" . round(filesize($fullPath) / 1024, 2) . " KB)\n";
            } else {
                echo "    ❌ File NOT found at: {$fullPath}\n";
            }
            
            // Check public URL
            $publicUrl = public_path('storage/' . $image->image_path);
            if (file_exists($publicUrl)) {
                echo "    ✓ Accessible via public/storage\n";
            } else {
                echo "    ❌ NOT accessible via public/storage\n";
            }
        }
    } else {
        echo "  No gallery images\n";
    }
}

echo "\nStep 4: Environment check\n";
echo "APP_ENV: " . config('app.env') . "\n";
echo "APP_URL: " . config('app.url') . "\n";
echo "Storage disk: " . config('filesystems.default') . "\n";
echo "Public disk path: " . config('filesystems.disks.public.root') . "\n";

echo "\n=== CHECK COMPLETE ===\n";
