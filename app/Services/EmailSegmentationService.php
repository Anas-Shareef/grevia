<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class EmailSegmentationService
{
    /**
     * Get recipients based on segment type
     */
    public function getRecipients(string $segment): \Illuminate\Database\Eloquent\Collection
    {
        return match($segment) {
            'newsletter_subscribers' => $this->getNewsletterSubscribers(),
            'registered_users' => $this->getRegisteredUsers(),
            'customers' => $this->getCustomers(),
            'all_consented' => $this->getAllConsented(),
            'vip_customers' => $this->getVIPCustomers(),
            'inactive_users' => $this->getInactiveUsers(),
            default => collect([]),
        };
    }

    /**
     * Get count of recipients for a segment
     */
    public function getRecipientCount(string $segment): int
    {
        return match($segment) {
            'newsletter_subscribers' => $this->getNewsletterSubscribersCount(),
            'registered_users' => $this->getRegisteredUsersCount(),
            'customers' => $this->getCustomersCount(),
            'all_consented' => $this->getAllConsentedCount(),
            'vip_customers' => $this->getVIPCustomersCount(),
            'inactive_users' => $this->getInactiveUsersCount(),
            default => 0,
        };
    }

    /**
     * Newsletter Subscribers - People who signed up for newsletter
     * Use for: General marketing, new products, sales announcements
     */
    protected function getNewsletterSubscribers()
    {
        return DB::table('subscribers')
            ->where('is_subscribed', true)
            ->whereNull('deleted_at')
            ->get();
    }

    protected function getNewsletterSubscribersCount(): int
    {
        return DB::table('subscribers')
            ->where('is_subscribed', true)
            ->whereNull('deleted_at')
            ->count();
    }

    /**
     * Registered Users - Created account, gave marketing consent, but never purchased
     * Use for: Personalized product recommendations, first-purchase discounts
     */
    protected function getRegisteredUsers()
    {
        return User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->whereDoesntHave('orders')
            ->get();
    }

    protected function getRegisteredUsersCount(): int
    {
        return User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->whereDoesntHave('orders')
            ->count();
    }

    /**
     * Customers - Users who have placed at least one order
     * Use for: Order updates, review requests, loyalty rewards, repeat purchase incentives
     */
    protected function getCustomers()
    {
        return User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->whereHas('orders')
            ->get();
    }

    protected function getCustomersCount(): int
    {
        return User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->whereHas('orders')
            ->count();
    }

    /**
     * All Consented - Everyone who opted in (users + subscribers)
     * Use for: Major sales, important announcements, seasonal campaigns
     */
    protected function getAllConsented()
    {
        $users = User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->get();

        $subscribers = DB::table('subscribers')
            ->where('is_subscribed', true)
            ->whereNull('deleted_at')
            ->get();

        return $users->merge($subscribers);
    }

    protected function getAllConsentedCount(): int
    {
        $usersCount = User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->count();

        $subscribersCount = DB::table('subscribers')
            ->where('is_subscribed', true)
            ->whereNull('deleted_at')
            ->count();

        return $usersCount + $subscribersCount;
    }

    /**
     * VIP Customers - High-value customers (3+ orders or total spend > threshold)
     * Use for: Exclusive deals, early access, VIP rewards
     */
    protected function getVIPCustomers()
    {
        return User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->whereHas('orders', function($query) {
                $query->where('status', 'completed');
            }, '>=', 3)
            ->get();
    }

    protected function getVIPCustomersCount(): int
    {
        return User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->whereHas('orders', function($query) {
                $query->where('status', 'completed');
            }, '>=', 3)
            ->count();
    }

    /**
     * Inactive Users - Haven't ordered in 30+ days
     * Use for: Re-engagement campaigns, "We miss you" offers
     */
    protected function getInactiveUsers()
    {
        return User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->whereHas('orders', function($query) {
                $query->where('created_at', '<', now()->subDays(30));
            })
            ->whereDoesntHave('orders', function($query) {
                $query->where('created_at', '>=', now()->subDays(30));
            })
            ->get();
    }

    protected function getInactiveUsersCount(): int
    {
        return User::where('marketing_consent', true)
            ->whereNull('unsubscribed_at')
            ->whereHas('orders', function($query) {
                $query->where('created_at', '<', now()->subDays(30));
            })
            ->whereDoesntHave('orders', function($query) {
                $query->where('created_at', '>=', now()->subDays(30));
            })
            ->count();
    }

    /**
     * Get all available segments with descriptions
     */
    public static function getAvailableSegments(): array
    {
        return [
            'newsletter_subscribers' => [
                'label' => 'Newsletter Subscribers',
                'description' => 'People who signed up for newsletter (general marketing)',
                'use_case' => 'New products, sales, general announcements',
            ],
            'registered_users' => [
                'label' => 'Registered Users',
                'description' => 'Users with accounts who gave consent but never purchased',
                'use_case' => 'Personalized recommendations, first-purchase discounts',
            ],
            'customers' => [
                'label' => 'Customers',
                'description' => 'Users who have placed at least one order',
                'use_case' => 'Order updates, review requests, loyalty rewards',
            ],
            'all_consented' => [
                'label' => 'All Consented',
                'description' => 'Everyone who opted in (users + subscribers)',
                'use_case' => 'Major sales, important announcements',
            ],
            'vip_customers' => [
                'label' => 'VIP Customers',
                'description' => 'High-value customers (3+ orders)',
                'use_case' => 'Exclusive deals, early access, VIP rewards',
            ],
            'inactive_users' => [
                'label' => 'Inactive Users',
                'description' => 'Haven\'t ordered in 30+ days',
                'use_case' => 'Re-engagement campaigns, "We miss you" offers',
            ],
        ];
    }
}
