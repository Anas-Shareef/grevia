@extends('emails.layouts.base')

@section('content')
<h1>😴 We Miss You</h1>

<p>Hi {{ $customer_name ?? 'there' }},</p>

<p>It's been a while since your last visit to Grevia, and we've been thinking about you!</p>

<div style="text-align: center; margin: 30px 0;">
    <div style="font-size: 80px; margin-bottom: 20px;">💔</div>
    <p style="font-size: 18px; color: #6b7280; margin: 0;">We noticed you haven't shopped with us recently</p>
</div>

<p>A lot has changed since you were last here! We've added new collections, improved our service, and we'd love to welcome you back.</p>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 12px; margin: 30px 0; text-align: center; color: #ffffff;">
    <h2 style="margin: 0 0 15px 0; color: #ffffff;">Welcome Back Gift</h2>
    <p style="margin: 0 0 20px 0; font-size: 18px;">Here's something special just for you</p>
    <div style="background: #ffffff; color: #667eea; padding: 15px 30px; border-radius: 8px; display: inline-block; font-weight: 700; font-size: 24px; letter-spacing: 2px;">
        COMEBACK20
    </div>
    <p style="margin: 20px 0 0 0; font-size: 16px; opacity: 0.9;">20% off your next order</p>
</div>

<p>Come back and discover what's new. We promise you won't be disappointed!</p>

@include('emails.components.cta-button', ['url' => $shop_url ?? config('app.url') . '/products', 'text' => 'Come Back & Shop'])

<div class="divider"></div>

<h2>What You've Been Missing:</h2>

<ul style="color: #6b7280; line-height: 1.8;">
    <li>🆕 Brand new collections added weekly</li>
    <li>⚡ Faster checkout experience</li>
    <li>📦 Improved shipping options</li>
    <li>💝 Exclusive member-only deals</li>
</ul>

<p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
    We'd love to have you back! Your discount code is valid for 14 days.
</p>
@endsection
