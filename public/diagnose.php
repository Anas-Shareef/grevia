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

function runCmd($cmd) {
    echo "Running: $cmd\n";
    $output = [];
    $returnVar = 0;
    exec($cmd . ' 2>&1', $output, $returnVar);
    echo implode("\n", $output) . "\n";
    echo "Exit Code: $returnVar\n\n";
}

// 1. Show environment info
echo "APP_ENV: " . (getenv('APP_ENV') ?: 'Not set') . "\n";
echo "Current directory: " . getcwd() . "\n";
echo "Git version: ";
exec('git --version 2>&1', $gitVer);
echo implode("\n", $gitVer) . "\n\n";

// 2. Check build manifest
$manifestPath = __DIR__ . '/build/manifest.json';
if (file_exists($manifestPath)) {
    echo "Manifest exists. Contents:\n";
    echo file_get_contents($manifestPath) . "\n\n";
} else {
    echo "Manifest does not exist at: $manifestPath\n\n";
}

// 3. Git Status & Log
runCmd('git status');
runCmd('git log -n 5 --oneline');

// 4. Handle Actions
$action = $_GET['action'] ?? null;
if ($action === 'pull') {
    runCmd('git pull origin main');
    // Read manifest again
    if (file_exists($manifestPath)) {
        echo "Manifest contents after pull:\n";
        echo file_get_contents($manifestPath) . "\n\n";
    }
} elseif ($action === 'clear') {
    // Navigate up to root for artisan commands
    chdir(dirname(__DIR__));
    echo "Changed directory to: " . getcwd() . "\n\n";
    runCmd('php artisan view:clear');
    runCmd('php artisan optimize:clear');
}
