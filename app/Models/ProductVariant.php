<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'weight',
        'pack_size',
        'price',
        'discount_price',
        'stock_quantity',
        'sku',
        'status',
        'image_path',
    ];

    protected $casts = [
        'pack_size' => 'integer',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    protected static function booted()
    {
        static::saving(function ($variant) {
            if (empty($variant->sku)) {
                $product = $variant->product ?: Product::find($variant->product_id);
                $productName = $product ? $product->name : 'PROD';
                $variant->sku = strtoupper(
                    str($productName)->slug() . '-' . 
                    str($variant->weight)->slug() . '-' . 
                    $variant->pack_size . '-' . 
                    rand(100, 999)
                );
            }
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getEffectivePriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }
}
