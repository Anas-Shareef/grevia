@php
    $address = $address ?? [];
@endphp

@if($address)
<div class="text-sm text-gray-900 dark:text-white space-y-1">
    <p class="font-medium">{{ $address['name'] ?? 'N/A' }}</p>
    <p>{{ $address['address'] ?? '' }}</p>
    @if(isset($address['city']) || isset($address['state']))
    <p>{{ $address['city'] ?? '' }}{{ isset($address['city']) && isset($address['state']) ? ', ' : '' }}{{ $address['state'] ?? '' }}</p>
    @endif
    @if(isset($address['country']) || isset($address['postcode']))
    <p>{{ $address['country'] ?? '' }} {{ $address['postcode'] ?? '' }}</p>
    @endif
    @if(isset($address['phone']))
    <p class="mt-2">T: {{ $address['phone'] }}</p>
    @endif
</div>
@else
<p class="text-sm text-gray-500 dark:text-gray-400">No address provided</p>
@endif
