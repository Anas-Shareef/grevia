<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== BENEFITS PAGES ===\n";
$pages = DB::table('benefits_pages')->get();
echo "Total pages: " . $pages->count() . "\n\n";

foreach ($pages as $page) {
    echo "Page ID: {$page->id}\n";
    echo "Title: {$page->title}\n";
    echo "Active: " . ($page->is_active ? 'Yes' : 'No') . "\n";
    echo "---\n";
}
