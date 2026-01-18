@component('mail::message')
# Hello {{ $review->guest_name }},

Thank you for reviewing **{{ $review->product->name }}**.

Your review has been received and is currently under moderation. It will appear on the product page once approved.

@component('mail::button', ['url' => config('app.url')])
Visit Store
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
