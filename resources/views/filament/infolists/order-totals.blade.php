@php
    $order = $getRecord();
@endphp

<div class="space-y-2">
    <div class="flex justify-between text-sm py-2">
        <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
        <span class="font-medium text-gray-900 dark:text-white">₹{{ number_format($order->subtotal, 2) }}</span>
    </div>
    
    <div class="flex justify-between text-sm py-2">
        <span class="text-gray-600 dark:text-gray-400">Shipping:</span>
        <span class="font-medium text-gray-900 dark:text-white">₹{{ number_format($order->shipping, 2) }}</span>
    </div>
    
    @if($order->discount > 0)
    <div class="flex justify-between text-sm py-2">
        <span class="text-gray-600 dark:text-gray-400">Discount:</span>
        <span class="font-medium text-green-600 dark:text-green-400">-₹{{ number_format($order->discount, 2) }}</span>
    </div>
    @endif
    
    <div class="flex justify-between text-base font-bold py-3 border-t border-gray-200 dark:border-gray-700">
        <span class="text-gray-900 dark:text-white">Grand Total:</span>
        <span class="text-primary-600 dark:text-primary-400 text-lg">₹{{ number_format($order->total, 2) }}</span>
    </div>
</div>
