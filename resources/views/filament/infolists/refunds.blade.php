@php
    $order = $getRecord();
@endphp

<div class="space-y-3">
    @forelse($order->refunds as $refund)
        <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div class="grid grid-cols-4 gap-3 text-sm">
                <div>
                    <span class="text-gray-500">Amount:</span>
                    <span class="font-medium">₹{{ number_format($refund->amount, 2) }}</span>
                </div>
                <div>
                    <span class="text-gray-500">Status:</span>
                    <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        {{ ucfirst($refund->status) }}
                    </span>
                </div>
                <div class="col-span-2">
                    <span class="text-gray-500">Reason:</span>
                    <span class="font-medium">{{ $refund->reason }}</span>
                </div>
                <div class="col-span-4">
                    <span class="text-xs text-gray-400">{{ $refund->created_at->format('M d, Y H:i') }}</span>
                </div>
            </div>
        </div>
    @empty
        <p class="text-sm text-gray-500">No refunds</p>
    @endforelse
</div>
