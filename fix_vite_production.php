<?php
/**
 * Fix Vite Production Mode Issue
 * Run: php fix_vite_production.php
 */

echo "=== FIXING VITE PRODUCTION MODE ===\n\n";

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Step 1: Checking for public/hot file...\n";
$hotFile = public_path('hot');
if (file_exists($hotFile)) {
    unlink($hotFile);
    echo "✓ Removed public/hot file\n";
} else {
    echo "✓ No public/hot file found (good)\n";
}

echo "\nStep 2: Checking environment...\n";
echo "APP_ENV: " . config('app.env') . "\n";
echo "APP_DEBUG: " . (config('app.debug') ? 'true' : 'false') . "\n";
echo "APP_URL: " . config('app.url') . "\n";

if (config('app.env') !== 'production') {
    echo "⚠️  WARNING: APP_ENV is not 'production'\n";
}

echo "\nStep 3: Checking build files...\n";
$manifestPath = public_path('build/manifest.json');
if (file_exists($manifestPath)) {
    echo "✓ Build manifest exists\n";
    $manifest = json_decode(file_get_contents($manifestPath), true);
    echo "  Main JS: " . ($manifest['resources/js/react/main.tsx']['file'] ?? 'NOT FOUND') . "\n";
} else {
    echo "❌ Build manifest NOT found - run 'npm run build:low'\n";
}

echo "\n=== FIX COMPLETE ===\n";
echo "\nNext steps:\n";
echo "1. Run: php artisan view:clear\n";
echo "2. Run: php artisan config:cache\n";
echo "3. Hard refresh browser (Ctrl+Shift+R)\n";
