<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantImage extends Model
{
    use HasFactory, SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        // Auto-fill product_id from the variant when creating
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
        'variant_id',
        'product_id',
        'image_path',
        'is_main',
        'sort_order',
    ];

    protected $casts = [
        'is_main'    => 'boolean',
        'sort_order' => 'integer',
        'variant_id' => 'integer',
        'product_id' => 'integer',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
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
