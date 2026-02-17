<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'New Arrivals Newsletter',
                'slug' => 'new-arrivals',
                'subject' => 'Fresh styles just dropped – don\'t miss out! 🎉',
                'html_content' => view('emails.campaigns.new-arrivals', [
                    'customer_name' => '{{customer_name}}',
                    'shop_url' => '{{shop_url}}',
                    'unsubscribeUrl' => '{{unsubscribe_url}}',
                ])->render(),
                'demo_variables' => [
                    'customer_name' => 'John Doe',
                    'shop_url' => config('app.url') . '/products',
                    'unsubscribe_url' => config('app.url') . '/unsubscribe/demo-token',
                ],
                'status' => true,
            ],
            [
                'name' => 'First Purchase Discount',
                'slug' => 'first-purchase',
                'subject' => 'Enjoy 10% off your first order 💳',
                'html_content' => view('emails.campaigns.first-purchase', [
                    'customer_name' => '{{customer_name}}',
                    'shop_url' => '{{shop_url}}',
                    'unsubscribeUrl' => '{{unsubscribe_url}}',
                ])->render(),
                'demo_variables' => [
                    'customer_name' => 'Jane Smith',
                    'shop_url' => config('app.url') . '/products',
                    'unsubscribe_url' => config('app.url') . '/unsubscribe/demo-token',
                ],
                'status' => true,
            ],
            [
                'name' => 'Customer Feedback Request',
                'slug' => 'customer-feedback',
                'subject' => 'How was your experience with Grevia? ❤️',
                'html_content' => view('emails.campaigns.customer-feedback', [
                    'customer_name' => '{{customer_name}}',
                    'review_url' => '{{review_url}}',
                    'recommendations_url' => '{{recommendations_url}}',
                    'unsubscribeUrl' => '{{unsubscribe_url}}',
                ])->render(),
                'demo_variables' => [
                    'customer_name' => 'Mike Johnson',
                    'review_url' => config('app.url') . '/account/orders',
                    'recommendations_url' => config('app.url') . '/products',
                    'unsubscribe_url' => config('app.url') . '/unsubscribe/demo-token',
                ],
                'status' => true,
            ],
            [
                'name' => 'Big Sale Announcement',
                'slug' => 'big-sale',
                'subject' => 'Our biggest sale of the season starts now! 🔥',
                'html_content' => view('emails.campaigns.big-sale', [
                    'customer_name' => '{{customer_name}}',
                    'sale_url' => '{{sale_url}}',
                    'unsubscribeUrl' => '{{unsubscribe_url}}',
                ])->render(),
                'demo_variables' => [
                    'customer_name' => 'Sarah Williams',
                    'sale_url' => config('app.url') . '/products',
                    'unsubscribe_url' => config('app.url') . '/unsubscribe/demo-token',
                ],
                'status' => true,
            ],
            [
                'name' => 'VIP Early Access',
                'slug' => 'vip-access',
                'subject' => 'Exclusive early access just for you 💎',
                'html_content' => view('emails.campaigns.vip-access', [
                    'customer_name' => '{{customer_name}}',
                    'vip_url' => '{{vip_url}}',
                    'unsubscribeUrl' => '{{unsubscribe_url}}',
                ])->render(),
                'demo_variables' => [
                    'customer_name' => 'David Brown',
                    'vip_url' => config('app.url') . '/products',
                    'unsubscribe_url' => config('app.url') . '/unsubscribe/demo-token',
                ],
                'status' => true,
            ],
            [
                'name' => 'We Miss You - Re-engagement',
                'slug' => 'we-miss-you',
                'subject' => 'It\'s been a while – here\'s something special 😴',
                'html_content' => view('emails.campaigns.we-miss-you', [
                    'customer_name' => '{{customer_name}}',
                    'shop_url' => '{{shop_url}}',
                    'unsubscribeUrl' => '{{unsubscribe_url}}',
                ])->render(),
                'demo_variables' => [
                    'customer_name' => 'Emily Davis',
                    'shop_url' => config('app.url') . '/products',
                    'unsubscribe_url' => config('app.url') . '/unsubscribe/demo-token',
                ],
                'status' => true,
            ],
        ];

        foreach ($templates as $template) {
            EmailTemplate::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }

        $this->command->info('✅ Created 6 email templates');
    }
}
