<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain');

$secret = 'grevia_storage_2026';
if (empty($_GET['key']) || $_GET['key'] !== $secret) {
    die("Access Denied.");
}

echo "=== SERVER DIAGNOSTICS: FAST FILE FINDER ===\n\n";

$searchRoots = [
    '/home/u766289801/domains/grevia.in',
    '/home/u766289801'
];

$foundDirs = [];
$foundFiles = [];

function scanDirCustom($dir, &$foundDirs, &$foundFiles) {
    $files = @scandir($dir);
    if (!$files) return;
    
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            // Skip common large directories to prevent timeouts/limits
            if ($file === 'node_modules' || $file === 'vendor' || $file === '.git' || $file === 'framework' || $file === 'cache') {
                continue;
            }
            if (in_array($file, ['products', 'variants', 'benefits-page'])) {
                $foundDirs[] = $path;
            }
            scanDirCustom($path, $foundDirs, $foundFiles);
        } else {
            if (str_contains($file, '01KRG51') || str_contains($file, '01KJ80R')) {
                $foundFiles[] = $path . " (" . @filesize($path) . " bytes)";
            }
        }
    }
}

foreach ($searchRoots as $root) {
    if (!is_dir($root)) continue;
    echo "Scanning root: $root...\n";
    scanDirCustom($root, $foundDirs, $foundFiles);
}

echo "\n--- SEARCH RESULTS ---\n";
echo "\nFound directories:\n";
if (empty($foundDirs)) {
    echo "None.\n";
} else {
    foreach ($foundDirs as $dir) {
        echo "  - $dir\n";
    }
}

echo "\nFound specific files:\n";
if (empty($foundFiles)) {
    echo "None.\n";
} else {
    foreach ($foundFiles as $file) {
        echo "  - $file\n";
    }
}
