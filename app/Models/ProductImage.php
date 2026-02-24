<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductImage extends Model
{
    use HasFactory, SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($image) {
            if (!$image->product_id && $image->variant_id) {
                $variant = ProductVariant::find($image->variant_id);
                if ($variant) {
                    $image->product_id = $variant->product_id;
                }
            }
        });
    }

    protected $fillable = [
        'product_id',
        'variant_id',
        'image_path',
        'is_main',
        'sort_order',
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'sort_order' => 'integer',
        'product_id' => 'integer',
        'variant_id' => 'integer',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return \Illuminate\Support\Facades\Storage::url($this->image_path);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
