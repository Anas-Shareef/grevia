<?php

namespace Database\Seeders;

use App\Models\EmailCampaign;
use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailCampaignSeeder extends Seeder
{
    public function run(): void
    {
        $campaigns = [
            [
                'title' => 'New Arrivals Are Here 🎉',
                'subject' => 'Fresh styles just dropped – don\'t miss out!',
                'template_slug' => 'new-arrivals',
                'target_segment' => 'newsletter_subscribers',
                'status' => 'draft',
            ],
            [
                'title' => 'Your First Purchase Awaits 💳',
                'subject' => 'Enjoy 10% off your first order',
                'template_slug' => 'first-purchase',
                'target_segment' => 'registered_users',
                'status' => 'draft',
            ],
            [
                'title' => 'Thanks for Your Order ❤️',
                'subject' => 'How was your experience with Grevia?',
                'template_slug' => 'customer-feedback',
                'target_segment' => 'customers',
                'status' => 'draft',
            ],
            [
                'title' => 'Big Sale is Live 🔥',
                'subject' => 'Our biggest sale of the season starts now!',
                'template_slug' => 'big-sale',
                'target_segment' => 'all_consented',
                'status' => 'draft',
            ],
            [
                'title' => 'VIP Early Access 💎',
                'subject' => 'Exclusive early access just for you',
                'template_slug' => 'vip-access',
                'target_segment' => 'vip_customers',
                'status' => 'draft',
            ],
            [
                'title' => 'We Miss You 😴',
                'subject' => 'It\'s been a while – here\'s something special',
                'template_slug' => 'we-miss-you',
                'target_segment' => 'inactive_users',
                'status' => 'draft',
            ],
        ];

        foreach ($campaigns as $campaignData) {
            $template = EmailTemplate::where('slug', $campaignData['template_slug'])->first();
            
            if ($template) {
                EmailCampaign::updateOrCreate(
                    ['title' => $campaignData['title']],
                    [
                        'subject' => $campaignData['subject'],
                        'email_template_id' => $template->id,
                        'html_content' => $template->html_content,
                        'target_segment' => $campaignData['target_segment'],
                        'status' => $campaignData['status'],
                        'sent_count' => 0,
                        'failed_count' => 0,
                        'total_recipients' => 0,
                    ]
                );
            }
        }

        $this->command->info('✅ Created 6 demo email campaigns');
    }
}
