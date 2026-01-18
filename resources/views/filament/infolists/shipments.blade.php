@php
    $order = $getRecord();
@endphp

<div class="space-y-3">
    @forelse($order->shipments as $shipment)
        <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span class="text-gray-500">Tracking #:</span>
                    <span class="font-medium">{{ $shipment->tracking_number }}</span>
                </div>
                <div>
                    <span class="text-gray-500">Courier:</span>
                    <span class="font-medium">{{ $shipment->courier_name }}</span>
                </div>
                <div>
                    <span class="text-gray-500">Status:</span>
                    <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {{ ucfirst($shipment->shipment_status) }}
                    </span>
                </div>
                <div>
                    <span class="text-gray-500">Shipped:</span>
                    <span class="font-medium">{{ $shipment->shipped_at ? $shipment->shipped_at->format('M d, Y') : 'N/A' }}</span>
                </div>
            </div>
        </div>
    @empty
        <p class="text-sm text-gray-500">No shipments yet</p>
    @endforelse
</div>
