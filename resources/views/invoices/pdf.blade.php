<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 10mm 12mm;
            size: A4;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }

        /* ── Header ── */
        .header {
            display: table;
            width: 100%;
            border-bottom: 3px solid #1a56a0;
            padding-bottom: 10px;
            margin-bottom: 12px;
        }
        .header-left {
            display: table-cell;
            vertical-align: middle;
        }
        .header-left .brand {
            font-size: 26px;
            font-weight: bold;
            color: #1a3a6b;
            letter-spacing: 1px;
        }
        .header-left .tagline {
            font-size: 10px;
            color: #666;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .header-right {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
        }
        .header-right .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #1a56a0;
            letter-spacing: 2px;
        }
        .header-right .invoice-site {
            font-size: 10px;
            color: #888;
            margin-top: 2px;
        }

        /* ── Meta row (Invoice ID / Order ID) ── */
        .meta-row {
            display: table;
            width: 100%;
            margin-bottom: 12px;
            background: #f7faff;
            border: 1px solid #dce8f5;
            border-radius: 3px;
            padding: 8px 10px;
        }
        .meta-col {
            display: table-cell;
            width: 50%;
            font-size: 11px;
        }
        .meta-col p { margin: 2px 0; }
        .meta-col strong { color: #1a3a6b; }

        /* ── Section heading row (blue bar like Bagisto) ── */
        .section-bar {
            display: table;
            width: 100%;
            margin-bottom: 0;
        }
        .section-bar-cell {
            display: table-cell;
            width: 50%;
            background-color: #dde8f5;
            color: #1a3a6b;
            font-weight: bold;
            font-size: 11px;
            padding: 5px 10px;
            border: 1px solid #c5d8ef;
        }
        .section-bar-cell:first-child {
            border-right: 2px solid #fff;
        }

        /* ── Address block ── */
        .address-row {
            display: table;
            width: 100%;
            margin-bottom: 12px;
            border: 1px solid #dce8f5;
            border-top: none;
        }
        .address-col {
            display: table-cell;
            width: 50%;
            padding: 8px 10px;
            font-size: 11px;
            vertical-align: top;
            line-height: 1.6;
        }
        .address-col:first-child {
            border-right: 1px solid #dce8f5;
        }

        /* ── Items table ── */
        .items-section { margin-bottom: 10px; }
        table.items {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        table.items thead tr {
            background-color: #1a56a0;
            color: #fff;
        }
        table.items thead th {
            padding: 6px 8px;
            text-align: left;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        table.items thead th:last-child,
        table.items tbody td:last-child { text-align: right; }
        table.items thead th:nth-child(3),
        table.items thead th:nth-child(4),
        table.items tbody td:nth-child(3),
        table.items tbody td:nth-child(4) { text-align: center; }

        table.items tbody tr:nth-child(even) { background: #f4f8ff; }
        table.items tbody tr:nth-child(odd)  { background: #fff; }
        table.items tbody td {
            padding: 6px 8px;
            border-bottom: 1px solid #e8eef6;
        }

        /* ── Totals ── */
        .totals-wrap {
            display: table;
            width: 100%;
            margin-top: 4px;
        }
        .totals-spacer { display: table-cell; width: 55%; }
        .totals-box {
            display: table-cell;
            width: 45%;
            vertical-align: top;
        }
        table.totals {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        table.totals td {
            padding: 4px 8px;
            border-bottom: 1px solid #eee;
        }
        table.totals td:last-child { text-align: right; }
        .grand-total-row {
            background: #1a56a0;
            color: #fff;
            font-weight: bold;
            font-size: 12px;
        }
        .grand-total-row td { border-bottom: none !important; }

        /* ── Badge ── */
        .badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-paid       { background: #d1fae5; color: #065f46; }
        .badge-pending    { background: #fef3c7; color: #92400e; }
        .badge-cancelled  { background: #fee2e2; color: #991b1b; }
        .badge-unpaid     { background: #fee2e2; color: #991b1b; }
        .badge-processing { background: #dbeafe; color: #1e40af; }
    </style>
</head>
<body>

    {{-- ══ HEADER ══ --}}
    <div class="header">
        <div class="header-left">
            <div class="brand">Grevia</div>
            <div class="tagline">grevia.in</div>
        </div>
        <div class="header-right">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-site">grevia.in</div>
        </div>
    </div>

    {{-- ══ META INFO ══ --}}
    <div class="meta-row">
        <div class="meta-col">
            <p><strong>Invoice ID:</strong> &nbsp;{{ $invoice->invoice_number }}</p>
            <p><strong>Invoice Date:</strong> &nbsp;{{ $invoice->issued_at->format('d-m-Y') }}</p>
            <p><strong>Status:</strong> &nbsp;<span class="badge badge-{{ $invoice->status }}">{{ ucfirst($invoice->status) }}</span></p>
        </div>
        <div class="meta-col">
            <p><strong>Order ID:</strong> &nbsp;{{ $invoice->order->order_number }}</p>
            <p><strong>Order Date:</strong> &nbsp;{{ $invoice->order->created_at->format('d-m-Y') }}</p>
            <p><strong>Customer:</strong> &nbsp;{{ $invoice->order->user->name ?? $invoice->order->name }}</p>
        </div>
    </div>

    {{-- ══ ADDRESSES ══ --}}
    <div class="section-bar">
        <div class="section-bar-cell">Bill to</div>
        <div class="section-bar-cell">Ship to</div>
    </div>
    <div class="address-row">
        <div class="address-col">
            @if(is_array($invoice->order->billing_address))
                {{ $invoice->order->billing_address['name'] ?? '' }}<br>
                {{ $invoice->order->billing_address['address'] ?? '' }}<br>
                {{ $invoice->order->billing_address['city'] ?? '' }},
                {{ $invoice->order->billing_address['state'] ?? '' }}
                {{ $invoice->order->billing_address['postcode'] ?? '' }}<br>
                {{ $invoice->order->billing_address['country'] ?? '' }}<br>
                @if(!empty($invoice->order->billing_address['phone']))
                    Contact: {{ $invoice->order->billing_address['phone'] }}
                @endif
            @else
                &mdash;
            @endif
        </div>
        <div class="address-col">
            @if(is_array($invoice->order->shipping_address))
                {{ $invoice->order->shipping_address['name'] ?? '' }}<br>
                {{ $invoice->order->shipping_address['address'] ?? '' }}<br>
                {{ $invoice->order->shipping_address['city'] ?? '' }},
                {{ $invoice->order->shipping_address['state'] ?? '' }}
                {{ $invoice->order->shipping_address['postcode'] ?? '' }}<br>
                {{ $invoice->order->shipping_address['country'] ?? '' }}<br>
                @if(!empty($invoice->order->shipping_address['phone']))
                    Contact: {{ $invoice->order->shipping_address['phone'] }}
                @endif
            @else
                &mdash;
            @endif
        </div>
    </div>

    {{-- ══ ITEMS TABLE ══ --}}
    <div class="items-section">
        <table class="items">
            <thead>
                <tr>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->sku ?? 'N/A' }}</td>
                    <td>{{ $item->product_name }}</td>
                    <td style="text-align:center;">Rs. {{ number_format($item->price, 2) }}</td>
                    <td style="text-align:center;">{{ $item->quantity }}</td>
                    <td>Rs. {{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    {{-- ══ TOTALS ══ --}}
    <div class="totals-wrap">
        <div class="totals-spacer"></div>
        <div class="totals-box">
            <table class="totals">
                <tr>
                    <td>Subtotal</td>
                    <td>&nbsp;-&nbsp;</td>
                    <td>Rs. {{ number_format($invoice->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td>Tax</td>
                    <td>&nbsp;-&nbsp;</td>
                    <td>Rs. {{ number_format($invoice->tax, 2) }}</td>
                </tr>
                @if($invoice->discount > 0)
                <tr>
                    <td>Discount</td>
                    <td>&nbsp;-&nbsp;</td>
                    <td>Rs. {{ number_format($invoice->discount, 2) }}</td>
                </tr>
                @endif
                <tr class="grand-total-row">
                    <td>Grand Total</td>
                    <td>&nbsp;-&nbsp;</td>
                    <td>Rs. {{ number_format($invoice->total, 2) }}</td>
                </tr>
            </table>
        </div>
    </div>

</body>
</html>
