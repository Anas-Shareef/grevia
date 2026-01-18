@php
    $order = $getRecord();
    $payment = $order->payments->first();
@endphp

<div class="space-y-2 text-sm">
    <div class="flex">
        <span class="w-40 text-gray-600 dark:text-gray-400">Payment Method:</span>
        <span class="text-gray-900 dark:text-white">{{ ucfirst($order->payment_method ?? 'Razorpay') }}</span>
    </div>
    
    <div class="flex">
        <span class="w-40 text-gray-600 dark:text-gray-400">Payment Status:</span>
        <span class="text-gray-900 dark:text-white">{{ ucfirst($order->payment_status) }}</span>
    </div>
    
    @if($payment)
        @if($payment->razorpay_order_id)
        <div class="flex">
            <span class="w-40 text-gray-600 dark:text-gray-400">Razorpay Order ID:</span>
            <span class="font-mono text-xs text-gray-900 dark:text-white">{{ $payment->razorpay_order_id }}</span>
        </div>
        @endif
        
        @if($payment->razorpay_payment_id)
        <div class="flex">
            <span class="w-40 text-gray-600 dark:text-gray-400">Razorpay Payment ID:</span>
            <span class="font-mono text-xs text-gray-900 dark:text-white">{{ $payment->razorpay_payment_id }}</span>
        </div>
        @endif
        
        <div class="flex">
            <span class="w-40 text-gray-600 dark:text-gray-400">Amount:</span>
            <span class="font-semibold text-gray-900 dark:text-white">₹{{ number_format($payment->amount, 2) }}</span>
        </div>
        
        @if($payment->verified_at)
        <div class="flex">
            <span class="w-40 text-gray-600 dark:text-gray-400">Transaction Date:</span>
            <span class="text-gray-900 dark:text-white">{{ $payment->verified_at->format('M d, Y h:i A') }}</span>
        </div>
        @endif
    @endif
</div>
