<?php

namespace App\Jobs;

use App\Mail\CampaignEmail;
use App\Models\EmailLog;
use App\Models\MarketingEvent;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class SendMarketingEventEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 60;
    public $backoff = [60, 120, 300];

    public function __construct(
        public MarketingEvent $event,
        public User $user,
        public array $data = []
    ) {}

    public function handle(): void
    {
        // Check if event is active and has template
        if (!$this->event->status || !$this->event->template) {
            return;
        }

        // Check if user has marketing consent
        if (!$this->user->marketing_consent || $this->user->unsubscribed_at) {
            return;
        }

        // Create email log
        $log = EmailLog::create([
            'event_id' => $this->event->id,
            'template_id' => $this->event->email_template_id,
            'user_id' => $this->user->id,
            'email' => $this->user->email,
            'status' => 'pending',
        ]);

        try {
            // Generate unsubscribe URL
            $unsubscribeUrl = URL::signedRoute('unsubscribe', [
                'email' => $this->user->email,
                'event_id' => $this->event->id,
            ]);

            // Merge user data with custom data
            $variables = array_merge([
                'customer_name' => $this->user->name,
                'shop_url' => config('app.url') . '/products',
                'sale_url' => config('app.url') . '/products',
                'vip_url' => config('app.url') . '/products',
                'review_url' => config('app.url') . '/account/orders',
                'recommendations_url' => config('app.url') . '/products',
            ], $this->data);

            // Send email
            Mail::to($this->user->email)->send(
                new CampaignEmail(
                    subject: $this->event->template->subject,
                    htmlContent: $this->event->template->html_content,
                    variables: $variables,
                    unsubscribeUrl: $unsubscribeUrl
                )
            );

            // Update log as sent
            $log->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);

        } catch (\Exception $e) {
            // Update log as failed
            $log->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            // Re-throw to trigger retry
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        \Log::error('Marketing event email failed permanently', [
            'event_id' => $this->event->id,
            'user_id' => $this->user->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
