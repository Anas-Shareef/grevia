<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order #{{ $order->order_number }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; }
        .totals { text-align: right; margin-top: 10px; }
        .grand-total { font-weight: bold; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Grevia</h2>
        <h3>Order #{{ $order->order_number }}</h3>
    </div>

    <table class="info-table">
        <tr>
            <td><strong>Order Date:</strong> {{ $order->created_at->format('M d, Y H:i') }}</td>
            <td><strong>Status:</strong> {{ ucfirst($order->status) }}</td>
        </tr>
        <tr>
            <td><strong>Customer:</strong> {{ $order->user->name ?? $order->name }}</td>
            <td><strong>Email:</strong> {{ $order->email }}</td>
        </tr>
    </table>

    <h4>Order Items</h4>
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->orderItems as $item)
            <tr>
                <td>{{ $item->product->name ?? 'N/A' }}</td>
                <td>₹{{ number_format($item->price, 2) }}</td>
                <td>{{ $item->quantity }}</td>
                <td>₹{{ number_format($item->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <p>Subtotal: ₹{{ number_format($order->subtotal, 2) }}</p>
        <p>Shipping: ₹{{ number_format($order->shipping, 2) }}</p>
        @if($order->discount > 0)
        <p>Discount: -₹{{ number_format($order->discount, 2) }}</p>
        @endif
        <p class="grand-total">Grand Total: ₹{{ number_format($order->total, 2) }}</p>
    </div>
</body>
</html>
