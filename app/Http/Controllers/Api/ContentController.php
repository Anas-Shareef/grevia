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
        return response()->json($page);
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
}
