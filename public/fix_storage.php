<?php
/**
 * Quick Fix for Storage Symlink & Benefits Images
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/plain');

$secret = 'grevia_storage_2026';
if (empty($_GET['key']) || $_GET['key'] !== $secret) {
    die("Access Denied: Invalid Key.");
}

try {
    echo "=== GREVIA STORAGE SYMLINK FIXER ===\n\n";

    $publicStorage = __DIR__ . '/storage';
    $targetDir = dirname(__DIR__) . '/storage/app/public';

    echo "Public Storage Path: $publicStorage\n";
    echo "Target Directory Path: $targetDir\n\n";

    if (!is_dir($targetDir)) {
        echo "❌ INFO: Target directory does not exist. Attempting to create it...\n";
        if (@mkdir($targetDir, 0755, true)) {
            echo "✓ Target directory created.\n";
        } else {
            echo "❌ Failed to create target directory.\n";
        }
    }

    if (file_exists($publicStorage) || is_link($publicStorage)) {
        echo "Found existing file/symlink at public/storage.\n";
        if (is_link($publicStorage)) {
            echo "It is a symlink. Current target: " . @readlink($publicStorage) . "\n";
            echo "Removing the symlink...\n";
            if (@unlink($publicStorage)) {
                echo "✓ Successfully removed symlink.\n";
            } else {
                echo "❌ Failed to remove symlink.\n";
            }
        } elseif (is_dir($publicStorage)) {
            echo "It is a physical directory! Renaming it to backup...\n";
            $backupName = __DIR__ . '/storage_backup_' . time();
            if (@rename($publicStorage, $backupName)) {
                echo "✓ Successfully renamed directory to: $backupName\n";
            } else {
                echo "❌ Failed to rename directory.\n";
            }
        } else {
            echo "It is a regular file. Deleting it...\n";
            if (@unlink($publicStorage)) {
                echo "✓ Successfully deleted file.\n";
            } else {
                echo "❌ Failed to delete file.\n";
            }
        }
    } else {
        echo "No file or symlink found at public/storage.\n";
    }

    echo "\nCreating new symlink...\n";
    // Create symlink
    if (@symlink($targetDir, $publicStorage)) {
        echo "✓ SUCCESS: Storage symlink created successfully!\n";
        echo "  Symlink points to: " . @readlink($publicStorage) . "\n";
    } else {
        echo "❌ ERROR: Failed to create symlink using PHP symlink().\n";
        // Fallback: Try running artisan storage:link via PHP exec if enabled
        echo "Attempting fallback via Artisan...\n";
        $output = [];
        $ret = 0;
        if (function_exists('exec')) {
            @exec('php ' . dirname(__DIR__) . '/artisan storage:link 2>&1', $output, $ret);
            echo implode("\n", $output) . "\n";
            echo "Artisan Exit Code: $ret\n";
        } else {
            echo "exec() is disabled on this server.\n";
        }
    }

    // Check if benefits-page images exist in target
    $benefitsDir = $targetDir . '/benefits-page';
    echo "\nChecking benefits-page directory: $benefitsDir\n";
    if (is_dir($benefitsDir)) {
        echo "✓ Benefits directory exists.\n";
        $files = glob($benefitsDir . '/*');
        echo "Files inside benefits directory:\n";
        if (is_array($files)) {
            foreach ($files as $file) {
                echo "  - " . basename($file) . " (" . filesize($file) . " bytes)\n";
            }
        } else {
            echo "  No files found (glob returned empty/false).\n";
        }
    } else {
        echo "❌ Benefits directory does NOT exist at $benefitsDir!\n";
    }
} catch (\Throwable $e) {
    echo "\n❌ EXCEPTION CAUGHT: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " on line " . $e->getLine() . "\n";
    echo $e->getTraceAsString() . "\n";
}
