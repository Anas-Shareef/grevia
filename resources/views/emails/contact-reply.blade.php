<!DOCTYPE html>
<html>
<head>
    <title>Reply to your inquiry</title>
</head>
<body>
    <p>Hello {{ $record->full_name }},</p>

    <div>
        {!! $replyContent !!}
    </div>

    <p>Thank you,<br>Grevia Support Team</p>
</body>
</html>
