<?php
/**
 * Quick fix for storage link and verify images
 * Run: php fix_storage_link.php
 */

echo "=== FIXING STORAGE LINK ===\n\n";

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Step 1: Remove old storage link if exists\n";
$publicStorage = public_path('storage');
if (file_exists($publicStorage)) {
    if (is_link($publicStorage)) {
        unlink($publicStorage);
        echo "✓ Removed old symlink\n";
    } elseif (is_dir($publicStorage)) {
        echo "⚠ public/storage is a directory, not a symlink. Renaming...\n";
        rename($publicStorage, public_path('storage_backup_' . time()));
        echo "✓ Renamed to backup\n";
    }
} else {
    echo "✓ No existing storage link\n";
}

echo "\nStep 2: Create storage link\n";
try {
    Artisan::call('storage:link');
    echo "✓ Storage link created\n";
    echo Artisan::output();
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\nStep 3: Verify storage link\n";
if (is_link($publicStorage)) {
    echo "✓ Storage link exists\n";
    echo "  Target: " . readlink($publicStorage) . "\n";
    
    // Test if accessible
    $testFile = storage_path('app/public/products/01KG4P0CT1TGDVRTNTRNMS0311.jpg');
    if (file_exists($testFile)) {
        $publicPath = public_path('storage/products/01KG4P0CT1TGDVRTNTRNMS0311.jpg');
        if (file_exists($publicPath)) {
            echo "✓ Test image is accessible via public/storage\n";
            echo "  URL: " . config('app.url') . "/storage/products/01KG4P0CT1TGDVRTNTRNMS0311.jpg\n";
        } else {
            echo "❌ Test image NOT accessible via public/storage\n";
        }
    }
} else {
    echo "❌ Storage link still does not exist\n";
}

echo "\nStep 4: Check file permissions\n";
$productsDir = storage_path('app/public/products');
if (is_dir($productsDir)) {
    $perms = substr(sprintf('%o', fileperms($productsDir)), -4);
    echo "Products directory permissions: {$perms}\n";
    
    if ($perms !== '0755') {
        echo "Setting permissions to 755...\n";
        chmod($productsDir, 0755);
        echo "✓ Permissions updated\n";
    }
}

echo "\n=== FIX COMPLETE ===\n";
echo "\nNow test: " . config('app.url') . "/storage/products/01KG4P0CT1TGDVRTNTRNMS0311.jpg\n";
