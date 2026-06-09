<?php
define('LARAVEL_START', microtime(true));

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

header('Content-Type: text/plain');

$secret = 'grevia_storage_2026';
if (empty($_GET['key']) || $_GET['key'] !== $secret) {
    die("Access Denied: Invalid Key.");
}

echo "=== MAILERLITE API DIAGNOSTIC ===\n\n";

$apiKey = config('services.mailerlite.api_key');
$groupCustomers = config('services.mailerlite.group_customers');
$groupSubscribers = config('services.mailerlite.group_subscribers');

echo "API Key Length: " . strlen($apiKey) . "\n";
echo "API Key Masked: " . substr($apiKey, 0, 15) . "..." . substr($apiKey, -15) . "\n";
echo "Group Customers: $groupCustomers\n";
echo "Group Subscribers: $groupSubscribers\n\n";

if (empty($apiKey)) {
    die("❌ ERROR: API Key is empty. Make sure you cached the config after editing the .env file.");
}

echo "Sending test request to MailerLite...\n";

try {
    $payload = [
        'email'  => 'diagnostic-test@grevia.in',
        'fields' => [
            'name' => 'Diagnostic Tester',
        ],
        'status' => 'active',
    ];

    if (!empty($groupCustomers)) {
        $payload['groups'] = [$groupCustomers];
    }

    $response = Illuminate\Support\Facades\Http::withToken($apiKey)
        ->timeout(10)
        ->post("https://connect.mailerlite.com/api/subscribers", $payload);

    echo "HTTP Status Code: " . $response->status() . "\n";
    echo "Response Body:\n";
    echo $response->body() . "\n";

} catch (\Throwable $e) {
    echo "❌ EXCEPTION: " . $e->getMessage() . "\n";
}
