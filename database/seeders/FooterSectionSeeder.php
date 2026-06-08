<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FooterSection;

class FooterSectionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. About Us
        FooterSection::create([
            'section_name' => 'About Us',
            'type' => 'text',
            'content' => [
                'text' => 'Experience the pure taste of nature with our premium organic sweeteners. Zero calories, zero guilt, endless flavor.'
            ],
            'is_active' => true,
            'sort_order' => 1,
        ]);

        // 2. Shop Links
        FooterSection::create([
            'section_name' => 'Shop',
            'type' => 'links',
            'content' => [
                'links' => [
                    ['label' => 'All Products', 'url' => '/collections/all'],
                    ['label' => 'Stevia', 'url' => '/collections/stevia'],
                    ['label' => 'Monkfruit', 'url' => '/collections/monk-fruit'],
                    ['label' => 'Bundles', 'url' => '/collections/all'],
                ]
            ],
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // 3. Company Links
        FooterSection::create([
            'section_name' => 'Company',
            'type' => 'links',
            'content' => [
                'links' => [
                    ['label' => 'About Us', 'url' => '/benefits'],
                    ['label' => 'Our Story', 'url' => '/benefits'],
                    ['label' => 'Sustainability', 'url' => '/benefits'],
                    ['label' => 'Press', 'url' => '/contact'],
                ]
            ],
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // 4. Support Links
        FooterSection::create([
            'section_name' => 'Support',
            'type' => 'links',
            'content' => [
                'links' => [
                    ['label' => 'Contact', 'url' => '/contact'],
                    ['label' => 'Privacy Policy', 'url' => '/privacy-policy'],
                    ['label' => 'Terms & Conditions', 'url' => '/terms-conditions'],
                    ['label' => 'Refund Policy', 'url' => '/refund-policy'],
                    ['label' => 'Shipping Policy', 'url' => '/shipping-policy'],
                ]
            ],
            'is_active' => true,
            'sort_order' => 4,
        ]);

        // 5. Social Links
        FooterSection::create([
            'section_name' => 'Social',
            'type' => 'social',
            'content' => [
                'socials' => [
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/grevia'],
                    ['platform' => 'twitter', 'url' => 'https://twitter.com/grevia'],
                    ['platform' => 'facebook', 'url' => 'https://facebook.com/grevia'],
                ]
            ],
            'is_active' => true,
            'sort_order' => 5,
        ]);

        // 6. Copyright (Optional, often hardcoded but good to have)
        FooterSection::create([
            'section_name' => 'Copyright',
            'type' => 'text',
            'content' => [
                'text' => '© 2026 Grevia. All rights reserved.'
            ],
            'is_active' => true,
            'sort_order' => 6,
        ]);
    }
}
