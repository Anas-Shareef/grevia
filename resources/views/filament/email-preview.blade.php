<div class="email-preview-container" style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        {!! $content !!}
    </div>
</div>

<style>
    .email-preview-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    
    .email-preview-container img {
        max-width: 100%;
        height: auto;
    }
    
    .email-preview-container a {
        color: #667eea;
        text-decoration: none;
    }
    
    .email-preview-container a:hover {
        text-decoration: underline;
    }
</style>
