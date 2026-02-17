<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $subject,
        public string $htmlContent,
        public array $variables = []
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    public function content(): Content
    {
        // Replace variables in HTML content
        $renderedContent = $this->htmlContent;
        
        foreach ($this->variables as $key => $value) {
            $renderedContent = str_replace('{{' . $key . '}}', $value, $renderedContent);
        }

        return new Content(
            htmlString: $renderedContent,
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
