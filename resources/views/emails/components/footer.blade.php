<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 10px 0; font-size: 12px; color: #9ca3af;">
        You're receiving this email because you opted in to receive marketing communications from Grevia.
    </p>
    
    <p style="margin: 0 0 10px 0;">
        <a href="{{ $unsubscribeUrl ?? '#' }}" style="color: #667eea; text-decoration: none; font-size: 12px;">
            Unsubscribe from marketing emails
        </a>
    </p>
    
    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © {{ date('Y') }} Grevia. All rights reserved.
    </p>
    
    <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
        <a href="{{ config('app.url') }}" style="color: #667eea; text-decoration: none;">Visit our website</a> | 
        <a href="{{ config('app.url') }}/contact" style="color: #667eea; text-decoration: none;">Contact us</a>
    </p>
</div>
