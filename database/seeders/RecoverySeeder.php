<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class RecoverySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure categories exist
        $sweeteners = Category::updateOrCreate(['slug' => 'sweeteners'], [
            'name' => 'Premium Sweeteners',
            'description' => 'Natural sweeteners for health-conscious living',
            'status' => true,
        ]);

        $stevia = Category::updateOrCreate(['slug' => 'stevia'], [
            'name' => 'Stevia Sweeteners',
            'parent_id' => $sweeteners->id,
            'description' => 'Pure stevia-based natural sweeteners',
            'status' => true,
        ]);

        // 2. Create Products using the ACTUAL images still on your server
        // I found these image filenames in your storage folder!
        $products = [
            [
                'name' => 'Grevia Stevia Jar',
                'slug' => 'stevia-jar',
                'price' => 499,
                'category_id' => $stevia->id,
                'image' => 'products/01KF58XGGZXZCPHWQ77KXRFCZ1.jpeg', // Actual file!
                'is_featured' => true,
                'description' => 'Premium stevia in elegant glass jar',
                'ingredients' => ['Organic Stevia Leaf Extract', 'Natural Fiber (Inulin)'],
            ],
            [
                'name' => 'Grevia Stevia Powder',
                'slug' => 'stevia-powder',
                'price' => 349,
                'category_id' => $stevia->id,
                'image' => 'products/01KF3XGBHBW2CRQY49NX836YJX.jpg', // Actual file!
                'is_featured' => true,
                'description' => 'Organic stevia in eco-friendly pouch',
                'ingredients' => ['Organic Stevia Leaf Extract', 'Erythritol (Non-GMO)'],
            ],
            [
                'name' => 'Grevia Monkfruit Drops',
                'slug' => 'monkfruit-drops',
                'price' => 299,
                'category_id' => $sweeteners->id,
                'image' => 'products/01KF3RTPSFH7AY0YZTRT7AXYFE.jpg', // Actual file!
                'is_featured' => true,
                'description' => 'Liquid sweetener for beverages',
                'ingredients' => ['Monk Fruit Extract', 'Purified Water'],
            ],
        ];

        foreach ($products as $p) {
            Product::updateOrCreate(['slug' => $p['slug']], array_merge($p, [
                'long_description' => $p['description'] . ' crafted with the highest quality standards.',
                'in_stock' => true,
                'rating' => 4.9,
                'reviews' => 50,
            ]));
        }
    }
}
