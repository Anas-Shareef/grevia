<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attribute extends Model
{
    protected $fillable = [
        'name', 'slug', 'label', 'display_type', 'filter_type', 'sort_order', 'is_required'
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function values(): HasMany
    {
        return $this->hasMany(AttributeValue::class)->orderBy('sort_order');
    }

    // Helper: get by slug or name
    public static function findBySlug(string $slug): ?static
    {
        return static::where('slug', $slug)->orWhere('name', $slug)->first();
    }
}
