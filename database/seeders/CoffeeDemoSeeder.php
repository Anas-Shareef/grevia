<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class CoffeeDemoSeeder extends Seeder
{
    public function run()
    {
        // 1. Create Smart Category
        $category = Category::updateOrCreate(
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

        // 2. Create the Coffee Product (Notice we don't even need to assign the category_id if we rely entirely on smart rules, but we can assign a random or leave blank to prove it works)
        $productName = 'Premium Vanilla Coffee Enhancer Drops';
        Product::updateOrCreate(
            ['slug' => Str::slug($productName)],
            [
                'name' => $productName,
                'description' => 'A delicious zero-calorie sweetener specifically crafted to melt into hot or iced coffee.',
                'long_description' => '<p>Stop adding sugar to your morning cup. Our Vanilla Coffee Enhancer features pure stevia extract infused with natural vanilla bean.</p>',
                'price' => 350.00,
                'original_price' => 450.00,
                'rating' => 4.8,
                'in_stock' => true,
                'is_featured' => true,
                'category_id' => null, // Demonstrating that Smart Routing handles this!
                'form' => 'drops',
                'type' => 'stevia',
                'tags' => ['coffee', 'breakfast', 'vanilla'],
                'image' => 'https://images.unsplash.com/photo-1550461716-e8220551061c?auto=format&fit=crop&q=80&w=800'
            ]
        );
    }
}
