<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \App\Models\Order::observe(\App\Observers\OrderObserver::class);
        \App\Models\ProductReview::observe(\App\Observers\ProductReviewObserver::class);
        
        // Admin Notifications
        // Admin Notifications
        \App\Models\Order::observe(\App\Observers\AdminNotificationObserver::class);
        \App\Models\User::observe(\App\Observers\AdminNotificationObserver::class);
        \App\Models\Product::observe(\App\Observers\AdminNotificationObserver::class);
        \App\Models\ProductReview::observe(\App\Observers\AdminNotificationObserver::class);
        \App\Models\Payment::observe(\App\Observers\AdminNotificationObserver::class);
        \App\Models\Refund::observe(\App\Observers\AdminNotificationObserver::class);
        \App\Models\SiteSetting::observe(\App\Observers\AdminNotificationObserver::class);

    }
}
