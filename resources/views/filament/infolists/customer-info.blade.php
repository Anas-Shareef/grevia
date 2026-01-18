@php
    $order = $getRecord();
    $isGuest = !$order->user_id;
@endphp

<div class="space-y-2 text-sm">
    <div class="flex">
        <span class="w-32 text-gray-600 dark:text-gray-400">Customer Name:</span>
        <span class="text-gray-900 dark:text-white">{{ $order->user->name ?? $order->name ?? 'N/A' }}</span>
    </div>
    
    <div class="flex">
        <span class="w-32 text-gray-600 dark:text-gray-400">Email:</span>
        <span class="text-gray-900 dark:text-white">{{ $order->email ?? 'N/A' }}</span>
    </div>
    
    <div class="flex">
        <span class="w-32 text-gray-600 dark:text-gray-400">Phone:</span>
        <span class="text-gray-900 dark:text-white">{{ $order->phone ?? 'N/A' }}</span>
    </div>
    
    <div class="flex">
        <span class="w-32 text-gray-600 dark:text-gray-400">Account:</span>
        <span class="text-gray-900 dark:text-white">{{ $isGuest ? 'Guest' : 'Registered' }}</span>
    </div>
    
    @if($order->user_id && $order->user)
    <div class="flex">
        <span class="w-32 text-gray-600 dark:text-gray-400">User ID:</span>
        <span class="text-gray-900 dark:text-white">#{{ $order->user_id }}</span>
    </div>
    @endif
</div>
