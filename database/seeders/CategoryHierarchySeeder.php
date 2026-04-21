<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

/**
 * CategoryHierarchySeeder
 *
 * Creates the full PRD-specified 5-level category taxonomy:
 *   L1: Natural Sweeteners
 *   L2: Stevia | Monk Fruit Sweetener
 *   L3: Stevia Powder | Stevia Drops | Monk Fruit Powder
 *
 * This seeder is IDEMPOTENT — running it multiple times is safe.
 * It uses updateOrCreate so existing records are not duplicated.
 */
class CategoryHierarchySeeder extends Seeder
{
    public function run(): void
    {
        // ----------------------------------------------------------------
        // L1 — Natural Sweeteners (parent collection)
        // ----------------------------------------------------------------
        $naturalSweeteners = Category::updateOrCreate(
            ['slug' => 'natural-sweeteners'],
            [
                'name'            => 'Natural Sweeteners',
                'description'     => 'Plant-based, zero-calorie sugar alternatives — Stevia, Monk Fruit, and more.',
                'seo_title'       => 'Buy Natural Sweeteners Online | Zero Calorie Sugar Alternatives | Grevia',
                'seo_description' => 'Shop Grevia\'s range of natural sweeteners — pure Stevia and Monk Fruit powders and drops. Zero glycemic index, 100% plant-based.',
                'parent_id'       => null,
                'status'          => true,
                'show_in_filter'  => true,
                'order'           => 1,
                'is_smart'        => false,
            ]
        );

        // ----------------------------------------------------------------
        // L2 — Stevia (child of Natural Sweeteners)
        // ----------------------------------------------------------------
        $stevia = Category::updateOrCreate(
            ['slug' => 'stevia'],
            [
                'name'            => 'Stevia',
                'description'     => 'Pure Stevia extract — 200-300x sweeter than sugar, zero calories, perfect for micro-dosing.',
                'seo_title'       => 'Buy Stevia Sweetener Online | Pure Stevia Powder & Drops | Grevia',
                'seo_description' => 'Shop Grevia\'s pure Stevia sweeteners. Available as fine powder and concentrated drops. No glycemic impact.',
                'parent_id'       => $naturalSweeteners->id,
                'status'          => true,
                'show_in_filter'  => true,
                'order'           => 1,
                'is_smart'        => true,
                'rules'           => [
                    ['field' => 'type', 'operator' => 'equals', 'value' => 'stevia'],
                ],
            ]
        );

        // ----------------------------------------------------------------
        // L2 — Monk Fruit Sweetener (child of Natural Sweeteners)
        // ----------------------------------------------------------------
        $monkFruit = Category::updateOrCreate(
            ['slug' => 'monk-fruit'],
            [
                'name'            => 'Monk Fruit Sweetener',
                'description'     => 'Premium Monk Fruit extract — smooth taste, often blended 1:1 with Erythritol for baking.',
                'seo_title'       => 'Buy Monk Fruit Sweetener Online | Grevia Natural Sweeteners',
                'seo_description' => 'Shop Grevia\'s Monk Fruit sweeteners — ideal for baking, cooking, and heavy use. Zero glycemic index.',
                'parent_id'       => $naturalSweeteners->id,
                'status'          => true,
                'show_in_filter'  => true,
                'order'           => 2,
                'is_smart'        => true,
                'rules'           => [
                    ['field' => 'type', 'operator' => 'equals', 'value' => 'monk-fruit'],
                ],
            ]
        );

        // ----------------------------------------------------------------
        // L3 — Stevia Powder (child of Stevia)
        // ----------------------------------------------------------------
        Category::updateOrCreate(
            ['slug' => 'stevia-powder'],
            [
                'name'            => 'Stevia Powder',
                'description'     => 'Fine Stevia powder for beverages, baking, and everyday sweetening.',
                'seo_title'       => 'Buy Stevia Powder Online | 1:10 & 1:50 Ratio | Grevia',
                'seo_description' => 'Shop Grevia Stevia Powder in 1:10 and 1:50 concentration ratios. Available in 50g and 100g packs.',
                'parent_id'       => $stevia->id,
                'status'          => true,
                'show_in_filter'  => true,
                'order'           => 1,
                'is_smart'        => true,
                'rules'           => [
                    ['field' => 'type', 'operator' => 'equals', 'value' => 'stevia'],
                    ['field' => 'form', 'operator' => 'equals', 'value' => 'powder'],
                ],
            ]
        );

        // ----------------------------------------------------------------
        // L3 — Stevia Drops (child of Stevia)
        // ----------------------------------------------------------------
        Category::updateOrCreate(
            ['slug' => 'stevia-drops'],
            [
                'name'            => 'Stevia Drops',
                'description'     => 'Concentrated liquid Stevia — one drop sweetens an entire cup.',
                'seo_title'       => 'Buy Stevia Drops Online | Liquid Stevia Sweetener | Grevia',
                'seo_description' => 'Shop Grevia Stevia Drops. Highly concentrated liquid form — perfect for beverages, coffee, and tea.',
                'parent_id'       => $stevia->id,
                'status'          => true,
                'show_in_filter'  => true,
                'order'           => 2,
                'is_smart'        => true,
                'rules'           => [
                    ['field' => 'type', 'operator' => 'equals', 'value' => 'stevia'],
                    ['field' => 'form', 'operator' => 'equals', 'value' => 'drops'],
                ],
            ]
        );

        // ----------------------------------------------------------------
        // L3 — Monk Fruit Powder (child of Monk Fruit)
        // ----------------------------------------------------------------
        Category::updateOrCreate(
            ['slug' => 'monk-fruit-powder'],
            [
                'name'            => 'Monk Fruit Powder',
                'description'     => 'Premium Monk Fruit powder — measures like sugar, ideal for baking.',
                'seo_title'       => 'Buy Monk Fruit Powder Online | Pure Monk Fruit Sweetener | Grevia',
                'seo_description' => 'Shop Grevia Monk Fruit Powder. Zero calories, perfect 1:1 sugar replacement, no aftertaste.',
                'parent_id'       => $monkFruit->id,
                'status'          => true,
                'show_in_filter'  => true,
                'order'           => 1,
                'is_smart'        => true,
                'rules'           => [
                    ['field' => 'type', 'operator' => 'equals', 'value' => 'monk-fruit'],
                    ['field' => 'form', 'operator' => 'equals', 'value' => 'powder'],
                ],
            ]
        );

        $this->command->info('✅ Category hierarchy seeded successfully:');
        $this->command->info('   Natural Sweeteners');
        $this->command->info('   ├── Stevia');
        $this->command->info('   │   ├── Stevia Powder');
        $this->command->info('   │   └── Stevia Drops');
        $this->command->info('   └── Monk Fruit Sweetener');
        $this->command->info('       └── Monk Fruit Powder');
    }
}
