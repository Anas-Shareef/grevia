<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use Exception;
use Illuminate\Support\Facades\Auth;

class OrderStatusService
{
    protected array $transitions = [
        'pending' => ['processing', 'cancelled'],
        'processing' => ['shipped', 'cancelled'],
        'shipped' => ['delivered', 'cancelled'],
        'delivered' => ['completed'],
        'completed' => ['refunded'], // Refund involves more logic, but status flow allows it
        'cancelled' => [],
        'refunded' => [],
    ];

    public function updateStatus(Order $order, string $newStatus, ?string $note = null): void
    {
        $oldStatus = $order->status;

        if ($oldStatus === $newStatus) {
            return;
        }

        // Validate Transition
        if (!in_array($newStatus, $this->transitions[$oldStatus] ?? [])) {
             // Allow admin override or force? For strict Bagisto style, we block.
             // However, for dev flexibility, we might just log a warning or throw.
             // Let's strict throw for now.
             throw new Exception("Invalid status transition from {$oldStatus} to {$newStatus}.");
        }

        $order->update(['status' => $newStatus]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by' => Auth::id(),
            'note' => $note,
        ]);
    }
}
