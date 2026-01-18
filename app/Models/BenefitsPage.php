<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BenefitsPage extends Model
{
    protected $fillable = [
        'title',
        'meta_title',
        'meta_description',
        'hero',
        'benefits', // Deprecated but kept for backward compatibility if needed temporarily
        'sections',
        'cta',
        'comparison',
        'is_active',
    ];

    protected $casts = [
        'hero' => 'array',
        'benefits' => 'array',
        'sections' => 'array',
        'cta' => 'array',
        'comparison' => 'array',
        'is_active' => 'boolean',
    ];

    //
}
