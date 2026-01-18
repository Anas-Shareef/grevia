<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class OrderExportController extends Controller
{
    /**
     * Generate printable order view
     */
    public function print(Order $order)
    {
        $order->load(['user', 'orderItems.product', 'statusHistory', 'payments', 'shipments', 'invoices', 'refunds']);
        
        return view('orders.print', compact('order'));
    }

    /**
     * Export order as PDF
     */
    public function pdf(Order $order)
    {
        $order->load(['user', 'orderItems.product', 'statusHistory', 'payments', 'shipments']);
        
        $pdf = Pdf::loadView('orders.pdf', compact('order'));
        
        return $pdf->download('order-' . $order->order_number . '.pdf');
    }

    /**
     * Export order as CSV
     */
    public function csv(Order $order)
    {
        $order->load(['user', 'orderItems.product']);
        
        $filename = 'order-' . $order->order_number . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($order) {
            $file = fopen('php://output', 'w');
            
            // Header
            fputcsv($file, ['Order Information']);
            fputcsv($file, ['Order Number', $order->order_number]);
            fputcsv($file, ['Order Date', $order->created_at->format('Y-m-d H:i:s')]);
            fputcsv($file, ['Customer', $order->user->name ?? $order->name]);
            fputcsv($file, ['Email', $order->email]);
            fputcsv($file, ['Phone', $order->phone]);
            fputcsv($file, ['Status', $order->status]);
            fputcsv($file, ['Payment Status', $order->payment_status]);
            fputcsv($file, []);
            
            // Items
            fputcsv($file, ['Order Items']);
            fputcsv($file, ['SKU', 'Product Name', 'Price', 'Quantity', 'Subtotal']);
            
            foreach ($order->orderItems as $item) {
                fputcsv($file, [
                    $item->product->sku ?? 'N/A',
                    $item->product->name ?? 'N/A',
                    number_format($item->price, 2),
                    $item->quantity,
                    number_format($item->total, 2),
                ]);
            }
            
            fputcsv($file, []);
            
            // Totals
            fputcsv($file, ['Totals']);
            fputcsv($file, ['Subtotal', number_format($order->subtotal, 2)]);
            fputcsv($file, ['Shipping', number_format($order->shipping, 2)]);
            fputcsv($file, ['Discount', number_format($order->discount, 2)]);
            fputcsv($file, ['Grand Total', number_format($order->total, 2)]);
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
