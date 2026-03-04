<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MoosendService
{
    protected string $apiKey;
    protected string $listId;
    protected string $baseUrl = 'https://api.moosend.com/v3';

    public function __construct()
    {
        $this->apiKey = config('services.moosend.api_key', '');
        $this->listId = config('services.moosend.list_id', '');
    }

    /**
     * Subscribe an email address to the Moosend mailing list.
     * Tags: e.g. ['registered'], ['order'], ['newsletter']
     */
    public function subscribe(string $email, string $name = '', array $tags = []): bool
    {
        if (empty($this->apiKey) || empty($this->listId)) {
            Log::warning('[Moosend] API key or List ID not configured.');
            return false;
        }

        try {
            $payload = [
                'Email'                    => $email,
                'Name'                     => $name,
                'HasExternalDoubleOptIn'   => false,
            ];

            if (!empty($tags)) {
                $payload['Tags'] = $tags;
            }

            $response = Http::timeout(10)->post(
                "{$this->baseUrl}/subscribers/{$this->listId}/subscribe.json?apikey={$this->apiKey}",
                $payload
            );

            if ($response->successful()) {
                Log::info("[Moosend] Subscribed: {$email}", ['tags' => $tags]);
                return true;
            }

            Log::warning("[Moosend] Subscribe failed for {$email}", [
                'status'   => $response->status(),
                'response' => $response->body(),
            ]);
            return false;

        } catch (\Exception $e) {
            // Never let Moosend errors crash the app
            Log::error("[Moosend] Exception for {$email}: " . $e->getMessage());
            return false;
        }
    }
}
