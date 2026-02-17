@extends('emails.layouts.base')

@section('content')
<div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px; border-radius: 12px; margin: 0 0 30px 0; text-align: center;">
    <h1 style="margin: 0; color: #ffffff; font-size: 32px;">💎 VIP ONLY</h1>
</div>

<p>Hi {{ $customer_name ?? 'there' }},</p>

<p>As one of our <strong>most valued VIP customers</strong>, you're getting exclusive early access to our upcoming sale!</p>

<div style="background: #f9fafb; padding: 30px; border-radius: 12px; margin: 30px 0; border: 2px solid #fbbf24;">
    <h2 style="margin: 0 0 15px 0; color: #374151;">Your VIP Benefits:</h2>
    <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
        <li style="margin-bottom: 10px;">✨ Shop 24 hours before everyone else</li>
        <li style="margin-bottom: 10px;">🎁 Extra 15% off on top of sale prices</li>
        <li style="margin-bottom: 10px;">📦 Free express shipping on all orders</li>
        <li style="margin-bottom: 0;">🎯 First access to limited edition items</li>
    </ul>
</div>

<p>Your loyalty means everything to us. That's why we're giving you first pick of our best deals before they go public!</p>

@include('emails.components.cta-button', ['url' => $vip_url ?? config('app.url') . '/products', 'text' => 'Access VIP Sale'])

<div style="margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; text-align: center;">
    <p style="margin: 0 0 10px 0; font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 1px;">Your VIP Code</p>
    <div style="background: #ffffff; color: #f59e0b; padding: 15px 30px; border-radius: 8px; display: inline-block; font-weight: 700; font-size: 24px; letter-spacing: 2px;">
        VIP15
    </div>
</div>

<p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
    <strong>Thank you for being a VIP member!</strong> Your continued support makes Grevia special.
</p>
@endsection
