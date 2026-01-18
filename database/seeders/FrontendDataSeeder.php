<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Str;

class FrontendDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@grevia.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
            ]
        );

        // 2. Clear existing data
        Product::truncate();
        Category::truncate();

        // 3. Create Categories
        $categoriesData = [
            ['id_str' => 'sweeteners', 'name' => 'Premium Sweeteners', 'description' => 'Natural sweeteners for health-conscious living', 'parent' => null],
            ['id_str' => 'stevia', 'name' => 'Stevia Sweeteners', 'description' => 'Pure stevia-based natural sweeteners', 'parent' => 'sweeteners'],
            ['id_str' => 'monkfruit', 'name' => 'Monkfruit Sweeteners', 'description' => 'Premium monk fruit-based sweeteners', 'parent' => 'sweeteners'],
            ['id_str' => 'bakery', 'name' => 'Bakery Items', 'description' => 'Freshly prepared, minimally processed baked goods made for everyday indulgence.', 'parent' => null],
            ['id_str' => 'pickles', 'name' => 'Pickles & Preserves', 'description' => 'Traditional recipes crafted with natural ingredients and no artificial preservatives.', 'parent' => null],
        ];

        $categoriesMap = [];
        foreach ($categoriesData as $c) {
            $category = Category::create([
                'name' => $c['name'],
                'slug' => $c['id_str'],
                'description' => $c['description'],
                'parent_id' => $c['parent'] ? ($categoriesMap[$c['parent']]->id ?? null) : null,
            ]);
            $categoriesMap[$c['id_str']] = $category;
        }

        // 4. Create Products
        $productsData = [
            [
                'id' => 'stevia-jar',
                'name' => 'Grevia Stevia Jar',
                'description' => 'Premium stevia in elegant glass jar',
                'long_description' => 'Our signature Grevia Stevia Jar contains pure, organic stevia extract sourced from the finest stevia leaves.',
                'ingredients' => ['Organic Stevia Leaf Extract', 'Natural Fiber (Inulin)'],
                'price' => 499,
                'rating' => 4.9,
                'reviews' => 128,
                'category' => 'sweeteners',
                'subcategory' => 'stevia',
                'badge' => 'Best Seller',
            ],
            [
                'id' => 'stevia-powder',
                'name' => 'Grevia Stevia Powder',
                'description' => 'Organic stevia in eco-friendly pouch',
                'long_description' => 'Grevia Stevia Powder offers the same exceptional quality as our jar variant, packaged in an eco-conscious pouch.',
                'ingredients' => ['Organic Stevia Leaf Extract', 'Erythritol (Non-GMO)'],
                'price' => 349,
                'rating' => 4.8,
                'reviews' => 96,
                'category' => 'sweeteners',
                'subcategory' => 'stevia',
                'badge' => 'New',
            ],
            [
                'id' => 'monkfruit-drops',
                'name' => 'Grevia Monkfruit Drops',
                'description' => 'Liquid sweetener for beverages',
                'long_description' => 'Our Monkfruit Drops provide a convenient liquid form of natural sweetness.',
                'ingredients' => ['Monk Fruit Extract', 'Purified Water', 'Citric Acid'],
                'price' => 299,
                'rating' => 4.7,
                'reviews' => 74,
                'category' => 'sweeteners',
                'subcategory' => 'monkfruit',
            ],
            [
                'id' => 'whole-grain-bread',
                'name' => 'Artisan Whole Grain Bread',
                'description' => 'Freshly baked with organic whole grains',
                'long_description' => 'Our Artisan Whole Grain Bread is crafted with a blend of organic whole grains.',
                'ingredients' => ['Organic Whole Wheat Flour', 'Oats', 'Flax Seeds', 'Honey', 'Sea Salt', 'Yeast'],
                'price' => 189,
                'rating' => 4.8,
                'reviews' => 64,
                'category' => 'bakery',
                'badge' => 'Fresh Daily',
            ],
            [
                'id' => 'mango-pickle',
                'name' => 'Traditional Mango Pickle',
                'description' => 'Authentic recipe with raw mangoes and spices',
                'long_description' => 'Our Traditional Mango Pickle is made using a time-honored family recipe.',
                'ingredients' => ['Raw Mango', 'Mustard Oil', 'Red Chili Powder', 'Fenugreek Seeds', 'Mustard Seeds', 'Salt', 'Turmeric'],
                'price' => 249,
                'rating' => 4.9,
                'reviews' => 112,
                'category' => 'pickles',
                'badge' => 'Traditional',
            ],
        ];

        foreach ($productsData as $p) {
            Product::create([
                'name' => $p['name'],
                'slug' => $p['id'],
                'description' => $p['description'],
                'long_description' => $p['long_description'],
                'ingredients' => $p['ingredients'],
                'price' => $p['price'],
                'rating' => $p['rating'],
                'reviews' => $p['reviews'],
                'category_id' => $categoriesMap[$p['category']]->id,
                'subcategory' => $p['subcategory'] ?? null,
                'badge' => $p['badge'] ?? null,
                'in_stock' => true,
                // No image - will be uploaded via admin panel
            ]);
        }

        // 5. Create Benefits Page Content
        \App\Models\BenefitsPage::truncate();
        \App\Models\BenefitsPage::create([
            'hero' => [
                'badge' => 'Natural Sweetness',
                'title' => 'The Benefits of Natural Sweeteners',
                'subtitle' => 'Discover why stevia and monk fruit are the smartest choices for health-conscious sweetening. Pure, natural, and backed by science.',
            ],
            'benefits' => [], // Deprecated in favor of nested features in sections
            'sections' => [
                [
                    'badge' => 'Stevia',
                    'title' => "The Gift from Nature's Garden",
                    'description' => "Stevia rebaudiana, a plant native to Paraguay, has been used for centuries by indigenous peoples to sweeten beverages and medicines. Today, it stands as one of the most trusted natural alternatives to sugar.\n\nOur premium stevia is carefully extracted to preserve its natural sweetness while eliminating any bitter compounds. The result is a clean, pure sweetener that enhances your food and beverages without compromising your health goals.",
                    'image' => null, // User can upload later
                    'alignment' => 'right',
                    'features' => [
                        ['icon' => 'Scale', 'title' => 'Zero Calories', 'description' => 'Stevia contains no calories, making it perfect for weight management and calorie-conscious diets.', 'order' => 1, 'is_active' => true],
                        ['icon' => 'Heart', 'title' => 'Blood Sugar Friendly', 'description' => 'Does not raise blood sugar levels, making it suitable for diabetics and those monitoring glucose.', 'order' => 2, 'is_active' => true],
                        ['icon' => 'Leaf', 'title' => '100% Natural', 'description' => 'Derived from the stevia rebaudiana plant, a natural herb native to South America.', 'order' => 3, 'is_active' => true],
                        ['icon' => 'Zap', 'title' => '300x Sweeter', 'description' => 'Up to 300 times sweeter than sugar, so a little goes a long way.', 'order' => 4, 'is_active' => true],
                        ['icon' => 'Brain', 'title' => 'No Bitter Aftertaste', 'description' => 'Our premium extraction process ensures a clean, sweet taste without bitterness.', 'order' => 5, 'is_active' => true],
                        ['icon' => 'Sparkles', 'title' => 'Heat Stable', 'description' => 'Perfect for baking and cooking as it doesn\'t break down at high temperatures.', 'order' => 6, 'is_active' => true],
                    ],
                    'is_active' => true
                ],
                [
                    'badge' => 'Monk Fruit',
                    'title' => "Ancient Treasure, Modern Wellness",
                    'description' => "Monk fruit, also known as Luo Han Guo, has been cultivated in the remote mountains of Southern China for centuries. Revered by Buddhist monks for its medicinal properties, this remarkable fruit offers sweetness without the downsides of sugar.\n\nThe sweetness comes from mogrosides—natural compounds that are not metabolized by the body, meaning zero calories and zero impact on blood sugar. It's nature's perfect sweetener for the modern health-conscious consumer.",
                    'image' => null,
                    'alignment' => 'left',
                    'features' => [
                        ['icon' => 'Scale', 'title' => 'Zero Glycemic Impact', 'description' => 'Monk fruit sweetener has zero glycemic index, ideal for keto and low-carb lifestyles.', 'order' => 1, 'is_active' => true],
                        ['icon' => 'Heart', 'title' => 'Antioxidant Properties', 'description' => 'Contains mogrosides, natural antioxidants that help fight free radicals.', 'order' => 2, 'is_active' => true],
                        ['icon' => 'Leaf', 'title' => 'Ancient Wisdom', 'description' => 'Used for centuries in Traditional Chinese Medicine for its healing properties.', 'order' => 3, 'is_active' => true],
                        ['icon' => 'Zap', 'title' => '150-200x Sweeter', 'description' => 'Intensely sweet, requiring only small amounts for desired sweetness.', 'order' => 4, 'is_active' => true],
                        ['icon' => 'Brain', 'title' => 'No Aftertaste', 'description' => 'Clean, pure sweetness without the metallic or bitter notes of artificial sweeteners.', 'order' => 5, 'is_active' => true],
                        ['icon' => 'Sparkles', 'title' => 'Versatile Use', 'description' => 'Works beautifully in beverages, desserts, sauces, and everyday cooking.', 'order' => 6, 'is_active' => true],
                    ],
                    'is_active' => true
                ]
            ],
            'comparison' => [
                'title' => 'Natural vs. Artificial',
                'subtitle' => 'See why choosing natural sweeteners is the smarter choice for your health',
                'columns' => [
                    [
                        'title' => 'Regular Sugar',
                        'type' => 'danger',
                        'points' => [
                            ['text' => 'High in calories', 'type' => 'danger'],
                            ['text' => 'Spikes blood sugar', 'type' => 'danger'],
                            ['text' => 'Contributes to weight gain', 'type' => 'danger'],
                            ['text' => 'Causes energy crashes', 'type' => 'danger'],
                            ['text' => 'Harmful for teeth', 'type' => 'danger'],
                        ],
                        'is_active' => true
                    ],
                    [
                        'title' => 'Natural Sweeteners',
                        'type' => 'success',
                        'points' => [
                            ['text' => 'Zero calories', 'type' => 'success'],
                            ['text' => 'No blood sugar impact', 'type' => 'success'],
                            ['text' => 'Supports weight management', 'type' => 'success'],
                            ['text' => 'Sustained energy', 'type' => 'success'],
                            ['text' => 'Tooth-friendly', 'type' => 'success'],
                        ],
                        'is_active' => true
                    ],
                    [
                        'title' => 'Artificial Sweeteners',
                        'type' => 'warning',
                        'points' => [
                            ['text' => 'Chemical compounds', 'type' => 'warning'],
                            ['text' => 'Potential health concerns', 'type' => 'warning'],
                            ['text' => 'Metallic aftertaste', 'type' => 'warning'],
                            ['text' => 'May affect gut health', 'type' => 'warning'],
                            ['text' => 'Synthetic processing', 'type' => 'warning'],
                        ],
                        'is_active' => true
                    ],
                ]
            ],
            'cta' => [], // Comparison is the main end section now, CTA redundant or optional
            'is_active' => true,
        ]);
    }
}
