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
            
            // 4. Region
            $tags[] = 'Region_IN';

            // 5. Special Badges/Categories
            if ($product->is_featured) $tags[] = 'BestSeller';
            if ($product->created_at > now()->subMonths(2)) $tags[] = 'NewArrival';

            $product->tags = array_values(array_unique($tags));
            $product->save();
        }

        // Updating Smart Collections to follow the new rules
        $steviaCat = Category::where('slug', 'stevia-products')->first();
        if ($steviaCat) {
            $steviaCat->update([
                'is_smart' => true,
                'rules' => [
                    ['field' => 'tags', 'operator' => 'contains', 'value' => 'Base_Stevia'],
                    ['field' => 'tags', 'operator' => 'exclude', 'value' => 'Base_Monkfruit']
                ]
            ]);
        }

        $monkCat = Category::where('slug', 'monk-fruit-products')->first();
        if ($monkCat) {
            $monkCat->update([
                'is_smart' => true,
                'rules' => [
                    ['field' => 'tags', 'operator' => 'contains', 'value' => 'Base_Monkfruit'],
                    ['field' => 'tags', 'operator' => 'exclude', 'value' => 'Base_Stevia']
                ]
            ]);
        }

        $this->command->info('Mass tagging completed and smart collections updated.');
    }
}
