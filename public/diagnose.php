<?php
/**
 * Live Server Git & Cache Diagnostics
 */

header('Content-Type: text/plain');

$secret = 'grevia_deploy_2026';
if (empty($_GET['key']) || $_GET['key'] !== $secret) {
    die("Access Denied: Invalid Key.");
}

echo "=== GREVIA LIVE SERVER DIAGNOSTICS ===\n\n";

// Check if exec is enabled
$exec_enabled = true;
$disabled_functions = explode(',', ini_get('disable_functions'));
$disabled_functions = array_map('trim', $disabled_functions);
if (in_array('exec', $disabled_functions) || !function_exists('exec')) {
    $exec_enabled = false;
    echo "⚠️ WARNING: exec() function is disabled in php.ini on this server.\n\n";
}

function runCmd($cmd) {
    global $exec_enabled;
    if (!$exec_enabled) {
        echo "Cannot run command (exec is disabled): $cmd\n\n";
        return;
    }
    echo "Running: $cmd\n";
    $output = [];
    $returnVar = 0;
    exec($cmd . ' 2>&1', $output, $returnVar);
    echo implode("\n", $output) . "\n";
    echo "Exit Code: $returnVar\n\n";
}

// 1. Show environment info
echo "APP_ENV: " . (getenv('APP_ENV') ?: 'Not set') . "\n";
echo "Current directory: " . getcwd() . "\n\n";

// 2. Check build manifest
$manifestPath = __DIR__ . '/build/manifest.json';
if (file_exists($manifestPath)) {
    echo "✓ Manifest exists. Contents:\n";
    echo file_get_contents($manifestPath) . "\n\n";
} else {
    echo "❌ Manifest does not exist at: $manifestPath\n\n";
}

// 3. Git Status & Log (Only if exec is enabled)
if ($exec_enabled) {
    runCmd('git status');
    runCmd('git log -n 5 --oneline');
}

// 4. Handle Actions
$action = $_GET['action'] ?? null;
if ($action === 'pull' && $exec_enabled) {
    runCmd('git pull origin main');
    if (file_exists($manifestPath)) {
        echo "Manifest contents after pull:\n";
        echo file_get_contents($manifestPath) . "\n\n";
    }
} elseif ($action === 'clear') {
    // We can clear view cache by deleting files in storage/framework/views if artisan fails!
    $viewCacheDir = dirname(__DIR__) . '/storage/framework/views';
    echo "Checking Laravel View Cache Dir: $viewCacheDir\n";
    if (is_dir($viewCacheDir)) {
        $files = glob($viewCacheDir . '/*');
        echo "Found " . count($files) . " cached view files.\n";
        
        if (isset($_GET['confirm']) && $_GET['confirm'] === 'yes') {
            $deleted = 0;
            foreach ($files as $file) {
                if (is_file($file) && basename($file) !== '.gitignore') {
                    if (unlink($file)) {
                        $deleted++;
                    }
                }
            }
            echo "Successfully deleted $deleted cached view files!\n\n";
        } else {
            echo "Append &confirm=yes to delete these files.\n\n";
        }
    } else {
        echo "View cache directory not found.\n\n";
    }

    if ($exec_enabled) {
        chdir(dirname(__DIR__));
        runCmd('php artisan view:clear');
        runCmd('php artisan optimize:clear');
    }
}
