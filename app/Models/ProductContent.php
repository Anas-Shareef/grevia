<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductContent extends Model
{
    protected $table = 'product_content';
    protected $primaryKey = 'product_id';
    public $incrementing = false;

    protected $fillable = [
        'product_id', 'attr_product_story', 'attr_usage_prep'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
