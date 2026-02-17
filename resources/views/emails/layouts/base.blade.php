<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <title>{{ $subject ?? 'Grevia' }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            word-break: break-word;
            -webkit-font-smoothing: antialiased;
            background-color: #f3f4f6;
        }
        
        table {
            border-collapse: collapse;
            border-spacing: 0;
        }
        
        td {
            padding: 0;
        }
        
        img {
            border: 0;
            line-height: 100%;
            vertical-align: middle;
        }
        
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .email-content {
            background-color: #ffffff;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            text-decoration: none;
            font-family: 'Inter', Arial, sans-serif;
        }
        
        .content {
            padding: 40px 30px;
            font-family: 'Inter', Arial, sans-serif;
            color: #374151;
            font-size: 16px;
            line-height: 1.6;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            font-family: 'Inter', Arial, sans-serif;
            font-size: 14px;
            color: #6b7280;
        }
        
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        
        .button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
        }
        
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 30px 0;
        }
        
        h1 {
            font-size: 28px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 20px 0;
        }
        
        h2 {
            font-size: 22px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 15px 0;
        }
        
        p {
            margin: 0 0 15px 0;
        }
        
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                width: 100% !important;
            }
            
            .content {
                padding: 30px 20px !important;
            }
            
            h1 {
                font-size: 24px !important;
            }
            
            .button {
                display: block !important;
                width: 100% !important;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="email-wrapper" role="presentation" width="600" cellpadding="0" cellspacing="0">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <a href="{{ config('app.url') }}" class="logo">GREVIA</a>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="email-content">
                            <div class="content">
                                @yield('content')
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            @include('emails.components.footer')
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
