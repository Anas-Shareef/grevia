<!DOCTYPE html>
<html>
<head>
    <title>We received your message</title>
</head>
<body>
    <p>Hello {{ $record->full_name }},</p>

    <p>Thank you for contacting us. We have received your message regarding "<strong>{{ $record->subject }}</strong>" and our team will get back to you shortly.</p>

    <p>Best regards,<br>Grevia Support Team</p>
</body>
</html>
