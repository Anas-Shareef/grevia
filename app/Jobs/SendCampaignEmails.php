<?php

namespace App\Jobs;

use App\Models\EmailCampaign;
use App\Services\EmailSegmentationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendCampaignEmails implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 300;

    public function __construct(
        public EmailCampaign $campaign
    ) {}

    public function handle(): void
    {
        // Update campaign status
        $this->campaign->update(['status' => 'sending']);

        // Get recipients based on segment
        $segmentationService = new EmailSegmentationService();
        $recipients = $segmentationService->getRecipients($this->campaign->target_segment);

        // Update total recipients count
        $this->campaign->update(['total_recipients' => $recipients->count()]);

        // Chunk recipients and dispatch individual send jobs
        $recipients->chunk(100)->each(function ($chunk) {
            foreach ($chunk as $recipient) {
                SendSingleEmail::dispatch(
                    campaign: $this->campaign,
                    recipient: $recipient
                )->onQueue('emails');
            }
        });

        // Campaign will be marked as 'sent' when all individual jobs complete
        // This is handled by the SendSingleEmail job
    }

    public function failed(\Throwable $exception): void
    {
        // Mark campaign as failed
        $this->campaign->update([
            'status' => 'failed',
        ]);

        \Log::error('Campaign sending failed', [
            'campaign_id' => $this->campaign->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
