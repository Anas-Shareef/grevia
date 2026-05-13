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
        // 1. CLEAR DATA FOR CLEAN RESTORE
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ProductVariant::truncate();
        Product::truncate();
        Category::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Create Categories
        $sweeteners = Category::create(['name' => 'Premium Sweeteners', 'slug' => 'sweeteners', 'status' => true]);
        $stevia = Category::create(['name' => 'Stevia Sweeteners', 'slug' => 'stevia', 'parent_id' => $sweeteners->id, 'status' => true]);
        $monkfruit = Category::create(['name' => 'Monkfruit Sweeteners', 'slug' => 'monkfruit', 'parent_id' => $sweeteners->id, 'status' => true]);
        $bakery = Category::create(['name' => 'Bakery Items', 'slug' => 'bakery', 'status' => true]);
        $pickles = Category::create(['name' => 'Pickles & Preserves', 'slug' => 'pickles', 'status' => true]);

        // 3. RESTORE THE JAR (With Accuracy)
        $jar = Product::create([
            'name' => 'Grevia Stevia Jar',
            'slug' => 'grevia-stevia-jar',
            'price' => 600, 
            'category_id' => $stevia->id,
            'image' => 'https://grevia.in/grevia-logo.png', // Temporary backup logo
            'is_featured' => true,
            'in_stock' => true,
            'concentration_options' => ['1:30', '1:20', '1:50'],
            'ratio' => '1:30',
        ]);

        // Jar Weights
        ProductVariant::create(['product_id' => $jar->id, 'weight' => '50g', 'pack_size' => 50, 'price' => 600, 'status' => 'active', 'stock_quantity' => 100]);
        ProductVariant::create(['product_id' => $jar->id, 'weight' => '100g', 'pack_size' => 100, 'price' => 899, 'status' => 'active', 'stock_quantity' => 100]);
        ProductVariant::create(['product_id' => $jar->id, 'weight' => '250g', 'pack_size' => 250, 'price' => 1599, 'status' => 'active', 'stock_quantity' => 100]);

        // 4. RESTORE ALL OTHER PRODUCTS
        Product::create([
            'name' => 'Grevia Stevia Powder',
            'slug' => 'stevia-powder',
            'price' => 349,
            'category_id' => $stevia->id,
            'image' => 'https://grevia.in/grevia-logo.png', // Temporary backup logo
            'is_featured' => true,
            'in_stock' => true,
            'concentration_options' => ['1:30'],
            'ratio' => '1:30',
        ]);

        Product::create([
            'name' => 'Grevia Monkfruit Drops',
            'slug' => 'monkfruit-drops',
            'price' => 299,
            'category_id' => $monkfruit->id,
            'image' => 'https://grevia.in/grevia-logo.png', // Temporary backup logo
            'in_stock' => true,
        ]);

        Product::create([
            'name' => 'Artisan Whole Grain Bread',
            'slug' => 'whole-grain-bread',
            'price' => 189,
            'category_id' => $bakery->id,
            'image' => 'https://grevia.in/grevia-logo.png', // Temporary backup logo
            'in_stock' => true,
        ]);

        Product::create([
            'name' => 'Traditional Mango Pickle',
            'slug' => 'mango-pickle',
            'price' => 249,
            'category_id' => $pickles->id,
            'image' => 'https://grevia.in/grevia-logo.png', // Temporary backup logo
            'in_stock' => true,
        ]);
    }
}
