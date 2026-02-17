<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailCampaign extends Model
{
    protected $fillable = [
        'title',
        'subject',
        'email_template_id',
        'html_content',
        'status',
        'scheduled_at',
        'target_segment',
        'sent_count',
        'failed_count',
        'total_recipients',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_count' => 'integer',
        'failed_count' => 'integer',
        'total_recipients' => 'integer',
    ];

    // Relationships
    public function template()
    {
        return $this->belongsTo(EmailTemplate::class, 'email_template_id');
    }

    public function logs()
    {
        return $this->hasMany(EmailLog::class, 'campaign_id');
    }

    // Scopes
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    // Methods
    public function getProgress()
    {
        if ($this->total_recipients === 0) {
            return 0;
        }
        
        return round(($this->sent_count / $this->total_recipients) * 100, 2);
    }

    public function getRecipients()
    {
        $segmentationService = new \App\Services\EmailSegmentationService();
        return $segmentationService->getRecipients($this->target_segment);
    }

    public function updateRecipientCount()
    {
        $segmentationService = new \App\Services\EmailSegmentationService();
        $this->total_recipients = $segmentationService->getRecipientCount($this->target_segment);
        $this->save();
    }

    public function send()
    {
        if ($this->status !== 'draft' && $this->status !== 'scheduled') {
            return false;
        }

        // Update recipient count before sending
        $this->updateRecipientCount();

        $this->update(['status' => 'sending']);
        
        // Dispatch job to send emails
        \App\Jobs\SendCampaignEmails::dispatch($this);
        
        return true;
    }
}
