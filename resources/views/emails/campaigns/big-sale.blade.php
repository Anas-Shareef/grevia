@extends('emails.layouts.base')

@section('content')
<h1>🔥 Big Savings Await</h1>

<p>Hello {{ $customer_name ?? 'there' }},</p>

<p><strong>Our biggest sale of the season is now live!</strong></p>

<div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px; border-radius: 12px; margin: 30px 0; text-align: center; color: #ffffff;">
    <p style="margin: 0 0 10px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9;">Limited Time Only</p>
    <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 48px; font-weight: 700;">UP TO 70% OFF</h2>
    <p style="margin: 0; font-size: 18px;">Across All Categories</p>
</div>

<p>Don't miss out on massive discounts across our entire collection. From fashion to accessories, everything is on sale!</p>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 30px 0;">
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 5px 0; font-size: 24px; font-weight: 700; color: #667eea;">50%+</p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Fashion</p>
    </div>
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 5px 0; font-size: 24px; font-weight: 700; color: #667eea;">40%+</p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Accessories</p>
    </div>
</div>

@include('emails.components.cta-button', ['url' => $sale_url ?? config('app.url') . '/products', 'text' => 'Shop the Sale Now'])

<div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
    <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>⏰ Hurry!</strong> Sale ends in 48 hours. Stock is limited and selling fast!
    </p>
</div>
@endsection
