@php
    $order = $getRecord();
@endphp

<div class="space-y-4">

    <!-- HEADER -->
    <div class="flex justify-between items-center border-b pb-3">
        <h3 class="text-lg font-bold">Order Items ({{ $order->orderItems->count() }})</h3>
        <div class="text-lg font-bold">
            Grand Total — ₹{{ number_format($order->total, 2) }}
        </div>
    </div>

    @foreach ($order->orderItems as $item)
        <div class="flex gap-6 p-4 border rounded-lg bg-white dark:bg-gray-900">

            <!-- IMAGE -->
            <div class="w-24 h-24 flex-shrink-0">
                @if ($item->product?->image)
                    <img
                        src="{{ asset('storage/' . $item->product->image) }}"
                        class="w-full h-full object-cover rounded border"
                    >
                @else
                    <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-sm">
                        No Image
                    </div>
                @endif
            </div>

            <!-- DETAILS -->
            <div class="flex-1 space-y-1">
                <div class="font-bold text-lg">
                    {{ $item->product->name ?? $item->name }}
                </div>

                <div class="text-sm text-gray-600">
                    ₹{{ number_format($item->price, 2) }} × {{ $item->quantity }}
                </div>

                <div class="text-sm text-gray-500">
                    SKU — {{ $item->product->sku ?? 'N/A' }}
                </div>

                <div class="text-sm text-gray-500 pt-1">
                    Ordered ({{ $item->quantity }})
                    Invoiced ({{ $item->invoiced_quantity ?? 0 }})
                    Shipped ({{ $item->shipped_quantity ?? 0 }})
                    Refunded ({{ $item->refunded_quantity ?? 0 }})
                </div>
            </div>

            <!-- PRICE -->
            <div class="w-48 text-right border-l pl-4">
                <div class="text-sm text-gray-500">Sub Total</div>
                <div class="text-xl font-bold">
                    ₹{{ number_format($item->total, 2) }}
                </div>
            </div>

        </div>
    @endforeach

    <!-- SUMMARY -->
    <div class="flex justify-end pt-6">
        <div class="w-80 space-y-2 text-sm">

            <div class="flex justify-between">
                <span>Sub Total</span>
                <span>₹{{ number_format($order->sub_total, 2) }}</span>
            </div>

            <div class="flex justify-between">
                <span>Shipping</span>
                <span>₹{{ number_format($order->shipping_amount ?? 0, 2) }}</span>
            </div>

            <div class="flex justify-between">
                <span>Tax</span>
                <span>₹{{ number_format($order->tax_total ?? 0, 2) }}</span>
            </div>

            <div class="flex justify-between font-bold border-t pt-2 text-base">
                <span>Grand Total</span>
                <span>₹{{ number_format($order->total, 2) }}</span>
            </div>
        </div>
    </div>

</div>
