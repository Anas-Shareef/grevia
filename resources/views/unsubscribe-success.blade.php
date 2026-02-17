<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribe Successful - Grevia</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        
        .email {
            background: #f3f4f6;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
            margin: 20px 0;
            font-weight: 600;
            color: #374151;
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
        
        .resubscribe-form {
            margin-top: 20px;
        }
        
        .resubscribe-button {
            background: #10b981;
            border: none;
            cursor: pointer;
            font-size: 14px;
            padding: 10px 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✓</div>
        <h1>You've Been Unsubscribed</h1>
        <p>You have successfully unsubscribed from marketing emails.</p>
        
        <div class="email">{{ $email }}</div>
        
        <p>You will no longer receive promotional emails, newsletters, or marketing campaigns from Grevia.</p>
        
        <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
            <strong>Note:</strong> You will still receive important transactional emails related to your orders and account.
        </p>
        
        <div class="resubscribe-form">
            <p style="font-size: 14px; margin-bottom: 10px;">Changed your mind?</p>
            <form action="{{ route('resubscribe') }}" method="POST">
                @csrf
                <input type="hidden" name="email" value="{{ $email }}">
                <button type="submit" class="button resubscribe-button">Re-subscribe to Marketing Emails</button>
            </form>
        </div>
        
        <div class="footer">
            <a href="{{ config('app.url') }}" class="button">Return to Grevia</a>
            <p style="margin-top: 20px;">© {{ date('Y') }} Grevia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
