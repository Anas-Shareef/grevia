<div class="space-y-3">
    <div class="flex justify-between text-sm">
        <span class="text-gray-500 dark:text-gray-400">Sub Total</span>
        <span class="font-medium">₹{{ number_format((float) $record->subtotal, 2) }}</span>
    </div>

    <div class="flex justify-between text-sm">
        <span class="text-gray-500 dark:text-gray-400">Shipping & Handling</span>
        <span class="font-medium">₹{{ number_format((float) $record->shipping, 2) }}</span>
    </div>

    <div class="flex justify-between text-sm">
        <span class="text-gray-500 dark:text-gray-400">Tax</span>
        <span class="font-medium">₹0.00</span>
    </div>

    @if($record->discount > 0)
        <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Discount</span>
            <span class="font-medium text-danger-600">-₹{{ number_format((float) $record->discount, 2) }}</span>
        </div>
    @endif

    <div class="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

    <div class="flex justify-between items-center">
        <span class="text-base font-bold text-gray-900 dark:text-white">Grand Total</span>
        <span class="text-xl font-bold text-primary-600">₹{{ number_format((float) $record->total, 2) }}</span>
    </div>

    <div class="flex justify-between text-sm mt-2">
        <span class="text-gray-500 dark:text-gray-400">Total Paid</span>
        <span class="font-medium">
            ₹{{ number_format($record->payment_status === 'paid' ? (float) $record->total : 0, 2) }}
        </span>
    </div>

    <div class="flex justify-between text-sm">
        <span class="text-gray-500 dark:text-gray-400">Total Refunded</span>
        <span class="font-medium">
            ₹{{ number_format($record->refunds->sum('amount'), 2) }}
        </span>
    </div>

    <div class="flex justify-between text-sm">
        <span class="text-gray-500 dark:text-gray-400">Total Due</span>
        <span class="font-medium">
            ₹{{ number_format($record->payment_status === 'paid' ? 0 : (float) $record->total, 2) }}
        </span>
    </div>
</div>
