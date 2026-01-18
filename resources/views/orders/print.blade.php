<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order #{{ $order->order_number }}</title>
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
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Grevia</h1>
        <p>Order Details</p>
    </div>

    <div class="order-info">
        <div>
            <strong>Order Number:</strong> {{ $order->order_number }}<br>
            <strong>Order Date:</strong> {{ $order->created_at->format('M d, Y H:i') }}<br>
            <strong>Status:</strong> 
            <span class="badge badge-{{ $order->status }}">{{ ucfirst($order->status) }}</span>
        </div>
        <div>
            <strong>Customer:</strong> {{ $order->user->name ?? $order->name }}<br>
            <strong>Email:</strong> {{ $order->email }}<br>
            <strong>Phone:</strong> {{ $order->phone }}
        </div>
    </div>

    <div class="section">
        <h2>Addresses</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <strong>Billing Address:</strong><br>
                @if(is_array($order->billing_address))
                    {{ $order->billing_address['name'] ?? '' }}<br>
                    {{ $order->billing_address['address'] ?? '' }}<br>
                    {{ $order->billing_address['city'] ?? '' }}, {{ $order->billing_address['state'] ?? '' }} {{ $order->billing_address['postcode'] ?? '' }}<br>
                    {{ $order->billing_address['country'] ?? '' }}
                @endif
            </div>
            <div>
                <strong>Shipping Address:</strong><br>
                @if(is_array($order->shipping_address))
                    {{ $order->shipping_address['name'] ?? '' }}<br>
                    {{ $order->shipping_address['address'] ?? '' }}<br>
                    {{ $order->shipping_address['city'] ?? '' }}, {{ $order->shipping_address['state'] ?? '' }} {{ $order->shipping_address['postcode'] ?? '' }}<br>
                    {{ $order->shipping_address['country'] ?? '' }}
                @endif
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Order Items</h2>
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
                @foreach($order->orderItems as $item)
                <tr>
                    <td>{{ $item->product->name ?? 'N/A' }}</td>
                    <td>{{ $item->product->sku ?? 'N/A' }}</td>
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
                    <td>₹{{ number_format($order->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td>Shipping:</td>
                    <td>₹{{ number_format($order->shipping, 2) }}</td>
                </tr>
                @if($order->discount > 0)
                <tr>
                    <td>Discount:</td>
                    <td>-₹{{ number_format($order->discount, 2) }}</td>
                </tr>
                @endif
                <tr class="grand-total">
                    <td>Grand Total:</td>
                    <td>₹{{ number_format($order->total, 2) }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section">
        <h2>Payment Information</h2>
        <strong>Payment Method:</strong> {{ ucfirst($order->payment_method) }}<br>
        <strong>Payment Status:</strong> 
        <span class="badge badge-{{ $order->payment_status }}">{{ ucfirst($order->payment_status) }}</span>
    </div>

    <div class="no-print" style="margin-top: 40px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; background-color: #2d5016; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print Order
        </button>
    </div>
</body>
</html>
