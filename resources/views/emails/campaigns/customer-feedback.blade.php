@extends('emails.layouts.base')

@section('content')
<h1>❤️ We'd Love Your Feedback</h1>

<p>Hi {{ $customer_name ?? 'there' }},</p>

<p>Thanks for shopping with Grevia! We hope you're loving your recent purchase.</p>

<div style="text-align: center; margin: 30px 0;">
    <p style="font-size: 18px; color: #374151; margin-bottom: 20px;">How would you rate your experience?</p>
    <div style="font-size: 40px; letter-spacing: 10px;">
        ⭐⭐⭐⭐⭐
    </div>
</div>

<p>Your feedback helps us improve and helps other customers make informed decisions. It only takes a minute!</p>

@include('emails.components.cta-button', ['url' => $review_url ?? config('app.url') . '/account/orders', 'text' => 'Write a Review'])

<div class="divider"></div>

<h2>Discover More Products You'll Love</h2>

<p>Based on your recent purchase, we think you might enjoy these handpicked recommendations:</p>

@include('emails.components.cta-button', ['url' => $recommendations_url ?? config('app.url') . '/products', 'text' => 'View Recommendations'])

<p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
    <strong>Need help?</strong> Our customer support team is always here for you. Just reply to this email!
</p>
@endsection
