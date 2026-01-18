@php
    $order = $getRecord();
@endphp

<div class="space-y-4">
    <table class="w-full text-sm text-left">
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
                <td class="py-2 text-gray-600 dark:text-gray-400 w-1/3">Order ID</td>
                <td class="py-2 font-medium text-gray-900 dark:text-white text-blue-600 dark:text-blue-400">#{{ $order->order_number }}</td>
            </tr>
            <tr>
                <td class="py-2 text-gray-600 dark:text-gray-400">Order Date</td>
                <td class="py-2 text-gray-900 dark:text-white">{{ $order->created_at->format('M d, Y') }}</td>
            </tr>
            <tr>
                <td class="py-2 text-gray-600 dark:text-gray-400">Order Status</td>
                <td class="py-2 font-medium">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                        @if($order->status === 'completed') bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400
                        @elseif($order->status === 'pending') bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400
                        @elseif($order->status === 'cancelled') bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400
                        @else bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300
                        @endif">
                        {{ ucfirst($order->status) }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="py-2 text-gray-600 dark:text-gray-400">Channel</td>
                <td class="py-2 text-gray-900 dark:text-white">Default</td>
            </tr>
            <tr>
                <td class="py-2 text-gray-600 dark:text-gray-400">Customer Email</td>
                <td class="py-2 text-gray-900 dark:text-white">{{ $order->email }}</td>
            </tr>
            <tr>
                <td class="py-2 text-gray-600 dark:text-gray-400">Customer Name</td>
                <td class="py-2 text-gray-900 dark:text-white">{{ $order->user->name ?? $order->name }}</td>
            </tr>
            <tr>
                <td class="py-2 text-gray-600 dark:text-gray-400">Shipping Method</td>
                <td class="py-2 text-gray-900 dark:text-white">Flat Rate</td>
            </tr>
            <tr>
                <td class="py-2 text-gray-600 dark:text-gray-400">Payment Method</td>
                <td class="py-2 text-gray-900 dark:text-white">{{ ucfirst($order->payment_method ?? 'Razorpay') }}</td>
            </tr>
            <tr>
                <td class="py-2 text-gray-600 dark:text-gray-400">Payment Status</td>
                <td class="py-2 font-medium">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                        @if($order->payment_status === 'paid') bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400
                        @else bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400
                        @endif">
                        {{ ucfirst($order->payment_status) }}
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
