<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'variant_id',
        'weight',
        'pack_size',
        'quantity',
        'price',
        'total',
        'selected_attributes',
    ];

    protected $casts = [
        'selected_attributes' => 'array',
    ];

    protected $appends = ['weight', 'pack_size'];

    public function getWeightAttribute($value)
    {
        if ($value) return $value;
        return $this->variant?->weight;
    }

    public function getPackSizeAttribute($value)
    {
        if ($value) return $value;
        return $this->variant?->pack_size;
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
