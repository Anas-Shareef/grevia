<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;

class RecoverySeeder extends Seeder
{
    public function run(): void
    {
        // 1. NUCLEAR WIPE (Delete everything to kill the "1" and "1:10" data)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ProductVariant::truncate();
        Product::truncate();
        Category::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Create Category
        $stevia = Category::create([
            'name' => 'Stevia Sweeteners',
            'slug' => 'stevia',
            'status' => true,
        ]);

        // 3. Create THE JAR (The exact one from your request)
        $jar = Product::create([
            'name' => 'Grevia Stevia Jar',
            'slug' => 'grevia-stevia-jar',
            'price' => 600, 
            'category_id' => $stevia->id,
            'image' => 'products/01KF58XGGZXZCPHWQ77KXRFCZ1.jpeg', 
            'is_featured' => true,
            'in_stock' => true,
            'concentration_options' => ['1:30', '1:20', '1:50'],
            'ratio' => '1:30',
            'description' => 'Premium Stevia Sweetener in a Jar',
        ]);

        // 4. Create THE WEIGHTS (Exact prices)
        
        // 50g (₹600)
        ProductVariant::create([
            'product_id' => $jar->id,
            'weight' => '50g',
            'pack_size' => 50,
            'price' => 600,
            'status' => 'active',
            'stock_quantity' => 100,
        ]);

        // 100g (₹899)
        ProductVariant::create([
            'product_id' => $jar->id,
            'weight' => '100g',
            'pack_size' => 100,
            'price' => 899,
            'status' => 'active',
            'stock_quantity' => 100,
        ]);

        // 250g (₹1599)
        ProductVariant::create([
            'product_id' => $jar->id,
            'weight' => '250g',
            'pack_size' => 250,
            'price' => 1599,
            'status' => 'active',
            'stock_quantity' => 100,
        ]);

        // 5. Create THE POWDER
        Product::create([
            'name' => 'Grevia Stevia Powder',
            'slug' => 'stevia-powder',
            'price' => 349,
            'category_id' => $stevia->id,
            'image' => 'products/01KF3XGBHBW2CRQY49NX836YJX.jpg',
            'is_featured' => true,
            'in_stock' => true,
            'concentration_options' => ['1:30'],
            'ratio' => '1:30',
        ]);
    }
}
