<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class AdvancedArchitectureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Category Tree
        $main = Category::updateOrCreate(['slug' => 'natural-sweeteners'], [
            'name' => 'Natural Sweeteners (Sugar Alternatives)',
            'description' => 'Zero-calorie, plant-based alternatives to sugar. Sweetness without sacrifice.',
            'status' => true,
        ]);

        $stevia = Category::updateOrCreate(['slug' => 'stevia'], [
            'name' => 'Stevia',
            'parent_id' => $main->id,
            'description' => 'Pure stevia extracts for pure sweetness.',
            'status' => true,
        ]);

        $monk = Category::updateOrCreate(['slug' => 'monk-fruit'], [
            'name' => 'Monk Fruit Sweetener',
            'parent_id' => $main->id,
            'description' => 'The ancient secret to modern health.',
            'status' => true,
        ]);

        // Stevia Sub-categories
        $steviaPowder = Category::updateOrCreate(['slug' => 'stevia-powder'], [
            'name' => 'Stevia Powder',
            'parent_id' => $stevia->id,
            'status' => true,
        ]);

        $steviaDrops = Category::updateOrCreate(['slug' => 'stevia-drops'], [
            'name' => 'Stevia Drops',
            'parent_id' => $stevia->id,
            'status' => true,
        ]);

        // Stevia Powder Ratios
        $sp10 = Category::updateOrCreate(['slug' => 'stevia-powder-1-10'], [
            'name' => 'Stevia Powder 1:10',
            'parent_id' => $steviaPowder->id,
            'status' => true,
        ]);

        $sp50 = Category::updateOrCreate(['slug' => 'stevia-powder-1-50'], [
            'name' => 'Stevia Powder 1:50',
            'parent_id' => $steviaPowder->id,
            'status' => true,
        ]);

        // Stevia Drops Ratio
        $sd10 = Category::updateOrCreate(['slug' => 'stevia-drops-1-10'], [
            'name' => 'Stevia Drops 1:10',
            'parent_id' => $steviaDrops->id,
            'status' => true,
        ]);

        // Monk Fruit Sub-categories
        $monkPowder = Category::updateOrCreate(['slug' => 'monk-fruit-powder'], [
            'name' => 'Monk Fruit Powder',
            'parent_id' => $monk->id,
            'status' => true,
        ]);

        $mp10 = Category::updateOrCreate(['slug' => 'monk-fruit-powder-1-10'], [
            'name' => 'Monk Fruit Powder 1:10',
            'parent_id' => $monkPowder->id,
            'status' => true,
        ]);

        // 2. Map Products to Categories and Attributes
        $products = [
            // Stevia Powder 1:10
            [
                'name' => 'Stevia Powder 1:10 (50g)',
                'slug' => 'stevia-powder-1-10-50g',
                'category_id' => $sp10->id,
                'type' => 'stevia',
                'form' => 'powder',
                'ratio' => '1:10',
                'size_label' => '50g',
                'price' => 299,
                'sweetness_description' => '1g replaces 10g of sugar',
                'use_case' => 'Tea, Coffee, Smoothies',
            ],
            [
                'name' => 'Stevia Powder 1:10 (100g)',
                'slug' => 'stevia-powder-1-10-100g',
                'category_id' => $sp10->id,
                'type' => 'stevia',
                'form' => 'powder',
                'ratio' => '1:10',
                'size_label' => '100g',
                'price' => 499,
                'sweetness_description' => '1g replaces 10g of sugar',
                'use_case' => 'Tea, Coffee, Smoothies',
            ],
            // Stevia Powder 1:50
            [
                'name' => 'Stevia Powder 1:50 (50g)',
                'slug' => 'stevia-powder-1-50-50g',
                'category_id' => $sp50->id,
                'type' => 'stevia',
                'form' => 'powder',
                'ratio' => '1:50',
                'size_label' => '50g',
                'price' => 599,
                'sweetness_description' => '1g replaces 50g of sugar',
                'use_case' => 'Baking, Heavy Cooking',
            ],
            [
                'name' => 'Stevia Powder 1:50 (100g)',
                'slug' => 'stevia-powder-1-50-100g',
                'category_id' => $sp50->id,
                'type' => 'stevia',
                'form' => 'powder',
                'ratio' => '1:50',
                'size_label' => '100g',
                'price' => 999,
                'sweetness_description' => '1g replaces 50g of sugar',
                'use_case' => 'Baking, Heavy Cooking',
            ],
            // Stevia Drops 1:10
            [
                'name' => 'Stevia Drops 1:10 (50g)',
                'slug' => 'stevia-drops-1-10-50g',
                'category_id' => $sd10->id,
                'type' => 'stevia',
                'form' => 'drops',
                'ratio' => '1:10',
                'size_label' => '50g',
                'price' => 349,
                'sweetness_description' => '1g replaces 10g of sugar',
                'use_case' => 'Cold Beverages, Salads',
            ],
            // Monk Fruit Powder 1:10
            [
                'name' => 'Monk Fruit Powder 1:10 (50g)',
                'slug' => 'monk-fruit-powder-1-10-50g',
                'category_id' => $mp10->id,
                'type' => 'monk-fruit',
                'form' => 'powder',
                'ratio' => '1:10',
                'size_label' => '50g',
                'price' => 399,
                'sweetness_description' => '1g replaces 10g of sugar',
                'use_case' => 'Lattes, Desserts',
            ],
        ];

        foreach ($products as $pData) {
            Product::updateOrCreate(['slug' => $pData['slug']], array_merge($pData, [
                'description' => $pData['sweetness_description'] . '. Ideal for ' . $pData['use_case'] . '.',
                'long_description' => 'Experience premium sweetness. ' . $pData['sweetness_description'] . '. Use case: ' . $pData['use_case'],
                'in_stock' => true,
            ]));
        }
    }
}
