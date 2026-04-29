<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AttributeSeeder extends Seeder
{
    public function run(): void
    {
        $seedData = [
            [
                'name' => 'format',
                'label' => 'Format',
                'display_type' => 'text_label',
                'filter_type' => 'single_select',
                'values' => ['Powder', 'Drops', 'Tablets', 'Jar']
            ],
            [
                'name' => 'concentration',
                'label' => 'Concentration',
                'display_type' => 'text_label',
                'filter_type' => 'single_select',
                'values' => ['1:10 (High)', '1:50 (Medium)']
            ],
            [
                'name' => 'pack_size',
                'label' => 'Pack Size',
                'display_type' => 'text_label',
                'filter_type' => 'multi_select',
                'values' => ['50g', '100g', '250g']
            ],
            [
                'name' => 'trust_badges',
                'label' => 'Trust Badges',
                'display_type' => 'icon_text',
                'filter_type' => 'not_filtered',
                'values' => ['Keto-Friendly', '100% Organic', 'Diabetic-Safe']
            ]
        ];

        foreach ($seedData as $attr) {
            $attribute = Attribute::firstOrCreate(
                ['name' => $attr['name']],
                [
                    'label' => $attr['label'],
                    'display_type' => $attr['display_type'],
                    'filter_type' => $attr['filter_type'],
                ]
            );

            foreach ($attr['values'] as $index => $valText) {
                AttributeValue::firstOrCreate(
                    [
                        'attribute_id' => $attribute->id,
                        'value_text' => $valText
                    ],
                    [
                        'slug' => Str::slug($valText),
                        'sort_order' => $index
                    ]
                );
            }
        }
    }
}
