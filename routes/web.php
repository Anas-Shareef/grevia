<?php

use Illuminate\Support\Facades\Route;

// Root route for React SPA
Route::get('/', function () { return view('app'); });

// Redirect legacy URLs to the new React collections structure with 301 Permanent Redirect
Route::get('/sweeteners', function() { return redirect('/collections?' . request()->getQueryString(), 301); });
Route::get('/products/sweeteners', function() { return redirect('/collections?' . request()->getQueryString(), 301); });

Route::get('/build-eav-tables', function () {
    try {
        if (!\Illuminate\Support\Facades\Schema::hasTable('attributes')) {
            \Illuminate\Support\Facades\Schema::create('attributes', function ($table) {
                $table->id();
                $table->string('name', 100)->unique();
                $table->string('label', 100);
                $table->string('display_type')->default('text_label');
                $table->string('filter_type')->default('single_select');
                $table->integer('sort_order')->default(0);
                $table->boolean('is_required')->default(false);
                $table->timestamps();
            });
        }

        if (!\Illuminate\Support\Facades\Schema::hasTable('attribute_values')) {
            \Illuminate\Support\Facades\Schema::create('attribute_values', function ($table) {
                $table->id();
                $table->foreignId('attribute_id')->constrained('attributes')->cascadeOnDelete();
                $table->string('value_text', 150);
                $table->string('icon_url', 500)->nullable();
                $table->string('slug', 150);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (!\Illuminate\Support\Facades\Schema::hasTable('product_attribute_value')) {
            \Illuminate\Support\Facades\Schema::create('product_attribute_value', function ($table) {
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('value_id')->constrained('attribute_values')->restrictOnDelete();
                $table->primary(['product_id', 'value_id']);
            });
        }

        if (!\Illuminate\Support\Facades\Schema::hasTable('product_content')) {
            \Illuminate\Support\Facades\Schema::create('product_content', function ($table) {
                $table->foreignId('product_id')->primary()->constrained('products')->cascadeOnDelete();
                $table->longText('attr_product_story')->nullable();
                $table->longText('attr_usage_prep')->nullable();
                $table->timestamps();
            });
        }
        
        // Seed logic directly
        \App\Models\Attribute::firstOrCreate(['name' => 'format'], ['label' => 'Format', 'display_type' => 'text_label', 'filter_type' => 'single_select']);
        \App\Models\Attribute::firstOrCreate(['name' => 'concentration'], ['label' => 'Concentration', 'display_type' => 'text_label', 'filter_type' => 'single_select']);
        \App\Models\Attribute::firstOrCreate(['name' => 'pack_size'], ['label' => 'Pack Size', 'display_type' => 'text_label', 'filter_type' => 'multi_select']);
        \App\Models\Attribute::firstOrCreate(['name' => 'trust_badges'], ['label' => 'Trust Badges', 'display_type' => 'icon_text', 'filter_type' => 'not_filtered']);

        return 'EAV tables and seed criteria generated successfully!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

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

Route::get('/fix-db', function () {
    try {
        if (!\Illuminate\Support\Facades\Schema::hasColumn('categories', 'show_in_filter')) {
            \Illuminate\Support\Facades\Schema::table('categories', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->boolean('show_in_filter')->default(true)->after('status');
            });
            \Illuminate\Support\Facades\Artisan::call('optimize:clear');
            return "Database Fixed! The show_in_filter column has been added to categories table.";
        }
        return "Database is already up to date!";
    } catch (\Exception $e) {
        return "Error: " . $e->getMessage();
    }
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

// One-click setup: runs email marketing migrations on the server
Route::get('/setup-email-campaigns', function () {
    $results = [];
    $migrations = [
        '2026_02_17_151340_create_email_templates_table',
        '2026_02_17_151342_create_email_campaigns_table',
        '2026_02_17_151343_create_email_logs_table',
    ];

    foreach ($migrations as $migration) {
        try {
            \Illuminate\Support\Facades\Artisan::call('migrate', [
                '--path' => "database/migrations/{$migration}.php",
                '--force' => true,
            ]);
            $results[] = "✅ {$migration}";
        } catch (\Exception $e) {
            $results[] = "⚠️ {$migration}: " . $e->getMessage();
        }
    }

    \Illuminate\Support\Facades\Artisan::call('optimize:clear');

    $tables = [];
    foreach (['email_templates', 'email_campaigns', 'email_logs'] as $table) {
        $tables[$table] = \Illuminate\Support\Facades\Schema::hasTable($table) ? '✅ exists' : '❌ missing';
    }

    return response('<pre style="font-family:monospace;padding:20px">'
        . '<h2>📧 Email Campaign Setup</h2>'
        . implode("\n", $results)
        . "\n\n<strong>Tables:</strong>\n"
        . implode("\n", array_map(fn($k, $v) => "$k: $v", array_keys($tables), $tables))
        . "\n\n✅ Done! Go to <a href=\"/admin/email-campaigns\">/admin/email-campaigns</a> to create your first campaign."
        . '</pre>');
});

// Emergency Database Fix: Direct SQL execution
Route::get('/emergency-db-fix', function () {
    try {
        $results = [];
        
        // 1. Check/Add nutrition_facts
        if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'nutrition_facts')) {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE `products` ADD COLUMN `nutrition_facts` TEXT NULL AFTER `use_case` ");
            $results[] = "✅ Added nutrition_facts";
        } else {
            $results[] = "ℹ️ nutrition_facts already exists";
        }

        // 2. Check/Add usage_instructions
        if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'usage_instructions')) {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE `products` ADD COLUMN `usage_instructions` TEXT NULL AFTER `nutrition_facts` ");
            $results[] = "✅ Added usage_instructions";
        } else {
            $results[] = "ℹ️ usage_instructions already exists";
        }

        \Illuminate\Support\Facades\Artisan::call('optimize:clear');
        $results[] = "⚡ Cache cleared";

        return '<h2>🛠️ Emergency Fix Results</h2><ul><li>' . implode('</li><li>', $results) . '</li></ul>'
             . '<p><a href="/admin/products">→ Back to Products</a></p>';
    } catch (\Exception $e) {
        return '<h2 style="color:red">❌ Emergency Fix Failed</h2><pre>' . $e->getMessage() . '</pre>';
    }
});

// Debug: List columns in products table
Route::get('/debug-columns', function () {
    $columns = \Illuminate\Support\Facades\Schema::getColumnListing('products');
    return ['products_table_columns' => $columns];
});

// One-click setup: runs product attribute migrations
Route::get('/setup-product-attributes', function () {
    try {
        $hasNutrition = \Illuminate\Support\Facades\Schema::hasColumn('products', 'nutrition_facts');
        $hasUsage = \Illuminate\Support\Facades\Schema::hasColumn('products', 'usage_instructions');

        if ($hasNutrition && $hasUsage) {
            return '<h2 style="color:blue">ℹ️ Information: Columns already exist.</h2>
                    <p>Database is already up to date. Go to <a href="/admin/products">Admin → Products</a>.</p>';
        }

        \Illuminate\Support\Facades\Artisan::call('migrate', [
            '--path' => "database/migrations/2026_04_18_074500_add_content_tabs_to_products_table.php",
            '--force' => true,
        ]);
        
        \Illuminate\Support\Facades\Artisan::call('optimize:clear');
        
        return '<h2 style="color:green">✅ Success! Product attributes added.</h2>
                <p>The cache has been cleared. Go to <a href="/admin/products">Admin → Products</a> to edit Nutrition and Usage info.</p>';
    } catch (\Exception $e) {
        // Fallback: If Artisan call fails, try direct statement
        try {
            if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'nutrition_facts')) {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE `products` ADD COLUMN `nutrition_facts` TEXT NULL AFTER `use_case` ");
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'usage_instructions')) {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE `products` ADD COLUMN `usage_instructions` TEXT NULL AFTER `nutrition_facts` ");
            }
            \Illuminate\Support\Facades\Artisan::call('optimize:clear');
            return '<h2 style="color:orange">⚠️ Manual Fix Applied</h2>
                    <p>Columns were added via direct SQL because the migration command failed. You can now use <a href="/admin/products">Admin → Products</a>.</p>';
        } catch (\Exception $e2) {
            return '<h2 style="color:red">❌ Error</h2><pre>' . $e->getMessage() . "\n\n" . $e2->getMessage() . '</pre>';
        }
    }
});

// Admin Excel/CSV Export Routes (no auth guard needed - admin middleware handles it via session)
Route::prefix('admin/export')->group(function () {
    Route::get('/users',            [\App\Http\Controllers\Admin\AdminExportController::class, 'users'])->name('admin.export.users');
    Route::get('/products',         [\App\Http\Controllers\Admin\AdminExportController::class, 'products'])->name('admin.export.products');
    Route::get('/contact-messages', [\App\Http\Controllers\Admin\AdminExportController::class, 'contactMessages'])->name('admin.export.contact-messages');
});

// One-click sync: push all existing users to Moosend mailing list
Route::get('/sync-moosend', function () {
    $moosend = new \App\Services\MoosendService();
    $users   = \App\Models\User::select('id', 'name', 'email')->get();

    $success = 0;
    $failed  = 0;
    $log     = [];

    foreach ($users as $user) {
        $ok = $moosend->subscribe(
            email: $user->email,
            name:  $user->name,
            tags:  ['existing', 'customer']
        );

        if ($ok) {
            $success++;
            $log[] = "✅ {$user->name} ({$user->email})";
        } else {
            $failed++;
            $log[] = "❌ {$user->name} ({$user->email}) - failed";
        }

        // Small delay to avoid rate limiting
        usleep(100000); // 100ms
    }

    $html = '<pre style="font-family:monospace;padding:20px;line-height:1.7">';
    $html .= '<h2>📧 Moosend Sync Complete</h2>';
    $html .= "<strong>Total:</strong> {$users->count()} | ";
    $html .= "<strong style='color:green'>✅ Success: {$success}</strong> | ";
    $html .= "<strong style='color:red'>❌ Failed: {$failed}</strong>\n\n";
    $html .= implode("\n", $log);
    $html .= '\n\n<a href="/admin/email-campaigns">→ Go to Email Campaigns</a>';
    $html .= '</pre>';

    return response($html);
});

// Database Sync Route
Route::get('/sync-filters', function () {
    // 1. Move old data to new columns
    \App\Models\Product::whereNotNull('form')->update(['format' => \Illuminate\Support\Facades\DB::raw('form')]);
    \App\Models\Product::whereNotNull('ratio')->update(['concentration' => \Illuminate\Support\Facades\DB::raw('ratio')]);

    // 2. Handle Duplicate Sweeteners Categories (Merge natural-sweetenerss into natural-sweeteners)
    // We use withTrashed() because a 'ghost' deleted record might be blocking the unique slug index
    $misspelled = \App\Models\Category::withTrashed()->where('slug', 'natural-sweetenerss')->first();
    $correct = \App\Models\Category::withTrashed()->where('slug', 'natural-sweeteners')->first();

    // If the correct one is in the trash, restore it so we can use it
    if ($correct && $correct->trashed()) {
        $correct->restore();
    }

    if ($misspelled && $correct) {
        // Move all products from misspelled to correct
        \App\Models\Product::where('category_id', $misspelled->id)->update(['category_id' => $correct->id]);
        // Delete the misspelled category permanently to free up the slug if needed
        $misspelled->forceDelete();
    } elseif ($misspelled && !$correct) {
        // Just rename it if no correct one exists
        $misspelled->update(['name' => 'Natural Sweeteners', 'slug' => 'natural-sweeteners']);
        if ($misspelled->trashed()) $misspelled->restore();
        $correct = $misspelled;
    }

    // 3. Fix Sub-category hierarchy
    if ($correct) {
        \App\Models\Category::whereIn('slug', ['stevia', 'monk-fruit', 'erythritol', 'xylitol', 'allulose'])->update(['parent_id' => $correct->id]);
    }

    // 4. Ensure 'Other Products' parent exists and link sub-categories
    $other = \App\Models\Category::where('slug', 'other-products')->first();
    if (!$other) {
        $other = \App\Models\Category::create([
            'name' => 'Other Products',
            'slug' => 'other-products',
            'status' => true,
            'show_in_filter' => true,
            'order' => 10,
            'description' => 'Explore our range of artisanal bakery items and traditional pickles.'
        ]);
    }

    if ($other) {
        // Fix names if they were changed
        \App\Models\Category::where('slug', 'bakery')->update(['name' => 'Bakery', 'parent_id' => $other->id]);
        \App\Models\Category::where('slug', 'pickles')->update(['name' => 'Pickles & Preserves', 'parent_id' => $other->id]);
    }

    // 5. Fix Mismatched Slugs found in Audit
    \App\Models\Category::where('slug', 'superfood-powders')->update(['slug' => 'superfood-powders']); // Ensure consistency
    
    // 6. Fix Corrupted Product Name found in Audit
    \App\Models\Product::where('name', 'like', '%MaRoasted%')->update([
        'name' => 'Traditional Mango Pickle',
        'description' => 'A traditional, tangy mango pickle made with hand-picked mangoes and authentic spices.'
    ]);

    return "Database synced successfully! 'Other Products' parent created, Sweeteners merged, Corrupted names cleaned, and Bakery/Pickles organized.";
});

// Catch-all route for React SPA - moved to bottom to prevent route conflicts
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api|admin|filament|storage|build|invoices|test-email|unsubscribe|resubscribe|setup-email-campaigns|sync-moosend|sync-filters|fix-db|fix-server|\..*\.php$).*$');
