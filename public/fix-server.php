<?php
/**
 * Grevia Server Routing & Cache Fixer
 * Visit this script via browser: grevia.in/fix-server.php
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h2>🔧 Grevia Server Fixer</h2>";

// 1. Clear OpCache
if (function_exists('opcache_reset')) {
    $result = opcache_reset();
    echo ($result ? "✅ OpCache cleared successfully.<br>" : "❌ OpCache reset failed (may be disabled).<br>");
} else {
    echo "ℹ️ OpCache is not enabled on this server.<br>";
}

// 2. Clear Laravel Caches via system call
echo "<h3>🧹 Clearing Laravel Caches...</h3>";
$commands = [
    'optimize:clear',
    'view:clear',
    'route:clear',
    'config:clear'
];

foreach ($commands as $cmd) {
    echo "Running: php artisan $cmd ... ";
    try {
        // We try to run via shell_exec first
        $output = shell_exec("php artisan $cmd 2>&1");
        if ($output) {
            echo "<pre style='background:#eee;padding:5px'>$output</pre>";
        } else {
            echo "Done (no output).<br>";
        }
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "<br>";
    }
}

// 3. Verify .htaccess
echo "<h3>📂 Verifying Files...</h3>";
$htaccess = __DIR__ . '/.htaccess';
if (file_exists($htaccess)) {
    echo "✅ .htaccess exists in public folder.<br>";
} else {
    echo "⚠️ .htaccess MISSING from public folder! Routing will fail.<br>";
}

$index = __DIR__ . '/index.php';
if (file_exists($index)) {
    echo "✅ index.php exists in public folder.<br>";
}

echo "<h3>✅ Finished!</h3>";
echo "Please delete this file (fix-server.php) after use for security!";
