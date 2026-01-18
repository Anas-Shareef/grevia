<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #2d5016;
        }
        .order-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
            color: #2d5016;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table th, table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .totals {
            margin-top: 20px;
            text-align: right;
        }
        .totals table {
            margin-left: auto;
            width: 300px;
        }
        .grand-total {
            font-size: 1.2em;
            font-weight: bold;
            color: #2d5016;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .badge-pending { background-color: #fef3c7; color: #92400e; }
        .badge-processing { background-color: #dbeafe; color: #1e40af; }
        .badge-completed { background-color: #d1fae5; color: #065f46; }
        .badge-cancelled { background-color: #fee2e2; color: #991b1b; }
        .badge-paid { background-color: #d1fae5; color: #065f46; } /* Invoice specific */
        .badge-unpaid { background-color: #fee2e2; color: #991b1b; } /* Invoice specific */
    </style>
</head>
<body>
    <div class="header">
        <h1>Grevia</h1>
        <p>INVOICE</p>
    </div>

    <div class="order-info">
        <div>
            <strong>Invoice Number:</strong> {{ $invoice->invoice_number }}<br>
            <strong>Invoice Date:</strong> {{ $invoice->issued_at->format('M d, Y H:i') }}<br>
            <strong>Status:</strong> 
            <span class="badge badge-{{ $invoice->status }}">{{ ucfirst($invoice->status) }}</span>
        </div>
        <div>
            <strong>Order Number:</strong> {{ $invoice->order->order_number }}<br>
            <strong>Order Date:</strong> {{ $invoice->order->created_at->format('M d, Y H:i') }}<br>
            <strong>Customer:</strong> {{ $invoice->order->user->name ?? $invoice->order->name }}
        </div>
    </div>

    <div class="section">
        <h2>Addresses</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <strong>Billing Address:</strong><br>
                @if(is_array($invoice->order->billing_address))
                    {{ $invoice->order->billing_address['name'] ?? '' }}<br>
                    {{ $invoice->order->billing_address['address'] ?? '' }}<br>
                    {{ $invoice->order->billing_address['city'] ?? '' }}, {{ $invoice->order->billing_address['state'] ?? '' }} {{ $invoice->order->billing_address['postcode'] ?? '' }}<br>
                    {{ $invoice->order->billing_address['country'] ?? '' }}
                @endif
            </div>
            <div>
                <strong>Shipping Address:</strong><br>
                @if(is_array($invoice->order->shipping_address))
                    {{ $invoice->order->shipping_address['name'] ?? '' }}<br>
                    {{ $invoice->order->shipping_address['address'] ?? '' }}<br>
                    {{ $invoice->order->shipping_address['city'] ?? '' }}, {{ $invoice->order->shipping_address['state'] ?? '' }} {{ $invoice->order->shipping_address['postcode'] ?? '' }}<br>
                    {{ $invoice->order->shipping_address['country'] ?? '' }}
                @endif
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Invoice Items</h2>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td>{{ $item->sku }}</td>
                    <td>₹{{ number_format($item->price, 2) }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>₹{{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <table>
                <tr>
                    <td>Subtotal:</td>
                    <td>₹{{ number_format($invoice->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td>Tax:</td>
                    <td>₹{{ number_format($invoice->tax, 2) }}</td>
                </tr>
                @if($invoice->discount > 0)
                <tr>
                    <td>Discount:</td>
                    <td>-₹{{ number_format($invoice->discount, 2) }}</td>
                </tr>
                @endif
                <tr class="grand-total">
                    <td>Total:</td>
                    <td>₹{{ number_format($invoice->total, 2) }}</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
