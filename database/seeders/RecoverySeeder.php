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
        // 1. COMPLETELY WIPE VARIANTS (To remove "Size: 1" forever)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ProductVariant::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Ensure categories
        $stevia = Category::updateOrCreate(['slug' => 'stevia'], [
            'name' => 'Stevia Sweeteners',
            'status' => true,
        ]);

        // 3. Create Jar Product
        $jar = Product::updateOrCreate(['slug' => 'stevia-jar'], [
            'name' => 'Grevia Stevia Jar',
            'price' => 600, // Starting price
            'category_id' => $stevia->id,
            'image' => 'products/01KF58XGGZXZCPHWQ77KXRFCZ1.jpeg', 
            'is_featured' => true,
            'in_stock' => true,
            'concentration_options' => ['1:30', '1:20'],
            'ratio' => '1:30',
        ]);

        // 4. Create PERFECT Variants (Exactly as per your request)
        
        // Variant 1: 50g (₹600) - THIS IS THE ONE FROM YOUR IMAGE
        ProductVariant::create([
            'product_id' => $jar->id,
            'weight' => '50g',
            'pack_size' => 50,
            'price' => 600,
            'status' => 'active',
            'stock_quantity' => 100,
        ]);

        // Variant 2: 100g (₹899)
        ProductVariant::create([
            'product_id' => $jar->id,
            'weight' => '100g',
            'pack_size' => 100,
            'price' => 899,
            'status' => 'active',
            'stock_quantity' => 100,
        ]);

        // Variant 3: 250g (₹1599)
        ProductVariant::create([
            'product_id' => $jar->id,
            'weight' => '250g',
            'pack_size' => 250,
            'price' => 1599,
            'status' => 'active',
            'stock_quantity' => 100,
        ]);
        
        // 5. Other products
        Product::updateOrCreate(['slug' => 'stevia-powder'], [
            'name' => 'Grevia Stevia Powder',
            'price' => 349,
            'category_id' => $stevia->id,
            'image' => 'products/01KF3XGBHBW2CRQY49NX836YJX.jpg',
            'is_featured' => true,
            'in_stock' => true,
        ]);
    }
}
