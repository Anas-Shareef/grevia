@php
    $order = $getRecord();
@endphp

<div class="space-y-4">
    @forelse($order->invoices as $invoice)
        <div class="flex flex-col gap-1">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                Invoice #{{ $invoice->id }}
            </h3>
            
            <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ $invoice->created_at->format('d M, Y H:i:s a') }}
            </p>

            <div class="flex items-center gap-4 mt-1">
                <a href="{{ route('invoices.view', $invoice) }}" target="_blank" class="text-sm text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400">
                    View
                </a>
                <a href="{{ route('invoices.download', $invoice) }}" target="_blank" class="text-sm text-primary-600 hover:text-primary-500 hover:underline dark:text-primary-400">
                    Download PDF
                </a>
            </div>
        </div>
    @empty
        <p class="text-sm text-gray-500">No invoices generated</p>
    @endforelse
</div>
