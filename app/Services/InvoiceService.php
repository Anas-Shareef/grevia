<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Order;
use Exception;
use Illuminate\Support\Str;

class InvoiceService
{
    public function generateInvoice(Order $order): Invoice
    {
        if ($order->invoices()->where('status', '!=', 'cancelled')->exists()) {
             // For strict 1:1 invoice, we block. Or allow multiple?
             // Plan said "Only one invoice per order" for now.
             // But usually you can invoice partially.
             // Let's stick to simple "One full invoice" for now.
             // Check if any invoice exists
             if($order->invoices()->count() > 0) {
                 throw new Exception("Invoice already exists for this order.");
             }
        }

        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . date('Y') . '-' . strtoupper(Str::random(6)), // Or sequence
            'order_id' => $order->id,
            'status' => 'paid', // Assuming simplified flow where order is paid -> invoice generated
            'subtotal' => $order->subtotal,
            'tax' => 0, // Simplified tax for now
            'discount' => $order->discount,
            'total' => $order->total,
            'issued_at' => now(),
        ]);

        foreach ($order->orderItems as $item) {
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'product_name' => $item->product ? $item->product->name : 'Unknown Product', // Snapshot name
                'sku' => $item->product ? $item->product->sku : null,
                'price' => $item->price,
                'quantity' => $item->quantity,
                'total' => $item->price * $item->quantity,
            ]);
        }
        
        return $invoice;
    }
}
