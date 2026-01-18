<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class NavigationBadgeService
{
    /**
     * Get count of pending orders
     * 
     * @return int
     */
    public static function getPendingOrdersCount(): int
    {
        return Cache::remember('nav_pending_orders', 300, function () {
            return Order::where('status', 'pending')->count();
        });
    }

    /**
     * Get count of customer activity requiring attention
     * (pending reviews + new customers today)
     * 
     * @return int
     */
    public static function getCustomerActivityCount(): int
    {
        return Cache::remember('nav_customer_activity', 300, function () {
            $pendingReviews = ProductReview::where('status', 'pending')->count();
            $newCustomers = User::whereDate('created_at', today())
                ->where('email', 'not like', '%@grevia.com%')
                ->count();
            
            return $pendingReviews + $newCustomers;
        });
    }

    /**
     * Get count of unread contact messages
     * (Optional - implement if contact messages exist)
     * 
     * @return int
     */
    public static function getUnreadMessagesCount(): int
    {
        return Cache::remember('nav_unread_messages', 300, function () {
            // Implement if contact messages table exists
            // return ContactMessage::where('is_read', false)->count();
            return 0;
        });
    }

    /**
     * Clear all navigation badge caches
     * Call this when orders, reviews, or customers are updated
     * 
     * @return void
     */
    public static function clearCache(): void
    {
        Cache::forget('nav_pending_orders');
        Cache::forget('nav_customer_activity');
        Cache::forget('nav_unread_messages');
    }
}
