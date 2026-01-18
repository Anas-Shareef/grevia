<x-mail::message>
# {{ $campaign->subject }}

{!! $content !!}

@if($cta_text && $cta_link)
<x-mail::button :url="$cta_link">
{{ $cta_text }}
</x-mail::button>
@endif

<sub style="text-align: center; display: block; margin-top: 20px; color: #666;">
    You are receiving this email because you subscribed to our newsletter. <br>
    <a href="{{ url('/unsubscribe/' . $subscriber_id) }}">Unsubscribe</a>
</sub>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
