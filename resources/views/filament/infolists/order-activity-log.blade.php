@php
    $order = $getRecord();
    $activities = $order->activities ?? collect();
@endphp

<div class="space-y-3">
    @forelse($activities as $activity)
        <div class="flex gap-4 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div class="w-32 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {{ $activity->created_at->format('M d, Y') }}<br>
                {{ $activity->created_at->format('H:i A') }}
            </div>
            
            <div class="flex-1">
                <!-- Activity Type Badge -->
                <div class="flex items-center gap-2 mb-1">
                    <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded
                        @if($activity->activity_type === 'status_change') bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400
                        @elseif($activity->activity_type === 'invoice') bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400
                        @elseif($activity->activity_type === 'shipment') bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400
                        @elseif($activity->activity_type === 'refund') bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400
                        @elseif($activity->activity_type === 'payment') bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400
                        @else bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400
                        @endif">
                        {{ ucfirst(str_replace('_', ' ', $activity->activity_type)) }}
                    </span>
                </div>
                
                <!-- Description -->
                <p class="text-sm text-gray-900 dark:text-white mb-1">{{ $activity->description }}</p>
                
                <!-- Old/New Values if present -->
                @if($activity->old_value || $activity->new_value)
                    <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
                        @if($activity->old_value)
                            <span class="line-through">{{ $activity->old_value }}</span>
                            <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                            </svg>
                        @endif
                        @if($activity->new_value)
                            <span class="font-medium text-gray-900 dark:text-white">{{ $activity->new_value }}</span>
                        @endif
                    </div>
                @endif
                
                <!-- Actor -->
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    By: {{ $activity->user->name ?? 'System' }}
                </p>
            </div>
        </div>
    @empty
        <p class="text-sm text-gray-500 dark:text-gray-400">No activity recorded yet</p>
    @endforelse
</div>
