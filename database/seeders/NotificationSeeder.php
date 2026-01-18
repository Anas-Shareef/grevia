<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $recipients = User::all();

        if ($recipients->isEmpty()) {
            return;
        }

        // 1. Order Pending
        Notification::make()
            ->title('Order Pending')
            ->body('Order #ORD-2024-001 has been placed by the customer.')
            ->icon('heroicon-o-shopping-bag')
            ->warning()
            ->actions([
                \Filament\Actions\Action::make('view')
                    ->button()
                    ->url('/admin/orders'),
            ])
            ->sendToDatabase($recipients);

        // 2. New Customer
        Notification::make()
            ->title('New Customer Registered')
            ->body('John Doe has created a new account.')
            ->icon('heroicon-o-user-plus')
            ->info()
            ->sendToDatabase($recipients);

        // 3. System Alert
        Notification::make()
            ->title('System Alert')
            ->body('Monthly backup completed successfully.')
            ->icon('heroicon-o-cpu-chip')
            ->success()
            ->sendToDatabase($recipients);

        // 4. Out of Stock
        Notification::make()
            ->title('Out of Stock')
            ->body('Product "Wireless Headphones" is now out of stock.')
            ->icon('heroicon-o-archive-box-x-mark')
            ->danger()
            ->sendToDatabase($recipients);
    }
}
