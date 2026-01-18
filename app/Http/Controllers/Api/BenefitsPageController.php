<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BenefitsPage;

class BenefitsPageController extends Controller
{
    public function index()
    {
        try {
            \Log::info('BenefitsPage API called');
            
            // Get the first active benefits page
            $page = BenefitsPage::where('is_active', true)->first();
            
            \Log::info('Benefits page query result', ['found' => $page ? 'yes' : 'no']);
            
            if (!$page) {
                // Return default structure if no page exists
                return response()->json([
                    'title' => 'Benefits of Natural Sweeteners',
                    'hero' => [
                        'badge' => 'Natural Sweeteners',
                        'title' => 'Discover the Power of Nature',
                        'subtitle' => 'Experience the benefits of natural, zero-calorie sweeteners',
                        'background_image' => null,
                    ],
                    'sections' => [],
                    'comparison' => [
                        'title' => 'Why Choose Natural Sweeteners?',
                        'subtitle' => 'Compare the benefits',
                        'columns' => [],
                    ],
                ]);
            }
            
            // Return the page data
            $response = [
                'title' => $page->title,
                'hero' => $page->hero ?? [],
                'sections' => $page->sections ?? [],
                'comparison' => $page->comparison ?? [],
                'meta_title' => $page->meta_title,
                'meta_description' => $page->meta_description,
            ];
            
            \Log::info('Returning benefits page data', ['title' => $page->title]);
            
            return response()->json($response);
        } catch (\Exception $e) {
            \Log::error('BenefitsPage API Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
