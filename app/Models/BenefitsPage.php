<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BenefitsPage extends Model
{
    protected $fillable = [
        'title',
        'meta_title',
        'meta_description',
        'hero',
        'benefits', // Deprecated but kept for backward compatibility if needed temporarily
        'sections',
        'cta',
        'comparison',
        'is_active',
    ];

    protected $casts = [
        'hero' => 'array',
        'benefits' => 'array',
        'sections' => 'array',
        'cta' => 'array',
        'comparison' => 'array',
        'is_active' => 'boolean',
    ];


    /**
     * Fix image URLs to use production storage URL instead of localhost
     */
    public function getSectionsAttribute($value)
    {
        $sections = json_decode($value, true);
        
        if (!$sections) {
            return $sections;
        }

        // Fix URLs in sections array
        return array_map(function ($section) {
            if (isset($section['image'])) {
                $section['image'] = $this->fixImageUrl($section['image']);
            }
            return $section;
        }, $sections);
    }

    /**
     * Fix hero image URL
     */
    public function getHeroAttribute($value)
    {
        $hero = json_decode($value, true);
        
        if (!$hero) {
            return $hero;
        }

        if (isset($hero['image'])) {
            $hero['image'] = $this->fixImageUrl($hero['image']);
        }

        return $hero;
    }

    /**
     * Helper to fix image URLs
     */
    private function fixImageUrl($url)
    {
        if (!$url) {
            return $url;
        }

        // Replace localhost:8000 with production URL
        $url = str_replace('http://localhost:8000', config('app.url'), $url);
        $url = str_replace('http://127.0.0.1:8000', config('app.url'), $url);
        
        return $url;
    }
}
