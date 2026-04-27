<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductReview extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'product_id',
        'guest_name',
        'guest_email',
        'rating',
        'title',
        'comment',
        'status',
        'is_verified_purchase',
        'image_urls',
        'thumbnail_urls',
        'video_url',
        'video_thumbnail_url',
        'media_approved',
        'verified_customer',
        'verified_guest',
        'helpful_count',
    ];

    protected $casts = [
        'is_verified_purchase' => 'boolean',
        'rating' => 'integer',
        'image_urls' => 'array',
        'thumbnail_urls' => 'array',
        'media_approved' => 'boolean',
        'verified_customer' => 'boolean',
        'verified_guest' => 'boolean',
        'helpful_count' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function images()
    {
        return $this->hasMany(ReviewImage::class, 'review_id');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified_purchase', true);
    }
}
