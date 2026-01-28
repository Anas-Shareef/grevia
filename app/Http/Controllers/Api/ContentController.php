<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FooterSection;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function getFooter()
    {
        $sections = FooterSection::where('is_active', true)
            ->orderBy('sort_order')
            ->get();
            
        return response()->json($sections);
    }

    public function getBenefitsPage()
    {
        $page = \App\Models\BenefitsPage::where('is_active', true)->first();
        
        if (!$page) {
            return response()->json(null);
        }

        // Fix localhost URLs in the response
        $pageData = $page->toArray();
        
        // Fix hero image
        if (isset($pageData['hero']['image'])) {
            $pageData['hero']['image'] = $this->fixImageUrl($pageData['hero']['image']);
        }
        
        // Fix sections images
        if (isset($pageData['sections']) && is_array($pageData['sections'])) {
            foreach ($pageData['sections'] as $key => $section) {
                if (isset($section['image'])) {
                    $pageData['sections'][$key]['image'] = $this->fixImageUrl($section['image']);
                }
            }
        }
        
        return response()->json($pageData);
    }

    public function getHeroBanner()
    {
        $banner = \App\Models\Banner::where('type', 'hero')
            ->where('status', true)
            ->orderBy('order', 'asc') // or created_at desc
            ->first();

        if (!$banner) {
            return response()->json(null); // Frontend will fallback to static
        }

        // Ensure full image URL
        $banner->image_url = \Illuminate\Support\Facades\Storage::url($banner->image);
        
        return response()->json($banner);
    }

    /**
     * Helper to fix image URLs - replace localhost with production URL
     */
    private function fixImageUrl($url)
    {
        if (!$url) {
            return $url;
        }

        // Replace localhost URLs with production URL
        $url = str_replace('http://localhost:8000', config('app.url'), $url);
        $url = str_replace('http://127.0.0.1:8000', config('app.url'), $url);
        
        return $url;
    }
}
