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

Route::get('/debug-categories', function () {
    return \App\Models\Category::all(['id', 'name', 'slug']);
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
