<?php
/**
 * Check Benefits Page Storage and URLs
 * Run: php check_benefits_storage.php
 */

echo "=== CHECKING BENEFITS PAGE STORAGE ===\n\n";

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

echo "\nStep 2: Check benefits page data\n";
$page = \App\Models\BenefitsPage::where('is_active', true)->first();

if (!$page) {
    echo "❌ No active benefits page found\n";
    exit(1);
}

echo "✓ Benefits page found (ID: {$page->id})\n";

echo "\nStep 3: Check hero image\n";
if ($page->hero && isset($page->hero['image'])) {
    $heroImage = $page->hero['image'];
    echo "Hero image URL: {$heroImage}\n";
    
    // Extract path from URL
    if (preg_match('/storage\/(.+)$/', $heroImage, $matches)) {
        $relativePath = $matches[1];
        $fullPath = storage_path('app/public/' . $relativePath);
        
        if (file_exists($fullPath)) {
            echo "✓ Hero image file exists: {$fullPath}\n";
            echo "  Size: " . round(filesize($fullPath) / 1024, 2) . " KB\n";
        } else {
            echo "❌ Hero image file NOT found: {$fullPath}\n";
        }
    }
} else {
    echo "No hero image set\n";
}

echo "\nStep 4: Check section images\n";
if ($page->sections) {
    foreach ($page->sections as $index => $section) {
        if (isset($section['image'])) {
            $sectionImage = $section['image'];
            echo "\nSection {$index} image URL: {$sectionImage}\n";
            
            if (preg_match('/storage\/(.+)$/', $sectionImage, $matches)) {
                $relativePath = $matches[1];
                $fullPath = storage_path('app/public/' . $relativePath);
                
                if (file_exists($fullPath)) {
                    echo "✓ Section image exists: {$fullPath}\n";
                    echo "  Size: " . round(filesize($fullPath) / 1024, 2) . " KB\n";
                } else {
                    echo "❌ Section image NOT found: {$fullPath}\n";
                }
            }
        }
    }
}

echo "\nStep 5: Environment check\n";
echo "APP_ENV: " . config('app.env') . "\n";
echo "APP_URL: " . config('app.url') . "\n";
echo "Storage path: " . storage_path('app/public') . "\n";
echo "Public storage: " . public_path('storage') . "\n";

echo "\n=== CHECK COMPLETE ===\n";
