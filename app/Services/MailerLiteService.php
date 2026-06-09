<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MailerLiteService
{
    protected string $apiKey;
    protected string $groupCustomers;
    protected string $groupSubscribers;
    protected string $baseUrl = 'https://connect.mailerlite.com/api';

    public function __construct()
    {
        $this->apiKey = config('services.mailerlite.api_key', '');
        $this->groupCustomers = config('services.mailerlite.group_customers', '');
        $this->groupSubscribers = config('services.mailerlite.group_subscribers', '');
    }

    /**
     * Subscribe / update a subscriber in MailerLite.
     */
    public function subscribe(string $email, string $name = '', array $groups = [], array $fields = []): bool
    {
        if (empty($this->apiKey)) {
            Log::warning('[MailerLite] API Key is not configured.');
            return false;
        }

        try {
            $fieldsPayload = array_merge([
                'name' => $name,
            ], $fields);

            $payload = [
                'email'  => $email,
                'fields' => $fieldsPayload,
                'status' => 'active',
            ];

            if (!empty($groups)) {
                $payload['groups'] = $groups;
            }

            $response = Http::withToken($this->apiKey)
                ->timeout(10)
                ->post("{$this->baseUrl}/subscribers", $payload);

            if ($response->successful()) {
                Log::info("[MailerLite] Subscribed/Updated: {$email}", ['groups' => $groups]);
                return true;
            }

            Log::warning("[MailerLite] Subscribe failed for {$email}", [
                'status'   => $response->status(),
                'response' => $response->body(),
            ]);
            return false;

        } catch (\Exception $e) {
            Log::error("[MailerLite] Exception for {$email}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Unsubscribe a user globally in MailerLite.
     */
    public function unsubscribe(string $email): bool
    {
        if (empty($this->apiKey)) {
            Log::warning('[MailerLite] API Key is not configured.');
            return false;
        }

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(10)
                ->put("{$this->baseUrl}/subscribers/{$email}", [
                    'status' => 'unsubscribed',
                ]);

            if ($response->successful()) {
                Log::info("[MailerLite] Unsubscribed: {$email}");
                return true;
            }

            Log::warning("[MailerLite] Unsubscribe failed for {$email}", [
                'status'   => $response->status(),
                'response' => $response->body(),
            ]);
            return false;

        } catch (\Exception $e) {
            Log::error("[MailerLite] Exception unsubscribing {$email}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Sync all existing users to the MailerLite Customers Group.
     */
    public function syncAllUsers(): int|bool
    {
        if (empty($this->apiKey) || empty($this->groupCustomers)) {
            Log::warning('[MailerLite] API Key or Customers Group ID is not configured.');
            return false;
        }

        $users = \App\Models\User::where('email', 'not like', '%@grevia.com%')
            ->where('email', 'not like', '%@grevia.in%')
            ->get();

        $count = 0;
        foreach ($users as $user) {
            $success = $this->subscribe(
                email: $user->email,
                name: $user->name,
                groups: [$this->groupCustomers],
                fields: [
                    'registered_at' => $user->created_at->toIso8601String(),
                ]
            );
            if ($success) {
                $count++;
            }
            // Sleep briefly to stay safe with MailerLite's rate limit (120 reqs/min)
            usleep(500000); 
        }

        return $count;
    }

    /**
     * Sync all existing newsletter subscribers to the MailerLite Subscribers Group.
     */
    public function syncAllSubscribers(): int|bool
    {
        if (empty($this->apiKey) || empty($this->groupSubscribers)) {
            Log::warning('[MailerLite] API Key or Subscribers Group ID is not configured.');
            return false;
        }

        $subscribers = \App\Models\Subscriber::where('is_subscribed', true)->get();

        $count = 0;
        foreach ($subscribers as $subscriber) {
            $success = $this->subscribe(
                email: $subscriber->email,
                name: $subscriber->name ?? '',
                groups: [$this->groupSubscribers],
                fields: [
                    'source' => $subscriber->source ?? 'unknown',
                ]
            );
            if ($success) {
                $count++;
            }
            usleep(500000); 
        }

        return $count;
    }
}
