@extends('emails.layouts.base')

@section('content')
<h1>💳 Welcome to Grevia</h1>

<p>Hi {{ $customer_name ?? 'there' }},</p>

<p>You're just one step away from your first order with Grevia!</p>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 12px; margin: 30px 0; text-align: center; color: #ffffff;">
    <h2 style="margin: 0 0 15px 0; color: #ffffff; font-size: 32px;">10% OFF</h2>
    <p style="margin: 0 0 20px 0; font-size: 18px;">Your First Purchase</p>
    <div style="background: #ffffff; color: #667eea; padding: 15px 30px; border-radius: 8px; display: inline-block; font-weight: 700; font-size: 24px; letter-spacing: 2px;">
        FIRST10
    </div>
    <p style="margin: 20px 0 0 0; font-size: 14px; opacity: 0.9;">Use this code at checkout</p>
</div>

<p>We've curated a collection of premium products just for you. Start exploring and find your perfect match!</p>

@include('emails.components.cta-button', ['url' => $shop_url ?? config('app.url') . '/products', 'text' => 'Start Shopping'])

<div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-left: 4px solid #667eea; border-radius: 4px;">
    <p style="margin: 0; font-size: 14px; color: #374151;">
        <strong>🎁 Special Welcome Offer:</strong> This discount is valid for 7 days. Don't miss out!
    </p>
</div>
@endsection
