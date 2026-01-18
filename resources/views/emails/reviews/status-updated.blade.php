<x-mail::message>
# Review Update

Hello {{ $review->user ? $review->user->name : $review->guest_name }},

Your review for **{{ $review->product->name }}** has been **{{ ucfirst($review->status) }}**.

@if($review->status === 'approved')
Your review is now live on our website! Thank you for sharing your feedback.
@else
Your review was rejected. Please review our community guidelines and try again.
@endif

<x-mail::button :url="config('app.url')">
Visit Store
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
