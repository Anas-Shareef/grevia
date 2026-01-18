<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactPage extends Model
{
    use HasFactory;

    protected $table = 'contact_page_cms';

    protected $fillable = [
        'page_title',
        'page_description',
        'company_name',
        'support_email',
        'phone',
        'address',
        'working_hours',
        'map_embed_url',
        'meta_title',
        'meta_description',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}
