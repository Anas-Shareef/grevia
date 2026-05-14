@php
    $order = $getRecord();
    $history = $order->statusHistory()->orderBy('created_at', 'asc')->get();
    $currentStatus = $order->status;
    
    $statuses = [
        'pending' => ['label' => 'Order Placed', 'icon' => 'heroicon-o-shopping-cart'],
        'processing' => ['label' => 'Processing', 'icon' => 'heroicon-o-cog'],
        'shipped' => ['label' => 'Shipped', 'icon' => 'heroicon-o-truck'],
        'delivered' => ['label' => 'Delivered', 'icon' => 'heroicon-o-check-circle'],
        'completed' => ['label' => 'Completed', 'icon' => 'heroicon-o-sparkles'],
    ];
@endphp

<div class="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
    <div class="flow-root">
        <ul role="list" class="-mb-8">
            @foreach ($statuses as $statusKey => $data)
                @php
                    $occurrence = $history->where('new_status', $statusKey)->first();
                    $isCompleted = $occurrence !== null;
                    $isActive = $currentStatus === $statusKey;
                @endphp
                <li>
                    <div class="relative pb-8">
                        @if (!$loop->last)
                            <span class="absolute left-5 top-5 -ml-px h-full w-0.5 {{ $isCompleted ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-700' }}" aria-hidden="true"></span>
                        @endif
                        <div class="relative flex items-start space-x-3">
                            <div>
                                <div class="relative px-1">
                                    <div class="flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white dark:ring-gray-900 {{ $isCompleted ? 'bg-success-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400' }}">
                                        @svg($data['icon'], 'h-5 w-5')
                                    </div>
                                </div>
                            </div>
                            <div class="min-w-0 flex-1 py-1.5">
                                <div class="flex justify-between space-x-4">
                                    <div>
                                        <p class="text-sm font-bold {{ $isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500' }}">
                                            {{ $data['label'] }}
                                        </p>
                                    </div>
                                    <div class="whitespace-nowrap text-right text-xs text-gray-500">
                                        @if($occurrence)
                                            <time datetime="{{ $occurrence->created_at }}">{{ $occurrence->created_at->format('M d, h:i A') }}</time>
                                        @else
                                            <span class="italic">Pending</span>
                                        @endif
                                    </div>
                                </div>
                                @if($occurrence && $occurrence->note)
                                    <p class="mt-1 text-xs text-gray-500 italic">
                                        "{{ $occurrence->note }}"
                                    </p>
                                @endif
                            </div>
                        </div>
                    </div>
                </li>
            @endforeach
        </ul>
    </div>
</div>
