<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Order;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DemoMarketingUsersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Newsletter Subscribers (5 users)
        $newsletterEmails = [
            'newsletter1@example.com',
            'newsletter2@example.com',
            'newsletter3@example.com',
            'newsletter4@example.com',
            'newsletter5@example.com',
        ];

        foreach ($newsletterEmails as $email) {
            DB::table('subscribers')->updateOrInsert(
                ['email' => $email],
                [
                    'status' => 'subscribed',
                    'unsubscribed_at' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
        $this->command->info('✅ Created 5 newsletter subscribers');

        // 2. Registered Users (no orders) - 5 users
        for ($i = 1; $i <= 5; $i++) {
            User::updateOrCreate(
                ['email' => "registered{$i}@example.com"],
                [
                    'name' => "Registered User {$i}",
                    'password' => Hash::make('password'),
                    'marketing_consent' => true,
                    'unsubscribed_at' => null,
                ]
            );
        }
        $this->command->info('✅ Created 5 registered users (no orders)');

        // 3. Customers (1-2 orders each) - 10 users
        for ($i = 1; $i <= 10; $i++) {
            $user = User::updateOrCreate(
                ['email' => "customer{$i}@example.com"],
                [
                    'name' => "Customer {$i}",
                    'password' => Hash::make('password'),
                    'marketing_consent' => true,
                    'unsubscribed_at' => null,
                ]
            );

            // Create 1-2 orders for each customer
            $orderCount = rand(1, 2);
            for ($j = 0; $j < $orderCount; $j++) {
                Order::create([
                    'user_id' => $user->id,
                    'customer_order_number' => 'ORD-' . str_pad($i * 100 + $j, 6, '0', STR_PAD_LEFT),
                    'status' => 'completed',
                    'total' => rand(50, 200),
                    'subtotal' => rand(40, 180),
                    'tax' => 0,
                    'shipping_cost' => 10,
                    'created_at' => now()->subDays(rand(1, 20)),
                    'updated_at' => now()->subDays(rand(1, 20)),
                ]);
            }
        }
        $this->command->info('✅ Created 10 customers with 1-2 orders each');

        // 4. VIP Customers (3+ orders) - 3 users
        for ($i = 1; $i <= 3; $i++) {
            $user = User::updateOrCreate(
                ['email' => "vip{$i}@example.com"],
                [
                    'name' => "VIP Customer {$i}",
                    'password' => Hash::make('password'),
                    'marketing_consent' => true,
                    'unsubscribed_at' => null,
                ]
            );

            // Create 3-5 orders for VIP customers
            $orderCount = rand(3, 5);
            for ($j = 0; $j < $orderCount; $j++) {
                Order::create([
                    'user_id' => $user->id,
                    'customer_order_number' => 'VIP-' . str_pad($i * 100 + $j, 6, '0', STR_PAD_LEFT),
                    'status' => 'completed',
                    'total' => rand(100, 500),
                    'subtotal' => rand(90, 480),
                    'tax' => 0,
                    'shipping_cost' => 10,
                    'created_at' => now()->subDays(rand(1, 60)),
                    'updated_at' => now()->subDays(rand(1, 60)),
                ]);
            }
        }
        $this->command->info('✅ Created 3 VIP customers with 3+ orders each');

        // 5. Inactive Users (last order 30+ days ago) - 5 users
        for ($i = 1; $i <= 5; $i++) {
            $user = User::updateOrCreate(
                ['email' => "inactive{$i}@example.com"],
                [
                    'name' => "Inactive User {$i}",
                    'password' => Hash::make('password'),
                    'marketing_consent' => true,
                    'unsubscribed_at' => null,
                ]
            );

            // Create old orders (30-90 days ago)
            Order::create([
                'user_id' => $user->id,
                'customer_order_number' => 'OLD-' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'status' => 'completed',
                'total' => rand(50, 150),
                'subtotal' => rand(40, 140),
                'tax' => 0,
                'shipping_cost' => 10,
                'created_at' => now()->subDays(rand(30, 90)),
                'updated_at' => now()->subDays(rand(30, 90)),
            ]);
        }
        $this->command->info('✅ Created 5 inactive users with orders 30+ days old');

        $this->command->info('');
        $this->command->info('📊 Demo Marketing Users Summary:');
        $this->command->info('   - 5 Newsletter Subscribers');
        $this->command->info('   - 5 Registered Users (no orders)');
        $this->command->info('   - 10 Customers (1-2 orders)');
        $this->command->info('   - 3 VIP Customers (3+ orders)');
        $this->command->info('   - 5 Inactive Users (30+ days)');
        $this->command->info('   Total: 28 demo users for marketing');
    }
}
