@php
    $order = $getRecord();
@endphp

<div class="space-y-2 text-sm">
    <div class="flex">
        <span class="w-32 text-gray-600 dark:text-gray-400">Order Date</span>
        <span class="text-gray-900 dark:text-white">{{ $order->created_at->format('d-m-Y h:i:s') }}</span>
    </div>
    
    <div class="flex items-center">
        <span class="w-32 text-gray-600 dark:text-gray-400">Order Status</span>
        @php
            $statusColors = [
                'pending' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                'processing' => 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                'shipped' => 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                'delivered' => 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'cancelled' => 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                'refunded' => 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            ];
            $colorClass = $statusColors[$order->status] ?? 'bg-gray-100 text-gray-800';
        @endphp
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {{ $colorClass }}">
            {{ ucfirst($order->status) }}
        </span>
    </div>
    
    <div class="flex">
        <span class="w-32 text-gray-600 dark:text-gray-400">Channel</span>
        <span class="text-gray-900 dark:text-white">Default</span>
    </div>
</div>
