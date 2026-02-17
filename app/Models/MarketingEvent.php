<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketingEvent extends Model
{
    protected $fillable = [
        'name',
        'event_key',
        'description',
        'email_template_id',
        'delay_minutes',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'delay_minutes' => 'integer',
    ];

    // Relationships
    public function template()
    {
        return $this->belongsTo(EmailTemplate::class, 'email_template_id');
    }

    public function logs()
    {
        return $this->hasMany(EmailLog::class, 'event_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function scopeByKey($query, string $key)
    {
        return $query->where('event_key', $key);
    }

    // Methods
    public function trigger($user, array $data = [])
    {
        if (!$this->status || !$this->template) {
            return false;
        }

        // Dispatch job with delay
        \App\Jobs\SendMarketingEventEmail::dispatch($this, $user, $data)
            ->delay(now()->addMinutes($this->delay_minutes));

        return true;
    }
}
