<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class MassTaggingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tagging Protocol Implementation
        $products = Product::all();

        foreach ($products as $product) {
            $tags = is_array($product->tags) ? $product->tags : [];
            
            // Cat_Sweetener
            if (!in_array('Cat_Sweetener', $tags)) {
                $tags[] = 'Cat_Sweetener';
            }

            // Sub_Stevia / Sub_Monkfruit
            if ($product->type === 'stevia' && !in_array('Sub_Stevia', $tags)) {
                $tags[] = 'Sub_Stevia';
            } elseif ($product->type === 'monk-fruit' && !in_array('Sub_Monkfruit', $tags)) {
                $tags[] = 'Sub_Monkfruit';
            }

            // Form_Powder / Form_Drops / Form_Tablets
            if ($product->form === 'powder' && !in_array('Form_Powder', $tags)) {
                $tags[] = 'Form_Powder';
            } elseif ($product->form === 'drops' && !in_array('Form_Drops', $tags)) {
                $tags[] = 'Form_Drops';
            } elseif ($product->form === 'tablets' && !in_array('Form_Tablets', $tags)) {
                $tags[] = 'Form_Tablets';
            }

            // Ratio_1-10 / Ratio_1-50 / Ratio_1-100
            if ($product->ratio) {
                $ratioTag = 'Ratio_' . str_replace(':', '-', $product->ratio);
                if (!in_array($ratioTag, $tags)) {
                    $tags[] = $ratioTag;
                }
            }

            // Weight/Size Tags (e.g. Size_50g)
            if ($product->size_label) {
                // Extract number and unit if possible, or just use as is
                $cleanSize = str_replace(' ', '', $product->size_label);
                $sizeTag = 'Size_' . $cleanSize;
                if (!in_array($sizeTag, $tags)) {
                    $tags[] = $sizeTag;
                }
            }

            // Badges to Tags (Keto-Friendly, 100% Organic)
            if (stripos($product->description, 'keto') !== false || stripos($product->name, 'keto') !== false) {
                if (!in_array('Keto-Friendly', $tags)) $tags[] = 'Keto-Friendly';
            }
            if (stripos($product->description, 'organic') !== false || stripos($product->name, 'organic') !== false) {
                if (!in_array('100% Organic', $tags)) $tags[] = '100% Organic';
            }

            $product->tags = array_values(array_unique($tags));
            $product->save();
        }

        // 2. Convert Existing Categories to Smart Collections
        $steviaCategory = Category::where('slug', 'stevia-products')->first();
        if ($steviaCategory) {
            $steviaCategory->update([
                'is_smart' => true,
                'rules' => [
                    ['field' => 'tags', 'operator' => 'contains', 'value' => 'Sub_Stevia']
                ]
            ]);
        }

        $monkFruitCategory = Category::where('slug', 'monk-fruit-products')->first();
        if ($monkFruitCategory) {
            $monkFruitCategory->update([
                'is_smart' => true,
                'rules' => [
                    ['field' => 'tags', 'operator' => 'contains', 'value' => 'Sub_Monkfruit']
                ]
            ]);
        }

        $this->command->info('Mass tagging completed and smart collections updated.');
    }
}
