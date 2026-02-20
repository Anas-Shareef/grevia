<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 0;
            size: A4;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.45;
            color: #333;
        }

        /* ── OUTER WRAPPER — controls all margins ── */
        .page {
            padding: 25.4mm 19mm 25.4mm 19mm; /* top 1in | right 0.75in | bottom 1in | left 0.75in */
        }

        /* ── HEADER ── */
        .header {
            display: table;
            width: 100%;
            padding-bottom: 8px;
            margin-bottom: 4px;
        }
        .header-left {
            display: table-cell;
            vertical-align: middle;
            width: 50%;
        }
        .header-left img {
            height: 52px;
            width: auto;
        }
        .header-right {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            width: 50%;
        }
        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #2d7a2d;
            letter-spacing: 3px;
        }
        .header-site {
            font-size: 10px;
            color: #888;
            letter-spacing: 1px;
            margin-top: 1px;
        }

        /* ── DIVIDERS ── */
        .divider {
            border: none;
            border-top: 2px solid #2d7a2d;
            margin: 0 0 12px 0;
        }
        .divider-thin {
            border: none;
            border-top: 1px solid #ddd;
            margin: 10px 0;
        }

        /* ── META INFO ── */
        .meta-row {
            display: table;
            width: 100%;
            margin-bottom: 12px;
        }
        .meta-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            font-size: 11px;
        }
        .meta-col p { margin: 3px 0; }
        .meta-col .label { color: #555; }
        .meta-col .value { font-weight: bold; color: #111; }

        /* ── ADDRESS ── */
        .address-row {
            display: table;
            width: 100%;
            margin-bottom: 12px;
        }
        .address-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            padding-right: 20px;
            font-size: 11px;
            line-height: 1.7;
        }
        .address-col:last-child {
            padding-right: 0;
            padding-left: 20px;
        }
        .address-heading {
            font-size: 12px;
            font-weight: bold;
            color: #2d7a2d;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* ── ITEMS TABLE ── */
        table.items {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 6px;
        }
        table.items thead tr {
            background-color: #2d7a2d;
            color: #fff;
        }
        table.items thead th {
            padding: 7px 10px;
            text-align: left;
            font-weight: bold;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        table.items thead th:nth-child(3),
        table.items thead th:nth-child(4) { text-align: center; }
        table.items thead th:last-child    { text-align: right; }

        table.items tbody tr:nth-child(even) { background: #f4faf4; }
        table.items tbody tr:nth-child(odd)  { background: #fff; }
        table.items tbody td {
            padding: 7px 10px;
            border-bottom: 1px solid #e5ece5;
        }
        table.items tbody td:nth-child(3),
        table.items tbody td:nth-child(4) { text-align: center; }
        table.items tbody td:last-child    { text-align: right; }

        /* ── TOTALS ── */
        .totals-wrap {
            display: table;
            width: 100%;
            margin-top: 8px;
        }
        .totals-spacer { display: table-cell; width: 55%; }
        .totals-box    { display: table-cell; width: 45%; vertical-align: top; }

        table.totals {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        table.totals td {
            padding: 5px 10px;
            border-bottom: 1px solid #eee;
        }
        table.totals td:first-child { color: #555; }
        table.totals td:last-child  { text-align: right; font-weight: 500; }

        .grand-total-row {
            background: #2d7a2d;
            font-weight: bold;
            font-size: 12px;
        }
        .grand-total-row td {
            color: #fff !important;
            border-bottom: none !important;
        }

        /* ── BADGE ── */
        .badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            vertical-align: middle;
        }
        .badge-paid       { background: #d1fae5; color: #065f46; }
        .badge-pending    { background: #fef3c7; color: #92400e; }
        .badge-cancelled  { background: #fee2e2; color: #991b1b; }
        .badge-unpaid     { background: #fee2e2; color: #991b1b; }
        .badge-processing { background: #dbeafe; color: #1e40af; }

        /* ── FOOTER ── */
        .footer {
            margin-top: 16px;
            border-top: 2px solid #2d7a2d;
            padding-top: 8px;
            font-size: 10px;
            color: #888;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="page">

    {{-- ══ HEADER ══ --}}
    <div class="header">
        <div class="header-left">
            <img src="{{ public_path('grevia-logo.png') }}" alt="Grevia">
        </div>
        <div class="header-right">
            <div class="invoice-title">INVOICE</div>
            <div class="header-site">grevia.in</div>
        </div>
    </div>
    <hr class="divider">

    {{-- ══ META INFO ══ --}}
    <div class="meta-row">
        <div class="meta-col">
            <p><span class="label">Invoice ID: </span><span class="value">{{ $invoice->invoice_number }}</span></p>
            <p><span class="label">Invoice Date: </span><span class="value">{{ $invoice->issued_at->format('d-m-Y') }}</span></p>
            <p><span class="label">Status: </span><span class="badge badge-{{ $invoice->status }}">{{ ucfirst($invoice->status) }}</span></p>
        </div>
        <div class="meta-col" style="text-align:right;">
            <p><span class="label">Order ID: </span><span class="value">{{ $invoice->order->order_number }}</span></p>
            <p><span class="label">Order Date: </span><span class="value">{{ $invoice->order->created_at->format('d-m-Y') }}</span></p>
            <p><span class="label">Customer: </span><span class="value">{{ $invoice->order->user->name ?? $invoice->order->name }}</span></p>
        </div>
    </div>

    <hr class="divider-thin">

    {{-- ══ ADDRESSES ══ --}}
    <div class="address-row">
        <div class="address-col">
            <div class="address-heading">Bill to</div>
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
            <div class="address-heading">Ship to</div>
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

    <hr class="divider-thin">

    {{-- ══ ITEMS TABLE ══ --}}
    <table class="items">
        <thead>
            <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            <tr>
                <td>{{ $item->sku ?? 'N/A' }}</td>
                <td>{{ $item->product_name }}</td>
                <td>Rs. {{ number_format($item->price, 2) }}</td>
                <td>{{ $item->quantity }}</td>
                <td>Rs. {{ number_format($item->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    {{-- ══ TOTALS ══ --}}
    <div class="totals-wrap">
        <div class="totals-spacer"></div>
        <div class="totals-box">
            <table class="totals">
                <tr>
                    <td>Subtotal</td>
                    <td style="text-align:center; color:#bbb;">&mdash;</td>
                    <td>Rs. {{ number_format($invoice->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td>Tax</td>
                    <td style="text-align:center; color:#bbb;">&mdash;</td>
                    <td>Rs. {{ number_format($invoice->tax, 2) }}</td>
                </tr>
                @if($invoice->discount > 0)
                <tr>
                    <td>Discount</td>
                    <td style="text-align:center; color:#bbb;">&mdash;</td>
                    <td>- Rs. {{ number_format($invoice->discount, 2) }}</td>
                </tr>
                @endif
                <tr class="grand-total-row">
                    <td>Grand Total</td>
                    <td style="text-align:center;">&mdash;</td>
                    <td>Rs. {{ number_format($invoice->total, 2) }}</td>
                </tr>
            </table>
        </div>
    </div>

    {{-- ══ FOOTER ══ --}}
    <div class="footer">
        Thank you for shopping with Grevia &mdash; Healthy Natural Foods &nbsp;|&nbsp; grevia.in
    </div>

</div>
</body>
</html>
