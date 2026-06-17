<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain');

$secret = 'grevia_storage_2026';
if (empty($_GET['key']) || $_GET['key'] !== $secret) {
    die("Access Denied.");
}

echo "=== SERVER DIAGNOSTICS: FILE FINDER ===\n\n";

$searchRoots = [
    '/home/u766289801/domains/grevia.in',
    '/home/u766289801'
];

$foundDirs = [];
$foundFiles = [];

// Recursive directory iterator to find folders named 'products' or 'variants' or specific image
foreach ($searchRoots as $root) {
    if (!is_dir($root)) continue;
    echo "Scanning root: $root...\n";
    
    try {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        // Limit max scan depth/time to avoid gateway timeout
        $maxItems = 15000;
        $count = 0;
        
        foreach ($iterator as $item) {
            $count++;
            if ($count > $maxItems) {
                echo "Reached max item limit ($maxItems) for scanning this root.\n";
                break;
            }
            
            $path = $item->getPathname();
            $filename = $item->getFilename();
            
            // Look for directories named 'products', 'variants', or 'benefits-page'
            if ($item->isDir() && in_array($filename, ['products', 'variants', 'benefits-page'])) {
                $foundDirs[] = $path;
            }
            
            // Look for specific jpg filenames
            if ($item->isFile() && (str_contains($filename, '01KRG51') || str_contains($filename, '01KJ80R'))) {
                $foundFiles[] = $path . " (" . $item->getSize() . " bytes)";
            }
        }
    } catch (\Exception $e) {
        echo "Error scanning $root: " . $e->getMessage() . "\n";
    }
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
