<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\Auth;
use App\Services\NavigationBadgeService;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'old_status' => null,
            'new_status' => $order->status,
            'changed_by' => Auth::id(),
            'note' => 'Order placed successfully.',
        ]);
        
        // Clear navigation badge cache
        NavigationBadgeService::clearCache();
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->isDirty('status')) {
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'old_status' => $order->getOriginal('status'),
                'new_status' => $order->status,
                'changed_by' => Auth::id(),
                'note' => 'Status changed from ' . $order->getOriginal('status') . ' to ' . $order->status,
            ]);
            
            // Clear navigation badge cache when status changes
            NavigationBadgeService::clearCache();
        }
    }
}
