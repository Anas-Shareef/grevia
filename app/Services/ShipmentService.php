<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Shipment;
use Exception;
use Illuminate\Support\Facades\DB;

class ShipmentService
{
    public function shipOrder(Order $order, array $data): Shipment
    {
        if ($order->status !== 'processing') {
             // Strict check: only processing orders can be shipped
             throw new Exception("Order must be in 'Processing' state to be shipped.");
        }

        return DB::transaction(function () use ($order, $data) {
            $shipment = Shipment::create([
                'order_id' => $order->id,
                'courier_name' => $data['courier_name'],
                'tracking_number' => $data['tracking_number'],
                'tracking_url' => $data['tracking_url'] ?? null,
                'shipment_status' => 'shipped',
                'shipped_at' => now(),
            ]);

            // Auto-transition Order to Shipped
            $statusService = new OrderStatusService();
            $statusService->updateStatus($order, 'shipped', "Order shipped via {$data['courier_name']} (Tracking: {$data['tracking_number']})");

            return $shipment;
        });
    }
}
