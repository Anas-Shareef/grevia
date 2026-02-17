@extends('emails.layouts.base')

@section('content')
<h1>🎉 New Collection from Grevia</h1>

<p>Hey {{ $customer_name ?? 'there' }},</p>

<p>Our latest collection is live! Be the first to explore our new arrivals and trending styles.</p>

<div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
    <h2 style="margin: 0 0 10px 0; color: #667eea;">✨ Fresh Styles Just Dropped</h2>
    <p style="margin: 0; font-size: 18px; color: #6b7280;">Don't miss out on exclusive early access</p>
</div>

<p>Discover the perfect pieces to elevate your wardrobe. From timeless classics to bold statement pieces, there's something for everyone.</p>

@include('emails.components.cta-button', ['url' => $shop_url ?? config('app.url') . '/products', 'text' => '👉 Shop New Arrivals'])

<p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
    <strong>Pro tip:</strong> Our new arrivals sell out fast! Get yours before they're gone.
</p>
@endsection
