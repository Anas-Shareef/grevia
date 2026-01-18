<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscriber extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'email',
        'name',
        'user_id',
        'is_subscribed',
        'source',
    ];

    protected $casts = [
        'is_subscribed' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
