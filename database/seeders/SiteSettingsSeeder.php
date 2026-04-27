<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'shipping_policy',
                'value' => '<p><strong>Free Standard Shipping:</strong> On all orders over ₹499. Orders are usually processed within 24 hours.</p><p><strong>Estimated Delivery:</strong> 3-5 business days depending on your location.</p><p><strong>Returns:</strong> We offer a 7-day return policy for unopened items. Please contact support@grevia.in for assistance.</p>',
                'group' => 'pdp',
                'label' => 'Shipping & Returns Policy (PDP)',
                'type' => 'richtext',
            ],
            [
                'key' => 'verified_customer_threshold',
                'value' => '1',
                'group' => 'reviews',
                'label' => 'Minimum Purchases for Verified Status',
                'type' => 'number',
            ],
            [
                'key' => 'enable_global_guest_reviews',
                'value' => '1',
                'group' => 'reviews',
                'label' => 'Enable Guest Reviews Globally',
                'type' => 'boolean',
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
