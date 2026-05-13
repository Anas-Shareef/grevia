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
        // 1. CLEAR OLD DATA COMPLETELY (To kill the 500g ghost)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ProductVariant::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Ensure categories exist
        $sweeteners = Category::updateOrCreate(['slug' => 'sweeteners'], [
            'name' => 'Premium Sweeteners',
            'status' => true,
        ]);

        $stevia = Category::updateOrCreate(['slug' => 'stevia'], [
            'name' => 'Stevia Sweeteners',
            'parent_id' => $sweeteners->id,
            'status' => true,
        ]);

        // 3. Create Jar Product
        $jar = Product::updateOrCreate(['slug' => 'stevia-jar'], [
            'name' => 'Grevia Stevia Jar',
            'price' => 899,
            'category_id' => $stevia->id,
            'image' => 'products/01KF58XGGZXZCPHWQ77KXRFCZ1.jpeg', 
            'is_featured' => true,
            'in_stock' => true,
            'concentration_options' => ['1:30', '1:20'],
            'ratio' => '1:30',
        ]);

        // 4. Create CORRECT Variants (100g FIRST so it is default)
        // Variant 1: 100g
        ProductVariant::create([
            'product_id' => $jar->id,
            'weight' => '100g',
            'pack_size' => 100,
            'price' => 899,
            'status' => 'active',
            'stock_quantity' => 100,
        ]);

        // Variant 2: 250g
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
        
        // Add 500g variant ONLY for Powder if needed, but not for Jar
    }
}
