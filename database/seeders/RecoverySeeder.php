<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
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

        // 2. Create Products with CORRECT concentrations and variants
        $pData = [
            'name' => 'Grevia Stevia Jar',
            'slug' => 'stevia-jar',
            'price' => 899,
            'category_id' => $stevia->id,
            'image' => 'products/01KF58XGGZXZCPHWQ77KXRFCZ1.jpeg', 
            'is_featured' => true,
            'description' => 'Premium stevia in elegant glass jar',
            'ingredients' => ['Organic Stevia Leaf Extract', 'Natural Fiber (Inulin)'],
            'concentration_options' => ['1:30', '1:20'], // Exact match to your image!
            'ratio' => '1:30',
        ];

        $product = Product::updateOrCreate(['slug' => $pData['slug']], array_merge($pData, [
            'long_description' => $pData['description'] . ' crafted with the highest quality standards.',
            'in_stock' => true,
            'rating' => 4.9,
            'reviews' => 12,
        ]));

        // 3. Create Accurate Variants (Removing the 500g error)
        ProductVariant::where('product_id', $product->id)->delete();
        
        // Variant 1: 100g (₹899)
        ProductVariant::create([
            'product_id' => $product->id,
            'weight' => '100g',
            'pack_size' => 100,
            'price' => 899,
            'status' => 'active',
            'stock_quantity' => 100,
        ]);

        // Variant 2: 250g (₹1599)
        ProductVariant::create([
            'product_id' => $product->id,
            'weight' => '250g',
            'pack_size' => 250,
            'price' => 1599,
            'status' => 'active',
            'stock_quantity' => 100,
        ]);

        // 4. Other products (Powder and Drops)
        Product::updateOrCreate(['slug' => 'stevia-powder'], [
            'name' => 'Grevia Stevia Powder',
            'price' => 349,
            'category_id' => $stevia->id,
            'image' => 'products/01KF3XGBHBW2CRQY49NX836YJX.jpg',
            'is_featured' => true,
            'description' => 'Organic stevia in eco-friendly pouch',
            'in_stock' => true,
        ]);

        Product::updateOrCreate(['slug' => 'monkfruit-drops'], [
            'name' => 'Grevia Monkfruit Drops',
            'price' => 299,
            'category_id' => $sweeteners->id,
            'image' => 'products/01KF3RTPSFH7AY0YZTRT7AXYFE.jpg',
            'is_featured' => true,
            'description' => 'Liquid sweetener for beverages',
            'in_stock' => true,
        ]);
    }
}
