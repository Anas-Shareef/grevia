<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class CategoryHierarchySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Natural Sweeteners (Root)
        $root = Category::updateOrCreate(
            ['slug' => 'natural-sweeteners'],
            [
                'name' => 'Natural Sweeteners',
                'description' => 'Premium sugar alternatives for a healthier lifestyle.',
                'status' => true,
                'show_in_filter' => true,
                'order' => 1,
            ]
        );

        // 2. Stevia
        $stevia = Category::updateOrCreate(
            ['slug' => 'stevia'],
            [
                'name' => 'Stevia',
                'parent_id' => $root->id,
                'status' => true,
                'show_in_filter' => true,
                'order' => 1,
            ]
        );

        // 3. Stevia Powder
        $steviaPowder = Category::updateOrCreate(
            ['slug' => 'stevia-powder'],
            [
                'name' => 'Stevia Powder',
                'parent_id' => $stevia->id,
                'status' => true,
                'show_in_filter' => true,
                'order' => 1,
            ]
        );

        // 4. Stevia Powder 1:10
        $steviaPowder10 = Category::updateOrCreate(
            ['slug' => 'stevia-powder-1-10'],
            [
                'name' => 'Stevia Powder 1:10',
                'parent_id' => $steviaPowder->id,
                'status' => true,
                'show_in_filter' => true,
                'order' => 1,
            ]
        );

        // 5. Stevia Powder 1:50
        $steviaPowder50 = Category::updateOrCreate(
            ['slug' => 'stevia-powder-1-50'],
            [
                'name' => 'Stevia Powder 1:50',
                'parent_id' => $steviaPowder->id,
                'status' => true,
                'show_in_filter' => true,
                'order' => 2,
            ]
        );

        // 6. Stevia Drops
        $steviaDrops = Category::updateOrCreate(
            ['slug' => 'stevia-drops'],
            [
                'name' => 'Stevia Drops',
                'parent_id' => $stevia->id,
                'status' => true,
                'show_in_filter' => true,
                'order' => 2,
            ]
        );

        // 7. Stevia Drops 1:10
        $steviaDrops10 = Category::updateOrCreate(
            ['slug' => 'stevia-drops-1-10'],
            [
                'name' => 'Stevia Drops 1:10',
                'parent_id' => $steviaDrops->id,
                'status' => true,
                'show_in_filter' => true,
                'order' => 1,
            ]
        );

        // 8. Monk Fruit Sweetener
        $monkFruit = Category::updateOrCreate(
            ['slug' => 'monk-fruit'],
            [
                'name' => 'Monk Fruit Sweetener',
                'parent_id' => $root->id,
                'status' => true,
                'show_in_filter' => true,
                'order' => 2,
            ]
        );

        // 9. Monk Fruit Powder
        $monkFruitPowder = Category::updateOrCreate(
            ['slug' => 'monk-fruit-powder'],
            [
                'name' => 'Monk Fruit Powder',
                'parent_id' => $monkFruit->id,
                'status' => true,
                'show_in_filter' => true,
                'order' => 1,
            ]
        );

        // 10. Monk Fruit Powder 1:10
        $monkFruitPowder10 = Category::updateOrCreate(
            ['slug' => 'monk-fruit-powder-1-10'],
            [
                'name' => 'Monk Fruit Powder 1:10',
                'parent_id' => $monkFruitPowder->id,
                'status' => true,
                'show_in_filter' => true,
                'order' => 1,
            ]
        );

        // Assign Existing Products
        $products = Product::all();
        foreach ($products as $product) {
            $name = strtolower($product->name);
            
            if (str_contains($name, 'monk fruit') && str_contains($name, '1:10')) {
                $product->update(['category_id' => $monkFruitPowder10->id]);
            } elseif (str_contains($name, 'monk fruit')) {
                 $product->update(['category_id' => $monkFruitPowder->id]);
            } elseif (str_contains($name, 'stevia') && str_contains($name, 'drops')) {
                $product->update(['category_id' => $steviaDrops10->id]);
            } elseif (str_contains($name, 'stevia') && str_contains($name, '1:10')) {
                $product->update(['category_id' => $steviaPowder10->id]);
            } elseif (str_contains($name, 'stevia') && str_contains($name, '1:50')) {
                $product->update(['category_id' => $steviaPowder50->id]);
            } elseif (str_contains($name, 'stevia')) {
                $product->update(['category_id' => $steviaPowder->id]);
            }
        }
    }
}
