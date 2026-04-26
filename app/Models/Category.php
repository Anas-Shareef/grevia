<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'hero_banner',
        'icon',
        'parent_id',
        'status',
        'show_in_filter',
        'order',
        'is_smart',
        'rules',
        'seo_title',
        'seo_description',
        'card_image_url',
        'card_description',
        'availability_status',
        'overlay_density'
    ];

    protected $casts = [
        'is_smart' => 'boolean',
        'rules' => 'array',
        'show_in_filter' => 'boolean',
        'status' => 'boolean',
        'overlay_density' => 'integer'
    ];

    protected $appends = ['image_url', 'hero_banner_url', 'icon_url', 'card_image_full_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) return null;
        if (str_starts_with($this->image, 'http')) return $this->image;
        return \Illuminate\Support\Facades\Storage::url($this->image);
    }

    public function getHeroBannerUrlAttribute()
    {
        if (!$this->hero_banner) return null;
        if (str_starts_with($this->hero_banner, 'http')) return $this->hero_banner;
        return \Illuminate\Support\Facades\Storage::url($this->hero_banner);
    }

    public function getIconUrlAttribute()
    {
        if (!$this->icon) return null;
        if (str_starts_with($this->icon, 'http')) return $this->icon;
        return \Illuminate\Support\Facades\Storage::url($this->icon);
    }

    public function getCardImageFullUrlAttribute()
    {
        if (!$this->card_image_url) return null;
        if (str_starts_with($this->card_image_url, 'http')) return $this->card_image_url;
        return \Illuminate\Support\Facades\Storage::url($this->card_image_url);
    }

    public function getAllDescendantIds()
    {
        $ids = [$this->id];
        foreach ($this->children as $child) {
            $ids = array_merge($ids, $child->getAllDescendantIds());
        }
        return $ids;
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function childProducts()
    {
        return $this->hasManyThrough(Product::class, Category::class, 'parent_id', 'category_id', 'id', 'id');
    }
}
