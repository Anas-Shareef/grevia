<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribe Error - Grevia</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 40px;
            text-align: center;
        }
        
        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        
        h1 {
            font-size: 28px;
            color: #111827;
            margin-bottom: 15px;
        }
        
        p {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .error-message {
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            color: #991b1b;
        }
        
        .button {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 20px;
            transition: transform 0.2s;
        }
        
        .button:hover {
            transform: translateY(-2px);
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">⚠️</div>
        <h1>Unsubscribe Error</h1>
        
        <div class="error-message">
            {{ $message }}
        </div>
        
        <p>If you continue to receive unwanted emails, please contact our support team for assistance.</p>
        
        <div class="footer">
            <a href="{{ config('app.url') }}" class="button">Return to Grevia</a>
            <p style="margin-top: 20px;">© {{ date('Y') }} Grevia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
