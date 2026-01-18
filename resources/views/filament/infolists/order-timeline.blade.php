@php
    $order = $getRecord();
    $history = $order->statusHistory()->orderBy('created_at', 'desc')->get();
@endphp

<div class="space-y-3">
    @forelse($history as $item)
        <div class="flex gap-4 text-sm">
            <div class="w-32 text-gray-500 dark:text-gray-400">
                {{ $item->created_at->format('M d, Y H:i') }}
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-900 dark:text-white">{{ ucfirst($item->new_status) }}</span>
                    @if($item->old_status)
                        <span class="text-gray-400">from {{ ucfirst($item->old_status) }}</span>
                    @endif
                </div>
                @if($item->note)
                    <p class="text-gray-600 dark:text-gray-400 mt-1">{{ $item->note }}</p>
                @endif
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    By: {{ $item->changedBy->name ?? 'System' }}
                </p>
            </div>
        </div>
    @empty
        <p class="text-sm text-gray-500 dark:text-gray-400">No status history available</p>
    @endforelse
</div>
