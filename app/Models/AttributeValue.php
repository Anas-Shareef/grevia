<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AttributeValue extends Model
{
    protected $fillable = [
        'attribute_id', 'value_text', 'icon_url', 'slug', 'sort_order', 'meta'
    ];

    protected $casts = [
        'meta' => 'array',
        'sort_order' => 'integer',
    ];

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attribute::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_attribute_value', 'value_id', 'product_id')
                    ->withPivot('is_default_concentration');
    }

    // Convenience accessors for Concentration meta
    public function getSubstitutionTextAttribute(): ?string
    {
        return $this->meta['substitution_text'] ?? null;
    }

    public function getIsDefaultAttribute(): bool
    {
        return (bool) ($this->meta['is_default'] ?? false);
    }
}
