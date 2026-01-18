<?php

namespace App\Observers;

use App\Models\ProductReview;
use App\Services\NavigationBadgeService;

class ProductReviewObserver
{
    /**
     * Handle the ProductReview "created" event.
     */
    public function created(ProductReview $productReview): void
    {
        // Clear navigation badge cache for new reviews
        NavigationBadgeService::clearCache();
    }

    /**
     * Handle the ProductReview "updated" event.
     */
    public function updated(ProductReview $productReview): void
    {
        if ($productReview->isDirty('status') && in_array($productReview->status, ['approved', 'rejected'])) {
             // Determine recipient
             $recipient = $productReview->user ? $productReview->user->email : $productReview->guest_email;
             
             if ($recipient) {
                 \Illuminate\Support\Facades\Mail::to($recipient)->send(new \App\Mail\ReviewStatusUpdated($productReview));
             }
        }
    }

    /**
     * Handle the ProductReview "deleted" event.
     */
    public function deleted(ProductReview $productReview): void
    {
        // Clear navigation badge cache when review deleted
        NavigationBadgeService::clearCache();
    }

    /**
     * Handle the ProductReview "restored" event.
     */
    public function restored(ProductReview $productReview): void
    {
        //
    }

    /**
     * Handle the ProductReview "force deleted" event.
     */
    public function forceDeleted(ProductReview $productReview): void
    {
        //
    }
}
