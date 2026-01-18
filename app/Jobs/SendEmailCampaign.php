<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\EmailCampaign;
use App\Models\Subscriber;
use App\Mail\PromotionalEmail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendEmailCampaign implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public EmailCampaign $campaign
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Optimistically mark as sending? Or just wait.
        // Let's just process.
        
        Subscriber::where('is_subscribed', true)->chunk(50, function ($subscribers) {
            foreach ($subscribers as $subscriber) {
                // Removed try/catch for debugging
                Mail::to($subscriber->email)->send(new PromotionalEmail($this->campaign, $subscriber));
            }
        });

        $this->campaign->update([
            'status' => 'sent',
            'sent_at' => Carbon::now(),
        ]);
    }
}
