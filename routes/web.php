<?php

use Illuminate\Support\Facades\Route;

// Serve React SPA for all non-API/Admin routes
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api|admin|storage|invoices|test-email).*$');

Route::get('/test-email', function () {
    try {
        \Illuminate\Support\Facades\Mail::raw('This is a test email from Hostinger SMTP.', function ($message) {
            $message->to('admin@grevia.in')
                ->subject('Test Email');
        });
        return 'Email Sent Successfully!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/create-admin-user', function () {
    try {
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'admin@grevia.in'],
            [
                'name' => 'Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'is_blocked' => false,
            ]
        );
        // Reset password if user exists but they forgot it
        if (!$user->wasRecentlyCreated) {
            $user->password = \Illuminate\Support\Facades\Hash::make('password123');
            $user->save();
        }
        return 'Admin created/reset! Email: admin@grevia.in, Password: password123';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/fix-storage', function () {
    try {
        $target = storage_path('app/public');
        $link = public_path('storage');

        if (file_exists($link)) {
            return 'Storage link already exists.';
        }

        app('files')->link($target, $link);
        return 'Storage link created successfully!';
    } catch (\Exception $e) {
        return 'Error creating link: ' . $e->getMessage();
    }
});

Route::get('/setup-variant-images', function () {
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('variant_images')) {
            return '<h2 style="color:green">✅ variant_images table already exists! You are ready to go.</h2>
                    <p>Go to <a href="/admin/products/6/edit">Admin → Edit Product</a> to upload variant photos.</p>';
        }

        \Illuminate\Support\Facades\DB::statement('
            CREATE TABLE IF NOT EXISTS `variant_images` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `variant_id` BIGINT UNSIGNED NOT NULL,
                `product_id` BIGINT UNSIGNED NOT NULL,
                `image_path` VARCHAR(255) NOT NULL,
                `is_main` TINYINT(1) NOT NULL DEFAULT 0,
                `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
                `deleted_at` TIMESTAMP NULL DEFAULT NULL,
                `created_at` TIMESTAMP NULL DEFAULT NULL,
                `updated_at` TIMESTAMP NULL DEFAULT NULL,
                PRIMARY KEY (`id`),
                INDEX `variant_images_variant_id_is_main_index` (`variant_id`, `is_main`),
                CONSTRAINT `variant_images_variant_id_foreign`
                    FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE CASCADE,
                CONSTRAINT `variant_images_product_id_foreign`
                    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');

        // Mark migration as run so artisan doesn't try to run it again
        \Illuminate\Support\Facades\DB::table('migrations')->insertOrIgnore([
            'migration' => '2026_02_24_050000_create_variant_images_table',
            'batch'     => \Illuminate\Support\Facades\DB::table('migrations')->max('batch') + 1,
        ]);

        \Illuminate\Support\Facades\Artisan::call('optimize:clear');

        return '<h2 style="color:green">✅ Success! variant_images table created.</h2>
                <p>The cache has been cleared. Go to <a href="/admin/products/6/edit">Admin → Edit Product 6</a>.</p>
                <p>You will now see an <strong>"Add Photo"</strong> button inside each weight variant.</p>
                <p style="color:red"><strong>Important:</strong> Delete this route from web.php after running it once.</p>';

    } catch (\Exception $e) {
        return '<h2 style="color:red">❌ Error</h2><pre>' . $e->getMessage() . '</pre>';
    }
});

Route::get('/setup-banners', function () {
    try {
        $db = \Illuminate\Support\Facades\DB::class;
        $schema = \Illuminate\Support\Facades\Schema::class;

        // Step 1: Add missing columns
        $columns = [
            'badge_text'            => "VARCHAR(255) NULL",
            'description'           => "TEXT NULL",
            'primary_button_text'   => "VARCHAR(255) NULL",
            'primary_button_link'   => "VARCHAR(255) NULL",
            'secondary_button_text' => "VARCHAR(255) NULL",
            'secondary_button_link' => "VARCHAR(255) NULL",
            'features'              => "JSON NULL",
        ];

        $added = [];
        foreach ($columns as $col => $definition) {
            if (!$schema::hasColumn('banners', $col)) {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE `banners` ADD COLUMN `{$col}` {$definition}");
                $added[] = $col;
            }
        }

        \Illuminate\Support\Facades\Artisan::call('optimize:clear');

        // Step 2: Show current banner state
        $banners = \Illuminate\Support\Facades\DB::table('banners')->get();

        $html = '<h2 style="color:green;font-family:sans-serif">✅ Setup Done</h2>';

        if (count($added)) {
            $html .= '<p><strong>Added columns:</strong> ' . implode(', ', $added) . '</p>';
        } else {
            $html .= '<p>All columns already existed.</p>';
        }

        $html .= '<h3 style="font-family:sans-serif">Banners in Database (' . $banners->count() . ' total):</h3>';

        foreach ($banners as $b) {
            $html .= '<div style="border:1px solid #ccc;padding:12px;margin:8px 0;font-family:monospace">';
            $html .= '<b>ID:</b> ' . $b->id . ' | ';
            $html .= '<b>Type:</b> ' . ($b->type ?? 'NULL') . ' | ';
            $html .= '<b>Status:</b> ' . ($b->status ? 'Active ✅' : 'Inactive ❌') . ' | ';
            $html .= '<b>Title:</b> ' . htmlspecialchars(substr($b->title ?? 'NULL', 0, 60)) . '<br>';
            $html .= '<b>Image:</b> ' . ($b->image ?? 'NULL') . '<br>';
            $html .= '</div>';
        }

        if ($banners->count() === 0) {
            $html .= '<p style="color:red"><strong>⚠️ No banners found in database!</strong> Go to <a href="/admin/banners/create">Admin → Create Banner</a> and add one with Type = "Hero Banner" and Status = Active.</p>';
        } else {
            $heroActive = $banners->where('type', 'hero')->where('status', 1)->first();
            if (!$heroActive) {
                $html .= '<p style="color:orange"><strong>⚠️ No active Hero banner found!</strong> Make sure your banner has Type = "Hero Banner" and Status is ON.</p>';
            } else {
                $html .= '<p style="color:green"><strong>✅ Active hero banner found (ID: ' . $heroActive->id . '). It should appear on the homepage.</strong></p>';
            }
        }

        return $html;

    } catch (\Exception $e) {
        return '<h2 style="color:red">❌ Error</h2><pre>' . $e->getMessage() . '</pre>';
    }
});


Route::get('/debug-categories', function () {
    return [
        'categories' => \App\Models\Category::all(['id', 'name', 'slug', 'parent_id']),
        'products' => \App\Models\Product::all(['id', 'name', 'slug', 'category_id', 'subcategory', 'in_stock'])
    ];
});

// Order Export Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/orders/{order}/print', [\App\Http\Controllers\OrderExportController::class, 'print'])
        ->name('orders.print');
    Route::get('/admin/orders/{order}/pdf', [\App\Http\Controllers\OrderExportController::class, 'pdf'])
        ->name('orders.pdf');
    Route::get('/admin/orders/{order}/csv', [\App\Http\Controllers\OrderExportController::class, 'csv'])
        ->name('orders.csv');
});

Route::get('/invoices/{invoice}/download', [\App\Http\Controllers\InvoiceController::class, 'download'])
    ->name('invoices.download');

Route::get('/invoices/{invoice}/view', [\App\Http\Controllers\InvoiceController::class, 'view'])
    ->name('invoices.view');

// Legacy alias to prevent breaks if used elsewhere
Route::get('/invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceController::class, 'download'])
    ->name('invoices.pdf');

// Marketing unsubscribe routes
Route::get('/unsubscribe', [\App\Http\Controllers\UnsubscribeController::class, 'unsubscribe'])
    ->name('unsubscribe');
Route::post('/resubscribe', [\App\Http\Controllers\UnsubscribeController::class, 'resubscribe'])
    ->name('resubscribe');
