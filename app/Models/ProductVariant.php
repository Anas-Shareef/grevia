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
    ];

    protected $casts = [
        'pack_size' => 'integer',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getEffectivePriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }
}
