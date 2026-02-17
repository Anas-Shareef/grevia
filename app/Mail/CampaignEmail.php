<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CampaignEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $emailSubject,
        public string $htmlContent,
        public array $variables = [],
        public ?string $unsubscribeUrl = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->emailSubject,
        );
    }

    public function content(): Content
    {
        // Replace variables in HTML content
        $renderedContent = $this->htmlContent;
        
        // Add unsubscribe URL
        if ($this->unsubscribeUrl) {
            $this->variables['unsubscribe_url'] = $this->unsubscribeUrl;
        }
        
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
