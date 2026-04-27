<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'long_description',
        'ingredients',
        'price',
        'original_price',
        'rating',
        'reviews',
        'image',
        'images',
        'category_id',
        'subcategory',
        'badge',
        'in_stock',
        'is_featured',
        'tags',
        'ratio',
        'form',
        'format',
        'concentration',
        'type',
        'size_label',
        'sweetness_description',
        'use_case',
        'related_products',
        'nutrition_facts',
        'usage_instructions',
        'concentration_options',
        'health_benefits',
        'related_product_ids',
        'enable_guest_reviews',
        'product_description',
    ];

    protected $casts = [
        'ingredients' => 'array',
        'images' => 'array',
        'tags' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'in_stock' => 'boolean',
        'is_featured' => 'boolean',
        'concentration_options' => 'array',
        'health_benefits' => 'array',
        'related_product_ids' => 'array',
        'enable_guest_reviews' => 'boolean',
    ];

    protected $appends = ['image_url', 'reviews_count', 'average_rating'];

    public function getFallbackImagePathAttribute()
    {
        if ($this->image) {
            return $this->image;
        }

        if ($this->relationLoaded('mainImage') && $this->mainImage) {
            return $this->mainImage->image_path;
        }

        if ($this->relationLoaded('gallery') && $this->gallery->isNotEmpty()) {
            return $this->gallery->first()->image_path;
        }

        $main = $this->mainImage()->first();
        if ($main) return $main->image_path;

        $first = $this->gallery()->first();
        if ($first) return $first->image_path;

        return null;
    }

    public function getImageUrlAttribute()
    {
        $path = $this->fallback_image_path;
        
        if (!$path) {
            return null;
        }
        
        // If it's already a full URL (starts with http:// or https://), return as is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        
        // Otherwise, treat it as a storage path
        return \Illuminate\Support\Facades\Storage::url($path);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function gallery()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function mainImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_main', true);
    }

    // Dynamic review statistics
    public function getReviewsCountAttribute()
    {
        return $this->reviews()->where('status', 'approved')->count();
    }

    public function getAverageRatingAttribute()
    {
        $avg = $this->reviews()->where('status', 'approved')->avg('rating');
        return $avg ? round($avg, 1) : 0;
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}
