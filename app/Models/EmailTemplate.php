<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class EmailTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'subject',
        'html_content',
        'demo_variables',
        'status',
    ];

    protected $casts = [
        'demo_variables' => 'array',
        'status' => 'boolean',
    ];

    // Relationships
    public function campaigns()
    {
        return $this->hasMany(EmailCampaign::class);
    }

    public function marketingEvents()
    {
        return $this->hasMany(MarketingEvent::class);
    }

    public function logs()
    {
        return $this->hasMany(EmailLog::class, 'template_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    // Methods
    public function render(array $variables = [])
    {
        $content = $this->html_content;
        
        foreach ($variables as $key => $value) {
            $content = str_replace('{{' . $key . '}}', $value, $content);
        }
        
        return $content;
    }

    public function canDelete()
    {
        return $this->campaigns()->count() === 0 && $this->marketingEvents()->count() === 0;
    }

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($template) {
            if (empty($template->slug)) {
                $template->slug = Str::slug($template->name);
            }
        });
    }
}
