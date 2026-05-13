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

    /**
     * Get the display weight — DB column first, then fall back to the linked variant.
     * Named 'display_weight' so it does NOT conflict with the DB 'weight' column.
     */
    public function getDisplayWeightAttribute(): ?string
    {
        if (!empty($this->attributes['weight'])) {
            return $this->attributes['weight'];
        }
        return $this->variant?->weight;
    }

    /**
     * Get the display pack size — DB column first, then fall back to the linked variant.
     * Named 'display_pack_size' so it does NOT conflict with the DB 'pack_size' column.
     */
    public function getDisplayPackSizeAttribute(): ?string
    {
        if (!empty($this->attributes['pack_size'])) {
            return (string) $this->attributes['pack_size'];
        }
        return $this->variant?->pack_size ? (string) $this->variant->pack_size : null;
    }

    protected $appends = ['display_weight', 'display_pack_size'];

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
