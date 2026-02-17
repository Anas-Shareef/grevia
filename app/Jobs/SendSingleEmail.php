<?php

namespace App\Jobs;

use App\Mail\CampaignEmail;
use App\Models\EmailCampaign;
use App\Models\EmailLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class SendSingleEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 60;
    public $backoff = [60, 120, 300]; // Retry after 1min, 2min, 5min

    public function __construct(
        public EmailCampaign $campaign,
        public $recipient
    ) {}

    public function handle(): void
    {
        // Extract recipient data
        $email = $recipient->email ?? $recipient['email'] ?? null;
        $name = $recipient->name ?? $recipient['name'] ?? 'Customer';
        $userId = $recipient->id ?? $recipient['id'] ?? null;

        if (!$email) {
            throw new \Exception('Recipient email is missing');
        }

        // Create email log
        $log = EmailLog::create([
            'campaign_id' => $this->campaign->id,
            'template_id' => $this->campaign->email_template_id,
            'user_id' => $userId,
            'email' => $email,
            'status' => 'pending',
        ]);

        try {
            // Generate unsubscribe URL
            $unsubscribeUrl = URL::signedRoute('unsubscribe', [
                'email' => $email,
                'campaign_id' => $this->campaign->id,
            ]);

            // Prepare variables
            $variables = [
                'customer_name' => $name,
                'shop_url' => config('app.url') . '/products',
                'sale_url' => config('app.url') . '/products',
                'vip_url' => config('app.url') . '/products',
                'review_url' => config('app.url') . '/account/orders',
                'recommendations_url' => config('app.url') . '/products',
            ];

            // Get email content
            $content = $this->campaign->html_content ?? $this->campaign->template?->html_content ?? '';

            // Send email
            Mail::to($email)->send(
                new CampaignEmail(
                    subject: $this->campaign->subject,
                    htmlContent: $content,
                    variables: $variables,
                    unsubscribeUrl: $unsubscribeUrl
                )
            );

            // Update log as sent
            $log->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            // Increment campaign sent count
            $this->campaign->increment('sent_count');

            // Check if all emails sent, mark campaign as complete
            if ($this->campaign->sent_count + $this->campaign->failed_count >= $this->campaign->total_recipients) {
                $this->campaign->update(['status' => 'sent']);
            }

        } catch (\Exception $e) {
            // Update log as failed
            $log->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            // Increment campaign failed count
            $this->campaign->increment('failed_count');

            // Re-throw to trigger retry
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        // Final failure after all retries
        EmailLog::where('campaign_id', $this->campaign->id)
            ->where('email', $this->recipient->email ?? $this->recipient['email'])
            ->where('status', 'pending')
            ->update([
                'status' => 'failed',
                'error_message' => 'Max retries exceeded: ' . $exception->getMessage(),
            ]);

        \Log::error('Single email send failed permanently', [
            'campaign_id' => $this->campaign->id,
            'email' => $this->recipient->email ?? $this->recipient['email'] ?? 'unknown',
            'error' => $exception->getMessage(),
        ]);
    }
}
