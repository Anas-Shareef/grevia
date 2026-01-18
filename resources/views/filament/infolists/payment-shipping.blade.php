@php
    $order = $getRecord();
    $payment = $order->payments->first();
@endphp

<div class="space-y-4 text-sm">
    <!-- Payment Section -->
    <div class="space-y-2">
        <div class="font-medium text-gray-900 dark:text-white pb-1 border-b border-gray-100 dark:border-gray-800">
            {{ ucfirst($order->payment_method ?? 'Razorpay') }}
            <span class="block text-xs font-normal text-gray-500">Payment method</span>
        </div>

        <div class="font-medium text-gray-900 dark:text-white">
            {{ strtoupper($order->currency ?? 'INR') }}
            <span class="block text-xs font-normal text-gray-500">Currency</span>
        </div>
    </div>

    <!-- Shipping Section -->
    <div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div class="font-medium text-gray-900 dark:text-white">
            Flat Rate - Flat Rate
            <span class="block text-xs font-normal text-gray-500">Shipping Method</span>
        </div>

        <div class="font-medium text-gray-900 dark:text-white">
            ₹{{ number_format($order->shipping, 2) }}
            <span class="block text-xs font-normal text-gray-500">Shipping Price</span>
        </div>
    </div>
</div>
