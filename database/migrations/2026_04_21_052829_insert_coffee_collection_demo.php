<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create Smart Category
        $category = \App\Models\Category::updateOrCreate(
            ['slug' => 'coffee-collection'],
            [
                'name' => 'Coffee Collection',
                'description' => 'Elevate your morning ritual. Shop our curated selection of low-calorie sweeteners and syrups designed perfectly for your daily coffee.',
                'image' => null,
                'status' => true,
                'show_in_filter' => true,
                'order' => 10,
                'is_smart' => true,
                'rules' => [
                    [
                        'field' => 'name',
                        'operator' => 'contains',
                        'value' => 'Coffee'
                    ],
                    [
                        'field' => 'tags',
                        'operator' => 'contains',
                        'value' => 'breakfast'
                    ]
                ],
                'seo_title' => 'Healthy Coffee Sweeteners & Syrups | Grevia',
                'seo_description' => 'Upgrade your coffee without the sugar crash. Shop natural drops, sugar-free syrups, and liquid sweeteners that blend perfectly into iced or hot coffee.'
            ]
        );

        // 2. Create the Coffee Product
        $productName = 'Premium Vanilla Coffee Enhancer Drops';
        \App\Models\Product::updateOrCreate(
            ['slug' => \Illuminate\Support\Str::slug($productName)],
            [
                'name' => $productName,
                'description' => 'A delicious zero-calorie sweetener specifically crafted to melt into hot or iced coffee.',
                'long_description' => '<p>Stop adding sugar to your morning cup. Our Vanilla Coffee Enhancer features pure stevia extract infused with natural vanilla bean.</p>',
                'price' => 350.00,
                'original_price' => 450.00,
                'rating' => 4.8,
                'in_stock' => true,
                'is_featured' => true,
                'category_id' => null, 
                'form' => 'drops',
                'type' => 'stevia',
                'tags' => ['coffee', 'breakfast', 'vanilla'],
                'image' => 'categories/coffee-mockup.png'
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \App\Models\Category::where('slug', 'coffee-collection')->delete();
        \App\Models\Product::where('slug', \Illuminate\Support\Str::slug('Premium Vanilla Coffee Enhancer Drops'))->delete();
    }
};
