<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class CategoryProductMapperSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::all();

        foreach ($products as $product) {
            $catId = null;

            // Simple Mapping Logic based on metadata
            if (str_contains(strtolower($product->name), 'monk')) {
                if (str_contains(strtolower($product->name), '1:10')) {
                    $catId = 10; // Monk Fruit Powder 1:10
                } elseif (str_contains(strtolower($product->name), 'powder')) {
                    $catId = 9; // Monk Fruit Powder
                } else {
                    $catId = 8; // Monk Fruit Sweetener
                }
            } elseif (str_contains(strtolower($product->name), 'stevia')) {
                if (str_contains(strtolower($product->name), '1:10')) {
                    $catId = 4; // Stevia Powder 1:10
                } elseif (str_contains(strtolower($product->name), 'powder')) {
                    $catId = 3; // Stevia Powder
                } else {
                    $catId = 2; // Stevia
                }
            }

            if ($catId) {
                $product->update(['category_id' => $catId]);
            }
        }

        $this->command->info('Products mapped to physical category hierarchy successfully.');
    }
}
