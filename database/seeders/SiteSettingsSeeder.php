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
            [
                'key' => 'cta_badge_text',
                'value' => 'Limited Time Offer',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Badge Text',
                'type' => 'text',
            ],
            [
                'key' => 'cta_heading',
                'value' => "Ready to Make\nthe Sweet Switch?",
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Heading',
                'type' => 'textarea',
            ],
            [
                'key' => 'cta_description',
                'value' => "Join thousands who've already discovered the pure taste of nature. Get 20% off your first order with code SWEEVAL20",
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Description',
                'type' => 'textarea',
            ],
            [
                'key' => 'cta_primary_btn_text',
                'value' => 'Shop Now & Save 20%',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Primary Button Text',
                'type' => 'text',
            ],
            [
                'key' => 'cta_primary_btn_url',
                'value' => '/collections/all',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Primary Button URL',
                'type' => 'text',
            ],
            [
                'key' => 'cta_secondary_btn_text',
                'value' => 'Learn More',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Secondary Button Text',
                'type' => 'text',
            ],
            [
                'key' => 'cta_secondary_btn_url',
                'value' => '/benefits',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Secondary Button URL',
                'type' => 'text',
            ],
            [
                'key' => 'cta_stat1_value',
                'value' => '50K+',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Stat 1 Value',
                'type' => 'text',
            ],
            [
                'key' => 'cta_stat1_label',
                'value' => 'Happy Customers',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Stat 1 Label',
                'type' => 'text',
            ],
            [
                'key' => 'cta_stat2_value',
                'value' => '4.9★',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Stat 2 Value',
                'type' => 'text',
            ],
            [
                'key' => 'cta_stat2_label',
                'value' => 'Average Rating',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Stat 2 Label',
                'type' => 'text',
            ],
            [
                'key' => 'cta_stat3_value',
                'value' => '100%',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Stat 3 Value',
                'type' => 'text',
            ],
            [
                'key' => 'cta_stat3_label',
                'value' => 'Natural Ingredients',
                'group' => 'homepage_cta',
                'label' => 'Homepage CTA Stat 3 Label',
                'type' => 'text',
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
