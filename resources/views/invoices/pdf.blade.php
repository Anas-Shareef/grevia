<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 12mm 14mm;
            size: A4;
        }
        * { box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.3;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            border-bottom: 2px solid #333;
            padding-bottom: 8px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            color: #2d5016;
        }
        .header p {
            margin: 2px 0 0;
            font-size: 11px;
            color: #666;
            letter-spacing: 2px;
        }
        .header-right {
            text-align: right;
            font-size: 11px;
        }
        .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 10px;
        }
        .section {
            margin-bottom: 10px;
        }
        .section h2 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
            margin: 0 0 6px;
            font-size: 13px;
            color: #2d5016;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            font-size: 11px;
        }
        table th, table td {
            padding: 5px 7px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        table th {
            background-color: #f5f5f5;
            font-weight: bold;
            font-size: 11px;
        }
        .totals-row {
            display: flex;
            justify-content: flex-end;
            margin-top: 6px;
        }
        .totals-table {
            width: 240px;
        }
        .totals-table td {
            padding: 3px 7px;
            border: none;
            font-size: 11px;
        }
        .grand-total td {
            font-size: 13px;
            font-weight: bold;
            color: #2d5016;
            border-top: 1px solid #ddd;
            padding-top: 5px;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-pending    { background: #fef3c7; color: #92400e; }
        .badge-processing { background: #dbeafe; color: #1e40af; }
        .badge-completed  { background: #d1fae5; color: #065f46; }
        .badge-cancelled  { background: #fee2e2; color: #991b1b; }
        .badge-paid       { background: #d1fae5; color: #065f46; }
        .badge-unpaid     { background: #fee2e2; color: #991b1b; }
        p { margin: 2px 0; }
    </style>
</head>
<body>

    {{-- Header --}}
    <div class="header">
        <div>
            <h1>Grevia</h1>
            <p>INVOICE</p>
        </div>
        <div class="header-right">
            <strong>{{ $invoice->invoice_number }}</strong><br>
            {{ $invoice->issued_at->format('M d, Y') }}
        </div>
    </div>

    {{-- Invoice & Order Info --}}
    <div class="two-col">
        <div>
            <p><strong>Invoice Number:</strong> {{ $invoice->invoice_number }}</p>
            <p><strong>Invoice Date:</strong> {{ $invoice->issued_at->format('M d, Y H:i') }}</p>
            <p><strong>Status:</strong> <span class="badge badge-{{ $invoice->status }}">{{ ucfirst($invoice->status) }}</span></p>
        </div>
        <div>
            <p><strong>Order Number:</strong> {{ $invoice->order->order_number }}</p>
            <p><strong>Order Date:</strong> {{ $invoice->order->created_at->format('M d, Y H:i') }}</p>
            <p><strong>Customer:</strong> {{ $invoice->order->user->name ?? $invoice->order->name }}</p>
        </div>
    </div>

    {{-- Addresses --}}
    <div class="section">
        <h2>Addresses</h2>
        <div class="two-col">
            <div>
                <strong>Billing Address:</strong><br>
                @if(is_array($invoice->order->billing_address))
                    {{ $invoice->order->billing_address['name'] ?? '' }}<br>
                    {{ $invoice->order->billing_address['address'] ?? '' }}<br>
                    {{ $invoice->order->billing_address['city'] ?? '' }},
                    {{ $invoice->order->billing_address['state'] ?? '' }}
                    {{ $invoice->order->billing_address['postcode'] ?? '' }}<br>
                    {{ $invoice->order->billing_address['country'] ?? '' }}
                @endif
            </div>
            <div>
                <strong>Shipping Address:</strong><br>
                @if(is_array($invoice->order->shipping_address))
                    {{ $invoice->order->shipping_address['name'] ?? '' }}<br>
                    {{ $invoice->order->shipping_address['address'] ?? '' }}<br>
                    {{ $invoice->order->shipping_address['city'] ?? '' }},
                    {{ $invoice->order->shipping_address['state'] ?? '' }}
                    {{ $invoice->order->shipping_address['postcode'] ?? '' }}<br>
                    {{ $invoice->order->shipping_address['country'] ?? '' }}
                @endif
            </div>
        </div>
    </div>

    {{-- Invoice Items --}}
    <div class="section">
        <h2>Invoice Items</h2>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th style="text-align:right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td>{{ $item->sku }}</td>
                    <td>₹{{ number_format($item->price, 2) }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td style="text-align:right;">₹{{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        {{-- Totals --}}
        <div class="totals-row">
            <table class="totals-table">
                <tr>
                    <td>Subtotal:</td>
                    <td style="text-align:right;">₹{{ number_format($invoice->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td>Tax:</td>
                    <td style="text-align:right;">₹{{ number_format($invoice->tax, 2) }}</td>
                </tr>
                @if($invoice->discount > 0)
                <tr>
                    <td>Discount:</td>
                    <td style="text-align:right;">-₹{{ number_format($invoice->discount, 2) }}</td>
                </tr>
                @endif
                <tr class="grand-total">
                    <td>Total:</td>
                    <td style="text-align:right;">₹{{ number_format($invoice->total, 2) }}</td>
                </tr>
            </table>
        </div>
    </div>

</body>
</html>
