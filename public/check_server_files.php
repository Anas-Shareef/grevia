<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain');

$secret = 'grevia_storage_2026';
if (empty($_GET['key']) || $_GET['key'] !== $secret) {
    die("Access Denied.");
}

echo "=== SERVER DIAGNOSTICS: COMPREHENSIVE LIST ===\n\n";

$targetDir = '/home/u766289801/domains/grevia.in/public_html/storage/app/public';

function listFolderFiles($dir) {
    echo "Listing: $dir\n";
    if (!is_dir($dir)) {
        echo "❌ Directory does not exist.\n\n";
        return;
    }
    
    $files = scandir($dir);
    $count = 0;
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $count++;
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            echo "  [DIR] $file/\n";
        } else {
            echo "  [FILE] $file (" . filesize($path) . " bytes)\n";
        }
    }
    echo "Total files/folders: $count\n\n";
}

listFolderFiles($targetDir);
listFolderFiles($targetDir . '/products');
listFolderFiles($targetDir . '/variants');
listFolderFiles($targetDir . '/benefits-page');
