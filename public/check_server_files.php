<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain');

$secret = 'grevia_storage_2026';
if (empty($_GET['key']) || $_GET['key'] !== $secret) {
    die("Access Denied.");
}

$baseDir = dirname(__DIR__);
$targetDir = $baseDir . '/storage/app/public';
$publicStorage = __DIR__ . '/storage';

echo "=== SERVER DIAGNOSTICS ===\n\n";
echo "Base Dir: $baseDir\n";
echo "Target Dir: $targetDir\n";
echo "Public Storage symlink path: $publicStorage\n";
echo "Is symlink: " . (is_link($publicStorage) ? "Yes" : "No") . "\n";
echo "Symlink target: " . @readlink($publicStorage) . "\n\n";

echo "--- PRODUCTS DIRECTORY ---\n";
$productsDir = $targetDir . '/products';
if (is_dir($productsDir)) {
    echo "Directory exists.\n";
    $files = glob($productsDir . '/*');
    echo "Total files: " . count($files) . "\n";
    foreach (array_slice($files, 0, 20) as $file) {
        echo "  - " . basename($file) . " (" . filesize($file) . " bytes)\n";
    }
} else {
    echo "Directory does NOT exist.\n";
}

echo "\n--- VARIANTS DIRECTORY ---\n";
$variantsDir = $targetDir . '/variants';
if (is_dir($variantsDir)) {
    echo "Directory exists.\n";
    $files = glob($variantsDir . '/*');
    echo "Total files: " . count($files) . "\n";
    foreach (array_slice($files, 0, 20) as $file) {
        echo "  - " . basename($file) . " (" . filesize($file) . " bytes)\n";
    }
} else {
    echo "Directory does NOT exist.\n";
}
