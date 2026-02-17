<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    protected $fillable = [
        'campaign_id',
        'template_id',
        'event_id',
        'user_id',
        'email',
        'status',
        'error_message',
        'sent_at',
        'opened_at',
        'clicked_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
    ];

    // Relationships
    public function campaign()
    {
        return $this->belongsTo(EmailCampaign::class);
    }

    public function template()
    {
        return $this->belongsTo(EmailTemplate::class);
    }

    public function event()
    {
        return $this->belongsTo(MarketingEvent::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    public function scopeOpened($query)
    {
        return $query->where('status', 'opened');
    }

    public function scopeForCampaign($query, $campaignId)
    {
        return $query->where('campaign_id', $campaignId);
    }
}
