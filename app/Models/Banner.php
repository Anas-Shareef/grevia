<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image',
        'link',
        'type',
        'order',
        'status',
        'primary_button_text',
        'primary_button_link',
        'secondary_button_text',
        'secondary_button_link',
        'features',
    ];

    protected $casts = [
        'status' => 'boolean',
        'order' => 'integer',
        'features' => 'array',
    ];
}
