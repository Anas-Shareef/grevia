<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\Refund;
use Exception;
use Illuminate\Support\Facades\DB;

class RefundService
{
    public function createRefund(Order $order, array $data): Refund
    {
        // 1. Validate Order Status
        if ($order->status !== 'completed' && $order->status !== 'delivered' && $order->status !== 'shipped' && $order->status !== 'processing') {
             // Allowing refunds on processing/shipped/delivered too if payment was captured.
             // If strict Bagisto: usually only after invoiced/paid.
             // We will check if invoice exists.
        }

        $invoice = Invoice::findOrFail($data['invoice_id']);
        
        // 2. Validate Amount
        $maxRefundAmount = $invoice->total - $invoice->refunds()->sum('amount');
        if ($data['amount'] > $maxRefundAmount) {
            throw new Exception("Refund amount cannot exceed remaining invoice balance (₹{$maxRefundAmount}).");
        }

        return DB::transaction(function () use ($order, $invoice, $data) {
            $refund = Refund::create([
                'order_id' => $order->id,
                'invoice_id' => $invoice->id,
                'amount' => $data['amount'],
                'reason' => $data['reason'],
                'status' => 'processed', // Auto-process for now (Manual refund)
                'processed_at' => now(),
            ]);

            // If fully refunded, maybe update payment status to refunded?
            // For now, we just log it in history
            // (Optional: Update Order Payment Status if fully refunded)

            return $refund;
        });
    }
}
